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
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Warehouse, label: "Warehouses", path: "/warehouses" },
    { icon: Box, label: "Master Items", path: "/items" },
    { icon: ArrowDownLeft, label: "Inbound", path: "/inbound" },
    { icon: ArrowUpRight, label: "Outbound", path: "/outbound" },
    { icon: ArrowRightLeft, label: "Transfer", path: "/transfer" },
    { icon: History, label: "Inventory Ledger", path: "/ledger" },
  ];

  return (
    <aside className="flex h-full w-72 flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
        <img src={logo} alt="ZiroLogistics" className="h-10 w-10 object-contain" />
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Ziro<span className="text-blue-600">Logistics</span>
          </h2>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Warehouse Management
          </p>
        </div>
      </div>

      <div className="px-5 pb-2 pt-7">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-5">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={closeMobile}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
