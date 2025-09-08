// Hook personnalisé pour la gestion de l'authentification
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { authService } from '../services/api';
import { User } from '../types';
import { useToast } from './useToast';

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Vérifier la validité du token
          const isValid = await authService.validateToken();
          
          if (isValid) {
            // Récupérer les informations utilisateur
            // const user = await collaboratorsService.getCurrentUser();
            // setCurrentUser(CollaboratorsService.toFrontendUser(user));
          } else {
            // Token invalide, nettoyer
            authService.clearToken();
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
        authService.clearToken();
        setCurrentUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [setCurrentUser]);

  // Configuration du rafraîchissement automatique des tokens
  useEffect(() => {
    if (currentUser) {
      authService.setupAutoRefresh().catch(console.error);
    }
  }, [currentUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    try {
      const authResponse = await authService.login(credentials);
      
      if (authResponse.accessToken) {
        // Récupérer les informations utilisateur
        // const user = await collaboratorsService.getCurrentUser();
        // setCurrentUser(CollaboratorsService.toFrontendUser(user));
        
        // Pour le moment, utiliser un utilisateur mock
        const mockUser: User = {
          id: authResponse.userId?.toString() || '1',
          firstName: 'Jean',
          lastName: 'Sawadogo',
          email: credentials.username,
          role: 'director',
          permissions: [],
          isActive: true,
          lastLogin: new Date(),
          createdAt: new Date(),
        };
        setCurrentUser(mockUser);
        
        success('Connexion réussie', `Bienvenue ${mockUser.firstName} !`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      error('Échec de la connexion', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentUser, success, error]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setCurrentUser(null);
      success('Déconnexion réussie');
    } catch (err) {
      // Même en cas d'erreur, on déconnecte localement
      setCurrentUser(null);
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentUser, success]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      success('Mot de passe modifié avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe';
      error('Échec du changement de mot de passe', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [success, error]);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.requestPasswordReset(email);
      success('Email de réinitialisation envoyé', 'Vérifiez votre boîte mail');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la demande de réinitialisation';
      error('Échec de la demande', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [success, error]);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.resetPassword(token, newPassword);
      success('Mot de passe réinitialisé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation';
      error('Échec de la réinitialisation', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [success, error]);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch (err) {
      // En cas d'échec du refresh, déconnecter l'utilisateur
      setCurrentUser(null);
      error('Session expirée', 'Veuillez vous reconnecter');
      throw err;
    }
  }, [setCurrentUser, error]);

  const getActiveSessions = useCallback(async () => {
    try {
      return await authService.getActiveSessions();
    } catch (err) {
      console.error('Erreur lors de la récupération des sessions:', err);
      return [];
    }
  }, []);

  const terminateSession = useCallback(async (sessionId?: number): Promise<void> => {
    try {
      await authService.terminateSession(sessionId);
      success('Session terminée avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la terminaison de session';
      error('Échec de la terminaison', errorMessage);
      throw err;
    }
  }, [success, error]);

  // Vérifications d'état
  const isAuthenticated = useCallback((): boolean => {
    return !!currentUser && authService.isAuthenticated();
  }, [currentUser]);

  const hasRole = useCallback((role: string): boolean => {
    return currentUser?.role === role;
  }, [currentUser]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return !!currentUser && roles.includes(currentUser.role);
  }, [currentUser]);

  const canAccess = useCallback((module: string, action: string): boolean => {
    if (!currentUser) return false;
    
    // Super admin a tous les droits
    if (currentUser.role === 'super_admin') return true;
    
    // Vérifier les permissions spécifiques
    return currentUser.permissions.some(permission => 
      permission.module === module && 
      permission.actions.includes(action as any)
    );
  }, [currentUser]);

  return {
    // État
    user: currentUser,
    isLoading,
    isInitialized,
    isAuthenticated: isAuthenticated(),
    
    // Actions
    login,
    logout,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshToken,
    
    // Sessions
    getActiveSessions,
    terminateSession,
    
    // Permissions
    hasRole,
    hasAnyRole,
    canAccess,
  };
};