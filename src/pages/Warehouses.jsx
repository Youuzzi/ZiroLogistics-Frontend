import React, { useEffect, useState } from "react";
import { getWarehouses, createWarehouse } from "../api/WarehouseService";
import { Plus, MapPin, Building2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", address: "" });

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const { data } = await getWarehouses();
      // Backend v3.2 mengembalikan Page object, jadi kita ambil data.content
      setWarehouses(data.content || []);
    } catch (err) {
      toast.error("Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWarehouse(form);
      toast.success("New Warehouse Registered");
      setShowModal(false);
      setForm({ code: "", name: "", address: "" });
      fetchWarehouses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            WAREHOUSE ASSETS
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.4em] mt-1">
            Management of physical storage locations
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0dcaf0] text-black font-black px-6 py-3 rounded-xl hover:bg-[#0bb5d6] transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(13,202,240,0.1)]"
        >
          <Plus size={20} strokeWidth={3} /> REGISTER NEW
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#1a1d21] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ID / Code
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Warehouse Name
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Location Address
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-500">
                    <Loader2
                      className="animate-spin text-[#0dcaf0]"
                      size={40}
                    />
                    <span className="text-xs uppercase tracking-widest animate-pulse">
                      Syncing Data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : warehouses.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-20 text-center text-slate-600 uppercase text-xs tracking-widest"
                >
                  No warehouses found in terminal
                </td>
              </tr>
            ) : (
              warehouses.map((wh) => (
                <tr
                  key={wh.publicId}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold tracking-tight">
                        {wh.code}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono truncate w-32">
                        {wh.publicId}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#0dcaf0] group-hover:scale-110 transition-transform">
                        <Building2 size={18} />
                      </div>
                      <span className="text-slate-200 font-medium">
                        {wh.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-400 text-sm italic">
                    {wh.address || "No address provided"}
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase border border-emerald-500/20 tracking-tighter">
                      Operational
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REGISTER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121416]/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d21] border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                New Terminal
              </h2>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">
                Initialize a new storage asset
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Asset Code
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-5 py-3.5 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all"
                    placeholder="WH-JKT-01"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all"
                    placeholder="Main Hub"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Address Detail
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all resize-none"
                  placeholder="Enter physical location..."
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#0dcaf0] text-black font-black px-6 py-4 rounded-2xl hover:bg-[#0bb5d6] transition-all uppercase text-xs tracking-widest shadow-lg shadow-[#0dcaf0]/20"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
