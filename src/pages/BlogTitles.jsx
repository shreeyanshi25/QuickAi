import React, { useState, useMemo } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const BlogTitles = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tone, setTone] = useState("Neutral");
  const [count, setCount] = useState(5);

  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const visibleResults = useMemo(() => {
    const baseList = showOnlyFavorites
      ? results.filter((t) => favorites.includes(t))
      : results;

    return baseList.slice(0, count);
  }, [results, favorites, showOnlyFavorites, count]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      setError("Please enter a keyword or topic first.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied("");
    setShowOnlyFavorites(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blog-titles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          category,
          tone,
          count, // backend ignores this for now, but ready for future AI
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      // If backend returns more, we still control how many we show with `count`
      setResults(data.titles || []);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while generating titles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (title) => {
    if (!title) return;
    navigator.clipboard.writeText(title);
    setCopied(title);
    setTimeout(() => setCopied(""), 1500);
  };

  const handleCopyAll = () => {
    const list = visibleResults;
    if (!list.length) return;
    navigator.clipboard.writeText(list.join("\n"));
    setCopied("__all__");
    setTimeout(() => setCopied(""), 1500);
  };

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleClear = () => {
    setResults([]);
    setFavorites([]);
    setCopied("");
    setError("");
  };

  const totalCount = results.length;
  const visibleCount = visibleResults.length;
  const favCount = favorites.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-1">
          Blog Title Generator
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter a topic and category and let AI suggest catchy, click-worthy
          blog titles. You can tweak tone, amount, mark favourites, and copy
          them for your next article.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Keyword */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Keyword / Topic
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. AI tools for students"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              {keyword.length}/120 characters
            </p>
          </div>

          {/* Category + Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Technology</option>
                <option>Marketing</option>
                <option>Education</option>
                <option>Health</option>
                <option>Finance</option>
                <option>General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Tone (for future AI)
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Neutral</option>
                <option>Professional</option>
                <option>Friendly</option>
                <option>Bold</option>
                <option>Click-baity</option>
              </select>
            </div>
          </div>

          {/* Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium">Number of titles to show</span>
              <span>
                {visibleCount}/{Math.max(count, visibleCount)} displayed
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>3</span>
              <span>5</span>
              <span>8</span>
              <span>10</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full sm:w-auto bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate titles"}
          </button>

          {error && (
            <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </form>

        <p className="mt-4 text-[11px] text-gray-400">
          Tip: use specific keywords like &quot;AI tools for YouTube&quot; or
          &quot;budget travel hacks&quot; for more focused suggestions.
        </p>
      </div>

      {/* Right: Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h2 className="text-sm font-semibold text-slate-800">
            Generated titles
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="px-2 py-1 rounded-full bg-gray-50 border border-gray-100">
              Total: {totalCount}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-50 border border-gray-100">
              Favourites: {favCount}
            </span>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={!visibleResults.length}
            className="text-[11px] px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {copied === "__all__" ? "Copied all!" : "Copy all"}
          </button>

          <button
            type="button"
            onClick={() => setShowOnlyFavorites((prev) => !prev)}
            disabled={!favorites.length}
            className={`text-[11px] px-3 py-1.5 rounded-md border ${
              showOnlyFavorites
                ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50`}
          >
            {showOnlyFavorites ? "Show all" : "Show favourites only"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!results.length}
            className="text-[11px] ml-auto px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {/* Content */}
        {loading ? (
          // Skeleton state
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-gray-100 rounded-xl px-3 py-3"
              >
                <div className="h-3 bg-gray-100 rounded w-11/12 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-8/12" />
              </div>
            ))}
          </div>
        ) : !visibleResults.length ? (
          <p className="text-sm text-gray-500">
            No titles yet. Fill the form and click{" "}
            <span className="font-medium">Generate titles</span> to see
            suggestions here.
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {visibleResults.map((title, idx) => {
              const isFav = favorites.includes(title);
              const isCopied = copied === title;

              return (
                <div
                  key={`${idx}-${title}`}
                  className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl px-3 py-2 hover:border-indigo-100"
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">
                      #{idx + 1 + (showOnlyFavorites ? 0 : 0)}
                    </p>
                    <p className="text-sm text-gray-700">{title}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(title)}
                      className="text-[11px] text-indigo-600 font-medium hover:underline"
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(title)}
                      className={`text-[11px] ${
                        isFav ? "text-amber-500" : "text-gray-400"
                      }`}
                    >
                      {isFav ? "★ Fav" : "☆ Fav"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
