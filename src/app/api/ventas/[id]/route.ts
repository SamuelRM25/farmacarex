import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venta = await db.venta.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            medicamento: true,
          },
        },
        visita: {
          include: {
            cliente: true,
          },
        },
      },
    });

    if (!venta) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 });
    }

    return NextResponse.json(venta);
  } catch (error) {
    console.error('Error fetching venta:', error);
    return NextResponse.json({ error: 'Error al obtener venta' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const venta = await db.venta.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(venta);
  } catch (error) {
    console.error('Error updating venta:', error);
    return NextResponse.json({ error: 'Error al actualizar venta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.venta.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Venta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting venta:', error);
    return NextResponse.json({ error: 'Error al eliminar venta' }, { status: 500 });
  }
}
