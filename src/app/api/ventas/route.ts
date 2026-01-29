import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const visitaId = searchParams.get('visitaId');

    const where: any = {};
    if (visitaId) {
      where.visitaId = visitaId;
    }

    const ventas = await db.venta.findMany({
      where,
      include: {
        items: {
          include: {
            medicamento: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return NextResponse.json(ventas);
  } catch (error) {
    console.error('Error fetching ventas:', error);
    return NextResponse.json({ error: 'Error al obtener ventas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitaId, fecha, notas, items } = body;

    // Calcular total de la venta
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.cantidad * item.precioUnitario);
    }, 0);

    const venta = await db.venta.create({
      data: {
        visitaId,
        fecha: new Date(fecha),
        total,
        notas,
        items: {
          create: items.map((item: any) => ({
            medicamentoId: item.medicamentoId,
            cantidad: parseInt(item.cantidad),
            precioUnitario: parseFloat(item.precioUnitario),
            subtotal: parseInt(item.cantidad) * parseFloat(item.precioUnitario),
          })),
        },
      },
      include: {
        items: {
          include: {
            medicamento: true,
          },
        },
      },
    });

    return NextResponse.json(venta, { status: 201 });
  } catch (error) {
    console.error('Error creating venta:', error);
    return NextResponse.json({ error: 'Error al crear venta' }, { status: 500 });
  }
}
