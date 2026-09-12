import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiSend } from '../api/client';
import type { Catalogos, Draft, EstudianteDetalle, StepProps } from '../api/types';
import { Alert, Btn, Cargando } from '../components/ui';
import { detailToDraft, draftToPayload, draftVacio, validar } from '../utils/drafts';
import DatosPersonales from '../steps/DatosPersonales';
import DomicilioStep from '../steps/DomicilioStep';
import IdiomasStep from '../steps/IdiomasStep';
import FamiliaStep from '../steps/FamiliaStep';
import SaludStep from '../steps/SaludStep';
import CondicionStep from '../steps/CondicionStep';
import HogarStep from '../steps/HogarStep';
import InscripcionStep from '../steps/InscripcionStep';
import ServiciosStep from '../steps/ServiciosStep';
import TutoresStep from '../steps/TutoresStep';

const PASOS = [
  'Datos personales',
  'Domicilio',
  'Idioma y cultura',
  'Grupo familiar',
  'Salud',
  'Condición del estudiante',
  'Hogar y tecnología',
  'Inscripción',
  'Servicios multidisciplinarios',
  'Padre / Madre / Tutor',
];

export default function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState<Catalogos | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const cats = await apiGet<Catalogos>('/catalogos');
        if (cancel) return;
        setCatalogos(cats);
        if (id) {
          const det = await apiGet<EstudianteDetalle>(`/estudiantes/${id}`);
          if (!cancel) setDraft(detailToDraft(det, cats));
        } else {
          if (!cancel) setDraft(draftVacio(cats));
        }
      } catch (e) {
        if (!cancel) setError((e as Error).message);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  if (!catalogos && !error)
    return <Cargando texto="Preparando el formulario…" />;
  if (!draft)
    return (
      <>
        {error && <Alert>{error}</Alert>}
        <Btn ghost onClick={() => navigate('/')}>
          ← Volver al listado
        </Btn>
      </>
    );

  async function guardar() {
    if (!draft) return;
    const errores = validar(draft);
    if (errores.length > 0) {
      setError(errores.join('\n'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setGuardando(true);
    try {
      const payload = draftToPayload(draft, catalogos ?? undefined);
      if (id) {
        await apiSend(`/estudiantes/${id}`, 'PUT', payload);
        navigate(`/estudiantes/${id}`);
      } else {
        const r = await apiSend<{ id_estudiante: number }>('/estudiantes', 'POST', payload);
        navigate(`/estudiantes/${r.id_estudiante}`);
      }
    } catch (e) {
      setError((e as Error).message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setGuardando(false);
    }
  }

  const up: StepProps['up'] = (action) =>
    setDraft((p) => (p ? (typeof action === 'function' ? action(p) : action) : p));

  const props: StepProps = { d: draft, up };

  function contenidoPaso(): JSX.Element {
    switch (paso) {
      case 0:
        return <DatosPersonales {...props} />;
      case 1:
        return <DomicilioStep {...props} />;
      case 2:
        return <IdiomasStep {...props} catalogos={catalogos!} />;
      case 3:
        return <FamiliaStep {...props} />;
      case 4:
        return <SaludStep {...props} />;
      case 5:
        return <CondicionStep {...props} />;
      case 6:
        return <HogarStep {...props} />;
      case 7:
        return <InscripcionStep {...props} />;
      case 8:
        return <ServiciosStep {...props} catalogos={catalogos!} />;
      default:
        return <TutoresStep {...props} />;
    }
  }

  return (
    <>
      <h1 style={{ fontSize: 20, marginTop: 0 }}>
        {id ? 'Editar estudiante' : 'Nuevo estudiante'}
      </h1>

      <div className="wizard-grid">
        <aside className="card steps">
          {PASOS.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`step-btn ${i === paso ? 'active' : ''}`}
              onClick={() => setPaso(i)}
            >
              {i + 1}. {t}
            </button>
          ))}
        </aside>

        <section>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              void guardar();
            }}
          >
            {error && <Alert>{error}</Alert>}
            {contenidoPaso()}
            <div className="row-actions">
              <Btn ghost disabled={paso === 0} onClick={() => setPaso(Math.max(0, paso - 1))}>
                ← Anterior
              </Btn>
              {paso < PASOS.length - 1 && (
                <Btn primary type="button" onClick={() => setPaso(paso + 1)}>
                  Siguiente →
                </Btn>
              )}
              <span className="spacer" />
              <Btn primary submit disabled={guardando}>
                {guardando ? 'Guardando…' : id ? 'Guardar cambios' : 'Registrar estudiante'}
              </Btn>
              <Btn ghost onClick={() => navigate(id ? `/estudiantes/${id}` : '/')}>
                Cancelar
              </Btn>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
