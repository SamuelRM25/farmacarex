import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, MapPin, User, Clock, Calendar as CalendarIcon, List, Download, FileText, X } from 'lucide-react';
import { useStore } from '../store';
import type { Planning, Client } from '../types';
import { exportPlanningReport } from '../utils/pdfExport';
import { exportElementAsImage } from '../utils/imageExport';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PlanningPage: React.FC = () => {
    const { planning, addPlan, updatePlan, removePlan, tours, clients } = useStore();
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');

    const municipalities = Array.from(new Set(clients.map(c => c.municipio))).filter(Boolean).sort();

    const filteredClients = clients.filter(c => {
        const matchesSearch = `${c.nombre} ${c.apellido} ${c.especialidad}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMunicipality = !selectedMunicipality || c.municipio === selectedMunicipality;
        return matchesSearch && matchesMunicipality;
    });

    const getWeekDates = () => {
        const start = new Date(viewDate);
        const day = start.getDay() || 7;
        start.setDate(start.getDate() - day + 1);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            return d;
        });
    };

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

    const handleAddPlan = async (client: Client) => {
        if (!targetDate) return;

        const newPlan: Planning = {
            id: Date.now().toString(),
            dia: targetDate.getDate(),
            mes: targetDate.getMonth() + 1,
            anio: targetDate.getFullYear(),
            gira: tours[0]?.nombre || 'Gira 1',
            horario: '08:00',
            direccion: client.direccion,
            nombreMedico: `${client.nombre} ${client.apellido}`,
            clienteId: client.id
        };

        await addPlan(newPlan);
        setIsAddModalOpen(false);
    };

    const openAddModal = (date: Date) => {
        setTargetDate(date);
        setIsAddModalOpen(true);
    };

    const changeDate = (offset: number) => {
        const d = new Date(viewDate);
        if (viewMode === 'week') {
            d.setDate(d.getDate() + (offset * 7));
        } else {
            d.setMonth(d.getMonth() + offset);
        }
        setViewDate(d);
    };

    const exportToPDF = () => {
        exportPlanningReport(planning);
    };

    const exportToJPG = () => {
        // For planning, we want to export the visible weekly view
        // We'll wrap the week view in an ID and export that
        if (viewMode === 'week') {
            exportElementAsImage('planning-week-view', `Planificacion_${new Date().toISOString().split('T')[0]}`);
        } else {
            alert('Por favor cambia a vista semanal para exportar como imagen, o usa la exportación PDF.');
        }
    };

    const weekDates = getWeekDates();
    const monthDates = getMonthDates();

    return (
        <div className="space-y-8 animate-slide-up pb-10">
            {/* Fancy Header */}
            <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
                <div className="relative z-10 p-6 md:p-10 flex flex-col xl:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full xl:w-auto">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 w-full md:w-auto justify-between md:justify-start">
                            <button
                                onClick={() => changeDate(-1)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="px-4 text-center min-w-[160px]">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                                    {viewMode === 'week'
                                        ? `Semana ${weekDates[0].getDate()} - ${weekDates[6].getDate()}`
                                        : viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).split(' de ').join(' ').toUpperCase()}
                                </h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                                    {viewDate.getFullYear()}
                                </p>
                            </div>
                            <button
                                onClick={() => changeDate(1)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-2xl border border-slate-200 dark:border-white/5 w-full md:w-auto">
                            <button
                                onClick={() => setViewMode('week')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-[0.8rem] flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <List size={14} /> Semanal
                            </button>
                            <button
                                onClick={() => setViewMode('month')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-[0.8rem] flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <CalendarIcon size={14} /> Mensual
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={exportToPDF}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[2rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95"
                        >
                            <FileText size={18} /> Plan PDF
                        </button>
                        <button
                            onClick={exportToJPG}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-6 py-4 rounded-[2rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-50 active:scale-95"
                        >
                            <Download size={18} /> Plan JPG
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                </div>
            </div>

            {/* Weekly View */}
            {
                viewMode === 'week' && (
                    <div id="planning-week-view" className="overflow-x-auto pb-6 scrollbar-elegant snap-x snap-mandatory">
                        <div className="flex gap-6 min-w-max pb-4">
                            {weekDates.map((date, i) => (
                                <div key={i} className="w-[320px] md:w-[350px] shrink-0 snap-center first:ml-4 last:mr-4">
                                    <div className="flex flex-col gap-4 group h-full">
                                        <div className={`p-6 rounded-[2.5rem] border transition-all h-full min-h-[500px] flex flex-col ${date.toDateString() === new Date().toDateString()
                                            ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/50 shadow-2xl shadow-indigo-100 dark:shadow-none ring-2 ring-indigo-500/20'
                                            : 'bg-white/40 dark:bg-slate-900/40 border-white/60 dark:border-white/10 shadow-lg hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all'
                                            }`}>
                                            <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-6 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{DAYS[i]}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{date.getDate()} {date.toLocaleDateString('es-ES', { month: 'short' })}</p>
                                                </div>
                                                <button
                                                    onClick={() => openAddModal(date)}
                                                    className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Plus size={20} strokeWidth={3} />
                                                </button>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                {planning
                                                    .filter(p => p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.anio === date.getFullYear())
                                                    .map(item => (
                                                        <div key={item.id} className="p-5 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm relative group/item hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all overflow-hidden">
                                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                <button onClick={() => removePlan(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                                            </div>

                                                            <div className="mb-2">
                                                                <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg uppercase tracking-tight">{item.gira}</span>
                                                            </div>
                                                            <p className="font-black text-slate-900 dark:text-white text-xs tracking-tight mb-2 uppercase leading-tight">{item.nombreMedico}</p>

                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                                                                <Clock size={10} />
                                                                <input
                                                                    className="bg-transparent border-none p-0 outline-none w-12 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:ring-0"
                                                                    value={item.horario}
                                                                    onChange={(e) => updatePlan({ ...item, horario: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                {planning.filter(p => p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.anio === date.getFullYear()).length === 0 && (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem] p-6 opacity-40">
                                                        <Clock size={32} strokeWidth={1} />
                                                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">Día Libre</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Monthly View */}
            {
                viewMode === 'month' && (
                    <div className="glass-card rounded-[3rem] border border-white/60 shadow-2xl overflow-hidden bg-white/40">
                        <div className="grid grid-cols-7 bg-white/80 border-b border-slate-100">
                            {DAYS.map(day => (
                                <div key={day} className="py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                            {monthDates.map((date, i) => {
                                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                                const dayPlans = planning.filter(p => p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.anio === date.getFullYear());

                                return (
                                    <div key={i} className={`min-h-[140px] p-4 group transition-all relative ${isCurrentMonth ? 'bg-white' : 'bg-slate-50/10 opacity-30 cursor-not-allowed'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-black ${date.toDateString() === new Date().toDateString() ? 'text-indigo-600 bg-indigo-50 w-8 h-8 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
                                                {date.getDate()}
                                            </span>
                                            {isCurrentMonth && (
                                                <button
                                                    onClick={() => openAddModal(date)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {dayPlans.slice(0, 3).map(p => (
                                                <div key={p.id} className="text-[9px] font-black bg-slate-50 border border-slate-100 p-1.5 rounded-lg text-slate-600 truncate uppercase tracking-tight">
                                                    {p.nombreMedico.split('')[0]}. {p.nombreMedico.split(' ').slice(1).join(' ')}
                                                </div>
                                            ))}
                                            {dayPlans.length > 3 && (
                                                <div className="text-[9px] font-bold text-indigo-500 pl-1">
                                                    + {dayPlans.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* Add Doctor Modal */}
            {
                isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white my-auto">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Seleccionar Objetivo</h3>
                                    <p className="text-xs text-slate-500 font-medium">Asignando para: <span className="text-indigo-600 font-bold uppercase">{targetDate?.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span></p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all border border-slate-100"><X size={24} /></button>
                            </div>

                            <div className="p-6 bg-white border-b border-slate-100 flex gap-4">
                                <input
                                    placeholder="Buscar por nombre o especialidad..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <select
                                    className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                                    value={selectedMunicipality}
                                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                                >
                                    <option value="">Todas las Zonas</option>
                                    {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
                                {filteredClients.map(client => (
                                    <button
                                        key={client.id}
                                        onClick={() => handleAddPlan(client)}
                                        className="p-6 bg-slate-50 hover:bg-white border hover:border-indigo-100 rounded-[2rem] text-left transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <p className="font-black text-slate-900 text-base leading-tight uppercase group-hover:text-indigo-600 transition-colors uppercase">{client.nombre} {client.apellido}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-3">{client.especialidad}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                            <MapPin size={10} className="text-indigo-400" />
                                            <span>{client.municipio}, {client.departamento}</span>
                                        </div>
                                    </button>
                                ))}
                                {filteredClients.length === 0 && (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                                        <User size={48} strokeWidth={1} />
                                        <p className="font-black uppercase tracking-widest mt-4">Sin resultados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default PlanningPage;
