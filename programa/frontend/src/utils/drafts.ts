import type {
  Catalogos,
  DiscapacidadDraft,
  DificultadDraft,
  DomicilioDraft,
  Draft,
  EstudianteDetalle,
  EstudianteDraft,
  FamiliarDraft,
  Fila,
  GrupoFamiliarDraft,
  IdiomaDraft,
  IdiomaNinezDraft,
  InscripcionDraft,
  InternetDraft,
  ModalidadIndirectaDraft,
  SaludDraft,
  ServBasicosDraft,
  ServicioSelDraft,
  TalentoDraft,
  TecnologiaDraft,
  TeaDraft,
  TutorDraft,
} from '../api/types';

// ---------- accesores para filas del detalle ----------
const ds = (r: Fila | null | undefined, k: string): string => {
  const v = r?.[k];
  return v == null ? '' : String(v);
};
const dd = (r: Fila | null | undefined, k: string): string => ds(r, k).slice(0, 10);
const db = (r: Fila | null | undefined, k: string): boolean => r?.[k] === true;
const dn = (r: Fila | null | undefined, k: string): number => {
  const v = r?.[k];
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ---------- valores vacíos ----------
export const estudianteVacio = (): EstudianteDraft => ({
  codigo_sie_cee: '',
  apellido_paterno: '',
  apellido_materno: '',
  nombre1: '',
  nombre2: '',
  pais_nacimiento: 'Bolivia',
  departamento_nacimiento: '',
  provincia_nacimiento: '',
  localidad_nacimiento: '',
  tipo_documento: 'Cédula de Identidad',
  numero_documento: '',
  complemento_documento: '',
  lugar_expedicion_documento: '',
  fecha_nacimiento: '',
  sexo: '',
  tiene_certificado_nacimiento: false,
  certificado_oficialia: '',
  certificado_libro: '',
  certificado_partida: '',
  certificado_folio: '',
});

export const domicilioVacio = (): DomicilioDraft => ({
  departamento: '',
  provincia: '',
  seccion_municipio: '',
  localidad_comunidad: '',
  zona_barrio_villa: '',
  avenida_calle: '',
  numero_vivienda: '',
  telefono: '',
  celular: '',
  direccion_procedencia: '',
});

export const idiomaVacio = (): IdiomaDraft => ({
  id_idioma: '',
  otro_nombre: '',
});

export const idiomaNinezVacio = (): IdiomaNinezDraft => ({
  id_idioma: '',
  otro_nombre: '',
  nacion_o_pueblo: '',
});

export const grupoVacio = (): GrupoFamiliarDraft => ({
  otra_institucion: '',
  otros_Familiares: false,
  otros_No_Familiares: false,
  familiar_con_discapacidad: false,
});

export const familiarVacio = (): FamiliarDraft => ({
  parentesco: '',
  tiene_discapacidad: false,
  discapacidad: '',
});

export const saludVacia = (): SaludDraft => ({
  seguro_salud: false,
  atencion_caja_seguro_de_salud: false,
  atencion_salud_publica: false,
  atencion_salud_privada: false,
  atencion_vivienda: false,
  atencion_medicina_tradicional: false,
  atencion_automedicacion: false,
  usa_medicacion_administrada_en_el_cee: false,
});

export const discapacidadVacia = (): DiscapacidadDraft => ({
  numero_carnet_codepedis_o_ibc: '',
  tipo_discapacidad: '',
  grado_discapacidad: '',
  origen_discapacidad: '',
});

export const teaVacio = (): TeaDraft => ({ tipo_tea: '' });

export const dificultadVacia = (): DificultadDraft => ({
  tiene_informe_pedagogico: false,
  modalidad_directa: false,
  area_lectura_escritura: false,
  area_razonamiento_verbal_logico: false,
  area_calculo_matematico: false,
  modalidad_indirecta: false,
  apoyo_tecnico_pedagogico: false,
});

export const talentoVacio = (): TalentoDraft => ({
  tipo_talento: '',
  coeficiente_intelectual: '',
  talento_artistico: false,
  talento_humanistico: false,
  talento_musical: false,
  talento_deportivo: false,
  talento_cientifico_tecnologico: false,
  modalidad_directa: false,
  modalidad_directa_tutorias: false,
  modalidad_directa_acciones_complementarias: false,
  modalidad_directa_escuelas_mentoras: false,
  modalidad_directa_practicas_voluntariado: false,
  modalidad_indirecta: false,
  modalidad_indirecta_orientacion_precoz: false,
  modalidad_indirecta_adaptaciones_curriculares: false,
  modalidad_indirecta_aceleracion_educativa: false,
  modalidad_indirecta_otros: false,
});

export const serviciosBasicosVacios = (): ServBasicosDraft => ({
  acceso_agua_canieria: false,
  acceso_bano: false,
  acceso_alcantarillado: false,
  acceso_energia_electrica: false,
  acceso_recojo_basura: false,
  servicios_accesibles_adaptados: '',
});

export const tecnologiaVacia = (): TecnologiaDraft => ({
  acceso_radio: false,
  acceso_televisor: false,
  acceso_telefono: false,
  acceso_celular: false,
  acceso_computadora: false,
  usa_estos_medios_o_son_accesibles: '',
});

export const internetVacio = (): InternetDraft => ({
  acceso_vivienda: false,
  acceso_lugares_publicos: false,
  acceso_cee: false,
  acceso_telefono_celular: false,
  no_accede_internet: false,
  frecuencia_uso: '',
});

export const inscripcionVacia = (): InscripcionDraft => ({
  paralelo: '',
  programa_no_escolarizado: false,
  nivel_inicial: '',
  nivel_primaria: '',
  programa_auditiva: '',
  atencion_temprana: false,
  independencia_personal: '',
  independencia_social: '',
  programa_intelectual: '',
  programas_visual_fisica_motora_mental: '',
  formacion_tecnica_productiva: '',
  especificacion: '',
});

export const modalidadIndirectaVacia = (): ModalidadIndirectaDraft => ({
  estudiante_discapacidad: false,
  estudiante_dificultad_aprendizaje: false,
  estudiante_talento_extraordinario: false,
  area_nivel: '',
  grado: '',
  nombre_institucion: '',
});

export const tutorVacio = (): TutorDraft => ({
  apellido_paterno: '',
  apellido_materno: '',
  nombre: '',
  complemento: '',
  expedido: '',
  fecha_nacimiento: '',
  idioma_frecuente: '',
  ocupacion_laboral: '',
  grado_instruccion: '',
  parentesco: '',
  tipo_convivencia: '',
});

export function draftVacio(cats?: Catalogos): Draft {
  return {
    estudiante: estudianteVacio(),
    domicilio: null,
    idioma_ninez: idiomaNinezVacio(),
    idiomas: [],
    grupo_familiar: null,
    familiares: [],
    salud: null,
    discapacidad: null,
    tea: null,
    dificultad_aprendizaje: null,
    talento_extraordinario: null,
    servicios_basicos: null,
    tecnologia_comunicacion: null,
    internet: null,
    inscripcion: null,
    modalidad_indirecta: null,
    servicios_multidisciplinarios: (cats?.servicios ?? []).map((sv) => ({
      id_servicio: sv.id_servicio,
      seleccionado: false,
      especificar_otro: '',
    })),
    tutores: [],
  };
}

// ---------- detalle → borrador ----------
export function detailToDraft(det: EstudianteDetalle, cats: Catalogos): Draft {
  const e = det.estudiante ?? {};
  const dom = det.domicilio;
  const gfRow = det.grupo_familiar;
  const sal = det.salud;
  const dis = det.discapacidad;
  const dif = det.dificultad_aprendizaje;
  const tal = det.talento_extraordinario;
  const sb = det.servicios_basicos;
  const tc = det.tecnologia_comunicacion;
  const it = det.acceso_internet;
  const ins = det.inscripcion;
  const mi = det.modalidad_indirecta;

  // La fila cuyo idioma_aprendido_ninez está lleno es el "idioma de la niñez";
  // el resto son "otros idiomas que habla".
  const filasIdiomas = det.idiomas ?? [];
  const idxNinez = filasIdiomas.findIndex((x) => ds(x, 'idioma_aprendido_ninez') !== '');
  const filaNinez = idxNinez >= 0 ? filasIdiomas[idxNinez] : null;
  const filasIdiomasOtro = filasIdiomas.filter((_, i) => i !== idxNinez);
  const idNinezNum = filaNinez ? dn(filaNinez, 'id_idioma') : 0;
  const idiomaNinez: IdiomaNinezDraft = {
    id_idioma: idNinezNum > 0 ? idNinezNum : '',
    otro_nombre: '',
    nacion_o_pueblo: filaNinez ? ds(filaNinez, 'nacion_o_pueblo') : '',
  };

  return {
    estudiante: {
      codigo_sie_cee: ds(e, 'codigo_sie_cee'),
      apellido_paterno: ds(e, 'apellido_paterno'),
      apellido_materno: ds(e, 'apellido_materno'),
      nombre1: ds(e, 'nombre1'),
      nombre2: ds(e, 'nombre2'),
      pais_nacimiento: ds(e, 'pais_nacimiento'),
      departamento_nacimiento: ds(e, 'departamento_nacimiento'),
      provincia_nacimiento: ds(e, 'provincia_nacimiento'),
      localidad_nacimiento: ds(e, 'localidad_nacimiento'),
      tipo_documento: ds(e, 'tipo_documento'),
      numero_documento: ds(e, 'numero_documento'),
      complemento_documento: ds(e, 'complemento_documento'),
      lugar_expedicion_documento: ds(e, 'lugar_expedicion_documento'),
      fecha_nacimiento: dd(e, 'fecha_nacimiento'),
      sexo: ds(e, 'sexo'),
      tiene_certificado_nacimiento: db(e, 'tiene_certificado_nacimiento'),
      certificado_oficialia: ds(e, 'certificado_oficialia'),
      certificado_libro: ds(e, 'certificado_libro'),
      certificado_partida: ds(e, 'certificado_partida'),
      certificado_folio: ds(e, 'certificado_folio'),
    },
    domicilio: dom
      ? {
          departamento: ds(dom, 'departamento'),
          provincia: ds(dom, 'provincia'),
          seccion_municipio: ds(dom, 'seccion_municipio'),
          localidad_comunidad: ds(dom, 'localidad_comunidad'),
          zona_barrio_villa: ds(dom, 'zona_barrio_villa'),
          avenida_calle: ds(dom, 'avenida_calle'),
          numero_vivienda: ds(dom, 'numero_vivienda'),
          telefono: ds(dom, 'telefono'),
          celular: ds(dom, 'celular'),
          direccion_procedencia: ds(dom, 'direccion_procedencia'),
        }
        : null,
    idioma_ninez: idiomaNinez,
    idiomas: filasIdiomasOtro.map((x) => ({
      id_idioma: dn(x, 'id_idioma') || '',
      otro_nombre: '',
    })),
    grupo_familiar: gfRow
      ? {
          otra_institucion: ds(gfRow, 'otra_institucion'),
          otros_Familiares: db(gfRow, 'otros_Familiares'),
          otros_No_Familiares: db(gfRow, 'otros_No_Familiares'),
          familiar_con_discapacidad: db(gfRow, 'familiar_con_discapacidad'),
        }
      : (det.familiares ?? []).length > 0
        ? grupoVacio()
        : null,
    familiares: (det.familiares ?? []).map((x) => ({
      parentesco: ds(x, 'parentesco'),
      tiene_discapacidad: x['discapacidad'] != null && x['discapacidad'] !== '',
      discapacidad: ds(x, 'discapacidad'),
    })),
    salud: sal
      ? {
          seguro_salud: db(sal, 'seguro_salud'),
          atencion_caja_seguro_de_salud: db(sal, 'atencion_caja_seguro_de_salud'),
          atencion_salud_publica: db(sal, 'atencion_salud_publica'),
          atencion_salud_privada: db(sal, 'atencion_salud_privada'),
          atencion_vivienda: db(sal, 'atencion_vivienda'),
          atencion_medicina_tradicional: db(sal, 'atencion_medicina_tradicional'),
          atencion_automedicacion: db(sal, 'atencion_automedicacion'),
          usa_medicacion_administrada_en_el_cee: db(sal, 'usa_medicacion_administrada_en_el_cee'),
        }
      : null,
    discapacidad: dis
      ? {
          numero_carnet_codepedis_o_ibc: ds(dis, 'numero_carnet_codepedis_o_ibc'),
          tipo_discapacidad: ds(dis, 'tipo_discapacidad'),
          grado_discapacidad: ds(dis, 'grado_discapacidad'),
          origen_discapacidad: ds(dis, 'origen_discapacidad'),
        }
      : null,
    tea: det.tea ? { tipo_tea: ds(det.tea, 'tipo_tea') } : null,
    dificultad_aprendizaje: dif
      ? {
          tiene_informe_pedagogico: db(dif, 'tiene_informe_pedagogico'),
          modalidad_directa: db(dif, 'modalidad_directa'),
          area_lectura_escritura: db(dif, 'area_lectura_escritura'),
          area_razonamiento_verbal_logico: db(dif, 'area_razonamiento_verbal_logico'),
          area_calculo_matematico: db(dif, 'area_calculo_matematico'),
          modalidad_indirecta: db(dif, 'modalidad_indirecta'),
          apoyo_tecnico_pedagogico: db(dif, 'apoyo_tecnico_pedagogico'),
        }
      : null,
    talento_extraordinario: tal
      ? {
          tipo_talento: ds(tal, 'tipo_talento'),
          coeficiente_intelectual:
            tal['coeficiente_intelectual'] == null ? '' : String(tal['coeficiente_intelectual']),
          talento_artistico: db(tal, 'talento_artistico'),
          talento_humanistico: db(tal, 'talento_humanistico'),
          talento_musical: db(tal, 'talento_musical'),
          talento_deportivo: db(tal, 'talento_deportivo'),
          talento_cientifico_tecnologico: db(tal, 'talento_cientifico_tecnologico'),
          modalidad_directa: db(tal, 'modalidad_directa'),
          modalidad_directa_tutorias: db(tal, 'modalidad_directa_tutorias'),
          modalidad_directa_acciones_complementarias: db(tal, 'modalidad_directa_acciones_complementarias'),
          modalidad_directa_escuelas_mentoras: db(tal, 'modalidad_directa_escuelas_mentoras'),
          modalidad_directa_practicas_voluntariado: db(tal, 'modalidad_directa_practicas_voluntariado'),
          modalidad_indirecta: db(tal, 'modalidad_indirecta'),
          modalidad_indirecta_orientacion_precoz: db(tal, 'modalidad_indirecta_orientacion_precoz'),
          modalidad_indirecta_adaptaciones_curriculares: db(tal, 'modalidad_indirecta_adaptaciones_curriculares'),
          modalidad_indirecta_aceleracion_educativa: db(tal, 'modalidad_indirecta_aceleracion_educativa'),
          modalidad_indirecta_otros: db(tal, 'modalidad_indirecta_otros'),
        }
      : null,
    servicios_basicos: sb
      ? {
          acceso_agua_canieria: db(sb, 'acceso_agua_canieria'),
          acceso_bano: db(sb, 'acceso_bano'),
          acceso_alcantarillado: db(sb, 'acceso_alcantarillado'),
          acceso_energia_electrica: db(sb, 'acceso_energia_electrica'),
          acceso_recojo_basura: db(sb, 'acceso_recojo_basura'),
          servicios_accesibles_adaptados: ds(sb, 'servicios_accesibles_adaptados'),
        }
      : null,
    tecnologia_comunicacion: tc
      ? {
          acceso_radio: db(tc, 'acceso_radio'),
          acceso_televisor: db(tc, 'acceso_televisor'),
          acceso_telefono: db(tc, 'acceso_telefono'),
          acceso_celular: db(tc, 'acceso_celular'),
          acceso_computadora: db(tc, 'acceso_computadora'),
          usa_estos_medios_o_son_accesibles: ds(tc, 'usa_estos_medios_o_son_accesibles'),
        }
      : null,
    internet: it
      ? {
          acceso_vivienda: db(it, 'acceso_vivienda'),
          acceso_lugares_publicos: db(it, 'acceso_lugares_publicos'),
          acceso_cee: db(it, 'acceso_cee'),
          acceso_telefono_celular: db(it, 'acceso_telefono_celular'),
          no_accede_internet: db(it, 'no_accede_internet'),
          frecuencia_uso: ds(it, 'frecuencia_uso'),
        }
      : null,
    inscripcion: ins
      ? {
          paralelo: ds(ins, 'paralelo'),
          programa_no_escolarizado: db(ins, 'programa_no_escolarizado'),
          nivel_inicial: ds(ins, 'nivel_inicial'),
          nivel_primaria: ds(ins, 'nivel_primaria'),
          programa_auditiva: ds(ins, 'programa_auditiva'),
          atencion_temprana: db(ins, 'atencion_temprana'),
          independencia_personal: ds(ins, 'independencia_personal'),
          independencia_social: ds(ins, 'independencia_social'),
          programa_intelectual: ds(ins, 'programa_intelectual'),
          programas_visual_fisica_motora_mental: ds(ins, 'programas_visual_fisica_motora_mental'),
          formacion_tecnica_productiva: ds(ins, 'formacion_tecnica_productiva'),
          especificacion: ds(ins, 'especificacion'),
        }
      : null,
    modalidad_indirecta: mi
      ? {
          estudiante_discapacidad: db(mi, 'estudiante_discapacidad'),
          estudiante_dificultad_aprendizaje: db(mi, 'estudiante_dificultad_aprendizaje'),
          estudiante_talento_extraordinario: db(mi, 'estudiante_talento_extraordinario'),
          area_nivel: ds(mi, 'area_nivel'),
          grado: ds(mi, 'grado'),
          nombre_institucion: ds(mi, 'nombre_institucion'),
        }
      : null,
    servicios_multidisciplinarios: cats.servicios.map((sv) => {
      const sel = (det.servicios_multidisciplinarios ?? []).find(
        (x) => dn(x, 'id_servicio') === sv.id_servicio
      );
      return {
        id_servicio: sv.id_servicio,
        seleccionado: !!sel,
        especificar_otro: sel ? ds(sel, 'especificar_otro') : '',
      };
    }),
    tutores: (det.tutores ?? []).map((t) => ({
      apellido_paterno: ds(t, 'apellido_paterno'),
      apellido_materno: ds(t, 'apellido_materno'),
      nombre: ds(t, 'nombre'),
      complemento: ds(t, 'complemento'),
      expedido: ds(t, 'expedido'),
      fecha_nacimiento: dd(t, 'fecha_nacimiento'),
      idioma_frecuente: ds(t, 'idioma_frecuente'),
      ocupacion_laboral: ds(t, 'ocupacion_laboral'),
      grado_instruccion: ds(t, 'grado_instruccion'),
      parentesco: ds(t, 'parentesco'),
      tipo_convivencia: ds(t, 'tipo_convivencia'),
    })),
  };
}

// ---------- borrador → payload ----------
const sn = (v: string): string | null => {
  const t = v.trim();
  return t === '' ? null : t;
};

export function draftToPayload(d: Draft, cats?: Catalogos): Record<string, unknown> {
  const e = d.estudiante;
  const cert = e.tiene_certificado_nacimiento;

  const dom = d.domicilio;
  const sal = d.salud;
  const salAny = sal ? Object.values(sal).some(Boolean) : false;

  const dis = d.discapacidad;
  const disAny =
    !!dis &&
    !!(dis.tipo_discapacidad.trim() || dis.grado_discapacidad.trim() || dis.origen_discapacidad.trim());

  const dif = d.dificultad_aprendizaje;
  const difAny = dif ? Object.values(dif).some(Boolean) : false;

  const tal = d.talento_extraordinario;
  const talAny =
    !!tal &&
    !!(
      tal.tipo_talento.trim() ||
      tal.talento_artistico ||
      tal.talento_humanistico ||
      tal.talento_musical ||
      tal.talento_deportivo ||
      tal.talento_cientifico_tecnologico
    );

  const sb = d.servicios_basicos;
  const sbAny =
    !!sb &&
    !!(
      sb.acceso_agua_canieria ||
      sb.acceso_bano ||
      sb.acceso_alcantarillado ||
      sb.acceso_energia_electrica ||
      sb.acceso_recojo_basura ||
      sb.servicios_accesibles_adaptados.trim()
    );

  const tc = d.tecnologia_comunicacion;
  const tcAny =
    !!tc &&
    !!(
      tc.acceso_radio ||
      tc.acceso_televisor ||
      tc.acceso_telefono ||
      tc.acceso_celular ||
      tc.acceso_computadora ||
      tc.usa_estos_medios_o_son_accesibles.trim()
    );

  const it = d.internet;
  const itMedios =
    !!it &&
    !!(
      it.acceso_vivienda ||
      it.acceso_lugares_publicos ||
      it.acceso_cee ||
      it.acceso_telefono_celular
    );

  const ins = d.inscripcion;
  const insAny =
    !!ins &&
    !!(
      ins.paralelo.trim() ||
      ins.nivel_inicial.trim() ||
      ins.nivel_primaria.trim() ||
      ins.programa_auditiva.trim() ||
      ins.independencia_personal.trim() ||
      ins.independencia_social.trim() ||
      ins.programa_intelectual.trim() ||
      ins.programas_visual_fisica_motora_mental.trim() ||
      ins.formacion_tecnica_productiva.trim() ||
      ins.especificacion.trim() ||
      ins.programa_no_escolarizado ||
      ins.atencion_temprana
    );

  const mi = d.modalidad_indirecta;
  const miAny =
    !!mi &&
    !!(
      mi.estudiante_discapacidad ||
      mi.estudiante_dificultad_aprendizaje ||
      mi.estudiante_talento_extraordinario ||
      mi.area_nivel.trim() ||
      mi.grado.trim() ||
      mi.nombre_institucion.trim()
    );

  // Idiomas: la primera fila es el "idioma que aprendió en la niñez";
  // el resto son "otros idiomas que habla".
  // id_idioma === -1 significa opción "Otro": se envía nombre_idioma (texto libre)
  // y el backend lo crea/busca en el catálogo.
  const idiomaFilas: Array<Record<string, unknown>> = [];
  const idsUsados = new Set<number>();
  const nombresUsados = new Set<string>();
  const inz = d.idioma_ninez;
  if (typeof inz.id_idioma === 'number' && inz.id_idioma > 0) {
    const nombreNinez = cats?.idiomas.find((i) => i.id_idioma === inz.id_idioma)?.nombre_idioma ?? '';
    idsUsados.add(inz.id_idioma);
    idiomaFilas.push({
      id_idioma: inz.id_idioma,
      nacion_o_pueblo: sn(inz.nacion_o_pueblo),
      idioma_aprendido_ninez: sn(nombreNinez),
    });
  } else if (inz.id_idioma === -1 && inz.otro_nombre.trim()) {
    const t = inz.otro_nombre.trim();
    nombresUsados.add(t.toLowerCase());
    idiomaFilas.push({
      nombre_idioma: t,
      nacion_o_pueblo: sn(inz.nacion_o_pueblo),
      idioma_aprendido_ninez: t,
    });
  }
  for (const i of d.idiomas) {
    if (typeof i.id_idioma === 'number' && i.id_idioma > 0) {
      if (idsUsados.has(i.id_idioma)) continue;
      idsUsados.add(i.id_idioma);
      idiomaFilas.push({ id_idioma: i.id_idioma });
    } else if (i.id_idioma === -1 && i.otro_nombre.trim()) {
      const k = i.otro_nombre.trim().toLowerCase();
      if (nombresUsados.has(k)) continue;
      nombresUsados.add(k);
      idiomaFilas.push({ nombre_idioma: i.otro_nombre.trim() });
    }
  }

  return {
    estudiante: {
      codigo_sie_cee: sn(e.codigo_sie_cee),
      apellido_paterno: sn(e.apellido_paterno),
      apellido_materno: sn(e.apellido_materno),
      nombre1: sn(e.nombre1),
      nombre2: sn(e.nombre2),
      pais_nacimiento: sn(e.pais_nacimiento),
      departamento_nacimiento: sn(e.departamento_nacimiento),
      provincia_nacimiento: sn(e.provincia_nacimiento),
      localidad_nacimiento: sn(e.localidad_nacimiento),
      tipo_documento: sn(e.tipo_documento),
      numero_documento: sn(e.numero_documento),
      complemento_documento: sn(e.complemento_documento),
      lugar_expedicion_documento: sn(e.lugar_expedicion_documento),
      fecha_nacimiento: sn(e.fecha_nacimiento),
      sexo: sn(e.sexo),
      tiene_certificado_nacimiento: cert,
      certificado_oficialia: cert ? sn(e.certificado_oficialia) : null,
      certificado_libro: cert ? sn(e.certificado_libro) : null,
      certificado_partida: cert ? sn(e.certificado_partida) : null,
      certificado_folio: cert ? sn(e.certificado_folio) : null,
    },
    domicilio: dom
      ? {
          departamento: sn(dom.departamento),
          provincia: sn(dom.provincia),
          seccion_municipio: sn(dom.seccion_municipio),
          localidad_comunidad: sn(dom.localidad_comunidad),
          zona_barrio_villa: sn(dom.zona_barrio_villa),
          avenida_calle: sn(dom.avenida_calle),
          numero_vivienda: sn(dom.numero_vivienda),
          telefono: sn(dom.telefono),
          celular: sn(dom.celular),
          direccion_procedencia: sn(dom.direccion_procedencia),
        }
      : null,
    idiomas: idiomaFilas,
    grupo_familiar: d.grupo_familiar
      ? {
          otra_institucion: sn(d.grupo_familiar.otra_institucion),
          otros_Familiares: d.grupo_familiar.otros_Familiares,
          otros_No_Familiares: d.grupo_familiar.otros_No_Familiares,
          familiar_con_discapacidad: d.grupo_familiar.familiar_con_discapacidad,
        }
      : null,
    familiares: d.familiares.map((f) => ({
      parentesco: f.parentesco.trim(),
      tiene_discapacidad: f.tiene_discapacidad,
      discapacidad: sn(f.discapacidad),
    })),
    salud: sal && salAny ? { ...sal } : null,
    discapacidad: dis && disAny
      ? {
          numero_carnet_codepedis_o_ibc: sn(dis.numero_carnet_codepedis_o_ibc),
          tipo_discapacidad: sn(dis.tipo_discapacidad),
          grado_discapacidad: sn(dis.grado_discapacidad),
          origen_discapacidad: sn(dis.origen_discapacidad),
        }
      : null,
    tea: d.tea && d.tea.tipo_tea.trim() ? { tipo_tea: sn(d.tea.tipo_tea) } : null,
    dificultad_aprendizaje: dif && difAny ? { ...dif } : null,
    talento_extraordinario: tal && talAny ? { ...tal } : null,
    servicios_basicos: sb && sbAny ? { ...sb } : null,
    tecnologia_comunicacion: tc && tcAny ? { ...tc } : null,
    internet: it && (itMedios || it.no_accede_internet) ? { ...it } : null,
    inscripcion: ins && insAny ? { ...ins } : null,
    modalidad_indirecta: mi && miAny ? { ...mi } : null,
    servicios_multidisciplinarios: d.servicios_multidisciplinarios
      .filter((sv) => sv.seleccionado)
      .map((sv) => ({
        id_servicio: sv.id_servicio,
        especificar_otro: sn(sv.especificar_otro),
      })),
    tutores: d.tutores
      .filter((t) => t.nombre.trim() || t.apellido_paterno.trim() || t.parentesco.trim())
      .map((t) => ({
        complemento: sn(t.complemento),
        expedido: sn(t.expedido),
        apellido_paterno: sn(t.apellido_paterno),
        apellido_materno: sn(t.apellido_materno),
        nombre: sn(t.nombre),
        fecha_nacimiento: sn(t.fecha_nacimiento),
        idioma_frecuente: sn(t.idioma_frecuente),
        ocupacion_laboral: sn(t.ocupacion_laboral),
        grado_instruccion: sn(t.grado_instruccion),
        parentesco: sn(t.parentesco),
        tipo_convivencia: sn(t.tipo_convivencia),
      })),
  };
}

// ---------- validación cliente ----------
export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validar(d: Draft): string[] {
  const errs: string[] = [];
  const e = d.estudiante;
  const rq = (v: string, n: string) => {
    if (!v.trim()) errs.push(`${n} es obligatorio.`);
  };
  rq(e.codigo_sie_cee, 'El código SIE CEE');
  rq(e.apellido_paterno, 'El apellido paterno');
  rq(e.nombre1, 'El primer nombre');
  rq(e.pais_nacimiento, 'El país de nacimiento');
  rq(e.departamento_nacimiento, 'El departamento de nacimiento');
  rq(e.provincia_nacimiento, 'La provincia de nacimiento');
  rq(e.localidad_nacimiento, 'La localidad de nacimiento');
  rq(e.tipo_documento, 'El tipo de documento');
  rq(e.numero_documento, 'El número de documento');
  if (!e.sexo) errs.push('El sexo es obligatorio.');
  if (!e.fecha_nacimiento) errs.push('La fecha de nacimiento es obligatoria.');
  else if (e.fecha_nacimiento > hoyISO()) errs.push('La fecha de nacimiento no puede ser futura.');
  if (e.tiene_certificado_nacimiento) {
    if (
      !(e.certificado_oficialia.trim() && e.certificado_libro.trim() && e.certificado_partida.trim() && e.certificado_folio.trim())
    ) {
      errs.push('Certificado de nacimiento: complete oficialía, libro, partida y folio.');
    }
  }

  if (d.domicilio) {
    const domRec = d.domicilio as unknown as Record<string, string>;
    const domObl: Array<[string, string]> = [
      ['departamento', 'departamento'],
      ['provincia', 'provincia'],
      ['seccion_municipio', 'sección/municipio'],
      ['localidad_comunidad', 'localidad/comunidad'],
      ['zona_barrio_villa', 'zona/barrio/villa'],
      ['avenida_calle', 'avenida/calle'],
    ];
    for (const [k, n] of domObl) {
      if (!domRec[k].trim()) errs.push(`Domicilio: el campo "${n}" es obligatorio.`);
    }
  }

  if (d.idioma_ninez.id_idioma === -1 && !d.idioma_ninez.otro_nombre.trim()) {
    errs.push('Idioma y cultura: escriba el nombre del idioma que aprendió en la niñez (opción Otro).');
  }
  d.idiomas.forEach((i, idx) => {
    if (i.id_idioma === -1 && !i.otro_nombre.trim()) {
      errs.push(`Idioma ${idx + 1}: escriba el nombre del idioma (opción Otro).`);
    }
  });

  const flagDisc =
    (d.grupo_familiar?.familiar_con_discapacidad ?? false) ||
    d.familiares.some((f) => f.tiene_discapacidad);
  d.familiares.forEach((f, idx) => {
    if (!f.parentesco.trim()) errs.push(`Familiar ${idx + 1}: indique el parentesco.`);
    if (flagDisc && f.tiene_discapacidad && !f.discapacidad.trim()) {
      errs.push(`Familiar ${idx + 1}: indique la discapacidad.`);
    }
  });
  if (flagDisc && !d.familiares.some((f) => f.tiene_discapacidad && f.discapacidad.trim())) {
    errs.push('Grupo familiar: registre al menos un familiar con discapacidad y su tipo.');
  }

  if (d.salud && !d.salud.seguro_salud && d.salud.atencion_caja_seguro_de_salud) {
    errs.push('Salud: la atención por caja/seguro requiere tener seguro de salud.');
  }

  if (d.discapacidad) {
    rq(d.discapacidad.tipo_discapacidad, 'El tipo de discapacidad');
    rq(d.discapacidad.grado_discapacidad, 'El grado de discapacidad');
    rq(d.discapacidad.origen_discapacidad, 'El origen de la discapacidad');
  }

  if (d.tea && !d.tea.tipo_tea.trim()) errs.push('TEA: indique el tipo.');

  if (d.talento_extraordinario) {
    const tal = d.talento_extraordinario;
    rq(tal.tipo_talento, 'El tipo de talento extraordinario');
    const subD =
      tal.modalidad_directa_tutorias ||
      tal.modalidad_directa_acciones_complementarias ||
      tal.modalidad_directa_escuelas_mentoras ||
      tal.modalidad_directa_practicas_voluntariado;
    if (subD && !tal.modalidad_directa) {
      errs.push('Talento: active "Modalidad directa" para marcar sus opciones.');
    }
    const subI =
      tal.modalidad_indirecta_orientacion_precoz ||
      tal.modalidad_indirecta_adaptaciones_curriculares ||
      tal.modalidad_indirecta_aceleracion_educativa ||
      tal.modalidad_indirecta_otros;
    if (subI && !tal.modalidad_indirecta) {
      errs.push('Talento: active "Modalidad indirecta" para marcar sus opciones.');
    }
  }

  if (d.internet) {
    const medios =
      d.internet.acceso_vivienda ||
      d.internet.acceso_lugares_publicos ||
      d.internet.acceso_cee ||
      d.internet.acceso_telefono_celular;
    if (d.internet.no_accede_internet && medios) {
      errs.push('Internet: marque "no accede" o los medios de acceso, no ambos.');
    }
  }

  if (d.modalidad_indirecta) {
    if (
      !(
        d.modalidad_indirecta.estudiante_discapacidad ||
        d.modalidad_indirecta.estudiante_dificultad_aprendizaje ||
        d.modalidad_indirecta.estudiante_talento_extraordinario
      )
    ) {
      errs.push('Modalidad indirecta: seleccione al menos un tipo de estudiante.');
    }
  }

  d.tutores.forEach((t, idx) => {
    const vacio = !t.nombre.trim() && !t.apellido_paterno.trim() && !t.parentesco.trim();
    if (vacio) return;
    rq(t.apellido_paterno, `Tutor ${idx + 1}: el apellido paterno`);
    rq(t.nombre, `Tutor ${idx + 1}: el nombre`);
    rq(t.parentesco, `Tutor ${idx + 1}: el parentesco`);
  });

  return errs;
}
