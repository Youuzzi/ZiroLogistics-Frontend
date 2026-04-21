import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Warehouse,
  Box,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  History,
  LogOut,
} from "lucide-react";
import logo from "../assets/Vertical.png";

const Sidebar = ({ closeMobile }) => {
  const menuItems = [
    {
      icon: <LayoutDashboard size={22} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <Warehouse size={22} />, label: "Warehouses", path: "/warehouses" },
    { icon: <Box size={22} />, label: "Master Items", path: "/items" },
    { icon: <ArrowDownLeft size={22} />, label: "Inbound", path: "/inbound" },
    { icon: <ArrowUpRight size={22} />, label: "Outbound", path: "/outbound" },
    {
      icon: <ArrowRightLeft size={22} />,
      label: "Transfer",
      path: "/transfer",
    },
    { icon: <History size={22} />, label: "Inventory Ledger", path: "/ledger" },
  ];

  return (
    <aside className="w-72 h-full flex flex-col bg-[#1a1d21] border-r border-slate-800 shadow-2xl">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
        <img
          src={logo}
          alt="Ziro"
          className="w-10 h-10 object-contain shadow-[0_0_15px_rgba(13,202,240,0.2)]"
        />
        <h2 className="text-[#0dcaf0] font-black tracking-tighter text-2xl uppercase italic">
          Ziro<span className="text-white">Log</span>
        </h2>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobile} // Menutup sidebar saat menu diklik di HP
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
              ${
                isActive
                  ? "bg-gradient-to-r from-[#0dcaf0] to-[#0bb5d6] text-black font-black shadow-lg shadow-[#0dcaf0]/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-[#0dcaf0] font-bold"
              }
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-xs uppercase tracking-[0.15em]">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-slate-800/50">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest border border-red-500/20"
        >
          <LogOut size={18} /> Sign Out Terminal
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
