-- =============================================
-- HATOAI — FUNCTIONS & TRIGGERS
-- =============================================

-- ========== 1. UPDATE_UPDATED_AT ==========
-- Auto-update the updated_at column on any row change

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_perfiles_updated_at
  BEFORE UPDATE ON perfiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ranchos_updated_at
  BEFORE UPDATE ON ranchos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_animales_updated_at
  BEFORE UPDATE ON animales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_lotes_updated_at
  BEFORE UPDATE ON lotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_colmenas_updated_at
  BEFORE UPDATE ON colmenas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ========== 2. CALCULATE_GDP ==========
-- Calcula Ganancia Diaria de Peso al insertar un pesaje

CREATE OR REPLACE FUNCTION calculate_gdp()
RETURNS TRIGGER AS $$
DECLARE
  prev_pesaje RECORD;
  days_diff INT;
  gdp DECIMAL;
BEGIN
  -- Get previous pesaje for this animal
  SELECT peso, fecha INTO prev_pesaje
  FROM pesajes
  WHERE animal_id = NEW.animal_id
    AND fecha < NEW.fecha
  ORDER BY fecha DESC
  LIMIT 1;

  IF prev_pesaje IS NOT NULL THEN
    days_diff := NEW.fecha - prev_pesaje.fecha;
    IF days_diff > 0 THEN
      gdp := (NEW.peso - prev_pesaje.peso) / days_diff;
      NEW.gdp_calculado := ROUND(gdp, 3);

      -- Update the animal's current GDP and weight
      UPDATE animales
      SET peso_actual = NEW.peso,
          fecha_ultimo_pesaje = NEW.fecha,
          gdp_actual = ROUND(gdp, 3),
          condicion_corporal = COALESCE(NEW.condicion_corporal, animales.condicion_corporal)
      WHERE id = NEW.animal_id;
    END IF;
  ELSE
    -- First pesaje: just update the animal weight
    UPDATE animales
    SET peso_actual = NEW.peso,
        fecha_ultimo_pesaje = NEW.fecha,
        condicion_corporal = COALESCE(NEW.condicion_corporal, animales.condicion_corporal)
    WHERE id = NEW.animal_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pesajes_calculate_gdp
  BEFORE INSERT ON pesajes
  FOR EACH ROW EXECUTE FUNCTION calculate_gdp();


-- ========== 3. CALCULATE_EXPECTED_BIRTH ==========
-- Calcula fecha esperada de parto al registrar servicio/IA

CREATE OR REPLACE FUNCTION calculate_expected_birth()
RETURNS TRIGGER AS $$
DECLARE
  gestation_days INT;
  animal_species TEXT;
BEGIN
  -- Only calculate for service/insemination events
  IF NEW.tipo NOT IN ('monta_natural', 'inseminacion', 'transferencia_embrion') THEN
    RETURN NEW;
  END IF;

  -- Get the animal's species
  SELECT especie INTO animal_species
  FROM animales
  WHERE id = NEW.animal_id;

  -- Gestation periods by species (approximate days)
  CASE animal_species
    WHEN 'bovino' THEN gestation_days := 283;
    WHEN 'porcino' THEN gestation_days := 114;
    WHEN 'ovino' THEN gestation_days := 150;
    WHEN 'caprino' THEN gestation_days := 150;
    WHEN 'equino' THEN gestation_days := 340;
    WHEN 'bufalino' THEN gestation_days := 310;
    ELSE gestation_days := NULL;
  END CASE;

  IF gestation_days IS NOT NULL THEN
    NEW.fecha_parto_esperada := NEW.fecha + gestation_days;
    NEW.dias_gestacion_estimados := gestation_days;

    -- Update animal reproductive status
    UPDATE animales
    SET estado_reproductivo = 'servida'
    WHERE id = NEW.animal_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_eventos_repro_expected_birth
  BEFORE INSERT ON eventos_reproductivos
  FOR EACH ROW EXECUTE FUNCTION calculate_expected_birth();


-- ========== 4. CALCULATE_WITHDRAWAL ==========
-- Calcula fecha fin de retiro al registrar evento sanitario con medicamento

CREATE OR REPLACE FUNCTION calculate_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate meat withdrawal end date
  IF NEW.dias_retiro_carne IS NOT NULL AND NEW.dias_retiro_carne > 0 THEN
    NEW.fecha_fin_retiro := GREATEST(
      COALESCE(NEW.fecha_fin_retiro, '1900-01-01'::DATE),
      NEW.fecha + NEW.dias_retiro_carne
    );
  END IF;

  -- Calculate milk withdrawal end date (use the later of the two)
  IF NEW.dias_retiro_leche IS NOT NULL AND NEW.dias_retiro_leche > 0 THEN
    NEW.fecha_fin_retiro := GREATEST(
      COALESCE(NEW.fecha_fin_retiro, '1900-01-01'::DATE),
      NEW.fecha + NEW.dias_retiro_leche
    );
  END IF;

  -- Calculate treatment end date
  IF NEW.duracion_dias IS NOT NULL AND NEW.duracion_dias > 0 THEN
    NEW.fecha_fin := NEW.fecha + NEW.duracion_dias;
  END IF;

  -- Update animal sanitary status if under treatment
  IF NEW.animal_id IS NOT NULL AND NEW.tipo IN ('tratamiento', 'vacunacion', 'desparasitacion') THEN
    UPDATE animales
    SET estado_sanitario = CASE
      WHEN NEW.tipo = 'tratamiento' THEN 'en_tratamiento'
      ELSE animales.estado_sanitario
    END
    WHERE id = NEW.animal_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_eventos_sanit_withdrawal
  BEFORE INSERT ON eventos_sanitarios
  FOR EACH ROW EXECUTE FUNCTION calculate_withdrawal();


-- ========== 5. LOG_ACTIVITY ==========
-- Registra cambios importantes en activity_log

CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  ranch_id UUID;
  action_type TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'crear';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'actualizar';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'eliminar';
  END IF;

  -- Extract rancho_id from the record
  IF TG_OP = 'DELETE' THEN
    ranch_id := CASE
      WHEN TG_TABLE_NAME = 'ranchos' THEN OLD.id
      ELSE OLD.rancho_id
    END;

    INSERT INTO activity_log (rancho_id, user_id, tabla, registro_id, accion, datos_anteriores)
    VALUES (ranch_id, auth.uid(), TG_TABLE_NAME, OLD.id, action_type, to_jsonb(OLD));
  ELSIF TG_OP = 'UPDATE' THEN
    ranch_id := CASE
      WHEN TG_TABLE_NAME = 'ranchos' THEN NEW.id
      ELSE NEW.rancho_id
    END;

    INSERT INTO activity_log (rancho_id, user_id, tabla, registro_id, accion, datos_anteriores, datos_nuevos)
    VALUES (ranch_id, auth.uid(), TG_TABLE_NAME, NEW.id, action_type, to_jsonb(OLD), to_jsonb(NEW));
  ELSE
    ranch_id := CASE
      WHEN TG_TABLE_NAME = 'ranchos' THEN NEW.id
      ELSE NEW.rancho_id
    END;

    INSERT INTO activity_log (rancho_id, user_id, tabla, registro_id, accion, datos_nuevos)
    VALUES (ranch_id, auth.uid(), TG_TABLE_NAME, NEW.id, action_type, to_jsonb(NEW));
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply activity logging to key tables
CREATE TRIGGER trg_animales_log
  AFTER INSERT OR UPDATE OR DELETE ON animales
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_lotes_log
  AFTER INSERT OR UPDATE OR DELETE ON lotes
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_colmenas_log
  AFTER INSERT OR UPDATE OR DELETE ON colmenas
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_eventos_repro_log
  AFTER INSERT OR UPDATE OR DELETE ON eventos_reproductivos
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_eventos_sanit_log
  AFTER INSERT OR UPDATE OR DELETE ON eventos_sanitarios
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_pesajes_log
  AFTER INSERT OR UPDATE OR DELETE ON pesajes
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_produccion_leche_log
  AFTER INSERT OR UPDATE OR DELETE ON produccion_leche
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_movimientos_log
  AFTER INSERT OR UPDATE OR DELETE ON movimientos_economicos
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER trg_cosechas_log
  AFTER INSERT OR UPDATE OR DELETE ON cosechas_miel
  FOR EACH ROW EXECUTE FUNCTION log_activity();


-- ========== 6. UPDATE_LOTE_CANTIDAD ==========
-- Actualiza cantidad_actual del lote cuando hay mortalidad/descarte

CREATE OR REPLACE FUNCTION update_lote_cantidad()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease lote quantity by mortality + discard of the day
  IF NEW.mortalidad_dia > 0 OR NEW.descarte_dia > 0 THEN
    UPDATE lotes
    SET cantidad_actual = cantidad_actual
        - COALESCE(NEW.mortalidad_dia, 0)
        - COALESCE(NEW.descarte_dia, 0)
    WHERE id = NEW.lote_id
      AND cantidad_actual IS NOT NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_produccion_lotes_update_cantidad
  AFTER INSERT ON produccion_lotes
  FOR EACH ROW EXECUTE FUNCTION update_lote_cantidad();


-- ========== ADDITIONAL UTILITY FUNCTIONS ==========

-- Function to get ranch summary stats
CREATE OR REPLACE FUNCTION get_ranch_summary(ranch_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_bovinos', (SELECT COUNT(*) FROM animales WHERE rancho_id = ranch_uuid AND especie = 'bovino' AND estado = 'activo'),
    'total_porcinos', (SELECT COUNT(*) FROM animales WHERE rancho_id = ranch_uuid AND especie = 'porcino' AND estado = 'activo'),
    'total_ovinos', (SELECT COUNT(*) FROM animales WHERE rancho_id = ranch_uuid AND especie = 'ovino' AND estado = 'activo'),
    'total_caprinos', (SELECT COUNT(*) FROM animales WHERE rancho_id = ranch_uuid AND especie = 'caprino' AND estado = 'activo'),
    'total_equinos', (SELECT COUNT(*) FROM animales WHERE rancho_id = ranch_uuid AND especie = 'equino' AND estado = 'activo'),
    'total_lotes', (SELECT COUNT(*) FROM lotes WHERE rancho_id = ranch_uuid AND estado = 'activo'),
    'total_colmenas', (SELECT COUNT(*) FROM colmenas WHERE rancho_id = ranch_uuid AND estado = 'activa'),
    'total_apiarios', (SELECT COUNT(*) FROM apiarios WHERE rancho_id = ranch_uuid)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
