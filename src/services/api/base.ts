// Configuration de base pour les appels API
// Centralise la configuration HTTP et la gestion des erreurs

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}

export class ApiClient {
  private config: ApiConfig;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Une erreur est survenue',
        response.status,
        errorData.details
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.config.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = this.getHeaders();
    // Remove Content-Type to let browser set it with boundary for multipart/form-data
    delete headers['Content-Type'];

    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    return this.handleResponse<T>(response);
  }
}

// Instance par défaut du client API
export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Utilitaires pour la gestion des erreurs
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string' && typeof error.status === 'number';
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Une erreur inattendue est survenue';
};