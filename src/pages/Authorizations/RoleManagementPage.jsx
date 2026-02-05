import React, { useState, useEffect } from "react";
import { 
  UserCog, 
  Search, 
  Shield, 
  ShieldCheck, 
  User, 
  Save,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import { H2 } from "../../components/ui/Text";

export default function RoleManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const roles = [
    { id: 'admin', label: 'Administrator', color: 'bg-red-100 text-red-700', icon: ShieldCheck },
    { id: 'pm', label: 'Project Manager', color: 'bg-blue-100 text-blue-700', icon: Shield },
    { id: 'cfo', label: 'CFO (Finance)', color: 'bg-emerald-100 text-emerald-700', icon: Shield },
    { id: 'staff', label: 'Regular Staff', color: 'bg-gray-100 text-gray-700', icon: User },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/auth/users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        toast.success("Hak akses berhasil diperbarui");
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      toast.error("Gagal memperbarui role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <H2>Role Management</H2>
        <p className="text-gray-500 mt-1">Kelola level otorisasi dan hak akses karyawan dalam sistem.</p>
      </div>

      {/* Warning Box */}
      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-red-800">Area Sensitif</p>
          <p className="text-xs text-red-700 mt-1">
            Mengubah role pengguna akan langsung berdampak pada akses mereka ke data finansial dan approval project. Pastikan Anda melakukan verifikasi sebelum memberikan hak akses Admin atau CFO.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Cari user berdasarkan nama atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
        />
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />)
        ) : filteredUsers.map((u) => (
          <div key={u.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-400">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-gray-800 truncate">{u.name}</h3>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Access Level</label>
              <div className="relative">
                <select 
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className={`w-full appearance-none pl-10 pr-4 py-3 rounded-xl font-bold text-sm outline-none border-2 border-transparent transition-all cursor-pointer ${
                    roles.find(r => r.id === u.role)?.color || 'bg-gray-100'
                  }`}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                  {React.createElement(roles.find(r => r.id === u.role)?.icon || User, { size: 16 })}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}