export interface Medicine {
    id: string;
    nombre: string;
    presentacion: string;
    precioPublico: number;
    precioFarmacia: number;
    bonificacion2a9: string;
    bonificacion10Mas: string;
    precioMedico: number;
    ofertas: string;
    stock: number;
    imageUrl?: string;
}

export interface Client {
    id: string;
    colegiado: string;
    especialidad: string;
    nombre: string;
    apellido: string;
    direccion: string;
    municipio: string;
    departamento: string;
    telefono: string;
    location?: string;
}

export interface SaleItem {
    medicineId: string;
    medicineName: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface Sale {
    id: string;
    visitId: string;
    fecha: string;
    items: SaleItem[];
    total: number;
}

export interface Visit {
    id: string;
    clientId: string;
    clientName: string;
    fecha: string;
    hora: string;
    gira: string;
    notas: string;
    completada: boolean;
    sale?: Sale;
}

export interface Planning {
    id: string;
    gira: string;
    dia: number;
    mes: number;
    anio: number;
    horario: string;
    direccion: string;
    nombreMedico: string;
    clienteId?: string;
}

export interface Tour {
    id: string;
    nombre: string;
}
