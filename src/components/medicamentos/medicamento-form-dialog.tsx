'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Package } from 'lucide-react'

interface MedicamentoFormProps {
  medicamento?: any
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function MedicamentoFormDialog({ medicamento, onSuccess, trigger }: MedicamentoFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: medicamento?.nombre || '',
    descripcion: medicamento?.descripcion || '',
    precioPublico: medicamento?.precioPublico || '',
    precioFarmacia: medicamento?.precioFarmacia || '',
    bonificacion2a9: medicamento?.bonificacion2a9 || '',
    bonificacion10Mas: medicamento?.bonificacion10Mas || '',
    precioMedico: medicamento?.precioMedico || '',
    oferta: medicamento?.oferta || false,
    ofertaDescripcion: medicamento?.ofertaDescripcion || '',
    stock: medicamento?.stock || '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = medicamento ? `/api/medicamentos/${medicamento.id}` : '/api/medicamentos'
      const method = medicamento ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Error al guardar medicamento')

      setOpen(false)
      onSuccess?.()
      setFormData({
        nombre: '',
        descripcion: '',
        precioPublico: '',
        precioFarmacia: '',
        bonificacion2a9: '',
        bonificacion10Mas: '',
        precioMedico: '',
        oferta: false,
        ofertaDescripcion: '',
        stock: '0',
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar medicamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Medicamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{medicamento ? 'Editar Medicamento' : 'Nuevo Medicamento'}</DialogTitle>
          <DialogDescription>
            Complete la información del medicamento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Amoxicilina 500mg"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del medicamento..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioPublico">Precio Público (Q)</Label>
              <Input
                id="precioPublico"
                type="number"
                step="0.01"
                value={formData.precioPublico}
                onChange={(e) => setFormData({ ...formData, precioPublico: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioFarmacia">Precio Farmacia (Q)</Label>
              <Input
                id="precioFarmacia"
                type="number"
                step="0.01"
                value={formData.precioFarmacia}
                onChange={(e) => setFormData({ ...formData, precioFarmacia: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioMedico">Precio Médico (Q)</Label>
              <Input
                id="precioMedico"
                type="number"
                step="0.01"
                value={formData.precioMedico}
                onChange={(e) => setFormData({ ...formData, precioMedico: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bonificacion2a9">Bonificación 2-9 Unidades</Label>
              <Input
                id="bonificacion2a9"
                value={formData.bonificacion2a9}
                onChange={(e) => setFormData({ ...formData, bonificacion2a9: e.target.value })}
                placeholder="Ej: +1 unidad por cada 3 compradas"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bonificacion10Mas">Bonificación 10+ Unidades (10% descuento)</Label>
              <Input
                id="bonificacion10Mas"
                value={formData.bonificacion10Mas}
                onChange={(e) => setFormData({ ...formData, bonificacion10Mas: e.target.value })}
                placeholder="Ej: +2 unidades por cada 10 compradas"
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center justify-between">
              <div>
                <Label htmlFor="oferta">Oferta Especial</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Marcar si hay oferta especial</p>
              </div>
              <Switch
                id="oferta"
                checked={formData.oferta}
                onCheckedChange={(checked) => setFormData({ ...formData, oferta: checked })}
              />
            </div>

            {formData.oferta && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ofertaDescripcion">Descripción de la Oferta</Label>
                <Textarea
                  id="ofertaDescripcion"
                  value={formData.ofertaDescripcion}
                  onChange={(e) => setFormData({ ...formData, ofertaDescripcion: e.target.value })}
                  placeholder="Detalles de la oferta..."
                  rows={2}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
              {loading ? 'Guardando...' : medicamento ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
