'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Trash2, Stethoscope, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { ClienteFormDialog } from './cliente-form-dialog'

interface Cliente {
  id: string
  colegiado?: string
  especialidad?: string
  nombre: string
  apellido: string
  direccion: string
  municipio: string
  departamento: string
  tipo: string
  telefono?: string
  email?: string
  notas?: string
}

export function ClientesList({ onRefresh }: { onRefresh?: () => void }) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clientes?tipo=${tipoFiltro}&busqueda=${busqueda}`)
      const data = await response.json()
      setClientes(data)
      setFilteredClientes(data)
    } catch (error) {
      console.error('Error fetching clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [tipoFiltro, busqueda])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return

    try {
      await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      fetchClientes()
      onRefresh?.()
    } catch (error) {
      console.error('Error deleting cliente:', error)
      alert('Error al eliminar cliente')
    }
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
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, colegiado, especialidad o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="medico">Médicos</SelectItem>
            <SelectItem value="farmacia">Farmacias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredClientes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              {busqueda || tipoFiltro !== 'todos'
                ? 'No se encontraron clientes con los filtros seleccionados'
                : 'No hay clientes registrados. Agrega el primero usando el botón "Nuevo Cliente".'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {cliente.tipo === 'medico' ? (
                      <Stethoscope className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Building2 className="h-5 w-5 text-blue-500" />
                    )}
                    <Badge variant={cliente.tipo === 'medico' ? 'default' : 'secondary'}>
                      {cliente.tipo === 'medico' ? 'Médico' : 'Farmacia'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <ClienteFormDialog
                      cliente={cliente}
                      onSuccess={fetchClientes}
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
                      onClick={() => handleDelete(cliente.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-1">
                  {cliente.nombre} {cliente.apellido}
                </h3>

                {cliente.tipo === 'medico' && cliente.especialidad && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {cliente.especialidad}
                  </p>
                )}

                {cliente.tipo === 'medico' && cliente.colegiado && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Colegiado: {cliente.colegiado}
                  </p>
                )}

                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {cliente.direccion}, {cliente.municipio}, {cliente.departamento}
                    </span>
                  </div>

                  {cliente.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{cliente.telefono}</span>
                    </div>
                  )}

                  {cliente.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                </div>

                {cliente.notas && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 line-clamp-2">
                    {cliente.notas}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
