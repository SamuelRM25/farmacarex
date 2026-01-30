import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client, Medicine, Visit, Planning, Tour } from '../types';
import { googleSheetsService } from '../services/googleSheets';

interface AppState {
    clients: Client[];
    medicines: Medicine[];
    visits: Visit[];
    planning: Planning[];
    tours: Tour[];
    isLoading: boolean;
    currentUser: any | null;
    spreadsheetId: string | null;
    theme: 'light' | 'dark';

    // Actions
    setClients: (clients: Client[]) => void;
    setMedicines: (medicines: Medicine[]) => void;
    setVisits: (visits: Visit[]) => void;
    setPlanning: (planning: Planning[]) => void;
    setTours: (tours: Tour[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setCurrentUser: (user: any | null) => void;
    setSpreadsheetId: (id: string | null) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
    syncAll: () => Promise<void>;
    addClient: (client: Client) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    removeClient: (id: string) => Promise<void>;
    addPlan: (plan: Planning) => Promise<void>;
    updatePlan: (plan: Planning) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
    addVisit: (visit: Visit) => Promise<void>;
    updateVisit: (visit: Visit) => Promise<void>;
    resetDay: () => Promise<void>;
    resetAllData: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            clients: [],
            medicines: [],
            visits: [],
            planning: [],
            tours: [
                { id: '1', nombre: 'Montaña Alta Hue' },
                { id: '2', nombre: 'Montaña Baja Hue' },
                { id: '3', nombre: 'Huehuetenango Cabecera' },
                { id: '4', nombre: 'Totonicapán Híbrido' },
            ],
            isLoading: false,
            currentUser: null,
            spreadsheetId: null,
            theme: 'light',

            setClients: (clients) => set({ clients }),
            setMedicines: (medicines) => set({ medicines }),
            setVisits: (visits) => set({ visits }),
            setPlanning: (planning) => set({ planning }),
            setTours: (tours) => set({ tours }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setCurrentUser: (user) => set({ currentUser: user }),
            setSpreadsheetId: (id) => set({ spreadsheetId: id }),
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

            syncAll: async () => {
                const { spreadsheetId, currentUser, setCurrentUser } = get();
                if (!spreadsheetId) return;

                set({ isLoading: true });
                try {
                    // Si no tenemos token pero sí usuario, intentamos re-autenticar silenciosamente
                    if (!googleSheetsService.hasToken() && currentUser) {
                        try {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        } catch (authError) {
                            console.warn('Silent re-auth failed, session might be expired');
                            // Si falla la re-autenticación silenciosa, no intentamos sincronizar
                            // para evitar errores 403 en consola, pero no borramos el usuario
                            // para permitir que el usuario intente re-login manualmente
                            set({ isLoading: false });
                            return;
                        }
                    }

                    const [clientsData, medicinesData, planningData] = await Promise.all([
                        googleSheetsService.getValues(spreadsheetId, 'Clientes!A2:Z'),
                        googleSheetsService.getValues(spreadsheetId, 'Medicamentos!A2:Z'),
                        googleSheetsService.getValues(spreadsheetId, 'Planificacion!A2:Z'),
                    ]);

                    const parseNumber = (val: any) => {
                        if (typeof val === 'number') return val;
                        const cleaned = String(val || '0').replace(/[^0-9.-]/g, '');
                        return parseFloat(cleaned) || 0;
                    };

                    set({
                        clients: clientsData.length > 0 ? clientsData.map((row: any[], index: number) => ({
                            id: row[0] || String(index + 1),
                            colegiado: row[1] || '',
                            especialidad: row[2] || '',
                            nombre: row[3] || '',
                            apellido: row[4] || '',
                            direccion: row[5] || '',
                            municipio: row[6] || '',
                            departamento: row[7] || '',
                            telefono: row[8] || '',
                        })) : [],
                        medicines: medicinesData.length > 0 ? medicinesData.map((row: any[], index: number) => ({
                            id: row[0] || String(index + 1),
                            nombre: row[1] || '',
                            presentacion: row[2] || '',
                            precioPublico: parseNumber(row[3]),
                            precioFarmacia: parseNumber(row[4]),
                            bonificacion2a9: row[5] || '',
                            bonificacion10Mas: row[6] || '',
                            precioMedico: parseNumber(row[7]),
                            ofertas: row[8] || '',
                            stock: parseNumber(row[9]),
                            imageUrl: row[10] || ''
                        })) : [],
                        planning: planningData.length > 0 ? planningData.map((row: any[], index: number) => ({
                            id: row[0] || String(index + 1),
                            gira: row[1] || '',
                            dia: Number(row[2]),
                            mes: Number(row[3]),
                            anio: Number(row[4]),
                            horario: row[5] || '',
                            direccion: row[6] || '',
                            nombreMedico: row[7] || '',
                        })) : []
                    });
                } catch (error: any) {
                    console.error('Error syncing data:', error);
                    // Si recibimos un 401 o 403, significa que el token no es válido o expiró
                    if (error?.status === 401 || error?.status === 403) {
                        console.warn('Authentication expired. Clearing session.');
                        setCurrentUser(null);
                    }
                } finally {
                    set({ isLoading: false });
                }
            },

            addClient: async (client: Client) => {
                const { spreadsheetId, clients, currentUser, setCurrentUser } = get();
                set({ clients: [...clients, client] });

                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.appendValues(spreadsheetId, 'Clientes!A2', [[
                            client.id, client.colegiado, client.especialidad, client.nombre,
                            client.apellido, client.direccion, client.municipio, client.departamento,
                            client.telefono
                        ]]);
                    } catch (error: any) {
                        console.error('Error adding client to Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            updateClient: async (client: Client) => {
                const { spreadsheetId, clients, currentUser, setCurrentUser } = get();
                const newClients = clients.map(c => c.id === client.id ? client : c);
                set({ clients: newClients });

                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        const values = newClients.map(c => [
                            c.id, c.colegiado, c.especialidad, c.nombre,
                            c.apellido, c.direccion, c.municipio, c.departamento
                        ]);
                        await googleSheetsService.updateValues(spreadsheetId, 'Clientes!A2', values);
                    } catch (error: any) {
                        console.error('Error updating client in Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            removeClient: async (id: string) => {
                const { spreadsheetId, clients, currentUser, setCurrentUser } = get();
                const newClients = clients.filter(c => c.id !== id);
                set({ clients: newClients });

                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.clearValues(spreadsheetId, 'Clientes!A2:Z');
                        const values = newClients.map(c => [
                            c.id, c.colegiado, c.especialidad, c.nombre,
                            c.apellido, c.direccion, c.municipio, c.departamento
                        ]);
                        if (values.length > 0) {
                            await googleSheetsService.updateValues(spreadsheetId, 'Clientes!A2', values);
                        }
                    } catch (error: any) {
                        console.error('Error removing client from Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            addPlan: async (plan: Planning) => {
                const { spreadsheetId, planning, currentUser, setCurrentUser } = get();
                set({ planning: [...planning, plan] });
                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.appendValues(spreadsheetId, 'Planificacion!A2', [[
                            plan.id, plan.gira, plan.dia.toString(), plan.mes.toString(), plan.anio.toString(),
                            plan.horario, plan.direccion, plan.nombreMedico
                        ]]);
                    } catch (error: any) {
                        console.error('Error adding plan to Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            updatePlan: async (plan: Planning) => {
                const { spreadsheetId, planning, currentUser, setCurrentUser } = get();
                const newPlanning = planning.map(p => p.id === plan.id ? plan : p);
                set({ planning: newPlanning });
                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        const values = newPlanning.map(p => [
                            p.id, p.gira, p.dia.toString(), p.mes.toString(), p.anio.toString(),
                            p.horario, p.direccion, p.nombreMedico
                        ]);
                        await googleSheetsService.updateValues(spreadsheetId, 'Planificacion!A2', values);
                    } catch (error: any) {
                        console.error('Error updating plan in Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            removePlan: async (id: string) => {
                const { spreadsheetId, planning, currentUser, setCurrentUser } = get();
                const newPlanning = planning.filter(p => p.id !== id);
                set({ planning: newPlanning });
                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.clearValues(spreadsheetId, 'Planificacion!A2:Z');
                        const values = newPlanning.map(p => [
                            p.id, p.gira, p.dia.toString(), p.mes.toString(), p.anio.toString(),
                            p.horario, p.direccion, p.nombreMedico
                        ]);
                        if (values.length > 0) {
                            await googleSheetsService.updateValues(spreadsheetId, 'Planificacion!A2', values);
                        }
                    } catch (error: any) {
                        console.error('Error removing plan from Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            addVisit: async (visit: Visit) => {
                const { spreadsheetId, visits, currentUser, setCurrentUser } = get();
                const newVisits = [...visits, visit];
                set({ visits: newVisits });

                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.appendValues(spreadsheetId, 'Visitas!A2', [[
                            visit.id, visit.clientId, visit.clientName, visit.fecha,
                            visit.hora, visit.gira, visit.notas, visit.sale?.total || 0
                        ]]);

                        if (visit.sale && visit.sale.items.length > 0) {
                            const saleValues = visit.sale.items.map(item => [
                                visit.sale?.id || Date.now().toString(),
                                visit.id,
                                item.medicineId,
                                item.medicineName,
                                item.cantidad,
                                item.precio,
                                item.subtotal
                            ]);
                            await googleSheetsService.appendValues(spreadsheetId, 'Ventas_Detalle!A2', saleValues);
                        }
                    } catch (error: any) {
                        console.error('Error adding visit to Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            updateVisit: async (visit: Visit) => {
                const { spreadsheetId, visits, currentUser, setCurrentUser } = get();
                const newVisits = visits.map(v => v.id === visit.id ? visit : v);
                set({ visits: newVisits });

                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        // Batch update for visits is complex with append-only strategy. 
                        // Simplified: clear and rewrite or just update the specific row if we tracked indices.
                        // For now, let's just make sure it's updated in local state and try to append if it's a "finish"
                        const values = newVisits.map(v => [
                            v.id, v.clientId, v.clientName, v.fecha,
                            v.hora, v.gira, v.notas, v.sale?.total || 0
                        ]);
                        await googleSheetsService.updateValues(spreadsheetId, 'Visitas!A2', values);
                    } catch (error: any) {
                        console.error('Error updating visit in Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            resetDay: async () => {
                const { spreadsheetId, currentUser, setCurrentUser } = get();
                set({ visits: [] });
                if (spreadsheetId) {
                    try {
                        if (!googleSheetsService.hasToken() && currentUser) {
                            const newToken = await googleSheetsService.authenticate({ prompt: 'none' });
                            setCurrentUser({ ...currentUser, token: newToken });
                        }
                        await googleSheetsService.clearValues(spreadsheetId, 'Visitas!A2:Z');
                    } catch (error: any) {
                        console.error('Error clearing visits from Sheets:', error);
                        if (error?.status === 401 || error?.status === 403) setCurrentUser(null);
                    }
                }
            },

            resetAllData: () => {
                set({
                    clients: [],
                    medicines: [],
                    visits: [],
                    planning: [],
                });
            },
        }),
        {
            name: 'farmacarex-storage',
            partialize: (state) => ({
                clients: state.clients,
                medicines: state.medicines,
                visits: state.visits,
                planning: state.planning,
                tours: state.tours,
                currentUser: state.currentUser,
                spreadsheetId: state.spreadsheetId,
                theme: state.theme,
            }),
        }
    )
);
