const API_BASE = '/api';

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('muebleria_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }
    return res.json();
  },

  auth: {
    login: (credentials: any) => api.fetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => api.fetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  },

  products: {
    getAll: () => api.fetch('/products'),
    create: (data: any) => api.fetch('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.fetch(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => api.fetch(`/products/${id}`, { method: 'DELETE' }),
  },

  orders: {
    create: (data: any) => api.fetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getMy: () => api.fetch('/orders/my'),
    getMyItems: (id: number) => api.fetch(`/orders/${id}/items`),
    adminGetAll: () => api.fetch('/admin/orders'),
    adminUpdateStatus: (id: number, status: string) => api.fetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    adminGetItems: (id: number) => api.fetch(`/admin/orders/${id}/items`),
  },

  admin: {
    getStats: () => api.fetch('/admin/stats'),
  }
};
