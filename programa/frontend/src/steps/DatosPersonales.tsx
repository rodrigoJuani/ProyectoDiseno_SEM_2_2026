import { Check, Section, SelectInput, TextInput } from '../components/ui';
import type { StepProps } from '../api/types';

const TIPOS_DOC = ['Carnet de Identidad', 'Pasaporte', 'Carnet de Identidad Extranjero'];

export default function DatosPersonales({ d, up }: StepProps) {
  const e = d.estudiante;
  const set = (patch: Partial<typeof e>) =>
    up((p) => ({ ...p, estudiante: { ...p.estudiante, ...patch } }));

  return (
    <>
      <Section title="Identificación del estudiante">
        <div className="form-grid">
          <TextInput
            label="Código SIE CEE"
            required
            value={e.codigo_sie_cee}
            onChange={(v) => set({ codigo_sie_cee: v })}
            placeholder="Ej. 80123456"
          />
          <TextInput label="Apellido paterno" required value={e.apellido_paterno} onChange={(v) => set({ apellido_paterno: v })} />
          <TextInput label="Apellido materno" value={e.apellido_materno} onChange={(v) => set({ apellido_materno: v })} />
          <TextInput label="Primer nombre" required value={e.nombre1} onChange={(v) => set({ nombre1: v })} />
          <TextInput label="Segundo nombre" value={e.nombre2} onChange={(v) => set({ nombre2: v })} />
          <SelectInput
            label="Sexo"
            required
            value={e.sexo}
            options={[
              { value: '', label: 'Seleccione…' },
              { value: 'Femenino', label: 'Femenino' },
              { value: 'Masculino', label: 'Masculino' },
            ]}
            onChange={(v) => set({ sexo: v })}
          />
          <TextInput
            label="Fecha de nacimiento"
            type="date"
            required
            value={e.fecha_nacimiento}
            onChange={(v) => set({ fecha_nacimiento: v })}
          />
        </div>
      </Section>

      <Section title="Lugar de nacimiento">
        <div className="form-grid">
          <TextInput label="País" required value={e.pais_nacimiento} onChange={(v) => set({ pais_nacimiento: v })} />
          <TextInput label="Departamento" required value={e.departamento_nacimiento} onChange={(v) => set({ departamento_nacimiento: v })} />
          <TextInput label="Provincia" required value={e.provincia_nacimiento} onChange={(v) => set({ provincia_nacimiento: v })} />
          <TextInput label="Localidad" required value={e.localidad_nacimiento} onChange={(v) => set({ localidad_nacimiento: v })} />
        </div>
      </Section>

      <Section title="Documento de identidad">
        <div className="form-grid">
          <SelectInput
            label="Tipo de documento"
            required
            value={e.tipo_documento}
            options={TIPOS_DOC.map((t) => ({ value: t, label: t }))}
            onChange={(v) => set({ tipo_documento: v })}
          />
          <TextInput label="Número de documento" required value={e.numero_documento} onChange={(v) => set({ numero_documento: v })} />
          <TextInput label="Complemento" value={e.complemento_documento} onChange={(v) => set({ complemento_documento: v })} placeholder="Ej. 1A / 01J" />
          <TextInput label="Lugar de expedición" value={e.lugar_expedicion_documento} onChange={(v) => set({ lugar_expedicion_documento: v })} placeholder="Ej. La Paz" />
        </div>
      </Section>

      <Section title="Certificado de nacimiento">
        <Check
          label="Tiene certificado oficial de nacimiento"
          checked={e.tiene_certificado_nacimiento}
          onChange={(v) => set({ tiene_certificado_nacimiento: v })}
        />
        {e.tiene_certificado_nacimiento && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput label="Oficialía" required value={e.certificado_oficialia} onChange={(v) => set({ certificado_oficialia: v })} />
            <TextInput label="Libro" required value={e.certificado_libro} onChange={(v) => set({ certificado_libro: v })} />
            <TextInput label="Partida" required value={e.certificado_partida} onChange={(v) => set({ certificado_partida: v })} />
            <TextInput label="Folio" required value={e.certificado_folio} onChange={(v) => set({ certificado_folio: v })} />
          </div>
        )}
      </Section>
    </>
  );
}
