import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50 text-slate-800">
      <div
        className={`fixed inset-y-0 left-0 z-[100] w-72 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar closeMobile={closeSidebar} />
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[90] bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen((open) => !open)} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
