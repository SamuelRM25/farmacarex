import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicamento = await db.medicamento.findUnique({
      where: { id: params.id },
    });

    if (!medicamento) {
      return NextResponse.json({ error: 'Medicamento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(medicamento);
  } catch (error) {
    console.error('Error fetching medicamento:', error);
    return NextResponse.json({ error: 'Error al obtener medicamento' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const medicamento = await db.medicamento.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(medicamento);
  } catch (error) {
    console.error('Error updating medicamento:', error);
    return NextResponse.json({ error: 'Error al actualizar medicamento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicamento = await db.medicamento.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({ message: 'Medicamento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting medicamento:', error);
    return NextResponse.json({ error: 'Error al eliminar medicamento' }, { status: 500 });
  }
}
