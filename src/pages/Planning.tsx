import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, MapPin, Clock, Calendar as CalendarIcon, List, Download, FileText, X, Search, Filter, Briefcase } from 'lucide-react';
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
    const [selectedTour, setSelectedTour] = useState('');
    const [filterTour, setFilterTour] = useState('');

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
        return Array.from({ length: 5 }, (_, i) => {
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

        for (let i = startDay - 1; i > 0; i--) {
            const d = new Date(start);
            d.setDate(d.getDate() - i);
            dates.push(d);
        }

        for (let i = 1; i <= end.getDate(); i++) {
            dates.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
        }

        return dates;
    };

    const handleAddPlan = async (client: Client) => {
        if (!targetDate || !selectedTour) return;

        const existingPlans = planning.filter(p =>
            p.dia === targetDate.getDate() &&
            p.mes === (targetDate.getMonth() + 1) &&
            p.anio === targetDate.getFullYear()
        );

        let nextHour = 8;
        if (existingPlans.length > 0) {
            const latestHour = Math.max(...existingPlans.map(p => {
                const hourMatch = p.horario.match(/^(\d{1,2})/);
                return hourMatch ? parseInt(hourMatch[1], 10) : 8;
            }));
            nextHour = latestHour + 1;
        }

        const formattedHour = `${String(nextHour).padStart(2, '0')}:00`;

        const newPlan: Planning = {
            id: Date.now().toString(),
            dia: targetDate.getDate(),
            mes: targetDate.getMonth() + 1,
            anio: targetDate.getFullYear(),
            gira: selectedTour,
            horario: formattedHour,
            direccion: client.direccion,
            nombreMedico: `${client.nombre} ${client.apellido}`,
            clienteId: client.id
        };

        await addPlan(newPlan);
        setIsAddModalOpen(false);
        setSearchQuery('');
        setSelectedMunicipality('');
    };

    const openAddModal = (date: Date) => {
        setTargetDate(date);
        setSelectedTour(tours[0]?.nombre || 'Gira 1');
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
        if (viewMode === 'week') {
            exportElementAsImage('planning-week-view', `Planificacion_${new Date().toISOString().split('T')[0]}`);
        } else {
            exportElementAsImage('planning-month-view', `Planificacion_Mensual_${new Date().toISOString().split('T')[0]}`);
        }
    };

    const weekDates = getWeekDates();
    const monthDates = getMonthDates();

    return (
        <>
            <div className="space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Date Navigation */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => changeDate(-1)}
                                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="text-center min-w-[180px]">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {viewMode === 'week' ? `Semana ${weekDates[0]?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">
                                    {viewDate.getFullYear()}
                                </p>
                            </div>
                            <button
                                onClick={() => changeDate(1)}
                                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-[1.25rem] border border-slate-200 dark:border-white/5 w-full lg:w-auto">
                            <button
                                onClick={() => setViewMode('week')}
                                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-lg border border-slate-100 dark:border-white/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <List size={16} /> Semanal
                            </button>
                            <button
                                onClick={() => setViewMode('month')}
                                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-lg border border-slate-100 dark:border-white/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <CalendarIcon size={16} /> Mensual
                            </button>
                        </div>
                    </div>

                    {/* Filters & Actions */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        {/* Tour Filter */}
                        <div className="flex-1 flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <select
                                value={filterTour}
                                onChange={(e) => setFilterTour(e.target.value)}
                                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                            >
                                <option value="">Todas las Giras</option>
                                {tours.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                            </select>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={exportToPDF}
                                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
                            >
                                <FileText size={16} /> PDF
                            </button>
                            <button
                                onClick={exportToJPG}
                                className="flex-1 md:flex-none bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:bg-slate-50 active:scale-95"
                            >
                                <Download size={16} /> Imagen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weekly View */}
                {viewMode === 'week' && (
                    <div id="planning-week-view" className="grid grid-cols-1 gap-6">
                        {weekDates.map((date, i) => {
                            const isToday = date.toDateString() === new Date().toDateString();
                            const dayPlans = planning.filter(p => {
                                const matchesDate = p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.anio === date.getFullYear();
                                const matchesTour = !filterTour || p.gira === filterTour;
                                return matchesDate && matchesTour;
                            });

                            return (
                                <div key={i} className={`group relative transition-all duration-500 ${isToday ? 'scale-[1.01] z-10' : ''}`}>
                                    <div className={`glass-card p-6 md:p-8 rounded-[2.5rem] border flex flex-col md:flex-row gap-8 min-h-[160px] ${isToday
                                        ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/50 shadow-2xl shadow-indigo-100/50 dark:shadow-none'
                                        : 'bg-white/60 dark:bg-slate-900/40 border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-900 shadow-xl'
                                        }`}>
                                        {/* Date Sidebar */}
                                        <div className="flex md:flex-col items-center justify-between md:justify-center md:w-32 md:border-r border-slate-100 dark:border-white/5 md:pr-8">
                                            <div className="text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                    {DAYS[i]}
                                                </p>
                                                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                                    {date.getDate()}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-2">
                                                    {date.toLocaleDateString('es-ES', { month: 'short' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openAddModal(date)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all md:mt-6 ${isToday
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-0 hover:rotate-90'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm'
                                                    }`}
                                            >
                                                <Plus size={24} strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Plans Grid */}
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {dayPlans.map(item => (
                                                <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm relative group/item hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all overflow-hidden">
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => removePlan(item.id)}
                                                            className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="mb-2">
                                                        <div className="flex items-center gap-1.5 mb-2">
                                                            <Briefcase size={10} className="text-indigo-500" />
                                                            <span className="text-[8px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                                                                {item.gira}
                                                            </span>
                                                        </div>
                                                        <p className="font-black text-slate-900 dark:text-white text-[9px] tracking-tight mb-2 uppercase leading-[1.4]">
                                                            {item.nombreMedico}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest bg-white dark:bg-slate-900/50 p-1.5 rounded-lg">
                                                            <Clock size={10} className="text-indigo-400" />
                                                            <input
                                                                className="bg-transparent border-none p-0 outline-none w-12 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:ring-0"
                                                                value={item.horario}
                                                                onChange={(e) => updatePlan({ ...item, horario: e.target.value })}
                                                            />
                                                        </div>
                                                        {item.direccion && (
                                                            <div className="flex items-start gap-1.5 text-[8px] text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-slate-900/50 p-1.5 rounded-lg">
                                                                <MapPin size={10} className="text-slate-400 mt-0.5 shrink-0" />
                                                                <span className="line-clamp-2 leading-relaxed">{item.direccion}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {dayPlans.length === 0 && (
                                                <div className="col-span-full h-full min-h-[100px] flex items-center justify-center text-slate-300 dark:text-slate-700 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem] p-6 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20 transition-colors">
                                                    <div className="flex flex-col items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <CalendarIcon size={32} strokeWidth={1} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sin actividades</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Month View */}
                {viewMode === 'month' && (
                    <div id="planning-month-view" className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-xl">
                        <div className="grid grid-cols-7 gap-4">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                                <div key={i} className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2">
                                    {day}
                                </div>
                            ))}
                            {monthDates.map((date, i) => {
                                const isToday = date.toDateString() === new Date().toDateString();
                                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                                const dayPlans = planning.filter(p => {
                                    const matchesDate = p.dia === date.getDate() && p.mes === (date.getMonth() + 1) && p.anio === date.getFullYear();
                                    const matchesTour = !filterTour || p.gira === filterTour;
                                    return matchesDate && matchesTour;
                                });

                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[100px] p-2 rounded-xl border transition-all ${isToday
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/50'
                                            : isCurrentMonth
                                                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                                                : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-white/5 opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                {date.getDate()}
                                            </span>
                                            {isCurrentMonth && (
                                                <button
                                                    onClick={() => openAddModal(date)}
                                                    className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {dayPlans.slice(0, 3).map(plan => (
                                                <div
                                                    key={plan.id}
                                                    className="text-[8px] font-bold p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg truncate"
                                                    title={`${plan.horario} - ${plan.nombreMedico}`}
                                                >
                                                    {plan.horario} - {plan.nombreMedico}
                                                </div>
                                            ))}
                                            {dayPlans.length > 3 && (
                                                <div className="text-[8px] font-bold text-slate-400 dark:text-slate-500 text-center">
                                                    +{dayPlans.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Doctor Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white dark:border-white/10 my-auto">
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 relative shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Agregar Visita</h3>
                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-2">
                                    {targetDate?.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-100 dark:border-white/10 group">
                                <X size={24} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Tour Selection - PROMINENT */}
                        <div className="p-6 md:p-8 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/10 shrink-0">
                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                <Briefcase size={14} className="inline mr-2" />
                                Seleccionar Gira
                            </label>
                            <select
                                value={selectedTour}
                                onChange={(e) => setSelectedTour(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-3 font-bold text-base outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                            >
                                {tours.length > 0 ? (
                                    tours.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)
                                ) : (
                                    <option value="Gira 1">Gira 1</option>
                                )}
                            </select>
                        </div>

                        {/* Search & Filters */}
                        <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5 flex flex-col gap-3 shrink-0">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    placeholder="Buscar médico..."
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                                value={selectedMunicipality}
                                onChange={(e) => setSelectedMunicipality(e.target.value)}
                            >
                                <option value="">Todas las Zonas</option>
                                {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        {/* Clients List */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 gap-4 custom-scrollbar bg-white dark:bg-slate-900">
                            {filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => handleAddPlan(client)}
                                    className="p-4 bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/50 rounded-xl text-left transition-all group shadow-sm hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 blur-[15px] rounded-full -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors" />

                                    {/* Name & Specialty */}
                                    <div className="relative z-10 mb-3 pb-3 border-b border-slate-200 dark:border-white/5">
                                        <p className="font-black text-slate-900 dark:text-white text-sm leading-tight uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                                            {client.nombre} {client.apellido}
                                        </p>
                                        <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                                            {client.especialidad}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="relative z-10 grid grid-cols-2 gap-2 text-[9px]">
                                        {client.colegiado && (
                                            <div>
                                                <span className="text-slate-400 dark:text-slate-500 font-black uppercase block mb-0.5">Colegiado</span>
                                                <span className="text-slate-700 dark:text-slate-300 font-bold">{client.colegiado}</span>
                                            </div>
                                        )}
                                        {client.telefono && (
                                            <div>
                                                <span className="text-slate-400 dark:text-slate-500 font-black uppercase block mb-0.5">Teléfono</span>
                                                <span className="text-slate-700 dark:text-slate-300 font-bold">{client.telefono}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="relative z-10 mt-3 pt-3 border-t border-slate-200 dark:border-white/5">
                                        <div className="flex items-center gap-2 text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                                            <MapPin size={12} className="text-indigo-400 shrink-0" />
                                            <span>{client.municipio}, {client.departamento}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {filteredClients.length === 0 && (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                    <Search size={48} strokeWidth={1} />
                                    <p className="font-black uppercase tracking-[0.3em] mt-4 text-xs">Sin resultados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlanningPage;
