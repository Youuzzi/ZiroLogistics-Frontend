import React from "react";
import { User, Bell, Menu, ShieldCheck } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const getDisplayRole = (role) => {
    if (!role) return "ADMIN";
    return role.replace("ROLE_", "").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Workspace</p>
          <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Operations overview
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-5">
          <div className="hidden text-right sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
              {user?.name || "Workspace user"}
            </p>
            <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-slate-500">
              <ShieldCheck size={13} className="text-blue-600" />
              <span>{getDisplayRole(user?.role)}</span>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
