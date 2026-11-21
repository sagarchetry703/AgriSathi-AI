// Market prices service
// Adheres strictly to the ethical mandate: Never fabricate fake mandi rates.
// Clearly identify provider and status.

export async function getMarketPrices(req, res) {
  const { commodity = 'Paddy', district = 'Guwahati' } = req.query;

  // Inform the user truthfully about live AGMARKNET connectivity status
  res.status(200).json({
    success: true,
    data: {
      status: 'unavailable',
      dataProvider: 'AGMARKNET / eNAM (Govt of India)',
      commodity,
      district,
      state: 'Assam',
      retrievedAt: new Date().toISOString(),
      prices: [],
      message: 'Direct API token for AGMARKNET real-time mandi price feed is currently awaiting national data portal provisioning. Live rates are honest unavailable rather than synthetic.',
      referenceMandis: [
        { name: 'Pamohi Mandi (ASAMB)', location: 'Guwahati', primaryCommodity: 'Rice, Vegetables' },
        { name: 'Dhing Mandi', location: 'Nagaon', primaryCommodity: 'Jute, Mustard, Paddy' },
        { name: 'Kharupetia Wholesale Market', location: 'Darrang', primaryCommodity: 'Vegetables, Potato' },
        { name: 'Sonari Mandi', location: 'Charaideo', primaryCommodity: 'Tea, Paddy' }
      ]
    }
  });
}
