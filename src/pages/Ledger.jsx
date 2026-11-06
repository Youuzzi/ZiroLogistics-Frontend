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
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "OUTBOUND":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "TRANSFER":
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return "bg-blue-600/10 text-blue-700 border-blue-100";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER (ELEMEN ORI DIPERTAHANKAN) --- */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight ">
            Inventory <span className="text-blue-700">Ledger</span>
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide mt-2 font-bold opacity-70">
            Unmatched Audit Trail & Asset Traceability
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
            <Clock size={16} className="text-blue-700" />
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
              Real-time Feed
            </span>
          </div>
        </div>
      </div>

      {/* --- LOG TABLE (OPTIMIZED LEGIBILITY) --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase text-xs font-semibold tracking-widest">
                <th className="p-6">Timestamp</th>
                <th className="p-6 text-center">Event</th>
                <th className="p-6">Material Detail</th>
                <th className="p-6 text-center">Movement</th>
                <th className="p-6 text-center">Stock Balance</th>
                <th className="p-6">Operator & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-32 text-center">
                    <Loader2
                      className="animate-spin text-blue-700 mx-auto"
                      size={40}
                    />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-32 text-center text-slate-500 uppercase text-xs font-bold tracking-wide"
                  >
                    No movement detected in terminal history
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.publicId}
                    className="hover:bg-slate-50 transition-all group"
                  >
                    {/* 1. TIMESTAMP */}
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">
                          {new Date(log.createdAt).toLocaleDateString("id-ID")}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                        </span>
                      </div>
                    </td>

                    {/* 2. EVENT TYPE */}
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-xl border text-xs font-semibold tracking-tight ${getBadgeStyle(log.transactionType)}`}
                      >
                        {log.transactionType}
                      </span>
                    </td>

                    {/* 3. SKU & NAME */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 border border-slate-700/50">
                          <Package size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-blue-700 font-mono font-semibold text-base tracking-wider">
                            {log.itemSku}
                          </span>
                          <span className="text-slate-500 text-xs font-bold uppercase truncate max-w-[200px]">
                            {log.itemName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. MOVEMENT (QTY CHANGE) */}
                    <td className="p-6 text-center">
                      <div
                        className={`flex items-center justify-center gap-1.5 font-semibold text-xl ${log.quantityChange > 0 ? "text-emerald-700" : "text-red-600"}`}
                      >
                        {log.quantityChange > 0 ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                        {Math.abs(log.quantityChange).toLocaleString()}
                      </div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
                        Units Moved
                      </span>
                    </td>

                    {/* 5. BALANCE */}
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center bg-slate-50 py-2 rounded-2xl border border-slate-200">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                          Prev: {log.balanceBefore}
                        </span>
                        <span className="text-slate-900 font-semibold text-base tracking-tight">
                          Final: {log.balanceAfter}
                        </span>
                      </div>
                    </td>

                    {/* 6. EXECUTOR & REF (EMAIL DISIMPELKAN) */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-700 group-hover:text-blue-700 transition-colors">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold text-sm tracking-tight uppercase">
                            {log.userId ? log.userId.split("@")[0] : "SYSTEM"}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
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
