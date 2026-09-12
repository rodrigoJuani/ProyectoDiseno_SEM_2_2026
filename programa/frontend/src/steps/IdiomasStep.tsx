import { Btn, Section, SelectInput, TextInput } from '../components/ui';
import type { Catalogos, IdiomaDraft, StepProps } from '../api/types';
import { idiomaVacio } from '../utils/drafts';

export default function IdiomasStep({
  d,
  up,
  catalogos,
}: StepProps & { catalogos: Catalogos }) {
  const ninez = d.idioma_ninez;
  const setNinez = (patch: Partial<typeof ninez>) =>
    up((p) => ({ ...p, idioma_ninez: { ...p.idioma_ninez, ...patch } }));
  const setIdiomas = (lista: IdiomaDraft[]) => up((p) => ({ ...p, idiomas: lista }));

  const opciones = [
    { value: '', label: 'Seleccione…' },
    ...catalogos.idiomas
      .filter((c) => c.nombre_idioma.trim().toLowerCase() !== 'otro')
      .map((c) => ({ value: String(c.id_idioma), label: c.nombre_idioma })),
    { value: '-1', label: 'Otro' },
  ];

  return (
    <Section title="Idioma y cultura">
      <p className="subtitulo">Idioma que aprendió en la niñez</p>
      <div className="form-grid">
        <SelectInput
          label="Idioma"
          value={ninez.id_idioma === '' ? '' : String(ninez.id_idioma)}
          options={opciones}
          onChange={(v) =>
            setNinez({ id_idioma: v === '' ? '' : v === '-1' ? -1 : Number(v) })
          }
        />
        {ninez.id_idioma === -1 && (
          <TextInput
            label="Especifique el idioma"
            required
            value={ninez.otro_nombre}
            onChange={(v) => setNinez({ otro_nombre: v })}
            placeholder="Escriba el nombre del idioma"
          />
        )}
        <TextInput
          label="Nación o pueblo originario"
          value={ninez.nacion_o_pueblo}
          onChange={(v) => setNinez({ nacion_o_pueblo: v })}
          placeholder="Ej. Aymara, Quechua, Guaraní…"
        />
      </div>

      <p className="subtitulo" style={{ marginTop: 20 }}>
        Otros idiomas que habla
      </p>

      {d.idiomas.length === 0 && <p className="hint">Sin otros idiomas registrados.</p>}

      {d.idiomas.map((it, idx) => (
        <div className="nested" key={idx}>
          <div className="nested-head">
            <strong>Idioma {idx + 1}</strong>
            <Btn ghost onClick={() => setIdiomas(d.idiomas.filter((_, i) => i !== idx))}>
              Quitar
            </Btn>
          </div>
          <div className="form-grid">
            <SelectInput
              label="Idioma"
              value={it.id_idioma === '' ? '' : String(it.id_idioma)}
              options={opciones}
              onChange={(v) =>
                setIdiomas(
                  d.idiomas.map((x, i) =>
                    i === idx
                      ? {
                          ...x,
                          id_idioma: v === '' ? '' : v === '-1' ? -1 : Number(v),
                        }
                      : x
                  )
                )
              }
            />
            {it.id_idioma === -1 && (
              <TextInput
                label="Especifique el idioma"
                required
                value={it.otro_nombre}
                onChange={(v) =>
                  setIdiomas(
                    d.idiomas.map((x, i) => (i === idx ? { ...x, otro_nombre: v } : x))
                  )
                }
                placeholder="Escriba el nombre del idioma"
              />
            )}
          </div>
        </div>
      ))}

      <div className="row-actions">
        <Btn primary onClick={() => setIdiomas([...d.idiomas, idiomaVacio()])}>
          + Agregar idioma
        </Btn>
      </div>
    </Section>
  );
}
