'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, MapPin, User, CheckCircle2, XCircle } from 'lucide-react'
import { CitaFormDialog } from './cita-form-dialog'

export function CalendarioCitas({ onRefresh }: { onRefresh?: () => void }) {
  const [citas, setCitas] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCitas()
  }, [currentDate])

  const fetchCitas = async () => {
    try {
      setLoading(true)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)

      const response = await fetch(
        `/api/citas?fechaInicio=${startDate.toISOString()}&fechaFin=${endDate.toISOString()}`
      )
      const data = await response.json()
      setCitas(data)
    } catch (error) {
      console.error('Error fetching citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCitasForDate = (date: Date) => {
    return citas.filter(cita => {
      const citaDate = new Date(cita.fecha)
      return citaDate.toDateString() === date.toDateString()
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta cita?')) return

    try {
      await fetch(`/api/citas/${id}`, { method: 'DELETE' })
      fetchCitas()
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting cita:', error)
      alert('Error al eliminar cita')
    }
  }

  const updateCitaEstado = async (id: string, estado: string) => {
    try {
      await fetch(`/api/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      })
      fetchCitas()
      onRefresh?.()
    } catch (error) {
      console.error('Error updating cita:', error)
      alert('Error al actualizar estado')
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    
    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth()
  const today = new Date()

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle className="text-xl">
              {currentDate.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="text-xs font-semibold text-slate-600 dark:text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 sm:h-32 bg-slate-50 dark:bg-slate-900 rounded" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, day) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1)
              const dayCitas = getCitasForDate(date)
              const isToday = date.toDateString() === today.toDateString()
              const isSelected = selectedDate?.toDateString() === date.toDateString()

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    h-24 sm:h-32 p-1 rounded cursor-pointer transition-all border-2
                    ${isToday ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}
                    ${isSelected ? 'ring-2 ring-emerald-500' : ''}
                    ${date > today ? 'opacity-50' : ''}
                  `}
                >
                  <div className="h-full flex flex-col">
                    <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {day + 1}
                    </span>

                    <div className="flex-1 space-y-1 overflow-y-auto">
                      {dayCitas.slice(0, 2).map((cita) => (
                        <div
                          key={cita.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDate(date)
                          }}
                          className={`
                            text-xs p-1 rounded cursor-pointer truncate
                            ${cita.estado === 'completada' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : ''}
                            ${cita.estado === 'cancelada' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : ''}
                            ${cita.estado === 'pendiente' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : ''}
                          `}
                        >
                          <div className="truncate">{cita.titulo}</div>
                          <div className="text-[10px] opacity-70">
                            {formatearHora(cita.fecha)}
                          </div>
                        </div>
                      ))}
                      {dayCitas.length > 2 && (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          +{dayCitas.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardTitle className="text-lg">
                {formatearFecha(selectedDate.toISOString())}
              </CardTitle>
              <CitaFormDialog 
                trigger={
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                    + Nueva Cita
                  </Button>
                }
                onSuccess={() => { fetchCitas(); onRefresh?.() }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayCitas = getCitasForDate(selectedDate)
              if (dayCitas.length === 0) {
                return (
                  <p className="text-center text-slate-600 dark:text-slate-400 py-4">
                    No hay citas agendadas para este día
                  </p>
                )
              }

              return (
                <div className="space-y-3">
                  {dayCitas.map((cita) => (
                    <div
                      key={cita.id}
                      className={`
                        p-4 rounded-lg border-2
                        ${cita.estado === 'completada' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : ''}
                        ${cita.estado === 'cancelada' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                        ${cita.estado === 'pendiente' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                      `}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{cita.titulo}</h4>
                            <Badge variant={cita.estado === 'completada' ? 'default' : cita.estado === 'cancelada' ? 'destructive' : 'secondary'}>
                              {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatearHora(cita.fecha)}</span>
                              {cita.duracion && <span>({cita.duracion} min)</span>}
                            </div>

                            {cita.cliente && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {cita.cliente.nombre} {cita.cliente.apellido}
                                  {cita.cliente.tipo === 'medico' ? ' (Médico)' : ' (Farmacia)'}
                                </span>
                              </div>
                            )}

                            {cita.descripcion && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                {cita.descripcion}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {cita.estado === 'pendiente' && (
                            <>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => updateCitaEstado(cita.id, 'completada')}
                                title="Marcar como completada"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateCitaEstado(cita.id, 'cancelada')}
                                title="Cancelar cita"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(cita.id)}
                            title="Eliminar cita"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
