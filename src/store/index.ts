import { create } from 'zustand';
import type { Client, Medicine, Visit, Planning, Tour } from '../types';

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
}

export const useStore = create<AppState>((set) => ({
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
}));
