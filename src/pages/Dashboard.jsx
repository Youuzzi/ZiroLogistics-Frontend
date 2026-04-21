import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/DashboardService";
import { Warehouse, Package, Activity, Loader2, Landmark } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalWarehouses: 0,
    totalBins: 0,
    totalItems: 0,
    totalTransactionsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* --- WELCOME HEADER --- */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Analytics <span className="text-[#0dcaf0]">Overview</span>
        </h1>
        <p className="text-slate-500 text-xs uppercase tracking-[0.5em] mt-2 font-bold opacity-70">
          Real-time Centralized Control Terminal
        </p>
      </div>

      {/* --- ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* 1. TOTAL ITEMS */}
        <div className="bg-[#1a1d21] border border-slate-800 p-8 rounded-[2.5rem] hover:border-[#0dcaf0]/30 transition-all group relative overflow-hidden shadow-2xl">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-white group-hover:rotate-12 transition-transform">
            <Package size={140} />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-slate-800 rounded-2xl text-[#0dcaf0] border border-slate-700">
              <Package size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Master SKU
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-1 relative z-10">
            {loading ? (
              <Loader2 className="animate-spin text-slate-700" size={30} />
            ) : (
              summary.totalItems
            )}
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Total Registered Items
          </p>
        </div>

        {/* 2. TOTAL TERMINALS */}
        <div className="bg-[#1a1d21] border border-slate-800 p-8 rounded-[2.5rem] hover:border-[#0dcaf0]/30 transition-all group relative overflow-hidden shadow-2xl">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-white group-hover:rotate-12 transition-transform">
            <Warehouse size={140} />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-slate-800 rounded-2xl text-[#0dcaf0] border border-slate-700">
              <Warehouse size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Assets
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-1 relative z-10">
            {loading ? (
              <Loader2 className="animate-spin text-slate-700" size={30} />
            ) : (
              summary.totalWarehouses
            )}
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Active Terminals
          </p>
        </div>

        {/* 3. TOTAL BINS (RAK) */}
        <div className="bg-[#1a1d21] border border-slate-800 p-8 rounded-[2.5rem] hover:border-[#0dcaf0]/30 transition-all group relative overflow-hidden shadow-2xl">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-white group-hover:rotate-12 transition-transform">
            <Landmark size={140} />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-slate-800 rounded-2xl text-[#0dcaf0] border border-slate-700">
              <Landmark size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Grid
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-1 relative z-10">
            {loading ? (
              <Loader2 className="animate-spin text-slate-700" size={30} />
            ) : (
              summary.totalBins
            )}
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Storage Bin Matrix
          </p>
        </div>

        {/* 4. SYSTEM HEALTH */}
        <div className="bg-[#1a1d21] border border-slate-800 p-8 rounded-[2.5rem] hover:border-[#0dcaf0]/30 transition-all group relative overflow-hidden shadow-2xl">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-[#0dcaf0] group-hover:rotate-12 transition-transform">
            <Activity size={140} />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-slate-800 rounded-2xl text-[#0dcaf0] border border-slate-700">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Status
            </span>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Operational
            </h2>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-6">
            Engine v1.0 Online
          </p>
        </div>
      </div>

      {/* --- ADVERTISING / INFO PANEL --- */}
      <div className="p-12 bg-gradient-to-br from-[#1a1d21] to-[#121416] border border-slate-800 rounded-[3rem] shadow-inner">
        <div className="max-w-2xl">
          <h4 className="text-[#0dcaf0] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Enterprise Edition
          </h4>
          <h2 className="text-2xl text-white font-bold tracking-tight mb-4 leading-snug">
            ZiroLogistics is now running with high-concurrency{" "}
            <span className="italic underline decoration-[#0dcaf0] underline-offset-4">
              Pessimistic Locking
            </span>{" "}
            architecture.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Every single transaction is monitored and secured through our
            proprietary Inventory Ledger system, ensuring zero stock leakage and
            absolute data integrity across all global terminals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
