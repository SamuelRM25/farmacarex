import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const planificaciones = await db.planificacion.findMany({
      include: {
        detalles: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(planificaciones);
  } catch (error) {
    console.error('Error fetching planificaciones:', error);
    return NextResponse.json({ error: 'Error al obtener planificaciones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fechaInicio, fechaFin, tipo, notas, detalles } = body;

    const planificacion = await db.planificacion.create({
      data: {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        tipo,
        notas,
        detalles: {
          create: detalles.map((det: any) => ({
            dia: det.dia,
            fecha: new Date(det.fecha),
            giro: det.giro,
            horario: det.horario,
            direccion: det.direccion,
            clienteId: det.clienteId,
            notas: det.notas,
          })),
        },
      },
      include: {
        detalles: {
          include: {
            cliente: true,
          },
        },
      },
    });

    return NextResponse.json(planificacion, { status: 201 });
  } catch (error) {
    console.error('Error creating planificacion:', error);
    return NextResponse.json({ error: 'Error al crear planificación' }, { status: 500 });
  }
}
