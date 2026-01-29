import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visita = await db.visita.findUnique({
      where: { id: params.id },
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
    });

    if (!visita) {
      return NextResponse.json({ error: 'Visita no encontrada' }, { status: 404 });
    }

    return NextResponse.json(visita);
  } catch (error) {
    console.error('Error fetching visita:', error);
    return NextResponse.json({ error: 'Error al obtener visita' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const visita = await db.visita.update({
      where: { id: params.id },
      data: body,
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
    });

    return NextResponse.json(visita);
  } catch (error) {
    console.error('Error updating visita:', error);
    return NextResponse.json({ error: 'Error al actualizar visita' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.visita.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Visita eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting visita:', error);
    return NextResponse.json({ error: 'Error al eliminar visita' }, { status: 500 });
  }
}
