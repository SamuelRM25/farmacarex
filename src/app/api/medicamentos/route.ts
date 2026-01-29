import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const busqueda = searchParams.get('busqueda');

    const where: any = { activo: true };

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    const medicamentos = await db.medicamento.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(medicamentos);
  } catch (error) {
    console.error('Error fetching medicamentos:', error);
    return NextResponse.json({ error: 'Error al obtener medicamentos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      descripcion,
      precioPublico,
      precioFarmacia,
      bonificacion2a9,
      bonificacion10Mas,
      precioMedico,
      oferta,
      ofertaDescripcion,
      stock,
    } = body;

    const medicamento = await db.medicamento.create({
      data: {
        nombre,
        descripcion,
        precioPublico: parseFloat(precioPublico),
        precioFarmacia: parseFloat(precioFarmacia),
        bonificacion2a9,
        bonificacion10Mas,
        precioMedico: parseFloat(precioMedico),
        oferta: oferta || false,
        ofertaDescripcion,
        stock: parseInt(stock) || 0,
      },
    });

    return NextResponse.json(medicamento, { status: 201 });
  } catch (error) {
    console.error('Error creating medicamento:', error);
    return NextResponse.json({ error: 'Error al crear medicamento' }, { status: 500 });
  }
}
