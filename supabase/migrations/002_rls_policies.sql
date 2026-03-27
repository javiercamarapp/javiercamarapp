-- ============================================================================
-- 002_rls_policies.sql
-- Row Level Security policies for HatoAI
-- ============================================================================

-- ============================================================================
-- 1. Enable RLS on ALL tables
-- ============================================================================

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranchos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rancho_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE gobierno_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE programas_gobierno_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE programa_beneficiarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produccion_lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apiarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE colmenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisiones_colmena ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosechas_miel ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisiones_colmena ENABLE ROW LEVEL SECURITY;
ALTER TABLE floraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_reproductivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_sanitarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanas_sanitarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_alimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumo_alimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE produccion_leche ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_economicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_ganado ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_corral ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfil_crediticio ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrales ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE crias ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Helper: reusable function to get user's rancho IDs
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.user_rancho_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rancho_id
  FROM rancho_usuarios
  WHERE user_id = auth.uid()
    AND activo = true;
$$;

-- ============================================================================
-- 3. Helper: reusable function to get gobierno user's program rancho IDs
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.gobierno_rancho_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pb.rancho_id
  FROM programa_beneficiarios pb
  JOIN gobierno_usuarios gu ON gu.user_id = auth.uid()
  WHERE pb.programa_id = ANY(gu.programas_asignados);
$$;

-- ============================================================================
-- 4. Special table policies
-- ============================================================================

-- ---------------------------------------------------------------------------
-- perfiles: users can only access their own profile
-- ---------------------------------------------------------------------------
CREATE POLICY users_own_profile
  ON perfiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------------
-- ranchos: users see ranches they belong to
-- ---------------------------------------------------------------------------
CREATE POLICY users_own_ranchos
  ON ranchos FOR ALL
  USING (
    id IN (SELECT auth.user_rancho_ids())
  )
  WITH CHECK (
    id IN (SELECT auth.user_rancho_ids())
  );

CREATE POLICY gobierno_view_ranchos
  ON ranchos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND tipo_cuenta = 'gobierno'
    )
    AND id IN (SELECT auth.gobierno_rancho_ids())
  );

-- ---------------------------------------------------------------------------
-- rancho_usuarios: users see their own memberships; owners manage all
-- ---------------------------------------------------------------------------
CREATE POLICY users_own_memberships
  ON rancho_usuarios FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY owners_manage_memberships
  ON rancho_usuarios FOR ALL
  USING (
    rancho_id IN (
      SELECT rancho_id
      FROM rancho_usuarios
      WHERE user_id = auth.uid()
        AND activo = true
        AND rol = 'propietario'
    )
  )
  WITH CHECK (
    rancho_id IN (
      SELECT rancho_id
      FROM rancho_usuarios
      WHERE user_id = auth.uid()
        AND activo = true
        AND rol = 'propietario'
    )
  );

-- ---------------------------------------------------------------------------
-- gobierno_usuarios: each user sees only their own record
-- ---------------------------------------------------------------------------
CREATE POLICY gobierno_users_own_record
  ON gobierno_usuarios FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- programas_gobierno_admin: gobierno users see programs in programas_asignados
-- ---------------------------------------------------------------------------
CREATE POLICY gobierno_program_access
  ON programas_gobierno_admin FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND tipo_cuenta = 'gobierno'
    )
    AND id IN (
      SELECT unnest(programas_asignados)
      FROM gobierno_usuarios
      WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- programa_beneficiarios: gobierno sees beneficiaries of their programs
-- ---------------------------------------------------------------------------
CREATE POLICY gobierno_view_beneficiarios
  ON programa_beneficiarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND tipo_cuenta = 'gobierno'
    )
    AND programa_id IN (
      SELECT unnest(programas_asignados)
      FROM gobierno_usuarios
      WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- crias: access via evento_parto_id -> eventos_reproductivos -> rancho_id
-- ---------------------------------------------------------------------------
CREATE POLICY users_own_ranch_crias
  ON crias FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM eventos_reproductivos er
      WHERE er.id = crias.evento_parto_id
        AND er.rancho_id IN (SELECT auth.user_rancho_ids())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM eventos_reproductivos er
      WHERE er.id = crias.evento_parto_id
        AND er.rancho_id IN (SELECT auth.user_rancho_ids())
    )
  );

CREATE POLICY gobierno_program_crias
  ON crias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND tipo_cuenta = 'gobierno'
    )
    AND EXISTS (
      SELECT 1
      FROM eventos_reproductivos er
      WHERE er.id = crias.evento_parto_id
        AND er.rancho_id IN (SELECT auth.gobierno_rancho_ids())
    )
  );

-- ---------------------------------------------------------------------------
-- catalogos: shared catalogos (rancho_id IS NULL) visible to all authenticated
-- ---------------------------------------------------------------------------
CREATE POLICY catalogos_shared_read
  ON catalogos FOR SELECT
  USING (
    rancho_id IS NULL
    AND auth.uid() IS NOT NULL
  );

-- ============================================================================
-- 5. Standard rancho_id-based policies for all ranch-scoped tables
-- ============================================================================

-- Macro-style DO block to create identical policies on many tables
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'animales',
    'lotes',
    'produccion_lotes',
    'apiarios',
    'colmenas',
    'revisiones_colmena',
    'cosechas_miel',
    'divisiones_colmena',
    'floraciones',
    'pesajes',
    'eventos_reproductivos',
    'eventos_sanitarios',
    'campanas_sanitarias',
    'inventario_alimento',
    'consumo_alimento',
    'produccion_leche',
    'movimientos_economicos',
    'movimientos_ganado',
    'movimientos_corral',
    'alertas',
    'activity_log',
    'perfil_crediticio',
    'corrales'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Ranch member policy: full access to own ranch data
    EXECUTE format(
      'CREATE POLICY users_own_ranch_%I ON %I FOR ALL '
      || 'USING (rancho_id IN (SELECT auth.user_rancho_ids())) '
      || 'WITH CHECK (rancho_id IN (SELECT auth.user_rancho_ids()))',
      tbl, tbl
    );

    -- Gobierno read-only policy: see data from program beneficiary ranches
    EXECUTE format(
      'CREATE POLICY gobierno_program_%I ON %I FOR SELECT '
      || 'USING ('
      ||   'EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND tipo_cuenta = ''gobierno'') '
      ||   'AND rancho_id IN (SELECT auth.gobierno_rancho_ids())'
      || ')',
      tbl, tbl
    );
  END LOOP;
END
$$;

-- catalogos with rancho_id NOT NULL: standard ranch-scoped policies
CREATE POLICY users_own_ranch_catalogos
  ON catalogos FOR ALL
  USING (
    rancho_id IS NOT NULL
    AND rancho_id IN (SELECT auth.user_rancho_ids())
  )
  WITH CHECK (
    rancho_id IS NOT NULL
    AND rancho_id IN (SELECT auth.user_rancho_ids())
  );

CREATE POLICY gobierno_program_catalogos
  ON catalogos FOR SELECT
  USING (
    rancho_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND tipo_cuenta = 'gobierno'
    )
    AND rancho_id IN (SELECT auth.gobierno_rancho_ids())
  );
