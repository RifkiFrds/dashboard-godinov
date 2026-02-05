import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import QuickAction from "../components/QuickAction";
import { NavLink } from "react-router-dom";
import { 
  Users, Inbox, CheckCircle, Loader2, 
  Briefcase, FileText, DollarSign, LayoutList, Mail
} from "lucide-react";
import api from "../api";
import { useAuth } from "../api/AuthContext"; // Import context auth

export default function Dashboard() {
  const { user } = useAuth(); // Ambil data user & role
  const [stats, setStats] = useState({
    totalInbox: 0,
    totalClient: 0,
    totalProcessed: 0,
    // Tambahkan placeholder untuk role lain jika ada API-nya nanti
    activeProjects: 0,
    pendingInvoices: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Kita panggil API berdasarkan role atau panggil semua jika Admin
      const requests = [
        api.get("/api/inbox/stats/total"),
        api.get("/api/inbox/stats/clients"),
        api.get("/api/inbox/stats/processed"),
      ];

      // Contoh: Jika role-nya admin/finance, tambahkan request stats finance
      // if (user?.role === 'admin' || user?.role === 'finance') {
      //   requests.push(api.get("/api/finance/stats/summary"));
      // }

      const [inboxRes, clientRes, processedRes] = await Promise.all(requests);

      setStats((prev) => ({
        ...prev,
        totalInbox: inboxRes.data["Total Inbox"] || 0,
        totalClient: clientRes.data["Total Klien"] || 0,
        totalProcessed: Number(processedRes.data["Total Sudah Diproses"]) || 0,
      }));
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  // Logika Filter Statistik berdasarkan Role
  const renderStats = () => {
    const commonStats = [
      <StatCard
        key="inbox"
        icon={<Inbox size={22} />}
        label="Total Inbox"
        value={loading ? "..." : stats.totalInbox}
        color="bg-blue-50 text-blue-600"
      />
    ];

    // Jika Role adalah Developer (UIUX, FE, BE)
    if (["uiux", "frontend", "backend", "pm"].includes(user?.role)) {
      commonStats.push(
        <StatCard
          key="processed"
          icon={<CheckCircle size={22} />}
          label="Tugas Selesai"
          value={loading ? "..." : stats.totalProcessed}
          color="bg-green-50 text-green-600"
        />,
        <StatCard
          key="projects"
          icon={<Briefcase size={22} />}
          label="Project Aktif"
          value={loading ? "..." : "0"} // Ganti dengan data asli nanti
          color="bg-purple-50 text-purple-600"
        />
      );
    }

    // Jika Role adalah Finance
    if (user?.role === "finance") {
      commonStats.push(
        <StatCard
          key="invoice"
          icon={<FileText size={22} />}
          label="Pending Invoices"
          value={loading ? "..." : "12"}
          color="bg-orange-50 text-orange-600"
        />,
        <StatCard
          key="revenue"
          icon={<DollarSign size={22} />}
          label="Bulan Ini"
          value={loading ? "..." : "Rp 24M"}
          color="bg-emerald-50 text-emerald-600"
        />
      );
    }

    // Jika Admin, tampilkan ringkasan klien
    if (user?.role === "admin") {
      commonStats.push(
        <StatCard
          key="clients"
          icon={<Users size={22} />}
          label="Total Clients"
          value={loading ? "..." : stats.totalClient}
          color="bg-yellow-50 text-yellow-600"
        />
      );
    }

    return commonStats;
  };

  // Logika Filter Quick Actions berdasarkan Role
  const renderActions = () => {
    const actions = [];

    // Action untuk Tim Produksi (Dev/Designer)
    if (["admin", "uiux", "frontend", "backend"].includes(user?.role)) {
      actions.push(
        <NavLink key="p-mgt" to="/projects">
          <QuickAction title="Manajemen Project" desc="Kelola tugas dan timeline" icon={<LayoutList size={20}/>} />
        </NavLink>,
        <NavLink key="portfolio" to="/portfolio">
          <QuickAction title="Update Portfolio" desc="Tambahkan hasil kerja baru" icon={<Briefcase size={20}/>} />
        </NavLink>
      );
    }

    // Action untuk Finance
    if (["admin", "finance"].includes(user?.role)) {
      actions.push(
        <NavLink key="finance" to="/finance/invoices">
          <QuickAction title="Kelola Invoice" desc="Cek tagihan klien" icon={<FileText size={20}/>} />
        </NavLink>,
        <NavLink key="payroll" to="/finance/payroll">
          <QuickAction title="Payroll" desc="Manajemen gaji karyawan" icon={<DollarSign size={20}/>} />
        </NavLink>
      );
    }

    // Action Umum
    actions.push(
      <NavLink key="inbox" to="/inbox">
        <QuickAction title="Lihat Pesan" desc="Cek pesan masuk terbaru" icon={<Mail size={20}/>} />
      </NavLink>
    );

    return actions;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan Nama User */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Halo, {user?.name || "User"}! 👋
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
            Role: {user?.role}
          </p>
        </div>
        {loading && <Loader2 className="animate-spin text-blue-600" size={24} />}
      </div>

      {/* Stats Section: Grid akan otomatis menyesuaikan jumlah kartu */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {renderStats()}
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {renderActions()}
        </div>
      </div>
    </div>
  );
}