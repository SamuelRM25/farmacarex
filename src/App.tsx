import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClientsPage from './pages/Clients';
import InventoryPage from './pages/Inventory';
import PlanningPage from './pages/Planning';
import VisitsPage from './pages/Visits';
import CalendarPage from './pages/Calendar';
import { useStore } from './store';

// Placeholder Pages
const Dashboard = () => {
  const { clients, medicines, visits } = useStore();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 italic tracking-tight">¡Bienvenido a FarmaCarex!</h1>
          <p className="text-blue-200 text-lg max-w-lg">Gestiona tus visitas médicas, inventario y ventas desde un solo lugar de forma premium.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Clientes', value: clients.length, color: 'bg-blue-600' },
          { title: 'Productos', value: medicines.length, color: 'bg-indigo-600' },
          { title: 'Visitas Hoy', value: visits.length, color: 'bg-emerald-600' },
          { title: 'Ventas Total', value: `Q ${visits.reduce((acc, v) => acc + (v.sale?.total || 0), 0).toFixed(2)}`, color: 'bg-amber-600' },
        ].map((stat) => (
          <div key={stat.title} className="p-1 group cursor-pointer">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all group-hover:shadow-xl group-hover:-translate-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <p className="text-2xl font-black text-slate-900 mt-2">{stat.value}</p>
              <div className={`h-1 w-8 ${stat.color} mt-4 rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/visits" element={<VisitsPage />} />
          <Route path="/sales" element={<VisitsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
