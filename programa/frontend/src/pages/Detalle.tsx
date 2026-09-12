import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiSend } from '../api/client';
import type { EstudianteDetalle, Fila } from '../api/types';
import { Alert, Btn, Cargando } from '../components/ui';
import { formatoFecha } from './Lista';

type Par = [string, string];

function SeccionDet({ titulo, pares }: { titulo: string; pares: Par[] }) {
  const visibles = pares.filter(([, v]) => v !== '');
  if (visibles.length === 0) return null;
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <dl className="det-grid">
        {visibles.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const si = (v: unknown): string =>
  v === true ? 'Sí' : v === false ? 'No' : '';
const tx = (v: unknown): string =>
  v == null || v === '' ? '' : String(v);
const fecha = (v: unknown): string =>
  typeof v === 'string' && v ? formatoFecha(v.slice(0, 10)) : '';

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [det, setDet] = useState<EstudianteDetalle | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancel = false;
    apiGet<EstudianteDetalle>(`/estudiantes/${id}`)
      .then((d) => {
        if (!cancel) setDet(d);
      })
      .catch((e) => {
        if (!cancel) setError((e as Error).message);
      });
    return () => {
      cancel = true;
    };
  }, [id]);

  async function eliminar() {
    if (!id) return;
    if (!window.confirm('¿Eliminar este estudiante y todos sus datos relacionados?')) return;
    try {
      await apiSend(`/estudiantes/${id}`, 'DELETE');
      navigate('/');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error)
    return (
      <>
        <Alert>{error}</Alert>
        <Link to="/">← Volver al listado</Link>
      </>
    );
  if (!det) return <Cargando />;

  const e = det.estudiante ?? {};
  const dom = det.domicilio as Fila | null;
  const gf = det.grupo_familiar;
  const sal = det.salud;
  const dis = det.discapacidad;
  const dif = det.dificultad_aprendizaje;
  const tal = det.talento_extraordinario;
  const sb = det.servicios_basicos;
  const tc = det.tecnologia_comunicacion;
  const it = det.acceso_internet;
  const ins = det.inscripcion;
  const mi = det.modalidad_indirecta;

  const nombreCompleto = [
    tx(e['apellido_paterno']),
    tx(e['apellido_materno']),
    tx(e['nombre1']),
    tx(e['nombre2']),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0, fontSize: 20 }}>
          {nombreCompleto} <span className="badge">{tx(e['codigo_sie_cee'])}</span>
        </h1>
        <div className="row-actions" style={{ margin: 0 }}>
          <Btn ghost onClick={() => navigate('/')}>
            ← Volver
          </Btn>
          <Btn primary onClick={() => navigate(`/estudiantes/${id}/editar`)}>
            Editar
          </Btn>
          <Btn danger onClick={() => void eliminar()}>
            Eliminar
          </Btn>
        </div>
      </div>

      <SeccionDet
        titulo="Datos personales"
        pares={[
          ['Código SIE CEE', tx(e['codigo_sie_cee'])],
          ['Sexo', tx(e['sexo'])],
          ['Fecha de nacimiento', fecha(e['fecha_nacimiento'])],
          ['Lugar de nacimiento', [
            tx(e['localidad_nacimiento']),
            tx(e['provincia_nacimiento']),
            tx(e['departamento_nacimiento']),
            tx(e['pais_nacimiento']),
          ].filter(Boolean).join(', ')],
          ['Documento', `${tx(e['tipo_documento'])} ${tx(e['numero_documento'])} ${tx(e['complemento_documento'])}`.trim()],
          ['Expedido en', tx(e['lugar_expedicion_documento'])],
          ['Certificado de nacimiento', si(e['tiene_certificado_nacimiento'])],
          ['Oficialía / Libro / Partida / Folio', [
            tx(e['certificado_oficialia']),
            tx(e['certificado_libro']),
            tx(e['certificado_partida']),
            tx(e['certificado_folio']),
          ].filter(Boolean).join(' / ')],
        ]}
      />

      {dom && (
        <SeccionDet
          titulo="Domicilio"
          pares={[
            ['Departamento', tx(dom['departamento'])],
            ['Provincia', tx(dom['provincia'])],
            ['Sección/Municipio', tx(dom['seccion_municipio'])],
            ['Localidad/Comunidad', tx(dom['localidad_comunidad'])],
            ['Zona/Barrio/Villa', tx(dom['zona_barrio_villa'])],
            ['Avenida/Calle', tx(dom['avenida_calle'])],
            ['N° vivienda', tx(dom['numero_vivienda'])],
            ['Teléfono', tx(dom['telefono'])],
            ['Celular', tx(dom['celular'])],
            ['Procedencia', tx(dom['direccion_procedencia'])],
          ]}
        />
      )}

      {(det.idiomas ?? []).length > 0 && (
        <SeccionDet
          titulo="Idioma y cultura"
          pares={(det.idiomas ?? []).flatMap((x, i): Par[] => {
            const base = `Idioma ${i + 1}`;
            return [
              [base, tx(x['nombre_idioma'])],
              ['Nación o pueblo', tx(x['nacion_o_pueblo'])],
              ['Idioma de la niñez', tx(x['idioma_aprendido_ninez'])],
            ];
          })}
        />
      )}

      {gf && (
        <SeccionDet
          titulo="Grupo familiar"
          pares={[
            ['Otra institución', tx(gf['otra_institucion'])],
            ['Otros familiares en el hogar', si(gf['otros_Familiares'])],
            ['Otras personas no familiares', si(gf['otros_No_Familiares'])],
            ['Familiar con discapacidad', si(gf['familiar_con_discapacidad'])],
          ]}
        />
      )}

      {(det.familiares ?? []).length > 0 && (
        <SeccionDet
          titulo="Integrantes de la familia"
          pares={(det.familiares ?? []).flatMap((f, i): Par[] => [
            [`Familiar ${i + 1}`, tx(f['parentesco'])],
            ...(f['discapacidad'] != null && f['discapacidad'] !== ''
              ? [[`Discapacidad (${tx(f['parentesco'])})`, tx(f['discapacidad'])] as Par]
              : []),
          ])}
        />
      )}

      {sal && (
        <SeccionDet
          titulo="Salud"
          pares={[
            ['Seguro de salud', si(sal['seguro_salud'])],
            ['Atención por caja/seguro', si(sal['atencion_caja_seguro_de_salud'])],
            ['Salud pública', si(sal['atencion_salud_publica'])],
            ['Salud privada', si(sal['atencion_salud_privada'])],
            ['Atención en la vivienda', si(sal['atencion_vivienda'])],
            ['Medicina tradicional', si(sal['atencion_medicina_tradicional'])],
            ['Automedicación', si(sal['atencion_automedicacion'])],
            ['Medicación administrada en el CEE', si(sal['usa_medicacion_administrada_en_el_cee'])],
          ]}
        />
      )}

      {dis && (
        <SeccionDet
          titulo="Discapacidad"
          pares={[
            ['Tipo', tx(dis['tipo_discapacidad'])],
            ['Grado', tx(dis['grado_discapacidad'])],
            ['Origen', tx(dis['origen_discapacidad'])],
            ['Carnet CODEPEDIS/IBC', tx(dis['numero_carnet_codepedis_o_ibc'])],
          ]}
        />
      )}

      {det.tea && (
        <SeccionDet titulo="TEA" pares={[['Tipo de TEA', tx(det.tea['tipo_tea'])]]} />
      )}

      {dif && (
        <SeccionDet
          titulo="Dificultad de aprendizaje"
          pares={[
            ['Informe pedagógico', si(dif['tiene_informe_pedagogico'])],
            ['Modalidad directa', si(dif['modalidad_directa'])],
            ['Lectura y escritura', si(dif['area_lectura_escritura'])],
            ['Razonamiento verbal/lógico', si(dif['area_razonamiento_verbal_logico'])],
            ['Cálculo matemático', si(dif['area_calculo_matematico'])],
            ['Modalidad indirecta', si(dif['modalidad_indirecta'])],
            ['Apoyo técnico pedagógico', si(dif['apoyo_tecnico_pedagogico'])],
          ]}
        />
      )}

      {tal && (
        <SeccionDet
          titulo="Talento extraordinario"
          pares={[
            ['Tipo', tx(tal['tipo_talento'])],
            ['Coeficiente intelectual', tx(tal['coeficiente_intelectual'])],
            ['Artístico', si(tal['talento_artistico'])],
            ['Humanístico', si(tal['talento_humanistico'])],
            ['Musical', si(tal['talento_musical'])],
            ['Deportivo', si(tal['talento_deportivo'])],
            ['Científico-tecnológico', si(tal['talento_cientifico_tecnologico'])],
            ['Modalidad directa', si(tal['modalidad_directa'])],
            ['Tutorías', si(tal['modalidad_directa_tutorias'])],
            ['Acciones complementarias', si(tal['modalidad_directa_acciones_complementarias'])],
            ['Escuelas mentoras', si(tal['modalidad_directa_escuelas_mentoras'])],
            ['Prácticas/voluntariado', si(tal['modalidad_directa_practicas_voluntariado'])],
            ['Modalidad indirecta', si(tal['modalidad_indirecta'])],
            ['Orientación precoz', si(tal['modalidad_indirecta_orientacion_precoz'])],
            ['Adaptaciones curriculares', si(tal['modalidad_indirecta_adaptaciones_curriculares'])],
            ['Aceleración educativa', si(tal['modalidad_indirecta_aceleracion_educativa'])],
            ['Otros (indirecta)', si(tal['modalidad_indirecta_otros'])],
          ]}
        />
      )}

      {sb && (
        <SeccionDet
          titulo="Servicios básicos"
          pares={[
            ['Agua por cañería', si(sb['acceso_agua_canieria'])],
            ['Baño', si(sb['acceso_bano'])],
            ['Alcantarillado', si(sb['acceso_alcantarillado'])],
            ['Energía eléctrica', si(sb['acceso_energia_electrica'])],
            ['Recolección de basura', si(sb['acceso_recojo_basura'])],
            ['Servicios accesibles/adaptados', tx(sb['servicios_accesibles_adaptados'])],
          ]}
        />
      )}

      {tc && (
        <SeccionDet
          titulo="Tecnología y comunicación"
          pares={[
            ['Radio', si(tc['acceso_radio'])],
            ['Televisor', si(tc['acceso_televisor'])],
            ['Teléfono', si(tc['acceso_telefono'])],
            ['Celular', si(tc['acceso_celular'])],
            ['Computadora', si(tc['acceso_computadora'])],
            ['Uso/accesibilidad', tx(tc['usa_estos_medios_o_son_accesibles'])],
          ]}
        />
      )}

      {it && (
        <SeccionDet
          titulo="Acceso a internet"
          pares={[
            ['En la vivienda', si(it['acceso_vivienda'])],
            ['Lugares públicos', si(it['acceso_lugares_publicos'])],
            ['En el CEE', si(it['acceso_cee'])],
            ['Teléfono celular', si(it['acceso_telefono_celular'])],
            ['No accede', si(it['no_accede_internet'])],
            ['Frecuencia de uso', tx(it['frecuencia_uso'])],
          ]}
        />
      )}

      {ins && (
        <SeccionDet
          titulo="Inscripción"
          pares={[
            ['Paralelo', tx(ins['paralelo'])],
            ['Programa no escolarizado', si(ins['programa_no_escolarizado'])],
            ['Nivel inicial', tx(ins['nivel_inicial'])],
            ['Nivel primaria', tx(ins['nivel_primaria'])],
            ['Programa auditiva', tx(ins['programa_auditiva'])],
            ['Atención temprana', si(ins['atencion_temprana'])],
            ['Independencia personal', tx(ins['independencia_personal'])],
            ['Independencia social', tx(ins['independencia_social'])],
            ['Programa intelectual', tx(ins['programa_intelectual'])],
            ['Visual/física/motora/mental', tx(ins['programas_visual_fisica_motora_mental'])],
            ['Formación técnica productiva', tx(ins['formacion_tecnica_productiva'])],
            ['Especificación', tx(ins['especificacion'])],
          ]}
        />
      )}

      {mi && (
        <SeccionDet
          titulo="Modalidad indirecta"
          pares={[
            ['Discapacidad', si(mi['estudiante_discapacidad'])],
            ['Dificultad de aprendizaje', si(mi['estudiante_dificultad_aprendizaje'])],
            ['Talento extraordinario', si(mi['estudiante_talento_extraordinario'])],
            ['Área/Nivel', tx(mi['area_nivel'])],
            ['Grado', tx(mi['grado'])],
            ['Institución', tx(mi['nombre_institucion'])],
          ]}
        />
      )}

      {(det.servicios_multidisciplinarios ?? []).length > 0 && (
        <SeccionDet
          titulo="Servicios multidisciplinarios"
          pares={(det.servicios_multidisciplinarios ?? []).map(
            (x): Par => [
              tx(x['nombre_servicio']),
              x['especificar_otro'] ? tx(x['especificar_otro']) : '—',
            ]
          )}
        />
      )}

      {(det.tutores ?? []).length > 0 && (
        <SeccionDet
          titulo="Padre / Madre / Tutor"
          pares={(det.tutores ?? []).flatMap((t): Par[] => [
            ['Nombre completo', [tx(t['nombre']), tx(t['apellido_paterno']), tx(t['apellido_materno'])].filter(Boolean).join(' ')],
            ['Parentesco', tx(t['parentesco'])],
            ['CI complemento', tx(t['complemento'])],
            ['Expedido', tx(t['expedido'])],
            ['F. nacimiento', fecha(t['fecha_nacimiento'])],
            ['Idioma frecuente', tx(t['idioma_frecuente'])],
            ['Ocupación', tx(t['ocupacion_laboral'])],
            ['Grado de instrucción', tx(t['grado_instruccion'])],
            ['Convivencia', tx(t['tipo_convivencia'])],
          ])}
        />
      )}
    </>
  );
}
