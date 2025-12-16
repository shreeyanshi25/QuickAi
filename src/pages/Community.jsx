import React, { useState, useMemo } from "react";
import {
  dummyCreationData,
  dummyPublishedCreationData,
  assets,
} from "../assets/assets";

const Community = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Normalize all published content (articles + images + titles)
  const allContent = useMemo(() => {
    const formatted = [];

    // Add images
    dummyPublishedCreationData.forEach((item) => {
      formatted.push({
        id: item.id,
        type: "image",
        content: item.content,
        prompt: item.prompt,
        likes: item.likes.length,
        user_id: item.user_id,
      });
    });

    // Add text content (titles, articles)
    dummyCreationData
      .filter((item) => item.publish)
      .forEach((item) => {
        formatted.push({
          id: item.id,
          type: item.type,
          content: item.content,
          prompt: item.prompt,
          likes: item.likes.length,
          user_id: item.user_id,
        });
      });

    return formatted;
  }, []);

  // Filter by tab
  const filteredContent = allContent.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (
      search &&
      !item.prompt.toLowerCase().includes(search.toLowerCase()) &&
      !item.content.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Community
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore what other creators have built using QuickAI tools.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search prompts, titles, or articles…"
          className="w-full sm:w-80 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "image", label: "Images" },
            { key: "blog-title", label: "Blog Titles" },
            { key: "article", label: "Articles" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                activeTab === tab.key
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredContent.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">
            No results found. Try adjusting filters or search.
          </p>
        ) : (
          filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* IMAGE POST */}
              {item.type === "image" && (
                <img
                  src={item.content}
                  alt="Generated"
                  className="rounded-xl w-full h-48 object-cover mb-3"
                />
              )}

              {/* TEXT POST */}
              {item.type !== "image" && (
                <div className="h-32 overflow-hidden mb-3">
                  <p className="text-sm text-gray-700 line-clamp-6 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-gray-400 mb-2">
                {item.prompt.slice(0, 80)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.profile_img_1}
                    alt="User"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-600">
                    {item.user_id.slice(0, 12)}...
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  ❤️ {item.likes}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
