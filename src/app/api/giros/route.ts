import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const giros = await db.giro.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(giros);
  } catch (error) {
    console.error('Error fetching giros:', error);
    return NextResponse.json({ error: 'Error al obtener giros' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion } = body;

    const giro = await db.giro.create({
      data: {
        nombre,
        descripcion,
      },
    });

    return NextResponse.json(giro, { status: 201 });
  } catch (error) {
    console.error('Error creating giro:', error);
    return NextResponse.json({ error: 'Error al crear giro' }, { status: 500 });
  }
}
