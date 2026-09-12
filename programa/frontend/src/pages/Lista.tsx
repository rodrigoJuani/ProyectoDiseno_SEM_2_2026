import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiGet, apiSend } from '../api/client';
import type { EstudianteLista } from '../api/types';
import { Alert, Btn, Cargando } from '../components/ui';

export const formatoFecha = (iso: string | null | undefined): string =>
  iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—';

export default function Lista() {
  const [term, setTerm] = useState('');
  const [items, setItems] = useState<EstudianteLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cargar = useCallback(async (q: string) => {
    try {
      setError('');
      const data = await apiGet<EstudianteLista[]>(
        '/estudiantes' + (q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '')
      );
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void cargar(term), 250);
    return () => clearTimeout(t);
  }, [term, cargar]);

  async function eliminar(id: number) {
    if (!window.confirm('¿Eliminar este estudiante y todos sus datos relacionados?')) return;
    try {
      await apiSend(`/estudiantes/${id}`, 'DELETE');
      await cargar(term);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0, fontSize: 20 }}>Estudiantes</h1>
        <input
          type="search"
          placeholder="Buscar por código SIE, nombre o documento…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          style={{ flex: 1, maxWidth: 420 }}
        />
        <Btn primary onClick={() => navigate('/estudiantes/nuevo')}>
          + Nuevo estudiante
        </Btn>
      </div>

      {error && <Alert>{error}</Alert>}

      {cargando ? (
        <Cargando />
      ) : items.length === 0 ? (
        <div className="card">
          <p className="hint" style={{ margin: 0 }}>
            No hay estudiantes registrados{term ? ' que coincidan con la búsqueda' : ''}.
            Use “Nuevo estudiante” para agregar el primero.
          </p>
        </div>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Código SIE CEE</th>
              <th>Nombre completo</th>
              <th>Documento</th>
              <th>F. nacimiento</th>
              <th>Sexo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id_estudiante}>
                <td>{it.codigo_sie_cee}</td>
                <td>
                  <Link to={`/estudiantes/${it.id_estudiante}`}>{it.nombre_completo}</Link>
                </td>
                <td>
                  {it.tipo_documento} {it.numero_documento}
                </td>
                <td>{formatoFecha(it.fecha_nacimiento)}</td>
                <td>{it.sexo}</td>
                <td className="acciones">
                  <Btn ghost onClick={() => navigate(`/estudiantes/${it.id_estudiante}`)}>
                    Ver
                  </Btn>
                  <Btn ghost onClick={() => navigate(`/estudiantes/${it.id_estudiante}/editar`)}>
                    Editar
                  </Btn>
                  <Btn danger onClick={() => void eliminar(it.id_estudiante)}>
                    Eliminar
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
