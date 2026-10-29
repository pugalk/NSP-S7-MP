import axios from 'axios';

/**
 * Enterprise Axios API Client for National Scholarship Renewal & Eligibility Re-Verification Portal
 * Full JWT Bearer token authentication + MongoDB/REST backend integration.
 */

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: Attach JWT Bearer token automatically from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nsp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract response data and normalize error messages
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Network request failed'
    );
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const api = {
  // System & Health
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return { ok: true, data: res };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  getSystemStatus: async () => {
    try {
      return await apiClient.get('/system/status');
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // Authentication & Session
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  getUsers: async () => {
    return apiClient.get('/auth/users');
  },

  updateUserRole: async (id, role) => {
    return apiClient.patch(`/auth/users/${id}/role`, { role });
  },

  getProfile: async (email) => {
    return apiClient.get('/auth/profile', {
      headers: email ? { 'x-user-email': email } : {}
    });
  },

  updateProfile: async (profileData, email) => {
    return apiClient.put('/auth/profile', profileData, {
      headers: email ? { 'x-user-email': email } : {}
    });
  },

  // Scholarships
  getScholarships: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== 'All' && v !== '') query.append(k, v);
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get(`/scholarships${qs}`);
  },

  getScholarshipById: async (id) => {
    return apiClient.get(`/scholarships/${id}`);
  },

  createScholarship: async (schemeData) => {
    return apiClient.post('/scholarships', schemeData);
  },

  deleteScholarship: async (id) => {
    return apiClient.delete(`/scholarships/${id}`);
  },

  // Eligibility Evaluation Engine
  evaluateEligibility: async (profile) => {
    return apiClient.post('/eligibility/check', profile);
  },

  evaluateScheme: async (schemeId, profile) => {
    return apiClient.post(`/eligibility/check/${schemeId}`, profile);
  },

  // Applications Lifecycle
  getApplications: async (email = null) => {
    return apiClient.get('/applications', {
      headers: email ? { 'x-user-email': email } : {}
    });
  },

  getApplicationById: async (id) => {
    return apiClient.get(`/applications/${id}`);
  },

  submitApplication: async (applicationData) => {
    return apiClient.post('/applications', applicationData);
  },

  advanceApplication: async (id) => {
    return apiClient.post(`/applications/${id}/advance`);
  },

  reviewApplication: async (id, status, remarks, reviewer = 'Welfare Officer') => {
    return apiClient.patch(`/applications/${id}/status`, { status, remarks, reviewer });
  },

  batchReviewApplications: async (ids, status, remarks, reviewer = 'Nodal Officer') => {
    return apiClient.post('/applications/batch-status', { ids, status, remarks, reviewer });
  },

  // Documents Management
  getDocuments: async (email = null) => {
    return apiClient.get('/documents', {
      headers: email ? { 'x-user-email': email } : {}
    });
  },

  uploadDocument: async (file, documentName, userEmail) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', documentName);
    if (userEmail) formData.append('userEmail', userEmail);

    return apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(userEmail ? { 'x-user-email': userEmail } : {})
      }
    });
  },

  updateDocumentStatus: async (id, status, remark) => {
    return apiClient.patch(`/documents/${id}/status`, { status, remark });
  },

  deleteDocument: async (id) => {
    return apiClient.delete(`/documents/${id}`);
  },

  // Admin Officer Desk
  adminLogin: async (email, password) => {
    return apiClient.post('/admin/login', { email, password });
  },

  getAdminStats: async () => {
    return apiClient.get('/admin/stats');
  },

  // TOM AI Advisor
  chatWithTom: async (message, profile = {}, history = []) => {
    return apiClient.post('/ai/chat', { message, profile, history });
  },

  // Scheme Provider / Verifier Portal
  organizerLogin: async (email, password) => {
    return apiClient.post('/organizer/login', { email, password });
  },

  getOrganizerDashboard: async (email) => {
    return apiClient.get('/organizer/dashboard', {
      headers: email ? { 'x-user-email': email } : {}
    });
  },

  createOrganizerScheme: async (schemeData) => {
    return apiClient.post('/organizer/schemes', schemeData);
  },

  sanctionOrganizerApplication: async (id, decision, remark) => {
    return apiClient.patch(`/organizer/applications/${id}/sanction`, { decision, remark });
  }
};
