import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Package } from 'lucide-react';
import type { Medicine } from '../types';
import { useStore } from '../store';

const InventoryPage: React.FC = () => {
    const { medicines, setMedicines } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingMed, setEditingMed] = useState<Medicine | null>(null);
    const [formData, setFormData] = useState<Partial<Medicine>>({});

    const handleAdd = () => {
        setIsAdding(true);
        setFormData({
            id: Date.now().toString(),
            nombre: '',
            precioPublico: 0,
            precioFarmacia: 0,
            bonificacion2a9: 'N/A',
            bonificacion10Mas: '10%',
            precioMedico: 0,
            ofertas: '',
            stock: 0
        });
    };

    const handleSave = () => {
        if (editingMed) {
            setMedicines(medicines.map(m => m.id === editingMed.id ? { ...m, ...formData } as Medicine : m));
            setEditingMed(null);
        } else if (isAdding) {
            setMedicines([...medicines, formData as Medicine]);
            setIsAdding(false);
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar medicamento..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium"
                >
                    <Plus size={18} />
                    Agregar Medicamento
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">P. Público</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">P. Farmacia</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">P. Médico</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredMedicines.map((med) => (
                            <tr key={med.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{med.nombre}</div>
                                    <div className="text-xs text-blue-500">{med.ofertas || 'Sin ofertas'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">Q {med.precioPublico.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">Q {med.precioFarmacia.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm font-medium text-green-600">Q {med.precioMedico.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => { setEditingMed(med); setFormData(med); }} className="p-1 text-slate-400 hover:text-blue-500">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredMedicines.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Package className="mx-auto mb-2 opacity-20" size={48} />
                        No hay medicamentos en el inventario.
                    </div>
                )}
            </div>

            {/* Modal */}
            {(isAdding || editingMed) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">
                                {isAdding ? 'Nuevo Medicamento' : 'Editar Medicamento'}
                            </h3>
                            <button onClick={() => { setIsAdding(false); setEditingMed(null); }} className="text-slate-400">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.nombre || ''}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Precio Público</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.precioPublico || ''}
                                    onChange={e => setFormData({ ...formData, precioPublico: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Precio Farmacia</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.precioFarmacia || ''}
                                    onChange={e => setFormData({ ...formData, precioFarmacia: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Precio Médico</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.precioMedico || ''}
                                    onChange={e => setFormData({ ...formData, precioMedico: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Ofertas / Notas</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.ofertas || ''}
                                    onChange={e => setFormData({ ...formData, ofertas: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Bonificación 2-9</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.bonificacion2a9 || ''}
                                    onChange={e => setFormData({ ...formData, bonificacion2a9: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Bonificación 10+</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                    value={formData.bonificacion10Mas || ''}
                                    onChange={e => setFormData({ ...formData, bonificacion10Mas: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex gap-3 justify-end">
                            <button onClick={() => { setIsAdding(false); setEditingMed(null); }} className="px-6 py-2 border border-slate-200 rounded-xl font-medium">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2">
                                <Save size={18} /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
