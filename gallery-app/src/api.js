const API = import.meta.env.VITE_API_URL || 'https://gallery-api.rushelwedsivani.com';

const getCode = () => localStorage.getItem('galleryCode') || '';

const authHeaders = (extra = {}) => ({
  'x-gallery-code': getCode(),
  ...extra
});

export async function fetchPhotos({ sort = 'likes', ceremony = '', tag = '', limit = 30, offset = 0 } = {}) {
  const p = new URLSearchParams({ sort, limit, offset });
  if (ceremony) p.set('ceremony', ceremony);
  if (tag) p.set('tag', tag);
  const res = await fetch(`${API}/api/photos?${p}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function fetchTags() {
  const res = await fetch(`${API}/api/photos/tags`, { headers: authHeaders() });
  return res.json();
}

export async function likePhoto(id, deviceId) {
  const res = await fetch(`${API}/api/photos/${id}/like`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ device_id: deviceId })
  });
  return res.json();
}

export function uploadPhoto(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', `${API}/api/upload`);
    xhr.setRequestHeader('x-gallery-code', getCode());
    xhr.send(formData);
  });
}

// Admin
const adminHeaders = token => ({ Authorization: `Bearer ${token}` });

export async function fetchAdminPhotos(token, offset = 0) {
  const res = await fetch(`${API}/api/admin/photos?limit=50&offset=${offset}`, { headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function fetchAdminStats(token) {
  const res = await fetch(`${API}/api/admin/stats`, { headers: adminHeaders(token) });
  return res.json();
}

export async function patchPhoto(id, token, updates) {
  const res = await fetch(`${API}/api/admin/photos/${id}`, {
    method: 'PATCH',
    headers: { ...adminHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deletePhoto(id, token) {
  const res = await fetch(`${API}/api/admin/photos/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(token)
  });
  return res.json();
}

export const getDownloadUrl = () => `${API}/api/admin/zip`;
