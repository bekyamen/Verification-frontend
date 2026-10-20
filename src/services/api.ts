export const BASE_URL = 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  pin?: string;
  branchId?: string;
}

export async function fetchApi(endpoint: string, options: RequestOptions = {}) {
  const { requireAuth = true, pin, branchId, ...customConfig } = options;
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (!(customConfig.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (pin) headers['x-cashier-pin'] = pin;
  if (branchId) headers['x-branch-id'] = branchId;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
