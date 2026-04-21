import React, { useEffect, useState } from "react";
import { getInventoryLedger } from "../api/InventoryService";
import {
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Clock,
  Loader2,
  Package,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

const Ledger = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const { data } = await getInventoryLedger();
      setLogs(data.content || []);
    } catch (err) {
      toast.error("Failed to sync audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const getBadgeStyle = (type) => {
    switch (type) {
      case "INBOUND":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "OUTBOUND":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "TRANSFER":
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return "bg-[#0dcaf0]/10 text-[#0dcaf0] border-[#0dcaf0]/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER (ELEMEN ORI DIPERTAHANKAN) --- */}
      <div className="flex justify-between items-end border-b border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Inventory <span className="text-[#0dcaf0]">Ledger</span>
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.4em] mt-2 font-bold opacity-70">
            Unmatched Audit Trail & Asset Traceability
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1a1d21] border border-slate-800 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-black/20">
            <Clock size={16} className="text-[#0dcaf0]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Real-time Feed
            </span>
          </div>
        </div>
      </div>

      {/* --- LOG TABLE (OPTIMIZED LEGIBILITY) --- */}
      <div className="bg-[#1a1d21] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-slate-800/40">
              <tr className="text-slate-500 uppercase text-[11px] font-black tracking-widest">
                <th className="p-6">Timestamp</th>
                <th className="p-6 text-center">Event</th>
                <th className="p-6">Material Detail</th>
                <th className="p-6 text-center">Movement</th>
                <th className="p-6 text-center">Stock Balance</th>
                <th className="p-6">Operator & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-32 text-center">
                    <Loader2
                      className="animate-spin text-[#0dcaf0] mx-auto"
                      size={40}
                    />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-32 text-center text-slate-600 uppercase text-xs font-bold tracking-[0.3em]"
                  >
                    No movement detected in terminal history
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.publicId}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    {/* 1. TIMESTAMP */}
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold text-sm">
                          {new Date(log.createdAt).toLocaleDateString("id-ID")}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                        </span>
                      </div>
                    </td>

                    {/* 2. EVENT TYPE */}
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-xl border text-[10px] font-black tracking-tighter ${getBadgeStyle(log.transactionType)}`}
                      >
                        {log.transactionType}
                      </span>
                    </td>

                    {/* 3. SKU & NAME */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-500 border border-slate-700/50">
                          <Package size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#0dcaf0] font-mono font-black text-base tracking-wider">
                            {log.itemSku}
                          </span>
                          <span className="text-slate-400 text-xs font-bold uppercase truncate max-w-[200px]">
                            {log.itemName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. MOVEMENT (QTY CHANGE) */}
                    <td className="p-6 text-center">
                      <div
                        className={`flex items-center justify-center gap-1.5 font-black text-xl ${log.quantityChange > 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {log.quantityChange > 0 ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                        {Math.abs(log.quantityChange).toLocaleString()}
                      </div>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                        Units Moved
                      </span>
                    </td>

                    {/* 5. BALANCE */}
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center bg-black/20 py-2 rounded-2xl border border-slate-800/50">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          Prev: {log.balanceBefore}
                        </span>
                        <span className="text-white font-black text-base tracking-tight">
                          Final: {log.balanceAfter}
                        </span>
                      </div>
                    </td>

                    {/* 6. EXECUTOR & REF (EMAIL DISIMPELKAN) */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 border border-slate-700 group-hover:text-[#0dcaf0] transition-colors">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-sm tracking-tight uppercase">
                            {log.userId ? log.userId.split("@")[0] : "SYSTEM"}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                            <Hash size={10} /> {log.referenceNo || "NO-REF"}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
