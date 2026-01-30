import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Package, Image as ImageIcon } from 'lucide-react';
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
            stock: 0,
            imageUrl: ''
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

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            setMedicines(medicines.filter(m => m.id !== id));
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-slide-up pb-10">
            {/* Vademecum Navigation/Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
                <div className="flex flex-col gap-1 w-full md:w-auto">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Vademécum</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Catálogo Industrial Farmacéutico</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar en el Vademécum..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    Agregar Producto
                </button>
            </div>

            {/* Horizontal Medicine Cards */}
            <div className="overflow-x-auto pb-6 scrollbar-elegant snap-x snap-mandatory">
                <div className="flex gap-6 min-w-max pb-4">
                    {filteredMedicines.map(med => (
                        <div key={med.id} className="w-[300px] md:w-[350px] shrink-0 snap-start first:ml-4 last:mr-4">
                            <div className="glass-card p-6 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-xl h-full flex flex-col group hover:-translate-y-2 transition-all duration-300">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                                        {med.imageUrl ? (
                                            <img src={med.imageUrl} alt={med.nombre} className="w-full h-full object-contain" />
                                        ) : (
                                            <Package size={24} className="text-slate-200 dark:text-slate-700" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase truncate">{med.nombre}</h4>
                                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">{med.presentacion}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black rounded-lg uppercase">{med.ofertas || 'Vademécum'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-white/5 mb-6">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Público</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white">Q{(med.precioPublico || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="text-center border-x border-slate-50 dark:border-white/5">
                                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Farmacia</p>
                                        <p className="text-xs font-black text-blue-600 dark:text-blue-400">Q{(med.precioFarmacia || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Médico</p>
                                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Q{(med.precioMedico || 0).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingMed(med); setFormData(med); }}
                                            className="w-10 h-10 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(med.id)}
                                            className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-black ${med.stock > 10 ? 'text-slate-900 dark:text-slate-200' : 'text-red-500'}`}>
                                            {med.stock} <span className="text-[9px] uppercase dark:text-slate-500">unid</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Form Drawer */}
            {(isAdding || editingMed) && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border-t border-white dark:border-white/10">
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase leading-none">
                                    {isAdding ? 'Nuevo Ingreso' : 'Actualizar Producto'}
                                </h3>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2">Configuración de Producto</p>
                            </div>
                            <button onClick={() => { setIsAdding(false); setEditingMed(null); }} className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-100 dark:border-white/10">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nombre del Medicamento</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    placeholder="Nombre completo..."
                                    value={formData.nombre || ''}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Presentación</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    placeholder="e.g. 120 mL, 20 tabletas"
                                    value={formData.presentacion || ''}
                                    onChange={e => setFormData({ ...formData, presentacion: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <ImageIcon size={10} /> URL de Imagen
                                </label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    placeholder="https://..."
                                    value={formData.imageUrl || ''}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">P. Público (Q)</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    value={formData.precioPublico || ''}
                                    onChange={e => setFormData({ ...formData, precioPublico: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">P. Farmacia (Q)</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-blue-600 dark:text-blue-400"
                                    value={formData.precioFarmacia || ''}
                                    onChange={e => setFormData({ ...formData, precioFarmacia: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">P. Médico (Q)</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-emerald-600 dark:text-emerald-400"
                                    value={formData.precioMedico || ''}
                                    onChange={e => setFormData({ ...formData, precioMedico: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Stock Actual</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    value={formData.stock || ''}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bonificación 2-9</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    value={formData.bonificacion2a9 || ''}
                                    onChange={e => setFormData({ ...formData, bonificacion2a9: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bonificación 10+</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                    value={formData.bonificacion10Mas || ''}
                                    onChange={e => setFormData({ ...formData, bonificacion10Mas: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-white/5 flex gap-4">
                            <button
                                onClick={() => { setIsAdding(false); setEditingMed(null); }}
                                className="flex-1 px-8 py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
