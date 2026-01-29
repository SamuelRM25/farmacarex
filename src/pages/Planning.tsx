import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, MapPin, User, Clock } from 'lucide-react';
import { useStore } from '../store';
import type { Planning } from '../types';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const PlanningPage: React.FC = () => {
    const { planning, addPlan, updatePlan, removePlan, tours, clients } = useStore();
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');

    // Extract unique municipalities from clients
    const municipalities = Array.from(new Set(clients.map(c => c.municipio))).filter(Boolean).sort();

    // Filtered doctors based on municipality
    const filteredDoctors = clients.filter(c => !selectedMunicipality || c.municipio === selectedMunicipality);

    // Calculate dates for current week (Mon-Fri)
    const getWeekDates = () => {
        const start = new Date(viewDate);
        const day = start.getDay() || 7;
        start.setDate(start.getDate() - day + 1); // Monday

        return DAYS.map((_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            return d;
        });
    };

    const weekDates = getWeekDates();

    const handleAddRoute = async (dayIndex: number) => {
        if (!selectedDoctor) {
            alert('Por favor selecciona un médico primero.');
            return;
        }

        const targetDate = weekDates[dayIndex];
        const doctor = clients.find(c => c.id === selectedDoctor);

        const newPlan: Planning = {
            id: Date.now().toString(),
            dia: targetDate.getDate(),
            mes: targetDate.getMonth() + 1,
            anio: targetDate.getFullYear(),
            gira: tours[0].nombre,
            horario: '08:00',
            direccion: doctor?.direccion || '',
            nombreMedico: doctor ? `${doctor.nombre} ${doctor.apellido}` : ''
        };
        await addPlan(newPlan);
        setSelectedDoctor('');
    };

    const handleDeletePlan = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta ruta?')) {
            await removePlan(id);
        }
    };

    const changeWeek = (offset: number) => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() + (offset * 7));
        setViewDate(d);
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => changeWeek(-1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            SEMANA DEL {weekDates[0].getDate()} AL {weekDates[4].getDate()} DE {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Planificación de Visitas</p>
                    </div>
                    <button
                        onClick={() => changeWeek(1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
                    <div className="flex-1 min-w-[200px] relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm font-medium"
                            value={selectedMunicipality}
                            onChange={(e) => { setSelectedMunicipality(e.target.value); setSelectedDoctor(''); }}
                        >
                            <option value="">Todos los Municipios</option>
                            {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[240px] relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm font-medium"
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option value="">Seleccionar Médico...</option>
                            {filteredDoctors.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.nombre} {d.apellido} ({d.especialidad})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {weekDates.map((date, dayIndex) => (
                    <div key={dayIndex} className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[400px]">
                            <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm">{DAYS[dayIndex]}</span>
                                    <span className="text-[10px] text-slate-400 font-normal">{date.toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => handleAddRoute(dayIndex)}
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            </h4>

                            <div className="flex-1 space-y-3">
                                {planning.filter(p =>
                                    p.dia === date.getDate() &&
                                    p.mes === (date.getMonth() + 1) &&
                                    p.anio === date.getFullYear()
                                ).map((item) => (
                                    <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-blue-200 hover:bg-white transition-all shadow-sm">
                                        <button
                                            onClick={() => handleDeletePlan(item.id)}
                                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div>
                                            <select
                                                className="w-full text-[10px] font-bold bg-blue-100 text-blue-700 rounded px-2 py-0.5 focus:ring-0 uppercase tracking-wider mb-2 appearance-none"
                                                value={item.gira}
                                                onChange={(e) => updatePlan({ ...item, gira: e.target.value })}
                                            >
                                                {tours.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                                            </select>
                                            <div className="font-bold text-slate-800 text-sm leading-tight mb-1">
                                                {item.nombreMedico}
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                                <MapPin size={10} />
                                                {item.direccion}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                            <Clock size={12} className="text-slate-400" />
                                            <input
                                                className="flex-1 text-[11px] font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                                                value={item.horario}
                                                onChange={(e) => updatePlan({ ...item, horario: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanningPage;
