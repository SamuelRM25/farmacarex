import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    const where: any = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    }

    const citas = await db.cita.findMany({
      where,
      include: {
        cliente: true,
      },
      orderBy: { fecha: 'asc' },
    });

    return NextResponse.json(citas);
  } catch (error) {
    console.error('Error fetching citas:', error);
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, titulo, fecha, duracion, descripcion } = body;

    const cita = await db.cita.create({
      data: {
        clienteId,
        titulo,
        fecha: new Date(fecha),
        duracion: duracion ? parseInt(duracion) : null,
        descripcion,
        estado: 'pendiente',
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error('Error creating cita:', error);
    return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
  }
}
