import React from 'react';
import { useStore } from '../store';
import { reportService } from '../services/reports';
import { FileText, RotateCcw, TrendingUp, Users, Package, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { clients, medicines, visits, resetDay, planning } = useStore();

    const today = new Date();
    const todayPlanning = planning.filter(p =>
        p.dia === today.getDate() &&
        p.mes === (today.getMonth() + 1) &&
        p.anio === today.getFullYear()
    );

    const totalSales = visits.reduce((acc, v) => acc + (v.sale?.total || 0), 0);

    const handleEndDay = async () => {
        if (confirm('¿Estás seguro de finalizar el día? Se generará un reporte y se reiniciarán las visitas de hoy.')) {
            // Generate Report
            const reportData = visits.map(v => ({
                nombreMedico: v.clientName,
                horario: v.hora,
                direccion: v.notas || 'Visita completada',
                venta: v.sale?.total || 0
            }));

            reportService.generatePDFFromData(`Reporte Diario - ${today.toLocaleDateString()}`, reportData);

            // Reset Day
            await resetDay();
            alert('Día finalizado exitosamente. Reporte descargado.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter italic">
                        ¡Bienvenido a <span className="text-blue-400">FarmaCarex</span>!
                    </h1>
                    <p className="text-blue-200/80 text-xl max-w-xl font-medium leading-relaxed">
                        Tu centro de control táctico para visitas médicas e inventario farmacéutico.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-blue-500/20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Clientes', value: clients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Productos', value: medicines.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { title: 'Visitas Hoy', value: todayPlanning.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'Ventas Total', value: `Q ${totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">En Tiempo Real</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
                        <p className="text-3xl font-black text-slate-900 mt-1 tabular-nums tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* End of Day Workflow */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cierre de Jornada</h2>
                        <p className="text-sm text-slate-500 font-medium">Finaliza tus actividades y genera el reporte diario.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleEndDay}
                            disabled={visits.length === 0}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${visits.length === 0
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-black hover:shadow-slate-200 active:scale-95'
                                }`}
                        >
                            <FileText size={18} />
                            Finalizar Día
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {visits.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Actividades del Día</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {visits.map((visit) => (
                                    <div key={visit.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                                            <Users size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">{visit.clientName}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{visit.hora}</p>
                                            {visit.sale && (
                                                <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black">
                                                    VENTA: Q {visit.sale.total.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border-2 border-dashed border-slate-100">
                                <RotateCcw size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-400">No hay actividades registradas hoy</h3>
                            <p className="text-sm text-slate-300 max-w-xs mt-2">Completa visitas para poder generar tu reporte diario.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
