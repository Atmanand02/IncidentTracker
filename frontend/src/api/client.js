const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

if (import.meta.env.DEV && !BASE_URL) {
  console.warn(
    '[Incident Tracker] Using mock API (no network requests). To use the backend, set VITE_API_BASE_URL in frontend/.env and restart the dev server (npm run dev).'
  );
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = new Error(res.statusText || 'Request failed');
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      err.body = await res.text();
    }
    throw err;
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export function get(path) {
  return request(path, { method: 'GET' });
}

export function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export function patch(path, body) {
  return request(path, { method: 'PATCH', body: JSON.stringify(body) });
}
