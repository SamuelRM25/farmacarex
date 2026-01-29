import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrCreateSheet, syncAllToGoogleSheets } from '@/lib/google-sheets';

/**
 * Sincroniza TODOS los datos a Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId } = body;

    const sheetId = spreadsheetId || await getOrCreateSheet();

    // Obtener todos los datos de la base de datos
    const [clientes, medicamentos, visitas, citas, planificaciones] = await Promise.all([
      db.cliente.findMany({ where: { activo: true } }),
      db.medicamento.findMany({ where: { activo: true } }),
      db.visita.findMany({
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
      }),
      db.cita.findMany({
        include: { cliente: true },
      }),
      db.planificacion.findMany({
        include: {
          detalles: {
            include: { cliente: true },
          },
        },
      }),
    ]);

    // Obtener ventas separadas
    const ventas = await db.venta.findMany({
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

    console.log('Iniciando sincronización masiva a Google Sheets...');
    console.log(`- ${clientes.length} clientes`);
    console.log(`- ${medicamentos.length} medicamentos`);
    console.log(`- ${visitas.length} visitas`);
    console.log(`- ${ventas.length} ventas`);
    console.log(`- ${citas.length} citas`);
    console.log(`- ${planificaciones.length} planificaciones`);

    // Sincronizar todo a Google Sheets
    const results = await syncAllToGoogleSheets(
      {
        clientes,
        medicamentos,
        visitas,
        ventas,
        citas,
        planificaciones,
      },
      sheetId
    );

    const total = Object.values(results).reduce((sum: number, r: any) => sum + r.success, 0);
    const failed = Object.values(results).reduce((sum: number, r: any) => sum + r.failed, 0);

    return NextResponse.json({
      success: true,
      message: 'Sincronización masiva completada',
      results: {
        clientes: `${results.clientes.success}/${clientes.length}`,
        medicamentos: `${results.medicamentos.success}/${medicamentos.length}`,
        visitas: `${results.visitas.success}/${visitas.length}`,
        ventas: `${results.ventas.success}/${ventas.length}`,
        citas: `${results.citas.success}/${citas.length}`,
        planificaciones: `${results.planificaciones.success}/${planificaciones.length}`,
      },
      summary: {
        totalSynced: total,
        totalFailed: failed,
        successRate: `${((total / (total + failed)) * 100).toFixed(1)}%`,
      },
    });
  } catch (error) {
    console.error('Error en sincronización masiva:', error);
    return NextResponse.json(
      { success: false, error: 'Error en sincronización masiva' },
      { status: 500 }
    );
  }
}
