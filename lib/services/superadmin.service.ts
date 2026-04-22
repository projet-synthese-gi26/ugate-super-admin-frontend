/**
 * 🔧 SERVICE : SuperAdmin API
 */

// Utilisation des variables d'environnement
const API_BASE_URL = process.env.NEXT_PUBLIC_UGATE_API_URL || 'https://traefikdev.yowyob.com/ugate';
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://traefikdev.yowyob.com/auth';

const USE_MOCK_DATA = false;

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LogActivityRequest {
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
}

export interface StatsResponse {
  totalSyndicats: number;
  activeSyndicats: number;
  pendingSyndicats: number;
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
}

const MOCK_STATS: StatsResponse = {
  totalSyndicats: 248,
  activeSyndicats: 186,
  pendingSyndicats: 12,
  totalMembers: 12543,
  activeMembers: 9876,
  totalRevenue: 452300,
};

const MOCK_SYNDICATES: SyndicateResponse[] = [
  { id: '1', name: 'Syndicat des Enseignants', description: 'Desc', domain: 'Éducation', isApproved: false, isActive: true, logoUrl: '', statusUrl: '', creatorId: 'user-1', createdAt: '2024-01-15T10:00:00Z' }
];

export interface SyndicateResponse {
  id: string;
  name: string;
  description: string;
  domain: string;
  isApproved: boolean;
  logoUrl: string;
  statusUrl: string;
  creatorId: string;
  createdAt: string;
  isActive: boolean;
  type?: string;
  memberCount?: number;
  organizationId?: string;
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
  charteUrl?: string;
  certificatEngagementUrl?: string;
  listMembersUrl?: string;
  creationDate?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const getDashboardStats = async (): Promise<StatsResponse> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 500));
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    throw error;
  }
};

export const getGlobalStats = async (): Promise<StatsResponse> => {
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/syndicates/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats globales:', error);
    throw error;
  }
};

export const getAllSyndicates = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<SyndicateResponse>> => {
  if (USE_MOCK_DATA) {
    const start = page * size;
    const end = start + size;
    const paginatedData = MOCK_SYNDICATES.slice(start, end);
    return new Promise((resolve) => setTimeout(() => resolve({
      content: paginatedData, page, size, totalElements: MOCK_SYNDICATES.length, totalPages: Math.ceil(MOCK_SYNDICATES.length / size),
    }), 500));
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/syndicates?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) {
      let errorText = '';
      try { errorText = await response.text(); } catch (e) { errorText = 'Impossible'; }
      throw new Error(`Erreur ${response.status}: ${response.statusText || 'Erreur inconnue'} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      const start = page * size;
      const end = start + size;
      const paginatedData = MOCK_SYNDICATES.slice(start, end);
      return { content: paginatedData, page, size, totalElements: MOCK_SYNDICATES.length, totalPages: Math.ceil(MOCK_SYNDICATES.length / size) };
    }
    throw error;
  }
};

export const approveSyndicate = async (id: string): Promise<SyndicateResponse> => {
  if (USE_MOCK_DATA) {
    const syndicat = MOCK_SYNDICATES.find(s => s.id === id);
    if (syndicat) { syndicat.isApproved = true; return new Promise((resolve) => setTimeout(() => resolve(syndicat), 300)); }
    throw new Error('Syndicat non trouvé');
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/syndicates/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de l\'approbation du syndicat:', error);
    throw error;
  }
};

export const disapproveSyndicate = async (id: string): Promise<SyndicateResponse> => {
  if (USE_MOCK_DATA) {
    const syndicat = MOCK_SYNDICATES.find(s => s.id === id);
    if (syndicat) { syndicat.isApproved = false; return new Promise((resolve) => setTimeout(() => resolve(syndicat), 300)); }
    throw new Error('Syndicat non trouvé');
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/syndicates/${id}/disapprove`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la désapprobation du syndicat:', error);
    throw error;
  }
};

export const activateSyndicate = async (id: string): Promise<SyndicateResponse> => {
  if (USE_MOCK_DATA) {
    const syndicat = MOCK_SYNDICATES.find(s => s.id === id);
    if (syndicat) { syndicat.isActive = true; return new Promise((resolve) => setTimeout(() => resolve(syndicat), 300)); }
    throw new Error('Syndicat non trouvé');
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/syndicates/${id}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de l\'activation du syndicat:', error);
    throw error;
  }
};

export const deactivateSyndicate = async (id: string): Promise<SyndicateResponse> => {
  if (USE_MOCK_DATA) {
    const syndicat = MOCK_SYNDICATES.find(s => s.id === id);
    if (syndicat) { syndicat.isActive = false; return new Promise((resolve) => setTimeout(() => resolve(syndicat), 300)); }
    throw new Error('Syndicat non trouvé');
  }
  try {
    const token = localStorage.getItem('ugate_access_token');
    const response = await fetch(`${API_BASE_URL}/super-admin/syndicates/${id}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la désactivation du syndicat:', error);
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
  if (USE_MOCK_DATA) return new Promise((resolve) => setTimeout(() => resolve(), 300));
  try {
    const token = localStorage.getItem('ugate_access_token');
    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone || '',
    };
    const response = await fetch(`${API_BASE_URL}/syndicates/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  if (USE_MOCK_DATA) return new Promise((resolve) => setTimeout(() => resolve(), 300));
  try {
    const token = localStorage.getItem('ugate_access_token');
    // Changement effectué ici pour utiliser AUTH_API_URL
    const response = await fetch(`${AUTH_API_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du changement de mot de passe:', error);
    throw error;
  }
};

export const logActivity = async (data: LogActivityRequest): Promise<void> => {
  console.log('📝 Log d\'activité (frontend only):', {
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    timestamp: new Date().toISOString(),
    details: data.details,
  });
};