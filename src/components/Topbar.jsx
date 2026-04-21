import React from "react";
import { User, Bell, Menu, ShieldCheck } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  // --- LOGIC: AMBIL DATA USER DARI SESSION ---
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // --- LOGIC: CLEANING ROLE STRING ---
  // Menghilangkan "ROLE_" dari backend (misal: ROLE_ADMIN jadi ADMIN)
  const getDisplayRole = (role) => {
    if (!role) return "ADMIN"; // Fallback default
    return role.replace("ROLE_", "").toUpperCase();
  };

  return (
    <header className="h-24 bg-[#121416]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
      {/* Sisi Kiri: Info Terminal & Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-slate-800 rounded-xl text-[#0dcaf0] border border-slate-700 active:scale-90 transition-all shadow-lg"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#0dcaf0] font-black uppercase tracking-[0.3em] opacity-80">
            Operational Terminal
          </span>
          <h3 className="text-white text-lg font-black tracking-tight uppercase italic">
            Control Center
          </h3>
        </div>
      </div>

      {/* Sisi Kanan: Profile & Notification */}
      <div className="flex items-center gap-4 md:gap-8">
        <button className="relative text-slate-400 hover:text-[#0dcaf0] transition-all p-2 group">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#0dcaf0] rounded-full border-2 border-[#121416] group-hover:scale-125 transition-transform"></span>
        </button>

        <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-slate-800">
          <div className="text-right hidden sm:flex flex-col">
            {/* NAMA USER OTOMATIS */}
            <span className="text-sm font-black text-white uppercase tracking-tighter">
              {user?.name || "UNIDENTIFIED PERSONNEL"}
            </span>

            {/* ROLE CLEAN (ADMIN / STAFF ONLY) */}
            <div className="flex items-center justify-end gap-1 mt-1">
              <ShieldCheck size={15} className="text-[#0dcaf0] opacity-50" />
              <span className="text-[10px] text-[#0dcaf0] font-black uppercase tracking-widest opacity-70">
                {getDisplayRole(user?.role)}
              </span>
            </div>
          </div>

          <div className="w-12 h-12 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-[#0dcaf0] shadow-[0_0_20px_rgba(0,0,0,0.4)] group hover:border-[#0dcaf0]/50 transition-all">
            <User
              size={24}
              strokeWidth={2.5}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
