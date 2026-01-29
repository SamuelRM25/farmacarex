import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planificacion = await db.planificacion.findUnique({
      where: { id: params.id },
      include: {
        detalles: {
          include: {
            cliente: true,
          },
          orderBy: { fecha: 'asc' },
        },
      },
    });

    if (!planificacion) {
      return NextResponse.json({ error: 'Planificación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(planificacion);
  } catch (error) {
    console.error('Error fetching planificacion:', error);
    return NextResponse.json({ error: 'Error al obtener planificación' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const planificacion = await db.planificacion.update({
      where: { id: params.id },
      data: body,
      include: {
        detalles: {
          include: {
            cliente: true,
          },
          orderBy: { fecha: 'asc' },
        },
      },
    });

    return NextResponse.json(planificacion);
  } catch (error) {
    console.error('Error updating planificacion:', error);
    return NextResponse.json({ error: 'Error al actualizar planificación' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.planificacion.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Planificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting planificacion:', error);
    return NextResponse.json({ error: 'Error al eliminar planificación' }, { status: 500 });
  }
}
