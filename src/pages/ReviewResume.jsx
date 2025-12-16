import React, { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ReviewResume = () => {
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      setError("Please paste your resume content first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/review-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetRole,
          resumeText,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        "Could not reach the resume review API. Make sure backend is running on PORT 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResumeText("");
    setResult(null);
    setError("");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* LEFT SIDE — Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
          Resume Reviewer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Target role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Resume content
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full min-h-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white text-sm px-6 py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading ? "Reviewing..." : "Review my resume"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!resumeText}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              Clear
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2 mt-2">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* RIGHT SIDE — Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          AI Feedback
        </h2>

        {!result ? (
          <p className="text-sm text-gray-500">
            No feedback yet. Paste your resume and click{" "}
            <span className="font-medium">Review my resume</span>.
          </p>
        ) : (
          <div className="space-y-4">

            <p className="text-sm">
              Score:{" "}
              <span className="font-semibold">{result.score}/100</span> ·{" "}
              {result.wordCount} words
            </p>

            <div>
              <h3 className="font-semibold text-sm text-slate-700 mb-1">
                Summary
              </h3>
              <p className="text-sm text-gray-700">{result.summary}</p>
            </div>

            <div>
              <h3 className="font-semibold text-emerald-700 text-sm mb-1">
                Strengths
              </h3>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {result.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-amber-700 text-sm mb-1">
                Improvements
              </h3>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {result.improvements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
