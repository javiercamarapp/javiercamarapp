// ---------------------------------------------------------------------------
// Mexican states, municipalities, and common catalog constants
// ---------------------------------------------------------------------------

export interface Municipality {
  name: string;
  clave: string; // INEGI key
}

export interface StateData {
  name: string;
  clave: string; // INEGI 2-digit key
  municipalities: Municipality[];
}

// ---------------------------------------------------------------------------
// Yucatán – 106 municipios
// ---------------------------------------------------------------------------
const YUCATAN_MUNICIPALITIES: Municipality[] = [
  { name: 'Abalá', clave: '001' },
  { name: 'Acanceh', clave: '002' },
  { name: 'Akil', clave: '003' },
  { name: 'Baca', clave: '004' },
  { name: 'Bokobá', clave: '005' },
  { name: 'Buctzotz', clave: '006' },
  { name: 'Cacalchén', clave: '007' },
  { name: 'Calotmul', clave: '008' },
  { name: 'Cansahcab', clave: '009' },
  { name: 'Cantamayec', clave: '010' },
  { name: 'Celestún', clave: '011' },
  { name: 'Cenotillo', clave: '012' },
  { name: 'Conkal', clave: '013' },
  { name: 'Cuncunul', clave: '014' },
  { name: 'Cuzamá', clave: '015' },
  { name: 'Chacsinkín', clave: '016' },
  { name: 'Chankom', clave: '017' },
  { name: 'Chapab', clave: '018' },
  { name: 'Chemax', clave: '019' },
  { name: 'Chicxulub Pueblo', clave: '020' },
  { name: 'Chichimilá', clave: '021' },
  { name: 'Chikindzonot', clave: '022' },
  { name: 'Chocholá', clave: '023' },
  { name: 'Chumayel', clave: '024' },
  { name: 'Dzán', clave: '025' },
  { name: 'Dzemul', clave: '026' },
  { name: 'Dzidzantún', clave: '027' },
  { name: 'Dzilam de Bravo', clave: '028' },
  { name: 'Dzilam González', clave: '029' },
  { name: 'Dzitás', clave: '030' },
  { name: 'Dzoncauich', clave: '031' },
  { name: 'Espita', clave: '032' },
  { name: 'Halachó', clave: '033' },
  { name: 'Hocabá', clave: '034' },
  { name: 'Hoctún', clave: '035' },
  { name: 'Homún', clave: '036' },
  { name: 'Huhí', clave: '037' },
  { name: 'Hunucmá', clave: '038' },
  { name: 'Ixil', clave: '039' },
  { name: 'Izamal', clave: '040' },
  { name: 'Kanasín', clave: '041' },
  { name: 'Kantunil', clave: '042' },
  { name: 'Kaua', clave: '043' },
  { name: 'Kinchil', clave: '044' },
  { name: 'Kopomá', clave: '045' },
  { name: 'Mama', clave: '046' },
  { name: 'Maní', clave: '047' },
  { name: 'Maxcanú', clave: '048' },
  { name: 'Mayapán', clave: '049' },
  { name: 'Mérida', clave: '050' },
  { name: 'Mocochá', clave: '051' },
  { name: 'Motul', clave: '052' },
  { name: 'Muna', clave: '053' },
  { name: 'Muxupip', clave: '054' },
  { name: 'Opichén', clave: '055' },
  { name: 'Oxkutzcab', clave: '056' },
  { name: 'Panabá', clave: '057' },
  { name: 'Peto', clave: '058' },
  { name: 'Progreso', clave: '059' },
  { name: 'Quintana Roo', clave: '060' },
  { name: 'Río Lagartos', clave: '061' },
  { name: 'Sacalum', clave: '062' },
  { name: 'Samahil', clave: '063' },
  { name: 'Sanahcat', clave: '064' },
  { name: 'San Felipe', clave: '065' },
  { name: 'Santa Elena', clave: '066' },
  { name: 'Seyé', clave: '067' },
  { name: 'Sinanché', clave: '068' },
  { name: 'Sotuta', clave: '069' },
  { name: 'Sucilá', clave: '070' },
  { name: 'Sudzal', clave: '071' },
  { name: 'Suma', clave: '072' },
  { name: 'Tahdziú', clave: '073' },
  { name: 'Tahmek', clave: '074' },
  { name: 'Teabo', clave: '075' },
  { name: 'Tecoh', clave: '076' },
  { name: 'Tekal de Venegas', clave: '077' },
  { name: 'Tekantó', clave: '078' },
  { name: 'Tekax', clave: '079' },
  { name: 'Tekit', clave: '080' },
  { name: 'Tekom', clave: '081' },
  { name: 'Telchac Pueblo', clave: '082' },
  { name: 'Telchac Puerto', clave: '083' },
  { name: 'Temax', clave: '084' },
  { name: 'Temozón', clave: '085' },
  { name: 'Tepakán', clave: '086' },
  { name: 'Tetiz', clave: '087' },
  { name: 'Teya', clave: '088' },
  { name: 'Ticul', clave: '089' },
  { name: 'Timucuy', clave: '090' },
  { name: 'Tinum', clave: '091' },
  { name: 'Tixcacalcupul', clave: '092' },
  { name: 'Tixkokob', clave: '093' },
  { name: 'Tixmehuac', clave: '094' },
  { name: 'Tixpéhual', clave: '095' },
  { name: 'Tizimín', clave: '096' },
  { name: 'Tunkás', clave: '097' },
  { name: 'Tzucacab', clave: '098' },
  { name: 'Uayma', clave: '099' },
  { name: 'Ucú', clave: '100' },
  { name: 'Umán', clave: '101' },
  { name: 'Valladolid', clave: '102' },
  { name: 'Xocchel', clave: '103' },
  { name: 'Yaxcabá', clave: '104' },
  { name: 'Yaxkukul', clave: '105' },
  { name: 'Yobaín', clave: '106' },
];

// ---------------------------------------------------------------------------
// Campeche – 11 municipios (legacy; 13 from 2022 on, but 11 core)
// ---------------------------------------------------------------------------
const CAMPECHE_MUNICIPALITIES: Municipality[] = [
  { name: 'Calkiní', clave: '001' },
  { name: 'Campeche', clave: '002' },
  { name: 'Carmen', clave: '003' },
  { name: 'Champotón', clave: '004' },
  { name: 'Hecelchakán', clave: '005' },
  { name: 'Hopelchén', clave: '006' },
  { name: 'Palizada', clave: '007' },
  { name: 'Tenabo', clave: '008' },
  { name: 'Escárcega', clave: '009' },
  { name: 'Calakmul', clave: '010' },
  { name: 'Candelaria', clave: '011' },
];

// ---------------------------------------------------------------------------
// Quintana Roo – 11 municipios
// ---------------------------------------------------------------------------
const QUINTANA_ROO_MUNICIPALITIES: Municipality[] = [
  { name: 'Cozumel', clave: '001' },
  { name: 'Felipe Carrillo Puerto', clave: '002' },
  { name: 'Isla Mujeres', clave: '003' },
  { name: 'Othón P. Blanco', clave: '004' },
  { name: 'Benito Juárez', clave: '005' },
  { name: 'José María Morelos', clave: '006' },
  { name: 'Lázaro Cárdenas', clave: '007' },
  { name: 'Solidaridad', clave: '008' },
  { name: 'Tulum', clave: '009' },
  { name: 'Bacalar', clave: '010' },
  { name: 'Puerto Morelos', clave: '011' },
];

// ---------------------------------------------------------------------------
// Full states map (Peninsula states with full municipios, rest as stubs)
// ---------------------------------------------------------------------------
export const MEXICAN_STATES: Record<string, StateData> = {
  YUC: { name: 'Yucatán', clave: '31', municipalities: YUCATAN_MUNICIPALITIES },
  CAM: { name: 'Campeche', clave: '04', municipalities: CAMPECHE_MUNICIPALITIES },
  ROO: { name: 'Quintana Roo', clave: '23', municipalities: QUINTANA_ROO_MUNICIPALITIES },
};

/** All 32 Mexican state names for dropdowns */
export const ALL_STATE_NAMES: string[] = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

// ---------------------------------------------------------------------------
// Common catalog types
// ---------------------------------------------------------------------------

/** Livestock acquisition method */
export const ACQUISITION_TYPES = [
  'Nacimiento',
  'Compra',
  'Donación',
  'Intercambio',
  'Herencia',
  'Programa de gobierno',
] as const;
export type AcquisitionType = (typeof ACQUISITION_TYPES)[number];

/** Reason for animal departure */
export const DEPARTURE_TYPES = [
  'Venta',
  'Muerte',
  'Sacrificio',
  'Descarte',
  'Robo',
  'Donación',
  'Desconocido',
] as const;
export type DepartureType = (typeof DEPARTURE_TYPES)[number];

/** Feeding system */
export const FEEDING_SYSTEMS = [
  'Pastoreo extensivo',
  'Pastoreo intensivo',
  'Semi-estabulado',
  'Estabulado',
  'Silvopastoril',
  'Traspatio',
] as const;
export type FeedingSystem = (typeof FEEDING_SYSTEMS)[number];

/** Purpose of production */
export const PRODUCTION_PURPOSES = [
  'Carne',
  'Leche',
  'Doble propósito',
  'Pie de cría',
  'Trabajo',
  'Miel',
  'Huevo',
  'Lana/Pelo',
  'Deporte/Exhibición',
] as const;
export type ProductionPurpose = (typeof PRODUCTION_PURPOSES)[number];

/** Unit types for measurements */
export const UNIT_TYPES = {
  weight: ['kg', 'g', 'lb', 'ton'] as const,
  volume: ['L', 'mL', 'gal'] as const,
  area: ['ha', 'm²', 'acres'] as const,
  temperature: ['°C', '°F'] as const,
  currency: ['MXN', 'USD'] as const,
};
export type WeightUnit = (typeof UNIT_TYPES.weight)[number];
export type VolumeUnit = (typeof UNIT_TYPES.volume)[number];
export type AreaUnit = (typeof UNIT_TYPES.area)[number];
export type CurrencyUnit = (typeof UNIT_TYPES.currency)[number];

/** Identification types for Mexican livestock */
export const IDENTIFICATION_TYPES = [
  'SINIIGA',
  'Arete',
  'Tatuaje',
  'Microchip',
  'Fierro',
  'Nombre',
  'Otro',
] as const;
export type IdentificationType = (typeof IDENTIFICATION_TYPES)[number];

/** Get municipalities for a state key */
export function getMunicipalities(stateKey: string): Municipality[] {
  return MEXICAN_STATES[stateKey]?.municipalities ?? [];
}

/** Find a state by name */
export function findStateByName(name: string): StateData | undefined {
  return Object.values(MEXICAN_STATES).find(
    (s) => s.name.toLowerCase() === name.toLowerCase(),
  );
}
