-- =============================================
-- HATOAI — SEED DATA (DEMO)
-- Rancho Santa Cruz — Tizimín, Yucatán
-- =============================================

-- Use fixed UUIDs for referencing between tables
-- Demo user ID (would be created via Supabase Auth)
-- Using a placeholder that can be replaced with a real auth.users id

DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  rancho_id UUID := '11111111-1111-1111-1111-111111111111';
  -- Corrales
  corral_bovinos_1 UUID := '22222222-2222-2222-2222-222222222201';
  corral_bovinos_2 UUID := '22222222-2222-2222-2222-222222222202';
  corral_porcinos UUID := '22222222-2222-2222-2222-222222222203';
  corral_ovinos UUID := '22222222-2222-2222-2222-222222222204';
  corral_equinos UUID := '22222222-2222-2222-2222-222222222205';
  galpon_aves_1 UUID := '22222222-2222-2222-2222-222222222206';
  galpon_aves_2 UUID := '22222222-2222-2222-2222-222222222207';
  -- Apiarios
  apiario_1 UUID := '33333333-3333-3333-3333-333333333301';
  apiario_2 UUID := '33333333-3333-3333-3333-333333333302';
  -- Lotes
  lote_aves_1 UUID := '44444444-4444-4444-4444-444444444401';
  lote_aves_2 UUID := '44444444-4444-4444-4444-444444444402';
  -- Animales (bovinos)
  bov_01 UUID := '55555555-5555-5555-5555-555555550101';
  bov_02 UUID := '55555555-5555-5555-5555-555555550102';
  bov_03 UUID := '55555555-5555-5555-5555-555555550103';
  bov_04 UUID := '55555555-5555-5555-5555-555555550104';
  bov_05 UUID := '55555555-5555-5555-5555-555555550105';
  bov_06 UUID := '55555555-5555-5555-5555-555555550106';
  bov_07 UUID := '55555555-5555-5555-5555-555555550107';
  bov_08 UUID := '55555555-5555-5555-5555-555555550108';
  bov_09 UUID := '55555555-5555-5555-5555-555555550109';
  bov_10 UUID := '55555555-5555-5555-5555-555555550110';
  bov_11 UUID := '55555555-5555-5555-5555-555555550111';
  bov_12 UUID := '55555555-5555-5555-5555-555555550112';
  -- Porcinos
  porc_01 UUID := '55555555-5555-5555-5555-555555550201';
  porc_02 UUID := '55555555-5555-5555-5555-555555550202';
  porc_03 UUID := '55555555-5555-5555-5555-555555550203';
  porc_04 UUID := '55555555-5555-5555-5555-555555550204';
  porc_05 UUID := '55555555-5555-5555-5555-555555550205';
  -- Ovinos
  ov_01 UUID := '55555555-5555-5555-5555-555555550301';
  ov_02 UUID := '55555555-5555-5555-5555-555555550302';
  ov_03 UUID := '55555555-5555-5555-5555-555555550303';
  ov_04 UUID := '55555555-5555-5555-5555-555555550304';
  -- Equinos
  eq_01 UUID := '55555555-5555-5555-5555-555555550401';
  eq_02 UUID := '55555555-5555-5555-5555-555555550402';
  -- Colmenas
  col_01 UUID := '66666666-6666-6666-6666-666666660101';
  col_02 UUID := '66666666-6666-6666-6666-666666660102';
  col_03 UUID := '66666666-6666-6666-6666-666666660103';
  col_04 UUID := '66666666-6666-6666-6666-666666660104';
  col_05 UUID := '66666666-6666-6666-6666-666666660201';
  col_06 UUID := '66666666-6666-6666-6666-666666660202';
  col_07 UUID := '66666666-6666-6666-6666-666666660203';
  -- Programa gobierno
  programa_id UUID := '77777777-7777-7777-7777-777777777701';
BEGIN

  -- ========== PERFIL DEMO ==========
  -- Note: In production, the user would be created via auth.users first.
  -- This inserts the profile assuming the auth user already exists.
  INSERT INTO perfiles (id, nombre, telefono, email, rol, onboarding_completado)
  VALUES (demo_user_id, 'Carlos Mendoza Pérez', '+529861234567', 'carlos.mendoza@example.com', 'productor', true)
  ON CONFLICT (id) DO NOTHING;

  -- ========== RANCHO ==========
  INSERT INTO ranchos (id, nombre, estado, municipio, direccion, ubicacion_lat, ubicacion_lng, superficie_ha, tipo_produccion, especies_activas, siniiga_upp)
  VALUES (
    rancho_id,
    'Rancho Santa Cruz',
    'Yucatán',
    'Tizimín',
    'Km 12 Carretera Tizimín-Colonia Yucatán',
    21.1428,
    -87.3910,
    85.5,
    'mixto',
    ARRAY['bovino', 'porcino', 'ovino', 'equino', 'ave', 'abeja'],
    'YUC-31-0892'
  )
  ON CONFLICT (id) DO NOTHING;

  -- ========== RANCHO USUARIOS ==========
  INSERT INTO rancho_usuarios (rancho_id, user_id, rol)
  VALUES (rancho_id, demo_user_id, 'propietario')
  ON CONFLICT (rancho_id, user_id) DO NOTHING;

  -- ========== CORRALES ==========
  INSERT INTO corrales (id, rancho_id, nombre, tipo, capacidad, superficie_ha, tipo_pasto, estado) VALUES
    (corral_bovinos_1, rancho_id, 'Potrero Norte', 'potrero', 30, 15.0, 'Estrella de África', 'activo'),
    (corral_bovinos_2, rancho_id, 'Potrero Sur', 'potrero', 25, 12.0, 'Guinea / Brizantha', 'activo'),
    (corral_porcinos, rancho_id, 'Porqueriza Principal', 'corral', 20, 0.5, NULL, 'activo'),
    (corral_ovinos, rancho_id, 'Aprisco Ovinos', 'corral', 15, 0.3, NULL, 'activo'),
    (corral_equinos, rancho_id, 'Caballeriza', 'establo', 6, 0.2, NULL, 'activo'),
    (galpon_aves_1, rancho_id, 'Galpón Ponedoras', 'galpon', 200, 0.1, NULL, 'activo'),
    (galpon_aves_2, rancho_id, 'Galpón Engorda', 'galpon', 150, 0.08, NULL, 'activo');

  -- ========== BOVINOS (12) ==========
  INSERT INTO animales (id, rancho_id, numero_arete, id_siniiga, nombre, especie, sexo, categoria, raza, color, fecha_nacimiento, corral_id, peso_actual, estado, estado_reproductivo, estado_sanitario, origen) VALUES
    (bov_01, rancho_id, 'BOV-001', 'MX-YUC-001234', 'Lucero', 'bovino', 'macho', 'semental', 'Brahman', 'Blanco', '2021-03-15', corral_bovinos_1, 780, 'activo', 'semental_activo', 'sano', 'compra'),
    (bov_02, rancho_id, 'BOV-002', 'MX-YUC-001235', 'Estrella', 'bovino', 'hembra', 'vaca', 'Gyr x Brahman', 'Gris', '2020-06-20', corral_bovinos_1, 520, 'activo', 'gestante', 'sano', 'nacido_en_rancho'),
    (bov_03, rancho_id, 'BOV-003', 'MX-YUC-001236', 'Mariposa', 'bovino', 'hembra', 'vaca', 'Suizo x Brahman', 'Bayo', '2020-09-10', corral_bovinos_1, 490, 'activo', 'lactando', 'sano', 'nacido_en_rancho'),
    (bov_04, rancho_id, 'BOV-004', 'MX-YUC-001237', 'Canela', 'bovino', 'hembra', 'vaca', 'Brahman', 'Rojo', '2019-12-01', corral_bovinos_1, 540, 'activo', 'vacia', 'sano', 'compra'),
    (bov_05, rancho_id, 'BOV-005', 'MX-YUC-001238', 'Luna', 'bovino', 'hembra', 'vaca', 'Gyr', 'Blanco moteado', '2021-01-18', corral_bovinos_2, 470, 'activo', 'gestante', 'sano', 'nacido_en_rancho'),
    (bov_06, rancho_id, 'BOV-006', 'MX-YUC-001239', 'Paloma', 'bovino', 'hembra', 'vaca', 'Brahman', 'Blanco', '2020-04-05', corral_bovinos_2, 510, 'activo', 'lactando', 'sano', 'nacido_en_rancho'),
    (bov_07, rancho_id, 'BOV-007', 'MX-YUC-001240', 'Tormenta', 'bovino', 'hembra', 'novilla', 'Suizo x Brahman', 'Pardo', '2023-02-14', corral_bovinos_2, 380, 'activo', 'vacia', 'sano', 'nacido_en_rancho'),
    (bov_08, rancho_id, 'BOV-008', 'MX-YUC-001241', 'Relámpago', 'bovino', 'macho', 'becerro', 'Brahman', 'Blanco', '2025-05-20', corral_bovinos_1, 180, 'activo', NULL, 'sano', 'nacido_en_rancho'),
    (bov_09, rancho_id, 'BOV-009', 'MX-YUC-001242', 'Rocío', 'bovino', 'hembra', 'becerra', 'Gyr x Brahman', 'Gris', '2025-06-10', corral_bovinos_1, 165, 'activo', NULL, 'sano', 'nacido_en_rancho'),
    (bov_10, rancho_id, 'BOV-010', 'MX-YUC-001243', 'Diamante', 'bovino', 'hembra', 'vaca', 'Brahman', 'Blanco', '2019-08-22', corral_bovinos_2, 530, 'activo', 'gestante', 'sano', 'compra'),
    (bov_11, rancho_id, 'BOV-011', 'MX-YUC-001244', 'Chaparro', 'bovino', 'macho', 'torete', 'Brahman x Angus', 'Negro', '2024-01-08', corral_bovinos_2, 320, 'activo', NULL, 'sano', 'nacido_en_rancho'),
    (bov_12, rancho_id, 'BOV-012', 'MX-YUC-001245', 'Nube', 'bovino', 'hembra', 'vaca', 'Gyr', 'Rojo', '2020-11-30', corral_bovinos_1, 485, 'activo', 'vacia', 'sano', 'nacido_en_rancho');

  -- ========== PORCINOS (5) ==========
  INSERT INTO animales (id, rancho_id, numero_arete, nombre, especie, sexo, categoria, raza, color, fecha_nacimiento, corral_id, peso_actual, estado, estado_reproductivo, estado_sanitario, origen) VALUES
    (porc_01, rancho_id, 'POR-001', 'Manchas', 'porcino', 'macho', 'semental', 'Hampshire x Yorkshire', 'Negro con faja blanca', '2023-04-10', corral_porcinos, 180, 'activo', 'semental_activo', 'sano', 'compra'),
    (porc_02, rancho_id, 'POR-002', 'Rosa', 'porcino', 'hembra', 'cerda_reproductora', 'Yorkshire', 'Blanco', '2023-01-20', corral_porcinos, 150, 'activo', 'gestante', 'sano', 'compra'),
    (porc_03, rancho_id, 'POR-003', 'Lola', 'porcino', 'hembra', 'cerda_reproductora', 'Landrace', 'Blanco', '2023-03-05', corral_porcinos, 145, 'activo', 'lactando', 'sano', 'compra'),
    (porc_04, rancho_id, 'POR-004', 'Gordo', 'porcino', 'macho', 'engorda', 'Hampshire x Landrace', 'Negro con faja blanca', '2025-08-15', corral_porcinos, 75, 'activo', NULL, 'sano', 'nacido_en_rancho'),
    (porc_05, rancho_id, 'POR-005', 'Chiqui', 'porcino', 'hembra', 'engorda', 'Yorkshire x Landrace', 'Blanco', '2025-08-15', corral_porcinos, 70, 'activo', NULL, 'sano', 'nacido_en_rancho');

  -- ========== OVINOS (4) ==========
  INSERT INTO animales (id, rancho_id, numero_arete, nombre, especie, sexo, categoria, raza, color, fecha_nacimiento, corral_id, peso_actual, estado, estado_reproductivo, estado_sanitario, origen) VALUES
    (ov_01, rancho_id, 'OVI-001', 'Borrego', 'ovino', 'macho', 'semental', 'Pelibuey', 'Canela', '2022-06-10', corral_ovinos, 65, 'activo', 'semental_activo', 'sano', 'compra'),
    (ov_02, rancho_id, 'OVI-002', 'Blanca', 'ovino', 'hembra', 'oveja', 'Pelibuey', 'Blanco', '2022-09-15', corral_ovinos, 45, 'activo', 'gestante', 'sano', 'compra'),
    (ov_03, rancho_id, 'OVI-003', 'Negra', 'ovino', 'hembra', 'oveja', 'Blackbelly', 'Negro', '2023-01-20', corral_ovinos, 42, 'activo', 'vacia', 'sano', 'nacido_en_rancho'),
    (ov_04, rancho_id, 'OVI-004', 'Cordero1', 'ovino', 'macho', 'cordero', 'Pelibuey x Blackbelly', 'Canela oscuro', '2025-10-05', corral_ovinos, 18, 'activo', NULL, 'sano', 'nacido_en_rancho');

  -- ========== EQUINOS (2) ==========
  INSERT INTO animales (id, rancho_id, numero_arete, nombre, especie, sexo, categoria, raza, color, fecha_nacimiento, corral_id, peso_actual, estado, uso_equido, alzada_cm, prueba_aie_vigente, estado_sanitario, origen) VALUES
    (eq_01, rancho_id, 'EQU-001', 'Trueno', 'equino', 'macho', 'caballo', 'Cuarto de Milla x Criollo', 'Alazán', '2019-05-10', corral_equinos, 450, 'activo', 'trabajo_campo', 152, true, 'sano', 'compra'),
    (eq_02, rancho_id, 'EQU-002', 'Yegua Linda', 'equino', 'hembra', 'yegua', 'Criollo', 'Bayo', '2020-08-22', corral_equinos, 380, 'activo', 'trabajo_campo', 145, true, 'sano', 'compra');

  -- ========== LOTES DE AVES (2) ==========
  INSERT INTO lotes (id, rancho_id, nombre, especie, tipo, especie_ave, raza, cantidad_inicial, cantidad_actual, fecha_ingreso, edad_ingreso_semanas, galpon_id, proveedor, costo_por_unidad, estado) VALUES
    (lote_aves_1, rancho_id, 'Ponedoras L-01', 'ave', 'postura', 'gallina', 'Hy-Line Brown', 120, 115, '2025-06-01', 18, galpon_aves_1, 'Avícola del Sureste', 85.00, 'activo'),
    (lote_aves_2, rancho_id, 'Engorda L-01', 'ave', 'engorda', 'pollo', 'Ross 308', 100, 95, '2026-02-10', 1, galpon_aves_2, 'Avícola del Sureste', 18.50, 'activo');

  -- ========== APIARIOS (2) ==========
  INSERT INTO apiarios (id, rancho_id, nombre, ubicacion_lat, ubicacion_lng, ubicacion_referencia, municipio, vegetacion_predominante, distancia_agua, tipo_acceso, num_colmenas, certificacion_organica) VALUES
    (apiario_1, rancho_id, 'Apiario El Ramonal', 21.1520, -87.3800, 'A 2 km del casco del rancho, junto al ramonal', 'Tizimín', ARRAY['ramón', 'tajonal', 'tsíitsilché'], '200m - aguada natural', 'terracería', 4, false),
    (apiario_2, rancho_id, 'Apiario Dzidzilché', 21.1380, -87.4050, 'Parcela norte, cerca del cenote', 'Tizimín', ARRAY['dzidzilché', 'jabín', 'chakah'], '50m - cenote', 'brecha', 3, true);

  -- ========== COLMENAS (7 total: 4 + 3) ==========
  INSERT INTO colmenas (id, apiario_id, rancho_id, numero, tipo, especie_abeja, num_cuerpos, raza_reina, color_marcaje_reina, edad_reina_meses, fecha_instalacion, estado, fortaleza) VALUES
    (col_01, apiario_1, rancho_id, 'COL-001', 'langstroth', 'apis_mellifera', 2, 'Italiana', 'azul', 10, '2025-03-15', 'activa', 'fuerte'),
    (col_02, apiario_1, rancho_id, 'COL-002', 'langstroth', 'apis_mellifera', 2, 'Italiana', 'azul', 10, '2025-03-15', 'activa', 'fuerte'),
    (col_03, apiario_1, rancho_id, 'COL-003', 'langstroth', 'apis_mellifera', 1, 'Carniola', 'blanco', 6, '2025-08-20', 'activa', 'media'),
    (col_04, apiario_1, rancho_id, 'COL-004', 'langstroth', 'apis_mellifera', 2, 'Italiana', 'azul', 14, '2025-01-10', 'activa', 'fuerte'),
    (col_05, apiario_2, rancho_id, 'COL-005', 'langstroth', 'apis_mellifera', 2, 'Italiana', 'verde', 8, '2025-05-01', 'activa', 'fuerte'),
    (col_06, apiario_2, rancho_id, 'COL-006', 'langstroth', 'apis_mellifera', 1, 'Carniola', 'verde', 8, '2025-05-01', 'activa', 'media'),
    (col_07, apiario_2, rancho_id, 'COL-007', 'langstroth', 'melipona_beecheii', 1, NULL, NULL, NULL, '2025-07-10', 'activa', 'media');

  -- ========== PROGRAMA GOBIERNO ==========
  INSERT INTO programas_gobierno (id, nombre, dependencia, descripcion, estado, municipios, fecha_inicio, fecha_fin, presupuesto, meta_ranchos, meta_cabezas, meta_inseminaciones, meta_sementales, meta_colmenas, responsable, tipo, licencias_compradas)
  VALUES (
    programa_id,
    'Renacer Ganadero 2026',
    'Secretaría de Desarrollo Rural de Yucatán',
    'Programa integral para el fortalecimiento de la ganadería en el oriente de Yucatán. Incluye entrega de sementales, inseminación artificial, kits apícolas y acceso a la plataforma HatoAI.',
    'Yucatán',
    ARRAY['Tizimín', 'Temozón', 'Calotmul', 'Sucilá', 'Panabá', 'Río Lagartos', 'San Felipe'],
    '2026-01-15',
    '2026-12-31',
    8500000.00,
    250,
    5000,
    800,
    50,
    1000,
    'Ing. María del Carmen Góngora Ávila',
    'integral',
    300
  );

  -- ========== PROGRAMA RANCHOS (enroll demo ranch) ==========
  INSERT INTO programa_ranchos (programa_id, rancho_id, fecha_inscripcion, tipo_apoyo, monto_apoyo, animales_entregados, compromiso, licencia_activa, fecha_activacion_licencia, ultimo_login, estado)
  VALUES (
    programa_id,
    rancho_id,
    '2026-02-01',
    'semental_bovino + kit_apicola + licencia_hatoai',
    35000.00,
    1,
    'Mantener semental en servicio 2 años, registrar datos en HatoAI mensualmente',
    true,
    '2026-02-15',
    '2026-03-28',
    'activo'
  );

  -- ========== SAMPLE PESAJES ==========
  INSERT INTO pesajes (animal_id, rancho_id, fecha, peso, metodo, condicion_corporal) VALUES
    (bov_01, rancho_id, '2026-01-15', 770, 'bascula', 3.5),
    (bov_01, rancho_id, '2026-03-15', 780, 'bascula', 3.5),
    (bov_08, rancho_id, '2025-12-01', 140, 'bascula', 3.0),
    (bov_08, rancho_id, '2026-01-15', 158, 'bascula', 3.0),
    (bov_08, rancho_id, '2026-03-15', 180, 'bascula', 3.0);

  -- ========== SAMPLE PRODUCCION LECHE ==========
  INSERT INTO produccion_leche (animal_id, rancho_id, fecha, litros_am, litros_pm, litros_total) VALUES
    (bov_03, rancho_id, '2026-03-27', 4.5, 3.8, 8.3),
    (bov_03, rancho_id, '2026-03-28', 4.2, 3.5, 7.7),
    (bov_06, rancho_id, '2026-03-27', 5.0, 4.2, 9.2),
    (bov_06, rancho_id, '2026-03-28', 4.8, 4.0, 8.8);

  -- ========== SAMPLE EVENTOS SANITARIOS ==========
  INSERT INTO eventos_sanitarios (animal_id, rancho_id, fecha, tipo, campana, producto, via, veterinario) VALUES
    (bov_01, rancho_id, '2026-01-20', 'vacunacion', 'Brucela 2026', 'RB-51', 'subcutánea', 'MVZ Juan Carlos Pech'),
    (bov_02, rancho_id, '2026-01-20', 'vacunacion', 'Brucela 2026', 'RB-51', 'subcutánea', 'MVZ Juan Carlos Pech'),
    (porc_01, rancho_id, '2026-02-10', 'desparasitacion', NULL, 'Ivermectina 1%', 'subcutánea', 'MVZ Juan Carlos Pech');

  -- ========== SAMPLE MOVIMIENTOS ECONOMICOS ==========
  INSERT INTO movimientos_economicos (rancho_id, tipo, categoria, subcategoria, monto, descripcion, fecha) VALUES
    (rancho_id, 'ingreso', 'venta_leche', 'leche_cruda', 2800.00, 'Venta semanal de leche a quesería local', '2026-03-22'),
    (rancho_id, 'ingreso', 'venta_huevo', 'huevo_fresco', 1200.00, 'Venta de huevo de la semana', '2026-03-22'),
    (rancho_id, 'egreso', 'alimento', 'concentrado_bovino', 3500.00, 'Compra de 1 tonelada de concentrado bovino', '2026-03-10'),
    (rancho_id, 'egreso', 'alimento', 'alimento_aves', 1800.00, 'Alimento para ponedoras y engorda', '2026-03-10'),
    (rancho_id, 'ingreso', 'programa_gobierno', 'apoyo_semental', 25000.00, 'Valor del semental entregado por Renacer Ganadero', '2026-02-15'),
    (rancho_id, 'egreso', 'veterinario', 'vacunacion', 650.00, 'Campaña de vacunación brucela', '2026-01-20');

  -- ========== SAMPLE PRODUCCION LOTES ==========
  INSERT INTO produccion_lotes (lote_id, rancho_id, fecha, huevos_totales, huevos_rotos, huevos_sucios, huevos_vendibles, alimento_consumido_kg, mortalidad_dia) VALUES
    (lote_aves_1, rancho_id, '2026-03-27', 98, 2, 3, 93, 13.5, 0),
    (lote_aves_1, rancho_id, '2026-03-28', 101, 1, 2, 98, 13.8, 0);

  -- ========== SAMPLE COSECHAS MIEL ==========
  INSERT INTO cosechas_miel (apiario_id, rancho_id, fecha, alzas_cosechadas, kg_miel_bruto, kg_miel_neto, tipo_floral, humedad_pct, color, calidad) VALUES
    (apiario_1, rancho_id, '2025-12-10', 6, 95, 88, 'tajonal', 18.5, 'ámbar claro', 'primera'),
    (apiario_2, rancho_id, '2025-12-15', 4, 62, 57, 'dzidzilché', 17.8, 'ámbar extra claro', 'primera');

  -- ========== SAMPLE ALERTAS ==========
  INSERT INTO alertas (rancho_id, animal_id, tipo, mensaje, prioridad, leida, fecha_alerta, accion_sugerida) VALUES
    (rancho_id, bov_02, 'parto_proximo', 'Estrella (BOV-002) tiene parto esperado en los próximos 15 días', 'alta', false, '2026-04-05', 'Preparar área de parto y monitorear signos de parto'),
    (rancho_id, bov_05, 'parto_proximo', 'Luna (BOV-005) tiene parto esperado en los próximos 30 días', 'media', false, '2026-04-20', 'Programar revisión prenatal'),
    (rancho_id, NULL, 'inventario_bajo', 'El inventario de concentrado bovino está por debajo del mínimo', 'alta', false, '2026-03-28', 'Realizar pedido de concentrado'),
    (rancho_id, NULL, 'vacunacion_pendiente', 'Campaña de tuberculina pendiente para el hato bovino', 'media', false, '2026-04-01', 'Coordinar con MVZ para prueba de tuberculina');

  -- ========== INVENTARIO ALIMENTOS ==========
  INSERT INTO inventario_alimentos (rancho_id, tipo, nombre, marca, proteina_pct, cantidad_actual_kg, costo_por_kg, proveedor) VALUES
    (rancho_id, 'concentrado', 'Concentrado Bovino 18%', 'Purina', 18.0, 350, 8.50, 'Forrajera Tizimín'),
    (rancho_id, 'concentrado', 'Alimento Ponedoras', 'Malta Cleyton', 16.0, 200, 9.20, 'Avícola del Sureste'),
    (rancho_id, 'concentrado', 'Iniciador Pollo Engorda', 'Purina', 22.0, 180, 10.50, 'Avícola del Sureste'),
    (rancho_id, 'mineral', 'Sales Minerales Bovinas', 'Pisa', NULL, 50, 15.00, 'Forrajera Tizimín'),
    (rancho_id, 'forraje', 'Paca de Pasto Estrella', NULL, 8.0, 500, 3.50, 'Producción propia');

  -- ========== CREDIT SCORE ==========
  INSERT INTO credit_score (rancho_id, score_total, score_completitud, score_regularidad, score_productividad, score_financiero, score_antiguedad, score_sanitario, score_tamano, datos_calculo)
  VALUES (
    rancho_id,
    72,
    85,
    70,
    75,
    65,
    60,
    80,
    68,
    '{"total_animales": 25, "meses_actividad": 10, "registros_ultimo_mes": 48, "vacunaciones_al_dia": true, "ingresos_mensuales_promedio": 12500}'::JSONB
  );

END $$;
