import React, { useState, useEffect } from "react";
import { getItems } from "../api/ItemService";
import { getInventoryStocks } from "../api/InventoryService";
import { processOutbound } from "../api/OutboundService";
import {
  ArrowUpRight,
  Box,
  MapPin,
  Hash,
  Loader2,
  Zap,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

const Outbound = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);

  const [form, setForm] = useState({
    sku: "",
    binCode: "",
    quantity: "",
    referenceNo: "",
    note: "",
  });

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const resItems = await getItems(0, 100);
        setItems(resItems.data.content || []);
      } catch (err) {
        toast.error("Failed to sync items");
      }
    };
    loadInitial();
  }, []);

  const handleSkuChange = async (sku) => {
    setForm({ ...form, sku, binCode: "", quantity: "" });
    try {
      const { data } = await getInventoryStocks(0, 100);
      const filtered = data.content.filter(
        (s) => s.itemSku === sku && s.quantity > 0,
      );
      setAvailableStocks(filtered);
    } catch (err) {
      toast.error("Failed to check stock locations");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- LOGIC KEAMANAN: VALIDASI INPUT ---
    if (parseFloat(form.quantity) <= 0)
      return toast.error("Quantity must be greater than zero");

    setLoading(true);
    const payload = {
      requestId: crypto.randomUUID(),
      sku: form.sku,
      binCode: form.binCode,
      quantity: parseFloat(form.quantity),
      referenceNo: form.referenceNo,
      note: form.note,
    };

    try {
      await processOutbound(payload);
      toast.success("Outbound Dispatch Successful");
      setForm({
        sku: "",
        binCode: "",
        quantity: "",
        referenceNo: "",
        note: "",
      });
      setAvailableStocks([]);
    } catch (err) {
      const msg = err.response?.data?.message || "Dispatch Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedStock = availableStocks.find((s) => s.binCode === form.binCode);
  const remainingCalculated = selectedStock
    ? selectedStock.quantity - (parseFloat(form.quantity) || 0)
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER - Dibuat lebih kontras (Merah untuk Outbound) */}
      <div className="flex items-center gap-5 border-b border-slate-800/50 pb-8">
        <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <ArrowUpRight size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic text-left">
            Outbound <span className="text-red-500">Dispatch</span>
          </h1>
          <p className="text-slate-500 text-[11px] uppercase tracking-[0.4em] font-bold opacity-70 text-left">
            Material Issuance & Stock Removal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: MAIN FORM (8 COL) */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="bg-[#1a1d21] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-10"
          >
            {/* Section 1: Item & Source */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-red-500">
                <Box size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Source Identification
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Select Item SKU
                  </label>
                  <select
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-red-500 outline-none appearance-none text-base font-bold transition-all"
                    value={form.sku}
                    onChange={(e) => handleSkuChange(e.target.value)}
                  >
                    <option value="">-- Search SKU --</option>
                    {items.map((item) => (
                      <option key={item.publicId} value={item.sku}>
                        {item.sku} - {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Pick From Bin
                  </label>
                  <select
                    required
                    disabled={!form.sku}
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-5 py-4 rounded-2xl focus:border-red-500 outline-none appearance-none disabled:opacity-20 font-black tracking-wider transition-all"
                    value={form.binCode}
                    onChange={(e) =>
                      setForm({ ...form, binCode: e.target.value })
                    }
                  >
                    <option value="">-- Select Location --</option>
                    {availableStocks.map((s) => (
                      <option key={s.binCode} value={s.binCode}>
                        {s.binCode} (Available: {s.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Quantity */}
            <div className="space-y-6 border-t border-slate-800/50 pt-8">
              <div className="flex items-center gap-2 text-red-500">
                <Hash size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Transaction Volume
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Quantity to Remove
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    max={selectedStock?.quantity || 999999}
                    placeholder="0.00"
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-red-500 outline-none text-2xl font-black tracking-tight transition-all"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                  {selectedStock && (
                    <p className="text-[9px] text-red-500/60 ml-1 mt-1 font-black uppercase tracking-tighter">
                      Limit for {selectedStock.binCode}:{" "}
                      {selectedStock.quantity} Units
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Reference No
                  </label>
                  <input
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-red-500 outline-none font-mono uppercase transition-all"
                    placeholder="SO-XXXX"
                    value={form.referenceNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        referenceNo: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              disabled={
                loading ||
                !form.binCode ||
                (selectedStock &&
                  parseFloat(form.quantity) > selectedStock.quantity)
              }
              className="w-full bg-red-600 text-white font-black py-6 rounded-[1.5rem] hover:bg-red-500 transition-all flex items-center justify-center gap-4 shadow-xl shadow-red-600/10 disabled:opacity-30 disabled:grayscale active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Zap size={24} fill="currentColor" />{" "}
                  <span className="tracking-[0.3em] uppercase text-sm">
                    Finalize Dispatch
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: SAFETY AUDIT (4 COL) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-[0.02] text-red-500">
              <ShieldAlert size={150} />
            </div>
            <h4 className="text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-8 border-b border-red-500/10 pb-4 flex items-center gap-2">
              <AlertCircle size={14} /> Dispatch Validation
            </h4>
            <div className="space-y-8 relative z-10 text-left">
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-red-500/10">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                  Inventory Delta
                </span>
                <span className="text-red-500 font-black text-2xl tracking-tighter">
                  -{form.quantity || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                  Projected Stock
                </span>
                <span
                  className={`font-black text-lg ${remainingCalculated < 0 ? "text-red-500 underline" : "text-white"}`}
                >
                  {remainingCalculated !== null
                    ? remainingCalculated.toFixed(2)
                    : "---"}
                </span>
              </div>
              <div className="p-5 bg-black/40 rounded-[1.5rem] border border-slate-800">
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic text-center uppercase tracking-wider">
                  "Dispatching will permanently reduce bin occupancy and record
                  a negative ledger entry."
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 text-center">
            <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.5em] italic opacity-40">
              Zirocraft Engine v3.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outbound;
