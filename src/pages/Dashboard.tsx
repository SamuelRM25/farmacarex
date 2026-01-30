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
        <div className="space-y-8 md:space-y-12 animate-slide-up pb-10">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-1 bg-white/10">
                <div className="absolute inset-0 bg-slate-400/5 opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 p-8 md:p-14 md:flex items-center justify-between gap-10">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none italic">
                            ¡Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">FarmaCarex</span>!
                        </h1>
                    </div>
                    <div className="hidden md:block w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-[40px] rounded-full"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Estado</span>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">Online</span>
                                <div className="w-8 h-1 bg-emerald-500 rounded-full mt-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[130px] rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Clientes', value: clients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Estratégicos' },
                    { title: 'Productos', value: medicines.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Vademécum' },
                    { title: 'Visitas Hoy', value: todayPlanning.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Planificadas' },
                    { title: 'Ventas Total', value: `Q ${totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Día actual' },
                ].map((stat) => (
                    <div key={stat.title} className="glass-card p-6 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-sm border ${stat.border} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{stat.label}</span>
                                <div className="w-8 h-0.5 bg-slate-100 mt-1 transition-all group-hover:w-12 group-hover:bg-indigo-200"></div>
                            </div>
                        </div>
                        <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Workflow / Activities */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-2xl shadow-slate-200/30 overflow-hidden">
                <div className="p-8 md:p-10 border-b border-slate-100/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50/20">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cierre de Actividad</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Sincroniza tus visitas y genera la inteligencia del día.</p>
                    </div>
                    <button
                        onClick={handleEndDay}
                        disabled={visits.length === 0}
                        className={`group relative overflow-hidden flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl ${visits.length === 0
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95'
                            }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FileText size={20} strokeWidth={3} className="relative z-10 transition-transform group-hover:rotate-12" />
                        <span className="relative z-10">Finalizar Jornada</span>
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    {visits.length > 0 ? (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 bg-slate-100 flex-1"></div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Registro Cronológico</h3>
                                <div className="h-0.5 bg-slate-100 flex-1"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {visits.map((visit) => (
                                    <div key={visit.id} className="group p-6 bg-white/50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 rounded-[2rem] flex flex-col gap-4 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold shadow-sm transition-transform group-hover:scale-110">
                                                {visit.clientName[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-extrabold text-slate-900 dark:text-white text-base truncate tracking-tight">{visit.clientName}</p>
                                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-widest mt-0.5">{visit.hora}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            {visit.sale ? (
                                                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    Q {visit.sale.total.toFixed(2)}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                                    Sin Venta
                                                </div>
                                            )}
                                            <div className="p-2 bg-slate-50 group-hover:bg-indigo-50 rounded-lg text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                <FileText size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-slate-50/50 rounded-full flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200 animate-pulse">
                                    <RotateCcw size={40} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-slate-100">
                                    <Calendar className="text-indigo-400" size={16} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Esperando Actividad</h3>
                            <p className="text-slate-400 font-medium max-w-xs mt-3 leading-relaxed">
                                Tu jornada está lista para comenzar. Completa visitas en el módulo de <span className="text-indigo-600 font-bold">Planificación</span> para verlas aquí.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
