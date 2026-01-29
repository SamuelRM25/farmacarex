'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Package, Calendar, DollarSign } from 'lucide-react'

interface VisitaFormProps {
  visita?: any
  onSuccess?: () => void
  trigger?: React.ReactNode
}

interface VentaItem {
  medicamentoId: string
  cantidad: string
  precioUnitario: string
  subtotal: number
}

export function VisitaFormDialog({ visita, onSuccess, trigger }: VisitaFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'visita' | 'ventas'>('visita')
  const [clientes, setClientes] = useState<any[]>([])
  const [medicamentos, setMedicamentos] = useState<any[]>([])
  const [selectedCliente, setSelectedCliente] = useState(visita?.clienteId || '')
  const [formData, setFormData] = useState({
    fecha: visita?.fecha ? new Date(visita.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notas: visita?.notas || '',
  })
  const [ventaNotas, setVentaNotas] = useState('')
  const [ventaItems, setVentaItems] = useState<VentaItem[]>([])
  const [visitaId, setVisitaId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchClientes()
      fetchMedicamentos()
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

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch('/api/medicamentos')
      const data = await response.json()
      setMedicamentos(data)
    } catch (error) {
      console.error('Error fetching medicamentos:', error)
    }
  }

  const handleVisitaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCliente) {
      alert('Por favor seleccione un cliente')
      return
    }
    setLoading(true)

    try {
      const url = visita ? `/api/visitas/${visita.id}` : '/api/visitas'
      const method = visita ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: selectedCliente,
          fecha: formData.fecha,
          notas: formData.notas,
        }),
      })

      if (!response.ok) throw new Error('Error al guardar visita')

      const savedVisita = await response.json()
      setVisitaId(savedVisita.id)
      
      if (visita) {
        setOpen(false)
        onSuccess?.()
      } else {
        setStep('ventas')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar visita')
    } finally {
      setLoading(false)
    }
  }

  const addVentaItem = () => {
    setVentaItems([...ventaItems, { medicamentoId: '', cantidad: '1', precioUnitario: '', subtotal: 0 }])
  }

  const updateVentaItem = (index: number, field: keyof VentaItem, value: any) => {
    const updatedItems = [...ventaItems]
    updatedItems[index][field] = value

    if (field === 'medicamentoId') {
      const medicamento = medicamentos.find(m => m.id === value)
      if (medicamento) {
        updatedItems[index].precioUnitario = medicamento.precioMedico.toString()
        updatedItems[index].subtotal = parseInt(updatedItems[index].cantidad || '1') * medicamento.precioMedico
      }
    } else if (field === 'cantidad' || field === 'precioUnitario') {
      updatedItems[index].subtotal = parseInt(updatedItems[index].cantidad || '1') * parseFloat(updatedItems[index].precioUnitario || '0')
    }

    setVentaItems(updatedItems)
  }

  const removeVentaItem = (index: number) => {
    setVentaItems(ventaItems.filter((_, i) => i !== index))
  }

  const handleVentaSubmit = async () => {
    if (ventaItems.length === 0) {
      setOpen(false)
      onSuccess?.()
      return
    }

    setLoading(true)

    try {
      await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitaId,
          fecha: formData.fecha,
          notas: ventaNotas,
          items: ventaItems.filter(item => item.medicamentoId && item.cantidad),
        }),
      })

      setOpen(false)
      onSuccess?.()
      setStep('visita')
      setVentaItems([])
      setVentaNotas('')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar venta')
    } finally {
      setLoading(false)
    }
  }

  const totalVenta = ventaItems.reduce((sum, item) => sum + item.subtotal, 0)

  const clienteSelected = clientes.find(c => c.id === selectedCliente)

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open)
      if (!open) {
        setStep('visita')
        setVentaItems([])
        setVentaNotas('')
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Visita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'visita' ? (visita ? 'Editar Visita' : 'Nueva Visita') : 'Registrar Venta'}
          </DialogTitle>
          <DialogDescription>
            {step === 'visita' 
              ? `Complete la información de la visita ${clienteSelected ? `a ${clienteSelected.nombre} ${clienteSelected.apellido}` : ''}`
              : 'Agregue los productos vendidos durante esta visita'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'visita' && (
          <form onSubmit={handleVisitaSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select
                  value={selectedCliente}
                  onValueChange={setSelectedCliente}
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
                <Label htmlFor="fecha">Fecha de la Visita *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas de la Visita</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Comentarios sobre la visita..."
                  rows={3}
                />
              </div>

              {clienteSelected && (
                <Card className="bg-slate-50 dark:bg-slate-800">
                  <CardContent className="pt-4 space-y-2">
                    <p className="font-semibold">{clienteSelected.nombre} {clienteSelected.apellido}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {clienteSelected.tipo === 'medico' ? 'Médico' : 'Farmacia'}
                      {clienteSelected.especialidad && ` - ${clienteSelected.especialidad}`}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {clienteSelected.direccion}, {clienteSelected.municipio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !selectedCliente} className="bg-emerald-500 hover:bg-emerald-600">
                {loading ? 'Guardando...' : 'Guardar Visita'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'ventas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Agregue los productos vendidos
              </p>
              <Button onClick={addVentaItem} type="button" size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Agregar Producto
              </Button>
            </div>

            {ventaItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No hay productos agregados. Puede agregar productos o finalizar sin venta.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ventaItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid gap-3 sm:grid-cols-[2fr,1fr,1fr,auto]">
                        <div className="space-y-1">
                          <Label className="text-xs">Medicamento</Label>
                          <Select
                            value={item.medicamentoId}
                            onValueChange={(value) => updateVentaItem(index, 'medicamentoId', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {medicamentos.map((med) => (
                                <SelectItem key={med.id} value={med.id}>
                                  {med.nombre} - Q{med.precioMedico.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Cantidad</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => updateVentaItem(index, 'cantidad', e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Subtotal</Label>
                          <div className="h-9 px-3 flex items-center bg-slate-100 dark:bg-slate-800 rounded">
                            <span className="text-sm font-semibold">
                              Q{item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeVentaItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="ventaNotas">Notas de la Venta</Label>
              <Textarea
                id="ventaNotas"
                value={ventaNotas}
                onChange={(e) => setVentaNotas(e.target.value)}
                placeholder="Comentarios sobre la venta..."
                rows={2}
              />
            </div>

            {totalVenta > 0 && (
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      Total de la Venta
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      Q {totalVenta.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleVentaSubmit}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
              >
                {loading ? 'Guardando...' : totalVenta > 0 ? 'Guardar y Finalizar' : 'Finalizar Sin Venta'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
