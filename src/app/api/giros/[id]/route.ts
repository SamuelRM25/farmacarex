import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const giro = await db.giro.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(giro);
  } catch (error) {
    console.error('Error updating giro:', error);
    return NextResponse.json({ error: 'Error al actualizar giro' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.giro.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({ message: 'Giro eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting giro:', error);
    return NextResponse.json({ error: 'Error al eliminar giro' }, { status: 500 });
  }
}
