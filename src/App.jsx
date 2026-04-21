import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Pages (Folder 'pages' kecil, File Kapital)
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import Items from "./pages/Items";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";
import Ledger from "./pages/Ledger";
import Bins from "./pages/Bins";
import Transfer from "./pages/Transfer";

// Import Component (Folder 'components' kecil)
import MainLayout from "./components/MainLayout";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <Warehouses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouses/:warehouseId/bins"
          element={
            <ProtectedRoute>
              <Bins />
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
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
