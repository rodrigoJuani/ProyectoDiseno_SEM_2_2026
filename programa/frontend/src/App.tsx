import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Lista from './pages/Lista';
import Detalle from './pages/Detalle';
import Formulario from './pages/Formulario';

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <Link to="/" className="brand">
          CEE · Registro de Estudiantes de Educación Especial
        </Link>
        <nav>
          <Link to="/">Estudiantes</Link>
          <Link to="/estudiantes/nuevo" className="btn primary">
            + Nuevo estudiante
          </Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Lista />} />
          <Route path="/estudiantes/nuevo" element={<Formulario />} />
          <Route path="/estudiantes/:id" element={<Detalle />} />
          <Route path="/estudiantes/:id/editar" element={<Formulario />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
