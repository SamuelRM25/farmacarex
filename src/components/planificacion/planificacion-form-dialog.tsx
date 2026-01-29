'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Trash2, MapPin, Clock, User, Save } from 'lucide-react'

interface PlanificacionFormProps {
  planificacion?: any
  onSuccess?: () => void
  trigger?: React.ReactNode
}

interface Detalle {
  dia: string
  fecha: string
  giro: string
  horario: string
  direccion: string
  clienteId?: string
  notas?: string
}

const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']

const GIROS_DEFAULT = [
  'Montaña Alta Hue',
  'Montaña Baja Hue',
  'Huehuetenango Cabecera',
  'Totonicapán Híbrido'
]

export function PlanificacionFormDialog({ planificacion, onSuccess, trigger }: PlanificacionFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [giros, setGiros] = useState<any[]>([])
  const [step, setStep] = useState<'info' | 'detalles'>('info')
  const [formData, setFormData] = useState({
    fechaInicio: planificacion?.fechaInicio ? new Date(planificacion.fechaInicio).toISOString().split('T')[0] : '',
    fechaFin: planificacion?.fechaFin ? new Date(planificacion.fechaFin).toISOString().split('T')[0] : '',
    tipo: planificacion?.tipo || 'semanal',
    notas: planificacion?.notas || '',
  })
  const [detalles, setDetalles] = useState<Detalle[]>([])

  useEffect(() => {
    if (open) {
      fetchClientes()
      fetchGiros()
      if (!planificacion) {
        initializeDefaultDetalles()
      }
    }
  }, [open, planificacion])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const fetchGiros = async () => {
    try {
      const response = await fetch('/api/giros')
      const data = await response.json()
      if (data && data.length > 0) {
        setGiros(data)
      } else {
        setGiros(GIROS_DEFAULT.map((nombre, index) => ({ id: `default-${index}`, nombre })))
      }
    } catch (error) {
      console.error('Error fetching giros:', error)
      setGiros(GIROS_DEFAULT.map((nombre, index) => ({ id: `default-${index}`, nombre })))
    }
  }

  const initializeDefaultDetalles = () => {
    const startDate = new Date()
    const startOfWeek = new Date(startDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const defaultDetalles: Detalle[] = DIAS_SEMANA.map((dia, index) => {
      const fecha = new Date(startOfWeek)
      fecha.setDate(startOfWeek.getDate() + index)
      return {
        dia,
        fecha: fecha.toISOString().split('T')[0],
        giro: '',
        horario: '',
        direccion: '',
        clienteId: '',
        notas: '',
      }
    })

    setDetalles(defaultDetalles)
    setFormData({
      ...formData,
      fechaInicio: startOfWeek.toISOString().split('T')[0],
      fechaFin: new Date(startOfWeek).setDate(startOfWeek.getDate() + 4).toString(),
    })
  }

  const updateDetalle = (index: number, field: keyof Detalle, value: any) => {
    const updatedDetalles = [...detalles]
    updatedDetalles[index][field] = value
    setDetalles(updatedDetalles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (detalles.length === 0) {
      alert('Por favor agregue al menos un día a la planificación')
      return
    }
    setLoading(true)

    try {
      const url = planificacion ? `/api/planificaciones/${planificacion.id}` : '/api/planificaciones'
      const method = planificacion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          detalles: detalles.filter(d => d.giro),
        }),
      })

      if (!response.ok) throw new Error('Error al guardar planificación')

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar planificación')
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Planificación
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'info' ? 'Información de Planificación' : 'Detalles de Visitas'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' 
              ? 'Configure los parámetros de la planificación'
              : 'Complete los detalles de cada día de la semana'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'info' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('detalles') }} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Planificación</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observaciones generales..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Continuar
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'detalles' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {detalles.map((detalle, index) => (
                <Card key={index} className="border-2">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">
                          {detalle.dia.charAt(0).toUpperCase() + detalle.dia.slice(1)}
                        </Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatearFecha(detalle.fecha)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Giro *</Label>
                        <Select
                          value={detalle.giro}
                          onValueChange={(value) => updateDetalle(index, 'giro', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {giros.map((giro) => (
                              <SelectItem key={giro.id || giro.nombre} value={giro.nombre}>
                                {giro.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Horario
                        </Label>
                        <Input
                          value={detalle.horario}
                          onChange={(e) => updateDetalle(index, 'horario', e.target.value)}
                          placeholder="08:00 - 12:00"
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Dirección
                        </Label>
                        <Input
                          value={detalle.direccion}
                          onChange={(e) => updateDetalle(index, 'direccion', e.target.value)}
                          placeholder="Dirección de visita..."
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Cliente (Opcional)
                        </Label>
                        <Select
                          value={detalle.clienteId}
                          onValueChange={(value) => updateDetalle(index, 'clienteId', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Seleccionar cliente..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {clientes.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nombre} {cliente.apellido} - {cliente.tipo === 'medico' ? 'Médico' : 'Farmacia'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs">Notas del Día</Label>
                        <Textarea
                          value={detalle.notas}
                          onChange={(e) => updateDetalle(index, 'notas', e.target.value)}
                          placeholder="Comentarios..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('info')}
                className="w-full sm:w-auto"
              >
                Atrás
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
              >
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar Planificación
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
