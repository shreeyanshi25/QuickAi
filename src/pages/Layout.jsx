import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      {/* Left sidebar */}
      <Sidebar />

      {/* Right side: page content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-4 sm:px-10 py-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
