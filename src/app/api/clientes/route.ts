import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo');
    const busqueda = searchParams.get('busqueda');

    const where: any = { activo: true };

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo;
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { apellido: { contains: busqueda, mode: 'insensitive' } },
        { colegiado: { contains: busqueda, mode: 'insensitive' } },
        { especialidad: { contains: busqueda, mode: 'insensitive' } },
        { direccion: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    const clientes = await db.cliente.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      colegiado,
      especialidad,
      nombre,
      apellido,
      direccion,
      municipio,
      departamento,
      tipo,
      telefono,
      email,
      notas,
    } = body;

    const cliente = await db.cliente.create({
      data: {
        colegiado,
        especialidad,
        nombre,
        apellido,
        direccion,
        municipio,
        departamento,
        tipo,
        telefono,
        email,
        notas,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error('Error creating cliente:', error);
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 });
  }
}
