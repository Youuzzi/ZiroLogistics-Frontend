import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/DashboardService";
import {
  Warehouse,
  Package,
  Activity,
  Loader2,
  Landmark,
  ArrowUpRight,
  Boxes,
} from "lucide-react";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalWarehouses: 0,
    totalBins: 0,
    totalItems: 0,
    totalTransactionsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const metrics = [
    {
      label: "Registered items",
      value: summary.totalItems,
      description: "Items in the catalog",
      icon: Package,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      label: "Warehouses",
      value: summary.totalWarehouses,
      description: "Registered locations",
      icon: Warehouse,
      iconClass: "bg-violet-50 text-violet-700",
    },
    {
      label: "Storage bins",
      value: summary.totalBins,
      description: "Storage locations",
      icon: Landmark,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Transactions today",
      value: summary.totalTransactionsToday,
      description: "Inventory movements",
      icon: Activity,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Warehouse operations</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            A clear overview of your warehouse network, catalog, storage locations, and daily activity.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Workspace available
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, description, icon: Icon, iconClass }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {loading ? (
                    <Loader2 className="animate-spin text-slate-400" size={27} />
                  ) : (
                    Number(value ?? 0).toLocaleString()
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
