import type { Dispatch, SetStateAction } from 'react';

// ---------- catálogos ----------
export interface IdiomaCat {
  id_idioma: number;
  nombre_idioma: string;
}
export interface ServicioCat {
  id_servicio: number;
  nombre_servicio: string;
}
export interface Catalogos {
  idiomas: IdiomaCat[];
  servicios: ServicioCat[];
}

// ---------- listado ----------
export interface EstudianteLista {
  id_estudiante: number;
  codigo_sie_cee: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string | null;
  sexo: string;
}

// ---------- detalle (filas sueltas de la BD) ----------
export type Fila = Record<string, unknown>;
export interface EstudianteDetalle {
  estudiante?: Fila;
  domicilio?: Fila | null;
  idiomas?: Fila[];
  grupo_familiar?: Fila | null;
  familiares?: Fila[];
  salud?: Fila | null;
  discapacidad?: Fila | null;
  tea?: Fila | null;
  dificultad_aprendizaje?: Fila | null;
  talento_extraordinario?: Fila | null;
  servicios_basicos?: Fila | null;
  tecnologia_comunicacion?: Fila | null;
  acceso_internet?: Fila | null;
  inscripcion?: Fila | null;
  modalidad_indirecta?: Fila | null;
  servicios_multidisciplinarios?: Fila[];
  tutores?: Fila[];
}

// ---------- borrador del formulario ----------
export interface EstudianteDraft {
  codigo_sie_cee: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre1: string;
  nombre2: string;
  pais_nacimiento: string;
  departamento_nacimiento: string;
  provincia_nacimiento: string;
  localidad_nacimiento: string;
  tipo_documento: string;
  numero_documento: string;
  complemento_documento: string;
  lugar_expedicion_documento: string;
  fecha_nacimiento: string;
  sexo: string;
  tiene_certificado_nacimiento: boolean;
  certificado_oficialia: string;
  certificado_libro: string;
  certificado_partida: string;
  certificado_folio: string;
}

export interface DomicilioDraft {
  departamento: string;
  provincia: string;
  seccion_municipio: string;
  localidad_comunidad: string;
  zona_barrio_villa: string;
  avenida_calle: string;
  numero_vivienda: string;
  telefono: string;
  celular: string;
  direccion_procedencia: string;
}

export interface IdiomaDraft {
  /** -1 = opción "Otro" (texto libre en otro_nombre) */
  id_idioma: number | '';
  otro_nombre: string;
}

export interface IdiomaNinezDraft {
  /** -1 = opción "Otro" (texto libre en otro_nombre) */
  id_idioma: number | '';
  otro_nombre: string;
  nacion_o_pueblo: string;
}

export interface GrupoFamiliarDraft {
  otra_institucion: string;
  otros_Familiares: boolean;
  otros_No_Familiares: boolean;
  familiar_con_discapacidad: boolean;
}

export interface FamiliarDraft {
  parentesco: string;
  tiene_discapacidad: boolean;
  discapacidad: string;
}

export interface SaludDraft {
  seguro_salud: boolean;
  atencion_caja_seguro_de_salud: boolean;
  atencion_salud_publica: boolean;
  atencion_salud_privada: boolean;
  atencion_vivienda: boolean;
  atencion_medicina_tradicional: boolean;
  atencion_automedicacion: boolean;
  usa_medicacion_administrada_en_el_cee: boolean;
}

export interface DiscapacidadDraft {
  numero_carnet_codepedis_o_ibc: string;
  tipo_discapacidad: string;
  grado_discapacidad: string;
  origen_discapacidad: string;
}

export interface TeaDraft {
  tipo_tea: string;
}

export interface DificultadDraft {
  tiene_informe_pedagogico: boolean;
  modalidad_directa: boolean;
  area_lectura_escritura: boolean;
  area_razonamiento_verbal_logico: boolean;
  area_calculo_matematico: boolean;
  modalidad_indirecta: boolean;
  apoyo_tecnico_pedagogico: boolean;
}

export interface TalentoDraft {
  tipo_talento: string;
  coeficiente_intelectual: string;
  talento_artistico: boolean;
  talento_humanistico: boolean;
  talento_musical: boolean;
  talento_deportivo: boolean;
  talento_cientifico_tecnologico: boolean;
  modalidad_directa: boolean;
  modalidad_directa_tutorias: boolean;
  modalidad_directa_acciones_complementarias: boolean;
  modalidad_directa_escuelas_mentoras: boolean;
  modalidad_directa_practicas_voluntariado: boolean;
  modalidad_indirecta: boolean;
  modalidad_indirecta_orientacion_precoz: boolean;
  modalidad_indirecta_adaptaciones_curriculares: boolean;
  modalidad_indirecta_aceleracion_educativa: boolean;
  modalidad_indirecta_otros: boolean;
}

export interface ServBasicosDraft {
  acceso_agua_canieria: boolean;
  acceso_bano: boolean;
  acceso_alcantarillado: boolean;
  acceso_energia_electrica: boolean;
  acceso_recojo_basura: boolean;
  servicios_accesibles_adaptados: string;
}

export interface TecnologiaDraft {
  acceso_radio: boolean;
  acceso_televisor: boolean;
  acceso_telefono: boolean;
  acceso_celular: boolean;
  acceso_computadora: boolean;
  usa_estos_medios_o_son_accesibles: string;
}

export interface InternetDraft {
  acceso_vivienda: boolean;
  acceso_lugares_publicos: boolean;
  acceso_cee: boolean;
  acceso_telefono_celular: boolean;
  no_accede_internet: boolean;
  frecuencia_uso: string;
}

export interface InscripcionDraft {
  paralelo: string;
  programa_no_escolarizado: boolean;
  nivel_inicial: string;
  nivel_primaria: string;
  programa_auditiva: string;
  atencion_temprana: boolean;
  independencia_personal: string;
  independencia_social: string;
  programa_intelectual: string;
  programas_visual_fisica_motora_mental: string;
  formacion_tecnica_productiva: string;
  especificacion: string;
}

export interface ModalidadIndirectaDraft {
  estudiante_discapacidad: boolean;
  estudiante_dificultad_aprendizaje: boolean;
  estudiante_talento_extraordinario: boolean;
  area_nivel: string;
  grado: string;
  nombre_institucion: string;
}

export interface ServicioSelDraft {
  id_servicio: number;
  seleccionado: boolean;
  especificar_otro: string;
}

export interface TutorDraft {
  apellido_paterno: string;
  apellido_materno: string;
  nombre: string;
  complemento: string;
  expedido: string;
  fecha_nacimiento: string;
  idioma_frecuente: string;
  ocupacion_laboral: string;
  grado_instruccion: string;
  parentesco: string;
  tipo_convivencia: string;
}

export interface Draft {
  estudiante: EstudianteDraft;
  domicilio: DomicilioDraft | null;
  idioma_ninez: IdiomaNinezDraft;
  idiomas: IdiomaDraft[];
  grupo_familiar: GrupoFamiliarDraft | null;
  familiares: FamiliarDraft[];
  salud: SaludDraft | null;
  discapacidad: DiscapacidadDraft | null;
  tea: TeaDraft | null;
  dificultad_aprendizaje: DificultadDraft | null;
  talento_extraordinario: TalentoDraft | null;
  servicios_basicos: ServBasicosDraft | null;
  tecnologia_comunicacion: TecnologiaDraft | null;
  internet: InternetDraft | null;
  inscripcion: InscripcionDraft | null;
  modalidad_indirecta: ModalidadIndirectaDraft | null;
  servicios_multidisciplinarios: ServicioSelDraft[];
  tutores: TutorDraft[];
}

export type StepProps = {
  d: Draft;
  up: Dispatch<SetStateAction<Draft>>;
};
