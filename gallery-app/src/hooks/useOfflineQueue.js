import { useState, useEffect, useCallback } from 'react';
import { uploadPhoto } from '../api';

const DB_NAME = 'galleryOfflineQueue';
const STORE = 'uploads';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function enqueue(item) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dequeue(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function listQueue() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function useOfflineQueue(onUploaded) {
  const [pending, setPending] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const refreshCount = useCallback(async () => {
    const items = await listQueue();
    setPending(items.length);
  }, []);

  const processQueue = useCallback(async () => {
    const items = await listQueue();
    for (const item of items) {
      try {
        const fd = new FormData();
        Object.entries(item.fields).forEach(([k, v]) => fd.append(k, v));
        fd.append('file', item.file);
        const result = await uploadPhoto(fd, () => {});
        await dequeue(item.id);
        onUploaded?.(result);
      } catch {
        break; // stop processing if one fails (still offline?)
      }
    }
    await refreshCount();
  }, [onUploaded, refreshCount]);

  useEffect(() => {
    refreshCount();
    const onOnline = () => { setIsOnline(true); processQueue(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, [processQueue, refreshCount]);

  const addToQueue = useCallback(async (fields, file) => {
    await enqueue({ fields, file, queuedAt: Date.now() });
    await refreshCount();
  }, [refreshCount]);

  return { isOnline, pending, addToQueue };
}
