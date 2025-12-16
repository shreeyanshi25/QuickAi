import React, { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RemoveObject = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewOriginal, setPreviewOriginal] = useState("");
  const [previewProcessed, setPreviewProcessed] = useState("");

  const [target, setTarget] = useState("Text / label");
  const [strength, setStrength] = useState(3);
  const [extra, setExtra] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setFileName(f.name);
    const url = URL.createObjectURL(f);
    setPreviewOriginal(url);
    setPreviewProcessed("");
    setError("");
  };

  const handleClear = () => {
    setFile(null);
    setFileName("");
    setPreviewOriginal("");
    setPreviewProcessed("");
    setExtra("");
    setError("");
  };

  const handleRemoveObject = async () => {
    if (!file || !previewOriginal) {
      setError("Please upload an image first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/remove-object`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          strength,
          extra,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const processedUrl = data.resultUrl || previewOriginal;
      setPreviewProcessed(processedUrl);

      setRecent((prev) => [
        {
          id: Date.now(),
          original: previewOriginal,
          processed: processedUrl,
          name: fileName,
        },
        ...prev.slice(0, 5),
      ]);
    } catch (err) {
      console.error(err);
      setError(
        "Could not reach the object removal API. Make sure backend is running on PORT 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* LEFT: controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
          Object Removal
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Upload an image and preview how it looks with unwanted objects
          removed. This version uses a local demo preview — later you&apos;ll
          connect it to a real AI object removal API.
        </p>

        {/* File input */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700">
            Image file
          </label>
          <label className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-1 text-sm text-gray-500 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30">
            <span className="font-medium">
              {fileName || "Click to upload or drag & drop"}
            </span>
            <span className="text-[11px] text-gray-400">
              PNG, JPG up to ~5MB recommended for testing.
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              What should be removed?
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option>Text / label</option>
              <option>People</option>
              <option>Logo / watermark</option>
              <option>Background clutter</option>
              <option>Other object</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Removal strength
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={5}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-xs text-gray-500">{strength}/5</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Subtle</span>
              <span>Balanced</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Extra instructions (optional)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px] resize-none"
              placeholder="e.g. Remove the phone on the table, keep the notebook and coffee cup."
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={handleRemoveObject}
            disabled={!file || loading}
            className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Remove object"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!file && !previewOriginal}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {!error && (
          <p className="mt-4 text-[11px] text-gray-400">
            Tip: for best results with the future AI backend, use images where
            the object is clearly visible and not overlapping important
            details.
          </p>
        )}
      </div>

      {/* RIGHT: previews */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Preview (demo)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500">
              Original
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              {previewOriginal ? (
                <img
                  src={previewOriginal}
                  alt="Original upload"
                  className="max-h-72 w-auto object-contain"
                />
              ) : (
                <p className="text-xs text-gray-400">
                  Upload an image to see the original preview.
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500">
              Object removed (demo)
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              {previewProcessed ? (
                <img
                  src={previewProcessed}
                  alt="Processed preview"
                  className="max-h-72 w-auto object-contain"
                />
              ) : (
                <p className="text-xs text-gray-400">
                  Click &quot;Remove object&quot; to see a demo result.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent uploads */}
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2">
            Recent uploads (demo)
          </h3>
          {recent.length === 0 ? (
            <p className="text-xs text-gray-400">
              When you process images, a small gallery will appear here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {recent.map((item) => (
                <div
                  key={item.id}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50"
                >
                  <img
                    src={item.processed || item.original}
                    alt={item.name || "Recent"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
