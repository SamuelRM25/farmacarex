import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const CalendarPage: React.FC = () => {
    const days = Array.from({ length: 35 }, (_, i) => i - 3); // Dummy days for a month view
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Enero 2026</h3>
                        <p className="text-sm text-slate-500">Organización de citas y compromisos</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium">Hoy</button>
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, i) => {
                        const isCurrentMonth = day > 0 && day <= 31;
                        const isToday = day === 29;
                        return (
                            <div
                                key={i}
                                className={`h-32 border-r border-b border-slate-50 p-2 transition-colors hover:bg-slate-50/50 cursor-pointer ${!isCurrentMonth ? 'bg-slate-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {day > 0 ? (day > 31 ? day - 31 : day) : day + 31}
                                    </span>
                                </div>

                                {isToday && (
                                    <div className="mt-2 space-y-1">
                                        <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-blue-100">
                                            <Clock size={10} /> 09:00 - Dr. García
                                        </div>
                                        <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-green-100">
                                            <Clock size={10} /> 14:30 - Farmacia Central
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
