import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, X, Trash2, Save, User } from 'lucide-react';
import { useStore } from '../store';
import type { Planning } from '../types';

const CalendarPage: React.FC = () => {
    const { planning, updatePlan, removePlan } = useStore();
    const [viewDate, setViewDate] = useState(new Date());
    const [editingPlan, setEditingPlan] = useState<Planning | null>(null);
    const [formData, setFormData] = useState<Partial<Planning>>({});

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startDay = monthStart.getDay();
    const totalDays = monthEnd.getDate();

    const prevMonthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
    const prevMonthDays = Array.from({ length: startDay }, (_, i) => ({
        day: prevMonthEnd - startDay + i + 1,
        isCurrentMonth: false,
        month: viewDate.getMonth() - 1,
        year: viewDate.getFullYear()
    }));

    const currentMonthDays = Array.from({ length: totalDays }, (_, i) => ({
        day: i + 1,
        isCurrentMonth: true,
        month: viewDate.getMonth(),
        year: viewDate.getFullYear()
    }));

    const nextMonthPadding = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: nextMonthPadding }, (_, i) => ({
        day: i + 1,
        isCurrentMonth: false,
        month: viewDate.getMonth() + 1,
        year: viewDate.getFullYear()
    }));

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const isToday = (d: number, m: number, y: number) => {
        const today = new Date();
        return today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                        </h3>
                        <p className="text-sm text-slate-500">Gestión de itinerarios mensuales</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setViewDate(new Date())} className="px-4 py-2 hover:bg-white hover:shadow-sm rounded-xl font-bold text-sm text-blue-600 transition-all">
                        HOY
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {allDays.map((dateObj, i) => {
                        const dayPlanning = planning.filter(p =>
                            p.dia === dateObj.day &&
                            p.mes === (dateObj.month + 1) &&
                            p.anio === dateObj.year
                        );

                        return (
                            <div
                                key={i}
                                className={`min-h-[140px] border-r border-b border-slate-50 p-3 transition-all hover:bg-slate-50/50 ${!dateObj.isCurrentMonth ? 'bg-slate-50/20' : ''}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-sm font-black transition-all ${isToday(dateObj.day, dateObj.month, dateObj.year)
                                        ? 'bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-blue-200'
                                        : dateObj.isCurrentMonth ? 'text-slate-700' : 'text-slate-200'
                                        }`}>
                                        {dateObj.day}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    {dayPlanning.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleEditClick(item)}
                                            className="px-2 py-1.5 bg-blue-50/50 border border-blue-100/50 rounded-lg text-[10px] font-bold text-blue-700 leading-tight hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer flex flex-col gap-0.5"
                                        >
                                            <div className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {item.horario}
                                            </div>
                                            <div className="truncate">{item.nombreMedico}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Edit Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Editar Cita</h3>
                                <p className="text-xs text-slate-500 font-medium">Actualiza los detalles de la visita</p>
                            </div>
                            <button onClick={() => setEditingPlan(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Médico / Lugar</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                        value={formData.nombreMedico || ''}
                                        onChange={e => setFormData({ ...formData, nombreMedico: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horario</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                        placeholder="Ej: 09:00"
                                        value={formData.horario || ''}
                                        onChange={e => setFormData({ ...formData, horario: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                        value={formData.direccion || ''}
                                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button
                                onClick={handleDeletePlan}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Eliminar cita"
                            >
                                <Trash2 size={24} />
                            </button>
                            <div className="flex-1"></div>
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="px-6 py-2.5 font-bold text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <Save size={18} />
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
