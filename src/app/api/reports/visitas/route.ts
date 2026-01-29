import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    const where: any = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    }

    const visitas = await db.visita.findMany({
      where,
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
      orderBy: { fecha: 'asc' },
    });

    const totalVisitas = visitas.length;
    const totalVentas = visitas.reduce((sum, v) => sum + v.totalVenta, 0);
    const visitasConVentas = visitas.filter(v => v.ventas.length > 0).length;
    const totalProductos = visitas.reduce((sum, v) => 
      sum + v.ventas.reduce((vs, venta) => 
        vs + venta.items.reduce((is, item) => is + item.cantidad, 0)
      , 0)
    , 0);

    return NextResponse.json({
      visitas,
      estadisticas: {
        totalVisitas,
        totalVentas,
        visitasConVentas,
        totalProductos,
      },
    });
  } catch (error) {
    console.error('Error generando reporte de visitas:', error);
    return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 });
  }
}
