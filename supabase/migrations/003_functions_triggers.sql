-- ============================================================================
-- 003_functions_triggers.sql
-- Database functions and triggers for HatoAI
-- ============================================================================

-- ============================================================================
-- 1. calculate_gdp() — BEFORE INSERT on pesajes
--    Calculates Ganancia Diaria de Peso from previous weighing.
--    Updates animales.peso_actual, fecha_ultimo_pesaje, gdp_actual.
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_gdp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_prev_peso   numeric;
  v_prev_fecha  date;
  v_dias        integer;
  v_gdp         numeric;
BEGIN
  -- Fetch the most recent previous weighing for this animal
  SELECT peso, fecha
  INTO v_prev_peso, v_prev_fecha
  FROM pesajes
  WHERE animal_id = NEW.animal_id
    AND fecha < NEW.fecha
  ORDER BY fecha DESC
  LIMIT 1;

  IF v_prev_peso IS NOT NULL AND v_prev_fecha IS NOT NULL THEN
    v_dias := (NEW.fecha - v_prev_fecha);
    IF v_dias > 0 THEN
      v_gdp := ROUND(((NEW.peso - v_prev_peso) / v_dias)::numeric, 3);
    ELSE
      v_gdp := 0;
    END IF;
    NEW.gdp := v_gdp;
  ELSE
    -- First weighing: no GDP calculation possible
    NEW.gdp := NULL;
    v_gdp := NULL;
  END IF;

  -- Update the animal record
  UPDATE animales
  SET peso_actual        = NEW.peso,
      fecha_ultimo_pesaje = NEW.fecha,
      gdp_actual         = COALESCE(v_gdp, gdp_actual)
  WHERE id = NEW.animal_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calculate_gdp
  BEFORE INSERT ON pesajes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_gdp();

-- ============================================================================
-- 2. update_reproductive_status() — AFTER INSERT on eventos_reproductivos
--    Updates animales.estado_reproductivo based on event type.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_reproductive_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_new_status text;
BEGIN
  -- Map event types to reproductive states
  v_new_status := CASE NEW.tipo_evento
    WHEN 'monta'            THEN 'servida'
    WHEN 'inseminacion'     THEN 'servida'
    WHEN 'diagnostico_gestacion_positivo' THEN 'gestante'
    WHEN 'diagnostico_gestacion_negativo' THEN 'vacía'
    WHEN 'parto'            THEN 'lactando'
    WHEN 'aborto'           THEN 'vacía'
    WHEN 'destete'          THEN 'vacía'
    WHEN 'secado'           THEN 'seca'
    WHEN 'celo'             THEN 'en_celo'
    WHEN 'inicio_postura'   THEN 'puesta'
    WHEN 'fin_postura'      THEN 'inactiva'
    WHEN 'inicio_incubacion' THEN 'incubando'
    ELSE NULL
  END;

  IF v_new_status IS NOT NULL AND NEW.animal_id IS NOT NULL THEN
    UPDATE animales
    SET estado_reproductivo = v_new_status
    WHERE id = NEW.animal_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_reproductive_status
  AFTER INSERT ON eventos_reproductivos
  FOR EACH ROW
  EXECUTE FUNCTION update_reproductive_status();

-- ============================================================================
-- 3. calculate_withdrawal_date() — BEFORE INSERT on eventos_sanitarios
--    If periodo_retiro_dias > 0, calculates fecha_fin_retiro.
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_withdrawal_date()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.periodo_retiro_dias IS NOT NULL AND NEW.periodo_retiro_dias > 0 THEN
    NEW.fecha_fin_retiro := NEW.fecha + (NEW.periodo_retiro_dias * INTERVAL '1 day');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calculate_withdrawal_date
  BEFORE INSERT ON eventos_sanitarios
  FOR EACH ROW
  EXECUTE FUNCTION calculate_withdrawal_date();

-- ============================================================================
-- 4. log_activity() — AFTER INSERT/UPDATE/DELETE on key tables
--    Inserts a record into activity_log.
-- ============================================================================

CREATE OR REPLACE FUNCTION log_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_rancho_id  uuid;
  v_entity_id  uuid;
  v_action     text;
  v_details    jsonb;
BEGIN
  -- Determine the action
  v_action := TG_OP;  -- INSERT, UPDATE, DELETE

  -- Use NEW for INSERT/UPDATE, OLD for DELETE
  IF TG_OP = 'DELETE' THEN
    v_entity_id := OLD.id;
    -- Try to get rancho_id from OLD
    BEGIN
      v_rancho_id := OLD.rancho_id;
    EXCEPTION WHEN undefined_column THEN
      v_rancho_id := NULL;
    END;
    v_details := jsonb_build_object(
      'old_data', to_jsonb(OLD)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := NEW.id;
    BEGIN
      v_rancho_id := NEW.rancho_id;
    EXCEPTION WHEN undefined_column THEN
      v_rancho_id := NULL;
    END;
    v_details := jsonb_build_object(
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    );
  ELSE -- INSERT
    v_entity_id := NEW.id;
    BEGIN
      v_rancho_id := NEW.rancho_id;
    EXCEPTION WHEN undefined_column THEN
      v_rancho_id := NULL;
    END;
    v_details := jsonb_build_object(
      'new_data', to_jsonb(NEW)
    );
  END IF;

  INSERT INTO activity_log (
    rancho_id,
    user_id,
    tabla,
    registro_id,
    accion,
    detalles,
    created_at
  ) VALUES (
    v_rancho_id,
    auth.uid(),
    TG_TABLE_NAME,
    v_entity_id,
    v_action,
    v_details,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach log_activity to all tracked tables
CREATE TRIGGER trg_log_activity_animales
  AFTER INSERT OR UPDATE OR DELETE ON animales
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_log_activity_pesajes
  AFTER INSERT OR UPDATE OR DELETE ON pesajes
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_log_activity_eventos_reproductivos
  AFTER INSERT OR UPDATE OR DELETE ON eventos_reproductivos
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_log_activity_eventos_sanitarios
  AFTER INSERT OR UPDATE OR DELETE ON eventos_sanitarios
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_log_activity_movimientos_economicos
  AFTER INSERT OR UPDATE OR DELETE ON movimientos_economicos
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_log_activity_movimientos_ganado
  AFTER INSERT OR UPDATE OR DELETE ON movimientos_ganado
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================================
-- 5. update_lot_mortality() — AFTER INSERT on produccion_lotes
--    Updates lotes.mortalidad_acumulada and cantidad_actual.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_lot_mortality()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_cantidad_inicial integer;
  v_total_muertes    integer;
BEGIN
  -- Get the lot's initial quantity
  SELECT cantidad_inicial
  INTO v_cantidad_inicial
  FROM lotes
  WHERE id = NEW.lote_id;

  IF v_cantidad_inicial IS NULL THEN
    RETURN NEW;
  END IF;

  -- Sum all mortality from produccion_lotes for this lot
  SELECT COALESCE(SUM(muertes), 0)
  INTO v_total_muertes
  FROM produccion_lotes
  WHERE lote_id = NEW.lote_id;

  -- Update the lot
  UPDATE lotes
  SET mortalidad_acumulada = v_total_muertes,
      cantidad_actual      = GREATEST(v_cantidad_inicial - v_total_muertes, 0)
  WHERE id = NEW.lote_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_lot_mortality
  AFTER INSERT ON produccion_lotes
  FOR EACH ROW
  EXECUTE FUNCTION update_lot_mortality();

-- ============================================================================
-- 6. handle_new_user() — AFTER INSERT on auth.users
--    Creates a perfiles record. Uses SECURITY DEFINER to bypass RLS.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO perfiles (
    id,
    email,
    nombre,
    tipo_cuenta,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'tipo_cuenta',
      'ganadero'
    ),
    now(),
    now()
  );
  RETURN NEW;
END;
$$;

-- Grant execute to the supabase auth admin role
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. update_updated_at() — generic trigger for updated_at column
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Attach to all tables that have an updated_at column
DO $$
DECLARE
  tbl text;
  tables_with_updated_at text[] := ARRAY[
    'perfiles',
    'ranchos',
    'rancho_usuarios',
    'animales',
    'lotes',
    'apiarios',
    'colmenas',
    'corrales',
    'inventario_alimento',
    'perfil_crediticio',
    'alertas',
    'catalogos',
    'campanas_sanitarias',
    'programas_gobierno_admin',
    'programa_beneficiarios',
    'gobierno_usuarios',
    'floraciones'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables_with_updated_at LOOP
    -- Only create trigger if the table actually has an updated_at column
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = tbl
        AND column_name = 'updated_at'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER trg_updated_at_%I '
        || 'BEFORE UPDATE ON %I '
        || 'FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
        tbl, tbl
      );
    END IF;
  END LOOP;
END
$$;
