import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fecha = searchParams.get('fecha');
    const clienteId = searchParams.get('clienteId');

    const where: any = {};

    if (fecha) {
      const fechaDate = new Date(fecha);
      const startOfDay = new Date(fechaDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(fechaDate.setHours(23, 59, 59, 999));
      where.fecha = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    const visitas = await db.visita.findMany({
      where,
      include: {
        cliente: true,
        ventas: {
          include: {
            items: {
              include: {
                medicamento: true,
              },
            },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return NextResponse.json(visitas);
  } catch (error) {
    console.error('Error fetching visitas:', error);
    return NextResponse.json({ error: 'Error al obtener visitas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, fecha, notas } = body;

    const visita = await db.visita.create({
      data: {
        clienteId,
        fecha: new Date(fecha),
        notas,
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(visita, { status: 201 });
  } catch (error) {
    console.error('Error creating visita:', error);
    return NextResponse.json({ error: 'Error al crear visita' }, { status: 500 });
  }
}
