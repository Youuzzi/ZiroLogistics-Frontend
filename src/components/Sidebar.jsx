import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Vertical.png"; // Import logo lo
import {
  LayoutDashboard,
  Warehouse,
  Box,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <Warehouse size={20} />, label: "Warehouses", path: "/warehouses" },
    { icon: <Box size={20} />, label: "Master Items", path: "/items" },
    { icon: <ArrowDownLeft size={20} />, label: "Inbound", path: "/inbound" },
    { icon: <ArrowUpRight size={20} />, label: "Outbound", path: "/outbound" },
    { icon: <History size={20} />, label: "Inventory Ledger", path: "/ledger" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#1a1d21] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        {/* LOGO ORIGINAL ZIROCRAFT */}
        <img
          src={logo}
          alt="ZiroLogistics"
          className="w-10 h-10 object-contain"
        />
        <h2 className="text-[#0dcaf0] font-black tracking-tighter text-xl">
          ZIRO<span className="text-white">LOG</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-[#0dcaf0]/10 text-[#0dcaf0] font-semibold shadow-[inset_0_0_10px_rgba(13,202,240,0.05)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }
            `}
          >
            {item.icon}
            <span className="text-sm uppercase tracking-wider font-medium">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all uppercase text-[10px] font-bold tracking-[0.2em]"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
