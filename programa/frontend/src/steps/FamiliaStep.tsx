import { Btn, Check, Section, TextInput } from '../components/ui';
import type { FamiliarDraft, GrupoFamiliarDraft, StepProps } from '../api/types';
import { familiarVacio, grupoVacio } from '../utils/drafts';

export default function FamiliaStep({ d, up }: StepProps) {
  const gf = d.grupo_familiar;
  const setGf = (patch: Partial<GrupoFamiliarDraft>) =>
    up((p) => (p.grupo_familiar ? { ...p, grupo_familiar: { ...p.grupo_familiar, ...patch } } : p));
  const toggleGf = () =>
    up((p) => ({ ...p, grupo_familiar: p.grupo_familiar ? null : grupoVacio() }));

  const setFamiliares = (lista: FamiliarDraft[]) =>
    up((p) => ({ ...p, familiares: lista }));
  const setFam = (idx: number, patch: Partial<FamiliarDraft>) =>
    setFamiliares(d.familiares.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  const flagDisc =
    (gf?.familiar_con_discapacidad ?? false) || d.familiares.some((f) => f.tiene_discapacidad);

  return (
    <>
      <Section title="Datos generales del grupo familiar">
        {!gf && <p className="hint">Active la opción para registrar datos generales de la familia.</p>}
        <Check label="Registrar grupo familiar" checked={!!gf} onChange={toggleGf} />
        {gf && (
          <div className="form-grid" style={{ marginTop: 10 }}>
            <TextInput
              label="Otra institución que atiende al estudiante"
              value={gf.otra_institucion}
              onChange={(v) => setGf({ otra_institucion: v })}
              placeholder="Opcional"
            />
          </div>
        )}
        {gf && (
          <div className="chk-grid" style={{ marginTop: 8 }}>
            <Check label="Viven otros familiares" checked={gf.otros_Familiares} onChange={(v) => setGf({ otros_Familiares: v })} />
            <Check label="Viven otras personas no familiares" checked={gf.otros_No_Familiares} onChange={(v) => setGf({ otros_No_Familiares: v })} />
            <Check
              label="Hay algún familiar con discapacidad"
              checked={flagDisc}
              onChange={(v) => setGf({ familiar_con_discapacidad: v })}
            />
          </div>
        )}
      </Section>

      <Section title="¿Con quién vive el estudiante?">
        <p className="hint">Registre a cada integrante relevante del hogar.</p>

        {d.familiares.length === 0 && <p className="hint">Sin integrantes registrados.</p>}

        {d.familiares.map((f, idx) => (
          <div className="nested" key={idx}>
            <div className="nested-head">
              <strong>Familiar {idx + 1}</strong>
              <Btn ghost onClick={() => setFamiliares(d.familiares.filter((_, i) => i !== idx))}>
                Quitar
              </Btn>
            </div>
            <div className="form-grid">
              <TextInput
                label="Parentesco"
                required
                value={f.parentesco}
                onChange={(v) => setFam(idx, { parentesco: v })}
                placeholder="Ej. Madre, Padre, Abuela…"
              />
              {flagDisc && (
                <>
                  <div className="field" style={{ display: 'flex', alignItems: 'end', paddingBottom: 6 }}>
                    <Check
                      label="Este familiar tiene discapacidad"
                      checked={f.tiene_discapacidad}
                      onChange={(v) => setFam(idx, { tiene_discapacidad: v })}
                    />
                  </div>
                  {f.tiene_discapacidad && (
                    <TextInput
                      label="Discapacidad del familiar"
                      required
                      value={f.discapacidad}
                      onChange={(v) => setFam(idx, { discapacidad: v })}
                      placeholder="Ej. Visual, auditiva…"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        <div className="row-actions">
          <Btn primary onClick={() => setFamiliares([...d.familiares, familiarVacio()])}>
            + Agregar familiar
          </Btn>
        </div>
      </Section>
    </>
  );
}
