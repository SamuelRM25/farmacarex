import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Download } from 'lucide-react';
import { useStore } from '../store';
import { exportSalesSummary } from '../utils/pdfExport';
import { exportElementAsImage } from '../utils/imageExport';

const SalesPage: React.FC = () => {
    const { visits } = useStore();

    // Filter only visits that had a sale
    const sales = visits.filter(v => v.completada && v.sale && v.sale.total > 0);
    const totalSales = sales.reduce((acc, v) => acc + (v.sale?.total || 0), 0);

    const [period, setPeriod] = useState('day'); // Added for new component functionality

    return (
        <div className="space-y-6 md:space-y-10 animate-slide-up pb-10">
            {/* Header / Stats Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[3rem] border border-white/60 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-white/40 to-indigo-50/20 dark:from-slate-900/40 dark:to-indigo-950/20">
                    <div className="flex-1">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic mb-4">Registro Histórico</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Visualiza tus transacciones y métricas de rendimiento comercial por periodo.</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-3xl border border-slate-200 dark:border-white/5 w-full md:w-auto">
                        <button
                            onClick={() => setPeriod('day')}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${period === 'day' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                        >
                            Día
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${period === 'month' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => exportSalesSummary(visits)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 ml-2"
                        >
                            <Download size={14} /> PDF
                        </button>
                        <button
                            onClick={() => exportElementAsImage('sales-report-table', `Ventas_${new Date().toISOString().split('T')[0]}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 active:scale-95 ml-2"
                        >
                            <Download size={14} /> JPG
                        </button>
                    </div>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-[3rem] border border-white/60 dark:border-white/10 bg-slate-900 dark:bg-black text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-150" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <TrendingUp size={24} className="text-indigo-300" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Total Acumulado</span>
                        </div>
                        <div className="mt-8">
                            <p className="text-4xl font-black tracking-tighter tabular-nums leading-none">Q {totalSales.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table View */}
            <div id="sales-report-table" className="glass-card rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/5">
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Detalle de Transacciones</h3>
                </div>
                {sales.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fecha / Cliente</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Resumen de Ítems</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Monto Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl group-hover:rotate-6 transition-transform">
                                                    {sale.clientName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none mb-2">{sale.clientName}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">{sale.fecha}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{sale.hora}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2 max-w-sm">
                                                {sale.sale?.items.map((item, idx) => ( // Changed from sale.items to sale.sale?.items
                                                    <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-colors group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30">
                                                        {item.medicineName} x{item.cantidad}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter tabular-nums leading-none mb-1">Q {sale.sale?.total.toFixed(2)}</p> {/* Changed from sale.total to sale.sale?.total */}
                                            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Confirmado</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-200 dark:text-slate-700 border-2 border-dashed border-slate-200 dark:border-white/10 animate-pulse mb-8">
                            <ShoppingCart size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sin Ventas Registradas</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xs mt-3 leading-relaxed">
                            No se han encontrado transacciones para el periodo seleccionado.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesPage;
