import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Tambahkan ini
import { getBinsByWarehouse, createBin } from "../api/BinService";
import { Plus, LayoutGrid, Loader2, Weight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const Bins = () => {
  const { warehouseId } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    zoneName: "",
    rackNumber: "",
    binCode: "",
    maxWeightCapacity: 1000,
  });

  const fetchBins = async () => {
    setLoading(true);
    try {
      const { data } = await getBinsByWarehouse(warehouseId);
      setBins(data || []);
    } catch (err) {
      toast.error("Failed to load bin mapping");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, [warehouseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBin({ ...form, warehousePublicId: warehouseId });
      toast.success("Bin Successfully Created");
      setShowModal(false);
      setForm({
        zoneName: "",
        rackNumber: "",
        binCode: "",
        maxWeightCapacity: 1000,
      });
      fetchBins();
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation Failed");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
      {/* PRO HEADER: Ada tombol Back ke list Gudang */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/warehouses")}
            className="p-4 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-2xl hover:text-[#0dcaf0] hover:border-[#0dcaf0] transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Bin Matrix Terminal
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-1 font-bold">
              Storage Infrastructure:{" "}
              {bins[0]?.warehouseName || "Context Loading..."}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0dcaf0] text-black font-black px-6 py-3 rounded-xl shadow-lg shadow-[#0dcaf0]/20"
        >
          <Plus size={18} strokeWidth={3} /> INITIALIZE BIN
        </button>
      </div>

      {/* BINS GRID */}
      {loading ? (
        <div className="flex justify-center p-32">
          <Loader2 className="animate-spin text-[#0dcaf0]" size={48} />
        </div>
      ) : bins.length === 0 ? (
        <div className="p-32 text-center border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-600 uppercase text-xs font-black tracking-widest animate-pulse">
          No physical bin location assigned to this terminal
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bins.map((bin) => {
            const occupancyPercent =
              (bin.currentWeightOccupancy / bin.maxWeightCapacity) * 100;
            return (
              <div
                key={bin.publicId}
                className="bg-[#1a1d21] border border-slate-800 p-8 rounded-[2.5rem] hover:border-[#0dcaf0]/30 transition-all group relative overflow-hidden shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 opacity-[0.02] text-white group-hover:rotate-12 transition-transform duration-700">
                  <LayoutGrid size={180} />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-800 rounded-xl text-[#0dcaf0] group-hover:bg-[#0dcaf0] group-hover:text-black transition-all">
                    <LayoutGrid size={22} />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {bin.zoneName}
                  </span>
                </div>
                <h3 className="text-white font-black text-xl tracking-tight mb-4 uppercase">
                  {bin.binCode}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black tracking-tighter">
                    <span className="text-slate-500 uppercase">
                      Load Status
                    </span>
                    <span
                      className={
                        occupancyPercent > 85
                          ? "text-red-500 animate-pulse"
                          : "text-[#0dcaf0]"
                      }
                    >
                      {occupancyPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-1000 ${occupancyPercent > 85 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "bg-[#0dcaf0]"}`}
                      style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-bold uppercase text-[9px] pt-2">
                    <Weight size={12} /> {bin.currentWeightOccupancy} /{" "}
                    {bin.maxWeightCapacity} KG
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL (Sama seperti sebelumnya, kodingan modal lo tetap aman) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#121416]/95 backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="bg-[#1a1d21] border border-slate-800 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#0dcaf0]/10 blur-[80px] rounded-full"></div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-10 relative z-10">
              Initialize Bin Location
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none"
                  placeholder="ZONE (E.G. Area-A)"
                  value={form.zoneName}
                  onChange={(e) =>
                    setForm({ ...form, zoneName: e.target.value.toUpperCase() })
                  }
                />
                <input
                  required
                  className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none"
                  placeholder="RACK (E.G. R01)"
                  value={form.rackNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rackNumber: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <input
                required
                className="w-full bg-[#121416] border border-slate-800 text-[#0dcaf0] px-5 py-4 rounded-2xl focus:outline-none font-mono font-bold"
                placeholder="BIN CODE (E.G. A01-005)"
                value={form.binCode}
                onChange={(e) =>
                  setForm({ ...form, binCode: e.target.value.toUpperCase() })
                }
              />
              <input
                type="number"
                required
                className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-4 rounded-2xl focus:outline-none"
                value={form.maxWeightCapacity}
                onChange={(e) =>
                  setForm({ ...form, maxWeightCapacity: e.target.value })
                }
              />
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-slate-500 font-bold uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#0dcaf0] text-black font-black px-8 py-4 rounded-2xl hover:bg-[#0bb5d6] uppercase text-[10px] shadow-lg shadow-[#0dcaf0]/20"
                >
                  Confirm Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bins;
