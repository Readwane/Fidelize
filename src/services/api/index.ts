// Point d'entrée centralisé pour tous les services API
// Facilite l'importation et la gestion des services

export { apiClient, type ApiConfig, type ApiError, isApiError, getErrorMessage } from './base';

// Services
export { companiesService, CompaniesService } from './companies';
export { contactsService, ContactsService } from './contacts';
export { missionsService, MissionsService } from './missions';
export { opportunitiesService, OpportunitiesService } from './opportunities';
export { documentsService, DocumentsService } from './documents';
export { collaboratorsService, CollaboratorsService } from './collaborators';
export { authService, AuthService } from './auth';
export { analyticsService, AnalyticsService } from './analytics';

// Configuration globale des services
export const configureServices = (config: {
  baseURL?: string;
  timeout?: number;
  onUnauthorized?: () => void;
  onError?: (error: any) => void;
}) => {
  // Configurer l'URL de base si fournie
  if (config.baseURL) {
    apiClient['config'].baseURL = config.baseURL;
  }

  // Configurer le timeout si fourni
  if (config.timeout) {
    apiClient['config'].timeout = config.timeout;
  }

  // Intercepteur pour les erreurs d'authentification
  if (config.onUnauthorized) {
    const originalHandleResponse = apiClient['handleResponse'];
    apiClient['handleResponse'] = async function<T>(response: Response): Promise<T> {
      if (response.status === 401) {
        config.onUnauthorized?.();
      }
      return originalHandleResponse.call(this, response);
    };
  }

  // Gestionnaire d'erreur global
  if (config.onError) {
    window.addEventListener('unhandledrejection', (event) => {
      if (isApiError(event.reason)) {
        config.onError?.(event.reason);
      }
    });
  }
};

// Utilitaires pour la gestion des erreurs
export const handleApiError = (error: unknown, defaultMessage: string = 'Une erreur est survenue'): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
};

// Types d'erreurs communes
export const API_ERRORS = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Erreur de validation',
  SERVER_ERROR: 'Erreur serveur interne',
  TIMEOUT: 'Délai d\'attente dépassé',
} as const;

// Helpers pour les requêtes communes
export const createPaginationParams = (page: number = 0, size: number = 20, sort?: string): {
  page: number;
  size: number;
  sort?: string;
} => ({
  page,
  size,
  sort,
});

export const createSearchParams = (query: string, filters?: Record<string, any>): {
  query: string;
  filters?: Record<string, any>;
} => ({
  query,
  filters,
});

// Validation des données avant envoi à l'API
export const validateRequired = (data: Record<string, any>, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`Le champ ${field} est requis`);
    }
  });
  
  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
};

// Cache simple pour les données fréquemment utilisées
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new SimpleCache();