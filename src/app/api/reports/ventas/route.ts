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

    const ventas = await db.venta.findMany({
      where: {
        fecha: where.fecha,
      },
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
      orderBy: { fecha: 'desc' },
    });

    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalItems = ventas.reduce((sum, v) => sum + v.items.reduce((is, item) => is + item.cantidad, 0), 0);

    const ventasPorCliente = ventas.reduce((acc: any, venta) => {
      const clienteNombre = `${venta.visita.cliente.nombre} ${venta.visita.cliente.apellido}`;
      acc[clienteNombre] = (acc[clienteNombre] || 0) + venta.total;
      return acc;
    }, {});

    const ventasPorProducto = ventas.reduce((acc: any, venta) => {
      venta.items.forEach((item: any) => {
        acc[item.medicamento.nombre] = (acc[item.medicamento.nombre] || 0) + (item.cantidad * item.precioUnitario);
      });
      return acc;
    }, {});

    return NextResponse.json({
      ventas,
      estadisticas: {
        totalVentas,
        montoTotal,
        totalItems,
        ventasPorCliente,
        ventasPorProducto,
      },
    });
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 });
  }
}
