// ---------------------------------------------------------------------------
// TypeScript types representing the Supabase schema
// Generated from supabase/migrations/001_initial_schema.sql
// ---------------------------------------------------------------------------

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          nombre: string;
          apellido: string | null;
          telefono: string | null;
          avatar_url: string | null;
          idioma: "es" | "en" | "pt";
          zona_horaria: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          nombre: string;
          apellido?: string | null;
          telefono?: string | null;
          avatar_url?: string | null;
          idioma?: "es" | "en" | "pt";
          zona_horaria?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido?: string | null;
          telefono?: string | null;
          avatar_url?: string | null;
          idioma?: "es" | "en" | "pt";
          zona_horaria?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      ranchos: {
        Row: {
          id: string;
          nombre: string;
          ubicacion: string | null;
          latitud: number | null;
          longitud: number | null;
          superficie_ha: number | null;
          especie_principal: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "avicola" | "apicola" | "cunicola" | "diversificado";
          proposito: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "huevo" | "miel" | "pie_de_cria" | "otro" | null;
          moneda: string;
          logo_url: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          nombre: string;
          ubicacion?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          superficie_ha?: number | null;
          especie_principal: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "avicola" | "apicola" | "cunicola" | "diversificado";
          proposito?: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "huevo" | "miel" | "pie_de_cria" | "otro" | null;
          moneda?: string;
          logo_url?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          nombre?: string;
          ubicacion?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          superficie_ha?: number | null;
          especie_principal?: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "avicola" | "apicola" | "cunicola" | "diversificado";
          proposito?: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "huevo" | "miel" | "pie_de_cria" | "otro" | null;
          moneda?: string;
          logo_url?: string | null;
          activo?: boolean;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      rancho_usuarios: {
        Row: {
          id: string;
          rancho_id: string;
          usuario_id: string;
          rol: "propietario" | "administrador" | "veterinario" | "vaquero" | "invitado";
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          usuario_id: string;
          rol: "propietario" | "administrador" | "veterinario" | "vaquero" | "invitado";
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rancho_id?: string;
          usuario_id?: string;
          rol?: "propietario" | "administrador" | "veterinario" | "vaquero" | "invitado";
          activo?: boolean;
          updated_at?: string;
        };
      };

      corrales: {
        Row: {
          id: string;
          rancho_id: string;
          nombre: string;
          tipo: "corral" | "potrero" | "establo" | "nave" | "galpon" | "jaula" | "manga" | "bascula" | "enfermeria" | "otro";
          capacidad: number | null;
          superficie_m2: number | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          nombre: string;
          tipo: "corral" | "potrero" | "establo" | "nave" | "galpon" | "jaula" | "manga" | "bascula" | "enfermeria" | "otro";
          capacidad?: number | null;
          superficie_m2?: number | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          rancho_id?: string;
          nombre?: string;
          tipo?: "corral" | "potrero" | "establo" | "nave" | "galpon" | "jaula" | "manga" | "bascula" | "enfermeria" | "otro";
          capacidad?: number | null;
          superficie_m2?: number | null;
          activo?: boolean;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      animales: {
        Row: {
          id: string;
          rancho_id: string;
          corral_id: string | null;
          identificador: string;
          nombre: string | null;
          especie: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "cunicola" | "diversificado";
          raza: string | null;
          sexo: "macho" | "hembra";
          fecha_nacimiento: string | null;
          peso_actual: number | null;
          estado: "activo" | "vendido" | "muerto" | "descartado" | "perdido" | "en_cuarentena";
          proposito: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "pie_de_cria" | "trabajo" | "otro" | null;
          madre_id: string | null;
          padre_id: string | null;
          numero_registro: string | null;
          foto_url: string | null;
          notas: string | null;
          fecha_ingreso: string;
          fecha_salida: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          corral_id?: string | null;
          identificador: string;
          nombre?: string | null;
          especie: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "cunicola" | "diversificado";
          raza?: string | null;
          sexo: "macho" | "hembra";
          fecha_nacimiento?: string | null;
          peso_actual?: number | null;
          estado?: "activo" | "vendido" | "muerto" | "descartado" | "perdido" | "en_cuarentena";
          proposito?: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "pie_de_cria" | "trabajo" | "otro" | null;
          madre_id?: string | null;
          padre_id?: string | null;
          numero_registro?: string | null;
          foto_url?: string | null;
          notas?: string | null;
          fecha_ingreso?: string;
          fecha_salida?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          rancho_id?: string;
          corral_id?: string | null;
          identificador?: string;
          nombre?: string | null;
          especie?: "bovino" | "porcino" | "ovino" | "caprino" | "equino" | "cunicola" | "diversificado";
          raza?: string | null;
          sexo?: "macho" | "hembra";
          fecha_nacimiento?: string | null;
          peso_actual?: number | null;
          estado?: "activo" | "vendido" | "muerto" | "descartado" | "perdido" | "en_cuarentena";
          proposito?: "carne" | "leche" | "doble_proposito" | "cria" | "engorda" | "lana" | "pie_de_cria" | "trabajo" | "otro" | null;
          madre_id?: string | null;
          padre_id?: string | null;
          numero_registro?: string | null;
          foto_url?: string | null;
          notas?: string | null;
          fecha_ingreso?: string;
          fecha_salida?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      lotes: {
        Row: {
          id: string;
          rancho_id: string;
          corral_id: string | null;
          nombre: string;
          especie: "avicola" | "cunicola" | "otro";
          proposito: "huevo" | "carne" | "doble_proposito" | "pie_de_cria" | "otro" | null;
          raza: string | null;
          cantidad_inicial: number;
          cantidad_actual: number;
          fecha_ingreso: string;
          edad_ingreso_dias: number | null;
          estado: "activo" | "finalizado" | "descartado";
          notas: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          corral_id?: string | null;
          nombre: string;
          especie: "avicola" | "cunicola" | "otro";
          proposito?: "huevo" | "carne" | "doble_proposito" | "pie_de_cria" | "otro" | null;
          raza?: string | null;
          cantidad_inicial: number;
          cantidad_actual: number;
          fecha_ingreso?: string;
          edad_ingreso_dias?: number | null;
          estado?: "activo" | "finalizado" | "descartado";
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          rancho_id?: string;
          corral_id?: string | null;
          nombre?: string;
          especie?: "avicola" | "cunicola" | "otro";
          proposito?: "huevo" | "carne" | "doble_proposito" | "pie_de_cria" | "otro" | null;
          raza?: string | null;
          cantidad_inicial?: number;
          cantidad_actual?: number;
          fecha_ingreso?: string;
          edad_ingreso_dias?: number | null;
          estado?: "activo" | "finalizado" | "descartado";
          notas?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      apiarios: {
        Row: {
          id: string;
          rancho_id: string;
          nombre: string;
          ubicacion: string | null;
          latitud: number | null;
          longitud: number | null;
          altitud_m: number | null;
          tipo_vegetacion: string | null;
          cantidad_colmenas: number;
          activo: boolean;
          notas: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          nombre: string;
          ubicacion?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          altitud_m?: number | null;
          tipo_vegetacion?: string | null;
          cantidad_colmenas?: number;
          activo?: boolean;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          rancho_id?: string;
          nombre?: string;
          ubicacion?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          altitud_m?: number | null;
          tipo_vegetacion?: string | null;
          cantidad_colmenas?: number;
          activo?: boolean;
          notas?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      colmenas: {
        Row: {
          id: string;
          apiario_id: string;
          rancho_id: string;
          identificador: string;
          tipo: "langstroth" | "jumbo" | "africana" | "tecnificada" | "rustica" | "otro" | null;
          estado: "activa" | "debil" | "huerfana" | "muerta" | "fusionada" | "vendida";
          tiene_reina: boolean;
          color_reina: string | null;
          fecha_ultima_revision: string | null;
          marcos_total: number | null;
          marcos_cria: number | null;
          marcos_miel: number | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          apiario_id: string;
          rancho_id: string;
          identificador: string;
          tipo?: "langstroth" | "jumbo" | "africana" | "tecnificada" | "rustica" | "otro" | null;
          estado?: "activa" | "debil" | "huerfana" | "muerta" | "fusionada" | "vendida";
          tiene_reina?: boolean;
          color_reina?: string | null;
          fecha_ultima_revision?: string | null;
          marcos_total?: number | null;
          marcos_cria?: number | null;
          marcos_miel?: number | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          apiario_id?: string;
          rancho_id?: string;
          identificador?: string;
          tipo?: "langstroth" | "jumbo" | "africana" | "tecnificada" | "rustica" | "otro" | null;
          estado?: "activa" | "debil" | "huerfana" | "muerta" | "fusionada" | "vendida";
          tiene_reina?: boolean;
          color_reina?: string | null;
          fecha_ultima_revision?: string | null;
          marcos_total?: number | null;
          marcos_cria?: number | null;
          marcos_miel?: number | null;
          notas?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };

      pesajes: {
        Row: {
          id: string;
          animal_id: string;
          rancho_id: string;
          fecha: string;
          peso_kg: number;
          tipo: "nacimiento" | "destete" | "rutina" | "venta" | "compra" | "otro";
          ganancia_diaria_kg: number | null;
          notas: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          animal_id: string;
          rancho_id: string;
          fecha?: string;
          peso_kg: number;
          tipo?: "nacimiento" | "destete" | "rutina" | "venta" | "compra" | "otro";
          ganancia_diaria_kg?: number | null;
          notas?: string | null;
          created_at?: string;
        };
        Update: {
          animal_id?: string;
          rancho_id?: string;
          fecha?: string;
          peso_kg?: number;
          tipo?: "nacimiento" | "destete" | "rutina" | "venta" | "compra" | "otro";
          ganancia_diaria_kg?: number | null;
          notas?: string | null;
        };
      };

      eventos_reproductivos: {
        Row: {
          id: string;
          animal_id: string;
          rancho_id: string;
          tipo: "celo" | "monta_natural" | "inseminacion" | "diagnostico_gestacion" | "parto" | "aborto" | "destete" | "secado" | "otro";
          fecha: string;
          resultado: "positivo" | "negativo" | "pendiente" | null;
          macho_id: string | null;
          toro_semen: string | null;
          numero_crias: number | null;
          dias_gestacion: number | null;
          notas: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          animal_id: string;
          rancho_id: string;
          tipo: "celo" | "monta_natural" | "inseminacion" | "diagnostico_gestacion" | "parto" | "aborto" | "destete" | "secado" | "otro";
          fecha?: string;
          resultado?: "positivo" | "negativo" | "pendiente" | null;
          macho_id?: string | null;
          toro_semen?: string | null;
          numero_crias?: number | null;
          dias_gestacion?: number | null;
          notas?: string | null;
          created_at?: string;
        };
        Update: {
          animal_id?: string;
          rancho_id?: string;
          tipo?: "celo" | "monta_natural" | "inseminacion" | "diagnostico_gestacion" | "parto" | "aborto" | "destete" | "secado" | "otro";
          fecha?: string;
          resultado?: "positivo" | "negativo" | "pendiente" | null;
          macho_id?: string | null;
          toro_semen?: string | null;
          numero_crias?: number | null;
          dias_gestacion?: number | null;
          notas?: string | null;
        };
      };

      eventos_sanitarios: {
        Row: {
          id: string;
          animal_id: string | null;
          lote_id: string | null;
          rancho_id: string;
          tipo: "vacunacion" | "desparasitacion" | "curacion" | "cirugia" | "diagnostico" | "tratamiento" | "prueba_laboratorio" | "otro";
          fecha: string;
          producto: string | null;
          dosis: string | null;
          via_administracion: "oral" | "intramuscular" | "subcutanea" | "intravenosa" | "topica" | "intramamaria" | "otro" | null;
          diagnostico: string | null;
          veterinario: string | null;
          periodo_retiro_dias: number | null;
          costo: number | null;
          notas: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          animal_id?: string | null;
          lote_id?: string | null;
          rancho_id: string;
          tipo: "vacunacion" | "desparasitacion" | "curacion" | "cirugia" | "diagnostico" | "tratamiento" | "prueba_laboratorio" | "otro";
          fecha?: string;
          producto?: string | null;
          dosis?: string | null;
          via_administracion?: "oral" | "intramuscular" | "subcutanea" | "intravenosa" | "topica" | "intramamaria" | "otro" | null;
          diagnostico?: string | null;
          veterinario?: string | null;
          periodo_retiro_dias?: number | null;
          costo?: number | null;
          notas?: string | null;
          created_at?: string;
        };
        Update: {
          animal_id?: string | null;
          lote_id?: string | null;
          rancho_id?: string;
          tipo?: "vacunacion" | "desparasitacion" | "curacion" | "cirugia" | "diagnostico" | "tratamiento" | "prueba_laboratorio" | "otro";
          fecha?: string;
          producto?: string | null;
          dosis?: string | null;
          via_administracion?: "oral" | "intramuscular" | "subcutanea" | "intravenosa" | "topica" | "intramamaria" | "otro" | null;
          diagnostico?: string | null;
          veterinario?: string | null;
          periodo_retiro_dias?: number | null;
          costo?: number | null;
          notas?: string | null;
        };
      };

      movimientos_economicos: {
        Row: {
          id: string;
          rancho_id: string;
          tipo: "ingreso" | "egreso";
          categoria: "venta_animal" | "compra_animal" | "venta_leche" | "venta_huevo" | "venta_miel" | "venta_lana" | "venta_otro_producto" | "alimento" | "medicamento" | "insumos" | "mano_obra" | "transporte" | "mantenimiento" | "servicios" | "subsidio" | "credito" | "otro";
          fecha: string;
          monto: number;
          descripcion: string | null;
          animal_id: string | null;
          lote_id: string | null;
          comprobante_url: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          tipo: "ingreso" | "egreso";
          categoria: "venta_animal" | "compra_animal" | "venta_leche" | "venta_huevo" | "venta_miel" | "venta_lana" | "venta_otro_producto" | "alimento" | "medicamento" | "insumos" | "mano_obra" | "transporte" | "mantenimiento" | "servicios" | "subsidio" | "credito" | "otro";
          fecha?: string;
          monto: number;
          descripcion?: string | null;
          animal_id?: string | null;
          lote_id?: string | null;
          comprobante_url?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rancho_id?: string;
          tipo?: "ingreso" | "egreso";
          categoria?: "venta_animal" | "compra_animal" | "venta_leche" | "venta_huevo" | "venta_miel" | "venta_lana" | "venta_otro_producto" | "alimento" | "medicamento" | "insumos" | "mano_obra" | "transporte" | "mantenimiento" | "servicios" | "subsidio" | "credito" | "otro";
          fecha?: string;
          monto?: number;
          descripcion?: string | null;
          animal_id?: string | null;
          lote_id?: string | null;
          comprobante_url?: string | null;
          notas?: string | null;
          updated_at?: string;
        };
      };

      alertas: {
        Row: {
          id: string;
          rancho_id: string;
          usuario_id: string | null;
          tipo: "sanitaria" | "reproductiva" | "alimentacion" | "inventario" | "economica" | "clima" | "vencimiento" | "campana" | "produccion" | "general";
          prioridad: "alta" | "media" | "baja";
          titulo: string;
          mensaje: string | null;
          entidad_tipo: string | null;
          entidad_id: string | null;
          leida: boolean;
          fecha_programada: string | null;
          fecha_leida: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rancho_id: string;
          usuario_id?: string | null;
          tipo: "sanitaria" | "reproductiva" | "alimentacion" | "inventario" | "economica" | "clima" | "vencimiento" | "campana" | "produccion" | "general";
          prioridad?: "alta" | "media" | "baja";
          titulo: string;
          mensaje?: string | null;
          entidad_tipo?: string | null;
          entidad_id?: string | null;
          leida?: boolean;
          fecha_programada?: string | null;
          fecha_leida?: string | null;
          created_at?: string;
        };
        Update: {
          rancho_id?: string;
          usuario_id?: string | null;
          tipo?: "sanitaria" | "reproductiva" | "alimentacion" | "inventario" | "economica" | "clima" | "vencimiento" | "campana" | "produccion" | "general";
          prioridad?: "alta" | "media" | "baja";
          titulo?: string;
          mensaje?: string | null;
          entidad_tipo?: string | null;
          entidad_id?: string | null;
          leida?: boolean;
          fecha_programada?: string | null;
          fecha_leida?: string | null;
        };
      };
    };
  };
}

/** Convenience helpers */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
