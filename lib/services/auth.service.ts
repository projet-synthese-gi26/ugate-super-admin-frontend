/**
 * Service d'Authentification
 *
 * Ce fichier contient toutes les fonctions pour :
 * - Se connecter à l'API
 * - Gérer les tokens (stockage, récupération, suppression)
 * - Rafraîchir automatiquement les tokens
 * - Décoder et valider les tokens JWT
 */

import {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  DecodedToken,
  UserInfo
} from '@/lib/types/auth';

// Utilisation de la variable d'environnement avec l'URL de fallback
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://traefikdev.yowyob.com/auth';

// Clés pour le stockage local
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ugate_access_token',
  REFRESH_TOKEN: 'ugate_refresh_token',
  USER_INFO: 'ugate_user_info',
  TOKEN_EXPIRY: 'ugate_token_expiry',
};

/**
 * 🔐 FONCTION 1 : LOGIN
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔄 Tentative de connexion pour:', credentials.identifier);

    // Appel à l'API de login
    const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Réponse API:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || errorData.error || 'Échec de la connexion');
    }

    const data: LoginResponse = await response.json();
    console.log('✅ Connexion réussie !');
    saveAuthData(data);

    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * 💾 FONCTION 2 : SAUVEGARDER LES DONNÉES D'AUTHENTIFICATION
 */
export const saveAuthData = (data: LoginResponse): void => {
  console.log('💾 Sauvegarde des données d\'authentification...');
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));

  const expiresInSeconds = data.expiresIn || 3600;
  const expiryTime = Date.now() + (expiresInSeconds * 1000);
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

  console.log('✅ Données sauvegardées avec succès');
};

/**
 * 🔑 FONCTION 3 : RÉCUPÉRER L'ACCESS TOKEN
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * 🔄 FONCTION 4 : RÉCUPÉRER LE REFRESH TOKEN
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * 👤 FONCTION 5 : RÉCUPÉRER LES INFOS UTILISATEUR
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (!userInfoStr) return null;

  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('❌ Erreur lors du parsing des infos utilisateur:', error);
    return null;
  }
};

/**
 * ⏰ FONCTION 6 : VÉRIFIER SI LE TOKEN EST EXPIRÉ
 */
export const isTokenExpired = (): boolean => {
  const expiryTimeStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiryTimeStr) return true;

  const expiryTime = parseInt(expiryTimeStr, 10);
  const now = Date.now();
  const isExpired = now >= (expiryTime - 60000);

  if (isExpired) console.log('⚠️ Token expiré ou sur le point d\'expirer');
  return isExpired;
};

/**
 * 🔄 FONCTION 7 : RAFRAÎCHIR LE TOKEN
 */
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    console.log('🔄 Rafraîchissement du token...');
    const refreshToken = getRefreshToken();

    if (!refreshToken) throw new Error('Aucun refresh token disponible');

    const response = await fetch(`${AUTH_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error('❌ Échec du refresh token');
      logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    const data: RefreshTokenResponse = await response.json();
    console.log('✅ Token rafraîchi avec succès !');

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);

    const expiryTime = Date.now() + (data.expiresIn * 1000);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

    return data;
  } catch (error) {
    console.error('❌ Erreur lors du refresh:', error);
    throw error;
  }
};

/**
 * 🚪 FONCTION 8 : DÉCONNEXION
 */
export const logout = (): void => {
  console.log('🚪 Déconnexion en cours...');
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  console.log('✅ Déconnexion réussie');
};

/**
 * ✅ FONCTION 9 : VÉRIFIER SI L'UTILISATEUR EST AUTHENTIFIÉ
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && !isTokenExpired();
};

/**
 * 🔓 FONCTION 10 : DÉCODER LE TOKEN JWT
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Format de token invalide');
    const payload = parts[1];
    const decodedPayload = atob(payload);
    const decoded: DecodedToken = JSON.parse(decodedPayload);
    return decoded;
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

/**
 * 🛡️ FONCTION 11 : VÉRIFIER LE RÔLE DE L'UTILISATEUR
 */
export const hasRole = (requiredRole: string): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.roles?.includes(requiredRole) || false;
};

/**
 * 🔐 FONCTION 12 : VÉRIFIER SI C'EST UN SUPER ADMIN
 */
export const isSuperAdmin = (): boolean => {
  return hasRole('SUPER_ADMIN') || hasRole('ADMIN');
};