'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  ClipboardList,
  TrendingUp,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Cloud
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  FarmaCarex
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sistema de Gestión de Visitas y Ventas
                </p>
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {new Date().toLocaleDateString('es-GT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            <NavButton
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <NavButton
              active={activeTab === 'clientes'}
              onClick={() => setActiveTab('clientes')}
              icon={Users}
              label="Clientes"
            />
            <NavButton
              active={activeTab === 'medicamentos'}
              onClick={() => setActiveTab('medicamentos')}
              icon={Package}
              label="Medicamentos"
            />
            <NavButton
              active={activeTab === 'planificacion'}
              onClick={() => setActiveTab('planificacion')}
              icon={Calendar}
              label="Planificación"
            />
            <NavButton
              active={activeTab === 'visitas'}
              onClick={() => setActiveTab('visitas')}
              icon={ClipboardList}
              label="Visitas"
            />
            <NavButton
              active={activeTab === 'citas'}
              onClick={() => setActiveTab('citas')}
              icon={Clock}
              label="Citas"
            />
            <NavButton
              active={activeTab === 'reportes'}
              onClick={() => setActiveTab('reportes')}
              icon={TrendingUp}
              label="Reportes"
            />
            <NavButton
              active={activeTab === 'google-sheets'}
              onClick={() => setActiveTab('google-sheets')}
              icon={Cloud}
              label="Google Sheets"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'clientes' && <ClientesContent />}
        {activeTab === 'medicamentos' && <MedicamentosContent />}
        {activeTab === 'planificacion' && <PlanificacionContent />}
        {activeTab === 'visitas' && <VisitasContent />}
        {activeTab === 'citas' && <CitasContent />}
        {activeTab === 'reportes' && <ReportesContent />}
        {activeTab === 'google-sheets' && <GoogleSheetsContent />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
          © 2025 FarmaCarex - Sistema de Gestión de Visitas Médicas
        </div>
      </footer>
    </div>
  )
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-emerald-500 text-white shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Resumen general de tu actividad diaria
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visitas Hoy"
          value="5"
          icon={ClipboardList}
          trend="+2"
          color="emerald"
        />
        <StatsCard
          title="Ventas del Día"
          value="Q 2,450"
          icon={DollarSign}
          trend="+15%"
          color="blue"
        />
        <StatsCard
          title="Médicos Vistos"
          value="3"
          icon={Users}
          trend="+1"
          color="purple"
        />
        <StatsCard
          title="Citas Pendientes"
          value="2"
          icon={Clock}
          trend="0"
          color="orange"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              Próxima Visita
            </CardTitle>
            <CardDescription>
              Detalles de la próxima visita programada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Médico</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Dr. Juan Pérez
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Especialidad</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Cardiología
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Ubicación</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Hospital Regional Huehuetenango
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Horario</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  14:00 - 15:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Resumen de Ventas
            </CardTitle>
            <CardDescription>
              Ventas realizadas durante el día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">
                  Ventas totales
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Q 2,450.00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">
                  Número de ventas
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  8
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">
                  Medicamento más vendido
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Amoxicilina 500mg
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Ver Reporte Completo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className={`${colorClasses[color]} p-2 rounded-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {value}
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          {trend} desde ayer
        </p>
      </CardContent>
    </Card>
  )
}

import { ClienteFormDialog } from '@/components/clientes/cliente-form-dialog'
import { ClientesList } from '@/components/clientes/clientes-list'
import { MedicamentoFormDialog } from '@/components/medicamentos/medicamento-form-dialog'
import { MedicamentosList } from '@/components/medicamentos/medicamentos-list'

function ClientesContent() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Universo de Clientes
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Gestiona médicos y farmacias
          </p>
        </div>
        <ClienteFormDialog onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      <ClientesList onRefresh={() => setRefresh(refresh + 1)} />
    </div>
  )
}

function MedicamentosContent() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Inventario de Medicamentos
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <MedicamentoFormDialog onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      <MedicamentosList onRefresh={() => setRefresh(refresh + 1)} />
    </div>
  )
}

import { PlanificacionFormDialog } from '@/components/planificacion/planificacion-form-dialog'
import { PlanificacionesList } from '@/components/planificacion/planificaciones-list'

function PlanificacionContent() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Planificación
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Organiza tus visitas semanales y mensuales
          </p>
        </div>
        <PlanificacionFormDialog onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      <PlanificacionesList onRefresh={() => setRefresh(refresh + 1)} />
    </div>
  )
}

import { VisitaFormDialog } from '@/components/visitas/visita-form-dialog'
import { VisitasList } from '@/components/visitas/visitas-list'

function VisitasContent() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <VisitasList onRefresh={() => setRefresh(refresh + 1)} />
    </div>
  )
}

import { CitaFormDialog } from '@/components/citas/cita-form-dialog'
import { CalendarioCitas } from '@/components/citas/calendario-citas'

function CitasContent() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Calendario de Citas
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Agenda y gestiona tus citas
          </p>
        </div>
        <CitaFormDialog onSuccess={() => setRefresh(refresh + 1)} />
      </div>

      <CalendarioCitas onRefresh={() => setRefresh(refresh + 1)} />
    </div>
  )
}

import { ReportsDashboard } from '@/components/reports/reports-dashboard'
function ReportesContent() {
  return <ReportsDashboard />
}

import { GoogleSheetsSync } from '@/components/google-sheets/google-sheets-sync'
function GoogleSheetsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Sincronización con Google Sheets
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Conecta FarmaCarex con Google Sheets para respaldos en la nube
        </p>
      </div>

      <GoogleSheetsSync />
    </div>
  )
}

