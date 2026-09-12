import { Check, Section, TextInput } from '../components/ui';
import type {
  InscripcionDraft,
  ModalidadIndirectaDraft,
  StepProps,
} from '../api/types';
import { inscripcionVacia, modalidadIndirectaVacia } from '../utils/drafts';

export default function InscripcionStep({ d, up }: StepProps) {
  const ins = d.inscripcion;
  const setIns = (patch: Partial<InscripcionDraft>) =>
    up((p) =>
      p.inscripcion ? { ...p, inscripcion: { ...p.inscripcion, ...patch } } : p
    );
  const toggleIns = () =>
    up((p) => ({ ...p, inscripcion: p.inscripcion ? null : inscripcionVacia() }));

  const mi = d.modalidad_indirecta;
  const setMi = (patch: Partial<ModalidadIndirectaDraft>) =>
    up((p) =>
      p.modalidad_indirecta
        ? { ...p, modalidad_indirecta: { ...p.modalidad_indirecta, ...patch } }
        : p
    );
  const toggleMi = () =>
    up((p) => ({
      ...p,
      modalidad_indirecta: p.modalidad_indirecta ? null : modalidadIndirectaVacia(),
    }));

  return (
    <>
      <Section title="Inscripción en el CEE">
        {!ins && <p className="hint">Active para registrar la inscripción del estudiante.</p>}
        <Check label="Registrar inscripción" checked={!!ins} onChange={toggleIns} />
        {ins && (
          <>
            <div className="form-grid" style={{ marginTop: 10 }}>
              <TextInput label="Paralelo" value={ins.paralelo} onChange={(v) => setIns({ paralelo: v })} placeholder="Ej. A, B…" />
              <TextInput label="Nivel inicial" value={ins.nivel_inicial} onChange={(v) => setIns({ nivel_inicial: v })} placeholder="Ej. 1er año" />
              <TextInput label="Nivel primaria" value={ins.nivel_primaria} onChange={(v) => setIns({ nivel_primaria: v })} placeholder="Ej. 3er año" />
              <TextInput label="Programa auditiva" value={ins.programa_auditiva} onChange={(v) => setIns({ programa_auditiva: v })} />
              <TextInput label="Independencia personal" value={ins.independencia_personal} onChange={(v) => setIns({ independencia_personal: v })} />
              <TextInput label="Independencia social" value={ins.independencia_social} onChange={(v) => setIns({ independencia_social: v })} />
              <TextInput label="Programa intelectual" value={ins.programa_intelectual} onChange={(v) => setIns({ programa_intelectual: v })} />
              <TextInput
                label="Programas visual / física / motora / mental"
                value={ins.programas_visual_fisica_motora_mental}
                onChange={(v) => setIns({ programas_visual_fisica_motora_mental: v })}
              />
              <TextInput
                label="Formación técnica productiva"
                value={ins.formacion_tecnica_productiva}
                onChange={(v) => setIns({ formacion_tecnica_productiva: v })}
              />
              <TextInput label="Especificación" value={ins.especificacion} onChange={(v) => setIns({ especificacion: v })} />
            </div>
            <div className="chk-grid" style={{ marginTop: 8 }}>
              <Check
                label="Programa no escolarizado"
                checked={ins.programa_no_escolarizado}
                onChange={(v) => setIns({ programa_no_escolarizado: v })}
              />
              <Check
                label="Atención temprana"
                checked={ins.atencion_temprana}
                onChange={(v) => setIns({ atencion_temprana: v })}
              />
            </div>
          </>
        )}
      </Section>

      <Section title="Modalidad indirecta">
        {!mi && <p className="hint">Active si el estudiante recibe apoyo indirecto.</p>}
        <Check label="Registrar modalidad indirecta" checked={!!mi} onChange={toggleMi} />
        {mi && (
          <>
            <div className="chk-grid" style={{ marginTop: 10 }}>
              <Check label="Estudiante con discapacidad" checked={mi.estudiante_discapacidad} onChange={(v) => setMi({ estudiante_discapacidad: v })} />
              <Check
                label="Estudiante con dificultad de aprendizaje"
                checked={mi.estudiante_dificultad_aprendizaje}
                onChange={(v) => setMi({ estudiante_dificultad_aprendizaje: v })}
              />
              <Check
                label="Estudiante con talento extraordinario"
                checked={mi.estudiante_talento_extraordinario}
                onChange={(v) => setMi({ estudiante_talento_extraordinario: v })}
              />
            </div>
            <div className="form-grid" style={{ marginTop: 10 }}>
              <TextInput label="Área / Nivel" value={mi.area_nivel} onChange={(v) => setMi({ area_nivel: v })} />
              <TextInput label="Grado" value={mi.grado} onChange={(v) => setMi({ grado: v })} />
              <TextInput
                label="Nombre de la institución"
                value={mi.nombre_institucion}
                onChange={(v) => setMi({ nombre_institucion: v })}
              />
            </div>
          </>
        )}
      </Section>
    </>
  );
}
