import { apiGet, apiPatch, apiPost, apiDelete } from './api.client';

const API_UGATE_URL = process.env.NEXT_PUBLIC_UGATE_API_URL || 'https://traefikdev.yowyob.com/ugate';
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://traefikdev.yowyob.com/auth';

export interface StatsResponse {
  totalSyndicats: number;
  activeSyndicats: number;
  pendingSyndicats: number;
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
}

export interface SyndicateResponse {
  id: string;
  name: string;
  description: string;
  domain: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  logoUrl?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface MemberResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role: string;
  branchId: string;
  joinedAt: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  roles: string[];
}

// --- DASHBOARD ---
export const getDashboardStats = async (): Promise<StatsResponse> => {
  return apiGet<StatsResponse>(`${API_UGATE_URL}/super-admin/analytics/dashboard`);
};

export const getSyndicateMembers = async (syndicatId: string): Promise<MemberResponse[]> => {
  return apiGet<MemberResponse[]>(`${API_UGATE_URL}/admin/syndicates/${syndicatId}/members`);
};

// --- SYNDICATS ---
export const getAllSyndicates = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<SyndicateResponse>> => {
  return apiGet<PaginatedResponse<SyndicateResponse>>(`${API_UGATE_URL}/syndicates?page=${page}&size=${size}`);
};
export const approveSyndicate = async (id: string): Promise<SyndicateResponse> => apiPatch(`${API_UGATE_URL}/super-admin/syndicates/${id}/approve`, {});
export const disapproveSyndicate = async (id: string): Promise<SyndicateResponse> => apiPatch(`${API_UGATE_URL}/super-admin/syndicates/${id}/disapprove`, {});
export const activateSyndicate = async (id: string): Promise<SyndicateResponse> => apiPatch(`${API_UGATE_URL}/super-admin/syndicates/${id}/activate`, {});
export const deactivateSyndicate = async (id: string): Promise<SyndicateResponse> => apiPatch(`${API_UGATE_URL}/super-admin/syndicates/${id}/deactivate`, {});

// --- USERS & ROLES (TRAMASYS AUTH) ---
export const getAllUsers = async (): Promise<UserResponse[]> => {
  return apiGet<UserResponse[]>(`${AUTH_API_URL}/api/users`);
};
export const deleteUser = async (email: string): Promise<void> => {
  return apiDelete(`${AUTH_API_URL}/api/users/email/${email}`);
};
export const assignRole = async (userId: string, roleName: string): Promise<void> => {
  return apiPost(`${AUTH_API_URL}/api/users/${userId}/roles/${roleName}`, {});
};
export const removeRole = async (userId: string, roleName: string): Promise<void> => {
  return apiDelete(`${AUTH_API_URL}/api/users/${userId}/roles/${roleName}`);
};

// --- PROFILE ---
export const updateProfile = async (data: any): Promise<any> => apiPost(`${API_UGATE_URL}/syndicates/user`, data);
export const changePassword = async (userId: string, data: any): Promise<void> => {
  const token = localStorage.getItem('ugate_access_token');
  const res = await fetch(`${AUTH_API_URL}/api/users/${userId}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur mot de passe');
};