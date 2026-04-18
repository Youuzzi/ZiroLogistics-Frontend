import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Warehouses from "./pages/Warehouses";
import Items from "./pages/Items";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";
import Ledger from "./pages/Ledger";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD OVERVIEW */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black text-white tracking-tighter">
                    ANALYTICS OVERVIEW
                  </h1>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.4em] mt-1">
                    Real-time inventory metrics
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#1a1d21] p-6 rounded-2xl border border-slate-800 hover:border-[#0dcaf0]/50 transition-all cursor-default group shadow-xl">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest group-hover:text-[#0dcaf0] transition-colors">
                      Total Stock Value
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">
                      Rp 540.000.000
                    </h2>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* SEMUA JEMBATAN MENU (STRICT PASCALCASE) */}
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <Warehouses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbound"
          element={
            <ProtectedRoute>
              <Inbound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outbound"
          element={
            <ProtectedRoute>
              <Outbound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <Ledger />
            </ProtectedRoute>
          }
        />

        {/* REDIRECTS */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
