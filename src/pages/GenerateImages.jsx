import React, { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const GenerateImages = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Default");
  const [aspectRatio, setAspectRatio] = useState("Square (1:1)");
  const [count, setCount] = useState(4);

  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please describe the image you want first.");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);
    setImages([]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          count,
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setImages(data.images || []);
      setSelectedIndex(0);
      setInfo(
        "This is a local demo. When you connect a real AI image API, these thumbnails will show actual generated images."
      );
    } catch (err) {
      console.error(err);
      setError(
        "Could not reach the image API. Make sure the backend is running on PORT 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
  };

  const handleClear = () => {
    setImages([]);
    setSelectedIndex(0);
    setError("");
    setInfo("");
  };

  const visibleCount = count;
  const generatedCount = images.length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* LEFT: controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-1">
          AI Image Generation
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Describe the image you want, choose a style and aspect ratio, and let
          the AI generate preview images. This version uses a demo backend –
          later you can plug in a real image API.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Prompt */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Image prompt
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px] resize-none"
              placeholder="e.g. Cinematic photo of a student studying with a laptop, soft lighting"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              {prompt.length}/300 characters
            </p>
          </div>

          {/* Style + aspect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Style
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option>Default</option>
                <option>Photo (realistic)</option>
                <option>Illustration</option>
                <option>3D render</option>
                <option>Cartoon</option>
                <option>Neon / cyberpunk</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Aspect ratio
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
              >
                <option>Square (1:1)</option>
                <option>Landscape (16:9)</option>
                <option>Portrait (9:16)</option>
                <option>Classic (4:3)</option>
              </select>
            </div>
          </div>

          {/* Count slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium">Number of images</span>
              <span>
                {generatedCount}/{visibleCount} generated
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>1</span>
              <span>3</span>
              <span>4</span>
              <span>6</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate images"}
            </button>

            <button
              type="button"
              onClick={handleCopyPrompt}
              disabled={!prompt}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Copy prompt
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!images.length}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Clear gallery
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {info && !error && (
            <p className="mt-3 text-[11px] text-gray-400">{info}</p>
          )}

          {!info && !error && (
            <p className="mt-4 text-[11px] text-gray-400">
              Pro tip: add details like lighting, camera angle, and mood. Example:
              &quot;Cinematic close-up, soft lighting, volumetric fog, 4K&quot;.
            </p>
          )}
        </form>
      </div>

      {/* RIGHT: gallery */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Generated images
          </h2>
          <span className="text-[11px] text-gray-500">
            {generatedCount
              ? `${generatedCount} image${generatedCount > 1 ? "s" : ""} generated`
              : "No images yet"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: count || 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : !images.length ? (
          <p className="text-sm text-gray-500">
            No images yet. Enter a prompt on the left and click{" "}
            <span className="font-medium">Generate images</span> to see preview
            thumbnails here.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative group rounded-xl overflow-hidden border ${
                  idx === selectedIndex
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-gray-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.prompt || "Generated image"}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;

