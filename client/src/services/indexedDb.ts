// Local-first IndexedDB manager for persistent offline farm records
import { CropDiagnosisResult, ChatMessage, SoilReportExtraction } from '../types';

const DB_NAME = 'AgriSathiDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crop diagnoses store
      if (!db.objectStoreNames.contains('diagnoses')) {
        const store = db.createObjectStore('diagnoses', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('cropIdentified', 'cropIdentified', { unique: false });
      }

      // Chat history store
      if (!db.objectStoreNames.contains('chats')) {
        const store = db.createObjectStore('chats', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Soil records store
      if (!db.objectStoreNames.contains('soils')) {
        db.createObjectStore('soils', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDiagnosisToIndexedDB(diagnosis: CropDiagnosisResult): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('diagnoses', 'readwrite');
    const store = tx.objectStore('diagnoses');
    const req = store.put(diagnosis);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllDiagnosesFromIndexedDB(): Promise<CropDiagnosisResult[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('diagnoses', 'readonly');
    const store = tx.objectStore('diagnoses');
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result as CropDiagnosisResult[];
      // Sort newest first
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDiagnosisFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('diagnoses', 'readwrite');
    const store = tx.objectStore('diagnoses');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveChatMessageToIndexedDB(message: ChatMessage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');
    const req = store.put(message);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getChatHistoryFromIndexedDB(): Promise<ChatMessage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result as ChatMessage[];
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearChatHistoryFromIndexedDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
