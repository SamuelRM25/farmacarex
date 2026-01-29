'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, DollarSign, TrendingUp, Calendar, Download, ClipboardList, Package } from 'lucide-react'

export function ReportsDashboard() {
  const [fechaInicio, setFechaInicio] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  )
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const generateReporteVisitas = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/reports/visitas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      )
      const data = await response.json()
      descargarPDF(data, 'Reporte_Visitas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar reporte')
    } finally {
      setLoading(false)
    }
  }

  const generateReporteVentas = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/reports/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      )
      const data = await response.json()
      descargarPDF(data, 'Reporte_Ventas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar reporte')
    } finally {
      setLoading(false)
    }
  }

  const descargarPDF = (data: any, nombre: string) => {
    const contenido = generarContenidoPDF(data)
    const blob = new Blob([contenido], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nombre}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const generarContenidoPDF = (data: any) => {
    let contenido = '='.repeat(80) + '\n'
    contenido += `FARMA CAREX - REPORTE GENERADO EL ${new Date().toLocaleString('es-GT')}\n`
    contenido += '='.repeat(80) + '\n\n'

    if (data.estadisticas) {
      contenido += 'RESUMEN GENERAL\n'
      contenido += '-'.repeat(80) + '\n'

      if (data.estadisticas.totalVisitas !== undefined) {
        contenido += `Total de Visitas: ${data.estadisticas.totalVisitas}\n`
      }
      if (data.estadisticas.visitasConVentas !== undefined) {
        contenido += `Visitas con Ventas: ${data.estadisticas.visitasConVentas}\n`
      }
      if (data.estadisticas.totalVentas !== undefined) {
        contenido += `Monto Total Ventas: Q ${data.estadisticas.totalVentas.toFixed(2)}\n`
      }
      if (data.estadisticas.totalProductos !== undefined) {
        contenido += `Total Productos Vendidos: ${data.estadisticas.totalProductos}\n`
      }
      if (data.estadisticas.totalVentas !== undefined) {
        contenido += `Promedio por Visita: Q ${(data.estadisticas.totalVentas / (data.estadisticas.totalVisitas || 1)).toFixed(2)}\n`
      }

      contenido += '\n'
    }

    if (data.visitas) {
      contenido += 'DETALLE DE VISITAS\n'
      contenido += '-'.repeat(80) + '\n\n'

      data.visitas.forEach((visita: any, index: number) => {
        contenido += `VISITA #${index + 1}\n`
        contenido += `Fecha: ${new Date(visita.fecha).toLocaleString('es-GT')}\n`
        contenido += `Cliente: ${visita.cliente.nombre} ${visita.cliente.apellido}\n`
        contenido += `Tipo: ${visita.cliente.tipo === 'medico' ? 'Médico' : 'Farmacia'}\n`
        contenido += `Ubicación: ${visita.cliente.direccion}, ${visita.cliente.municipio}\n`

        if (visita.notas) {
          contenido += `Notas: ${visita.notas}\n`
        }

        if (visita.ventas && visita.ventas.length > 0) {
          contenido += '\n  VENTAS REALIZADAS:\n'
          visita.ventas.forEach((venta: any, vIndex: number) => {
            contenido += `  Venta #${vIndex + 1}: Q ${venta.total.toFixed(2)}\n`
            venta.items.forEach((item: any) => {
              contenido += `    - ${item.medicamento.nombre} x${item.cantidad} = Q ${(item.cantidad * item.precioUnitario).toFixed(2)}\n`
            })
            if (venta.notas) {
              contenido += `    Notas: ${venta.notas}\n`
            }
          })
        } else {
          contenido += '  Sin ventas registradas\n'
        }

        contenido += '\n'
      })
    }

    if (data.ventas) {
      contenido += 'DETALLE DE VENTAS\n'
      contenido += '-'.repeat(80) + '\n\n'

      data.ventas.forEach((venta: any, index: number) => {
        contenido += `VENTA #${index + 1}\n`
        contenido += `Fecha: ${new Date(venta.fecha).toLocaleString('es-GT')}\n`
        contenido += `Cliente: ${venta.visita.cliente.nombre} ${venta.visita.cliente.apellido}\n`
        contenido += `Monto: Q ${venta.total.toFixed(2)}\n`
        contenido += `Productos:\n`
        venta.items.forEach((item: any) => {
          contenido += `  - ${item.medicamento.nombre} x${item.cantidad} = Q ${(item.cantidad * item.precioUnitario).toFixed(2)}\n`
        })
        if (venta.notas) {
          contenido += `Notas: ${venta.notas}\n`
        }
        contenido += '\n'
      })
    }

    if (data.estadisticas?.ventasPorCliente) {
      contenido += '\nVENTAS POR CLIENTE\n'
      contenido += '-'.repeat(80) + '\n'
      Object.entries(data.estadisticas.ventasPorCliente)
        .sort(([, a], [, b]) => b - a)
        .forEach(([cliente, monto]: [string, any]) => {
          contenido += `  ${cliente}: Q ${monto.toFixed(2)}\n`
        })
      contenido += '\n'
    }

    if (data.estadisticas?.ventasPorProducto) {
      contenido += '\nVENTAS POR PRODUCTO\n'
      contenido += '-'.repeat(80) + '\n'
      Object.entries(data.estadisticas.ventasPorProducto)
        .sort(([, a], [, b]) => b - a)
        .forEach(([producto, monto]: [string, any]) => {
          contenido += `  ${producto}: Q ${monto.toFixed(2)}\n`
        })
      contenido += '\n'
    }

    contenido += '='.repeat(80) + '\n'
    contenido += 'FIN DEL REPORTE\n'
    contenido += '='.repeat(80) + '\n'

    return contenido
  }

  const generarResumenSemanal = () => {
    const hoy = new Date()
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1))
    
    setFechaInicio(inicioSemana.toISOString().split('T')[0])
    setFechaFin(hoy.toISOString().split('T')[0])
  }

  const generarResumenMensual = () => {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    
    setFechaInicio(inicioMes.toISOString().split('T')[0])
    setFechaFin(hoy.toISOString().split('T')[0])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Periodo del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <Label className="sr-only">Acciones rápidas</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generarResumenSemanal}
                  className="flex-1"
                >
                  Esta Semana
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generarResumenMensual}
                  className="flex-1"
                >
                  Este Mes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-500" />
              Reporte de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Resumen detallado de todas las visitas realizadas
            </p>
            <Button
              onClick={generateReporteVisitas}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Reporte de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Análisis completo de ventas realizadas
            </p>
            <Button
              onClick={generateReporteVentas}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Reporte Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Resumen de la actividad semanal
            </p>
            <Button
              onClick={() => {
                generarResumenSemanal()
                setTimeout(() => generateReporteVisitas(), 100)
              }}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-500" />
              Reporte Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Análisis mensual completo
            </p>
            <Button
              onClick={() => {
                generarResumenMensual()
                setTimeout(() => generateReporteVentas(), 100)
              }}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-50 dark:bg-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Los reportes se generarán en formato de texto que puede abrirse con cualquier editor de texto o procesador de documentos.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Para generar reportes en PDF profesional, puede copiar el contenido del archivo generado en Microsoft Word o Google Docs y exportarlo como PDF.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
