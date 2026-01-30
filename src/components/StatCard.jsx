import React from 'react'

export default function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
    </div>
  );
}
