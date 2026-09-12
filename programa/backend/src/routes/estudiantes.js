import { Router } from 'express';
import { q, withTx } from '../db.js';

const r = Router();

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---------- utilidades ----------
const trimOrNull = (v) => {
  if (v === undefined || v === null) return null;
  const t = String(v).trim();
  return t === '' ? null : t;
};
const boolVal = (v) => v === true || v === 'true';
const intOrNull = (v) => {
  const t = trimOrNull(v);
  if (t === null) return null;
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : null;
};
const dateOrNull = (v) => {
  const t = trimOrNull(v);
  return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
};

function friendlyError(e) {
  const c = e.constraint || '';
  if (e.code === '23505') {
    if (c.includes('sie')) return 'El código SIE CEE ya está registrado.';
    if (c.includes('documento')) return 'Ya existe un estudiante con ese tipo y número de documento.';
    return 'Registro duplicado: ya existe un dato con ese valor único.';
  }
  if (e.code === '23503') return 'Referencia inválida: el registro relacionado no existe.';
  if (e.code === '23514') {
    const mapa = {
      ck_salud_seguro_consistencia:
        'No puede marcarse la atención por caja/seguro si el estudiante no tiene seguro de salud.',
      ck_no_accede_internet_consistencia:
        'Marque "no accede a internet" o al menos un medio de acceso, no ambos.',
      ck_internet_frecuencia_con_acceso:
        'La frecuencia de uso solo puede registrarse si existe acceso a internet.',
      ck_talento_al_menos_un_tipo: 'Talento extraordinario: seleccione al menos un tipo de talento.',
      ck_talento_modalidad_directa_consistencia:
        'Si marca opciones de modalidad directa, debe activar "Modalidad directa".',
      ck_talento_modalidades_generales:
        'Active "Modalidad directa" para poder marcar sus opciones específicas.',
      ck_talento_modalidad_indirecta_consistencia:
        'Si marca opciones de modalidad indirecta, debe activar "Modalidad indirecta".',
      ck_talento_modalidad_indirecta_general:
        'Active "Modalidad indirecta" para poder marcar sus opciones específicas.',
      ck_dificultad_al_menos_un_dato: 'Dificultad de aprendizaje: marque al menos una opción.',
      ck_modalidad_indirecta_tipo: 'Modalidad indirecta: seleccione al menos un tipo de estudiante.',
      uq_estudiante_sie_normalizado: 'El código SIE CEE ya está registrado.',
      ck_estudiante_certificado:
        'Certificado de nacimiento: complete oficialía, libro, partida y folio, o desmarque la opción.',
      ck_estudiante_documento_no_vacios: 'Tipo y número de documento son obligatorios.',
      ck_estudiante_sie_no_vacio: 'El código SIE CEE no puede estar vacío.',
      ck_estudiante_nombres_no_vacios: 'Apellidos, nombres y lugar de nacimiento son obligatorios.',
      ck_domicilio_datos_no_vacios: 'Complete los datos obligatorios del domicilio.',
      ck_discapacidad_datos_no_vacios: 'Complete tipo, grado y origen de la discapacidad.',
      ck_tea_tipo_no_vacio: 'Indique el tipo de TEA.',
      ck_talento_tipo_no_vacio: 'Indique el tipo de talento extraordinario.',
      ck_familiar_parentesco_no_vacio: 'Indique el parentesco del familiar.',
      ck_familiar_discapacidad_no_vacia: 'Indique la discapacidad del familiar.',
      ck_tutor_datos_no_vacios: 'Nombre, apellido paterno y parentesco del tutor son obligatorios.',
    };
    for (const k of Object.keys(mapa)) {
      if (c.includes(k)) return mapa[k];
    }
    return 'Datos inconsistentes según las reglas de la base de datos' + (c ? ` (${c})` : '') + '.';
  }
  if (e.code === '23502') return 'Faltan campos obligatorios.';
  if (e.code === '22001') return 'Algún texto excede la longitud permitida.';
  return e.detail || e.message;
}

function responderError(res, e) {
  if (!(e instanceof ApiError)) console.error(e);
  const status = e.status || 500;
  const message = e.status ? e.message : friendlyError(e);
  res.status(status).json({ error: message });
}

// ---------- validaciones ----------
function validarEstudiante(est) {
  const errores = [];
  const req = (campo, nombre) => {
    if (!trimOrNull(est?.[campo])) errores.push(`"${nombre}" es obligatorio.`);
  };
  req('codigo_sie_cee', 'Código SIE CEE');
  req('apellido_paterno', 'Apellido paterno');
  req('nombre1', 'Primer nombre');
  req('pais_nacimiento', 'País de nacimiento');
  req('departamento_nacimiento', 'Departamento de nacimiento');
  req('provincia_nacimiento', 'Provincia de nacimiento');
  req('localidad_nacimiento', 'Localidad de nacimiento');
  req('tipo_documento', 'Tipo de documento');
  req('numero_documento', 'Número de documento');
  req('sexo', 'Sexo');
  if (!dateOrNull(est?.fecha_nacimiento)) {
    errores.push('"Fecha de nacimiento" es obligatoria (formato AAAA-MM-DD).');
  }
  if (boolVal(est?.tiene_certificado_nacimiento)) {
    const campos = [
      ['certificado_oficialia', 'Oficialía'],
      ['certificado_libro', 'Libro'],
      ['certificado_partida', 'Partida'],
      ['certificado_folio', 'Folio'],
    ];
    for (const [c, n] of campos) {
      if (!trimOrNull(est?.[c])) errores.push(`Certificado de nacimiento: "${n}" es obligatorio.`);
    }
  }
  return errores;
}

function validarSecciones(b) {
  const errs = [];
  if (b.domicilio) {
    const nombres = {
      departamento: 'departamento',
      provincia: 'provincia',
      seccion_municipio: 'sección/municipio',
      localidad_comunidad: 'localidad/comunidad',
      zona_barrio_villa: 'zona/barrio/villa',
      avenida_calle: 'avenida/calle',
    };
    for (const [k, n] of Object.entries(nombres)) {
      if (!trimOrNull(b.domicilio[k])) errs.push(`Domicilio: "${n}" es obligatorio.`);
    }
  }
  if (b.discapacidad) {
    for (const k of ['tipo_discapacidad', 'grado_discapacidad', 'origen_discapacidad']) {
      if (!trimOrNull(b.discapacidad[k])) errs.push('Discapacidad: hay campos obligatorios vacíos.');
    }
  }
  if (b.tea && !trimOrNull(b.tea.tipo_tea)) errs.push('TEA: indique el tipo.');
  if (b.talento) {
    const t = b.talento;
    if (!trimOrNull(t.tipo_talento)) errs.push('Talento: indique el tipo de talento.');
  }
  if (b.modalidad_indirecta) {
    const m = b.modalidad_indirecta;
    if (
      !(
        boolVal(m.estudiante_discapacidad) ||
        boolVal(m.estudiante_dificultad_aprendizaje) ||
        boolVal(m.estudiante_talento_extraordinario)
      )
    ) {
      errs.push('Modalidad indirecta: seleccione al menos un tipo de estudiante.');
    }
  }
  if (b.internet) {
    const it = b.internet;
    const medios =
      boolVal(it.acceso_vivienda) ||
      boolVal(it.acceso_lugares_publicos) ||
      boolVal(it.acceso_cee) ||
      boolVal(it.acceso_telefono_celular);
    if (boolVal(it.no_accede_internet) && medios) {
      errs.push('Internet: marque "no accede" o los medios de acceso, no ambos.');
    }
  }
  if (b.salud && !boolVal(b.salud.seguro_salud) && boolVal(b.salud.atencion_caja_seguro_de_salud)) {
    errs.push('Salud: la atención por caja/seguro requiere tener seguro de salud.');
  }

  // Grupo familiar normalizado
  const familiares = Array.isArray(b.familiares) ? b.familiares : [];
  const flagFamDisc =
    boolVal(b.grupo_familiar?.familiar_con_discapacidad) ||
    familiares.some((f) => f.tiene_discapacidad);
  let conDiscapacidad = 0;
  familiares.forEach((f, i) => {
    if (!trimOrNull(f.parentesco)) errs.push(`Familiar ${i + 1}: indique el parentesco.`);
    if (flagFamDisc && f.tiene_discapacidad) {
      if (!trimOrNull(f.discapacidad)) {
        errs.push(`Familiar ${i + 1}: indique la discapacidad.`);
      } else {
        conDiscapacidad++;
      }
    }
  });
  if (flagFamDisc && conDiscapacidad === 0) {
    errs.push(
      'Grupo familiar: marcó "familiar con discapacidad"; registre al menos un familiar con discapacidad.'
    );
  }

  (Array.isArray(b.tutores) ? b.tutores : []).forEach((t, i) => {
    if (!trimOrNull(t.nombre)) errs.push(`Tutor ${i + 1}: el nombre es obligatorio.`);
    if (!trimOrNull(t.apellido_paterno)) errs.push(`Tutor ${i + 1}: el apellido paterno es obligatorio.`);
    if (!trimOrNull(t.parentesco)) errs.push(`Tutor ${i + 1}: el parentesco es obligatorio.`);
  });

  return errs;
}

// ---------- inserción de secciones ----------
async function guardarEstudiante(client, id, est) {
  const params = [
    trimOrNull(est.codigo_sie_cee),
    trimOrNull(est.apellido_paterno),
    trimOrNull(est.apellido_materno),
    trimOrNull(est.nombre1),
    trimOrNull(est.nombre2),
    trimOrNull(est.pais_nacimiento),
    trimOrNull(est.departamento_nacimiento),
    trimOrNull(est.provincia_nacimiento),
    trimOrNull(est.localidad_nacimiento),
    trimOrNull(est.tipo_documento),
    trimOrNull(est.numero_documento),
    trimOrNull(est.complemento_documento),
    trimOrNull(est.lugar_expedicion_documento),
    dateOrNull(est.fecha_nacimiento),
    trimOrNull(est.sexo),
    boolVal(est.tiene_certificado_nacimiento),
    trimOrNull(est.certificado_oficialia),
    trimOrNull(est.certificado_libro),
    trimOrNull(est.certificado_partida),
    trimOrNull(est.certificado_folio),
  ];
  if (id) {
    params.push(id);
    await client.query(
      `UPDATE "Estudiante" SET
        "codigo_sie_cee"=$1,"apellido_paterno"=$2,"apellido_materno"=$3,"nombre1"=$4,"nombre2"=$5,
        "pais_nacimiento"=$6,"departamento_nacimiento"=$7,"provincia_nacimiento"=$8,"localidad_nacimiento"=$9,
        "tipo_documento"=$10,"numero_documento"=$11,"complemento_documento"=$12,"lugar_expedicion_documento"=$13,
        "fecha_nacimiento"=$14,"sexo"=$15,"tiene_certificado_nacimiento"=$16,
        "certificado_oficialia"=$17,"certificado_libro"=$18,"certificado_partida"=$19,"certificado_folio"=$20
       WHERE "id_estudiante"=$21`,
      params
    );
  } else {
    const resQ = await client.query(
      `INSERT INTO "Estudiante"
        ("codigo_sie_cee","apellido_paterno","apellido_materno","nombre1","nombre2",
         "pais_nacimiento","departamento_nacimiento","provincia_nacimiento","localidad_nacimiento",
         "tipo_documento","numero_documento","complemento_documento","lugar_expedicion_documento",
         "fecha_nacimiento","sexo","tiene_certificado_nacimiento",
         "certificado_oficialia","certificado_libro","certificado_partida","certificado_folio")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING "id_estudiante"`,
      params
    );
    return resQ.rows[0].id_estudiante;
  }
}

async function guardarDomicilio(client, id, dom) {
  if (!dom) return;
  await client.query(
    `INSERT INTO "Domicilio"
      ("id_estudiante","departamento","provincia","seccion_municipio","localidad_comunidad",
       "zona_barrio_villa","avenida_calle","numero_vivienda","telefono","celular",
       "direccion_procedencia_Centro_de_ Acogida_u_otro")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      trimOrNull(dom.departamento),
      trimOrNull(dom.provincia),
      trimOrNull(dom.seccion_municipio),
      trimOrNull(dom.localidad_comunidad),
      trimOrNull(dom.zona_barrio_villa),
      trimOrNull(dom.avenida_calle),
      trimOrNull(dom.numero_vivienda),
      trimOrNull(dom.telefono),
      trimOrNull(dom.celular),
      trimOrNull(dom.direccion_procedencia),
    ]
  );
}

async function guardarIdiomas(client, id, idiomas) {
  for (const it of idiomas || []) {
    let iid = intOrNull(it.id_idioma);
    if (!iid) {
      const nom = trimOrNull(it.nombre_idioma);
      if (!nom) continue;
      const ex = await client.query(
        `SELECT "id_idioma" FROM "Idioma" WHERE LOWER(BTRIM("nombre_idioma"))=LOWER(BTRIM($1))`,
        [nom]
      );
      iid = ex.rowCount
        ? ex.rows[0].id_idioma
        : (
            await client.query(
              `INSERT INTO "Idioma"("nombre_idioma") VALUES($1) RETURNING "id_idioma"`,
              [nom]
            )
          ).rows[0].id_idioma;
    }
    await client.query(
      `INSERT INTO "Idioma_y_Cultura"("id_estudiante","id_idioma","nacion_o_pueblo","idioma_aprendido_ninez")
       VALUES($1,$2,$3,$4)
       ON CONFLICT ("id_estudiante","id_idioma") DO NOTHING`,
      [id, iid, trimOrNull(it.nacion_o_pueblo), trimOrNull(it.idioma_aprendido_ninez)]
    );
  }
}

async function guardarGrupoFamiliar(client, id, b) {
  const familiares = Array.isArray(b.familiares) ? b.familiares : [];
  if (!b.grupo_familiar && familiares.length === 0) return;

  const gf = b.grupo_familiar || {};
  const flagDisc =
    boolVal(gf.familiar_con_discapacidad) || familiares.some((f) => f.tiene_discapacidad);

  const famQ = await client.query(
    `INSERT INTO "Grupo_Familiar"
      ("id_estudiante","otra_institucion","otros_Familiares","otros_No_Familiares","familiar_con_ discapacidad")
     VALUES ($1,$2,$3,$4,$5)
     RETURNING "id_familia"`,
    [
      id,
      trimOrNull(gf.otra_institucion),
      boolVal(gf.otros_Familiares),
      boolVal(gf.otros_No_Familiares),
      flagDisc,
    ]
  );
  const idFamilia = famQ.rows[0].id_familia;

  for (const f of familiares) {
    const parentesco = trimOrNull(f.parentesco);
    if (!parentesco) continue;
    const frQ = await client.query(
      `INSERT INTO "Estudiante_Familia"("id_familia","parentesco") VALUES($1,$2) RETURNING "id_familiar"`,
      [idFamilia, parentesco]
    );
    if (flagDisc && f.tiene_discapacidad) {
      await client.query(
        `INSERT INTO "familiar_discapacidad"("id_familiar","discapacidad","parentesco") VALUES($1,$2,$3)`,
        [frQ.rows[0].id_familiar, trimOrNull(f.discapacidad), parentesco]
      );
    }
  }
}

async function guardarSalud(client, id, s) {
  if (!s) return;
  const vals = {
    seguro_salud: boolVal(s.seguro_salud),
    atencion_caja_seguro_de_salud: boolVal(s.atencion_caja_seguro_de_salud),
    atencion_salud_publica: boolVal(s.atencion_salud_publica),
    atencion_salud_privada: boolVal(s.atencion_salud_privada),
    atencion_vivienda: boolVal(s.atencion_vivienda),
    atencion_medicina_tradicional: boolVal(s.atencion_medicina_tradicional),
    atencion_automedicacion: boolVal(s.atencion_automedicacion),
    usa_medicacion_administrada_en_el_cee: boolVal(s.usa_medicacion_administrada_en_el_cee),
  };
  if (!vals.seguro_salud) vals.atencion_caja_seguro_de_salud = false;
  if (!Object.values(vals).some(Boolean)) return;
  await client.query(
    `INSERT INTO "Estudiante_salud"
      ("id_estudiante","seguro_salud","atencion_caja_seguro_de_salud","atencion_salud_publica",
       "atencion_salud_privada","atencion_vivienda","atencion_medicina_tradicional",
       "atencion_automedicacion","usa_medicacion_administrada_en_el_cee")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, ...Object.values(vals)]
  );
}

async function guardarDiscapacidad(client, id, d) {
  if (!d) return;
  await client.query(
    `INSERT INTO "Discapacidad"
      ("id_estudiante","numero_carnet_codepedis_o_ibc","tipo_discapacidad","grado_discapacidad","origen_discapacidad")
     VALUES ($1,$2,$3,$4,$5)`,
    [
      id,
      trimOrNull(d.numero_carnet_codepedis_o_ibc),
      trimOrNull(d.tipo_discapacidad),
      trimOrNull(d.grado_discapacidad),
      trimOrNull(d.origen_discapacidad),
    ]
  );
}

async function guardarTea(client, id, tea) {
  if (!tea) return;
  await client.query(
    `INSERT INTO "TEA"("id_estudiante","tiene_TEA","tipo_tea") VALUES ($1, TRUE, $2)`,
    [id, trimOrNull(tea.tipo_tea)]
  );
}

async function guardarDificultad(client, id, d) {
  if (!d) return;
  const vals = {
    tiene_diagnostico: true, // requerido por CHECK si la fila existe
    tiene_informe_pedagogico: boolVal(d.tiene_informe_pedagogico),
    modalidad_directa: boolVal(d.modalidad_directa),
    area_lectura_escritura: boolVal(d.area_lectura_escritura),
    area_razonamiento_verbal_logico: boolVal(d.area_razonamiento_verbal_logico),
    area_calculo_matematico: boolVal(d.area_calculo_matematico),
    modalidad_indirecta: boolVal(d.modalidad_indirecta),
    apoyo_tecnico_pedagogico: boolVal(d.apoyo_tecnico_pedagogico),
  };
  await client.query(
    `INSERT INTO "DIFICULTAD_APRENDIZAJE"
      ("id_estudiante","tiene_diagnostico","tiene_informe_pedagogico","modalidad_directa",
       "area_lectura_escritura","area_razonamiento_verbal_logico","area_calculo_matematico",
       "modalidad_indirecta","apoyo_tecnico_pedagogico")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, ...Object.values(vals)]
  );
}

async function guardarTalento(client, id, t) {
  if (!t) return;
  const directa = boolVal(t.modalidad_directa);
  const indirecta = boolVal(t.modalidad_indirecta);
  const vals = {
    talento_extraordinario: true, // requerido por CHECK si la fila existe
    tipo_talento: trimOrNull(t.tipo_talento),
    coeficiente_intelectual: intOrNull(t.coeficiente_intelectual),
    talento_artistico: boolVal(t.talento_artistico),
    talento_humanistico: boolVal(t.talento_humanistico),
    talento_musical: boolVal(t.talento_musical),
    talento_deportivo: boolVal(t.talento_deportivo),
    talento_cientifico_tecnologico: boolVal(t.talento_cientifico_tecnologico),
    modalidad_directa: directa,
    modalidad_directa_tutorias: directa && boolVal(t.modalidad_directa_tutorias),
    modalidad_directa_acciones_complementarias: directa && boolVal(t.modalidad_directa_acciones_complementarias),
    modalidad_directa_escuelas_mentoras: directa && boolVal(t.modalidad_directa_escuelas_mentoras),
    modalidad_directa_practicas_voluntariado: directa && boolVal(t.modalidad_directa_practicas_voluntariado),
    modalidad_indirecta: indirecta,
    modalidad_indirecta_orientacion_precoz: indirecta && boolVal(t.modalidad_indirecta_orientacion_precoz),
    modalidad_indirecta_adaptaciones_curriculares: indirecta && boolVal(t.modalidad_indirecta_adaptaciones_curriculares),
    modalidad_indirecta_aceleracion_educativa: indirecta && boolVal(t.modalidad_indirecta_aceleracion_educativa),
    modalidad_indirecta_otros: indirecta && boolVal(t.modalidad_indirecta_otros),
  };
  await client.query(
    `INSERT INTO "TALENTO_EXTRAORDINARIO"
      ("id_estudiante","talento_extraordinario","tipo_talento","coeficiente_intelectual",
       "talento_artistico","talento_humanistico","talento_musical","talento_deportivo",
       "talento_cientifico_tecnologico","modalidad_directa","modalidad_directa_tutorias",
       "modalidad_directa_acciones_complementarias","modalidad_directa_escuelas_mentoras",
       "modalidad_directa_practicas_voluntariado","modalidad_indirecta",
       "modalidad_indirecta_orientacion_precoz","modalidad_indirecta_adaptaciones_curriculares",
       "modalidad_indirecta_aceleracion_educativa","modalidad_indirecta_otros")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
    [id, ...Object.values(vals)]
  );
}

async function guardarServiciosBasicos(client, id, sb) {
  if (!sb) return;
  const vals = {
    acceso_agua_canieria: boolVal(sb.acceso_agua_canieria),
    acceso_bano: boolVal(sb.acceso_bano),
    acceso_alcantarillado: boolVal(sb.acceso_alcantarillado),
    acceso_energia_electrica: boolVal(sb.acceso_energia_electrica),
    acceso_recojo_basura: boolVal(sb.acceso_recojo_basura),
  };
  const adaptados = trimOrNull(sb.servicios_accesibles_adaptados);
  if (!Object.values(vals).some(Boolean) && !adaptados) return;
  await client.query(
    `INSERT INTO "ACCESO_SERVICIOS_BASICOS"
      ("id_estudiante","acceso_agua_canieria","acceso_bano","acceso_alcantarillado",
       "acceso_energia_electrica","acceso_recojo_basura","servicios_accesibles_adaptados")
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, ...Object.values(vals), adaptados]
  );
}

async function guardarTecnologia(client, id, tc) {
  if (!tc) return;
  const vals = {
    acceso_radio: boolVal(tc.acceso_radio),
    acceso_televisor: boolVal(tc.acceso_televisor),
    acceso_telefono: boolVal(tc.acceso_telefono),
    acceso_celular: boolVal(tc.acceso_celular),
    acceso_computadora: boolVal(tc.acceso_computadora),
  };
  const texto = trimOrNull(tc.usa_estos_medios_o_son_accesibles);
  if (!Object.values(vals).some(Boolean) && !texto) return;
  await client.query(
    `INSERT INTO "TECNOLOGIA_COMUNICACION"
      ("id_estudiante","acceso_radio","acceso_televisor","acceso_telefono","acceso_celular",
       "acceso_computadora","usa_estos_medios_o_son_accesibles")
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, ...Object.values(vals), texto]
  );
}

async function guardarInternet(client, id, it) {
  if (!it) return;
  const medios =
    boolVal(it.acceso_vivienda) ||
    boolVal(it.acceso_lugares_publicos) ||
    boolVal(it.acceso_cee) ||
    boolVal(it.acceso_telefono_celular);
  const vals = {
    acceso_vivienda: medios && boolVal(it.acceso_vivienda),
    acceso_lugares_publicos: medios && boolVal(it.acceso_lugares_publicos),
    acceso_cee: medios && boolVal(it.acceso_cee),
    acceso_telefono_celular: medios && boolVal(it.acceso_telefono_celular),
    no_accede_internet: !medios,
  };
  const frecuencia = medios ? trimOrNull(it.frecuencia_uso) : null;
  await client.query(
    `INSERT INTO "ACCESO_INTERNET"
      ("id_estudiante","acceso_vivienda","acceso_lugares_publicos","acceso_cee",
       "acceso_telefono_celular","no_accede_internet","frecuencia_uso")
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, ...Object.values(vals), frecuencia]
  );
}

async function guardarInscripcion(client, id, ins) {
  if (!ins) return;
  const textos = {
    paralelo: trimOrNull(ins.paralelo),
    nivel_inicial: trimOrNull(ins.nivel_inicial),
    nivel_primaria: trimOrNull(ins.nivel_primaria),
    programa_auditiva: trimOrNull(ins.programa_auditiva),
    independencia_personal: trimOrNull(ins.independencia_personal),
    independencia_social: trimOrNull(ins.independencia_social),
    programa_intelectual: trimOrNull(ins.programa_intelectual),
    programas_visual_fisica_motora_mental: trimOrNull(ins.programas_visual_fisica_motora_mental),
    formacion_tecnica_productiva: trimOrNull(ins.formacion_tecnica_productiva),
    especificacion: trimOrNull(ins.especificacion),
  };
  const flags = {
    programa_no_escolarizado: boolVal(ins.programa_no_escolarizado),
    atencion_temprana: boolVal(ins.atencion_temprana),
  };
  if (!Object.values(textos).some(Boolean) && !Object.values(flags).some(Boolean)) return;
  await client.query(
    `INSERT INTO "Inscripcion"
      ("id_estudiante","paralelo","programa_no_escolarizado","nivel_inicial","nivel_primaria",
       "programa_auditiva","atencion_temprana","independencia_personal","independencia_social",
       "programa_intelectual","programas_visual_fisica_motora_mental","formacion_tecnica_productiva","especificacion")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [id, textos.paralelo, flags.programa_no_escolarizado, textos.nivel_inicial, textos.nivel_primaria,
      textos.programa_auditiva, flags.atencion_temprana, textos.independencia_personal,
      textos.independencia_social, textos.programa_intelectual,
      textos.programas_visual_fisica_motora_mental, textos.formacion_tecnica_productiva,
      textos.especificacion]
  );
}

async function guardarModalidadIndirecta(client, id, mi) {
  if (!mi) return;
  await client.query(
    `INSERT INTO "Modalidad_indirecta"
      ("id_estudiante","estudiante_discapacidad","estudiante_dificultad_aprendizaje",
       "estudiante_talento_extraordinario","area_nivel","grado","nombre_institucion")
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      id,
      boolVal(mi.estudiante_discapacidad),
      boolVal(mi.estudiante_dificultad_aprendizaje),
      boolVal(mi.estudiante_talento_extraordinario),
      trimOrNull(mi.area_nivel),
      trimOrNull(mi.grado),
      trimOrNull(mi.nombre_institucion),
    ]
  );
}

async function guardarServiciosMultidisciplinarios(client, id, servicios) {
  for (const item of servicios || []) {
    const sid = intOrNull(item.id_servicio);
    if (!sid) continue;
    const sr = await client.query(
      `SELECT LOWER(BTRIM("nombre_servicio")) AS n FROM "Servicio_Multidisciplinario" WHERE "id_servicio"=$1`,
      [sid]
    );
    if (!sr.rowCount) continue;
    const esOtro = sr.rows[0].n === 'otro';
    const otro = esOtro ? trimOrNull(item.especificar_otro) : null;
    if (esOtro && !otro) {
      throw new ApiError(400, 'Debe especificar el servicio cuando selecciona "Otro".');
    }
    await client.query(
      `INSERT INTO "Estudiante_Servicio"("id_estudiante","id_servicio","especificar_otro")
       VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
      [id, sid, otro]
    );
  }
}

async function guardarTutores(client, id, tutores) {
  for (const t of tutores || []) {
    const nombre = trimOrNull(t.nombre);
    const ap = trimOrNull(t.apellido_paterno);
    const par = trimOrNull(t.parentesco);
    if (!nombre || !ap || !par) continue;
    const trQ = await client.query(
      `INSERT INTO "Padre_Madre_Tutor"
        ("complemento","expedido","apellido_paterno","apellido_materno","nombre","fecha_nacimiento",
         "idioma_frecuente","ocupacion_laboral","grado_instruccion","parentesco","tipo_convivencia")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING "id_padre_madre_tutor"`,
      [
        trimOrNull(t.complemento),
        trimOrNull(t.expedido),
        ap,
        trimOrNull(t.apellido_materno),
        nombre,
        dateOrNull(t.fecha_nacimiento),
        trimOrNull(t.idioma_frecuente),
        trimOrNull(t.ocupacion_laboral),
        trimOrNull(t.grado_instruccion),
        par,
        trimOrNull(t.tipo_convivencia),
      ]
    );
    await client.query(
      `INSERT INTO "Estudiante_Tutor"("id_estudiante","id_padre_madre_tutor") VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [id, trQ.rows[0].id_padre_madre_tutor]
    );
  }
}

async function crearTodo(client, b) {
  const errores = validarEstudiante(b.estudiante).concat(validarSecciones(b));
  if (errores.length > 0) throw new ApiError(400, errores.join('\n'));
  const id = await guardarEstudiante(client, null, b.estudiante);
  await guardarSecciones(client, id, b);
  return id;
}

async function guardarSecciones(client, id, b) {
  await guardarDomicilio(client, id, b.domicilio);
  await guardarIdiomas(client, id, b.idiomas);
  await guardarGrupoFamiliar(client, id, b);
  await guardarSalud(client, id, b.salud);
  await guardarDiscapacidad(client, id, b.discapacidad);
  await guardarTea(client, id, b.tea);
  await guardarDificultad(client, id, b.dificultad_aprendizaje);
  await guardarTalento(client, id, b.talento_extraordinario);
  await guardarServiciosBasicos(client, id, b.servicios_basicos);
  await guardarTecnologia(client, id, b.tecnologia_comunicacion);
  await guardarInternet(client, id, b.acceso_internet);
  await guardarInscripcion(client, id, b.inscripcion);
  await guardarModalidadIndirecta(client, id, b.modalidad_indirecta);
  await guardarServiciosMultidisciplinarios(client, id, b.servicios_multidisciplinarios);
  await guardarTutores(client, id, b.tutores);
}

async function limpiarHijos(client, id) {
  await client.query(`DELETE FROM "Domicilio" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Idioma_y_Cultura" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Grupo_Familiar" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Estudiante_salud" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Discapacidad" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "TEA" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "DIFICULTAD_APRENDIZAJE" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "TALENTO_EXTRAORDINARIO" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "ACCESO_SERVICIOS_BASICOS" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "TECNOLOGIA_COMUNICACION" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "ACCESO_INTERNET" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Inscripcion" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Modalidad_indirecta" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Estudiante_Servicio" WHERE "id_estudiante"=$1`, [id]);
  await client.query(`DELETE FROM "Estudiante_Tutor" WHERE "id_estudiante"=$1`, [id]);
  await client.query(
    `DELETE FROM "Padre_Madre_Tutor" t
      WHERE NOT EXISTS (
        SELECT 1 FROM "Estudiante_Tutor" x
         WHERE x."id_padre_madre_tutor" = t."id_padre_madre_tutor"
      )`
  );
}

// ---------- rutas ----------
r.get('/', async (req, res) => {
  try {
    const term = trimOrNull(req.query.q);
    const { rows } = await q(
      `SELECT e."id_estudiante", e."codigo_sie_cee",
              TRIM(CONCAT_WS(' ', e."apellido_paterno", e."apellido_materno", e."nombre1", e."nombre2")) AS nombre_completo,
              e."tipo_documento", e."numero_documento", e."fecha_nacimiento"::text AS "fecha_nacimiento", e."sexo"
         FROM "Estudiante" e
        WHERE ($1::text IS NULL
            OR e."codigo_sie_cee" ILIKE '%'||$1||'%'
            OR TRIM(CONCAT_WS(' ', e."apellido_paterno", e."apellido_materno", e."nombre1", e."nombre2")) ILIKE '%'||$1||'%'
            OR e."numero_documento" ILIKE '%'||$1||'%')
        ORDER BY e."apellido_paterno", e."nombre1"
        LIMIT 300`,
      [term]
    );
    res.json(rows);
  } catch (e) {
    responderError(res, e);
  }
});

r.get('/:id', async (req, res) => {
  try {
    const id = intOrNull(req.params.id);
    if (!id) throw new ApiError(400, 'Identificador inválido.');

    const estQ = await q(
      `SELECT *, "fecha_nacimiento"::text AS "fecha_nacimiento"
         FROM "Estudiante" WHERE "id_estudiante"=$1`,
      [id]
    );
    if (!estQ.rowCount) throw new ApiError(404, 'Estudiante no encontrado.');

    const domQ = await q(
      `SELECT *, "direccion_procedencia_Centro_de_ Acogida_u_otro" AS "direccion_procedencia"
         FROM "Domicilio" WHERE "id_estudiante"=$1`,
      [id]
    );
    const idiomasQ = await q(
      `SELECT ic."id_estudiante_idioma", ic."id_idioma", i."nombre_idioma",
              ic."nacion_o_pueblo", ic."idioma_aprendido_ninez"
         FROM "Idioma_y_Cultura" ic
         JOIN "Idioma" i ON i."id_idioma" = ic."id_idioma"
        WHERE ic."id_estudiante"=$1 ORDER BY i."nombre_idioma"`,
      [id]
    );
    const gfQ = await q(
      `SELECT "id_familia","otra_institucion","otros_Familiares","otros_No_Familiares",
              "familiar_con_ discapacidad" AS "familiar_con_discapacidad"
         FROM "Grupo_Familiar" WHERE "id_estudiante"=$1`,
      [id]
    );
    const familiaresQ = await q(
      `SELECT ef."id_familiar", ef."parentesco", fd."discapacidad"
         FROM "Estudiante_Familia" ef
         LEFT JOIN "familiar_discapacidad" fd ON fd."id_familiar" = ef."id_familiar"
        WHERE ef."id_familia" IN (SELECT "id_familia" FROM "Grupo_Familiar" WHERE "id_estudiante"=$1)
        ORDER BY ef."id_familiar"`,
      [id]
    );
    const saludQ = await q(`SELECT * FROM "Estudiante_salud" WHERE "id_estudiante"=$1`, [id]);
    const discQ = await q(`SELECT * FROM "Discapacidad" WHERE "id_estudiante"=$1`, [id]);
    const teaQ = await q(`SELECT "tipo_tea" FROM "TEA" WHERE "id_estudiante"=$1`, [id]);
    const difQ = await q(`SELECT * FROM "DIFICULTAD_APRENDIZAJE" WHERE "id_estudiante"=$1`, [id]);
    const talQ = await q(`SELECT * FROM "TALENTO_EXTRAORDINARIO" WHERE "id_estudiante"=$1`, [id]);
    const sbQ = await q(`SELECT * FROM "ACCESO_SERVICIOS_BASICOS" WHERE "id_estudiante"=$1`, [id]);
    const tcQ = await q(`SELECT * FROM "TECNOLOGIA_COMUNICACION" WHERE "id_estudiante"=$1`, [id]);
    const intQ = await q(`SELECT * FROM "ACCESO_INTERNET" WHERE "id_estudiante"=$1`, [id]);
    const insQ = await q(`SELECT * FROM "Inscripcion" WHERE "id_estudiante"=$1`, [id]);
    const miQ = await q(`SELECT * FROM "Modalidad_indirecta" WHERE "id_estudiante"=$1`, [id]);
    const svcQ = await q(
      `SELECT es."id_servicio", s."nombre_servicio", es."especificar_otro"
         FROM "Estudiante_Servicio" es
         JOIN "Servicio_Multidisciplinario" s ON s."id_servicio" = es."id_servicio"
        WHERE es."id_estudiante"=$1 ORDER BY s."nombre_servicio"`,
      [id]
    );
    const tutQ = await q(
      `SELECT p.*, p."fecha_nacimiento"::text AS "fecha_nacimiento" FROM "Estudiante_Tutor" et
         JOIN "Padre_Madre_Tutor" p ON p."id_padre_madre_tutor" = et."id_padre_madre_tutor"
        WHERE et."id_estudiante"=$1 ORDER BY p."id_padre_madre_tutor"`,
      [id]
    );

    res.json({
      estudiante: estQ.rows[0],
      domicilio: domQ.rows[0] || null,
      idiomas: idiomasQ.rows,
      grupo_familiar: gfQ.rows[0] || null,
      familiares: familiaresQ.rows,
      salud: saludQ.rows[0] || null,
      discapacidad: discQ.rows[0] || null,
      tea: teaQ.rows[0] || null,
      dificultad_aprendizaje: difQ.rows[0] || null,
      talento_extraordinario: talQ.rows[0] || null,
      servicios_basicos: sbQ.rows[0] || null,
      tecnologia_comunicacion: tcQ.rows[0] || null,
      acceso_internet: intQ.rows[0] || null,
      inscripcion: insQ.rows[0] || null,
      modalidad_indirecta: miQ.rows[0] || null,
      servicios_multidisciplinarios: svcQ.rows,
      tutores: tutQ.rows,
    });
  } catch (e) {
    responderError(res, e);
  }
});

r.post('/', async (req, res) => {
  try {
    const id = await withTx(async (client) => crearTodo(client, req.body || {}));
    res.status(201).json({ id_estudiante: id });
  } catch (e) {
    responderError(res, e);
  }
});

r.put('/:id', async (req, res) => {
  try {
    const id = intOrNull(req.params.id);
    if (!id) throw new ApiError(400, 'Identificador inválido.');
    const b = req.body || {};
    await withTx(async (client) => {
      const ex = await client.query(
        `SELECT 1 FROM "Estudiante" WHERE "id_estudiante"=$1`,
        [id]
      );
      if (!ex.rowCount) throw new ApiError(404, 'Estudiante no encontrado.');
      const errores = validarEstudiante(b.estudiante).concat(validarSecciones(b));
      if (errores.length > 0) throw new ApiError(400, errores.join('\n'));
      await limpiarHijos(client, id);
      await guardarEstudiante(client, id, b.estudiante);
      await guardarSecciones(client, id, b);
    });
    res.json({ ok: true, id_estudiante: id });
  } catch (e) {
    responderError(res, e);
  }
});

r.delete('/:id', async (req, res) => {
  try {
    const id = intOrNull(req.params.id);
    if (!id) throw new ApiError(400, 'Identificador inválido.');
    await withTx(async (client) => {
      const del = await client.query(
        `DELETE FROM "Estudiante" WHERE "id_estudiante"=$1`,
        [id]
      );
      if (!del.rowCount) throw new ApiError(404, 'Estudiante no encontrado.');
      await client.query(
        `DELETE FROM "Padre_Madre_Tutor" t
          WHERE NOT EXISTS (
            SELECT 1 FROM "Estudiante_Tutor" x
             WHERE x."id_padre_madre_tutor" = t."id_padre_madre_tutor"
          )`
      );
    });
    res.json({ ok: true });
  } catch (e) {
    responderError(res, e);
  }
});

export default r;
