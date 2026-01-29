import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  getOrCreateSheet, 
  syncClienteToSheets, 
  syncMedicamentoToSheets, 
  syncVisitaToSheets,
  syncVentaToSheets,
  syncCitaToSheets,
  syncPlanificacionToSheets
} from '@/lib/google-sheets';

/**
 * Obtiene o crea el spreadsheet de Google Sheets
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const spreadsheetId = searchParams.get('spreadsheetId');

    const sheetId = await getOrCreateSheet(spreadsheetId || undefined);

    return NextResponse.json({
      success: true,
      spreadsheetId: sheetId,
      message: 'Spreadsheet de FarmaCarex listo para uso'
    });
  } catch (error) {
    console.error('Error inicializando spreadsheet:', error);
    return NextResponse.json(
      { success: false, error: 'Error al conectar con Google Sheets' },
      { status: 500 }
    );
  }
}

/**
 * Sincroniza datos específicos a Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, spreadsheetId, id } = body;

    const sheetId = spreadsheetId || await getOrCreateSheet();

    let result;
    switch (tipo) {
      case 'cliente': {
        const cliente = await db.cliente.findUnique({ where: { id } });
        if (cliente) {
          result = await syncClienteToSheets(cliente, sheetId);
        }
        break;
      }

      case 'medicamento': {
        const medicamento = await db.medicamento.findUnique({ where: { id } });
        if (medicamento) {
          result = await syncMedicamentoToSheets(medicamento, sheetId);
        }
        break;
      }

      case 'visita': {
        const visita = await db.visita.findUnique({
          where: { id },
          include: {
            cliente: true,
            ventas: true,
          },
        });
        if (visita) {
          result = await syncVisitaToSheets(visita, sheetId);
        }
        break;
      }

      case 'venta': {
        const venta = await db.venta.findUnique({
          where: { id },
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
        if (venta) {
          result = await syncVentaToSheets(venta, sheetId);
        }
        break;
      }

      case 'cita': {
        const cita = await db.cita.findUnique({
          where: { id },
          include: { cliente: true },
        });
        if (cita) {
          result = await syncCitaToSheets(cita, sheetId);
        }
        break;
      }

      case 'planificacion': {
        const planificacion = await db.planificacion.findUnique({
          where: { id },
          include: {
            detalles: {
              include: { cliente: true },
            },
          },
        });
        if (planificacion) {
          result = await syncPlanificacionToSheets(planificacion, sheetId);
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de sincronización no válido' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result?.success || false,
      message: result?.success 
        ? `${tipo} sincronizado correctamente a Google Sheets`
        : 'Error al sincronizar',
      action: result?.action || 'created',
    });
  } catch (error) {
    console.error('Error en sincronización:', error);
    return NextResponse.json(
      { success: false, error: 'Error en sincronización con Google Sheets' },
      { status: 500 }
    );
  }
}
