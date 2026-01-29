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

    // Actions
    setClients: (clients: Client[]) => void;
    setMedicines: (medicines: Medicine[]) => void;
    setVisits: (visits: Visit[]) => void;
    setPlanning: (planning: Planning[]) => void;
    setTours: (tours: Tour[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setCurrentUser: (user: any | null) => void;
    setSpreadsheetId: (id: string | null) => void;
    syncAll: () => Promise<void>;
    addClient: (client: Client) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    removeClient: (id: string) => Promise<void>;
    addPlan: (plan: Planning) => Promise<void>;
    updatePlan: (plan: Planning) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
    resetDay: () => Promise<void>;
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

            setClients: (clients) => set({ clients }),
            setMedicines: (medicines) => set({ medicines }),
            setVisits: (visits) => set({ visits }),
            setPlanning: (planning) => set({ planning }),
            setTours: (tours) => set({ tours }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setCurrentUser: (user) => set({ currentUser: user }),
            setSpreadsheetId: (id) => set({ spreadsheetId: id }),

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
                        })) : [],
                        medicines: medicinesData.length > 0 ? medicinesData.map((row: any[], index: number) => ({
                            id: row[0] || String(index + 1),
                            nombre: row[1] || '',
                            precioPublico: Number(row[2]) || 0,
                            precioFarmacia: Number(row[3]) || 0,
                            bonif_2_9: row[4] || '',
                            bonif_10_plus: row[5] || '',
                            precioMedico: Number(row[6]) || 0,
                            ofertas: row[7] || '',
                            stock: Number(row[8]) || 0,
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
                            client.apellido, client.direccion, client.municipio, client.departamento
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
            }),
        }
    )
);
