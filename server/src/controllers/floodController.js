import { FLOOD_DATA } from '../config/floodData.js';

export async function getFloodAlerts(req, res) {
  // Honest reporting of live flood warning status
  res.status(200).json({
    success: true,
    data: {
      status: 'unavailable',
      source: 'Assam State Disaster Management Authority (ASDMA)',
      retrievedAt: new Date().toISOString(),
      alerts: [],
      message: 'Direct API webhook from ASDMA/NDMA Sachet is currently in reference integration mode. Please consult official ASDMA daily flood bulletins at https://asdma.assam.gov.in/.',
      officialResources: FLOOD_DATA.officialSources
    }
  });
}

export async function getFloodGuidance(req, res) {
  res.status(200).json({
    success: true,
    data: {
      guidance: FLOOD_DATA.guidance,
      emergencyContacts: FLOOD_DATA.emergencyContacts,
      floodResistantVarieties: FLOOD_DATA.floodResistantVarieties,
      disclaimer: 'AgriSathi AI provides agricultural preparedness guidance. In emergencies, strictly obey local District Administration and ASDMA evacuation instructions.'
    }
  });
}
