import { google } from 'googleapis'

// Tipos para Google Sheets
export interface SheetRow {
  tipo: 'cliente' | 'medicamento' | 'visita' | 'cita' | 'planificacion'
  datos: any
  fecha?: Date
}

let sheets: any = null

/**
 * Inicializa el cliente de Google Sheets
 * Debe llamarse desde el servidor con las credenciales configuradas
 */
export async function initGoogleSheets() {
  if (sheets) {
    return sheets
  }

  try {
    // Procesar la clave privada para mantener los saltos de línea correctos
    let privateKey = process.env.GOOGLE_PRIVATE_KEY
    if (privateKey) {
      // Reemplazar \n literales con saltos de línea reales
      privateKey = privateKey.replace(/\\n/g, '\n')
    }

    // Las credenciales deben configurarse en variables de entorno
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    sheets = google.sheets({ version: 'v4', auth })
    return sheets
  } catch (error) {
    console.error('Error inicializando Google Sheets:', error)
    throw new Error('No se pudo conectar con Google Sheets')
  }
}

/**
 * Obtiene o crea la hoja principal de FarmaCarex
 */
export async function getOrCreateSheet(spreadsheetId?: string) {
  const sheets = await initGoogleSheets()

  try {
    // Si no se proporciona ID, crear nuevo spreadsheet
    if (!spreadsheetId) {
      const response = await sheets.spreadsheets.create({
        resource: {
          properties: {
            title: `FarmaCarex - ${new Date().toLocaleDateString('es-GT')}`,
          },
          sheets: [
            { properties: { title: 'Clientes' } },
            { properties: { title: 'Medicamentos' } },
            { properties: { title: 'Visitas' } },
            { properties: { title: 'Ventas' } },
            { properties: { title: 'Citas' } },
            { properties: { title: 'Planificaciones' } },
          ],
        },
      })

      return response.data.spreadsheetId
    }

    // Verificar que el spreadsheet existe
    await sheets.spreadsheets.get({ spreadsheetId })
    return spreadsheetId
  } catch (error: any) {
    console.error('Error verificando spreadsheet:', error)
    throw error
  }
}

/**
 * Sincroniza un cliente con Google Sheets
 */
export async function syncClienteToSheets(cliente: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    // Obtener datos actuales de clientes
    const range = 'Clientes!A2:Z'
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []
    
    // Buscar si el cliente ya existe
    const existingRow = rows.find((row: any[]) => 
      row[0] === cliente.id
    )

    // Preparar fila de datos
    const newRow = [
      cliente.id,                    // A: ID
      new Date().toISOString(),       // B: Fecha sincronización
      cliente.tipo || 'medico',      // C: Tipo
      cliente.nombre,                 // D: Nombre
      cliente.apellido,               // E: Apellido
      cliente.colegiado || '',        // F: Colegiado
      cliente.especialidad || '',     // G: Especialidad
      cliente.direccion,              // H: Dirección
      cliente.municipio,              // I: Municipio
      cliente.departamento,           // J: Departamento
      cliente.telefono || '',        // K: Teléfono
      cliente.email || '',           // L: Email
      cliente.notas || '',            // M: Notas
      cliente.activo ? 'Activo' : 'Inactivo',  // N: Estado
    ]

    if (existingRow) {
      // Actualizar fila existente
      const rowIndex = rows.indexOf(existingRow) + 2 // +2 porque la fila 1 es el header
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Clientes!A${rowIndex}:N${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        values: [newRow],
      })

      console.log(`Cliente actualizado en Google Sheets: ${cliente.nombre} ${cliente.apellido}`)
    } else {
      // Agregar nueva fila
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Clientes!A2',
        valueInputOption: 'USER_ENTERED',
        values: [newRow],
      })

      console.log(`Cliente agregado a Google Sheets: ${cliente.nombre} ${cliente.apellido}`)
    }

    return { success: true, action: existingRow ? 'updated' : 'created' }
  } catch (error) {
    console.error('Error sincronizando cliente a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza un medicamento con Google Sheets
 */
export async function syncMedicamentoToSheets(medicamento: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    // Preparar fila de datos
    const newRow = [
      medicamento.id,
      new Date().toISOString(),
      medicamento.nombre,
      medicamento.descripcion || '',
      medicamento.precioPublico?.toFixed(2) || '0.00',
      medicamento.precioFarmacia?.toFixed(2) || '0.00',
      medicamento.precioMedico?.toFixed(2) || '0.00',
      medicamento.bonificacion2a9 || '',
      medicamento.bonificacion10Mas || '',
      medicamento.oferta ? 'Sí' : 'No',
      medicamento.ofertaDescripcion || '',
      medicamento.stock || 0,
      medicamento.activo ? 'Activo' : 'Inactivo',
    ]

    // Agregar a hoja de medicamentos
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Medicamentos!A2',
      valueInputOption: 'USER_ENTERED',
      values: [newRow],
    })

    console.log(`Medicamento sincronizado: ${medicamento.nombre}`)
    return { success: true }
  } catch (error) {
    console.error('Error sincronizando medicamento a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza una visita con Google Sheets
 */
export async function syncVisitaToSheets(visita: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    const clienteNombre = visita.cliente ? `${visita.cliente.nombre} ${visita.cliente.apellido}` : 'N/A'
    
    const newRow = [
      visita.id,
      new Date().toISOString(),
      visita.fecha,
      clienteNombre,
      visita.totalVenta?.toFixed(2) || '0.00',
      visita.notas || '',
      visita.ventas?.length || 0,
      visita.ventas?.reduce((sum: number, v: any) => 
        sum + v.items?.reduce((is: number, i: any) => is + i.cantidad, 0)
      , 0) || 0,
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Visitas!A2',
      valueInputOption: 'USER_ENTERED',
      values: [newRow],
    })

    console.log(`Visita sincronizada: ${clienteNombre}`)
    return { success: true }
  } catch (error) {
    console.error('Error sincronizando visita a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza una venta con Google Sheets
 */
export async function syncVentaToSheets(venta: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    const clienteNombre = venta.visita?.cliente 
      ? `${venta.visita.cliente.nombre} ${venta.visita.cliente.apellido}`
      : 'N/A'

    const productos = venta.items?.map((item: any) => 
      `${item.medicamento?.nombre || 'N/A'} (x${item.cantidad})`
    ).join(', ') || ''

    const newRow = [
      venta.id,
      new Date().toISOString(),
      venta.fecha,
      clienteNombre,
      venta.total?.toFixed(2) || '0.00',
      venta.items?.length || 0,
      productos,
      venta.notas || '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Ventas!A2',
      valueInputOption: 'USER_ENTERED',
      values: [newRow],
    })

    console.log(`Venta sincronizada: Q${venta.total?.toFixed(2)}`)
    return { success: true }
  } catch (error) {
    console.error('Error sincronizando venta a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza una cita con Google Sheets
 */
export async function syncCitaToSheets(cita: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    const clienteNombre = cita.cliente 
      ? `${cita.cliente.nombre} ${cita.cliente.apellido}`
      : 'N/A'

    const newRow = [
      cita.id,
      new Date().toISOString(),
      cita.fecha,
      clienteNombre,
      cita.titulo,
      cita.duracion || '',
      cita.estado,
      cita.descripcion || '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Citas!A2',
      valueInputOption: 'USER_ENTERED',
      values: [newRow],
    })

    console.log(`Cita sincronizada: ${cita.titulo}`)
    return { success: true }
  } catch (error) {
    console.error('Error sincronizando cita a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza una planificación con Google Sheets
 */
export async function syncPlanificacionToSheets(planificacion: any, spreadsheetId: string) {
  const sheets = await initGoogleSheets()

  try {
    const detalles = planificacion.detalles?.map((d: any) => 
      `${d.dia}: ${d.giro} - ${d.cliente?.nombre || 'Sin cliente'}`
    ).join(' | ') || ''

    const newRow = [
      planificacion.id,
      new Date().toISOString(),
      planificacion.fechaInicio,
      planificacion.fechaFin,
      planificacion.tipo,
      detalles,
      planificacion.detalles?.length || 0,
      planificacion.notas || '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Planificaciones!A2',
      valueInputOption: 'USER_ENTERED',
      values: [newRow],
    })

    console.log(`Planificación sincronizada: ${planificacion.tipo}`)
    return { success: true }
  } catch (error) {
    console.error('Error sincronizando planificación a Sheets:', error)
    return { success: false, error: error }
  }
}

/**
 * Sincroniza todos los datos de FarmaCarex a Google Sheets
 */
export async function syncAllToGoogleSheets(data: {
  clientes?: any[]
  medicamentos?: any[]
  visitas?: any[]
  ventas?: any[]
  citas?: any[]
  citas?: any[]
  planificaciones?: any[]
}, spreadsheetId: string) {
  const results = {
    clientes: { success: 0, failed: 0 },
    medicamentos: { success: 0, failed: 0 },
    visitas: { success: 0, failed: 0 },
    ventas: { success: 0, failed: 0 },
    citas: { success: 0, failed: 0 },
    planificaciones: { success: 0, failed: 0 },
  }

  // Sincronizar clientes
  if (data.clientes) {
    for (const cliente of data.clientes) {
      const result = await syncClienteToSheets(cliente, spreadsheetId)
      if (result.success) results.clientes.success++
      else results.clientes.failed++
    }
  }

  // Sincronizar medicamentos
  if (data.medicamentos) {
    for (const medicamento of data.medicamentos) {
      const result = await syncMedicamentoToSheets(medicamento, spreadsheetId)
      if (result.success) results.medicamentos.success++
      else results.medicamentos.failed++
    }
  }

  // Sincronizar visitas
  if (data.visitas) {
    for (const visita of data.visitas) {
      const result = await syncVisitaToSheets(visita, spreadsheetId)
      if (result.success) results.visitas.success++
      else results.visitas.failed++
    }
  }

  // Sincronizar ventas
  if (data.ventas) {
    for (const venta of data.ventas) {
      const result = await syncVentaToSheets(venta, spreadsheetId)
      if (result.success) results.ventas.success++
      else results.ventas.failed++
    }
  }

  // Sincronizar citas
  if (data.citas) {
    for (const cita of data.citas) {
      const result = await syncCitaToSheets(cita, spreadsheetId)
      if (result.success) results.citas.success++
      else results.citas.failed++
    }
  }

  // Sincronizar planificaciones
  if (data.planificaciones) {
    for (const planificacion of data.planificaciones) {
      const result = await syncPlanificacionToSheets(planificacion, spreadsheetId)
      if (result.success) results.planificaciones.success++
      else results.planificaciones.failed++
    }
  }

  return results
}

/**
 * Obtiene datos de Google Sheets
 */
export async function getFromGoogleSheets(
  spreadsheetId: string,
  sheetName: 'Clientes' | 'Medicamentos' | 'Visitas' | 'Ventas' | 'Citas' | 'Planificaciones'
) {
  const sheets = await initGoogleSheets()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:Z`,
    })

    const values = response.data.values || []
    const headers = values.length > 0 ? values[0] : []
    const rows = values.length > 1 ? values.slice(1) : []

    return { headers, rows, success: true }
  } catch (error) {
    console.error(`Error obteniendo datos de ${sheetName}:`, error)
    return { headers: [], rows: [], success: false, error }
  }
}
