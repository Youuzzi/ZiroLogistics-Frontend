import React, { useState, useEffect } from "react";
import { getItems } from "../api/ItemService";
import { getInventoryStocks } from "../api/InventoryService";
import { getWarehouses } from "../api/WarehouseService";
import { getBinsByWarehouse } from "../api/BinService"; // IMPORT DARI TEMPAT YANG BENAR
import { processTransfer } from "../api/TransferService";
import {
  ArrowRightLeft,
  Box,
  MapPin,
  Loader2,
  ShieldCheck,
  Weight,
} from "lucide-react";
import toast from "react-hot-toast";

const Transfer = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [sourceStocks, setSourceStocks] = useState([]);
  const [destBins, setDestBins] = useState([]);
  const [requestId, setRequestId] = useState(crypto.randomUUID());

  const [form, setForm] = useState({
    sku: "",
    sourceBinCode: "",
    destWarehouseId: "",
    destinationBinCode: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    const loadBase = async () => {
      try {
        const [resItems, resWh] = await Promise.all([
          getItems(0, 100),
          getWarehouses(0, 100),
        ]);
        setItems(resItems.data.content || []);
        setWarehouses(resWh.data.content || []);
      } catch (err) {
        toast.error("Sync Failed");
      }
    };
    loadBase();
  }, []);

  const handleSkuChange = async (sku) => {
    setForm({ ...form, sku, sourceBinCode: "", destinationBinCode: "" });
    try {
      const { data } = await getInventoryStocks(0, 100);
      setSourceStocks(
        data.content.filter((s) => s.itemSku === sku && s.quantity > 0),
      );
    } catch (err) {
      toast.error("Stock search failed");
    }
  };

  const handleDestWhChange = async (whId) => {
    setForm({ ...form, destWarehouseId: whId, destinationBinCode: "" });
    try {
      // FIX: Panggil getBinsByWarehouse yang benar
      const { data } = await getBinsByWarehouse(whId);
      setDestBins(data || []);
    } catch (err) {
      toast.error("Target Bins failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        requestId,
        sku: form.sku,
        sourceBinCode: form.sourceBinCode,
        destinationBinCode: form.destinationBinCode,
        quantity: parseFloat(form.quantity),
        note: form.note,
      };
      await processTransfer(payload);
      toast.success("Relocation Complete");
      setForm({
        sku: "",
        sourceBinCode: "",
        destWarehouseId: "",
        destinationBinCode: "",
        quantity: "",
        note: "",
      });
      setRequestId(crypto.randomUUID());
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer Denied");
    } finally {
      setLoading(false);
    }
  };

  const selectedSource = sourceStocks.find(
    (s) => s.binCode === form.sourceBinCode,
  );
  const selectedItem = items.find((i) => i.sku === form.sku);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-5 border-b border-slate-800 pb-8 text-left">
        <div className="p-4 bg-[#0dcaf0]/10 rounded-2xl text-[#0dcaf0] border border-[#0dcaf0]/20 shadow-[0_0_20px_rgba(13,202,240,0.1)]">
          <ArrowRightLeft size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Internal Transfer
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Asset Relocation Engine
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
      >
        <div className="lg:col-span-7 bg-[#1a1d21] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Identify SKU
              </label>
              <select
                required
                className="w-full bg-[#121416] border border-slate-800 text-white p-4 rounded-2xl outline-none focus:border-[#0dcaf0] appearance-none"
                value={form.sku}
                onChange={(e) => handleSkuChange(e.target.value)}
              >
                <option value="">-- SKU --</option>
                {items.map((i) => (
                  <option key={i.publicId} value={i.sku}>
                    {i.sku}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Source Bin
              </label>
              <select
                required
                disabled={!form.sku}
                className="w-full bg-[#121416] border border-slate-800 text-white p-4 rounded-2xl outline-none focus:border-[#0dcaf0] appearance-none disabled:opacity-20"
                value={form.sourceBinCode}
                onChange={(e) =>
                  setForm({ ...form, sourceBinCode: e.target.value })
                }
              >
                <option value="">-- From Bin --</option>
                {sourceStocks.map((s) => (
                  <option key={s.binCode} value={s.binCode}>
                    {s.binCode} ({s.quantity})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Quantity to Move
            </span>
            <input
              type="number"
              step="0.01"
              required
              className="bg-transparent text-5xl font-black text-[#0dcaf0] outline-none w-full mt-2"
              placeholder="0.00"
              max={selectedSource?.quantity || 0}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#1a1d21] border border-[#0dcaf0]/20 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#0dcaf0]">
            <MapPin size={120} />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Destination Terminal
              </label>
              <select
                required
                className="bg-[#121416] border border-slate-800 text-white p-4 rounded-2xl w-full outline-none focus:border-[#0dcaf0] appearance-none"
                value={form.destWarehouseId}
                onChange={(e) => handleDestWhChange(e.target.value)}
              >
                <option value="">-- Target Warehouse --</option>
                {warehouses.map((wh) => (
                  <option key={wh.publicId} value={wh.publicId}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Destination Bin
              </label>
              <select
                required
                disabled={!form.destWarehouseId}
                className="bg-[#121416] border border-slate-800 text-[#0dcaf0] p-4 rounded-2xl w-full outline-none focus:border-[#0dcaf0] appearance-none font-bold"
                value={form.destinationBinCode}
                onChange={(e) =>
                  setForm({ ...form, destinationBinCode: e.target.value })
                }
              >
                <option value="">-- Target Bin --</option>
                {destBins.map((b) => (
                  <option key={b.publicId} value={b.binCode}>
                    {b.binCode}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={loading || !form.destinationBinCode || !form.quantity}
              className="w-full bg-[#0dcaf0] text-black font-black py-5 rounded-[1.5rem] hover:bg-[#0bb5d6] transition-all shadow-lg shadow-[#0dcaf0]/20 disabled:opacity-20"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "CONFIRM TRANSFER"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Transfer;
