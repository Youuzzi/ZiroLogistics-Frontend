import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#121416]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Topbar />
        <main className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
