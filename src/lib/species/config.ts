// ---------------------------------------------------------------------------
// Complete species configuration for all 9 supported species
// ---------------------------------------------------------------------------

import type {
  SpeciesConfig,
  SpeciesConfigRecord,
  SpeciesId,
} from '@/types/species';

export const SPECIES_CONFIG: SpeciesConfigRecord = {
  // -------------------------------------------------------------------------
  // BOVINO
  // -------------------------------------------------------------------------
  bovino: {
    id: 'bovino',
    name: 'Bovino',
    namePlural: 'Bovinos',
    icon: '🐄',
    gestationDays: 283,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: true,
    categories: [
      'becerro',
      'becerra',
      'novillo',
      'vaquilla',
      'torete',
      'vaca',
      'toro',
      'semental',
    ],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'seca', 'servida', 'en_celo', 'prepúber'],
    defaultVaccines: [
      { name: 'Brucelosis (RB51)', frequencyDays: 0, speciesSpecific: true },
      { name: 'Clostridiosis (7 vías)', frequencyDays: 180, speciesSpecific: false },
      { name: 'Rabia paralítica bovina', frequencyDays: 365, speciesSpecific: true },
      { name: 'Carbunco bacteridiano (Ántrax)', frequencyDays: 365, speciesSpecific: false },
      { name: 'IBR-DVB-PI3-BRSV', frequencyDays: 180, speciesSpecific: true },
      { name: 'Leptospirosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Pasteurelosis', frequencyDays: 180, speciesSpecific: true },
      { name: 'Derriengue', frequencyDays: 365, speciesSpecific: true },
    ],
    breeds: [
      'Brahman',
      'Cebú',
      'Suizo',
      'Holstein',
      'Charolais',
      'Simmental',
      'Angus',
      'Hereford',
      'Limousin',
      'Gyr',
      'Sardo Negro',
      'Nelore',
      'Indubrasil',
      'Criollo',
      'F1',
    ],
    kpiFields: [
      { key: 'birthRate', label: 'Tasa de parición', unit: '%', description: 'Partos / vacas expuestas' },
      { key: 'weaningRate', label: 'Tasa de destete', unit: '%', description: 'Destetados / nacidos vivos' },
      { key: 'mortalityRate', label: 'Tasa de mortalidad', unit: '%', description: 'Muertes / inventario total' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'kg/día', description: 'Ganancia diaria de peso promedio' },
      { key: 'weaningWeight205', label: 'Peso ajustado 205d', unit: 'kg', description: 'Peso al destete ajustado a 205 días' },
      { key: 'yearlingWeight365', label: 'Peso ajustado 365d', unit: 'kg', description: 'Peso al año ajustado a 365 días' },
      { key: 'milkProduction', label: 'Producción de leche', unit: 'L/día', description: 'Litros promedio por vaca por día' },
      { key: 'openDays', label: 'Días abiertos promedio', unit: 'días', description: 'Parto a nueva concepción' },
      { key: 'calvingInterval', label: 'Intervalo entre partos', unit: 'días', description: 'Parto a parto' },
      { key: 'conceptionRate', label: 'Tasa de concepción', unit: '%', description: 'Concepciones / servicios' },
    ],
  },

  // -------------------------------------------------------------------------
  // PORCINO
  // -------------------------------------------------------------------------
  porcino: {
    id: 'porcino',
    name: 'Porcino',
    namePlural: 'Porcinos',
    icon: '🐷',
    gestationDays: 114,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['lechón', 'cerda', 'verraco', 'novillo'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'servida', 'en_celo', 'prepúber'],
    defaultVaccines: [
      { name: 'Fiebre porcina clásica (PPC)', frequencyDays: 180, speciesSpecific: true },
      { name: 'Aujeszky', frequencyDays: 180, speciesSpecific: true },
      { name: 'Mycoplasma hyopneumoniae', frequencyDays: 0, speciesSpecific: true },
      { name: 'Circovirus porcino (PCV2)', frequencyDays: 0, speciesSpecific: true },
      { name: 'PRRS', frequencyDays: 180, speciesSpecific: true },
      { name: 'Parvovirus porcino', frequencyDays: 180, speciesSpecific: true },
      { name: 'Leptospirosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Erisipela porcina', frequencyDays: 180, speciesSpecific: true },
    ],
    breeds: [
      'Yorkshire',
      'Landrace',
      'Duroc',
      'Hampshire',
      'Pietrain',
      'Pelón Mexicano',
      'Línea terminal F1',
    ],
    kpiFields: [
      { key: 'littersPerYear', label: 'Partos/cerda/año', unit: 'partos', description: 'Número de partos por cerda por año' },
      { key: 'bornAlivePerLitter', label: 'Nacidos vivos/camada', unit: 'crías', description: 'Lechones nacidos vivos por parto' },
      { key: 'weanedPerLitter', label: 'Destetados/camada', unit: 'crías', description: 'Lechones destetados por parto' },
      { key: 'preWeaningMortality', label: 'Mortalidad pre-destete', unit: '%', description: 'Muertes antes del destete' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'kg/día', description: 'Ganancia diaria de peso promedio' },
      { key: 'feedConversion', label: 'Conversión alimenticia', unit: 'kg/kg', description: 'kg alimento / kg ganancia' },
      { key: 'daysToMarket', label: 'Días a mercado', unit: 'días', description: 'Días al peso de mercado (100-110 kg)' },
      { key: 'nonProductiveDays', label: 'Días no productivos', unit: 'días', description: 'Días sin gestación ni lactancia' },
    ],
  },

  // -------------------------------------------------------------------------
  // OVINO
  // -------------------------------------------------------------------------
  ovino: {
    id: 'ovino',
    name: 'Ovino',
    namePlural: 'Ovinos',
    icon: '🐑',
    gestationDays: 150,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['cría', 'cordero', 'borrega', 'carnero', 'semental'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'seca', 'servida', 'en_celo', 'prepúber'],
    defaultVaccines: [
      { name: 'Clostridiosis (8 vías)', frequencyDays: 180, speciesSpecific: false },
      { name: 'Rabia', frequencyDays: 365, speciesSpecific: false },
      { name: 'Pasteurelosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Brucelosis (Rev-1)', frequencyDays: 0, speciesSpecific: true },
      { name: 'Ectima contagioso', frequencyDays: 0, speciesSpecific: true },
    ],
    breeds: [
      'Pelibuey',
      'Blackbelly',
      'Dorper',
      'Katahdin',
      'Suffolk',
      'Hampshire',
      'Texel',
      'Criollo',
    ],
    kpiFields: [
      { key: 'lambingRate', label: 'Tasa de parición', unit: '%', description: 'Corderos nacidos / ovejas expuestas' },
      { key: 'prolificacy', label: 'Prolificidad', unit: 'crías/parto', description: 'Crías nacidas por parto' },
      { key: 'weaningRate', label: 'Tasa de destete', unit: '%', description: 'Destetados / nacidos vivos' },
      { key: 'mortalityRate', label: 'Mortalidad', unit: '%', description: 'Muertes / inventario' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'kg/día', description: 'Ganancia diaria de peso' },
      { key: 'lambingInterval', label: 'Intervalo entre partos', unit: 'días', description: 'Parto a parto' },
    ],
  },

  // -------------------------------------------------------------------------
  // CAPRINO
  // -------------------------------------------------------------------------
  caprino: {
    id: 'caprino',
    name: 'Caprino',
    namePlural: 'Caprinos',
    icon: '🐐',
    gestationDays: 150,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: true,
    categories: ['cabrito', 'cabra', 'macho_cabrío', 'semental'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'seca', 'servida', 'en_celo', 'prepúber'],
    defaultVaccines: [
      { name: 'Clostridiosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Brucelosis (Rev-1)', frequencyDays: 0, speciesSpecific: true },
      { name: 'Pasteurelosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Rabia', frequencyDays: 365, speciesSpecific: false },
      { name: 'Linfadenitis caseosa', frequencyDays: 365, speciesSpecific: true },
    ],
    breeds: [
      'Boer',
      'Nubia',
      'Saanen',
      'Alpina',
      'Toggenburg',
      'Anglo-Nubian',
      'Criollo',
    ],
    kpiFields: [
      { key: 'kiddingRate', label: 'Tasa de parición', unit: '%', description: 'Cabritos nacidos / cabras expuestas' },
      { key: 'prolificacy', label: 'Prolificidad', unit: 'crías/parto', description: 'Crías por parto' },
      { key: 'milkProduction', label: 'Producción de leche', unit: 'L/día', description: 'Litros promedio por cabra por día' },
      { key: 'mortalityRate', label: 'Mortalidad', unit: '%', description: 'Muertes / inventario' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'kg/día', description: 'Ganancia diaria de peso' },
      { key: 'lactationLength', label: 'Duración de lactancia', unit: 'días', description: 'Días en ordeña por lactancia' },
    ],
  },

  // -------------------------------------------------------------------------
  // AVE
  // -------------------------------------------------------------------------
  ave: {
    id: 'ave',
    name: 'Ave',
    namePlural: 'Aves',
    icon: '🐔',
    gestationDays: 21,
    managementType: 'lot',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['pollito', 'gallina', 'gallo', 'pollo_engorda'],
    reproductiveStates: ['puesta', 'incubando', 'en_producción', 'inactiva', 'prepúber'],
    defaultVaccines: [
      { name: 'Newcastle', frequencyDays: 90, speciesSpecific: true },
      { name: 'Gumboro (IBD)', frequencyDays: 0, speciesSpecific: true },
      { name: 'Bronquitis infecciosa', frequencyDays: 90, speciesSpecific: true },
      { name: 'Viruela aviar', frequencyDays: 0, speciesSpecific: true },
      { name: 'Marek', frequencyDays: 0, speciesSpecific: true },
      { name: 'Influenza aviar', frequencyDays: 90, speciesSpecific: true },
      { name: 'Laringotraqueítis (ILT)', frequencyDays: 0, speciesSpecific: true },
    ],
    breeds: [
      'Rhode Island Red',
      'Plymouth Rock',
      'Leghorn',
      'ISA Brown',
      'Ross 308',
      'Cobb 500',
      'Hubbard',
      'Criollo',
    ],
    kpiFields: [
      { key: 'layRate', label: 'Tasa de postura', unit: '%', description: 'Huevos / gallina / día × 100' },
      { key: 'feedConversion', label: 'Conversión alimenticia', unit: 'kg/kg', description: 'kg alimento / kg huevo o carne' },
      { key: 'mortalityRate', label: 'Mortalidad acumulada', unit: '%', description: 'Muertes / aves alojadas' },
      { key: 'avgDailyGain', label: 'GDP promedio (engorda)', unit: 'g/día', description: 'Ganancia diaria de peso en engorda' },
      { key: 'hatchability', label: 'Incubabilidad', unit: '%', description: 'Pollitos nacidos / huevos fértiles' },
      { key: 'eggsPerHen', label: 'Huevos/gallina/ciclo', unit: 'huevos', description: 'Producción total por gallina por ciclo' },
    ],
  },

  // -------------------------------------------------------------------------
  // ABEJA
  // -------------------------------------------------------------------------
  abeja: {
    id: 'abeja',
    name: 'Abeja',
    namePlural: 'Abejas',
    icon: '🐝',
    gestationDays: 0,
    managementType: 'hive',
    hasReproduction: false,
    hasWeights: false,
    hasMilk: false,
    categories: ['colmena', 'núcleo'],
    reproductiveStates: [],
    defaultVaccines: [
      { name: 'Tratamiento Varroa (ácido oxálico)', frequencyDays: 90, speciesSpecific: true },
      { name: 'Tratamiento Varroa (amitraz)', frequencyDays: 120, speciesSpecific: true },
      { name: 'Tratamiento loque americana', frequencyDays: 0, speciesSpecific: true },
      { name: 'Tratamiento nosemosis', frequencyDays: 180, speciesSpecific: true },
    ],
    breeds: [
      'Italiana',
      'Carniola',
      'Africanizada',
      'Melipona beecheii (Xunan Kab)',
    ],
    kpiFields: [
      { key: 'honeyYield', label: 'Producción de miel', unit: 'kg/colmena/año', description: 'Kilos de miel por colmena al año' },
      { key: 'colonyLoss', label: 'Pérdida de colonias', unit: '%', description: 'Colonias perdidas / colonias totales' },
      { key: 'varroaLevel', label: 'Nivel de Varroa', unit: '%', description: 'Porcentaje de infestación' },
      { key: 'queenAge', label: 'Edad promedio de reinas', unit: 'meses', description: 'Meses de edad promedio de las reinas' },
      { key: 'swarmingRate', label: 'Tasa de enjambrazón', unit: '%', description: 'Colmenas que enjambraron / total' },
      { key: 'waxProduction', label: 'Producción de cera', unit: 'kg/colmena/año', description: 'Kilos de cera por colmena al año' },
    ],
  },

  // -------------------------------------------------------------------------
  // EQUIDO
  // -------------------------------------------------------------------------
  equido: {
    id: 'equido',
    name: 'Équido',
    namePlural: 'Équidos',
    icon: '🐴',
    gestationDays: 340,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['potro', 'yegua', 'caballo', 'semental'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'seca', 'servida', 'en_celo', 'prepúber'],
    defaultVaccines: [
      { name: 'Encefalomielitis equina (EEV/EEE/EEO)', frequencyDays: 365, speciesSpecific: true },
      { name: 'Influenza equina', frequencyDays: 180, speciesSpecific: true },
      { name: 'Tétanos', frequencyDays: 365, speciesSpecific: false },
      { name: 'Rabia', frequencyDays: 365, speciesSpecific: false },
      { name: 'Rinoneumonitis (EHV-1/4)', frequencyDays: 180, speciesSpecific: true },
      { name: 'West Nile', frequencyDays: 365, speciesSpecific: true },
    ],
    breeds: [
      'Cuarto de Milla',
      'Criollo',
      'Azteca',
      'Pura Sangre',
      'Appaloosa',
      'Árabe',
      'Mula',
      'Burro',
    ],
    kpiFields: [
      { key: 'foalingRate', label: 'Tasa de parición', unit: '%', description: 'Potros nacidos / yeguas servidas' },
      { key: 'mortalityRate', label: 'Mortalidad', unit: '%', description: 'Muertes / inventario' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'kg/día', description: 'Ganancia diaria de peso' },
      { key: 'bodyConditionScore', label: 'Condición corporal prom.', unit: 'puntos', description: 'Escala 1-9 de Henneke' },
      { key: 'conceptionRate', label: 'Tasa de concepción', unit: '%', description: 'Concepciones / servicios' },
    ],
  },

  // -------------------------------------------------------------------------
  // CONEJO
  // -------------------------------------------------------------------------
  conejo: {
    id: 'conejo',
    name: 'Conejo',
    namePlural: 'Conejos',
    icon: '🐇',
    gestationDays: 31,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['gazapo', 'coneja', 'conejo_semental'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'servida', 'prepúber'],
    defaultVaccines: [
      { name: 'Mixomatosis', frequencyDays: 180, speciesSpecific: true },
      { name: 'Enfermedad hemorrágica viral (EHV)', frequencyDays: 180, speciesSpecific: true },
      { name: 'Pasteurelosis', frequencyDays: 180, speciesSpecific: false },
    ],
    breeds: [
      'Nueva Zelanda',
      'California',
      'Rex',
      'Chinchilla',
      'Angora',
      'Holandés',
      'Criollo',
    ],
    kpiFields: [
      { key: 'littersPerYear', label: 'Partos/coneja/año', unit: 'partos', description: 'Partos por coneja por año' },
      { key: 'bornAlivePerLitter', label: 'Nacidos vivos/camada', unit: 'crías', description: 'Gazapos nacidos vivos por parto' },
      { key: 'weanedPerLitter', label: 'Destetados/camada', unit: 'crías', description: 'Gazapos destetados por parto' },
      { key: 'mortalityRate', label: 'Mortalidad', unit: '%', description: 'Muertes / inventario' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'g/día', description: 'Ganancia diaria de peso' },
      { key: 'feedConversion', label: 'Conversión alimenticia', unit: 'kg/kg', description: 'kg alimento / kg ganancia' },
      { key: 'daysToMarket', label: 'Días a mercado', unit: 'días', description: 'Días al peso de mercado (2-2.5 kg)' },
    ],
  },

  // -------------------------------------------------------------------------
  // DIVERSIFICADO
  // -------------------------------------------------------------------------
  diversificado: {
    id: 'diversificado',
    name: 'Diversificado',
    namePlural: 'Diversificados',
    icon: '🦌',
    gestationDays: 200,
    managementType: 'individual',
    hasReproduction: true,
    hasWeights: true,
    hasMilk: false,
    categories: ['cría', 'juvenil', 'adulto', 'semental'],
    reproductiveStates: ['vacía', 'gestante', 'lactando', 'seca', 'servida', 'prepúber'],
    defaultVaccines: [
      { name: 'Clostridiosis', frequencyDays: 180, speciesSpecific: false },
      { name: 'Rabia', frequencyDays: 365, speciesSpecific: false },
      { name: 'Leptospirosis', frequencyDays: 180, speciesSpecific: false },
    ],
    breeds: [
      'Venado cola blanca',
      'Pecarí de collar',
      'Avestruz africano',
    ],
    kpiFields: [
      { key: 'birthRate', label: 'Tasa de natalidad', unit: '%', description: 'Nacimientos / hembras reproductoras' },
      { key: 'mortalityRate', label: 'Mortalidad', unit: '%', description: 'Muertes / inventario' },
      { key: 'avgDailyGain', label: 'GDP promedio', unit: 'g/día', description: 'Ganancia diaria de peso' },
      { key: 'survivalRate', label: 'Tasa de supervivencia', unit: '%', description: 'Sobrevivientes al año / nacidos' },
    ],
  },
} as const satisfies SpeciesConfigRecord;

/** Ordered list of species IDs */
export const SPECIES_IDS = Object.keys(SPECIES_CONFIG) as SpeciesId[];

/** Get config for a given species */
export function getSpeciesConfig(id: SpeciesId): SpeciesConfig {
  return SPECIES_CONFIG[id];
}

/** Get all breed names for a species */
export function getBreeds(id: SpeciesId): readonly string[] {
  return SPECIES_CONFIG[id].breeds;
}

/** Check if a species uses individual animal tracking */
export function isIndividualManagement(id: SpeciesId): boolean {
  return SPECIES_CONFIG[id].managementType === 'individual';
}
