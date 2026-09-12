import { Check, Section, TextInput } from '../components/ui';
import type { StepProps } from '../api/types';
import type { Catalogos } from '../api/types';

export default function ServiciosStep({
  d,
  up,
  catalogos,
}: StepProps & { catalogos: Catalogos }) {
  const setLista = up;
  const setItem = (idx: number, seleccionado?: boolean, otro?: string) =>
    setLista((p) => ({
      ...p,
      servicios_multidisciplinarios: p.servicios_multidisciplinarios.map((x, i) =>
        i === idx
          ? {
              ...x,
              seleccionado: seleccionado ?? x.seleccionado,
              especificar_otro: otro ?? x.especificar_otro,
            }
          : x
      ),
    }));

  return (
    <Section title="Servicios multidisciplinarios">
      <p className="hint">
        Marque los servicios que recibe o ha recibido el estudiante. Si marca “Otro”,
        debe especificar cuál.
      </p>

      <div style={{ display: 'grid', gap: 6 }}>
        {d.servicios_multidisciplinarios.map((sv, idx) => {
          const cat = catalogos.servicios.find((c) => c.id_servicio === sv.id_servicio);
          const nombre = cat?.nombre_servicio ?? `Servicio ${sv.id_servicio}`;
          const esOtro = nombre.trim().toLowerCase() === 'otro';
          return (
            <div key={sv.id_servicio}>
              <Check
                label={nombre}
                checked={sv.seleccionado}
                onChange={(v) => setItem(idx, v)}
              />
              {esOtro && sv.seleccionado && (
                <div className="form-grid" style={{ marginTop: 4 }}>
                  <TextInput
                    label="Especifique el servicio"
                    required
                    value={sv.especificar_otro}
                    onChange={(v) => setItem(idx, undefined, v)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
