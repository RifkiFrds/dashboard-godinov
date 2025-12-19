import React from "react"
import { useState } from "react";
import api from "../api";
import { Button } from "../components/ui/Button";
import { H2, Text } from "../components/ui/Text";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import Footer from "../components/Footer";
import Lottie from "react-lottie-player";
import { toast } from "react-toastify";
import { setItemWithExpiry } from "../api/storage";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/login", { email, password });
      setItemWithExpiry("token", res.data.token, 3600000);// 1 j a m
      toast.success("Berhasil login!");
      navigate("/");
    } catch (err) {
      toast.error("Email atau password salah!");
      setErrorMsg(
        err.response?.data?.message ||
        "Login gagal, periksa kembali email & password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-godinov text-white flex flex-col">
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center p-10">
          <Lottie 
            path="/lottie/login.json"
            loop
            play
            className="w-[85%] h-[85%]"
          />
        </div>
        
        {/* LEFT — FORM */}
        <div className="flex items-center justify-center px-10">
          <div className="w-full max-w-md">
            
            <H2 className="text-center mb-2 text-godinov-cyan">
              Login Administrator
            </H2>

            <Text className="text-center text-white/60 mb-8">
              Masuk untuk mengelola dashboard GODINOV
            </Text>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-white/70 text-sm mb-1 block">Email</label>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2.5 rounded-lg border border-white/20">
                  <Mail size={18} className="text-white/60" />
                  <input
                    type="email"
                    required
                    placeholder="admin@godinov.com"
                    className="bg-transparent flex-1 text-white placeholder-white/40 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-white/70 text-sm mb-1 block">Password</label>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2.5 rounded-lg border border-white/20">
                  <Lock size={18} className="text-white/60" />
                  <input
                    type="password"
                    required
                    placeholder="********"
                    className="bg-transparent flex-1 text-white placeholder-white/40 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-godinov-cyan text-godinov-bg font-semibold hover:bg-godinov-cyan/80"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Login"}
              </Button>

            </form>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
