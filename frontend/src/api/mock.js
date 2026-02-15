import { SEVERITIES, STATUSES, SERVICES } from '../lib/constants.js';

const titles = [
  'Login Failure', 'Payment Delay', 'API Timeout', 'UI Bug on Dashboard', 'Database Issue',
  'Cache Miss', 'Memory Leak', 'Connection Pool Exhausted', 'SSL Handshake Failed', 'Rate Limit Exceeded',
  'Session Expiry', 'Checkout Error', 'Gateway Timeout', 'Component Crash', 'Replication Lag',
  'Auth Token Invalid', 'Refund Failure', 'Service Unavailable', 'Blank Screen', 'Deadlock Detected',
  'OAuth Redirect Broken', 'Payout Delay', 'Load Balancer Down', 'Infinite Loop', 'Index Corruption',
];
const summaries = [
  'Users reported issues accessing the feature.',
  'Intermittent failures under load.',
  'Root cause under investigation.',
  'Fix deployed to production.',
  'Monitoring for recurrence.',
];

function randomId() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString();
}

function generateIncident(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: randomId(),
    title: randomItem(titles),
    service: randomItem(SERVICES),
    severity: randomItem(SEVERITIES),
    status: randomItem(STATUSES),
    owner: Math.random() > 0.2 ? `user-${Math.floor(Math.random() * 5)}@team` : undefined,
    summary: Math.random() > 0.3 ? randomItem(summaries) : undefined,
    createdAt: randomDate(60),
    updatedAt: now,
    ...overrides,
  };
}

let mockIncidents = [];
for (let i = 0; i < 200; i++) {
  mockIncidents.push(generateIncident());
}
// Sort by createdAt desc by default for consistent initial order
mockIncidents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

function filterAndSort(params) {
  let list = [...mockIncidents];
  if (params.service) {
    list = list.filter((i) => i.service === params.service);
  }
  if (params.severity) {
    const sev = params.severity.split(',').map((s) => s.trim()).filter(Boolean);
    if (sev.length) list = list.filter((i) => sev.includes(i.severity));
  }
  if (params.status) {
    list = list.filter((i) => i.status === params.status);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.summary && i.summary.toLowerCase().includes(q)) ||
        (i.owner && i.owner.toLowerCase().includes(q))
    );
  }
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = (params.sortOrder || 'desc').toLowerCase();
  list.sort((a, b) => {
    let va = a[sortBy];
    let vb = b[sortBy];
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      va = new Date(va).getTime();
      vb = new Date(vb).getTime();
    } else {
      va = String(va ?? '').toLowerCase();
      vb = String(vb ?? '').toLowerCase();
    }
    if (va < vb) return sortOrder === 'asc' ? -1 : 1;
    if (va > vb) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  return list;
}

export const mockApi = {
  getIncidents(params = {}) {
    const list = filterAndSort(params);
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const start = (page - 1) * limit;
    const data = list.slice(start, start + limit);
    return Promise.resolve({ data, total: list.length });
  },

  getIncident(id) {
    const incident = mockIncidents.find((i) => i.id === id);
    if (!incident) {
      const err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
    return Promise.resolve(incident);
  },

  createIncident(body) {
    const now = new Date().toISOString();
    const incident = {
      id: randomId(),
      title: body.title,
      service: body.service,
      severity: body.severity,
      status: body.status,
      owner: body.owner || undefined,
      summary: body.summary || undefined,
      createdAt: now,
      updatedAt: now,
    };
    mockIncidents.unshift(incident);
    return Promise.resolve(incident);
  },

  updateIncident(id, body) {
    const idx = mockIncidents.findIndex((i) => i.id === id);
    if (idx === -1) {
      const err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
    const now = new Date().toISOString();
    mockIncidents[idx] = { ...mockIncidents[idx], ...body, updatedAt: now };
    return Promise.resolve(mockIncidents[idx]);
  },
};
