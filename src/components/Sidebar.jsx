import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets"; // adjust if needed

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 px-4 py-6">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        
        <span className="font-semibold text-slate-800">Quick.ai</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 text-sm">
        <NavLink
          to="/ai"
          end
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md ${
              isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink to="/ai/blog-titles" className="block px-3 py-2 rounded-md text-gray-600">
          Blog Titles
        </NavLink>

        <NavLink to="/ai/write-article" className="block px-3 py-2 rounded-md text-gray-600">
          Article Writer
        </NavLink>

        <NavLink to="/ai/generate-images" className="block px-3 py-2 rounded-md text-gray-600">
          Generate Images
        </NavLink>

        <NavLink to="/ai/remove-bg" className="block px-3 py-2 rounded-md text-gray-600">
          Remove Background
        </NavLink>

        <NavLink to="/ai/remove-object" className="block px-3 py-2 rounded-md text-gray-600">
          Remove Object
        </NavLink>

        <NavLink to="/ai/review-resume" className="block px-3 py-2 rounded-md text-gray-600">
          Resume Review
        </NavLink>

        <NavLink to="/ai/community" className="block px-3 py-2 rounded-md text-gray-600">
          Community
        </NavLink>
      </nav>

    </aside>
  );
};

export default Sidebar;
