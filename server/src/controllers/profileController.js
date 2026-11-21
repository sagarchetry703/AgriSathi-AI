// Profile and History synchronization endpoints
// Enables optional server backup while primary data lives in local IndexedDB/LocalStorage

let localProfileStore = null;
let localHistoryStore = [];

export async function getProfile(req, res) {
  res.status(200).json({
    success: true,
    data: localProfileStore || {
      id: 'default-farmer',
      name: 'Kisaan Sathi',
      language: 'as',
      district: 'Jorhat',
      state: 'Assam',
      primaryCrops: ['Rice', 'Tea', 'Mustard'],
      storageMode: 'local_first'
    }
  });
}

export async function updateProfile(req, res) {
  localProfileStore = {
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: localProfileStore,
    message: 'Profile synchronized successfully.'
  });
}

export async function getHistory(req, res) {
  res.status(200).json({
    success: true,
    data: {
      records: localHistoryStore,
      count: localHistoryStore.length,
      storageNote: 'Primary persistent history is securely maintained on your device in IndexedDB.'
    }
  });
}

export async function addHistory(req, res) {
  const item = {
    ...req.body,
    id: req.body.id || 'hist-' + Date.now(),
    syncedAt: new Date().toISOString()
  };
  localHistoryStore.unshift(item);
  if (localHistoryStore.length > 50) localHistoryStore.pop();

  res.status(201).json({
    success: true,
    data: item
  });
}

export async function deleteHistory(req, res) {
  const { id } = req.params;
  localHistoryStore = localHistoryStore.filter(h => h.id !== id);
  res.status(200).json({
    success: true,
    message: 'Record removed from server backup.'
  });
}
