import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Vademecum from './pages/Vademecum';
import Cotizador from './pages/Cotizador';
import Historial from './pages/Historial';
import Aprendizaje from './pages/Aprendizaje';
import Competencia from './pages/Competencia';
import Ad from './pages/Ad';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Vademecum />} />
        <Route path="cotizador" element={<Cotizador />} />
        <Route path="aprendizaje" element={<Aprendizaje />} />
        <Route path="competencia" element={<Competencia />} />
        <Route path="historial" element={<Historial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/ads/:medId" element={<Ad />} />
    </Routes>
  );
}

export default App;