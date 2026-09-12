import { Btn, Section, SelectInput, TextInput } from '../components/ui';
import type { StepProps, TutorDraft } from '../api/types';
import { tutorVacio } from '../utils/drafts';

const PARENTESCOS = [
  'Madre',
  'Padre',
  'Abuelo/a',
  'Tío/a',
  'Hermano/a',
  'Apoderado legal',
  'Otro',
];

const CONVIVENCIA = ['Con el estudiante', 'No convive con el estudiante'];

const GRADOS_INSTRUCCION = [
  'Ninguno',
  'Primaria',
  'Secundaria',
  'Técnico medio',
  'Técnico superior',
  'Universitario',
  'Postgrado',
];

export default function TutoresStep({ d, up }: StepProps) {
  const setLista = (lista: TutorDraft[]) => up((p) => ({ ...p, tutores: lista }));
  const setItem = (idx: number, patch: Partial<TutorDraft>) =>
    setLista(d.tutores.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  return (
    <Section title="Padre / Madre / Tutor">
      <p className="hint">
        Registre al menos un padre, madre o tutor responsable del estudiante.
      </p>

      {d.tutores.length === 0 && <p className="hint">Sin tutores registrados.</p>}

      {d.tutores.map((t, idx) => (
        <div className="nested" key={idx}>
          <div className="nested-head">
            <strong>Tutor {idx + 1}</strong>
            <Btn ghost onClick={() => setLista(d.tutores.filter((_, i) => i !== idx))}>
              Quitar
            </Btn>
          </div>
          <div className="form-grid">
            <TextInput label="Nombre" required value={t.nombre} onChange={(v) => setItem(idx, { nombre: v })} />
            <TextInput label="Apellido paterno" required value={t.apellido_paterno} onChange={(v) => setItem(idx, { apellido_paterno: v })} />
            <TextInput label="Apellido materno" value={t.apellido_materno} onChange={(v) => setItem(idx, { apellido_materno: v })} />
            <TextInput label="Complemento CI" value={t.complemento} onChange={(v) => setItem(idx, { complemento: v })} placeholder="Ej. 1A" />
            <TextInput label="Expedido" value={t.expedido} onChange={(v) => setItem(idx, { expedido: v })} placeholder="Ej. La Paz" />
            <TextInput
              label="Fecha de nacimiento"
              type="date"
              value={t.fecha_nacimiento}
              onChange={(v) => setItem(idx, { fecha_nacimiento: v })}
            />
            <SelectInput
              label="Parentesco"
              required
              value={t.parentesco}
              options={[
                { value: '', label: 'Seleccione…' },
                ...PARENTESCOS.map((x) => ({ value: x, label: x })),
              ]}
              onChange={(v) => setItem(idx, { parentesco: v })}
            />
            <SelectInput
              label="Tipo de convivencia"
              value={t.tipo_convivencia}
              options={[
                { value: '', label: 'Seleccione…' },
                ...CONVIVENCIA.map((x) => ({ value: x, label: x })),
              ]}
              onChange={(v) => setItem(idx, { tipo_convivencia: v })}
            />
            <TextInput
              label="Idioma frecuente"
              value={t.idioma_frecuente}
              onChange={(v) => setItem(idx, { idioma_frecuente: v })}
            />
            <TextInput
              label="Ocupación laboral"
              value={t.ocupacion_laboral}
              onChange={(v) => setItem(idx, { ocupacion_laboral: v })}
            />
            <SelectInput
              label="Grado de instrucción"
              value={t.grado_instruccion}
              options={[
                { value: '', label: 'Seleccione…' },
                ...GRADOS_INSTRUCCION.map((x) => ({ value: x, label: x })),
              ]}
              onChange={(v) => setItem(idx, { grado_instruccion: v })}
            />
          </div>
        </div>
      ))}

      <div className="row-actions">
        <Btn primary onClick={() => setLista([...d.tutores, tutorVacio()])}>
          + Agregar tutor
        </Btn>
      </div>
    </Section>
  );
}
