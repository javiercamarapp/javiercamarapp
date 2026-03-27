// ---------------------------------------------------------------------------
// Vaccines by species — based on SENASICA / SAGARPA (SADER) standards
// ---------------------------------------------------------------------------

import type { SpeciesId } from "@/types/species";

export interface VaccineInfo {
  name: string;
  /** Re-application frequency in days (0 = one-time / as indicated) */
  frequency_days: number;
  route: "IM" | "SC" | "oral" | "ocular" | "intranasal" | "tópica" | "ala" | "intradérmica" | "variable";
  /** Standard dose description */
  dose_standard: string;
  notes: string;
}

export const VACCINES_BY_SPECIES: Record<SpeciesId, VaccineInfo[]> = {
  bovino: [
    { name: "Brucelosis (RB51)", frequency_days: 0, route: "SC", dose_standard: "2 mL", notes: "Hembras 4-12 meses. Campaña SENASICA obligatoria." },
    { name: "Clostridiosis (7 vías)", frequency_days: 180, route: "SC", dose_standard: "5 mL", notes: "Refuerzo semestral. Incluye C. chauvoei, septicum, perfringens, novyi, sordellii, haemolyticum, tetani." },
    { name: "Rabia paralítica bovina (Derriengue)", frequency_days: 365, route: "IM", dose_standard: "2 mL", notes: "Zonas endémicas. Campaña nacional SENASICA." },
    { name: "Carbunco bacteridiano (Ántrax)", frequency_days: 365, route: "SC", dose_standard: "1 mL", notes: "Cepa Sterne. Zonas endémicas." },
    { name: "IBR-DVB-PI3-BRSV (Complejo respiratorio)", frequency_days: 180, route: "IM", dose_standard: "5 mL", notes: "Vacuna combinada viral respiratoria." },
    { name: "Leptospirosis (5 serovares)", frequency_days: 180, route: "IM", dose_standard: "5 mL", notes: "Refuerzo semestral, importante en zonas húmedas." },
    { name: "Pasteurelosis (Mannheimia haemolytica)", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Prevención de neumonía." },
    { name: "Tuberculosis bovina (prueba diagnóstica)", frequency_days: 365, route: "intradérmica", dose_standard: "0.1 mL PPD", notes: "Prueba de tuberculina. Campaña SENASICA." },
    { name: "Fiebre aftosa (en caso de brote)", frequency_days: 180, route: "IM", dose_standard: "2 mL", notes: "México libre desde 2000. Solo en emergencia." },
  ],

  porcino: [
    { name: "Fiebre porcina clásica (PPC)", frequency_days: 180, route: "IM", dose_standard: "2 mL", notes: "Cepa PAV-250. Campaña SENASICA en zonas de control." },
    { name: "Aujeszky (Pseudorabia)", frequency_days: 180, route: "IM", dose_standard: "2 mL", notes: "Vacuna gE-deletada. Campaña nacional." },
    { name: "Mycoplasma hyopneumoniae", frequency_days: 0, route: "IM", dose_standard: "2 mL", notes: "Lechones 1-3 semanas. Una o dos dosis según programa." },
    { name: "Circovirus porcino tipo 2 (PCV2)", frequency_days: 0, route: "IM", dose_standard: "2 mL", notes: "Lechones 3-4 semanas." },
    { name: "PRRS (Síndrome reproductivo y respiratorio)", frequency_days: 180, route: "IM", dose_standard: "2 mL", notes: "Viva modificada o inactivada según estatus de granja." },
    { name: "Parvovirus porcino + Leptospira + Erisipela", frequency_days: 180, route: "IM", dose_standard: "5 mL", notes: "Vacuna triple para cerdas reproductoras pre-servicio." },
    { name: "E. coli + Clostridium perfringens", frequency_days: 0, route: "IM", dose_standard: "2 mL", notes: "Cerdas gestantes 2-3 semanas pre-parto." },
    { name: "Influenza porcina", frequency_days: 180, route: "IM", dose_standard: "2 mL", notes: "Granjas con historial. Cepas H1N1/H3N2." },
  ],

  ovino: [
    { name: "Clostridiosis (8 vías)", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Incluye enterotoxemia (C. perfringens C y D)." },
    { name: "Brucelosis ovina (Rev-1)", frequency_days: 0, route: "SC", dose_standard: "1 mL", notes: "Hembras de reemplazo. Dosis reducida conjuntival disponible." },
    { name: "Rabia", frequency_days: 365, route: "IM", dose_standard: "2 mL", notes: "Zonas con presencia de murciélagos hematófagos." },
    { name: "Pasteurelosis", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Mannheimia haemolytica. Prevención de neumonía." },
    { name: "Ectima contagioso (Orf)", frequency_days: 0, route: "tópica", dose_standard: "Escarificación", notes: "Cepa viva. Aplicar en corderos en áreas endémicas." },
    { name: "Linfadenitis caseosa (Corynebacterium)", frequency_days: 365, route: "SC", dose_standard: "1 mL", notes: "Bacterina o toxoide. Rebaños problema." },
    { name: "Lengua azul", frequency_days: 365, route: "SC", dose_standard: "1 mL", notes: "Zonas endémicas con vectores Culicoides." },
  ],

  caprino: [
    { name: "Clostridiosis (multivalente)", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Enterotoxemia es causa frecuente de muerte súbita." },
    { name: "Brucelosis caprina (Rev-1)", frequency_days: 0, route: "SC", dose_standard: "1 mL", notes: "Campaña SENASICA. Dosis completa o reducida conjuntival." },
    { name: "Pasteurelosis", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Prevención de neumonía." },
    { name: "Rabia", frequency_days: 365, route: "IM", dose_standard: "2 mL", notes: "Zonas endémicas." },
    { name: "Linfadenitis caseosa", frequency_days: 365, route: "SC", dose_standard: "1 mL", notes: "Toxoide. Hatos con prevalencia alta." },
    { name: "Artritis-encefalitis caprina (CAE) - diagnóstico", frequency_days: 365, route: "variable", dose_standard: "Prueba serológica", notes: "No hay vacuna. Control por diagnóstico y eliminación." },
  ],

  ave: [
    { name: "Newcastle (La Sota / B1)", frequency_days: 90, route: "ocular", dose_standard: "1 gota/ave", notes: "Primer semana + refuerzos. Campaña SENASICA." },
    { name: "Newcastle (oleosa inactivada)", frequency_days: 0, route: "IM", dose_standard: "0.5 mL", notes: "Refuerzo con vacuna oleosa en ponedoras." },
    { name: "Gumboro (IBD)", frequency_days: 0, route: "ocular", dose_standard: "1 gota/ave", notes: "Semana 1-3 según nivel de anticuerpos maternos." },
    { name: "Bronquitis infecciosa", frequency_days: 90, route: "ocular", dose_standard: "1 gota/ave", notes: "Cepa Massachusetts + variantes regionales." },
    { name: "Viruela aviar", frequency_days: 0, route: "ala", dose_standard: "Punción alar", notes: "Aplicar con aguja doble a las 8-10 semanas." },
    { name: "Marek", frequency_days: 0, route: "SC", dose_standard: "0.2 mL", notes: "Día 1 de edad en incubadora. Serotipo HVT + SB-1." },
    { name: "Influenza aviar (H5N2)", frequency_days: 90, route: "SC", dose_standard: "0.5 mL", notes: "Campaña SENASICA en zonas de riesgo. Inactivada oleosa." },
    { name: "Laringotraqueítis (ILT)", frequency_days: 0, route: "ocular", dose_standard: "1 gota/ave", notes: "Solo en zonas endémicas. CEO o TCO." },
    { name: "Coriza infecciosa (Avibacterium)", frequency_days: 0, route: "IM", dose_standard: "0.5 mL", notes: "Bacterina. 2 dosis en recría." },
  ],

  abeja: [
    { name: "Ácido oxálico (Varroa)", frequency_days: 90, route: "tópica", dose_standard: "3.5% goteo o sublimación", notes: "Tratamiento orgánico aprobado. Aplicar sin miel en alza." },
    { name: "Amitraz - Apivar (Varroa)", frequency_days: 120, route: "tópica", dose_standard: "2 tiras/colmena", notes: "Tratamiento químico. Rotar con orgánicos para evitar resistencia." },
    { name: "Flumetrina - Bayvarol (Varroa)", frequency_days: 120, route: "tópica", dose_standard: "4 tiras/colmena", notes: "Alternativa a amitraz." },
    { name: "Timol (Varroa)", frequency_days: 90, route: "tópica", dose_standard: "Según producto", notes: "Tratamiento orgánico. Temp > 15°C." },
    { name: "Fumagilina (Nosemosis)", frequency_days: 180, route: "oral", dose_standard: "En jarabe 1:1", notes: "Nosema apis/ceranae. Aplicar en otoño." },
    { name: "Oxitetraciclina (Loque americana)", frequency_days: 0, route: "oral", dose_standard: "En azúcar impalpable", notes: "Solo preventivo. Brotes = quema de material." },
  ],

  equido: [
    { name: "Encefalomielitis equina (EEV/EEE/EEO)", frequency_days: 365, route: "IM", dose_standard: "1 mL", notes: "Campaña SENASICA. Trivalente inactivada." },
    { name: "Influenza equina (A1/A2)", frequency_days: 180, route: "IM", dose_standard: "1 mL", notes: "Refuerzo semestral. Obligatorio para movilización." },
    { name: "Tétanos toxoide", frequency_days: 365, route: "IM", dose_standard: "1 mL", notes: "Fundamental en équidos. Refuerzo anual." },
    { name: "Rabia", frequency_days: 365, route: "IM", dose_standard: "2 mL", notes: "Zonas endémicas." },
    { name: "Rinoneumonitis equina (EHV-1/4)", frequency_days: 180, route: "IM", dose_standard: "1 mL", notes: "Yeguas gestantes: meses 5, 7 y 9. Prevención de aborto." },
    { name: "West Nile Virus", frequency_days: 365, route: "IM", dose_standard: "1 mL", notes: "Zonas con presencia de mosquitos vectores." },
    { name: "Estrangol (Streptococcus equi) - intranasal", frequency_days: 365, route: "intranasal", dose_standard: "Según producto", notes: "Vacuna viva modificada intranasal. Potros > 4 meses." },
    { name: "Anemia infecciosa equina (prueba de Coggins)", frequency_days: 365, route: "variable", dose_standard: "Serología", notes: "No hay vacuna. Prueba diagnóstica SENASICA obligatoria." },
  ],

  conejo: [
    { name: "Mixomatosis", frequency_days: 180, route: "SC", dose_standard: "0.5 mL", notes: "Cepa Shope fibroma o heteróloga. Refuerzo semestral." },
    { name: "Enfermedad hemorrágica viral (EHV/RHD)", frequency_days: 180, route: "SC", dose_standard: "0.5 mL", notes: "Variante clásica y RHDV2. Inactivada." },
    { name: "Pasteurelosis (Pasteurella multocida)", frequency_days: 180, route: "SC", dose_standard: "0.5 mL", notes: "Bacterina. Prevención de rinitis y neumonía." },
    { name: "Enterotoxemia (Clostridium spiroforme)", frequency_days: 180, route: "SC", dose_standard: "0.5 mL", notes: "Bacterina-toxoide. Granjas con historial." },
  ],

  diversificado: [
    { name: "Clostridiosis (multivalente)", frequency_days: 180, route: "SC", dose_standard: "2 mL", notes: "Para cérvidos y pecáridos." },
    { name: "Rabia", frequency_days: 365, route: "IM", dose_standard: "2 mL", notes: "Vacuna inactivada. UMAs con contacto humano." },
    { name: "Leptospirosis", frequency_days: 180, route: "IM", dose_standard: "5 mL", notes: "Multiserovar. En UMAs con fuentes de agua." },
    { name: "Tuberculosis (prueba diagnóstica)", frequency_days: 365, route: "intradérmica", dose_standard: "PPD bovina", notes: "Diagnóstico en cérvidos. No hay vacuna aprobada." },
    { name: "Newcastle (avestruces/emúes)", frequency_days: 180, route: "IM", dose_standard: "0.5 mL", notes: "Inactivada oleosa para ratites." },
  ],
};
