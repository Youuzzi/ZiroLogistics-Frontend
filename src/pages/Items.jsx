import React, { useEffect, useState } from "react";
import { getItems, createItem } from "../api/ItemService";
import { Plus, Package, Ruler, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    baseUom: "PCS",
    minStockLevel: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await getItems();
      setItems(data.content || []);
    } catch (err) {
      toast.error("Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(form);
      toast.success("New SKU Registered Successfully");
      setShowModal(false);
      setForm({
        sku: "",
        name: "",
        description: "",
        baseUom: "PCS",
        minStockLevel: 0,
      });
      fetchItems();
    } catch (err) {
      const msg = err.response?.data?.error || "Registration Failed";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Product Catalog
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.4em] mt-1">
            Master SKU and stock level configuration
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0dcaf0] text-black font-black px-6 py-3 rounded-xl hover:bg-[#0bb5d6] transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(13,202,240,0.1)]"
        >
          <Plus size={20} strokeWidth={3} /> REGISTER SKU
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#1a1d21] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-20">
                Type
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                SKU / Item Name
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                UoM
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                Safety Stock
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-500">
                    <Loader2
                      className="animate-spin text-[#0dcaf0]"
                      size={40}
                    />
                    <span className="text-xs uppercase tracking-widest animate-pulse">
                      Syncing Master Data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-600 uppercase text-xs tracking-widest"
                >
                  Database is empty
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.publicId}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-6 text-center">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 mx-auto group-hover:text-[#0dcaf0] group-hover:border-[#0dcaf0]/30 border border-transparent transition-all">
                      <Package size={20} />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-[#0dcaf0] font-mono text-xs font-bold tracking-wider">
                        {item.sku}
                      </span>
                      <span className="text-white font-bold tracking-tight text-base mt-0.5">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 italic">
                        {item.description || "No description"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700">
                      {item.baseUom}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white font-bold">
                        {item.minStockLevel}
                      </span>
                      <AlertTriangle
                        size={14}
                        className="text-amber-500 opacity-50"
                      />
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 bg-cyan-500/10 text-[#0dcaf0] text-[10px] font-black rounded-full uppercase border border-cyan-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121416]/90 backdrop-blur-sm animate-in zoom-in duration-300">
          <div className="bg-[#1a1d21] border border-slate-800 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                New Stock Keeping Unit
              </h2>
              <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em]">
                Configure global item properties
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Unique SKU
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-6 py-4 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all font-mono"
                    placeholder="E.g: ITEM-001"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all"
                    placeholder="Product Display Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Base Unit (UoM)
                  </label>
                  <select
                    className="w-full bg-[#121416] border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all appearance-none"
                    value={form.baseUom}
                    onChange={(e) =>
                      setForm({ ...form, baseUom: e.target.value })
                    }
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="BOX">BOX (Packaging)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="GR">GR (Grams)</option>
                    <option value="ML">ML (Milliliters)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Safety Stock Level
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-amber-500 px-6 py-4 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all font-bold"
                    placeholder="0.00"
                    value={form.minStockLevel}
                    onChange={(e) =>
                      setForm({ ...form, minStockLevel: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Technical Description
                </label>
                <textarea
                  rows="2"
                  className="w-full bg-[#121416] border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all resize-none"
                  placeholder="Optional specifications..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl text-slate-500 font-bold hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#0dcaf0] text-black font-black px-8 py-5 rounded-2xl hover:bg-[#0bb5d6] transition-all uppercase text-xs tracking-widest shadow-xl shadow-[#0dcaf0]/10"
                >
                  Confirm & Save SKU
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
