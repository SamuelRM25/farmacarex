import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cita = await db.cita.update({
      where: { id: params.id },
      data: body,
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(cita);
  } catch (error) {
    console.error('Error updating cita:', error);
    return NextResponse.json({ error: 'Error al actualizar cita' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cita.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting cita:', error);
    return NextResponse.json({ error: 'Error al eliminar cita' }, { status: 500 });
  }
}
