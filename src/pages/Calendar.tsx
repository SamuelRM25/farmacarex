import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, X, Trash2, Save, User } from 'lucide-react';
import { useStore } from '../store';
import type { Planning } from '../types';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CalendarPage: React.FC = () => {
    const { planning, updatePlan, removePlan } = useStore();
    const [viewDate, setViewDate] = useState(new Date());
    const [editingPlan, setEditingPlan] = useState<Planning | null>(null);
    const [formData, setFormData] = useState<Partial<Planning>>({});

    const getMonthDates = () => {
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        const dates = [];
        const startDay = start.getDay() || 7;

        // Padding for previous month
        for (let i = startDay - 1; i > 0; i--) {
            const d = new Date(start);
            d.setDate(d.getDate() - i);
            dates.push(d);
        }

        // Current month
        for (let i = 1; i <= end.getDate(); i++) {
            dates.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
        }

        return dates;
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const handleEditClick = (plan: Planning) => {
        setEditingPlan(plan);
        setFormData(plan);
    };

    const handleSaveEdit = async () => {
        if (editingPlan && formData) {
            await updatePlan({ ...editingPlan, ...formData } as Planning);
            setEditingPlan(null);
        }
    };

    const handleDeletePlan = async () => {
        if (editingPlan && confirm('¿Estás seguro de eliminar esta cita?')) {
            await removePlan(editingPlan.id);
            setEditingPlan(null);
        }
    };

    const monthDates = getMonthDates();

    return (
        <>
            <div className="space-y-6 md:space-y-8 animate-slide-up pb-20">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="relative z-10 p-6 md:p-10 flex flex-col xl:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10 w-full md:w-auto justify-between md:justify-start">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="px-4 text-center min-w-[200px]">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                                    {viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).split(' de ').join(' ').toUpperCase()}
                                </h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
                                    <CalendarIcon size={10} />
                                    {viewDate.getFullYear()}
                                </p>
                            </div>
                            <button
                                onClick={() => changeMonth(1)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <button
                            onClick={() => setViewDate(new Date())}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95"
                        >
                            <CalendarIcon size={18} /> Ir a Hoy
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="glass-card rounded-[3.5rem] border border-white dark:border-white/5 shadow-2xl overflow-hidden bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl">
                    <div className="grid grid-cols-7 bg-indigo-600 dark:bg-indigo-900/40 border-b border-indigo-500/20">
                        {DAYS.map(day => (
                            <div key={day} className="py-6 text-center text-[10px] font-black text-white/70 dark:text-indigo-300 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-white/5">
                        {monthDates.map((date, i) => {
                            const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                            const isToday = date.toDateString() === new Date().toDateString();
                            const dayPlans = planning.filter(p => p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.Año === date.getFullYear());

                            return (
                                <div key={i} className={`min-h-[160px] p-4 group transition-all relative ${isCurrentMonth
                                    ? 'bg-white dark:bg-slate-900/30'
                                    : 'bg-slate-50/10 dark:bg-black/10 opacity-30 cursor-not-allowed'
                                    } ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}>
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <span className={`text-[12px] font-black leading-none ${isToday
                                            ? 'text-white bg-indigo-600 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none animate-pulse'
                                            : isCurrentMonth ? 'text-slate-900 dark:text-white mt-2 ml-2' : 'text-slate-300 mt-2 ml-2'
                                            }`}>
                                            {date.getDate()}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 relative z-10">
                                        {dayPlans.slice(0, 3).map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => handleEditClick(p)}
                                                className="text-[8px] font-black bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-2 rounded-xl text-slate-600 dark:text-slate-300 truncate uppercase tracking-tight shadow-sm hover:border-indigo-200 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <Clock size={10} className="text-indigo-500" />
                                                    {p.horario}
                                                </div>
                                                {p.nombreMedico.split('')[0]}. {p.nombreMedico.split(' ').slice(1).join(' ')}
                                            </div>
                                        ))}
                                        {dayPlans.length > 3 && (
                                            <div className="text-[8px] font-black text-indigo-500 dark:text-indigo-400 pl-2 uppercase tracking-widest py-1">
                                                + {dayPlans.length - 3} actividades
                                            </div>
                                        )}
                                    </div>
                                    {isToday && (
                                        <div className="absolute inset-0 border-2 border-indigo-500/20 dark:border-indigo-500/40 rounded-none pointer-events-none" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Edit Modal - Mobile Optimized */}
            {editingPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white dark:border-white/10 my-auto">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 relative shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Editar Cita</h3>
                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                    <span className="w-8 h-px bg-indigo-500 opacity-30" />
                                    Actualizar detalles
                                </p>
                            </div>
                            <button onClick={() => setEditingPlan(null)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-100 dark:border-white/10 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Médico / Lugar</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 dark:text-white"
                                        value={formData.nombreMedico || ''}
                                        onChange={e => setFormData({ ...formData, nombreMedico: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Horario</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 dark:text-white"
                                        placeholder="Ej: 09:00"
                                        value={formData.horario || ''}
                                        onChange={e => setFormData({ ...formData, horario: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 dark:text-white"
                                        value={formData.direccion || ''}
                                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3 shrink-0">
                            <button
                                onClick={handleDeletePlan}
                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                title="Eliminar cita"
                            >
                                <Trash2 size={20} />
                            </button>
                            <div className="flex-1"></div>
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                            >
                                <Save size={18} />
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CalendarPage;
