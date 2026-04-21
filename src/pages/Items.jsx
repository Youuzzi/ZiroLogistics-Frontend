import React, { useEffect, useState } from "react";
import { getItems, createItem } from "../api/ItemService";
import {
  Plus,
  Package,
  AlertTriangle,
  Loader2,
  Weight,
  Gauge,
  X,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

// --- LOGIC: HELPER FORMAT UNIT (QUIET LUXURY) ---
const formatUnit = (value, unit = "") => {
  if (value === undefined || value === null || isNaN(value)) return `0 ${unit}`;
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${unit}`;
};

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Security: Prevent double submission
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    baseUom: "PCS",
    minStockLevel: 0,
    weightPerUnit: 1,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await getItems();
      setItems(data.content || []);
    } catch (err) {
      toast.error("Database Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- LOGIKA KEAMANAN FRONTEND (INPUT VALIDATION) ---
    if (form.sku.length < 3) return toast.error("SKU too short (Min 3 chars)");
    if (form.weightPerUnit <= 0) return toast.error("Weight must be positive");

    setSubmitting(true);
    try {
      await createItem(form);
      toast.success("SKU Successfully Indexed");
      setShowModal(false);
      setForm({
        sku: "",
        name: "",
        description: "",
        baseUom: "PCS",
        minStockLevel: 0,
        weightPerUnit: 1,
      });
      fetchItems();
    } catch (err) {
      const msg = err.response?.data?.message || "Registration Failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER - Ukuran Font & Contrast ditingkatkan */}
      <div className="flex justify-between items-end border-b border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Product <span className="text-[#0dcaf0]">Catalog</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-[0.4em] mt-2 font-bold">
            Industrial SKU Database Control
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0dcaf0] text-black font-black px-6 py-3 rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-[#0dcaf0]/20 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />{" "}
          <span className="text-xs uppercase tracking-widest">
            Register SKU
          </span>
        </button>
      </div>

      {/* TABLE - Spasi lebih lega & Font lebih tajam */}
      <div className="bg-[#1a1d21] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center w-24">
                  Identity
                </th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Master SKU & Description
                </th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Base Unit
                </th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Unit Weight
                </th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Min Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-32 text-center">
                    <Loader2
                      className="animate-spin text-[#0dcaf0] mx-auto"
                      size={40}
                    />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-32 text-center text-slate-600 uppercase text-xs font-bold tracking-[0.3em]"
                  >
                    No items registered in current terminal
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.publicId}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="p-6 text-center">
                      <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#0dcaf0] border border-slate-700/50 group-hover:border-[#0dcaf0]/30 transition-all duration-500">
                        <Package size={24} />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[#0dcaf0] font-mono text-base font-black tracking-widest uppercase">
                          {item.sku}
                        </span>
                        <span className="text-white font-bold text-lg tracking-tight mt-0.5">
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 italic opacity-80">
                          {item.description || "No technical specifications"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-900 text-slate-400 text-[10px] font-black rounded-lg border border-slate-800 uppercase tracking-widest">
                        {item.baseUom}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-white font-black text-base italic">
                          <Weight
                            size={14}
                            className="text-[#0dcaf0] opacity-50"
                          />
                          {item.weightPerUnit}{" "}
                          <span className="text-[10px] text-slate-500 not-italic">
                            KG
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <Gauge
                          size={16}
                          className="text-amber-500 opacity-50"
                        />
                        <span className="text-amber-500 font-black text-base">
                          {item.minStockLevel}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: NEW SKU ENTRY (Tetap Mempertahankan Elemen Ori) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#1a1d21] border border-slate-800 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0dcaf0]/5 blur-[80px] rounded-full"></div>

            <div className="flex justify-between items-center mb-10 relative z-10 text-left">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
                  New SKU <span className="text-[#0dcaf0]">Entry</span>
                </h2>
                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.4em] font-bold">
                  Configure Global Item Properties
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8 relative z-10 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Unique SKU
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-6 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none transition-all font-mono font-bold tracking-widest"
                    placeholder="E.G. ITEM-001"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-6 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none transition-all font-bold"
                    placeholder="E.G. LIQUID NITROGEN"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value.toUpperCase() })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    UoM
                  </label>
                  <select
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none appearance-none cursor-pointer"
                    value={form.baseUom}
                    onChange={(e) =>
                      setForm({ ...form, baseUom: e.target.value })
                    }
                  >
                    <option value="PCS">PCS</option>
                    <option value="BOX">BOX</option>
                    <option value="KG">KG</option>
                    <option value="GR">GR</option>
                    <option value="ML">ML</option>
                  </select>
                </div>
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Safety Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-amber-500 px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none text-center font-bold"
                    value={form.minStockLevel}
                    onChange={(e) =>
                      setForm({ ...form, minStockLevel: e.target.value })
                    }
                  />
                  <div className="text-amber-500/50 text-[9px] font-black uppercase mt-2 tracking-tighter">
                    {formatUnit(form.minStockLevel, form.baseUom)}
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Unit Weight
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-5 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none text-center font-bold"
                    value={form.weightPerUnit}
                    onChange={(e) =>
                      setForm({ ...form, weightPerUnit: e.target.value })
                    }
                  />
                  <div className="text-[#0dcaf0]/50 text-[9px] font-black uppercase mt-2 tracking-tighter">
                    {formatUnit(form.weightPerUnit, "KG")}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Technical Description
                </label>
                <textarea
                  rows="2"
                  className="w-full bg-[#121416] border border-slate-800 text-white px-6 py-4 rounded-2xl focus:border-[#0dcaf0] outline-none resize-none"
                  placeholder="Optional technical specifications..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl text-slate-500 font-black hover:bg-slate-800 transition-all uppercase text-[11px] tracking-widest"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-[#0dcaf0] text-black font-black px-8 py-5 rounded-2xl hover:bg-white transition-all uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#0dcaf0]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Confirm & Save SKU"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
