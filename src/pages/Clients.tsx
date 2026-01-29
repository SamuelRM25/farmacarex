import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';
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
            departamento: ''
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
        <div className="space-y-6">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar médico o especialidad..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Cliente
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Médico</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Especialidad</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Ubicación</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Colegiado</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{client.nombre} {client.apellido}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full uppercase">
                                        {client.especialidad}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-600">{client.direccion}</div>
                                    <div className="text-xs text-slate-400">{client.municipio}, {client.departamento}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{client.colegiado}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => { setEditingClient(client); setFormData(client); }}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredClients.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        No se encontraron clientes.
                    </div>
                )}
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
        </div>
    );
};

export default ClientsPage;
