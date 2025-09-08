// Service API pour l'authentification
import { apiClient } from './base';
import { AuthRequest, AuthResponse, RefreshTokenRequest } from '../../types/models';

export class AuthService {
  private readonly endpoint = '/auth';

  // ================= Authentication =================
  
  async login(credentials: { username: string; password: string; rememberMe?: boolean }): Promise<AuthResponse> {
    const authRequest: AuthRequest = {
      username: credentials.username,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    };

    const response = await apiClient.post<AuthResponse>(`${this.endpoint}/login`, authRequest);
    
    // Stocker le token dans le client API
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      this.storeTokens(response);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(`${this.endpoint}/logout`, {});
    } finally {
      // Nettoyer les tokens même si la requête échoue
      this.clearTokens();
      apiClient.clearToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    const request: RefreshTokenRequest = { refreshToken };
    const response = await apiClient.post<AuthResponse>(`${this.endpoint}/refresh`, request);
    
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      this.storeTokens(response);
    }
    
    return response;
  }

  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get<void>(`${this.endpoint}/validate`);
      return true;
    } catch {
      return false;
    }
  }

  // ================= Password Management =================
  
  async requestPasswordReset(email: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/forgot-password`, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/reset-password`, { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // ================= Session Management =================
  
  async getCurrentSession(): Promise<{ sessionId: number; startTime: Date; expiresAt: Date }> {
    return apiClient.get<any>(`${this.endpoint}/session`);
  }

  async extendSession(): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/extend-session`, {});
  }

  async terminateSession(sessionId?: number): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/terminate-session`, { sessionId });
  }

  async getActiveSessions(): Promise<{
    sessionId: number;
    startTime: Date;
    lastActivity: Date;
    ipAddress: string;
    userAgent: string;
    isCurrent: boolean;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/sessions`);
  }

  // ================= Token Management =================
  
  private storeTokens(authResponse: AuthResponse): void {
    localStorage.setItem('access_token', authResponse.accessToken);
    
    if (authResponse.refreshToken) {
      localStorage.setItem('refresh_token', authResponse.refreshToken);
    }
    
    if (authResponse.expiresIn) {
      const expiresAt = new Date(Date.now() + authResponse.expiresIn * 1000);
      localStorage.setItem('token_expires_at', expiresAt.toISOString());
    }
    
    if (authResponse.userId) {
      localStorage.setItem('user_id', authResponse.userId.toString());
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_id');
  }

  // ================= Utility Methods =================
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (!token || !expiresAt) {
      return false;
    }
    
    return new Date() < new Date(expiresAt);
  }

  getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getStoredUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  shouldRefreshToken(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (!expiresAt) {
      return false;
    }
    
    const expirationTime = new Date(expiresAt);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    
    return expirationTime <= fiveMinutesFromNow;
  }

  // ================= Auto-refresh Logic =================
  
  async setupAutoRefresh(): Promise<void> {
    const checkAndRefresh = async () => {
      if (this.shouldRefreshToken()) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.error('Erreur lors du rafraîchissement automatique du token:', error);
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      }
    };

    // Vérifier toutes les minutes
    setInterval(checkAndRefresh, 60 * 1000);
    
    // Vérifier immédiatement
    await checkAndRefresh();
  }
}

export const authService = new AuthService();