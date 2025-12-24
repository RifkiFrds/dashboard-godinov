import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import QuickAction from "../components/QuickAction";
import { NavLink } from "react-router-dom";
import { Users, Inbox, BarChart3, CheckCircle, Loader2 } from "lucide-react";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInbox: 0,
    totalClient: 0,
    totalProcessed: 0,
    conversion: "0%",
  });
  const [loading, setLoading] = useState(true);

 const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [inboxRes, clientRes, processedRes] = await Promise.all([
        api.get("/api/inbox/stats/total"),
        api.get("/api/inbox/stats/clients"),
        api.get("/api/inbox/stats/processed"),
      ]);
      const inboxTotal = inboxRes.data["Total Inbox"] || 0;
      const clientTotal = clientRes.data["Total Klien"] || 0;
      const processedTotal = Number(processedRes.data["Total Sudah Diproses"]) || 0;

      setStats({
        totalInbox: inboxTotal,
        totalClient: clientTotal,
        totalProcessed: processedTotal,
        conversion: inboxTotal > 0 
          ? Math.round((processedTotal / inboxTotal) * 100) + "%" 
          : "0%"
      });
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Title & Refresh Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Selamat datang kembali 👋
        </h1>
        {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Inbox size={22} />}
          label="Total Inbox"
          value={loading ? "..." : stats.totalInbox}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Sudah Diproses"
          value={loading ? "..." : stats.totalProcessed}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Total Clients"
          value={loading ? "..." : stats.totalClient}
          color="bg-yellow-50 text-yellow-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NavLink to="/inbox">
            <QuickAction title="Lihat Semua Pesan" desc="Masuk ke halaman messages" />
          </NavLink>

          <NavLink to="/portfolio">
            <QuickAction
              title="Kelola Portfolio"
              desc="Tambahkan atau edit portofolio"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
}