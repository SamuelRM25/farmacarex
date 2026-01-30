import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, MapPin } from 'lucide-react';
import type { Client } from '../types';
import { useStore } from '../store';

const ClientsPage: React.FC = () => {
    const { clients, addClient, updateClient, removeClient } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<Partial<Client>>({});

    const handleAdd = () => {
        setIsAdding(true);
        setFormData({
            id: Date.now().toString(),
            colegiado: '',
            especialidad: '',
            nombre: '',
            apellido: '',
            direccion: '',
            municipio: '',
            departamento: '',
            telefono: ''
        });
    };

    const handleSave = async () => {
        if (editingClient) {
            await updateClient({ ...editingClient, ...formData } as Client);
            setEditingClient(null);
        } else if (isAdding) {
            await addClient(formData as Client);
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            await removeClient(id);
        }
    };

    const filteredClients = clients.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-6 md:space-y-8 animate-slide-up">
                {/* Header / Search */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white/50 dark:bg-slate-900/40 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-sm">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Directorio de Clientes</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gestiona tu red de contactos médicos</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar médico o especialidad..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>Nuevo Cliente</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Cards (visible only on mobile) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="glass-card rounded-[2rem] p-6 flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex flex-col gap-1">
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-widest w-fit">
                                        {client.especialidad}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                                        {client.nombre} {client.apellido}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingClient(client); setFormData(client); }}
                                        className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 hover:text-red-600 shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mt-2 relative z-10">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-tighter">Colegiado</label>
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{client.colegiado || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-tighter">Ubicación</label>
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">{client.municipio}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 px-4 py-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/10 relative z-10">
                                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-tighter">Teléfono</label>
                                <a href={`tel:${client.telefono}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{client.telefono || 'N/A'}</a>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex gap-3 relative z-10">
                                <button
                                    onClick={() => setEditingClient(client)}
                                    className="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    Perfil
                                </button>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${client.direccion}, ${client.municipio}, ${client.departamento}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2"
                                >
                                    <MapPin size={14} /> Mapa
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table (visible only on desktop) */}
                <div className="hidden md:block glass-card rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Médico</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Especialidad</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Colegiado</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ubicación</th>
                                <th className="px-8 py-5 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                                                {client.nombre[0]}{client.apellido[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{client.nombre} {client.apellido}</span>
                                                <a href={`tel:${client.telefono}`} className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black hover:underline">{client.telefono || 'Sin teléfono'}</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-tight">
                                            {client.especialidad}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{client.colegiado || 'N/A'}</td>
                                    <td className="px-8 py-5 text-sm font-semibold text-slate-600 dark:text-slate-400">{client.municipio}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => { setEditingClient(client); setFormData(client); }}
                                                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-md transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${client.direccion}, ${client.municipio}, ${client.departamento}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-500/30 hover:shadow-md transition-all shadow-sm"
                                                title="Ver Mapa"
                                            >
                                                <MapPin size={18} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(client.id)}
                                                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 dark:hover:border-red-500/30 hover:shadow-md transition-all shadow-sm"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredClients.length === 0 && (
                        <div className="p-24 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No se encontraron clientes</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">Prueba ajustando los términos de búsqueda o agrega un nuevo médico.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form Placeholder */}
            {(isAdding || editingClient) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">
                                {isAdding ? 'Agregar Nuevo Cliente' : 'Editar Cliente'}
                            </h3>
                            <button
                                onClick={() => { setIsAdding(false); setEditingClient(null); }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.nombre || ''}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Apellido</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.apellido || ''}
                                    onChange={e => setFormData({ ...formData, apellido: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Especialidad</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.especialidad || ''}
                                    onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Colegiado</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.colegiado || ''}
                                    onChange={e => setFormData({ ...formData, colegiado: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Dirección</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.direccion || ''}
                                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Municipio</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.municipio || ''}
                                    onChange={e => setFormData({ ...formData, municipio: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Teléfono</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. 5555-4444"
                                    value={formData.telefono || ''}
                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Departamento</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.departamento || ''}
                                    onChange={e => setFormData({ ...formData, departamento: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex gap-3 justify-end">
                            <button
                                onClick={() => { setIsAdding(false); setEditingClient(null); }}
                                className="px-6 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-200"
                            >
                                <Save size={18} />
                                Guardar {isAdding ? 'Nuevo' : 'Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientsPage;
