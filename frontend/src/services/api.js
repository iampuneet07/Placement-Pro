// Centralized REST API client for PlacementPro
// Communicates with the Express backend via proxy or direct port 5000 fallback
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic request helper with error handling
 */
async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error: ${res.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Analytics
  getDashboardAnalytics: () => request('/analytics/dashboard'),
  getPreparationAnalytics: () => request('/analytics/preparation'),

  // Students
  getStudentProfile: (id = 'demo') => request(`/students/${id}`),
  updateStudentProfile: (id, payload) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  createStudentProfile: (payload) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // DSA Questions
  getDsaQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/dsa${query ? `?${query}` : ''}`);
  },
  getDsaQuestionById: (id) => request(`/dsa/${id}`),
  createDsaQuestion: (payload) =>
    request('/dsa', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateDsaQuestion: (id, payload) =>
    request(`/dsa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteDsaQuestion: (id) =>
    request(`/dsa/${id}`, {
      method: 'DELETE',
    }),
  getDsaTopicStats: () => request('/dsa/stats/topics'),

  // Companies
  getCompanies: () => request('/companies'),
  getCompanyById: (id) => request(`/companies/${id}`),
  toggleCompanyTopic: (companyId, section, itemId, completed) =>
    request(`/companies/${companyId}/toggle-item`, {
      method: 'PATCH',
      body: JSON.stringify({ section, itemId, completed }),
    }),
  updateCompany: (id, payload) =>
    request(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Applications
  getApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/applications${query ? `?${query}` : ''}`);
  },
  getApplicationById: (id) => request(`/applications/${id}`),
  createApplication: (payload) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateApplication: (id, payload) =>
    request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteApplication: (id) =>
    request(`/applications/${id}`, {
      method: 'DELETE',
    }),

  // Mock Interviews
  getMockQuestions: (category = 'All', limit = 5) =>
    request(`/mock-interviews/questions?category=${encodeURIComponent(category)}&limit=${limit}`),
  evaluateMockInterview: (payload) =>
    request('/mock-interviews/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMockInterviewHistory: () => request('/mock-interviews'),
  getMockInterviewById: (id) => request(`/mock-interviews/${id}`),

  // Database Seed & Management
  getSeedStatus: () => request('/seed/status'),
  loadSeedData: () =>
    request('/seed/load', {
      method: 'POST',
    }),
  resetSeedData: () =>
    request('/seed/reset', {
      method: 'POST',
    }),
};

export default api;
