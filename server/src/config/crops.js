// Comprehensive Assam and Northeast India Crop Registry
// Based on Assam Agricultural University (AAU), Jorhat Package of Practices

export const CROPS_DATA = [
  {
    id: 'rice',
    name: 'Rice (ধান)',
    category: 'Cereal',
    varieties: [
      { name: 'Sali (Winter Rice)', season: 'Kharif', planting: 'June-July', harvesting: 'Nov-Dec', popularVarieties: ['Ranjit', 'Bahadur', 'Pankaj', 'Mahsuri'] },
      { name: 'Ahu (Autumn Rice)', season: 'Pre-Kharif', planting: 'Feb-March', harvesting: 'June-July', popularVarieties: ['Disang', 'Chilarai', 'Luit'] },
      { name: 'Bao (Deepwater Rice)', season: 'Flood-plain', planting: 'March-April', harvesting: 'Nov-Dec', popularVarieties: ['Maguri', 'Panikekua', 'Negheri'] },
      { name: 'Submergence Tolerant', season: 'Flood-prone', planting: 'June-July', harvesting: 'Nov-Dec', popularVarieties: ['Swarna Sub-1', 'Bahadur Sub-1', 'Ranjit Sub-1'] }
    ],
    commonDiseases: [
      {
        name: 'Bacterial Leaf Blight (BLB)',
        symptoms: 'Water-soaked to yellowish-white lesions with wavy margins starting from leaf tips and drying up.',
        organicRemedy: 'Drain field for 2-3 days, avoid excessive urea, spray cow dung slurry supernatant (20%) or neem formulation.',
        safeRemedy: 'Apply Copper Oxychloride 50 WP (2.5 g/L) + Streptocycline (100 mg/L) if recommended by KVK.'
      },
      {
        name: 'Blast (Pyricularia oryzae)',
        symptoms: 'Spindle-shaped or eye-shaped spots with grey or white center and brownish margin on leaves or neck.',
        organicRemedy: 'Treat seeds with Trichoderma viride @ 5g/kg, avoid excessive nitrogenous fertilizers.',
        safeRemedy: 'Spray Tricyclazole 75 WP (0.6 g/L) at early symptom appearance.'
      },
      {
        name: 'Brown Spot (Bipolaris oryzae)',
        symptoms: 'Oval to circular dark brown sesame-seed-like spots across leaf blade.',
        organicRemedy: 'Balanced application of potash, seed treatment with warm water or Trichoderma.',
        safeRemedy: 'Spray Mancozeb 75 WP (2 g/L).'
      }
    ]
  },
  {
    id: 'tea',
    name: 'Tea (চাহ)',
    category: 'Plantation',
    varieties: [
      { name: 'Assam Type (Camellia assamensis)', season: 'Perennial', plucking: 'March to November', popularVarieties: ['TV1', 'TV20', 'TV29', 'S3A3'] }
    ],
    commonDiseases: [
      {
        name: 'Red Spider Mite (Oligonychus coffeae)',
        symptoms: 'Rusty bronze or copper discoloration of upper surface of mature leaves, webbing visible in heavy infestation.',
        organicRemedy: 'Spray neem kernel extract (5%) or agricultural wettable sulphur (2 g/L); preserve predatory stethorus beetles.',
        safeRemedy: 'Apply Propargite 57 EC (2 ml/L) or Fenpyroximate 5 EC (1 ml/L) strictly adhering to pre-harvest intervals.'
      },
      {
        name: 'Blister Blight (Exobasidium vexans)',
        symptoms: 'Circular blister-like lesions on tender young leaves, sunken above and convex below, turning velvety white.',
        organicRemedy: 'Increase bush aeration, prune shade trees, apply copper hydroxide @ 2 g/L.',
        safeRemedy: 'Apply Hexaconazole 5 EC (1 ml/L) mixed with Copper Oxychloride.'
      }
    ]
  },
  {
    id: 'mustard',
    name: 'Mustard (সৰিয়হ)',
    category: 'Oilseed',
    varieties: [
      { name: 'Toria / Indian Mustard', season: 'Rabi', planting: 'Mid Oct to Mid Nov', harvesting: 'Jan-Feb', popularVarieties: ['TS-36', 'TS-38', 'M-27', 'PM-26'] }
    ],
    commonDiseases: [
      {
        name: 'Mustard Aphid (Lipaphis erysimi)',
        symptoms: 'Massive colonies of tiny greenish insects sucking sap from tender inflorescence, curling flowers and reducing pod formation.',
        organicRemedy: 'Early sowing (before Oct 25), yellow sticky traps (15/ha), spray 2% neem seed kernel extract.',
        safeRemedy: 'Spray Dimethoate 30 EC (1.5 ml/L) or Thiamethoxam 25 WG (0.2 g/L) only when 20% plants show infestation.'
      },
      {
        name: 'Alternaria Blight (Alternaria brassicae)',
        symptoms: 'Concentric dark brown to black circular rings on leaves, stems and pods.',
        organicRemedy: 'Clean cultivation, destroy crop residue, seed treatment with Trichoderma.',
        safeRemedy: 'Spray Mancozeb 75 WP @ 2 g/L or Iprodione 50 WP.'
      }
    ]
  },
  {
    id: 'potato',
    name: 'Potato (আলু)',
    category: 'Tuber',
    varieties: [
      { name: 'Table / Processing', season: 'Rabi', planting: 'October-November', harvesting: 'Jan-March', popularVarieties: ['Kufri Jyoti', 'Kufri Megha', 'Kufri Pokhraj'] }
    ],
    commonDiseases: [
      {
        name: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Water-soaked irregular blackish-brown lesions on leaves, white cottony downy growth on leaf undersides in humid mornings.',
        organicRemedy: 'Use blight-tolerant Kufri Megha, earth up properly to avoid tuber infection, prophylactic copper spray.',
        safeRemedy: 'Spray Cymoxanil 8% + Mancozeb 64% WP (2 g/L) or Metalaxyl MZ upon early warning.'
      }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato (বিলাহী)',
    category: 'Vegetable',
    varieties: [
      { name: 'Cultivated Tomato', season: 'Rabi / Winter', planting: 'Sept-October', harvesting: 'Dec-March', popularVarieties: ['Pusa Ruby', 'Arka Rakshak', 'Rocky', 'Abhilash'] }
    ],
    commonDiseases: [
      {
        name: 'Bacterial Wilt (Ralstonia solanacearum)',
        symptoms: 'Sudden rapid wilting and drooping of foliage without initial leaf yellowing; stems show vascular browning.',
        organicRemedy: 'Crop rotation with non-solanaceous crops (maize, paddy), raise soil pH by liming, treat nursery with Pseudomonas fluorescens.',
        safeRemedy: 'Soil drenching around healthy plants with Copper Oxychloride (3 g/L) + Streptocycline.'
      },
      {
        name: 'Tomato Leaf Curl Virus (ToLCV)',
        symptoms: 'Upward curling, puckering and severe crinkling of leaves, stunted bushy appearance, transmitted by whiteflies.',
        organicRemedy: 'Yellow sticky traps, barrier crops like maize/bajra around borders, neem oil (5 ml/L).',
        safeRemedy: 'Control whitefly vector using Acetamiprid 20 SP (0.3 g/L) at nursery stage.'
      }
    ]
  },
  {
    id: 'chilli',
    name: 'Chilli (জলকীয়া)',
    category: 'Spices/Vegetable',
    varieties: [
      { name: 'Hot Chilli & King Chilli (Bhut Jolokia)', season: 'Kharif/Rabi', planting: 'Oct-Nov or Feb-March', popularVarieties: ['Bhut Jolokia', 'Suryamukhi', 'Krishna', 'Pusa Jwala'] }
    ],
    commonDiseases: [
      {
        name: 'Anthracnose / Dieback (Colletotrichum capsici)',
        symptoms: 'Circular sunken lesions on ripe fruits with black concentric dots; twigs die back from tip downwards.',
        organicRemedy: 'Use healthy seed from disease-free fruits, destroy diseased debris, spray Bordeaux mixture (1%).',
        safeRemedy: 'Spray Azoxystrobin 23 SC (1 ml/L) or Difenoconazole 25 EC (0.5 ml/L).'
      }
    ]
  },
  {
    id: 'maize',
    name: 'Maize (মাকৈ)',
    category: 'Cereal',
    varieties: [
      { name: 'Hybrid / Composite', season: 'Kharif & Rabi', planting: 'April-May or Oct-Nov', popularVarieties: ['Ganga 5', 'Deccan 103', 'HQPM 1', 'Vijay'] }
    ],
    commonDiseases: [
      {
        name: 'Fall Armyworm (Spodoptera frugiperda)',
        symptoms: 'Irregular shot-holes in whorl leaves, extensive larval fecal sawdust in the central whorl.',
        organicRemedy: 'Hand-pick egg masses, apply dry sand/wood ash into whorls, install pheromone traps (5/acre), Metarhizium anisopliae.',
        safeRemedy: 'Apply Chlorantraniliprole 18.5 SC (0.4 ml/L) directly into whorls if early infestation exceeds threshold.'
      }
    ]
  }
];
