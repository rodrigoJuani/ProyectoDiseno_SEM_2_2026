import { Check, Section, TextInput } from '../components/ui';
import type { DomicilioDraft, StepProps } from '../api/types';
import { domicilioVacio } from '../utils/drafts';

export default function DomicilioStep({ d, up }: StepProps) {
  const dom = d.domicilio;
  const set = (patch: Partial<DomicilioDraft>) =>
    up((p) => (p.domicilio ? { ...p, domicilio: { ...p.domicilio, ...patch } } : p));
  const toggle = () =>
    up((p) => ({ ...p, domicilio: p.domicilio ? null : domicilioVacio() }));

  return (
    <Section title="Domicilio actual">
      {!dom && (
        <p className="hint">
          Active la opción para registrar la dirección del estudiante.
        </p>
      )}
      <Check label="Registrar domicilio" checked={!!dom} onChange={toggle} />
      {dom && (
        <div className="form-grid" style={{ marginTop: 10 }}>
          <TextInput label="Departamento" required value={dom.departamento} onChange={(v) => set({ departamento: v })} />
          <TextInput label="Provincia" required value={dom.provincia} onChange={(v) => set({ provincia: v })} />
          <TextInput label="Sección / Municipio" required value={dom.seccion_municipio} onChange={(v) => set({ seccion_municipio: v })} />
          <TextInput label="Localidad / Comunidad" required value={dom.localidad_comunidad} onChange={(v) => set({ localidad_comunidad: v })} />
          <TextInput label="Zona / Barrio / Villa" required value={dom.zona_barrio_villa} onChange={(v) => set({ zona_barrio_villa: v })} />
          <TextInput label="Avenida / Calle" required value={dom.avenida_calle} onChange={(v) => set({ avenida_calle: v })} />
          <TextInput label="Número de vivienda" value={dom.numero_vivienda} onChange={(v) => set({ numero_vivienda: v })} />
          <TextInput label="Teléfono" value={dom.telefono} onChange={(v) => set({ telefono: v })} />
          <TextInput label="Celular" value={dom.celular} onChange={(v) => set({ celular: v })} />
          <TextInput
            label="Dirección de procedencia (centro de acogida u otro)"
            value={dom.direccion_procedencia}
            onChange={(v) => set({ direccion_procedencia: v })}
          />
        </div>
      )}
    </Section>
  );
}
