import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Package, Image as ImageIcon, LayoutGrid, List, Maximize2 } from 'lucide-react';
import type { Medicine } from '../types';
import { useStore } from '../store';

type ViewMode = 'grid' | 'list' | 'details';

const InventoryPage: React.FC = () => {
    const { medicines, setMedicines } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
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
        <>
            <div className="space-y-6 md:space-y-8 animate-slide-up pb-20">
                {/* Vademecum Navigation/Header */}
                <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />

                    <div className="flex flex-col gap-1 w-full md:w-auto relative z-10">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none group flex items-center gap-3">
                            Vademécum
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                                {filteredMedicines.length} Items
                            </span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Catálogo Industrial Farmacéutico</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full xl:w-auto relative z-10">
                        {/* Search Bar */}
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar en el Vademécum..."
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* View Toggles */}
                        <div className="flex bg-slate-50 dark:bg-black/20 p-1.5 rounded-[1.25rem] border border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-md border border-slate-100 dark:border-white/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                                title="Vista Cuadrícula"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-md border border-slate-100 dark:border-white/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                                title="Vista Lista"
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('details')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'details' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-md border border-slate-100 dark:border-white/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                                title="Vista Detalles"
                            >
                                <Maximize2 size={20} />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAdd}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 group"
                        >
                            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                            Agregar Producto
                        </button>
                    </div>
                </div>

                {/* Vertical Content Container */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                    viewMode === 'list' ? 'grid-cols-1' :
                        'grid-cols-1 md:grid-cols-2'
                    }`}>
                    {filteredMedicines.map(med => (
                        <div key={med.id} className="group h-full">
                            {viewMode === 'grid' && (
                                <div className="glass-card p-6 rounded-[2.5rem] border border-white dark:border-white/5 shadow-xl h-full flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

                                    <div className="flex gap-4 mb-6 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                                            {med.imageUrl ? (
                                                <img src={med.imageUrl} alt={med.nombre} className="w-full h-full object-contain" />
                                            ) : (
                                                <Package size={24} className="text-slate-200 dark:text-slate-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight uppercase truncate">{med.nombre}</h4>
                                            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 truncate">{med.presentacion}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-white/5 mb-6 relative z-10">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Público</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white">Q{med.precioPublico?.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center border-x border-slate-50 dark:border-white/5">
                                            <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Farmacia</p>
                                            <p className="text-xs font-black text-blue-600 dark:text-blue-400">Q{med.precioFarmacia?.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Médico</p>
                                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Q{med.precioMedico?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto relative z-10">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingMed(med); setFormData(med); }}
                                                className="w-10 h-10 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-indigo-500 rounded-xl flex items-center justify-center transition-all shadow-sm group/btn"
                                            >
                                                <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(med.id)}
                                                className="w-10 h-10 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-sm group/btn"
                                            >
                                                <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-xl ${med.stock > 10 ? 'bg-slate-50 dark:bg-white/5' : 'bg-red-50 dark:bg-red-500/10'} transition-colors`}>
                                            <p className={`text-[12px] font-black ${med.stock > 10 ? 'text-slate-900 dark:text-slate-200' : 'text-red-500'}`}>
                                                {med.stock} <span className="text-[8px] uppercase opacity-50 ml-0.5">unid</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'list' && (
                                <div className="glass-card p-4 md:p-6 rounded-3xl border border-white dark:border-white/5 shadow-lg flex items-center gap-6 group hover:-translate-x-1 transition-all duration-300 relative overflow-hidden">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden p-2">
                                        {med.imageUrl ? (
                                            <img src={med.imageUrl} alt={med.nombre} className="w-full h-full object-contain" />
                                        ) : (
                                            <Package size={24} className="text-slate-200 dark:text-slate-700" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                                        <div className="lg:col-span-1">
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase truncate">{med.nombre}</h4>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{med.presentacion}</p>
                                        </div>

                                        <div className="lg:col-span-2 flex items-center justify-start gap-8 px-4">
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Publico</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">Q{med.precioPublico?.toFixed(2)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Farmacia</p>
                                                <p className="text-sm font-black text-blue-600 dark:text-blue-400">Q{med.precioFarmacia?.toFixed(2)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Medico</p>
                                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Q{med.precioMedico?.toFixed(2)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Stock</p>
                                                <p className={`text-sm font-black ${med.stock > 10 ? 'text-slate-700 dark:text-slate-200' : 'text-red-500'}`}>{med.stock}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 lg:col-span-1">
                                            <button
                                                onClick={() => { setEditingMed(med); setFormData(med); }}
                                                className="px-4 py-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-indigo-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm border border-slate-100 dark:border-white/10"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(med.id)}
                                                className="p-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-all shadow-sm border border-slate-100 dark:border-white/10"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'details' && (
                                <div className="glass-card p-8 rounded-[3rem] border border-white dark:border-white/5 shadow-2xl h-full flex flex-col md:flex-row gap-8 group hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/[0.03] blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />

                                    <div className="w-full md:w-48 h-48 rounded-[2rem] bg-indigo-50/30 dark:bg-slate-800/80 border border-slate-100 dark:border-white/10 shadow-inner flex-shrink-0 flex items-center justify-center overflow-hidden p-6 group-hover:scale-105 transition-transform duration-500">
                                        {med.imageUrl ? (
                                            <img src={med.imageUrl} alt={med.nombre} className="w-full h-full object-contain drop-shadow-2xl" />
                                        ) : (
                                            <Package size={64} className="text-slate-200 dark:text-slate-700" />
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col relative z-10">
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                                    ID: #{med.id.slice(-4)}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${med.stock > 10 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {med.stock > 10 ? '✓ En Stock' : '⚠ Stock Bajo'}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-2xl leading-none uppercase tracking-tight">{med.nombre}</h4>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{med.presentacion}</p>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5 mb-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Público</p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">Q{med.precioPublico?.toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Farmacia</p>
                                                <p className="text-lg font-black text-blue-600 dark:text-blue-400">Q{med.precioFarmacia?.toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Médico</p>
                                                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">Q{med.precioMedico?.toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Inventario</p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">{med.stock} <span className="text-[10px] uppercase opacity-40">U</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-200/50 dark:border-white/5">
                                            <button
                                                onClick={() => { setEditingMed(med); setFormData(med); }}
                                                className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                            >
                                                <Edit2 size={16} /> Modificar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(med.id)}
                                                className="w-14 h-14 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-red-100 dark:border-red-500/20"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Form Drawer */}
            {(isAdding || editingMed) && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border-t border-white dark:border-white/10 max-h-[90vh] flex flex-col my-auto">
                        <div className="p-8 md:p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 relative">
                            <div className="absolute top-0 left-0 w-32 h-1.5 bg-indigo-600 rounded-full mx-auto left-1/2 -translate-x-1/2 -mt-0.75 opacity-20 pointer-events-none" />

                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                                    {isAdding ? 'Nuevo Ingreso' : 'Actualizar Producto'}
                                </h3>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                    <span className="w-8 h-px bg-indigo-500 opacity-30" />
                                    Gestion de Inventario
                                </p>
                            </div>
                            <button onClick={() => { setIsAdding(false); setEditingMed(null); }} className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-100 dark:border-white/10 shadow-sm group">
                                <X size={28} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="md:col-span-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial del Medicamento</label>
                                    <input
                                        className="w-full px-7 py-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 dark:text-slate-200 text-lg transition-all"
                                        placeholder="Nombre completo..."
                                        value={formData.nombre || ''}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Presentación / Formato</label>
                                        <input
                                            className="w-full px-7 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
                                            placeholder="e.g. 120 mL, 20 tabletas"
                                            value={formData.presentacion || ''}
                                            onChange={e => setFormData({ ...formData, presentacion: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Unidades en Stock</label>
                                        <input
                                            type="number"
                                            className="w-full px-7 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
                                            value={formData.stock || ''}
                                            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <ImageIcon size={12} className="text-indigo-500" /> Vínculo de Imagen (URL Directa)
                                    </label>
                                    <input
                                        className="w-full px-7 py-4 bg-slate-100/50 dark:bg-black/40 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-slate-500 dark:text-slate-400 text-sm transition-all"
                                        placeholder="https://images.unsplash.com/photo-..."
                                        value={formData.imageUrl || ''}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-4 space-y-6">
                                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-500/10 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-400 dark:text-indigo-400/50 uppercase tracking-widest ml-1">Precio Público Sugerido (Q)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-indigo-300">Q</span>
                                            <input
                                                type="number"
                                                className="w-full pl-12 pr-7 py-4 bg-white dark:bg-black/40 border border-indigo-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-indigo-600 dark:text-indigo-400 text-xl transition-all"
                                                value={formData.precioPublico || ''}
                                                onChange={e => setFormData({ ...formData, precioPublico: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-400 dark:text-blue-400/50 uppercase tracking-widest ml-1">Precio Farmacia (Q)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-blue-300">Q</span>
                                            <input
                                                type="number"
                                                className="w-full pl-12 pr-7 py-4 bg-white dark:bg-black/40 border border-blue-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-blue-600 dark:text-blue-400 text-xl transition-all"
                                                value={formData.precioFarmacia || ''}
                                                onChange={e => setFormData({ ...formData, precioFarmacia: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-emerald-400 dark:text-emerald-400/50 uppercase tracking-widest ml-1">Precio Médico (Q)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-300">Q</span>
                                            <input
                                                type="number"
                                                className="w-full pl-12 pr-7 py-4 bg-white dark:bg-black/40 border border-emerald-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-black text-emerald-600 dark:text-emerald-400 text-xl transition-all"
                                                value={formData.precioMedico || ''}
                                                onChange={e => setFormData({ ...formData, precioMedico: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonif. 2-9</label>
                                        <input
                                            placeholder="e.g. 5%"
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-center text-sm"
                                            value={formData.bonificacion2a9 || ''}
                                            onChange={e => setFormData({ ...formData, bonificacion2a9: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonif. 10+</label>
                                        <input
                                            placeholder="e.g. 10%"
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-center text-sm"
                                            value={formData.bonificacion10Mas || ''}
                                            onChange={e => setFormData({ ...formData, bonificacion10Mas: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-slate-50 dark:bg-black/40 flex flex-col md:flex-row gap-4 border-t border-slate-200 dark:border-white/5">
                            <button
                                onClick={() => { setIsAdding(false); setEditingMed(null); }}
                                className="flex-1 px-10 py-5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-all order-2 md:order-1"
                            >
                                Descartar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all order-1 md:order-2"
                            >
                                <Save size={22} strokeWidth={2.5} /> Confirmar Guardado
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InventoryPage;
