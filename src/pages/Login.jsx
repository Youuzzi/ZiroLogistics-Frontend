import React, { useState } from "react";
import api from "../api/AxiosConfig";
import logo from "../assets/Vertical.png";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}`);
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121416]">
      <div className="w-full max-w-md p-8 bg-[#1a1d21]/50 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="Ziro"
            className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(13,202,240,0.3)]"
          />
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            ZIRO<span className="text-[#0dcaf0]">LOGISTICS</span>
          </h1>
          <div className="h-0.5 w-12 bg-[#0dcaf0] mt-2 rounded-full opacity-50"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
              Email Terminal
            </label>
            <input
              type="email"
              required
              className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all duration-300"
              placeholder="admin@zirocraft.com"
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
              Security Key
            </label>
            <input
              type="password"
              required
              className="w-full bg-[#121416] border border-slate-800 text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-[#0dcaf0] transition-all duration-300"
              placeholder="••••••••"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-[#0dcaf0] text-black font-black py-4 rounded-2xl hover:bg-[#0bb5d6] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(13,202,240,0.2)]"
          >
            {loading ? (
              "VERIFYING..."
            ) : (
              <>
                <LogIn size={18} strokeWidth={3} /> ACCESS SYSTEM
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            © 2026 Zirocraft Studio
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
