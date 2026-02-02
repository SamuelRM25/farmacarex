import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check, X } from 'lucide-react';

interface DigitalClockPickerProps {
    value: string; // "HH:mm"
    onChange: (newValue: string) => void;
    onClose: () => void;
}

const DigitalClockPicker: React.FC<DigitalClockPickerProps> = ({ value, onChange, onClose }) => {
    const [hours, setHours] = useState(8);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const [h, m] = value.split(':').map(Number);
        if (!isNaN(h)) setHours(h);
        if (!isNaN(m)) setMinutes(m);
    }, [value]);

    const adjustHour = (delta: number) => {
        setHours(prev => (prev + delta + 24) % 24);
    };

    const adjustMinute = (delta: number) => {
        setMinutes(prev => (prev + delta + 60) % 60);
    };

    const handleSave = () => {
        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        onChange(formatted);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 p-8 w-full max-w-xs animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em]">Ajustar Horario</h4>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-6 mb-8">
                    {/* Hours */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => adjustHour(1)}
                            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                        >
                            <ChevronUp size={24} />
                        </button>
                        <div className="w-20 h-24 flex items-center justify-center bg-slate-100/50 dark:bg-black/20 rounded-3xl border border-slate-200 dark:border-white/5 shadow-inner">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                                {String(hours).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={() => adjustHour(-1)}
                            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                        >
                            <ChevronDown size={24} />
                        </button>
                    </div>

                    <div className="text-4xl font-black text-slate-300 dark:text-slate-700 pb-12 self-center">:</div>

                    {/* Minutes */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => adjustMinute(5)}
                            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                        >
                            <ChevronUp size={24} />
                        </button>
                        <div className="w-20 h-24 flex items-center justify-center bg-slate-100/50 dark:bg-black/20 rounded-3xl border border-slate-200 dark:border-white/5 shadow-inner">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                                {String(minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={() => adjustMinute(-5)}
                            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                        >
                            <ChevronDown size={24} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
                >
                    <Check size={18} strokeWidth={3} /> Confirmar Hora
                </button>
            </div>
        </div>
    );
};

export default DigitalClockPicker;
