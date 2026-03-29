// =============================================
// HATOAI — Database TypeScript Types
// Generated from schema v2.0
// =============================================

export interface Perfil {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  rol: string;
  dependencia_gobierno: string | null;
  cargo_gobierno: string | null;
  avatar_url: string | null;
  onboarding_completado: boolean;
  idioma: string;
  created_at: string;
  updated_at: string;
}

export interface Rancho {
  id: string;
  nombre: string;
  estado: string;
  municipio: string;
  direccion: string | null;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  superficie_ha: number | null;
  tipo_produccion: string | null;
  especies_activas: string[];
  siniiga_upp: string | null;
  rfc: string | null;
  pgn_folio: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RanchoUsuario {
  id: string;
  rancho_id: string;
  user_id: string;
  rol: string;
  activo: boolean;
  created_at: string;
}

export interface Corral {
  id: string;
  rancho_id: string;
  nombre: string;
  tipo: string | null;
  capacidad: number | null;
  superficie_ha: number | null;
  tipo_pasto: string | null;
  estado: string;
  created_at: string;
}

export interface Animal {
  id: string;
  rancho_id: string;
  numero_arete: string;
  id_siniiga: string | null;
  rfid: string | null;
  nombre: string | null;
  especie: string;
  sexo: string;
  categoria: string | null;
  raza: string | null;
  color: string | null;
  marcas: string | null;
  fecha_nacimiento: string | null;
  fecha_nacimiento_estimada: boolean;
  fecha_ingreso: string;
  tipo_produccion: string | null;
  proposito: string | null;
  padre_id: string | null;
  madre_id: string | null;
  padre_externo: string | null;
  madre_externa: string | null;
  padre_genetico: string | null;
  registro_genealogico: string | null;
  estado: string;
  estado_reproductivo: string | null;
  estado_sanitario: string;
  corral_id: string | null;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  peso_nacimiento: number | null;
  peso_actual: number | null;
  fecha_ultimo_pesaje: string | null;
  condicion_corporal: number | null;
  gdp_actual: number | null;
  origen: string;
  programa_gobierno: string | null;
  folio_apoyo: string | null;
  precio_compra: number | null;
  proveedor: string | null;
  upp_origen: string | null;
  fierro: string | null;
  estatus_brucela: string | null;
  estatus_tuberculosis: string | null;
  paridad: number;
  num_pezones: number | null;
  linea_genetica: string | null;
  tipo_fibra: string | null;
  famacha_ultimo: number | null;
  uso_equido: string | null;
  alzada_cm: number | null;
  fecha_ultimo_herraje: string | null;
  fecha_ultima_dental: string | null;
  prueba_aie_vigente: boolean | null;
  especie_diversificada: string | null;
  registro_uma: string | null;
  foto_url: string | null;
  fotos_adicionales: string[] | null;
  notas: string | null;
  tags: string[] | null;
  fecha_baja: string | null;
  causa_baja: string | null;
  precio_venta: number | null;
  comprador: string | null;
  peso_venta: number | null;
  costo_acumulado: number;
  ingresos_acumulados: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Lote {
  id: string;
  rancho_id: string;
  nombre: string;
  especie: string;
  tipo: string | null;
  especie_ave: string | null;
  raza: string | null;
  cantidad_inicial: number;
  cantidad_actual: number | null;
  fecha_ingreso: string;
  fecha_nacimiento: string | null;
  edad_ingreso_semanas: number | null;
  galpon_id: string | null;
  proveedor: string | null;
  costo_por_unidad: number | null;
  programa_vacunacion_inicial: string[] | null;
  fecha_inicio_produccion: string | null;
  fecha_estimada_venta: string | null;
  programa_gobierno: string | null;
  estado: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProduccionLote {
  id: string;
  lote_id: string;
  rancho_id: string;
  fecha: string;
  huevos_totales: number | null;
  huevos_rotos: number | null;
  huevos_sucios: number | null;
  huevos_doble_yema: number | null;
  huevos_vendibles: number | null;
  peso_promedio_muestra: number | null;
  muestra_cantidad: number | null;
  alimento_consumido_kg: number | null;
  agua_consumida_litros: number | null;
  mortalidad_dia: number;
  descarte_dia: number;
  causa_mortalidad: string | null;
  temperatura_galpon: number | null;
  humedad_galpon: number | null;
  notas: string | null;
  created_at: string;
}

export interface Apiario {
  id: string;
  rancho_id: string;
  nombre: string;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  ubicacion_referencia: string | null;
  municipio: string | null;
  vegetacion_predominante: string[] | null;
  distancia_agua: string | null;
  tipo_acceso: string | null;
  num_colmenas: number;
  certificacion_organica: boolean;
  certificadora: string | null;
  notas: string | null;
  created_at: string;
}

export interface Colmena {
  id: string;
  apiario_id: string;
  rancho_id: string;
  numero: string;
  id_siniiga_disco: string | null;
  tipo: string | null;
  especie_abeja: string;
  num_cuerpos: number | null;
  raza_reina: string | null;
  color_marcaje_reina: string | null;
  edad_reina_meses: number | null;
  fecha_ultimo_requeening: string | null;
  fecha_instalacion: string | null;
  origen: string | null;
  estado: string;
  fortaleza: string | null;
  programa_gobierno: string | null;
  foto_url: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface RevisionColmena {
  id: string;
  colmena_id: string;
  rancho_id: string;
  fecha: string;
  inspector: string | null;
  reina_vista: boolean | null;
  postura: string | null;
  huevos_frescos: boolean | null;
  cuadros_cria: number | null;
  cuadros_miel: number | null;
  cuadros_polen: number | null;
  temperamento: string | null;
  celdas_reales: boolean | null;
  celdas_reales_cantidad: number | null;
  varroa_conteo: number | null;
  varroa_metodo: string | null;
  varroa_nivel: string | null;
  enfermedades_observadas: string[] | null;
  alimentacion_artificial: string | null;
  alimentacion_cantidad: string | null;
  notas: string | null;
  fotos: string[] | null;
  created_at: string;
}

export interface CosechaMiel {
  id: string;
  colmena_id: string | null;
  apiario_id: string;
  rancho_id: string;
  fecha: string;
  alzas_cosechadas: number | null;
  kg_miel_bruto: number | null;
  kg_miel_neto: number | null;
  kg_cera: number | null;
  kg_polen: number | null;
  gramos_propoleo: number | null;
  tipo_floral: string | null;
  humedad_pct: number | null;
  color: string | null;
  calidad: string | null;
  certificacion_organica: boolean;
  precio_kg: number | null;
  comprador: string | null;
  notas: string | null;
  created_at: string;
}

export interface Pesaje {
  id: string;
  animal_id: string | null;
  rancho_id: string;
  fecha: string;
  peso: number;
  metodo: string | null;
  condicion_corporal: number | null;
  gdp_calculado: number | null;
  registrado_por: string | null;
  notas: string | null;
  created_at: string;
}

export interface ProduccionLeche {
  id: string;
  animal_id: string | null;
  rancho_id: string;
  fecha: string;
  litros_am: number | null;
  litros_pm: number | null;
  litros_total: number;
  ordena_numero: number | null;
  grasa_pct: number | null;
  proteina_pct: number | null;
  celulas_somaticas: number | null;
  mun: number | null;
  antibioticos_positivo: boolean | null;
  notas: string | null;
  created_at: string;
}

export interface EventoReproductivo {
  id: string;
  animal_id: string;
  rancho_id: string;
  fecha: string;
  tipo: string;
  celo_metodo: string | null;
  celo_intensidad: string | null;
  macho_id: string | null;
  inseminador: string | null;
  pajilla_id: string | null;
  toro_raza_semen: string | null;
  tipo_semen: string | null;
  tanque_canastilla: string | null;
  protocolo_iatf: string | null;
  numero_servicios: number;
  donadora_id: string | null;
  receptora_id: string | null;
  laboratorio: string | null;
  calidad_embrion: string | null;
  estadio_embrion: string | null;
  metodo_diagnostico: string | null;
  resultado: string | null;
  dias_gestacion_estimados: number | null;
  num_fetos: number | null;
  palpador: string | null;
  facilidad_parto: number | null;
  presentacion: string | null;
  num_crias: number | null;
  retencion_placenta: boolean | null;
  peso_destete: number | null;
  edad_destete_dias: number | null;
  metodo_destete: string | null;
  dias_gestacion_aborto: number | null;
  causa_probable: string | null;
  nacidos_vivos: number | null;
  nacidos_muertos: number | null;
  momificados: number | null;
  peso_camada: number | null;
  huevos_incubados: number | null;
  pollitos_nacidos: number | null;
  pct_eclosion: number | null;
  veterinario: string | null;
  notas: string | null;
  fecha_parto_esperada: string | null;
  created_at: string;
}

export interface Cria {
  id: string;
  evento_parto_id: string;
  animal_creado_id: string | null;
  sexo: string | null;
  peso_nacer: number | null;
  vivo: boolean;
  nombre: string | null;
  notas: string | null;
  created_at: string;
}

export interface EventoSanitario {
  id: string;
  animal_id: string | null;
  lote_id: string | null;
  colmena_id: string | null;
  rancho_id: string;
  fecha: string;
  tipo: string;
  campana: string | null;
  producto: string | null;
  lote_producto: string | null;
  dosis: string | null;
  via: string | null;
  proxima_aplicacion: string | null;
  diagnostico: string | null;
  medicamento: string | null;
  duracion_dias: number | null;
  fecha_fin: string | null;
  dias_retiro_carne: number | null;
  dias_retiro_leche: number | null;
  fecha_fin_retiro: string | null;
  respuesta_tratamiento: string | null;
  tipo_prueba: string | null;
  resultado_prueba: string | null;
  laboratorio: string | null;
  mvtea: string | null;
  famacha_score: number | null;
  famacha_accion: string | null;
  varroa_conteo: number | null;
  varroa_metodo: string | null;
  causa_muerte: string | null;
  necropsia: boolean | null;
  veterinario: string | null;
  costo: number | null;
  notas: string | null;
  fotos: string[] | null;
  created_at: string;
}

export interface InventarioAlimento {
  id: string;
  rancho_id: string;
  tipo: string | null;
  nombre: string;
  marca: string | null;
  proteina_pct: number | null;
  energia_kcal: number | null;
  cantidad_actual_kg: number | null;
  costo_por_kg: number | null;
  proveedor: string | null;
  fecha_caducidad: string | null;
  created_at: string;
}

export interface ConsumoAlimento {
  id: string;
  rancho_id: string;
  corral_id: string | null;
  lote_id: string | null;
  alimento_id: string | null;
  fecha: string;
  cantidad_kg: number;
  num_animales: number | null;
  notas: string | null;
  created_at: string;
}

export interface MovimientoEconomico {
  id: string;
  rancho_id: string;
  animal_id: string | null;
  lote_id: string | null;
  tipo: string;
  categoria: string | null;
  subcategoria: string | null;
  monto: number;
  cantidad: number | null;
  precio_unitario: number | null;
  descripcion: string | null;
  comprador_vendedor: string | null;
  factura_folio: string | null;
  programa_gobierno: string | null;
  fecha: string;
  notas: string | null;
  created_at: string;
}

export interface ProgramaGobierno {
  id: string;
  nombre: string;
  dependencia: string | null;
  descripcion: string | null;
  estado: string | null;
  municipios: string[] | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  presupuesto: number | null;
  presupuesto_ejercido: number;
  meta_ranchos: number | null;
  meta_cabezas: number | null;
  meta_inseminaciones: number | null;
  meta_sementales: number | null;
  meta_colmenas: number | null;
  responsable: string | null;
  tipo: string | null;
  licencias_compradas: number;
  licencias_activadas: number;
  created_at: string;
}

export interface ProgramaRancho {
  id: string;
  programa_id: string;
  rancho_id: string;
  fecha_inscripcion: string;
  tipo_apoyo: string | null;
  monto_apoyo: number | null;
  animales_entregados: number;
  compromiso: string | null;
  compromiso_cumplido: boolean;
  fecha_compromiso: string | null;
  licencia_activa: boolean;
  fecha_activacion_licencia: string | null;
  ultimo_login: string | null;
  estado: string;
  created_at: string;
}

export interface Alerta {
  id: string;
  rancho_id: string;
  animal_id: string | null;
  lote_id: string | null;
  colmena_id: string | null;
  tipo: string | null;
  mensaje: string;
  prioridad: string;
  leida: boolean;
  generada_por: string;
  fecha_alerta: string | null;
  accion_sugerida: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  rancho_id: string | null;
  user_id: string | null;
  tabla: string;
  registro_id: string | null;
  accion: string;
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  created_at: string;
}

export interface CreditScore {
  id: string;
  rancho_id: string;
  score_total: number | null;
  score_completitud: number | null;
  score_regularidad: number | null;
  score_productividad: number | null;
  score_financiero: number | null;
  score_antiguedad: number | null;
  score_sanitario: number | null;
  score_tamano: number | null;
  datos_calculo: Record<string, unknown> | null;
  calculado_at: string;
}

export interface Documento {
  id: string;
  rancho_id: string | null;
  animal_id: string | null;
  tipo: string | null;
  nombre: string | null;
  archivo_url: string | null;
  fecha: string;
  notas: string | null;
  subido_por: string | null;
  created_at: string;
}

// =============================================
// Supabase Database type helper
// =============================================

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: Perfil;
        Insert: Partial<Perfil> & Pick<Perfil, 'id' | 'nombre'>;
        Update: Partial<Perfil>;
      };
      ranchos: {
        Row: Rancho;
        Insert: Partial<Rancho> & Pick<Rancho, 'nombre' | 'estado' | 'municipio'>;
        Update: Partial<Rancho>;
      };
      rancho_usuarios: {
        Row: RanchoUsuario;
        Insert: Partial<RanchoUsuario> & Pick<RanchoUsuario, 'rancho_id' | 'user_id'>;
        Update: Partial<RanchoUsuario>;
      };
      corrales: {
        Row: Corral;
        Insert: Partial<Corral> & Pick<Corral, 'rancho_id' | 'nombre'>;
        Update: Partial<Corral>;
      };
      animales: {
        Row: Animal;
        Insert: Partial<Animal> & Pick<Animal, 'rancho_id' | 'numero_arete' | 'especie' | 'sexo'>;
        Update: Partial<Animal>;
      };
      lotes: {
        Row: Lote;
        Insert: Partial<Lote> & Pick<Lote, 'rancho_id' | 'nombre' | 'especie' | 'cantidad_inicial'>;
        Update: Partial<Lote>;
      };
      produccion_lotes: {
        Row: ProduccionLote;
        Insert: Partial<ProduccionLote> & Pick<ProduccionLote, 'lote_id' | 'rancho_id'>;
        Update: Partial<ProduccionLote>;
      };
      apiarios: {
        Row: Apiario;
        Insert: Partial<Apiario> & Pick<Apiario, 'rancho_id' | 'nombre'>;
        Update: Partial<Apiario>;
      };
      colmenas: {
        Row: Colmena;
        Insert: Partial<Colmena> & Pick<Colmena, 'apiario_id' | 'rancho_id' | 'numero'>;
        Update: Partial<Colmena>;
      };
      revisiones_colmena: {
        Row: RevisionColmena;
        Insert: Partial<RevisionColmena> & Pick<RevisionColmena, 'colmena_id' | 'rancho_id'>;
        Update: Partial<RevisionColmena>;
      };
      cosechas_miel: {
        Row: CosechaMiel;
        Insert: Partial<CosechaMiel> & Pick<CosechaMiel, 'apiario_id' | 'rancho_id' | 'fecha'>;
        Update: Partial<CosechaMiel>;
      };
      pesajes: {
        Row: Pesaje;
        Insert: Partial<Pesaje> & Pick<Pesaje, 'rancho_id' | 'peso'>;
        Update: Partial<Pesaje>;
      };
      produccion_leche: {
        Row: ProduccionLeche;
        Insert: Partial<ProduccionLeche> & Pick<ProduccionLeche, 'rancho_id' | 'litros_total'>;
        Update: Partial<ProduccionLeche>;
      };
      eventos_reproductivos: {
        Row: EventoReproductivo;
        Insert: Partial<EventoReproductivo> & Pick<EventoReproductivo, 'animal_id' | 'rancho_id' | 'fecha' | 'tipo'>;
        Update: Partial<EventoReproductivo>;
      };
      crias: {
        Row: Cria;
        Insert: Partial<Cria> & Pick<Cria, 'evento_parto_id'>;
        Update: Partial<Cria>;
      };
      eventos_sanitarios: {
        Row: EventoSanitario;
        Insert: Partial<EventoSanitario> & Pick<EventoSanitario, 'rancho_id' | 'tipo'>;
        Update: Partial<EventoSanitario>;
      };
      inventario_alimentos: {
        Row: InventarioAlimento;
        Insert: Partial<InventarioAlimento> & Pick<InventarioAlimento, 'rancho_id' | 'nombre'>;
        Update: Partial<InventarioAlimento>;
      };
      consumo_alimento: {
        Row: ConsumoAlimento;
        Insert: Partial<ConsumoAlimento> & Pick<ConsumoAlimento, 'rancho_id' | 'cantidad_kg'>;
        Update: Partial<ConsumoAlimento>;
      };
      movimientos_economicos: {
        Row: MovimientoEconomico;
        Insert: Partial<MovimientoEconomico> & Pick<MovimientoEconomico, 'rancho_id' | 'tipo' | 'monto'>;
        Update: Partial<MovimientoEconomico>;
      };
      programas_gobierno: {
        Row: ProgramaGobierno;
        Insert: Partial<ProgramaGobierno> & Pick<ProgramaGobierno, 'nombre'>;
        Update: Partial<ProgramaGobierno>;
      };
      programa_ranchos: {
        Row: ProgramaRancho;
        Insert: Partial<ProgramaRancho> & Pick<ProgramaRancho, 'programa_id' | 'rancho_id'>;
        Update: Partial<ProgramaRancho>;
      };
      alertas: {
        Row: Alerta;
        Insert: Partial<Alerta> & Pick<Alerta, 'rancho_id' | 'mensaje'>;
        Update: Partial<Alerta>;
      };
      activity_log: {
        Row: ActivityLog;
        Insert: Partial<ActivityLog> & Pick<ActivityLog, 'tabla' | 'accion'>;
        Update: Partial<ActivityLog>;
      };
      credit_score: {
        Row: CreditScore;
        Insert: Partial<CreditScore> & Pick<CreditScore, 'rancho_id'>;
        Update: Partial<CreditScore>;
      };
      documentos: {
        Row: Documento;
        Insert: Partial<Documento>;
        Update: Partial<Documento>;
      };
    };
  };
}
