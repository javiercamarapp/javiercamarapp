-- =============================================
-- HATOAI — INDEXES & ROW LEVEL SECURITY
-- =============================================

-- ========== INDEXES ==========

-- Animales
CREATE INDEX idx_animales_rancho ON animales(rancho_id);
CREATE INDEX idx_animales_especie ON animales(especie);
CREATE INDEX idx_animales_estado ON animales(estado);
CREATE INDEX idx_animales_rancho_especie ON animales(rancho_id, especie);
CREATE INDEX idx_animales_rancho_estado ON animales(rancho_id, estado);
CREATE INDEX idx_animales_arete ON animales(numero_arete);
CREATE INDEX idx_animales_siniiga ON animales(id_siniiga);
CREATE INDEX idx_animales_corral ON animales(corral_id);
CREATE INDEX idx_animales_madre ON animales(madre_id);
CREATE INDEX idx_animales_padre ON animales(padre_id);
CREATE INDEX idx_animales_created_at ON animales(created_at);

-- Lotes
CREATE INDEX idx_lotes_rancho ON lotes(rancho_id);
CREATE INDEX idx_lotes_especie ON lotes(especie);
CREATE INDEX idx_lotes_estado ON lotes(estado);

-- Produccion lotes
CREATE INDEX idx_produccion_lotes_lote ON produccion_lotes(lote_id);
CREATE INDEX idx_produccion_lotes_rancho ON produccion_lotes(rancho_id);
CREATE INDEX idx_produccion_lotes_fecha ON produccion_lotes(fecha);

-- Apiarios y colmenas
CREATE INDEX idx_apiarios_rancho ON apiarios(rancho_id);
CREATE INDEX idx_colmenas_apiario ON colmenas(apiario_id);
CREATE INDEX idx_colmenas_rancho ON colmenas(rancho_id);
CREATE INDEX idx_colmenas_estado ON colmenas(estado);
CREATE INDEX idx_revisiones_colmena ON revisiones_colmena(colmena_id);
CREATE INDEX idx_revisiones_fecha ON revisiones_colmena(fecha);
CREATE INDEX idx_cosechas_apiario ON cosechas_miel(apiario_id);
CREATE INDEX idx_cosechas_rancho ON cosechas_miel(rancho_id);
CREATE INDEX idx_cosechas_fecha ON cosechas_miel(fecha);

-- Pesajes
CREATE INDEX idx_pesajes_animal ON pesajes(animal_id);
CREATE INDEX idx_pesajes_rancho ON pesajes(rancho_id);
CREATE INDEX idx_pesajes_fecha ON pesajes(fecha);

-- Produccion leche
CREATE INDEX idx_produccion_leche_animal ON produccion_leche(animal_id);
CREATE INDEX idx_produccion_leche_rancho ON produccion_leche(rancho_id);
CREATE INDEX idx_produccion_leche_fecha ON produccion_leche(fecha);

-- Eventos reproductivos
CREATE INDEX idx_eventos_repro_animal ON eventos_reproductivos(animal_id);
CREATE INDEX idx_eventos_repro_rancho ON eventos_reproductivos(rancho_id);
CREATE INDEX idx_eventos_repro_tipo ON eventos_reproductivos(tipo);
CREATE INDEX idx_eventos_repro_fecha ON eventos_reproductivos(fecha);

-- Crias
CREATE INDEX idx_crias_evento ON crias(evento_parto_id);
CREATE INDEX idx_crias_animal ON crias(animal_creado_id);

-- Eventos sanitarios
CREATE INDEX idx_eventos_sanit_animal ON eventos_sanitarios(animal_id);
CREATE INDEX idx_eventos_sanit_rancho ON eventos_sanitarios(rancho_id);
CREATE INDEX idx_eventos_sanit_tipo ON eventos_sanitarios(tipo);
CREATE INDEX idx_eventos_sanit_fecha ON eventos_sanitarios(fecha);
CREATE INDEX idx_eventos_sanit_lote ON eventos_sanitarios(lote_id);
CREATE INDEX idx_eventos_sanit_colmena ON eventos_sanitarios(colmena_id);

-- Inventario y consumo alimentos
CREATE INDEX idx_inventario_alimentos_rancho ON inventario_alimentos(rancho_id);
CREATE INDEX idx_consumo_alimento_rancho ON consumo_alimento(rancho_id);
CREATE INDEX idx_consumo_alimento_fecha ON consumo_alimento(fecha);
CREATE INDEX idx_consumo_alimento_corral ON consumo_alimento(corral_id);

-- Movimientos economicos
CREATE INDEX idx_movimientos_rancho ON movimientos_economicos(rancho_id);
CREATE INDEX idx_movimientos_tipo ON movimientos_economicos(tipo);
CREATE INDEX idx_movimientos_fecha ON movimientos_economicos(fecha);
CREATE INDEX idx_movimientos_categoria ON movimientos_economicos(categoria);

-- Corrales
CREATE INDEX idx_corrales_rancho ON corrales(rancho_id);

-- Rancho usuarios
CREATE INDEX idx_rancho_usuarios_user ON rancho_usuarios(user_id);
CREATE INDEX idx_rancho_usuarios_rancho ON rancho_usuarios(rancho_id);

-- Programas gobierno
CREATE INDEX idx_programa_ranchos_programa ON programa_ranchos(programa_id);
CREATE INDEX idx_programa_ranchos_rancho ON programa_ranchos(rancho_id);

-- Alertas
CREATE INDEX idx_alertas_rancho ON alertas(rancho_id);
CREATE INDEX idx_alertas_leida ON alertas(leida);
CREATE INDEX idx_alertas_tipo ON alertas(tipo);

-- Activity log
CREATE INDEX idx_activity_log_rancho ON activity_log(rancho_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_tabla ON activity_log(tabla);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- Credit score
CREATE INDEX idx_credit_score_rancho ON credit_score(rancho_id);

-- Documentos
CREATE INDEX idx_documentos_rancho ON documentos(rancho_id);
CREATE INDEX idx_documentos_animal ON documentos(animal_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo);


-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranchos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rancho_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrales ENABLE ROW LEVEL SECURITY;
ALTER TABLE animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produccion_lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apiarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE colmenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisiones_colmena ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosechas_miel ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produccion_leche ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_reproductivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE crias ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_sanitarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_alimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumo_alimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_economicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE programas_gobierno ENABLE ROW LEVEL SECURITY;
ALTER TABLE programa_ranchos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;


-- ========== HELPER FUNCTIONS ==========

-- Check if user has access to a ranch
CREATE OR REPLACE FUNCTION user_has_ranch_access(ranch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rancho_usuarios
    WHERE rancho_id = ranch_id
      AND user_id = auth.uid()
      AND activo = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has government access (can see all ranches in their programs)
CREATE OR REPLACE FUNCTION user_has_gov_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid()
      AND rol IN ('gobierno', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ========== RLS POLICIES ==========

-- Perfiles: users can read/update their own profile
CREATE POLICY "perfiles_select_own" ON perfiles
  FOR SELECT USING (id = auth.uid() OR user_has_gov_access());

CREATE POLICY "perfiles_update_own" ON perfiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "perfiles_insert_own" ON perfiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Ranchos: users can see ranches they belong to; gov users see all
CREATE POLICY "ranchos_select" ON ranchos
  FOR SELECT USING (
    user_has_ranch_access(id) OR user_has_gov_access()
  );

CREATE POLICY "ranchos_insert" ON ranchos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ranchos_update" ON ranchos
  FOR UPDATE USING (user_has_ranch_access(id));

CREATE POLICY "ranchos_delete" ON ranchos
  FOR DELETE USING (user_has_ranch_access(id));

-- Rancho usuarios
CREATE POLICY "rancho_usuarios_select" ON rancho_usuarios
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_has_ranch_access(rancho_id)
    OR user_has_gov_access()
  );

CREATE POLICY "rancho_usuarios_insert" ON rancho_usuarios
  FOR INSERT WITH CHECK (user_has_ranch_access(rancho_id) OR user_id = auth.uid());

CREATE POLICY "rancho_usuarios_update" ON rancho_usuarios
  FOR UPDATE USING (user_has_ranch_access(rancho_id));

CREATE POLICY "rancho_usuarios_delete" ON rancho_usuarios
  FOR DELETE USING (user_has_ranch_access(rancho_id));

-- Generic ranch-access policy macro for tables with rancho_id
-- Applied to: corrales, animales, lotes, produccion_lotes, apiarios, colmenas,
-- revisiones_colmena, cosechas_miel, pesajes, produccion_leche,
-- eventos_reproductivos, eventos_sanitarios, inventario_alimentos,
-- consumo_alimento, movimientos_economicos, alertas, activity_log,
-- credit_score, documentos

-- Corrales
CREATE POLICY "corrales_ranch_access" ON corrales
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Animales
CREATE POLICY "animales_ranch_access" ON animales
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Lotes
CREATE POLICY "lotes_ranch_access" ON lotes
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Produccion lotes
CREATE POLICY "produccion_lotes_ranch_access" ON produccion_lotes
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Apiarios
CREATE POLICY "apiarios_ranch_access" ON apiarios
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Colmenas
CREATE POLICY "colmenas_ranch_access" ON colmenas
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Revisiones colmena
CREATE POLICY "revisiones_colmena_ranch_access" ON revisiones_colmena
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Cosechas miel
CREATE POLICY "cosechas_miel_ranch_access" ON cosechas_miel
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Pesajes
CREATE POLICY "pesajes_ranch_access" ON pesajes
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Produccion leche
CREATE POLICY "produccion_leche_ranch_access" ON produccion_leche
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Eventos reproductivos
CREATE POLICY "eventos_repro_ranch_access" ON eventos_reproductivos
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Crias (access via the event's ranch)
CREATE POLICY "crias_ranch_access" ON crias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM eventos_reproductivos er
      WHERE er.id = crias.evento_parto_id
        AND (user_has_ranch_access(er.rancho_id) OR user_has_gov_access())
    )
  );

-- Eventos sanitarios
CREATE POLICY "eventos_sanit_ranch_access" ON eventos_sanitarios
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Inventario alimentos
CREATE POLICY "inventario_alimentos_ranch_access" ON inventario_alimentos
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Consumo alimento
CREATE POLICY "consumo_alimento_ranch_access" ON consumo_alimento
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Movimientos economicos
CREATE POLICY "movimientos_ranch_access" ON movimientos_economicos
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Programas gobierno: visible to gov users and enrolled ranches
CREATE POLICY "programas_gobierno_select" ON programas_gobierno
  FOR SELECT USING (
    user_has_gov_access()
    OR EXISTS (
      SELECT 1 FROM programa_ranchos pr
      JOIN rancho_usuarios ru ON ru.rancho_id = pr.rancho_id
      WHERE pr.programa_id = programas_gobierno.id
        AND ru.user_id = auth.uid()
        AND ru.activo = true
    )
  );

CREATE POLICY "programas_gobierno_insert" ON programas_gobierno
  FOR INSERT WITH CHECK (user_has_gov_access());

CREATE POLICY "programas_gobierno_update" ON programas_gobierno
  FOR UPDATE USING (user_has_gov_access());

CREATE POLICY "programas_gobierno_delete" ON programas_gobierno
  FOR DELETE USING (user_has_gov_access());

-- Programa ranchos
CREATE POLICY "programa_ranchos_select" ON programa_ranchos
  FOR SELECT USING (
    user_has_ranch_access(rancho_id) OR user_has_gov_access()
  );

CREATE POLICY "programa_ranchos_insert" ON programa_ranchos
  FOR INSERT WITH CHECK (user_has_gov_access());

CREATE POLICY "programa_ranchos_update" ON programa_ranchos
  FOR UPDATE USING (user_has_gov_access() OR user_has_ranch_access(rancho_id));

-- Alertas
CREATE POLICY "alertas_ranch_access" ON alertas
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Activity log
CREATE POLICY "activity_log_ranch_access" ON activity_log
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Credit score
CREATE POLICY "credit_score_ranch_access" ON credit_score
  FOR ALL USING (user_has_ranch_access(rancho_id) OR user_has_gov_access());

-- Documentos
CREATE POLICY "documentos_ranch_access" ON documentos
  FOR ALL USING (
    user_has_ranch_access(rancho_id)
    OR user_has_gov_access()
    OR subido_por = auth.uid()
  );
