import React, { useState } from 'react';
import { Play, CheckCircle2, Plus, X, ArrowLeft, Download, Package, Calendar, Calculator, Info } from 'lucide-react';
import { useStore } from '../store';
import type { Visit, Medicine, SaleItem } from '../types';
import { exportVisitsReport } from '../utils/pdfExport';
import { exportElementAsImage } from '../utils/imageExport';

const VisitsPage: React.FC = () => {
    const { visits, medicines, clients, planning, addVisit } = useStore();
    const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [currentSaleItems, setCurrentSaleItems] = useState<SaleItem[]>([]);
    const [selectedPriceTier, setSelectedPriceTier] = useState<'precioFarmacia' | 'precioMedico' | 'precioPublico'>('precioFarmacia');
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [calcState, setCalcState] = useState<{
        medicineId: string;
        cantidad: number;
        priceTier: 'precioFarmacia' | 'precioMedico' | 'precioPublico';
    }>({
        medicineId: '',
        cantidad: 1,
        priceTier: 'precioFarmacia'
    });
    const [suggestion, setSuggestion] = useState<{ title: string, content: string } | null>(null);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Get today's planned entries
    const todayPlans = planning.filter(p => p.dia === day && p.mes === month && p.anio === year);

    // Map planned entries to actual client objects
    const plannedClients = todayPlans.map(plan => {
        const client = clients.find(c => c.id === plan.clienteId || `${c.nombre} ${c.apellido}` === plan.nombreMedico);
        return client ? { ...client, plannedGira: plan.gira, plannedTime: plan.horario, planId: plan.id } : null;
    }).filter(Boolean);

    const startVisit = (client: any) => {
        const newVisit: Visit = {
            id: Date.now().toString(),
            clientId: client.id,
            clientName: `${client.nombre} ${client.apellido}`,
            fecha: todayStr,
            hora: new Date().toLocaleTimeString(),
            gira: client.plannedGira || 'General',
            notas: '',
            completada: false
        };
        setActiveVisit(newVisit);

        // Show specialty suggestions
        const specialty = client.especialidad?.toLowerCase() || '';
        if (specialty.includes('pediatra') || specialty.includes('pediatría')) {
            setSuggestion({ title: 'Sugerencia para Pediatría', content: 'Presentar Febrikids® o Gesikdol® Jarabe. Enfoque en sabores (Fresa/Tuti-fruti).' });
        } else if (specialty.includes('interna') || specialty.includes('cardio')) {
            setSuggestion({ title: 'Sugerencia para Medicina Interna', content: 'Presentar Tabypress H® para control de hipertensión o Gastricarex®.' });
        } else if (specialty.includes('trauma') || specialty.includes('orto')) {
            setSuggestion({ title: 'Sugerencia para Traumatología', content: 'Presentar Blockdol® para dolor neuropático o Alphavit® DN.' });
        } else {
            setSuggestion({ title: 'Sugerencia General', content: 'Presentar Tusicarex® Antigripal o Alphavit® Tabletas como multivitamínico base.' });
        }
    };

    const addToSale = (med: Medicine, quantity: number = 1) => {
        const price = med[selectedPriceTier] || 0;
        const existing = currentSaleItems.find(i => i.medicineId === med.id);
        if (existing) {
            setCurrentSaleItems(currentSaleItems.map(i =>
                i.medicineId === med.id ? { ...i, cantidad: i.cantidad + quantity, subtotal: (i.cantidad + quantity) * price } : i
            ));
        } else {
            setCurrentSaleItems([...currentSaleItems, {
                medicineId: med.id,
                medicineName: med.nombre,
                cantidad: quantity,
                precio: price,
                subtotal: price * quantity
            }]);
        }
    };

    const updateItemQuantity = (id: string, delta: number) => {
        setCurrentSaleItems(currentSaleItems.map(item => {
            if (item.medicineId === id) {
                const newQty = Math.max(0, item.cantidad + delta);
                return { ...item, cantidad: newQty, subtotal: newQty * item.precio };
            }
            return item;
        }).filter(i => i.cantidad > 0));
    };

    const concludeVisit = async () => {
        if (!activeVisit) return;
        const total = currentSaleItems.reduce((acc, item) => acc + item.subtotal, 0);
        const updatedVisit: Visit = {
            ...activeVisit,
            completada: true,
            sale: {
                id: `SALE-${Date.now()}`,
                visitId: activeVisit.id,
                fecha: new Date().toISOString(),
                items: currentSaleItems,
                total
            }
        };

        await addVisit(updatedVisit);
        setActiveVisit(null);
        setCurrentSaleItems([]);
        setIsSaleModalOpen(false);
    };

    // Filter out already completed visits for the list
    // FIX: Only show planned clients, do NOT fall back to all clients
    const visibleClients = (plannedClients || []).filter(client => {
        if (!client) return false;
        return !visits.some(v => v.clientId === client.id && v.fecha === todayStr && v.completada);
    });

    if (activeVisit) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <button onClick={() => setActiveVisit(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={18} /> Volver a lista
                </button>

                {/* Suggestion Notification */}
                {suggestion && (
                    <div className="max-w-5xl mx-auto mb-6 bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Info size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-[10px] uppercase tracking-widest opacity-80">{suggestion.title}</h4>
                                <p className="font-bold text-lg leading-tight">{suggestion.content}</p>
                            </div>
                        </div>
                        <button onClick={() => setSuggestion(null)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors relative z-10">
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/60 shadow-2xl max-w-5xl mx-auto overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-white/5 pb-8 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                <Play size={10} fill="currentColor" /> Visita en progreso
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{activeVisit.clientName}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Iniciada a las <span className="text-slate-900 dark:text-white font-bold">{activeVisit.hora}</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setIsCalculatorOpen(true)}
                                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-tight flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                                >
                                    <Calculator size={14} /> Calculadora
                                </button>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Pricing Strategy</span>
                            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                                {(['precioFarmacia', 'precioMedico'] as const).map(tier => (
                                    <button
                                        key={tier}
                                        onClick={() => setSelectedPriceTier(tier)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectedPriceTier === tier ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    >
                                        {tier.replace('precio', '')}
                                    </button>
                                ))}
                                <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight text-slate-300 dark:text-slate-600 flex items-center bg-transparent">
                                    Público (Solo Ref.)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Order Section */}
                        <div className="lg:col-span-12 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Plus className="text-blue-500" size={20} /> Detalle de Pedido
                                </h3>
                                <button
                                    onClick={() => setIsSaleModalOpen(true)}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    Abrir Catálogo
                                </button>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-6">
                                {currentSaleItems.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                            <div className="col-span-6">Producto</div>
                                            <div className="col-span-3 text-center">Cantidad</div>
                                            <div className="col-span-3 text-right">Subtotal</div>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {currentSaleItems.map(item => (
                                                <div key={item.medicineId} className="grid grid-cols-12 items-center bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm group">
                                                    <div className="col-span-6">
                                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{item.medicineName}</p>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Unidad: Q {item.precio.toFixed(2)}</p>
                                                    </div>
                                                    <div className="col-span-3 flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => updateItemQuantity(item.medicineId, -1)}
                                                            className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-black/20 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <span className="font-black text-slate-900 dark:text-white tabular-nums">{item.cantidad}</span>
                                                        <button
                                                            onClick={() => updateItemQuantity(item.medicineId, 1)}
                                                            className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-black/20 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-indigo-500/10 hover:text-blue-500 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="col-span-3 text-right">
                                                        <span className="font-black text-slate-900 dark:text-white text-sm">Q {item.subtotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex justify-between items-end px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Acumulado</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">Cálculo basado en tarifa: {selectedPriceTier.replace('precio', '')}</span>
                                            </div>
                                            <span className="text-5xl font-black text-blue-600 tracking-tighter tabular-nums drop-shadow-sm">Q {currentSaleItems.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
                                            <Package size={28} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin productos seleccionados</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="lg:col-span-12 space-y-4">
                            <h4 className="font-bold text-slate-800 dark:text-white tracking-tight">Observaciones de la visita</h4>
                            <textarea
                                className="w-full h-32 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none shadow-sm text-slate-700 dark:text-slate-200 font-medium"
                                placeholder="Ingresar acuerdos, próximas fechas o notas relevantes..."
                                value={activeVisit.notas}
                                onChange={(e) => setActiveVisit({ ...activeVisit, notas: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <button
                            onClick={concludeVisit}
                            className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] group"
                        >
                            <CheckCircle2 size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                            <span>Concluir y Finalizar Jornada</span>
                        </button>
                    </div>
                </div>

                {/* Calculator Modal */}
                {isCalculatorOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white dark:border-white/10">
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                    <Calculator className="text-blue-600 dark:text-indigo-400" size={24} /> Calculadora
                                </h3>
                                <button onClick={() => setIsCalculatorOpen(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 overflow-y-auto">
                                {/* 1. Select Medicine */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Seleccionar Medicamento</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                        value={calcState.medicineId}
                                        onChange={(e) => setCalcState({ ...calcState, medicineId: e.target.value })}
                                    >
                                        <option value="">Elegir producto...</option>
                                        {medicines.map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. Select Price Tier */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tipo de Precio</label>
                                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-black/20 rounded-2xl">
                                        {(['precioFarmacia', 'precioMedico'] as const).map(tier => (
                                            <button
                                                key={tier}
                                                onClick={() => setCalcState({ ...calcState, priceTier: tier })}
                                                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all ${calcState.priceTier === tier ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
                                            >
                                                {tier.replace('precio', '')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Enter Quantity */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Cantidad</label>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10">
                                        <button
                                            onClick={() => setCalcState({ ...calcState, cantidad: Math.max(1, calcState.cantidad - 1) })}
                                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                                        >
                                            <X size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            className="flex-1 bg-transparent border-none text-center font-black text-xl text-slate-900 dark:text-white outline-none"
                                            value={calcState.cantidad}
                                            onChange={(e) => setCalcState({ ...calcState, cantidad: parseInt(e.target.value) || 1 })}
                                        />
                                        <button
                                            onClick={() => setCalcState({ ...calcState, cantidad: calcState.cantidad + 1 })}
                                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Result */}
                                {calcState.medicineId && (
                                    <div className="mt-8 p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] text-white shadow-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Resumen de Cálculo</span>
                                            <span className="text-[10px] font-black text-blue-400 dark:text-indigo-400 uppercase">{medicines.find(m => m.id === calcState.medicineId)?.nombre}</span>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-slate-300 dark:text-slate-400">Precio Unitario</span>
                                                <span className="font-bold">Q {(medicines.find(m => m.id === calcState.medicineId)?.[calcState.priceTier] || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-slate-300 dark:text-slate-400">Bonificación</span>
                                                <span className="text-emerald-400 font-bold">
                                                    {calcState.priceTier === 'precioFarmacia'
                                                        ? (calcState.cantidad >= 10
                                                            ? medicines.find(m => m.id === calcState.medicineId)?.bonificacion10Mas
                                                            : (calcState.cantidad >= 2 ? medicines.find(m => m.id === calcState.medicineId)?.bonificacion2a9 : 'N/A'))
                                                        : 'N/A (Solo Farmacia)'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-widest text-blue-400 dark:text-indigo-400">Total Sugerido</span>
                                            <span className="text-4xl font-black tracking-tighter">Q {(calcState.cantidad * (medicines.find(m => m.id === calcState.medicineId)?.[calcState.priceTier] || 0)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        if (calcState.medicineId) {
                                            const med = medicines.find(m => m.id === calcState.medicineId);
                                            if (med) addToSale(med, calcState.cantidad);
                                        }
                                        setIsCalculatorOpen(false);
                                    }}
                                    disabled={!calcState.medicineId}
                                    className="w-full bg-blue-600 dark:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                                >
                                    <span>Agregar al Pedido</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isSaleModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] md:rounded-[3rem] w-full max-w-4xl shadow-2xl h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border border-white dark:border-white/10">
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Catálogo Farmacéutico</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seleccionando con tarifa: <span className="text-blue-600 dark:text-indigo-400 font-bold uppercase">{selectedPriceTier.replace('precio', '')}</span></p>
                                </div>
                                <button
                                    onClick={() => setIsSaleModalOpen(false)}
                                    className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-white hover:shadow-lg transition-all border border-slate-100 dark:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
                                {medicines.map(med => (
                                    <div key={med.id} className="p-6 bg-slate-50 dark:bg-black/20 hover:bg-white dark:hover:bg-slate-800 border dark:border-white/5 hover:border-blue-100 dark:hover:border-indigo-500/30 rounded-[2rem] flex items-center justify-between transition-all group shadow-sm hover:shadow-xl">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-black text-slate-900 dark:text-white text-base truncate mb-1">{med.nombre}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-black text-blue-600 dark:text-indigo-400 tracking-tight">Q {(med[selectedPriceTier] || 0).toFixed(2)}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">/ Unidad</span>
                                            </div>
                                            {med.ofertas && <span className="inline-block mt-2 text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-500/20 font-black">{med.ofertas}</span>}
                                        </div>
                                        <button
                                            onClick={() => addToSale(med, 1)}
                                            className="w-14 h-14 bg-white dark:bg-slate-800 text-blue-600 dark:text-indigo-400 border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-sm hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white hover:shadow-blue-200 transition-all active:scale-90"
                                        >
                                            <Plus size={24} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
                                <button
                                    onClick={() => setIsSaleModalOpen(false)}
                                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckCircle2 size={18} />
                                    <span>Confirmar Selección ({currentSaleItems.length} ítems)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up pb-10">
            {/* Header Section */}
            <div className="glass-card relative overflow-hidden rounded-[3rem] p-1 bg-white/10 dark:bg-slate-900/10 border border-white/60 dark:border-white/10">
                <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Calendar size={12} strokeWidth={3} />
                            <span>Hoy, {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4 italic">
                            Registro de <span className="text-blue-600 dark:text-indigo-400">Visitas</span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md opacity-80">
                            {visibleClients.length > 0
                                ? `Tienes un despliegue de ${visibleClients.length} objetivos tácticos para hoy.`
                                : 'Misión cumplida: No hay visitas pendientes para este ciclo diario.'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => exportVisitsReport(visits)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-[2rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-2xl transition-all active:scale-95 shadow-lg"
                        >
                            <Download size={18} /> PDF
                        </button>
                        <button
                            onClick={() => exportElementAsImage('visits-grid', `Visitas_${new Date().toISOString().split('T')[0]}`)}
                            className="bg-indigo-600 text-white px-6 py-4 rounded-[2rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-indigo-200"
                        >
                            <Download size={18} /> JPG
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Visits Grid */}
            <div id="visits-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent">
                {visibleClients.map((client: any) => (
                    <div key={client.id} className="glass-card p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm border border-blue-100 dark:border-blue-500/20 group-hover:rotate-6 transition-transform">
                                {client.nombre[0]}
                            </div>
                            {client.plannedTime && (
                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">
                                    {client.plannedTime}
                                </span>
                            )}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
                                {client.nombre} {client.apellido}
                            </h4>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{client.especialidad}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                    {client.municipio}, {client.departamento}
                                </p>
                            </div>

                            {client.plannedGira && (
                                <div className="mt-6 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operación Gira</span>
                                    <span className="text-[10px] font-bold text-slate-700">{client.plannedGira}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => startVisit(client)}
                                className="w-full bg-slate-900 text-white hover:bg-blue-600 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-100 active:scale-95"
                            >
                                <Play size={14} fill="currentColor" strokeWidth={0} /> Iniciar Visita
                            </button>
                        </div>
                    </div>
                ))}

                {visibleClients.length === 0 && (
                    <div className="col-span-full py-24 glass-card rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border-2 border-dashed border-slate-100">
                            <CheckCircle2 size={40} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Zona Despejada</h4>
                        <p className="text-slate-400 font-medium max-w-sm mt-3 leading-relaxed">
                            No hay operativos pendientes para hoy. Registre nuevos planes en el <span className="text-blue-600 font-bold">Calendario</span> para continuar.
                        </p>
                    </div>
                )}
            </div>

            {/* Recent History Table */}
            {visits.filter(v => v.fecha === todayStr).length > 0 && (
                <div className="mt-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl shadow-slate-200/30 dark:shadow-none overflow-hidden animate-slide-up">
                    <div className="p-8 md:p-10 border-b border-slate-100/50 dark:border-white/5 bg-slate-50/20 dark:bg-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={24} /> Operativos Completados
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">Sincronización en Tiempo Real</p>
                        </div>
                        <span className="px-5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                            Total: {visits.filter(v => v.fecha === todayStr).length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {visits.filter(v => v.fecha === todayStr).map(v => (
                            <div key={v.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-white dark:hover:bg-white/5 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-indigo-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                        {v.clientName[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight mb-0.5">{v.clientName}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-blue-500 dark:text-indigo-400 font-black uppercase tracking-widest">{v.hora}</span>
                                            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{v.gira}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Q {v.sale?.total.toFixed(2) || '0.00'}</p>
                                    <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                                        <CheckCircle2 size={10} /> Registrada
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitsPage;
