'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, User, DollarSign, Stethoscope, Building2, ChevronDown, ChevronUp, Package } from 'lucide-react'
import { VisitaFormDialog } from './visita-form-dialog'

interface Visita {
  id: string
  clienteId: string
  fecha: Date
  notas?: string
  totalVenta: number
  cliente: {
    nombre: string
    apellido: string
    tipo: string
    especialidad?: string
    direccion: string
    municipio: string
  }
  ventas: Array<{
    id: string
    total: number
    items: Array<{
      medicamento: {
        nombre: string
      }
      cantidad: number
    }>
  }>
}

export function VisitasList({ onRefresh }: { onRefresh?: () => void }) {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0])
  const [expandedVisitas, setExpandedVisitas] = useState<Set<string>>(new Set())

  const fetchVisitas = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/visitas?fecha=${fechaFiltro}`)
      const data = await response.json()
      setVisitas(data)
    } catch (error) {
      console.error('Error fetching visitas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitas()
  }, [fechaFiltro])

  const toggleExpand = (visitaId: string) => {
    const newExpanded = new Set(expandedVisitas)
    if (newExpanded.has(visitaId)) {
      newExpanded.delete(visitaId)
    } else {
      newExpanded.add(visitaId)
    }
    setExpandedVisitas(newExpanded)
  }

  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta visita y todas sus ventas asociadas?')) return

    try {
      await fetch(`/api/visitas/${id}`, { method: 'DELETE' })
      fetchVisitas()
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting visita:', error)
      alert('Error al eliminar visita')
    }
  }

  const getTotalItems = (venta: any) => {
    return venta.items.reduce((sum: number, item: any) => sum + item.cantidad, 0)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <VisitaFormDialog onSuccess={() => { fetchVisitas(); onRefresh?.() }} />
      </div>

      {visitas.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No hay visitas registradas para esta fecha.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Usa el botón "Nueva Visita" para registrar una visita.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Visitas Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{visitas.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Q {visitas.reduce((sum, v) => sum + v.totalVenta, 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Ventas Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {visitas.filter(v => v.ventas.length > 0).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Productos Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {visitas.reduce((sum, v) => 
                    sum + v.ventas.reduce((vs, venta) => vs + getTotalItems(venta), 0)
                  , 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {visitas.map((visita) => (
            <Card key={visita.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                      {visita.cliente.tipo === 'medico' ? (
                        <Stethoscope className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Building2 className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1">
                        {visita.cliente.nombre} {visita.cliente.apellido}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatFecha(visita.fecha)}
                        </span>
                        {visita.cliente.especialidad && (
                          <Badge variant="secondary">{visita.cliente.especialidad}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {visita.ventas.length > 0 && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Q {visita.totalVenta.toFixed(2)}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(visita.id)}
                      className="h-8 w-8"
                    >
                      {expandedVisitas.has(visita.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(visita.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedVisitas.has(visita.id) && (
                <CardContent className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Ubicación
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {visita.cliente.direccion}, {visita.cliente.municipio}
                      </p>
                    </div>

                    {visita.notas && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Notas de la Visita
                        </p>
                        <p className="text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
                          {visita.notas}
                        </p>
                      </div>
                    )}

                    {visita.ventas.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Ventas Realizadas ({visita.ventas.length})
                        </p>
                        <div className="space-y-2">
                          {visita.ventas.map((venta) => (
                            <Card key={venta.id} className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                              <CardContent className="pt-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-semibold">Venta #{venta.items.length} productos</span>
                                  <Badge className="bg-emerald-500">
                                    Q {venta.total.toFixed(2)}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {venta.items.map((item, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {item.medicamento.nombre} x{item.cantidad}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {visita.ventas.length === 0 && (
                      <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                        No se registraron ventas durante esta visita
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
