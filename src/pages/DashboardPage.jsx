import React from "react";
import StatCard from "../components/StatCard";
import QuickAction from "../components/QuickAction";
import { NavLink } from "react-router-dom";
import { Users, Inbox, BarChart3, CheckCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Selamat datang kembali 👋
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Inbox size={22} />}
          label="Total Inbox"
          value="128"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Sudah Diproses"
          value="96"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Total Clients"
          value="42"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          icon={<BarChart3 size={22} />}
          label="Konversi"
          value="78%"
          color="bg-purple-50 text-purple-600"
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
