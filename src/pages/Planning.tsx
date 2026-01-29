import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import type { Planning } from '../types';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const PlanningPage: React.FC = () => {
    const { planning, setPlanning, tours } = useStore();
    const [currentWeek] = useState(new Date());

    const handleAddRoute = (day: string) => {
        const newPlan: Planning = {
            id: Date.now().toString(),
            dia: day,
            mes: (currentWeek.getMonth() + 1).toString(),
            anio: currentWeek.getFullYear().toString(),
            gira: tours[0].nombre,
            horario: '08:00 - 12:00',
            direccion: '',
            nombreMedico: ''
        };
        setPlanning([...planning, newPlan]);
    };

    const updatePlan = (id: string, updates: Partial<Planning>) => {
        setPlanning(planning.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePlan = (id: string) => {
        setPlanning(planning.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-xl font-bold text-slate-800">
                        {currentWeek.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </h3>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium transition-shadow shadow-lg shadow-green-100">
                    <Save size={18} />
                    Sincronizar con Google Sheets
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {DAYS.map((day) => (
                    <div key={day} className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 flex justify-between items-center">
                                {day}
                                <button
                                    onClick={() => handleAddRoute(day)}
                                    className="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </h4>

                            <div className="mt-4 space-y-3">
                                {planning.filter(p => p.dia === day).map((item) => (
                                    <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 relative group">
                                        <button
                                            onClick={() => deletePlan(item.id)}
                                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <select
                                            className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 text-blue-600 uppercase"
                                            value={item.gira}
                                            onChange={(e) => updatePlan(item.id, { gira: e.target.value })}
                                        >
                                            {tours.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                                        </select>

                                        <input
                                            placeholder="Médico / Farmacia"
                                            className="w-full text-sm font-medium bg-white border border-slate-200 rounded-lg px-2 py-1"
                                            value={item.nombreMedico}
                                            onChange={(e) => updatePlan(item.id, { nombreMedico: e.target.value })}
                                        />

                                        <input
                                            placeholder="Horario (ej. 08:00)"
                                            className="w-full text-[10px] text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                                            value={item.horario}
                                            onChange={(e) => updatePlan(item.id, { horario: e.target.value })}
                                        />
                                    </div>
                                ))}
                                {planning.filter(p => p.dia === day).length === 0 && (
                                    <p className="text-xs text-slate-400 text-center py-4 italic">Sin rutas asignadas</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanningPage;
