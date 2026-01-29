import React from 'react';
import { ShoppingBag, TrendingUp, User } from 'lucide-react';
import { useStore } from '../store';

const SalesPage: React.FC = () => {
    const { visits } = useStore();

    // Filter only visits that had a sale
    const sales = visits.filter(v => v.completada && v.sale && v.sale.total > 0);
    const totalRevenue = sales.reduce((acc, v) => acc + (v.sale?.total || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tight flex items-center gap-3">
                        <ShoppingBag size={32} /> Reporte de Ventas
                    </h2>
                    <p className="text-blue-100 font-medium mt-2">Seguimiento de transacciones y pedidos realizados hoy.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-200">Total del Día</p>
                    <p className="text-4xl font-black mt-1">Q {totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Sales Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sales.map((sale) => (
                    <div key={sale.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{sale.clientName}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{sale.hora} • {sale.gira}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-900 italic">Q {sale.sale?.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-6 flex-1">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Productos Vendidos</h5>
                            <div className="space-y-3">
                                {sale.sale?.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span className="text-slate-600 font-medium">
                                                <span className="font-black text-slate-900">{item.cantidad}</span> x {item.medicineName}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 font-bold text-xs">Q {item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {sales.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 tracking-tight">No se han registrado ventas hoy</h3>
                        <p className="text-slate-300 max-w-xs mt-2 font-medium">
                            Completa una visita con pedidos en el módulo de <span className="text-blue-400">Visitas</span> para ver los resultados aquí.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesPage;
