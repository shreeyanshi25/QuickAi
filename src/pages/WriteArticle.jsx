import React, { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WriteArticle = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Neutral");
  const [length, setLength] = useState("Medium");
  const [includeOutline, setIncludeOutline] = useState(true);

  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // simple local demo generator (used as fallback if backend fails)
  const buildDemoArticle = () => {
    const base = topic.trim();
    const toneText =
      tone === "Friendly"
        ? "in a friendly and accessible style"
        : tone === "Professional"
        ? "with a clear and professional tone"
        : tone === "Persuasive"
        ? "with a persuasive and engaging voice"
        : tone === "Technical"
        ? "with a technical, detailed focus"
        : "with a neutral, informative tone";

    const lengthText =
      length === "Short"
        ? "around 400–600 words"
        : length === "Medium"
        ? "around 800–1000 words"
        : "in a detailed format (~1500 words).";

    let content = `# ${base}\n\n`;
    if (includeOutline) {
      content +=
        "## Outline\n" +
        "1. Introduction\n" +
        "2. Key points and explanation\n" +
        "3. Practical examples or use cases\n" +
        "4. Common mistakes or misconceptions\n" +
        "5. Conclusion and next steps\n\n";
    }

    content += `## Introduction\n`;
    content += `This article explores **${base}** ${toneText}. It is written ${lengthText}\n\n`;

    content += `## Main Content\n`;
    content += `- Explain what ${base} is and why it matters.\n`;
    content += `- Highlight the most important concepts in simple language.\n`;
    content += `- Add real-world examples to make the topic easier to understand.\n`;
    content += `- Provide tips, best practices, or steps the reader can follow.\n\n`;

    content += `## Conclusion\n`;
    content += `Summarize the key ideas and suggest what the reader can do next, such as applying the concepts, exploring tools, or continuing their learning journey.\n`;

    return content;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    setError("");
    setLoading(true);
    setCopied(false);
    setArticle("");

    try {
      // Try backend first
      const res = await fetch(`${API_BASE_URL}/api/write-article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
          length,
          includeOutline,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      // Expecting: { article: "...." }
      if (data && data.article) {
        setArticle(data.article);
      } else {
        // If backend responds but without article, fallback to demo
        setArticle(buildDemoArticle());
        setError(
          "Backend did not return an article. Showing a demo draft instead."
        );
      }
    } catch (err) {
      console.error(err);
      // Fallback to local demo generator
      setArticle(buildDemoArticle());
      setError(
        "Could not reach the article API. This is a demo article generated locally."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!article) return;
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setArticle("");
    setTopic("");
    setCopied(false);
    setError("");
  };

  const wordCount = article
    ? article
        .split(/\s+/)
        .filter((w) => w.trim().length > 0).length
    : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left: Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-1">
          AI Article Writer
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Describe your topic and let AI draft a structured article. You can
          adjust tone, length, and whether to include an outline.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Topic */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Article topic
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px] resize-none"
              placeholder="e.g. How AI is transforming content creation for small businesses"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              {topic.length}/300 characters
            </p>
          </div>

          {/* Tone + Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tone</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Neutral</option>
                <option>Friendly</option>
                <option>Professional</option>
                <option>Persuasive</option>
                <option>Technical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Length
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <input
              id="include-outline"
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={includeOutline}
              onChange={(e) => setIncludeOutline(e.target.checked)}
            />
            <label htmlFor="include-outline" className="select-none">
              Include outline section
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate article"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!article && !topic}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <p className="mt-4 text-[11px] text-gray-400">
            Pro tip: add your target audience and goal. Example: &quot;Explain
            large language models to non-technical founders and convince them to
            try AI tools.&quot;
          </p>
        </form>
      </div>

      {/* Right: Result */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Generated article
          </h2>
          <div className="flex items-center gap-3">
            {article && (
              <span className="text-[11px] text-gray-400">
                ~{wordCount} words
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!article}
              className="text-[11px] px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex-1 border border-gray-100 rounded-xl p-3 overflow-y-auto max-h-[420px] bg-gray-50/50">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-11/12" />
              <div className="h-3 bg-gray-100 rounded w-10/12" />
              <div className="h-3 bg-gray-100 rounded w-9/12" />
            </div>
          ) : article ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
              {article}
            </pre>
          ) : (
            <p className="text-sm text-gray-500">
              No article generated yet. Fill out the form on the left and click{" "}
              <span className="font-medium">Generate article</span> to see the
              draft here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;

