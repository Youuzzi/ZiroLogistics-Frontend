import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#121416] text-slate-200 overflow-x-hidden">
      {/* SIDEBAR: Muncul sebagai Drawer di Mobile */}
      <div
        className={`
        fixed inset-y-0 left-0 z-[100] w-72 transform transition-transform duration-300 ease-in-out bg-[#1a1d21]
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar closeMobile={() => setIsSidebarOpen(false)} />
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOPBAR: Tombol Menu ada di sini saja */}
        <Topbar onMenuClick={toggleSidebar} />

        {/* Padding diperkecil di mobile agar tidak sesak */}
        <main className="flex-1 p-4 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
