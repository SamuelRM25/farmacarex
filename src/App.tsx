import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/Clients';
import InventoryPage from './pages/Inventory';
import PlanningPage from './pages/Planning';
import VisitsPage from './pages/Visits';
import SalesPage from './pages/Sales';
import CalendarPage from './pages/Calendar';

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
          <Route path="/sales" element={<SalesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
