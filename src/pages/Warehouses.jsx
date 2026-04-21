import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWarehouses, createWarehouse } from "../api/WarehouseService";
import { Plus, Building2, Loader2, LayoutGrid, X } from "lucide-react";
import toast from "react-hot-toast";

const Warehouses = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Fix: Mencegah spam klik
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", address: "" });

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const { data } = await getWarehouses();
      // Pastikan content selalu array meski backend v3.2 mengembalikan empty page
      setWarehouses(data?.content || []);
    } catch (err) {
      console.error(err);
      toast.error("Database Sync Failed: Connection Terminated");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Lock button
    try {
      await createWarehouse(form);
      toast.success("Terminal indexing successful");
      setShowModal(false);
      setForm({ code: "", name: "", address: "" });
      fetchWarehouses();
    } catch (err) {
      // Menangkap pesan error spesifik dari GlobalExceptionHandler Backend
      const errorMsg =
        err.response?.data?.message || "Format kode atau data salah";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false); // Unlock button
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-800/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight uppercase italic">
            Warehouse <span className="text-[#0dcaf0]">Assets</span>
          </h1>
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.3em] mt-1 font-bold">
            Physical Infrastructure Control
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0dcaf0] hover:bg-[#0bb5d6] text-black font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0dcaf0]/10 active:scale-95 z-20"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="text-xs uppercase tracking-wider">Register New</span>
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#1a1d21] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Identification
                </th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Asset Name & Address
                </th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center w-48">
                  Control
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <Loader2
                      className="animate-spin text-[#0dcaf0] mx-auto"
                      size={32}
                    />
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] mt-4">
                      Syncing Master Terminal...
                    </p>
                  </td>
                </tr>
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">
                      No physical assets indexed in current sector
                    </p>
                  </td>
                </tr>
              ) : (
                warehouses.map((wh) => (
                  <tr
                    key={wh.publicId}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#0dcaf0] font-mono text-sm font-bold tracking-wider">
                          {wh.code}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono opacity-60">
                          ID: {wh.publicId.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center text-[#0dcaf0] border border-slate-700/50 shadow-inner group-hover:border-[#0dcaf0]/30 transition-all duration-500">
                          <Building2 size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base tracking-tight">
                            {wh.name}
                          </span>
                          <span className="text-slate-500 text-xs font-medium max-w-sm line-clamp-1">
                            {wh.address || "Main Terminal Hub"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() =>
                          navigate(`/warehouses/${wh.publicId}/bins`)
                        }
                        className="bg-slate-800/30 hover:bg-[#0dcaf0] text-[#0dcaf0] hover:text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-700/50 transition-all flex items-center gap-2 mx-auto"
                      >
                        <LayoutGrid size={14} /> Manage Bins
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SETUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d21] border border-slate-800 w-full max-w-2xl rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Decor */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#0dcaf0]/5 blur-[100px] rounded-full"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                  New Terminal <span className="text-[#0dcaf0]">Setup</span>
                </h2>
                <div className="h-0.5 w-12 bg-[#0dcaf0] mt-1"></div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Asset Code
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] p-4 rounded-xl focus:border-[#0dcaf0] outline-none font-mono text-base font-bold uppercase transition-all"
                    placeholder="WH-ID-01"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Terminal Name
                  </label>
                  <input
                    required
                    className="w-full bg-[#121416] border border-slate-800 text-white p-4 rounded-xl focus:border-[#0dcaf0] outline-none text-base font-semibold transition-all"
                    placeholder="Main Central Hub"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Deployment Address
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-[#121416] border border-slate-800 text-white p-4 rounded-xl focus:border-[#0dcaf0] outline-none text-sm resize-none transition-all"
                  placeholder="Physical location details..."
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0dcaf0] text-black font-black py-4 rounded-xl text-xs tracking-[0.2em] shadow-xl shadow-[#0dcaf0]/10 hover:bg-white hover:scale-[1.01] active:scale-95 transition-all uppercase flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Authorize Deployment"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
