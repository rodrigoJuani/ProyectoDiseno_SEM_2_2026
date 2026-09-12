import { Check, Section } from '../components/ui';
import type { SaludDraft, StepProps } from '../api/types';
import { saludVacia } from '../utils/drafts';

export default function SaludStep({ d, up }: StepProps) {
  const sal = d.salud;
  const set = (patch: Partial<SaludDraft>) =>
    up((p) => (p.salud ? { ...p, salud: { ...p.salud, ...patch } } : p));
  const toggle = () => up((p) => ({ ...p, salud: p.salud ? null : saludVacia() }));

  return (
    <Section title="Salud del estudiante">
      {!sal && (
        <p className="hint">
          Active la opción para registrar los datos de salud y tipo de atención.
        </p>
      )}
      <Check label="Registrar datos de salud" checked={!!sal} onChange={toggle} />
      {sal && (
        <>
          <div className="chk-grid" style={{ marginTop: 10 }}>
            <Check
              label="Tiene seguro de salud"
              checked={sal.seguro_salud}
              onChange={(v) =>
                set(v ? { seguro_salud: true } : { seguro_salud: false, atencion_caja_seguro_de_salud: false })
              }
            />
            <Check
              label="Atención por caja o seguro de salud"
              checked={sal.atencion_caja_seguro_de_salud}
              disabled={!sal.seguro_salud}
              onChange={(v) => set({ atencion_caja_seguro_de_salud: v })}
            />
            <Check label="Atención en salud pública" checked={sal.atencion_salud_publica} onChange={(v) => set({ atencion_salud_publica: v })} />
            <Check label="Atención en salud privada" checked={sal.atencion_salud_privada} onChange={(v) => set({ atencion_salud_privada: v })} />
            <Check label="Atención en la vivienda" checked={sal.atencion_vivienda} onChange={(v) => set({ atencion_vivienda: v })} />
            <Check label="Medicina tradicional" checked={sal.atencion_medicina_tradicional} onChange={(v) => set({ atencion_medicina_tradicional: v })} />
            <Check label="Automedicación" checked={sal.atencion_automedicacion} onChange={(v) => set({ atencion_automedicacion: v })} />
          </div>
          <div style={{ marginTop: 8 }}>
            <Check
              label="Usa medicación administrada en el CEE"
              checked={sal.usa_medicacion_administrada_en_el_cee}
              onChange={(v) => set({ usa_medicacion_administrada_en_el_cee: v })}
            />
          </div>
          {!sal.seguro_salud && (
            <p className="hint" style={{ marginTop: 8 }}>
              La atención por caja/seguro solo puede marcarse si el estudiante tiene seguro de salud.
            </p>
          )}
        </>
      )}
    </Section>
  );
}
