import React from "react";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function BudgetingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
    <Breadcrumbs 
      items={[
        { label: "Perencanaan Anggaran", path: "/finance/cashflow" } 
      ]} 
    />
      <div className="flex justify-between items-center mb-6">
        <H2>Perencanaan Anggaran (Q4 2023)</H2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Tambah Pos Anggaran
        </button>
      </div>

      {/* Alert / Insight */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="text-orange-600 mt-0.5" size={20} />
        <div>
            <h4 className="text-sm font-bold text-orange-800">Perhatian: Over-budget</h4>
            <p className="text-xs text-orange-700 mt-1">
                Pos "Marketing" telah melebihi anggaran sebesar 15%. Harap tinjau ulang pengeluaran iklan.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Budget Item */}
        {['Marketing', 'IT Infrastructure', 'Operasional Kantor', 'HR & Training'].map((dept, idx) => (
             <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{dept}</h3>
                            <p className="text-xs text-gray-500">Divisi Utama</p>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">On Track</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">Terpakai</span>
                    <span className="font-semibold text-gray-800">Rp 45jt / Rp 100jt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button className="flex-1 text-xs font-medium text-gray-600 hover:text-blue-600 text-center">
                        Edit Budget
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button className="flex-1 text-xs font-medium text-gray-600 hover:text-blue-600 text-center">
                        Lihat Detail
                    </button>
                </div>
             </div>
        ))}
      </div>
    </div>
  );
}