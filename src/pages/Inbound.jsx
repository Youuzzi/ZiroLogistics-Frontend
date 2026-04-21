import React, { useState, useEffect } from "react";
import { getItems } from "../api/ItemService";
import { getWarehouses } from "../api/WarehouseService";
import { getBinsByWarehouse } from "../api/BinService";
import { processInbound } from "../api/InboundService";
import {
  ArrowDownLeft,
  Package,
  MapPin,
  ClipboardList,
  Loader2,
  Send,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const Inbound = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [bins, setBins] = useState([]);

  const [form, setForm] = useState({
    sku: "",
    warehouseId: "",
    binCode: "",
    quantity: "",
    referenceNo: "",
    note: "",
  });

  // Load initial data SKU & Warehouse
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resItems, resWh] = await Promise.all([
          getItems(0, 100),
          getWarehouses(0, 100),
        ]);
        setItems(resItems.data.content || []);
        setWarehouses(resWh.data.content || []);
      } catch (err) {
        toast.error("Failed to sync master data");
      }
    };
    loadData();
  }, []);

  // Load Bins saat Warehouse dipilih
  const handleWarehouseChange = async (whId) => {
    setForm({ ...form, warehouseId: whId, binCode: "" });
    try {
      const { data } = await getBinsByWarehouse(whId);
      setBins(data || []);
    } catch (err) {
      toast.error("Failed to load bins for this terminal");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- LOGIC KEAMANAN: VALIDASI VOLUME ---
    if (parseFloat(form.quantity) <= 0)
      return toast.error("Invalid volume quantity");

    setLoading(true);
    const payload = {
      requestId: crypto.randomUUID(), // Industrial Standard: Idempotency Key
      sku: form.sku,
      binCode: form.binCode,
      quantity: parseFloat(form.quantity),
      referenceNo: form.referenceNo,
      note: form.note,
    };

    try {
      await processInbound(payload);
      toast.success("Inbound Transaction Recorded");
      setForm({ ...form, quantity: "", referenceNo: "", note: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Transaction Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = items.find((i) => i.sku === form.sku);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER - Font lebih tegas & berwibawa */}
      <div className="flex items-center gap-5 border-b border-slate-800/50 pb-8">
        <div className="p-4 bg-[#0dcaf0]/10 rounded-2xl text-[#0dcaf0] border border-[#0dcaf0]/20 shadow-[0_0_15px_rgba(13,202,240,0.1)]">
          <ArrowDownLeft size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Inbound <span className="text-[#0dcaf0]">Receipt</span>
          </h1>
          <p className="text-slate-500 text-[11px] uppercase tracking-[0.5em] font-bold opacity-70">
            Material Induction & Quality Check
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
            {/* Section 1: Item Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#0dcaf0]">
                <Package size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Item Identification
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Select SKU
                  </label>
                  <select
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none appearance-none text-base font-bold transition-all"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  >
                    <option value="">-- Search SKU --</option>
                    {items.map((item) => (
                      <option key={item.publicId} value={item.sku}>
                        {item.sku} - {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0dcaf0] uppercase tracking-widest ml-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none text-2xl font-black tracking-tight"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location Assignment */}
            <div className="space-y-6 border-t border-slate-800/50 pt-8">
              <div className="flex items-center gap-2 text-[#0dcaf0]">
                <MapPin size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Storage Assignment
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Warehouse Terminal
                  </label>
                  <select
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none appearance-none font-bold"
                    value={form.warehouseId}
                    onChange={(e) => handleWarehouseChange(e.target.value)}
                  >
                    <option value="">-- Choose Terminal --</option>
                    {warehouses.map((wh) => (
                      <option key={wh.publicId} value={wh.publicId}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Bin Coordinate
                  </label>
                  <select
                    required
                    disabled={!form.warehouseId}
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none appearance-none disabled:opacity-20 font-black tracking-wider"
                    value={form.binCode}
                    onChange={(e) =>
                      setForm({ ...form, binCode: e.target.value })
                    }
                  >
                    <option value="">-- Select Rack --</option>
                    {bins.map((bin) => (
                      <option key={bin.publicId} value={bin.binCode}>
                        {bin.binCode} ({bin.zoneName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Documentation */}
            <div className="space-y-6 border-t border-slate-800/50 pt-8">
              <div className="flex items-center gap-2 text-[#0dcaf0]">
                <ClipboardList size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Audit Documentation
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Reference No
                  </label>
                  <input
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none font-mono uppercase"
                    placeholder="PO-2026-XXXX"
                    value={form.referenceNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        referenceNo: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Remarks
                  </label>
                  <input
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none"
                    placeholder="Optional notes..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#0dcaf0] text-black font-black py-6 rounded-[1.5rem] hover:bg-white transition-all flex items-center justify-center gap-4 shadow-xl shadow-[#0dcaf0]/10 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <ShieldCheck size={24} strokeWidth={3} />{" "}
                  <span className="tracking-[0.3em] uppercase text-sm">
                    Authorize Inbound
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: METRICS (4 COL) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a1d21] border border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-[0.02] text-white">
              <Package size={150} />
            </div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
              <AlertCircle size={14} className="text-[#0dcaf0]" /> Real-time
              Metrics
            </h4>
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-slate-800/50">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                  Total Weight
                </span>
                <span className="text-white font-black text-2xl tracking-tighter">
                  {selectedItem
                    ? (
                        selectedItem.weightPerUnit * (form.quantity || 0)
                      ).toFixed(2)
                    : "0.00"}
                  <span className="ml-2 text-xs text-[#0dcaf0]">KG</span>
                </span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                  Unit of Measure
                </span>
                <span className="text-[#0dcaf0] font-black text-lg uppercase tracking-widest">
                  {selectedItem?.baseUom || "---"}
                </span>
              </div>
              <div className="p-5 bg-[#0dcaf0]/5 border border-[#0dcaf0]/10 rounded-[1.5rem]">
                <p className="text-[10px] text-[#0dcaf0] leading-relaxed font-bold italic text-center uppercase tracking-wider">
                  "System will automatically verify bin capacity before
                  finalizing transaction."
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

export default Inbound;
