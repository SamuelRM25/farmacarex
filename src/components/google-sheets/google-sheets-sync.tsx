'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, RefreshCw, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function GoogleSheetsSync() {
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [isInitiated, setIsInitiated] = useState(false)

  const initSpreadsheet = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sync/google-sheets')
      const data = await response.json()

      if (data.success) {
        setSpreadsheetId(data.spreadsheetId)
        setIsInitiated(true)
        setSyncStatus({
          type: 'success',
          message: 'Spreadsheet de FarmaCarex creado exitosamente'
        })
      } else {
        setSyncStatus({
          type: 'error',
          message: 'Error al conectar con Google Sheets'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setSyncStatus({
        type: 'error',
        message: 'Error al conectar con Google Sheets'
      })
    } finally {
      setLoading(false)
    }
  }

  const syncToSheets = async (tipo: string, id?: string) => {
    setLoading(true)
    setSyncStatus(null)

    try {
      const response = await fetch('/api/sync/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, id, spreadsheetId }),
      })

      const data = await response.json()

      if (data.success) {
        setSyncStatus({
          type: 'success',
          message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} sincronizado exitosamente`
        })
      } else {
        setSyncStatus({
          type: 'error',
          message: data.error || 'Error al sincronizar'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setSyncStatus({
        type: 'error',
        message: 'Error al sincronizar con Google Sheets'
      })
    } finally {
      setLoading(false)
    }
  }

  const syncAll = async () => {
    setLoading(true)
    setSyncStatus(null)

    try {
      const response = await fetch('/api/sync/google-sheets/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId }),
      })

      const data = await response.json()

      if (data.success) {
        setSyncStatus({
          type: 'success',
          message: `Sincronización completada: ${data.results?.summary?.successRate || '0%'} éxito`,
          details: data.results,
        })
      } else {
        setSyncStatus({
          type: 'error',
          message: data.error || 'Error en sincronización masiva'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setSyncStatus({
        type: 'error',
        message: 'Error en sincronización masiva'
      })
    } finally {
      setLoading(false)
    }
  }

  const openGoogleSheets = () => {
    if (spreadsheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank')
    }
  }

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-emerald-500" />
          Sincronización con Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          Conecta FarmaCarex con tu Google Sheets para tener respaldos en la nube y colaborar en tiempo real.
        </CardDescription>

        {!isInitiated && (
          <div className="text-center py-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Al hacer clic en "Conectar con Google Sheets", se creará automáticamente una hoja de cálculo con todas las tablas necesarias para FarmaCarex.
            </p>
            <Button
              onClick={initSpreadsheet}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-2" />
                  Conectar con Google Sheets
                </>
              )}
            </Button>
          </div>
        )}

        {isInitiated && (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                ✓ Conectado con Google Sheets
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={openGoogleSheets}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Abrir en Google Sheets
                </Button>
                <Button
                  onClick={syncAll}
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  size="sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Sincronizar Todo
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Button
                onClick={() => syncToSheets('clientes')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Clientes
              </Button>
              <Button
                onClick={() => syncToSheets('medicamentos')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Medicamentos
              </Button>
              <Button
                onClick={() => syncToSheets('visitas')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Visitas
              </Button>
              <Button
                onClick={() => syncToSheets('ventas')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Ventas
              </Button>
              <Button
                onClick={() => syncToSheets('citas')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Citas
              </Button>
              <Button
                onClick={() => syncToSheets('planificaciones')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Sincronizar Planificaciones
              </Button>
            </div>

            {syncStatus && (
              <div className={`
                mt-4 p-4 rounded-lg border-2 flex items-start gap-3
                ${syncStatus.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                  : 'bg-red-50 border-red-500 text-red-800'}
                }
              `}>
                {syncStatus.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{syncStatus.message}</p>
                  {syncStatus.details && (
                    <div className="mt-2 text-sm space-y-1">
                      <p>Resultados:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Clientes: {syncStatus.details.clientes}</li>
                        <li>Medicamentos: {syncStatus.details.medicamentos}</li>
                        <li>Visitas: {syncStatus.details.visitas}</li>
                        <li>Ventas: {syncStatus.details.ventas}</li>
                        <li>Citas: {syncStatus.details.citas}</li>
                        <li>Planificaciones: {syncStatus.details.planificaciones}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
