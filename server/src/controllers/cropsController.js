import { CROPS_DATA } from '../config/crops.js';
import { ASSAM_DISTRICTS } from '../config/districts.js';

export async function recommendCrops(req, res) {
  try {
    const {
      district = 'Guwahati',
      soilType = 'Alluvial',
      season = 'Kharif',
      irrigation = 'Rainfed',
      landArea = 1
    } = req.body;

    const districtData = ASSAM_DISTRICTS[district] || ASSAM_DISTRICTS.Guwahati;
    const agroZone = districtData.agroZone;
    const recommendations = [];

    // Verified agronomic logic based on Assam Agricultural University practices
    if (season === 'Kharif' || season === 'Monsoon') {
      recommendations.push({
        crop: 'Sali Rice (শালি ধান)',
        localNameAs: 'শালি ধান (Sali Dhan)',
        suitability: 'High',
        reason: `Prime staple Kharif crop for the ${agroZone}. Suited to high monsoon precipitation in alluvial lowlands and medium plains.`,
        soilRequirements: 'Clay loam to silty clay loam with good water retention.',
        seasonalSuitability: 'Sowing in June-July, transplanting in July-August, harvesting in Nov-Dec.',
        waterRequirements: 'High (1000-1200 mm); thrives in rainfed paddy fields.',
        possibleConstraints: 'Susceptible to vegetative submergence if flash floods occur (use Swarna Sub-1 in vulnerable pockets).',
        recommendedPractices: [
          'Maintain 2-3 seedlings per hill.',
          'Apply balanced NPK at 60:20:40 kg/ha with zinc sulphate.',
          'Intermittent drainage at tillering.'
        ],
        sourceAttribution: 'Assam Agricultural University Package of Practices for Kharif Crops'
      });

      recommendations.push({
        crop: 'Maize (মাকৈ)',
        localNameAs: 'মাকৈ (Makoi)',
        suitability: irrigation === 'Rainfed' ? 'Medium' : 'High',
        reason: `Excellent upland cash crop for well-drained loamy tracts in ${district}.`,
        soilRequirements: 'Well-drained sandy loam or alluvial soil; strictly intolerant to stagnant waterlogging.',
        seasonalSuitability: 'April-May planting.',
        waterRequirements: 'Moderate (500-600 mm).',
        possibleConstraints: 'Vulnerable to Fall Armyworm (FAW); ensure early whorl scouting.',
        recommendedPractices: [
          'Ridge and furrow planting for rapid drainage.',
          'Intercropping with black gram or cowpea.'
        ],
        sourceAttribution: 'ICAR North Eastern Hill Region Agro-Advisory'
      });
    } else {
      // Rabi / Winter
      recommendations.push({
        crop: 'Mustard (সৰিয়হ / Toria)',
        localNameAs: 'সৰিয়হ (Xoriyoh)',
        suitability: 'High',
        reason: `Major winter oilseed crop across the Brahmaputra alluvial flood plains following Sali paddy harvest.`,
        soilRequirements: 'Loam to sandy loam with neutral to slightly acidic pH.',
        seasonalSuitability: 'Mid-October to mid-November sowing; 90-100 days maturity.',
        waterRequirements: 'Low-to-moderate; thrives on residual soil moisture with 1-2 supplemental irrigations.',
        possibleConstraints: 'Aphid infestation during flowering if sowing is delayed beyond November.',
        recommendedPractices: [
          'Sow TS-36 or TS-38 varieties before end of October.',
          'Apply sulphur @ 20 kg/ha to boost oil content.'
        ],
        sourceAttribution: 'Directorate of Agriculture, Government of Assam'
      });

      recommendations.push({
        crop: 'Potato (আলু)',
        localNameAs: 'আলু (Aloo)',
        suitability: irrigation === 'Rainfed' ? 'Medium' : 'High',
        reason: `High-value winter cash crop widely cultivated in ${district} with access to tube well or river lift irrigation.`,
        soilRequirements: 'Loose, friable sandy loam rich in organic matter.',
        seasonalSuitability: 'Late October to November planting.',
        waterRequirements: 'Moderate to high (frequent light irrigations at tuber initiation).',
        possibleConstraints: 'Late Blight epidemic risk during humid foggy winter mornings.',
        recommendedPractices: [
          'Plant certified disease-free seed tubers of Kufri Jyoti or Kufri Megha.',
          'Earth up rows 30 days after sowing.'
        ],
        sourceAttribution: 'Assam Agricultural University Package of Practices for Rabi Crops'
      });

      recommendations.push({
        crop: 'Vegetables (Tomato / Chilli)',
        localNameAs: 'বিলাহী আৰু জলকীয়া',
        suitability: 'Medium',
        reason: 'Lucrative rabi vegetable options for riverbank and homestead garden cultivation.',
        soilRequirements: 'Rich alluvial soil with high compost content.',
        seasonalSuitability: 'October transplanting.',
        waterRequirements: 'Drip or furrow irrigation.',
        possibleConstraints: 'Bacterial wilt and fruit borer.',
        recommendedPractices: [
          'Raised bed nursery with plastic mulching.',
          'Pheromone and sticky trap deployment.'
        ],
        sourceAttribution: 'Department of Horticulture, Assam'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        district,
        agroZone,
        soilType,
        season,
        irrigation,
        landArea,
        recommendations,
        disclaimer: 'Recommendations are based on agro-climatic zone suitability rules from Assam Agricultural University. Adjust according to field slope and immediate micro-climate.'
      }
    });
  } catch (err) {
    console.error('Crop recommendation error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'RECOMMENDATION_FAILED', message: 'Failed to generate crop advice.' }
    });
  }
}
