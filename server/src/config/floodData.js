// Official Assam Flood-to-Farm Knowledge and Guidelines
// Sourced from Assam State Disaster Management Authority (ASDMA), AAU Jorhat, and NDMA

export const FLOOD_DATA = {
  officialSources: [
    { name: 'ASDMA (Assam State Disaster Management Authority)', url: 'https://asdma.assam.gov.in/', scope: 'Assam State Emergency Operations, District Flood Bulletins' },
    { name: 'NDMA Sachet Portal', url: 'https://sachet.ndma.gov.in/', scope: 'National Disaster Warning & Geo-targeted Early Warning Feed' },
    { name: 'IMD RMC Guwahati', url: 'https://mausam.imd.gov.in/guwahati/', scope: 'Regional Weather Forecasts & Flood Agromet Advisory' },
    { name: 'AAU Jorhat Agromet', url: 'http://www.aau.ac.in/', scope: 'Post-flood crop revival packages & submergence varieties' }
  ],
  emergencyContacts: [
    { title: 'Assam State Emergency Operations Centre (SEOC)', number: '1070 / 1079', description: 'Toll-free 24/7 disaster control room' },
    { title: 'National Emergency Response System', number: '112', description: 'Immediate police, medical & rescue dispatch' },
    { title: 'NDRF Control Room (Guwahati Unit)', number: '0361-2899015', description: 'National Disaster Response Force rescue coordination' },
    { title: 'Kisan Call Centre (Agriculture Dept)', number: '1800-180-1551', description: 'Free agricultural advisory & crop relief assistance' }
  ],
  guidance: {
    before: [
      'Store high-value seeds, identity cards, land records, and emergency medicines in waterproof containers.',
      'Construct elevated bamboo platforms (Chali) in cowsheds to safeguard cattle, goats, and poultry.',
      'Sow submergence-tolerant rice varieties (Swarna Sub-1, Bahadur Sub-1) in chronically inundated lowlands.',
      'Harvest mature boro/ahu rice, vegetables, and maize immediately if heavy catchment rainfall alerts are issued.',
      'Clear drainage ditches and bund breaches around high-value tea and horticulture plots.'
    ],
    during: [
      'Prioritize human and livestock life; move immediately to high embankment roads, schools, or flood relief shelters.',
      'Never drive bullock carts, tractors, or walk through fast-flowing flood currents.',
      'Disconnect electrical water pumps and agricultural motors to prevent electrocution and motor burnout.',
      'Boil all drinking water or use halogen tablets; treat livestock with prophylactic anti-diarrheal medicines.'
    ],
    after: [
      'Document flood crop loss with clear mobile photographs showing field location and watermarks for PMFBY insurance claims.',
      'Gently wash silt deposits off standing paddy leaves using clean water pumps as floodwaters recede.',
      'Apply supplementary urea and muriate of potash (MOP) top-dressing along with micronutrient zinc spray to revive surviving paddy.',
      'For completely devastated late-flood paddy fields, sow short-duration contingency crops: Late Sali (Gitesh, Prafulla) or Early Rabi Toria/Mustard (TS-36, TS-38).',
      'Spray prophylactic fungicides (Copper Oxychloride 2.5 g/L) to prevent bacterial blight and root rot in stagnant damp conditions.'
    ]
  },
  floodResistantVarieties: [
    {
      crop: 'Rice (ধান)',
      variety: 'Swarna Sub-1',
      submergenceToleranceDays: 14,
      notes: 'Can withstand complete underwater submergence for up to 14 days without vegetative mortality; developed by IRRI/CRRI.'
    },
    {
      crop: 'Rice (ধান)',
      variety: 'Bahadur Sub-1',
      submergenceToleranceDays: 12,
      notes: 'Assam Agricultural University certified high-yielding Sali paddy suited for low-lying flood-prone plains.'
    },
    {
      crop: 'Rice (ধান)',
      variety: 'Jalashree & Jalkuwari',
      submergenceToleranceDays: 15,
      notes: 'Indigenous deep-water flood-tolerant varieties capable of rapid stem elongation with rising Brahmaputra water.'
    }
  ]
};
