import React, { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../api/DashboardService";
import {
  Warehouse,
  Package,
  Loader2,
  Landmark,
  ArrowUpRight,
  Boxes,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const metricCards = [
  {
    key: "totalItems",
    label: "Registered items",
    description: "Items in the catalog",
    icon: Package,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    key: "totalWarehouses",
    label: "Warehouses",
    description: "Registered locations",
    icon: Warehouse,
    iconClass: "bg-violet-50 text-violet-700",
  },
  {
    key: "totalBins",
    label: "Storage bins",
    description: "Storage locations",
    icon: Landmark,
    iconClass: "bg-amber-50 text-amber-700",
  },
];

const formatMetric = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString();
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error("Dashboard sync failed", err);
      setError("Dashboard data could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Warehouse operations</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            A clear overview of your warehouse network, catalog, and storage locations.
          </p>
        </div>
      </section>

      {error ? (
        <section
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} />
            <div>
              <h2 className="font-semibold text-rose-900">Unable to load dashboard</h2>
              <p className="mt-1 text-sm leading-6 text-rose-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Try again
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metricCards.map(({ key, label, description, icon: Icon, iconClass }) => (
            <article
              key={key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {loading ? (
                      <Loader2 className="animate-spin text-slate-400" size={27} />
                    ) : (
                      formatMetric(summary?.[key])
                    )}
                  </div>
                </div>
                <div className={`rounded-xl p-3 ${iconClass}`}>
                  <Icon size={21} strokeWidth={1.9} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <ArrowUpRight size={14} className="text-slate-400" />
                {description}
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Boxes size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Inventory workspace</h2>
              <p className="mt-0.5 text-sm text-slate-500">Your warehouse data at a glance</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Manage warehouse locations, storage bins, and item records from one workspace.
            Use the navigation to review inventory and process stock movements.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Data integrity
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Traceable inventory movements
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review inbound, outbound, and transfer activity in the inventory ledger to follow recorded stock changes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
