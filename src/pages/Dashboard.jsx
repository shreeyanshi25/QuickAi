import React, { useMemo } from "react";
import {
  dummyCreationData,
  dummyPublishedCreationData,
} from "../assets/assets";

const Dashboard = () => {
  // Basic stats
  const totalCreations = dummyCreationData.length;
  const totalPublished = dummyCreationData.filter((c) => c.publish).length;
  const totalImages = dummyPublishedCreationData.length;

  // Breakdown by type
  const typeStats = useMemo(() => {
    const counts = {};
    dummyCreationData.forEach((item) => {
      const key = item.type || "other";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, []);

  const recentCreations = dummyCreationData
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your AI activity, content types, and published creations.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total creations</p>
          <p className="text-2xl font-semibold text-slate-800">
            {totalCreations}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Across all AI tools (titles, articles, images, etc.)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Published content</p>
          <p className="text-2xl font-semibold text-slate-800">
            {totalPublished}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Items marked as published or shared.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Images generated</p>
          <p className="text-2xl font-semibold text-slate-800">
            {totalImages}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            From the AI image generation & edit tools.
          </p>
        </div>
      </div>

      {/* Middle section: type breakdown + tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Type breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Creations by tool type
            </h2>
            <span className="text-[11px] text-gray-400">
              Based on your saved content
            </span>
          </div>

          {Object.keys(typeStats).length === 0 ? (
            <p className="text-sm text-gray-500">
              No activity yet. Start by generating a blog title or article.
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(typeStats).map(([type, count]) => {
                const percent =
                  totalCreations > 0
                    ? Math.round((count / totalCreations) * 100)
                    : 0;
                const label =
                  type === "blog-title"
                    ? "Blog titles"
                    : type === "article"
                    ? "Articles"
                    : type;

                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium capitalize">{label}</span>
                      <span>
                        {count} · {percent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick tips / usage summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
              Quick tips
            </h2>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>
                • Use <span className="font-medium">Blog Titles</span> to
                quickly brainstorm headlines for your next posts.
              </li>
              <li>
                • Draft long-form content with{" "}
                <span className="font-medium">Article Writer</span>, then edit
                in your own voice.
              </li>
              <li>
                • Use <span className="font-medium">Image Generator</span> to
                create thumbnails and hero images for your content.
              </li>
            </ul>
          </div>
          <p className="text-[11px] text-gray-400 mt-4">
            As you add real data from the backend, this dashboard will
            automatically reflect your live usage.
          </p>
        </div>
      </div>

      {/* Bottom: recent creations + featured published images */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent creations */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Recent creations
            </h2>
            <span className="text-[11px] text-gray-400">
              Showing {recentCreations.length} of {totalCreations}
            </span>
          </div>

          {recentCreations.length === 0 ? (
            <p className="text-sm text-gray-500">
              No creations yet. Generate something with one of your AI tools to
              see it here.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {recentCreations.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100 rounded-xl px-4 py-3 hover:border-indigo-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">
                      {item.prompt}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mt-1">
                      {item.type === "blog-title"
                        ? "Blog Title"
                        : item.type === "article"
                        ? "Article"
                        : item.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500 shrink-0">
                    <span>
                      Likes: <span className="font-semibold">{item.likes.length}</span>
                    </span>
                    <span>
                      Published:{" "}
                      <span className="font-semibold">
                        {item.publish ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured images */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Featured published images
          </h2>

          {dummyPublishedCreationData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No published images yet. Generate and publish images to see them
              here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {dummyPublishedCreationData.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                >
                  <img
                    src={item.content}
                    alt={item.prompt}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1">
                    <p className="text-[10px] text-white line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
