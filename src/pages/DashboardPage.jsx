import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Inbox,
  BarChart3,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Selamat datang kembali 👋
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavLink to="/inbox">
            <QuickAction
              title="Lihat Semua Pesan"
              desc="Masuk ke halaman messages"
            />
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

/* ---------------- COMPONENTS ------------------ */

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
    </div>
  );
}

function QuickAction({ title, desc }) {
  return (
    <button className="p-4 rounded-xl w-full bg-gray-50 hover:bg-gray-100 text-left border border-gray-200 transition flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </button>
  );
}
