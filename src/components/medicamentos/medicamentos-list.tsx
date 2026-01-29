'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Trash2, Package, DollarSign, Tag } from 'lucide-react'
import { MedicamentoFormDialog } from './medicamento-form-dialog'

interface Medicamento {
  id: string
  nombre: string
  descripcion?: string
  precioPublico: number
  precioFarmacia: number
  bonificacion2a9?: string
  bonificacion10Mas?: string
  precioMedico: number
  oferta: boolean
  ofertaDescripcion?: string
  stock: number
}

export function MedicamentosList({ onRefresh }: { onRefresh?: () => void }) {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [filteredMedicamentos, setFilteredMedicamentos] = useState<Medicamento[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  const fetchMedicamentos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/medicamentos?busqueda=${busqueda}`)
      const data = await response.json()
      setMedicamentos(data)
      setFilteredMedicamentos(data)
    } catch (error) {
      console.error('Error fetching medicamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicamentos()
  }, [busqueda])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este medicamento?')) return

    try {
      await fetch(`/api/medicamentos/${id}`, { method: 'DELETE' })
      fetchMedicamentos()
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting medicamento:', error)
      alert('Error al eliminar medicamento')
    }
  }

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'destructive'
    if (stock < 10) return 'destructive'
    if (stock < 20) return 'secondary'
    return 'default'
  }

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Sin stock'
    if (stock < 10) return 'Stock bajo'
    if (stock < 20) return 'Stock medio'
    return 'En stock'
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar medicamento por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredMedicamentos.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {busqueda
                ? 'No se encontraron medicamentos con la búsqueda realizada'
                : 'No hay medicamentos registrados. Agrega el primero usando el botón "Nuevo Medicamento".'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicamentos.map((medicamento) => (
            <Card key={medicamento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-500" />
                    <Badge variant={getStockBadgeColor(medicamento.stock)}>
                      {getStockText(medicamento.stock)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <MedicamentoFormDialog
                      medicamento={medicamento}
                      onSuccess={fetchMedicamentos}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(medicamento.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-1">{medicamento.nombre}</h3>

                {medicamento.descripcion && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {medicamento.descripcion}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Precio Público:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Q {medicamento.precioPublico.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Precio Farmacia:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Q {medicamento.precioFarmacia.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Precio Médico:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Q {medicamento.precioMedico.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Stock:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {medicamento.stock} unidades
                    </span>
                  </div>
                </div>

                {medicamento.oferta && (
                  <Badge variant="secondary" className="mt-3 w-full justify-center">
                    <Tag className="h-3 w-3 mr-1" />
                    Oferta especial
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
