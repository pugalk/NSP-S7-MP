/**
 * API Client for National Scholarship Portal Backend API
 * Connects to Express endpoints at /api/... (proxied by Vite to port 5000 in dev)
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await request('/health');
      return { ok: true, data: res };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // Scholarships
  getScholarships: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== 'All' && v !== '') query.append(k, v);
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/scholarships${qs}`);
  },

  getScholarshipById: async (id) => {
    return request(`/scholarships/${id}`);
  },

  createScholarship: async (schemeData) => {
    return request('/scholarships', {
      method: 'POST',
      body: JSON.stringify(schemeData)
    });
  },

  deleteScholarship: async (id) => {
    return request(`/scholarships/${id}`, {
      method: 'DELETE'
    });
  },

  // Eligibility
  evaluateEligibility: async (profile) => {
    return request('/eligibility/check', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  },

  evaluateScheme: async (schemeId, profile) => {
    return request(`/eligibility/check/${schemeId}`, {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  },

  // Auth & Profile
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async (email) => {
    return request('/auth/profile', {
      headers: { 'x-user-email': email }
    });
  },

  updateProfile: async (profileData, email) => {
    return request('/auth/profile', {
      method: 'PUT',
      headers: { 'x-user-email': email || profileData.email },
      body: JSON.stringify(profileData)
    });
  },

  // Applications
  getApplications: async (email = null) => {
    const headers = email ? { 'x-user-email': email } : {};
    return request('/applications', { headers });
  },

  getApplicationById: async (id) => {
    return request(`/applications/${id}`);
  },

  submitApplication: async (applicationData) => {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  advanceApplication: async (id) => {
    return request(`/applications/${id}/advance`, {
      method: 'POST'
    });
  },

  reviewApplication: async (id, status, remarks, reviewer = 'Welfare Officer') => {
    return request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks, reviewer })
    });
  },

  // Documents
  getDocuments: async (email = null) => {
    const headers = email ? { 'x-user-email': email } : {};
    return request('/documents', { headers });
  },

  uploadDocument: async (file, documentName, userEmail) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', documentName);
    if (userEmail) formData.append('userEmail', userEmail);

    return request('/documents/upload', {
      method: 'POST',
      headers: userEmail ? { 'x-user-email': userEmail } : {},
      body: formData
    });
  },

  updateDocumentStatus: async (id, status, remark) => {
    return request(`/documents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remark })
    });
  },

  deleteDocument: async (id) => {
    return request(`/documents/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin / Officer Desk
  adminLogin: async (email, password) => {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getAdminStats: async () => {
    return request('/admin/stats');
  },

  // TOM AI Advisor
  chatWithTom: async (message, profile = {}, history = []) => {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, profile, history })
    });
  },

  // Organizer / Scheme Provider Portal
  organizerLogin: async (email, password) => {
    return request('/organizer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getOrganizerDashboard: async (email) => {
    const headers = email ? { 'x-user-email': email } : {};
    return request('/organizer/dashboard', { headers });
  },

  createOrganizerScheme: async (schemeData) => {
    return request('/organizer/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData)
    });
  },

  sanctionOrganizerApplication: async (id, decision, remark) => {
    return request(`/organizer/applications/${id}/sanction`, {
      method: 'PATCH',
      body: JSON.stringify({ decision, remark })
    });
  }
};
