import { useState } from 'react';

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function useDeviceId() {
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('galleryDeviceId');
    if (!id) { id = generateId(); localStorage.setItem('galleryDeviceId', id); }
    return id;
  });
  return deviceId;
}
