import React from "react";
import { User, Bell } from "lucide-react";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="h-20 bg-[#121416]/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 ml-64">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
          Operational Terminal
        </span>
        <h3 className="text-white text-sm font-medium tracking-wide">
          Warehouse Control Center
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-[#0dcaf0] transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#0dcaf0] rounded-full border-2 border-[#121416]"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right flex flex-col">
            <span className="text-sm font-bold text-white leading-none">
              {user.name || "Admin"}
            </span>
            <span className="text-[9px] text-[#0dcaf0] font-black uppercase tracking-widest mt-1 opacity-80">
              {user.role}
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#0dcaf0] border border-slate-700 shadow-lg">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
