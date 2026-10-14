// Centralized Hybrid REST API client for PlacementPro
// Communicates with Express backend (local / Vercel serverless / Render)
// Automatically falls back to client-side DemoStore when offline or on static Vercel preview

import demoStore from './demoStore';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

let activeMode = 'checking'; // 'live' | 'demo'

async function tryServerRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `API error: ${res.statusText}`);
  }
  return data;
}

export const api = {
  getMode: () => activeMode,

  // Health
  getHealth: async () => {
    try {
      const data = await tryServerRequest('/health');
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getHealth();
    }
  },

  // Analytics
  getDashboardAnalytics: async () => {
    try {
      const data = await tryServerRequest('/analytics/dashboard');
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getDashboardAnalytics();
    }
  },

  getPreparationAnalytics: async () => {
    try {
      const data = await tryServerRequest('/analytics/preparation');
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getDashboardAnalytics();
    }
  },

  // Students
  getStudentProfile: async (id = 'demo') => {
    try {
      const data = await tryServerRequest(`/students/${id}`);
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getStudent();
    }
  },

  updateStudentProfile: async (id, payload) => {
    try {
      const data = await tryServerRequest(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.updateStudent(payload);
    }
  },

  createStudentProfile: async (payload) => {
    try {
      const data = await tryServerRequest('/students', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.updateStudent(payload);
    }
  },

  // DSA Questions
  getDsaQuestions: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await tryServerRequest(`/dsa${query ? `?${query}` : ''}`);
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getDsaQuestions(params);
    }
  },

  getDsaQuestionById: async (id) => {
    try {
      return await tryServerRequest(`/dsa/${id}`);
    } catch {
      const all = demoStore.getDsaQuestions().data;
      const found = all.find((q) => q._id === id);
      return { success: !!found, data: found };
    }
  },

  createDsaQuestion: async (payload) => {
    try {
      return await tryServerRequest('/dsa', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return demoStore.createDsaQuestion(payload);
    }
  },

  updateDsaQuestion: async (id, payload) => {
    try {
      return await tryServerRequest(`/dsa/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch {
      return demoStore.updateDsaQuestion(id, payload);
    }
  },

  deleteDsaQuestion: async (id) => {
    try {
      return await tryServerRequest(`/dsa/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return demoStore.deleteDsaQuestion(id);
    }
  },

  getDsaTopicStats: async () => {
    try {
      return await tryServerRequest('/dsa/stats/topics');
    } catch {
      return demoStore.getDsaTopicStats();
    }
  },

  // Companies
  getCompanies: async () => {
    try {
      const data = await tryServerRequest('/companies');
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getCompanies();
    }
  },

  getCompanyById: async (id) => {
    try {
      return await tryServerRequest(`/companies/${id}`);
    } catch {
      return demoStore.getCompanyById(id);
    }
  },

  toggleCompanyTopic: async (companyId, section, itemId, completed) => {
    try {
      return await tryServerRequest(`/companies/${companyId}/toggle-item`, {
        method: 'PATCH',
        body: JSON.stringify({ section, itemId, completed }),
      });
    } catch {
      return demoStore.toggleCompanyTopic(companyId, section, itemId, completed);
    }
  },

  updateCompany: async (id, payload) => {
    try {
      return await tryServerRequest(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch {
      const comp = demoStore.getCompanyById(id).data;
      if (comp) {
        Object.assign(comp, payload);
        demoStore.saveToStorage();
        return { success: true, data: comp };
      }
      return { success: false, message: 'Company not found' };
    }
  },

  // Applications
  getApplications: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await tryServerRequest(`/applications${query ? `?${query}` : ''}`);
      activeMode = 'live';
      return data;
    } catch {
      activeMode = 'demo';
      return demoStore.getApplications(params);
    }
  },

  getApplicationById: async (id) => {
    try {
      return await tryServerRequest(`/applications/${id}`);
    } catch {
      const apps = demoStore.getApplications().data;
      const found = apps.find((a) => a._id === id);
      return { success: !!found, data: found };
    }
  },

  createApplication: async (payload) => {
    try {
      return await tryServerRequest('/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return demoStore.createApplication(payload);
    }
  },

  updateApplication: async (id, payload) => {
    try {
      return await tryServerRequest(`/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch {
      return demoStore.updateApplication(id, payload);
    }
  },

  deleteApplication: async (id) => {
    try {
      return await tryServerRequest(`/applications/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return demoStore.deleteApplication(id);
    }
  },

  // Mock Interviews
  getMockQuestions: async (category = 'All', limit = 5) => {
    try {
      return await tryServerRequest(
        `/mock-interviews/questions?category=${encodeURIComponent(category)}&limit=${limit}`
      );
    } catch {
      return demoStore.getMockQuestions(category, limit);
    }
  },

  evaluateMockInterview: async (payload) => {
    try {
      return await tryServerRequest('/mock-interviews/evaluate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return demoStore.evaluateMockInterview(payload);
    }
  },

  getMockInterviewHistory: async () => {
    try {
      return await tryServerRequest('/mock-interviews');
    } catch {
      return demoStore.getMockInterviewHistory();
    }
  },

  getMockInterviewById: async (id) => {
    try {
      return await tryServerRequest(`/mock-interviews/${id}`);
    } catch {
      const history = demoStore.getMockInterviewHistory().data;
      const found = history.find((h) => h._id === id);
      return { success: !!found, data: found };
    }
  },

  // Database Seed & Management
  getSeedStatus: async () => {
    try {
      return await tryServerRequest('/seed/status');
    } catch {
      return { success: true, seeded: true, mode: 'demo' };
    }
  },

  loadSeedData: async () => {
    try {
      return await tryServerRequest('/seed/load', { method: 'POST' });
    } catch {
      demoStore.reset();
      return { success: true, message: 'Demo store reset to fresh seed data' };
    }
  },

  resetSeedData: async () => {
    try {
      return await tryServerRequest('/seed/reset', { method: 'POST' });
    } catch {
      demoStore.reset();
      return { success: true, message: 'Demo store reset' };
    }
  },
};

export default api;
