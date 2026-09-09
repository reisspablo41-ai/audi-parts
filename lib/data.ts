import type { Vehicle, Category, Part, Review, Testimonial } from './types'

export const AUDI_MODELS = [
  'A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
  'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron GT',
]

export const AUDI_YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i)

export const ENGINE_OPTIONS: Record<string, string[]> = {
  A1: ['1.0 TFSI (CHZB)', '1.4 TFSI (CZCA)', '1.6 TDI (CAYC)'],
  A3: ['1.4 TFSI (CZEA)', '2.0 TFSI (EA888 Gen3)', '2.0 TDI (DEJA)'],
  A4: [
    '1.8 TFSI (EA888 Gen2)',
    '2.0 TFSI (EA888 Gen3)',
    '3.0 TFSI V6 (EA839)',
    '2.0 TDI (EA288)',
    '3.0 TDI V6 (CRTD)',
  ],
  A5: ['2.0 TFSI (EA888 Gen3)', '3.0 TFSI V6 (CREC)', '2.0 TDI (DETA)'],
  A6: ['2.0 TFSI (EA888 Gen3)', '3.0 TFSI V6 (EA839)', '3.0 TDI V6 (CDUC)'],
  A7: ['3.0 TFSI V6 (EA839)', '3.0 TDI V6 (CRTC)'],
  A8: ['3.0 TFSI V6 (EA839)', '4.0 TFSI V8 (EA825)', '4.2 FSI V8 (BVJ)'],
  Q2: ['1.4 TFSI (CZDA)', '2.0 TDI (DFGA)'],
  Q3: ['1.4 TFSI (CZDA)', '2.0 TFSI (EA888 Gen3)', '2.0 TDI (EA288)'],
  Q5: ['2.0 TFSI (EA888 Gen3)', '3.0 TFSI V6 (EA839)', '2.0 TDI (EA288)'],
  Q7: ['3.0 TFSI V6 (EA839)', '3.0 TDI V6 (CRCA)', '4.2 FSI V8 (BAR)'],
  Q8: ['3.0 TFSI V6 (EA839)', '4.0 TFSI V8 (EA825)'],
  TT: ['1.8 TFSI (CJSA)', '2.0 TFSI (EA888 Gen3)', '2.5 TFSI 5-Cyl (DAZA)'],
  R8: ['4.2 FSI V8 (BYH)', '5.2 FSI V10 (CTPA)'],
  'e-tron GT': ['Dual-Motor Electric (EASA)'],
}

function a4(year: number, disp: string, code: string, engine: string): Vehicle {
  return { id: `a4-${year}-${disp}-${code}`, year, make: 'Audi', model: 'A4', engine }
}

/**
 * The A4 is the house model — the full generation ladder is enumerated so the
 * homepage fitment picker can offer every year/engine pairing B5 through B9.
 */
const a4Vehicles: Vehicle[] = [
  // B9 (2016–2024)
  ...[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].flatMap((y) => [
    a4(y, '20', 'ea888', '2.0 TFSI (EA888 Gen3)'),
    a4(y, '20d', 'ea288', '2.0 TDI (EA288)'),
    a4(y, '30d', 'crtd', '3.0 TDI V6 (CRTD)'),
  ]),
  // B8 / B8.5 (2008–2015)
  ...[2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015].flatMap((y) => [
    a4(y, '18', 'cabb', '1.8 TFSI (CABB)'),
    a4(y, '20', 'cdnc', '2.0 TFSI (CDNC)'),
    a4(y, '32', 'cala', '3.2 FSI V6 (CALA)'),
  ]),
  // B7 (2005–2008)
  ...[2005, 2006, 2007].flatMap((y) => [
    a4(y, '20', 'bwe', '2.0 TFSI (BWE)'),
    a4(y, '18t', 'bfb', '1.8 T (BFB)'),
    a4(y, '32', 'auk', '3.2 FSI V6 (AUK)'),
  ]),
  // B6 (2001–2005)
  ...[2001, 2002, 2003, 2004].flatMap((y) => [
    a4(y, '18t', 'amb', '1.8 T (AMB)'),
    a4(y, '20', 'alt', '2.0 FSI (ALT)'),
    a4(y, '25d', 'bdg', '2.5 TDI V6 (BDG)'),
  ]),
  // B5 (1995–2001)
  ...[1995, 1996, 1997, 1998, 1999, 2000].flatMap((y) => [
    a4(y, '18t', 'aeb', '1.8 T (AEB)'),
    a4(y, '28', 'amx', '2.8 V6 (AMX)'),
    a4(y, '19d', 'afn', '1.9 TDI (AFN)'),
  ]),
]

export const vehicles: Vehicle[] = [
  ...a4Vehicles,
  { id: 'a3-2019-20', year: 2019, make: 'Audi', model: 'A3', engine: '2.0 TFSI (EA888 Gen3)' },
  { id: 'a6-2020-30t', year: 2020, make: 'Audi', model: 'A6', engine: '3.0 TFSI V6 (EA839)' },
  { id: 'q5-2021-20', year: 2021, make: 'Audi', model: 'Q5', engine: '2.0 TFSI (EA888 Gen3)' },
  { id: 'q7-2022-30d', year: 2022, make: 'Audi', model: 'Q7', engine: '3.0 TDI V6 (CRCA)' },
  { id: 'tt-2018-25t', year: 2018, make: 'Audi', model: 'TT', engine: '2.5 TFSI 5-Cyl (DAZA)' },
  { id: 'r8-2017-52', year: 2017, make: 'Audi', model: 'R8', engine: '5.2 FSI V10 (CTPA)' },
]

export const categories: Category[] = [
  { id: 'engine', name: 'Engine', slug: 'engine', description: 'Timing chain kits, water pumps, PCV valves, oil separators, and internal engine components.', icon: '⚙️', partCount: 842 },
  { id: 'transmission', name: 'Transmission', slug: 'transmission', description: 'S tronic and multitronic components, clutch kits, quattro driveline, and mechatronic units.', icon: '🔧', partCount: 314 },
  { id: 'suspension', name: 'Suspension', slug: 'suspension', description: 'Adaptive dampers, air springs, control arms, tie rods, and bushings.', icon: '🛞', partCount: 526 },
  { id: 'brakes', name: 'Brakes', slug: 'brakes', description: 'Brake pads, vented discs, calipers, wear sensors, and electronic parking brake motors.', icon: '🔴', partCount: 398 },
  { id: 'electrical', name: 'Electrical', slug: 'electrical', description: 'Alternators, ignition coils, MAF and NOx sensors, control modules, and wiring looms.', icon: '⚡', partCount: 673 },
  { id: 'body', name: 'Body & Exterior', slug: 'body', description: 'Bumpers, Singleframe grilles, mirrors, LED headlamp units, and exterior trim.', icon: '🚗', partCount: 1204 },
  { id: 'cooling', name: 'Cooling', slug: 'cooling', description: 'Radiators, thermostat housings, intercoolers, coolant hoses, and electric fans.', icon: '❄️', partCount: 211 },
  { id: 'fuel', name: 'Fuel System', slug: 'fuel', description: 'High-pressure fuel pumps, injectors, filters, and fuel rails for TFSI and TDI engines.', icon: '⛽', partCount: 189 },
]

export const parts: Part[] = [
  {
    sku: 'AUD-WP-EA888-OEM',
    name: 'Water Pump & Thermostat Module – 2.0 TFSI EA888',
    description: 'Genuine Audi water pump and integrated thermostat housing for the EA888 Gen3 2.0 TFSI. The original composite housing is a known failure point at high mileage; this is the revised part with the updated seal. Direct fit, no modification required.',
    price: 189.95,
    compareAtPrice: 249.0,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '06L 121 111 I',
    oemCrossReference: '06L 121 111 H, 06L 121 111 G',
    weight: '1.4 kg',
    material: 'Reinforced composite housing, aluminium impeller',
    fitment: ['a4-2018-20-ea888'],
    images: ['/parts/water-pump-main.jpg'],
    inStock: true,
    stockCount: 23,
    rating: 4.8,
    reviewCount: 47,
    relatedSkus: ['AUD-TCK-EA888-OEM', 'AUD-THERM-EA888-OEM'],
    tags: ['cooling', 'engine', 'OEM', 'a4', 'tfsi'],
  },
  {
    sku: 'AUD-TCK-EA888-OEM',
    name: 'Timing Chain Kit – 2.0 TFSI EA888 Gen3',
    description: 'Complete timing chain service kit for the EA888 Gen3. Includes chain, revised hydraulic tensioner, guide rails, and all hardware. The updated tensioner resolves the chain-slap and cold-start rattle common on earlier builds.',
    price: 328.0,
    compareAtPrice: 415.0,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '06K 109 158 AB',
    oemCrossReference: '06K 109 158 P, 06H 109 467 AE',
    weight: '1.1 kg',
    material: 'Hardened steel chain, composite guides',
    fitment: ['a4-2018-20-ea888', 'a4-2012-20-cdnc'],
    images: ['/parts/timing-chain-main.jpg'],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviewCount: 22,
    relatedSkus: ['AUD-WP-EA888-OEM', 'AUD-PCV-EA888-OEM'],
    tags: ['engine', 'timing', 'OEM', 'tfsi'],
  },
  {
    sku: 'AUD-PCV-EA888-OEM',
    name: 'PCV Valve / Oil Separator – 2.0 TFSI',
    description: 'Genuine Audi crankcase ventilation valve with integrated oil separator. A split PCV diaphragm causes rough idle, a lean-running fault code, and oil consumption — this is the direct factory replacement.',
    price: 96.5,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '06H 103 495 AE',
    oemCrossReference: '06H 103 495 AC, 06H 103 495 T',
    weight: '0.5 kg',
    material: 'Glass-filled nylon, silicone diaphragm',
    fitment: ['a4-2018-20-ea888', 'a3-2019-20', 'q5-2021-20'],
    images: ['/parts/pcv-valve-main.jpg'],
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 31,
    relatedSkus: ['AUD-TCK-EA888-OEM', 'AUD-WP-EA888-OEM'],
    tags: ['engine', 'OEM', 'tfsi'],
  },
  {
    sku: 'AUD-BP-B9-FRONT-OEM',
    name: 'Front Brake Pad Set – A4 B9 2016–2024',
    description: 'Genuine Audi front brake pads for the B9 A4 with 320 mm front discs. Low-dust ceramic-organic compound with the factory wear-sensor cut-out. Matches original stopping distance and pedal feel exactly.',
    price: 118.9,
    brand: 'Genuine OEM',
    category: 'Brakes',
    categoryId: 'brakes',
    partNumber: '8W0 698 151 AG',
    oemCrossReference: '8W0 698 151 R, 8W0 698 151 AF',
    weight: '2.9 kg',
    material: 'Ceramic-organic compound',
    fitment: ['a4-2018-20-ea888', 'a4-2020-20d-ea288'],
    images: ['/parts/brake-pads-main.jpg'],
    inStock: true,
    stockCount: 42,
    rating: 4.8,
    reviewCount: 89,
    relatedSkus: ['AUD-DISC-B9-FRONT-OEM'],
    tags: ['brakes', 'A4', 'OEM'],
  },
  {
    sku: 'AUD-DISC-B9-FRONT-OEM',
    name: 'Front Brake Disc – A4 B9 320 mm Vented',
    description: 'OEM-specification vented front brake disc for the A4 B9 and A5 F5. Precision-machined and corrosion-coated on the hub face for zero runout and extended pad life. Sold individually.',
    price: 142.0,
    compareAtPrice: 179.0,
    brand: 'Genuine OEM',
    category: 'Brakes',
    categoryId: 'brakes',
    partNumber: '8W0 615 301 F',
    weight: '9.2 kg',
    material: 'Grey cast iron, corrosion-protected',
    fitment: ['a4-2018-20-ea888', 'a4-2020-20d-ea288'],
    images: ['/parts/brake-disc-main.jpg'],
    inStock: true,
    stockCount: 19,
    rating: 4.6,
    reviewCount: 38,
    relatedSkus: ['AUD-BP-B9-FRONT-OEM'],
    tags: ['brakes', 'disc', 'A4'],
  },
  {
    sku: 'AUD-STRUT-Q7-FRONT',
    name: 'Front Air Suspension Strut – Q7 4M',
    description: 'Complete front adaptive air suspension strut for the Q7 4M with adaptive air suspension. Includes air spring, damper, and top mount, pre-assembled and ready to install. Supplied with a new mounting kit.',
    price: 689.0,
    brand: 'Genuine OEM',
    category: 'Suspension',
    categoryId: 'suspension',
    partNumber: '4M0 616 039 AR',
    weight: '9.8 kg',
    material: 'Reinforced rubber bellows, aluminium body',
    fitment: ['q7-2022-30d'],
    images: ['/parts/air-strut-main.jpg'],
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    reviewCount: 14,
    relatedSkus: [],
    tags: ['suspension', 'Q7', 'OEM', 'air suspension'],
  },
  {
    sku: 'AUD-ALT-EA888-AFT',
    name: 'Alternator 180A – 2.0 TFSI (Aftermarket)',
    description: 'High-output 180 A alternator compatible with EA888 2.0 TFSI models. Remanufactured to OEM specification with new bearings, regulator, and clutch pulley. Two-year warranty and a substantial saving over the genuine unit.',
    price: 289.0,
    compareAtPrice: 520.0,
    brand: 'Aftermarket',
    category: 'Electrical',
    categoryId: 'electrical',
    partNumber: '06L 903 026 S-RM',
    oemCrossReference: '06L 903 026 S, 06L 903 026 F',
    weight: '6.1 kg',
    material: 'Copper windings, aluminium housing',
    fitment: ['a4-2018-20-ea888', 'q5-2021-20'],
    images: ['/parts/alternator-main.jpg'],
    inStock: true,
    stockCount: 6,
    rating: 4.4,
    reviewCount: 27,
    relatedSkus: ['AUD-COIL-EA888-OEM'],
    tags: ['electrical', 'alternator', 'aftermarket'],
  },
  {
    sku: 'AUD-COIL-EA888-OEM',
    name: 'Ignition Coil Pack – TFSI (Set of 4)',
    description: 'Genuine Audi ignition coils, latest revision, supplied as a matched set of four. Fits the full TFSI range. Replacing all four together avoids the repeat misfire that follows swapping a single failed coil.',
    price: 168.0,
    brand: 'Genuine OEM',
    category: 'Electrical',
    categoryId: 'electrical',
    partNumber: '06L 905 110 K',
    oemCrossReference: '06L 905 110 J, 06H 905 110 R',
    weight: '0.8 kg',
    material: 'Epoxy-encapsulated windings',
    fitment: ['a4-2018-20-ea888', 'a3-2019-20', 'q5-2021-20', 'tt-2018-25t'],
    images: ['/parts/ignition-coil-main.jpg'],
    inStock: true,
    stockCount: 54,
    rating: 4.7,
    reviewCount: 63,
    relatedSkus: ['AUD-ALT-EA888-AFT'],
    tags: ['electrical', 'ignition', 'OEM'],
  },
  {
    sku: 'AUD-THERM-EA888-OEM',
    name: 'Thermostat Housing – 2.0 TFSI / 1.8 TFSI',
    description: 'Genuine Audi thermostat and housing assembly with integrated coolant temperature sensor. Opens at 87 °C for correct warm-up and emissions behaviour. Fits the full EA888 four-cylinder range.',
    price: 84.5,
    brand: 'Genuine OEM',
    category: 'Cooling',
    categoryId: 'cooling',
    partNumber: '06H 121 026 CQ',
    weight: '0.6 kg',
    material: 'Composite housing, brass insert',
    fitment: ['a4-2018-20-ea888', 'a4-2012-20-cdnc', 'a3-2019-20'],
    images: ['/parts/thermostat-main.jpg'],
    inStock: true,
    stockCount: 54,
    rating: 4.7,
    reviewCount: 63,
    relatedSkus: ['AUD-WP-EA888-OEM'],
    tags: ['cooling', 'OEM'],
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    sku: 'AUD-WP-EA888-OEM',
    author: 'Dave M.',
    rating: 5,
    title: 'Perfect fit, no leaks',
    body: 'Replaced the failing pump on a 2018 A4 B9 2.0 TFSI. Part number matched the old unit exactly and the revised housing went straight on. Coolant temp is stable again. Worth going genuine for this job.',
    date: '2026-02-14',
    verified: true,
  },
  {
    id: 'r2',
    sku: 'AUD-WP-EA888-OEM',
    author: 'Sarah K.',
    rating: 5,
    title: 'Arrived fast, genuine Audi packaging',
    body: 'Came in the genuine Audi box with the correct O-rings included. Next-day delivery as promised. Very happy.',
    date: '2026-01-30',
    verified: true,
  },
  {
    id: 'r3',
    sku: 'AUD-BP-B9-FRONT-OEM',
    author: 'James L.',
    rating: 5,
    title: 'Silent, and the dust is gone',
    body: 'Swapped the worn pads on my B9 A4. No squeal, strong initial bite, and noticeably less brake dust on the wheels than the last aftermarket set I tried.',
    date: '2026-03-05',
    verified: true,
  },
]

export function getPartBySku(sku: string): Part | undefined {
  return parts.find((p) => p.sku === sku)
}

export function getPartsByCategory(categoryId: string): Part[] {
  return parts.filter((p) => p.categoryId === categoryId)
}

export function getCompatibleParts(vehicleId: string): Part[] {
  return parts.filter((p) => p.fitment.includes(vehicleId))
}

export function getRelatedParts(sku: string): Part[] {
  const part = getPartBySku(sku)
  if (!part?.relatedSkus?.length) return []
  return part.relatedSkus.map((s) => getPartBySku(s)).filter(Boolean) as Part[]
}

export function checkFitment(sku: string, vehicleId: string): boolean {
  const part = getPartBySku(sku)
  return part?.fitment.includes(vehicleId) ?? false
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getReviewsForSku(sku: string): Review[] {
  return reviews.filter((r) => r.sku === sku)
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Marcus T.',
    location: 'Atlanta, GA',
    vehicle: '2018 Audi A4 B9 2.0 TFSI',
    rating: 5,
    quote:
      "I chased the right water pump module for my B9 for weeks. Every other site sent the pre-revision housing or couldn't confirm which one my engine code took. Audi Parts Sales listed the exact revised part number, confirmed it against my EA888 Gen3, and it landed next day. Car is back on the road.",
    partBought: 'Water Pump & Thermostat Module – EA888',
    date: 'March 2026',
    avatarInitials: 'MT',
    avatarColor: '#a6192e',
  },
  {
    id: 't2',
    author: 'Priya S.',
    location: 'Melbourne, AU',
    vehicle: '2020 Audi A4 B9 2.0 TDI',
    rating: 5,
    quote:
      'Ordered the front pad and disc set for my B9. The fitment checker confirmed the 320 mm variant in seconds — that detail alone saved me a return. Parts arrived in genuine Audi packaging, exactly as described, and I fitted them myself in under an hour.',
    partBought: 'Front Brake Pad + Disc Set – A4 B9',
    date: 'February 2026',
    avatarInitials: 'PS',
    avatarColor: '#2e353d',
  },
  {
    id: 't3',
    author: 'Ryan O.',
    location: 'Nairobi, KE',
    vehicle: '2022 Audi Q7 4M 3.0 TDI',
    rating: 5,
    quote:
      'Sourcing a genuine front air strut for a Q7 4M locally is close to impossible — everything on offer is a pattern copy. I ordered the OEM unit here and it shipped internationally in six days, perfectly packaged, no damage. Worth every cent for the real part.',
    partBought: 'Front Air Suspension Strut – Q7 4M',
    date: 'January 2026',
    avatarInitials: 'RO',
    avatarColor: '#4a545f',
  },
  {
    id: 't4',
    author: 'Claire W.',
    location: 'Houston, TX',
    vehicle: '2019 Audi A3 2.0 TFSI',
    rating: 5,
    quote:
      'The PCV valve for my A3 was exactly right. I was nervous ordering online because the wrong revision just brings the lean code straight back, but the fitment database matched it to my VIN. Support replied to my email in under two hours to double-check. Outstanding.',
    partBought: 'PCV Valve / Oil Separator – 2.0 TFSI',
    date: 'March 2026',
    avatarInitials: 'CW',
    avatarColor: '#7e1223',
  },
  {
    id: 't5',
    author: 'James P.',
    location: 'Toronto, CA',
    vehicle: '2021 Audi Q5 2.0 TFSI',
    rating: 5,
    quote:
      'The remanufactured 180 A alternator saved me well over $200 against the dealer price, and it came with a two-year warranty. I was sceptical about reman units, but the listing was honest about exactly what it was, and three months in it is running flawlessly.',
    partBought: 'Alternator 180A – 2.0 TFSI',
    date: 'December 2025',
    avatarInitials: 'JP',
    avatarColor: '#98a2ad',
  },
  {
    id: 't6',
    author: 'Aiko N.',
    location: 'Osaka, JP',
    vehicle: '2018 Audi TT 2.5 TFSI',
    rating: 5,
    quote:
      'Found the genuine coil pack set that I could not get at a sensible price anywhere in Japan. Shipped in five business days. They are unmistakably genuine — the casting and the Audi part stamp match the ones I pulled out. This is my go-to site now.',
    partBought: 'Ignition Coil Pack – TFSI (Set of 4)',
    date: 'February 2026',
    avatarInitials: 'AN',
    avatarColor: '#1c2127',
  },
]

export const featuredSkus = [
  'AUD-WP-EA888-OEM',
  'AUD-BP-B9-FRONT-OEM',
  'AUD-TCK-EA888-OEM',
  'AUD-ALT-EA888-AFT',
]
