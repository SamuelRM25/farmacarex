'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Clock, Calendar as CalendarIcon } from 'lucide-react'

interface CitaFormProps {
  cita?: any
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CitaFormDialog({ cita, onSuccess, trigger }: CitaFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [formData, setFormData] = useState({
    clienteId: cita?.clienteId || '',
    titulo: cita?.titulo || '',
    fecha: cita?.fecha ? new Date(cita.fecha).toISOString().slice(0, 16) : '',
    duracion: cita?.duracion?.toString() || '60',
    descripcion: cita?.descripcion || '',
  })

  useEffect(() => {
    if (open) {
      fetchClientes()
    }
  }, [open])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clienteId) {
      alert('Por favor seleccione un cliente')
      return
    }
    setLoading(true)

    try {
      const url = cita ? `/api/citas/${cita.id}` : '/api/citas'
      const method = cita ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Error al guardar cita')

      setOpen(false)
      onSuccess?.()
      setFormData({
        clienteId: '',
        titulo: '',
        fecha: '',
        duracion: '60',
        descripcion: '',
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar cita')
    } finally {
      setLoading(false)
    }
  }

  const clienteSelected = clientes.find(c => c.id === formData.clienteId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cita ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
          <DialogDescription>
            Agende una visita con un médico o farmacia
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
              >
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Seleccionar cliente" />
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

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Visita de seguimiento"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fecha y Hora *
                </Label>
                <Input
                  id="fecha"
                  type="datetime-local"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duración (min)
                </Label>
                <Input
                  id="duracion"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Detalles de la cita..."
                rows={3}
              />
            </div>

            {clienteSelected && (
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-semibold text-sm">{clienteSelected.nombre} {clienteSelected.apellido}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {clienteSelected.tipo === 'medico' ? 'Médico' : 'Farmacia'}
                  {clienteSelected.especialidad && ` - ${clienteSelected.especialidad}`}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {clienteSelected.direccion}, {clienteSelected.municipio}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
              {loading ? 'Guardando...' : 'Guardar Cita'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
