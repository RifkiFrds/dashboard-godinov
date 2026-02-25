import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, RefreshCw } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import api from "../../api";
import { toast, ToastContainer } from 'react-toastify';

// Integrasi Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount || 0);
};

const StatCard = ({ title, amount, type }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{amount}</h3>
        </div>
        <div className={`p-3 rounded-full ${type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {type === 'in' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
        </div>
    </div>
);

export default function CashFlowPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRecalculating, setIsRecalculating] = useState(false);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/finance/cashflow');
            setSummary(response.data.data);
        } catch (error) {
            toast.error("Gagal memuat ringkasan keuangan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const handleRecalculate = async () => {
        setIsRecalculating(true);
        try {
            const response = await api.post('/api/finance/cashflow/recalculate');
            setSummary(response.data.data);
            toast.success("Data berhasil diperbarui.");
        } catch (error) {
            toast.error("Gagal menghitung ulang data.");
        } finally {
            setIsRecalculating(false);
        }
    };

    // Data Visualisasi Arus Kas (Hanya Pemasukan vs Pengeluaran)
    const incomeTotal = useMemo(() => 
        Number(summary?.total_revenue || 0) + Number(summary?.total_partially_paid_revenue || 0), 
    [summary]);

    const chartData = useMemo(() => ({
        labels: ['Total Pemasukan', 'Total Pengeluaran'],
        datasets: [{
            data: [incomeTotal, summary?.total_expenses || 0],
            backgroundColor: ['#10B981', '#EF4444'],
            hoverOffset: 4
        }]
    }), [incomeTotal, summary]);

    if (loading && !summary) return <div className="p-10 text-center">Memuat data...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <Breadcrumbs items={[{ label: "Cash Flow Monitor", path: "/finance/cashflow" }]} />

            <div className="flex justify-between items-center mb-8 gap-4">
                <div>
                    <H2>Cash Flow Monitor</H2>
                    <p className="text-gray-500 text-sm mt-1">Monitoring real-time pemasukan dan pengeluaran.</p>
                </div>
                <button 
                    onClick={handleRecalculate}
                    disabled={isRecalculating}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isRecalculating ? "animate-spin" : ""} />
                    {isRecalculating ? "Menghitung..." : "Recalculate"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Total Pemasukan" amount={formatCurrency(incomeTotal)} type="in" />
                <StatCard title="Total Pengeluaran" amount={formatCurrency(summary?.total_expenses)} type="out" />
                <div className="bg-blue-600 p-5 rounded-xl text-white shadow-md flex flex-col justify-center">
                    <p className="text-blue-100 text-sm mb-1">Saldo Kas Saat Ini</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(summary?.net_cash_flow)}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Analisa Pemasukan vs Pengeluaran</h3>
                    <div className="h-72">
                        <Bar 
                            data={{
                                labels: ['Cash Flow'],
                                datasets: [
                                    { label: 'Pemasukan', data: [incomeTotal], backgroundColor: '#10B981' },
                                    { label: 'Pengeluaran', data: [summary?.total_expenses || 0], backgroundColor: '#EF4444' }
                                ]
                            }}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center">
                    <h3 className="font-bold text-gray-800 mb-6 w-full">Proporsi Kas</h3>
                    <div className="h-64 w-full">
                        <Doughnut 
                            data={chartData} 
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}