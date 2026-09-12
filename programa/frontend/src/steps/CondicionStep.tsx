import { Check, Section, TextInput } from '../components/ui';
import type {
  DiscapacidadDraft,
  DificultadDraft,
  StepProps,
  TalentoDraft,
  TeaDraft,
} from '../api/types';
import {
  discapacidadVacia,
  dificultadVacia,
  talentoVacio,
  teaVacio,
} from '../utils/drafts';

export default function CondicionStep({ d, up }: StepProps) {
  // ---- Discapacidad ----
  const dis = d.discapacidad;
  const setDis = (patch: Partial<DiscapacidadDraft>) =>
    up((p) =>
      p.discapacidad ? { ...p, discapacidad: { ...p.discapacidad, ...patch } } : p
    );
  const toggleDis = () =>
    up((p) => ({ ...p, discapacidad: p.discapacidad ? null : discapacidadVacia() }));

  // ---- TEA ----
  const tea = d.tea;
  const setTea = (patch: Partial<TeaDraft>) =>
    up((p) => (p.tea ? { ...p, tea: { ...p.tea, ...patch } } : p));
  const toggleTea = () =>
    up((p) => ({ ...p, tea: p.tea ? null : teaVacio() }));

  // ---- Dificultad de aprendizaje ----
  const dif = d.dificultad_aprendizaje;
  const setDif = (patch: Partial<DificultadDraft>) =>
    up((p) =>
      p.dificultad_aprendizaje
        ? { ...p, dificultad_aprendizaje: { ...p.dificultad_aprendizaje, ...patch } }
        : p
    );
  const toggleDif = () =>
    up((p) => ({
      ...p,
      dificultad_aprendizaje: p.dificultad_aprendizaje ? null : dificultadVacia(),
    }));

  // ---- Talento extraordinario ----
  const tal = d.talento_extraordinario;
  const setTal = (patch: Partial<TalentoDraft>) =>
    up((p) =>
      p.talento_extraordinario
        ? { ...p, talento_extraordinario: { ...p.talento_extraordinario, ...patch } }
        : p
    );
  const toggleTal = () =>
    up((p) => ({
      ...p,
      talento_extraordinario: p.talento_extraordinario ? null : talentoVacio(),
    }));

  return (
    <>
      <Section title="Discapacidad">
        {!dis && <p className="hint">Active si el estudiante tiene una discapacidad registrada.</p>}
        <Check label="El estudiante tiene discapacidad" checked={!!dis} onChange={toggleDis} />
        {dis && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput
              label="N° carnet CODEPEDIS o IBC"
              value={dis.numero_carnet_codepedis_o_ibc}
              onChange={(v) => setDis({ numero_carnet_codepedis_o_ibc: v })}
            />
            <TextInput
              label="Tipo de discapacidad"
              required
              value={dis.tipo_discapacidad}
              onChange={(v) => setDis({ tipo_discapacidad: v })}
              placeholder="Visual, auditiva, intelectual…"
            />
            <TextInput
              label="Grado"
              required
              value={dis.grado_discapacidad}
              onChange={(v) => setDis({ grado_discapacidad: v })}
              placeholder="Leve, moderado, severo…"
            />
            <TextInput
              label="Origen"
              required
              value={dis.origen_discapacidad}
              onChange={(v) => setDis({ origen_discapacidad: v })}
              placeholder="Genético, adquirido, desconocido…"
            />
          </div>
        )}
      </Section>

      <Section title="Trastorno del Espectro Autista (TEA)">
        <Check label="El estudiante tiene TEA" checked={!!tea} onChange={toggleTea} />
        {tea && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput
              label="Tipo de TEA"
              required
              value={tea.tipo_tea}
              onChange={(v) => setTea({ tipo_tea: v })}
              placeholder="Autismo clásico, Asperger, otro…"
            />
          </div>
        )}
      </Section>

      <Section title="Dificultad de aprendizaje">
        <Check
          label="El estudiante tiene diagnóstico de dificultad de aprendizaje"
          checked={!!dif}
          onChange={toggleDif}
        />
        {dif && (
          <div className="chk-grid" style={{ marginTop: 10 }}>
            <Check label="Tiene informe pedagógico" checked={dif.tiene_informe_pedagogico} onChange={(v) => setDif({ tiene_informe_pedagogico: v })} />
            <Check label="Modalidad directa" checked={dif.modalidad_directa} onChange={(v) => setDif({ modalidad_directa: v })} />
            <Check label="Área de lectura y escritura" checked={dif.area_lectura_escritura} onChange={(v) => setDif({ area_lectura_escritura: v })} />
            <Check label="Razonamiento verbal/lógico" checked={dif.area_razonamiento_verbal_logico} onChange={(v) => setDif({ area_razonamiento_verbal_logico: v })} />
            <Check label="Cálculo matemático" checked={dif.area_calculo_matematico} onChange={(v) => setDif({ area_calculo_matematico: v })} />
            <Check label="Modalidad indirecta" checked={dif.modalidad_indirecta} onChange={(v) => setDif({ modalidad_indirecta: v })} />
            <Check label="Apoyo técnico pedagógico" checked={dif.apoyo_tecnico_pedagogico} onChange={(v) => setDif({ apoyo_tecnico_pedagogico: v })} />
          </div>
        )}
      </Section>

      <Section title="Talento extraordinario">
        <Check
          label="El estudiante tiene talento extraordinario"
          checked={!!tal}
          onChange={toggleTal}
        />
        {tal && (
          <>
            <div className="form-grid" style={{ marginTop: 10 }}>
              <TextInput
                label="Tipo de talento"
                required
                value={tal.tipo_talento}
                onChange={(v) => setTal({ tipo_talento: v })}
                placeholder="Describa el talento identificado"
              />
              <TextInput
                label="Coeficiente intelectual"
                type="number"
                value={tal.coeficiente_intelectual}
                onChange={(v) => setTal({ coeficiente_intelectual: v })}
                placeholder="Opcional"
              />
            </div>
            <h2 style={{ marginTop: 14 }}>Tipos de talento</h2>
            <div className="chk-grid">
              <Check label="Artístico" checked={tal.talento_artistico} onChange={(v) => setTal({ talento_artistico: v })} />
              <Check label="Humanístico" checked={tal.talento_humanistico} onChange={(v) => setTal({ talento_humanistico: v })} />
              <Check label="Musical" checked={tal.talento_musical} onChange={(v) => setTal({ talento_musical: v })} />
              <Check label="Deportivo" checked={tal.talento_deportivo} onChange={(v) => setTal({ talento_deportivo: v })} />
              <Check label="Científico-tecnológico" checked={tal.talento_cientifico_tecnologico} onChange={(v) => setTal({ talento_cientifico_tecnologico: v })} />
            </div>
            <h2 style={{ marginTop: 14 }}>Modalidad directa</h2>
            <div className="chk-grid">
              <Check label="Modalidad directa" checked={tal.modalidad_directa} onChange={(v) => setTal({ modalidad_directa: v })} />
              <Check label="Tutorías" checked={tal.modalidad_directa_tutorias} disabled={!tal.modalidad_directa} onChange={(v) => setTal({ modalidad_directa_tutorias: v })} />
              <Check label="Acciones complementarias" checked={tal.modalidad_directa_acciones_complementarias} disabled={!tal.modalidad_directa} onChange={(v) => setTal({ modalidad_directa_acciones_complementarias: v })} />
              <Check label="Escuelas mentoras" checked={tal.modalidad_directa_escuelas_mentoras} disabled={!tal.modalidad_directa} onChange={(v) => setTal({ modalidad_directa_escuelas_mentoras: v })} />
              <Check label="Prácticas / voluntariado" checked={tal.modalidad_directa_practicas_voluntariado} disabled={!tal.modalidad_directa} onChange={(v) => setTal({ modalidad_directa_practicas_voluntariado: v })} />
            </div>
            <h2 style={{ marginTop: 14 }}>Modalidad indirecta</h2>
            <div className="chk-grid">
              <Check label="Modalidad indirecta" checked={tal.modalidad_indirecta} onChange={(v) => setTal({ modalidad_indirecta: v })} />
              <Check label="Orientación precoz" checked={tal.modalidad_indirecta_orientacion_precoz} disabled={!tal.modalidad_indirecta} onChange={(v) => setTal({ modalidad_indirecta_orientacion_precoz: v })} />
              <Check label="Adaptaciones curriculares" checked={tal.modalidad_indirecta_adaptaciones_curriculares} disabled={!tal.modalidad_indirecta} onChange={(v) => setTal({ modalidad_indirecta_adaptaciones_curriculares: v })} />
              <Check label="Aceleración educativa" checked={tal.modalidad_indirecta_aceleracion_educativa} disabled={!tal.modalidad_indirecta} onChange={(v) => setTal({ modalidad_indirecta_aceleracion_educativa: v })} />
              <Check label="Otros" checked={tal.modalidad_indirecta_otros} disabled={!tal.modalidad_indirecta} onChange={(v) => setTal({ modalidad_indirecta_otros: v })} />
            </div>
          </>
        )}
      </Section>
    </>
  );
}
