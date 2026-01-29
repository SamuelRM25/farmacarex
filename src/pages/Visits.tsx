import React, { useState } from 'react';
import { Play, CheckCircle2, Plus, X, ArrowLeft, Download } from 'lucide-react';
import { useStore } from '../store';
import type { Visit, Medicine, SaleItem } from '../types';
import { exportVisitsReport } from '../utils/pdfExport';

const VisitsPage: React.FC = () => {
    const { visits, setVisits, medicines, clients } = useStore();
    const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [currentSaleItems, setCurrentSaleItems] = useState<SaleItem[]>([]);

    const startVisit = (client: any) => {
        const newVisit: Visit = {
            id: Date.now().toString(),
            clientId: client.id,
            clientName: `${client.nombre} ${client.apellido}`,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString(),
            gira: 'General',
            notas: '',
            completada: false
        };
        setActiveVisit(newVisit);
    };

    const addToSale = (med: Medicine) => {
        const existing = currentSaleItems.find(i => i.medicineId === med.id);
        if (existing) {
            setCurrentSaleItems(currentSaleItems.map(i =>
                i.medicineId === med.id ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio } : i
            ));
        } else {
            setCurrentSaleItems([...currentSaleItems, {
                medicineId: med.id,
                medicineName: med.nombre,
                cantidad: 1,
                precio: med.precioFarmacia,
                subtotal: med.precioFarmacia
            }]);
        }
    };

    const concludeSale = () => {
        if (!activeVisit) return;
        const total = currentSaleItems.reduce((acc, item) => acc + item.subtotal, 0);
        const updatedVisit = {
            ...activeVisit,
            completada: true,
            sale: {
                id: Date.now().toString(),
                visitId: activeVisit.id,
                fecha: new Date().toISOString(),
                items: currentSaleItems,
                total
            }
        };
        setVisits([...visits, updatedVisit]);
        setActiveVisit(null);
        setCurrentSaleItems([]);
        setIsSaleModalOpen(false);
    };

    if (activeVisit) {
        return (
            <div className="space-y-6">
                <button onClick={() => setActiveVisit(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft size={18} /> Volver a lista
                </button>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">{activeVisit.clientName}</h2>
                            <p className="text-slate-500">Iniciada a las {activeVisit.hora}</p>
                        </div>
                        <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-bold animate-pulse">
                            VISITA EN PROGRESO
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        {/* Notes Section */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700">Notas de la visita</h4>
                            <textarea
                                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Escribe aquí los detalles de la visita..."
                            />
                        </div>

                        {/* Order Summary Section */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                            <h4 className="font-bold text-slate-700 flex justify-between">
                                Venta / Pedido
                                <button
                                    onClick={() => setIsSaleModalOpen(true)}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                                >
                                    <Plus size={16} /> Modificar
                                </button>
                            </h4>

                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {currentSaleItems.map(item => (
                                    <div key={item.medicineId} className="flex justify-between text-sm">
                                        <span className="text-slate-600 font-medium">{item.cantidad}x {item.medicineName}</span>
                                        <span className="text-slate-900 font-bold">Q {item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                                {currentSaleItems.length === 0 && <p className="text-center text-slate-400 py-8 italic">No hay productos seleccionados</p>}
                            </div>

                            <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                                <span className="font-bold text-slate-600">Total estimada</span>
                                <span className="text-2xl font-black text-blue-600">Q {currentSaleItems.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <button
                            onClick={concludeSale}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-100"
                        >
                            <CheckCircle2 size={24} /> Concluir Visita y Guardar
                        </button>
                    </div>
                </div>

                {/* Medicine Selector Modal */}
                {isSaleModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl shadow-2xl h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold">Vademécum - Selección de Productos</h3>
                                <button onClick={() => setIsSaleModalOpen(false)}><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {medicines.map(med => (
                                    <div key={med.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-800">{med.nombre}</p>
                                            <p className="text-sm text-slate-500">Q {med.precioFarmacia.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => addToSale(med)}
                                            className="bg-blue-600 text-white p-2 rounded-xl"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100">
                                <button
                                    onClick={() => setIsSaleModalOpen(false)}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
                                >
                                    Confirmar Selección ({currentSaleItems.length})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-2xl font-bold">Registro de Visitas Diario</h3>
                    <p className="opacity-80">Selecciona un médico para comenzar el reporte de hoy.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportVisitsReport(visits)}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl flex items-center gap-2 font-medium backdrop-blur-sm"
                    >
                        <Download size={18} /> Exportar Reporte
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg group">
                        <h4 className="font-bold text-slate-800 text-lg">{client.nombre} {client.apellido}</h4>
                        <p className="text-sm text-slate-500">{client.especialidad}</p>
                        <p className="text-xs text-slate-400 mt-1">{client.municipio}, {client.departamento}</p>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => startVisit(client)}
                                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <Play size={16} fill="currentColor" /> Iniciar Visita
                            </button>
                        </div>
                    </div>
                ))}

                {clients.length === 0 && (
                    <div className="col-span-full p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                        No hay clientes registrados en el sistema. <br />
                        Ve al módulo de <strong className="text-blue-500">Clientes</strong> para agregarlos.
                    </div>
                )}
            </div>

            {/* Recent History */}
            {visits.length > 0 && (
                <div className="mt-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={20} /> Visitas Realizadas Hoy
                        </h4>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {visits.map(v => (
                            <div key={v.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                                        {v.clientName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{v.clientName}</p>
                                        <p className="text-xs text-slate-400">{v.hora} • {v.gira}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-700">Q {v.sale?.total.toFixed(2) || '0.00'}</p>
                                    <p className="text-[10px] text-slate-400 capitalize">Completada</p>
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
