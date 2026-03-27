-- ============================================================================
-- HatoAI - Livestock Management Platform
-- Initial Schema Migration
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. perfiles - User profiles
-- ============================================================================
CREATE TABLE perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellido TEXT,
    telefono TEXT,
    avatar_url TEXT,
    idioma TEXT DEFAULT 'es' CHECK (idioma IN ('es', 'en', 'pt')),
    zona_horaria TEXT DEFAULT 'America/Mexico_City',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_perfiles_deleted_at ON perfiles(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 2. ranchos - Ranches
-- ============================================================================
CREATE TABLE ranchos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    superficie_ha NUMERIC(12,2),
    especie_principal TEXT NOT NULL CHECK (especie_principal IN (
        'bovino', 'porcino', 'ovino', 'caprino', 'equino',
        'avicola', 'apicola', 'cunicola', 'diversificado'
    )),
    proposito TEXT CHECK (proposito IN (
        'carne', 'leche', 'doble_proposito', 'cria', 'engorda',
        'lana', 'huevo', 'miel', 'pie_de_cria', 'otro'
    )),
    moneda TEXT DEFAULT 'MXN',
    logo_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_ranchos_especie ON ranchos(especie_principal);
CREATE INDEX idx_ranchos_activo ON ranchos(activo) WHERE activo = TRUE;
CREATE INDEX idx_ranchos_deleted_at ON ranchos(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 3. rancho_usuarios - Ranch-user membership with roles
-- ============================================================================
CREATE TABLE rancho_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    rol TEXT NOT NULL CHECK (rol IN ('propietario', 'administrador', 'veterinario', 'vaquero', 'invitado')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (rancho_id, usuario_id)
);

CREATE INDEX idx_rancho_usuarios_rancho ON rancho_usuarios(rancho_id);
CREATE INDEX idx_rancho_usuarios_usuario ON rancho_usuarios(usuario_id);
CREATE INDEX idx_rancho_usuarios_rol ON rancho_usuarios(rol);

-- ============================================================================
-- 4. corrales - Infrastructure (pens, paddocks, etc.)
-- ============================================================================
CREATE TABLE corrales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'corral', 'potrero', 'establo', 'nave', 'galpon',
        'jaula', 'manga', 'bascula', 'enfermeria', 'otro'
    )),
    capacidad INTEGER,
    superficie_m2 NUMERIC(10,2),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_corrales_rancho ON corrales(rancho_id);
CREATE INDEX idx_corrales_tipo ON corrales(tipo);
CREATE INDEX idx_corrales_activo ON corrales(activo) WHERE activo = TRUE;

-- ============================================================================
-- 5. animales - Individual animals
-- ============================================================================
CREATE TABLE animales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    corral_id UUID REFERENCES corrales(id) ON DELETE SET NULL,
    identificador TEXT NOT NULL,
    nombre TEXT,
    especie TEXT NOT NULL CHECK (especie IN (
        'bovino', 'porcino', 'ovino', 'caprino', 'equino', 'cunicola', 'diversificado'
    )),
    raza TEXT,
    sexo TEXT NOT NULL CHECK (sexo IN ('macho', 'hembra')),
    fecha_nacimiento DATE,
    peso_actual NUMERIC(8,2),
    estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN (
        'activo', 'vendido', 'muerto', 'descartado', 'perdido', 'en_cuarentena'
    )),
    proposito TEXT CHECK (proposito IN (
        'carne', 'leche', 'doble_proposito', 'cria', 'engorda',
        'lana', 'pie_de_cria', 'trabajo', 'otro'
    )),
    madre_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    padre_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    numero_registro TEXT,
    foto_url TEXT,
    notas TEXT,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    fecha_salida DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (rancho_id, identificador)
);

CREATE INDEX idx_animales_rancho ON animales(rancho_id);
CREATE INDEX idx_animales_corral ON animales(corral_id);
CREATE INDEX idx_animales_especie ON animales(especie);
CREATE INDEX idx_animales_estado ON animales(estado);
CREATE INDEX idx_animales_sexo ON animales(sexo);
CREATE INDEX idx_animales_raza ON animales(raza);
CREATE INDEX idx_animales_madre ON animales(madre_id);
CREATE INDEX idx_animales_padre ON animales(padre_id);
CREATE INDEX idx_animales_deleted_at ON animales(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 6. lotes - Batch lots (poultry, rabbits, etc.)
-- ============================================================================
CREATE TABLE lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    corral_id UUID REFERENCES corrales(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    especie TEXT NOT NULL CHECK (especie IN ('avicola', 'cunicola', 'otro')),
    proposito TEXT CHECK (proposito IN ('huevo', 'carne', 'doble_proposito', 'pie_de_cria', 'otro')),
    raza TEXT,
    cantidad_inicial INTEGER NOT NULL CHECK (cantidad_inicial > 0),
    cantidad_actual INTEGER NOT NULL CHECK (cantidad_actual >= 0),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    edad_ingreso_dias INTEGER,
    estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado', 'descartado')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_lotes_rancho ON lotes(rancho_id);
CREATE INDEX idx_lotes_corral ON lotes(corral_id);
CREATE INDEX idx_lotes_especie ON lotes(especie);
CREATE INDEX idx_lotes_estado ON lotes(estado);

-- ============================================================================
-- 7. produccion_lotes - Daily lot production records
-- ============================================================================
CREATE TABLE produccion_lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo TEXT NOT NULL CHECK (tipo IN ('huevo', 'carne_kg', 'mortalidad', 'descarte', 'otro')),
    cantidad NUMERIC(10,2) NOT NULL,
    unidad TEXT DEFAULT 'unidad' CHECK (unidad IN ('unidad', 'kg', 'litro', 'otro')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_produccion_lotes_lote ON produccion_lotes(lote_id);
CREATE INDEX idx_produccion_lotes_rancho ON produccion_lotes(rancho_id);
CREATE INDEX idx_produccion_lotes_fecha ON produccion_lotes(fecha);
CREATE INDEX idx_produccion_lotes_tipo ON produccion_lotes(tipo);

-- ============================================================================
-- 8. apiarios - Apiaries with geolocation
-- ============================================================================
CREATE TABLE apiarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    altitud_m NUMERIC(7,2),
    tipo_vegetacion TEXT,
    cantidad_colmenas INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_apiarios_rancho ON apiarios(rancho_id);
CREATE INDEX idx_apiarios_activo ON apiarios(activo) WHERE activo = TRUE;

-- ============================================================================
-- 9. colmenas - Individual hives
-- ============================================================================
CREATE TABLE colmenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiario_id UUID NOT NULL REFERENCES apiarios(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    identificador TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('langstroth', 'jumbo', 'africana', 'tecnificada', 'rustica', 'otro')),
    estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN (
        'activa', 'debil', 'huerfana', 'muerta', 'fusionada', 'vendida'
    )),
    tiene_reina BOOLEAN DEFAULT TRUE,
    color_reina TEXT,
    fecha_ultima_revision DATE,
    marcos_total INTEGER,
    marcos_cria INTEGER,
    marcos_miel INTEGER,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (apiario_id, identificador)
);

CREATE INDEX idx_colmenas_apiario ON colmenas(apiario_id);
CREATE INDEX idx_colmenas_rancho ON colmenas(rancho_id);
CREATE INDEX idx_colmenas_estado ON colmenas(estado);

-- ============================================================================
-- 10. revisiones_colmena - Hive inspection records
-- ============================================================================
CREATE TABLE revisiones_colmena (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colmena_id UUID NOT NULL REFERENCES colmenas(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    tiene_reina BOOLEAN,
    postura TEXT CHECK (postura IN ('buena', 'regular', 'mala', 'sin_postura')),
    temperamento TEXT CHECK (temperamento IN ('docil', 'moderado', 'agresivo')),
    marcos_cria INTEGER,
    marcos_miel INTEGER,
    marcos_polen INTEGER,
    presencia_plagas BOOLEAN DEFAULT FALSE,
    tipo_plaga TEXT,
    tratamiento_aplicado TEXT,
    estado_general TEXT CHECK (estado_general IN ('fuerte', 'media', 'debil', 'critica')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_revisiones_colmena_colmena ON revisiones_colmena(colmena_id);
CREATE INDEX idx_revisiones_colmena_rancho ON revisiones_colmena(rancho_id);
CREATE INDEX idx_revisiones_colmena_fecha ON revisiones_colmena(fecha);

-- ============================================================================
-- 11. cosechas_miel - Honey harvest records
-- ============================================================================
CREATE TABLE cosechas_miel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colmena_id UUID REFERENCES colmenas(id) ON DELETE SET NULL,
    apiario_id UUID NOT NULL REFERENCES apiarios(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    cantidad_kg NUMERIC(8,2) NOT NULL CHECK (cantidad_kg > 0),
    tipo_miel TEXT,
    marcos_cosechados INTEGER,
    calidad TEXT CHECK (calidad IN ('premium', 'primera', 'segunda', 'industrial')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cosechas_miel_apiario ON cosechas_miel(apiario_id);
CREATE INDEX idx_cosechas_miel_rancho ON cosechas_miel(rancho_id);
CREATE INDEX idx_cosechas_miel_fecha ON cosechas_miel(fecha);
CREATE INDEX idx_cosechas_miel_colmena ON cosechas_miel(colmena_id);

-- ============================================================================
-- 12. divisiones_colmena - Hive division records
-- ============================================================================
CREATE TABLE divisiones_colmena (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colmena_origen_id UUID NOT NULL REFERENCES colmenas(id) ON DELETE CASCADE,
    colmena_nueva_id UUID REFERENCES colmenas(id) ON DELETE SET NULL,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    metodo TEXT CHECK (metodo IN ('natural', 'artificial', 'nucleo')),
    marcos_transferidos INTEGER,
    tiene_reina_nueva BOOLEAN DEFAULT FALSE,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_divisiones_colmena_origen ON divisiones_colmena(colmena_origen_id);
CREATE INDEX idx_divisiones_colmena_rancho ON divisiones_colmena(rancho_id);
CREATE INDEX idx_divisiones_colmena_fecha ON divisiones_colmena(fecha);

-- ============================================================================
-- 13. floraciones - Flowering seasons
-- ============================================================================
CREATE TABLE floraciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    apiario_id UUID REFERENCES apiarios(id) ON DELETE SET NULL,
    nombre_planta TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('nectar', 'polen', 'mixta')),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    intensidad TEXT CHECK (intensidad IN ('alta', 'media', 'baja')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_floraciones_rancho ON floraciones(rancho_id);
CREATE INDEX idx_floraciones_apiario ON floraciones(apiario_id);
CREATE INDEX idx_floraciones_fechas ON floraciones(fecha_inicio, fecha_fin);

-- ============================================================================
-- 14. pesajes - Weight records
-- ============================================================================
CREATE TABLE pesajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    peso_kg NUMERIC(8,2) NOT NULL CHECK (peso_kg > 0),
    tipo TEXT DEFAULT 'rutina' CHECK (tipo IN (
        'nacimiento', 'destete', 'rutina', 'venta', 'compra', 'otro'
    )),
    ganancia_diaria_kg NUMERIC(6,3),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pesajes_animal ON pesajes(animal_id);
CREATE INDEX idx_pesajes_rancho ON pesajes(rancho_id);
CREATE INDEX idx_pesajes_fecha ON pesajes(fecha);
CREATE INDEX idx_pesajes_tipo ON pesajes(tipo);

-- ============================================================================
-- 15. eventos_reproductivos - Reproductive events
-- ============================================================================
CREATE TABLE eventos_reproductivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'celo', 'monta_natural', 'inseminacion', 'diagnostico_gestacion',
        'parto', 'aborto', 'destete', 'secado', 'otro'
    )),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    resultado TEXT CHECK (resultado IN ('positivo', 'negativo', 'pendiente')),
    macho_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    toro_semen TEXT,
    numero_crias INTEGER,
    dias_gestacion INTEGER,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_eventos_repro_animal ON eventos_reproductivos(animal_id);
CREATE INDEX idx_eventos_repro_rancho ON eventos_reproductivos(rancho_id);
CREATE INDEX idx_eventos_repro_tipo ON eventos_reproductivos(tipo);
CREATE INDEX idx_eventos_repro_fecha ON eventos_reproductivos(fecha);
CREATE INDEX idx_eventos_repro_macho ON eventos_reproductivos(macho_id);

-- ============================================================================
-- 16. crias - Offspring from births
-- ============================================================================
CREATE TABLE crias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_reproductivo_id UUID NOT NULL REFERENCES eventos_reproductivos(id) ON DELETE CASCADE,
    animal_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    sexo TEXT NOT NULL CHECK (sexo IN ('macho', 'hembra')),
    peso_nacimiento NUMERIC(6,2),
    estado TEXT NOT NULL DEFAULT 'vivo' CHECK (estado IN ('vivo', 'muerto', 'momificado', 'debil')),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_crias_evento ON crias(evento_reproductivo_id);
CREATE INDEX idx_crias_animal ON crias(animal_id);
CREATE INDEX idx_crias_rancho ON crias(rancho_id);

-- ============================================================================
-- 17. eventos_sanitarios - Health events
-- ============================================================================
CREATE TABLE eventos_sanitarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animales(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'vacunacion', 'desparasitacion', 'curacion', 'cirugia',
        'diagnostico', 'tratamiento', 'prueba_laboratorio', 'otro'
    )),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    producto TEXT,
    dosis TEXT,
    via_administracion TEXT CHECK (via_administracion IN (
        'oral', 'intramuscular', 'subcutanea', 'intravenosa',
        'topica', 'intramamaria', 'otro'
    )),
    diagnostico TEXT,
    veterinario TEXT,
    periodo_retiro_dias INTEGER,
    costo NUMERIC(10,2),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (animal_id IS NOT NULL OR lote_id IS NOT NULL)
);

CREATE INDEX idx_eventos_sanit_animal ON eventos_sanitarios(animal_id);
CREATE INDEX idx_eventos_sanit_lote ON eventos_sanitarios(lote_id);
CREATE INDEX idx_eventos_sanit_rancho ON eventos_sanitarios(rancho_id);
CREATE INDEX idx_eventos_sanit_tipo ON eventos_sanitarios(tipo);
CREATE INDEX idx_eventos_sanit_fecha ON eventos_sanitarios(fecha);

-- ============================================================================
-- 18. campanas_sanitarias - Health campaigns
-- ============================================================================
CREATE TABLE campanas_sanitarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'vacunacion', 'desparasitacion', 'prueba_diagnostica', 'otro'
    )),
    producto TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    especies_objetivo TEXT[] DEFAULT '{}',
    total_animales INTEGER DEFAULT 0,
    animales_aplicados INTEGER DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'planificada' CHECK (estado IN (
        'planificada', 'en_progreso', 'completada', 'cancelada'
    )),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campanas_sanit_rancho ON campanas_sanitarias(rancho_id);
CREATE INDEX idx_campanas_sanit_estado ON campanas_sanitarias(estado);
CREATE INDEX idx_campanas_sanit_tipo ON campanas_sanitarias(tipo);
CREATE INDEX idx_campanas_sanit_fechas ON campanas_sanitarias(fecha_inicio, fecha_fin);

-- ============================================================================
-- 19. inventario_alimento - Feed inventory
-- ============================================================================
CREATE TABLE inventario_alimento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'forraje', 'concentrado', 'mineral', 'suplemento',
        'grano', 'ensilaje', 'heno', 'otro'
    )),
    unidad TEXT NOT NULL DEFAULT 'kg' CHECK (unidad IN ('kg', 'tonelada', 'bulto', 'litro', 'otro')),
    cantidad_actual NUMERIC(12,2) NOT NULL DEFAULT 0,
    cantidad_minima NUMERIC(12,2) DEFAULT 0,
    costo_unitario NUMERIC(10,2),
    proveedor TEXT,
    fecha_caducidad DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_inventario_alimento_rancho ON inventario_alimento(rancho_id);
CREATE INDEX idx_inventario_alimento_tipo ON inventario_alimento(tipo);
CREATE INDEX idx_inventario_alimento_activo ON inventario_alimento(activo) WHERE activo = TRUE;

-- ============================================================================
-- 20. consumo_alimento - Feed consumption
-- ============================================================================
CREATE TABLE consumo_alimento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventario_alimento_id UUID NOT NULL REFERENCES inventario_alimento(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    corral_id UUID REFERENCES corrales(id) ON DELETE SET NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    cantidad NUMERIC(10,2) NOT NULL CHECK (cantidad > 0),
    costo_total NUMERIC(10,2),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consumo_alimento_inventario ON consumo_alimento(inventario_alimento_id);
CREATE INDEX idx_consumo_alimento_rancho ON consumo_alimento(rancho_id);
CREATE INDEX idx_consumo_alimento_corral ON consumo_alimento(corral_id);
CREATE INDEX idx_consumo_alimento_fecha ON consumo_alimento(fecha);

-- ============================================================================
-- 21. produccion_leche - Milk production
-- ============================================================================
CREATE TABLE produccion_leche (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    turno TEXT DEFAULT 'manana' CHECK (turno IN ('manana', 'tarde', 'noche', 'total_dia')),
    litros NUMERIC(8,2) NOT NULL CHECK (litros >= 0),
    grasa_porcentaje NUMERIC(4,2),
    proteina_porcentaje NUMERIC(4,2),
    celulas_somaticas INTEGER,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_produccion_leche_animal ON produccion_leche(animal_id);
CREATE INDEX idx_produccion_leche_rancho ON produccion_leche(rancho_id);
CREATE INDEX idx_produccion_leche_fecha ON produccion_leche(fecha);
CREATE INDEX idx_produccion_leche_turno ON produccion_leche(turno);

-- ============================================================================
-- 22. movimientos_economicos - Financial movements
-- ============================================================================
CREATE TABLE movimientos_economicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    categoria TEXT NOT NULL CHECK (categoria IN (
        'venta_animal', 'compra_animal', 'venta_leche', 'venta_huevo',
        'venta_miel', 'venta_lana', 'venta_otro_producto',
        'alimento', 'medicamento', 'insumos', 'mano_obra',
        'transporte', 'mantenimiento', 'servicios',
        'subsidio', 'credito', 'otro'
    )),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    monto NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    descripcion TEXT,
    animal_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    comprobante_url TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mov_econ_rancho ON movimientos_economicos(rancho_id);
CREATE INDEX idx_mov_econ_tipo ON movimientos_economicos(tipo);
CREATE INDEX idx_mov_econ_categoria ON movimientos_economicos(categoria);
CREATE INDEX idx_mov_econ_fecha ON movimientos_economicos(fecha);
CREATE INDEX idx_mov_econ_animal ON movimientos_economicos(animal_id);

-- ============================================================================
-- 23. movimientos_ganado - Livestock movements/traceability
-- ============================================================================
CREATE TABLE movimientos_ganado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animales(id) ON DELETE SET NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'ingreso', 'egreso', 'nacimiento', 'muerte',
        'compra', 'venta', 'transferencia', 'decomiso', 'otro'
    )),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    origen TEXT,
    destino TEXT,
    rancho_origen_id UUID REFERENCES ranchos(id) ON DELETE SET NULL,
    rancho_destino_id UUID REFERENCES ranchos(id) ON DELETE SET NULL,
    guia_transporte TEXT,
    certificado_sanitario TEXT,
    cantidad INTEGER DEFAULT 1,
    peso_total_kg NUMERIC(10,2),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mov_ganado_animal ON movimientos_ganado(animal_id);
CREATE INDEX idx_mov_ganado_lote ON movimientos_ganado(lote_id);
CREATE INDEX idx_mov_ganado_rancho ON movimientos_ganado(rancho_id);
CREATE INDEX idx_mov_ganado_tipo ON movimientos_ganado(tipo);
CREATE INDEX idx_mov_ganado_fecha ON movimientos_ganado(fecha);

-- ============================================================================
-- 24. movimientos_corral - Pen transfers
-- ============================================================================
CREATE TABLE movimientos_corral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animales(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    corral_origen_id UUID REFERENCES corrales(id) ON DELETE SET NULL,
    corral_destino_id UUID NOT NULL REFERENCES corrales(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    motivo TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (animal_id IS NOT NULL OR lote_id IS NOT NULL)
);

CREATE INDEX idx_mov_corral_animal ON movimientos_corral(animal_id);
CREATE INDEX idx_mov_corral_lote ON movimientos_corral(lote_id);
CREATE INDEX idx_mov_corral_rancho ON movimientos_corral(rancho_id);
CREATE INDEX idx_mov_corral_fecha ON movimientos_corral(fecha);

-- ============================================================================
-- 25. alertas - Alerts and notifications
-- ============================================================================
CREATE TABLE alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'sanitaria', 'reproductiva', 'alimentacion', 'inventario',
        'economica', 'clima', 'vencimiento', 'campana',
        'produccion', 'general'
    )),
    prioridad TEXT NOT NULL DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
    titulo TEXT NOT NULL,
    mensaje TEXT,
    entidad_tipo TEXT,
    entidad_id UUID,
    leida BOOLEAN DEFAULT FALSE,
    fecha_programada TIMESTAMPTZ,
    fecha_leida TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alertas_rancho ON alertas(rancho_id);
CREATE INDEX idx_alertas_usuario ON alertas(usuario_id);
CREATE INDEX idx_alertas_tipo ON alertas(tipo);
CREATE INDEX idx_alertas_leida ON alertas(leida) WHERE leida = FALSE;
CREATE INDEX idx_alertas_fecha_programada ON alertas(fecha_programada);
CREATE INDEX idx_alertas_prioridad ON alertas(prioridad);

-- ============================================================================
-- 26. gobierno_usuarios - Government users
-- ============================================================================
CREATE TABLE gobierno_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    dependencia TEXT NOT NULL,
    cargo TEXT,
    clave_empleado TEXT,
    nivel TEXT CHECK (nivel IN ('federal', 'estatal', 'municipal')),
    estado TEXT,
    municipio TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gobierno_usuarios_usuario ON gobierno_usuarios(usuario_id);
CREATE INDEX idx_gobierno_usuarios_dependencia ON gobierno_usuarios(dependencia);
CREATE INDEX idx_gobierno_usuarios_nivel ON gobierno_usuarios(nivel);

-- ============================================================================
-- 27. programas_gobierno_admin - Government programs
-- ============================================================================
CREATE TABLE programas_gobierno_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gobierno_usuario_id UUID NOT NULL REFERENCES gobierno_usuarios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT CHECK (tipo IN ('subsidio', 'credito', 'asistencia_tecnica', 'capacitacion', 'otro')),
    presupuesto NUMERIC(14,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    especies_objetivo TEXT[] DEFAULT '{}',
    requisitos TEXT,
    estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'cerrado', 'suspendido', 'borrador')),
    max_beneficiarios INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_programas_gob_gobierno_usuario ON programas_gobierno_admin(gobierno_usuario_id);
CREATE INDEX idx_programas_gob_estado ON programas_gobierno_admin(estado);
CREATE INDEX idx_programas_gob_tipo ON programas_gobierno_admin(tipo);

-- ============================================================================
-- 28. programa_beneficiarios - Program beneficiaries
-- ============================================================================
CREATE TABLE programa_beneficiarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programa_id UUID NOT NULL REFERENCES programas_gobierno_admin(id) ON DELETE CASCADE,
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    estado TEXT NOT NULL DEFAULT 'solicitado' CHECK (estado IN (
        'solicitado', 'en_revision', 'aprobado', 'rechazado',
        'activo', 'completado', 'cancelado'
    )),
    monto_aprobado NUMERIC(12,2),
    monto_entregado NUMERIC(12,2),
    fecha_solicitud DATE DEFAULT CURRENT_DATE,
    fecha_aprobacion DATE,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (programa_id, rancho_id)
);

CREATE INDEX idx_prog_benef_programa ON programa_beneficiarios(programa_id);
CREATE INDEX idx_prog_benef_rancho ON programa_beneficiarios(rancho_id);
CREATE INDEX idx_prog_benef_usuario ON programa_beneficiarios(usuario_id);
CREATE INDEX idx_prog_benef_estado ON programa_beneficiarios(estado);

-- ============================================================================
-- 29. catalogos - Catalogs (breeds, vaccines, etc.)
-- ============================================================================
CREATE TABLE catalogos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN (
        'raza', 'vacuna', 'medicamento', 'alimento',
        'diagnostico', 'causa_muerte', 'unidad_medida', 'otro'
    )),
    especie TEXT,
    clave TEXT NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (tipo, clave)
);

CREATE INDEX idx_catalogos_tipo ON catalogos(tipo);
CREATE INDEX idx_catalogos_especie ON catalogos(especie);
CREATE INDEX idx_catalogos_activo ON catalogos(activo) WHERE activo = TRUE;
CREATE INDEX idx_catalogos_tipo_especie ON catalogos(tipo, especie);

-- ============================================================================
-- 30. activity_log - Audit log
-- ============================================================================
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    rancho_id UUID REFERENCES ranchos(id) ON DELETE SET NULL,
    accion TEXT NOT NULL CHECK (accion IN ('crear', 'actualizar', 'eliminar', 'login', 'logout', 'otro')),
    entidad_tipo TEXT NOT NULL,
    entidad_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_usuario ON activity_log(usuario_id);
CREATE INDEX idx_activity_log_rancho ON activity_log(rancho_id);
CREATE INDEX idx_activity_log_accion ON activity_log(accion);
CREATE INDEX idx_activity_log_entidad ON activity_log(entidad_tipo, entidad_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- ============================================================================
-- 31. perfil_crediticio - Credit score profile
-- ============================================================================
CREATE TABLE perfil_crediticio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rancho_id UUID NOT NULL REFERENCES ranchos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    puntaje INTEGER DEFAULT 0 CHECK (puntaje >= 0 AND puntaje <= 1000),
    nivel TEXT DEFAULT 'sin_historial' CHECK (nivel IN (
        'sin_historial', 'bajo', 'medio', 'alto', 'excelente'
    )),
    total_animales INTEGER DEFAULT 0,
    valor_inventario NUMERIC(14,2) DEFAULT 0,
    ingresos_mensuales_promedio NUMERIC(12,2) DEFAULT 0,
    egresos_mensuales_promedio NUMERIC(12,2) DEFAULT 0,
    historial_sanitario_score NUMERIC(5,2) DEFAULT 0,
    historial_productivo_score NUMERIC(5,2) DEFAULT 0,
    anos_actividad INTEGER DEFAULT 0,
    creditos_obtenidos INTEGER DEFAULT 0,
    creditos_pagados INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMPTZ DEFAULT now(),
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (rancho_id, usuario_id)
);

CREATE INDEX idx_perfil_credit_rancho ON perfil_crediticio(rancho_id);
CREATE INDEX idx_perfil_credit_usuario ON perfil_crediticio(usuario_id);
CREATE INDEX idx_perfil_credit_nivel ON perfil_crediticio(nivel);
CREATE INDEX idx_perfil_credit_puntaje ON perfil_crediticio(puntaje);

-- ============================================================================
-- Trigger function: auto-update updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'perfiles', 'ranchos', 'rancho_usuarios', 'corrales',
            'animales', 'lotes', 'apiarios', 'colmenas',
            'campanas_sanitarias', 'inventario_alimento',
            'movimientos_economicos', 'gobierno_usuarios',
            'programas_gobierno_admin', 'programa_beneficiarios',
            'catalogos', 'perfil_crediticio'
        ])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()',
            tbl
        );
    END LOOP;
END;
$$;
