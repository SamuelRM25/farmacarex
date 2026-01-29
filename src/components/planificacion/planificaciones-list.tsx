'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ChevronDown, ChevronUp, MapPin, Clock, Edit, Trash2, Users, Briefcase } from 'lucide-react'

export function PlanificacionesList({ onRefresh }: { onRefresh?: () => void }) {
  const [planificaciones, setPlanificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPlanificaciones, setExpandedPlanificaciones] = useState<Set<string>>(new Set())

  const fetchPlanificaciones = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/planificaciones')
      const data = await response.json()
      setPlanificaciones(data)
    } catch (error) {
      console.error('Error fetching planificaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanificaciones()
  }, [])

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedPlanificaciones)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedPlanificaciones(newExpanded)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta planificación?')) return

    try {
      await fetch(`/api/planificaciones/${id}`, { method: 'DELETE' })
      fetchPlanificaciones()
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting planificacion:', error)
      alert('Error al eliminar planificación')
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
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
      {planificaciones.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No hay planificaciones registradas.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Crea una nueva planificación para organizar tus visitas semanales o mensuales.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {planificaciones.map((planificacion) => (
            <Card key={planificacion.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        Planificación {planificacion.tipo === 'semanal' ? 'Semanal' : 'Mensual'}
                      </CardTitle>
                      <Badge variant={planificacion.tipo === 'semanal' ? 'default' : 'secondary'}>
                        {planificacion.tipo === 'semanal' ? 'Semana' : 'Mes'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatearFecha(planificacion.fechaInicio)} - {formatearFecha(planificacion.fechaFin)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {planificacion.detalles.length} días
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(planificacion.id)}
                      className="h-8 w-8"
                    >
                      {expandedPlanificaciones.has(planificacion.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(planificacion.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedPlanificaciones.has(planificacion.id) && (
                <CardContent className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-4">
                    {planificacion.notas && (
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {planificacion.notas}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-3">
                      {planificacion.detalles.map((detalle: any, index: number) => (
                        <Card key={index} className="border-2">
                          <CardContent className="pt-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-500">
                                  {detalle.dia.charAt(0).toUpperCase() + detalle.dia.slice(1)}
                                </Badge>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {formatearFecha(detalle.fecha)}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="h-4 w-4 text-emerald-500" />
                                <span className="font-semibold">{detalle.giro}</span>
                              </div>

                              {detalle.horario && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <Clock className="h-4 w-4" />
                                  <span>{detalle.horario}</span>
                                </div>
                              )}

                              {detalle.direccion && (
                                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <MapPin className="h-4 w-4 mt-0.5" />
                                  <span className="flex-1">{detalle.direccion}</span>
                                </div>
                              )}

                              {detalle.cliente && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    {detalle.cliente.nombre} {detalle.cliente.apellido}
                                    {detalle.cliente.tipo === 'medico' ? ' (Médico)' : ' (Farmacia)'}
                                  </span>
                                </div>
                              )}

                              {detalle.notas && (
                                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-sm text-slate-600 dark:text-slate-400">
                                  {detalle.notas}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
