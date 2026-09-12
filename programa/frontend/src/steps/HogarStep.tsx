import { Check, Section, TextInput } from '../components/ui';
import type {
  InternetDraft,
  ServBasicosDraft,
  StepProps,
  TecnologiaDraft,
} from '../api/types';
import {
  internetVacio,
  serviciosBasicosVacios,
  tecnologiaVacia,
} from '../utils/drafts';

export default function HogarStep({ d, up }: StepProps) {
  // ---- Servicios básicos ----
  const sb = d.servicios_basicos;
  const setSb = (patch: Partial<ServBasicosDraft>) =>
    up((p) =>
      p.servicios_basicos
        ? { ...p, servicios_basicos: { ...p.servicios_basicos, ...patch } }
        : p
    );
  const toggleSb = () =>
    up((p) => ({
      ...p,
      servicios_basicos: p.servicios_basicos ? null : serviciosBasicosVacios(),
    }));

  // ---- Tecnología y comunicación ----
  const tc = d.tecnologia_comunicacion;
  const setTc = (patch: Partial<TecnologiaDraft>) =>
    up((p) =>
      p.tecnologia_comunicacion
        ? { ...p, tecnologia_comunicacion: { ...p.tecnologia_comunicacion, ...patch } }
        : p
    );
  const toggleTc = () =>
    up((p) => ({
      ...p,
      tecnologia_comunicacion: p.tecnologia_comunicacion ? null : tecnologiaVacia(),
    }));

  // ---- Acceso a internet ----
  const it = d.internet;
  const setIt = (patch: Partial<InternetDraft>) =>
    up((p) => (p.internet ? { ...p, internet: { ...p.internet, ...patch } } : p));
  const toggleIt = () =>
    up((p) => ({ ...p, internet: p.internet ? null : internetVacio() }));
  const medios =
    !!it &&
    (it.acceso_vivienda ||
      it.acceso_lugares_publicos ||
      it.acceso_cee ||
      it.acceso_telefono_celular);

  return (
    <>
      <Section title="Acceso a servicios básicos">
        {!sb && <p className="hint">Active para registrar los servicios básicos del hogar.</p>}
        <Check label="Registrar servicios básicos" checked={!!sb} onChange={toggleSb} />
        {sb && (
          <div className="chk-grid" style={{ marginTop: 10 }}>
            <Check label="Agua por cañería" checked={sb.acceso_agua_canieria} onChange={(v) => setSb({ acceso_agua_canieria: v })} />
            <Check label="Baño" checked={sb.acceso_bano} onChange={(v) => setSb({ acceso_bano: v })} />
            <Check label="Alcantarillado" checked={sb.acceso_alcantarillado} onChange={(v) => setSb({ acceso_alcantarillado: v })} />
            <Check label="Energía eléctrica" checked={sb.acceso_energia_electrica} onChange={(v) => setSb({ acceso_energia_electrica: v })} />
            <Check label="Recolección de basura" checked={sb.acceso_recojo_basura} onChange={(v) => setSb({ acceso_recojo_basura: v })} />
          </div>
        )}
        {sb && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput
              label="Servicios accesibles o adaptados"
              value={sb.servicios_accesibles_adaptados}
              onChange={(v) => setSb({ servicios_accesibles_adaptados: v })}
              placeholder="Opcional"
            />
          </div>
        )}
      </Section>

      <Section title="Tecnología y comunicación">
        {!tc && <p className="hint">Active para registrar el acceso a medios tecnológicos.</p>}
        <Check label="Registrar tecnología y comunicación" checked={!!tc} onChange={toggleTc} />
        {tc && (
          <div className="chk-grid" style={{ marginTop: 10 }}>
            <Check label="Radio" checked={tc.acceso_radio} onChange={(v) => setTc({ acceso_radio: v })} />
            <Check label="Televisor" checked={tc.acceso_televisor} onChange={(v) => setTc({ acceso_televisor: v })} />
            <Check label="Teléfono" checked={tc.acceso_telefono} onChange={(v) => setTc({ acceso_telefono: v })} />
            <Check label="Celular" checked={tc.acceso_celular} onChange={(v) => setTc({ acceso_celular: v })} />
            <Check label="Computadora" checked={tc.acceso_computadora} onChange={(v) => setTc({ acceso_computadora: v })} />
          </div>
        )}
        {tc && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput
              label="¿Usa estos medios o son accesibles?"
              value={tc.usa_estos_medios_o_son_accesibles}
              onChange={(v) => setTc({ usa_estos_medios_o_son_accesibles: v })}
              placeholder="Opcional"
            />
          </div>
        )}
      </Section>

      <Section title="Acceso a internet">
        {!it && <p className="hint">Active para registrar el acceso a internet.</p>}
        <Check label="Registrar acceso a internet" checked={!!it} onChange={toggleIt} />
        {it && (
          <>
            <div className="chk-grid" style={{ marginTop: 10 }}>
              <Check
                label="En la vivienda"
                checked={it.acceso_vivienda}
                disabled={it.no_accede_internet}
                onChange={(v) =>
                  setIt(v ? { acceso_vivienda: true, no_accede_internet: false } : { acceso_vivienda: false })
                }
              />
              <Check
                label="En lugares públicos"
                checked={it.acceso_lugares_publicos}
                disabled={it.no_accede_internet}
                onChange={(v) =>
                  setIt(v ? { acceso_lugares_publicos: true, no_accede_internet: false } : { acceso_lugares_publicos: false })
                }
              />
              <Check
                label="En el CEE"
                checked={it.acceso_cee}
                disabled={it.no_accede_internet}
                onChange={(v) =>
                  setIt(v ? { acceso_cee: true, no_accede_internet: false } : { acceso_cee: false })
                }
              />
              <Check
                label="Por teléfono celular"
                checked={it.acceso_telefono_celular}
                disabled={it.no_accede_internet}
                onChange={(v) =>
                  setIt(v ? { acceso_telefono_celular: true, no_accede_internet: false } : { acceso_telefono_celular: false })
                }
              />
              <Check
                label="No accede a internet"
                checked={it.no_accede_internet}
                onChange={(v) =>
                  v
                    ? setIt({
                        no_accede_internet: true,
                        acceso_vivienda: false,
                        acceso_lugares_publicos: false,
                        acceso_cee: false,
                        acceso_telefono_celular: false,
                      })
                    : setIt({ no_accede_internet: false })
                }
              />
            </div>
            <div className="form-grid" style={{ marginTop: 10 }}>
              <TextInput
                label="Frecuencia de uso"
                value={it.frecuencia_uso}
                disabled={!medios}
                onChange={(v) => setIt({ frecuencia_uso: v })}
                placeholder={medios ? 'Diaria, semanal…' : 'Requiere algún medio de acceso'}
              />
            </div>
          </>
        )}
      </Section>
    </>
  );
}
