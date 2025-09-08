// Point d'entrée centralisé pour tous les types
// Réexporte les types backend et frontend pour faciliter l'importation

// Types backend (modèles de données correspondant au backend Java)
export * from './models';

// Types frontend (spécifiques à l'interface utilisateur React)
export * from './frontend';

// Types utilitaires
export type ID = string | number;
export type Timestamp = Date | string;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Types pour les réponses API
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Types pour les hooks
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T>;
  reset: () => void;
  refetch: () => Promise<T>;
}

export interface UseMutationResult<TData, TVariables> {
  loading: boolean;
  error: string | null;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

// Types pour les composants
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormProps<T> extends ComponentProps {
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export interface ListProps<T> extends ComponentProps {
  data: T[];
  loading?: boolean;
  error?: string | null;
  onItemClick?: (item: T) => void;
  onItemEdit?: (item: T) => void;
  onItemDelete?: (item: T) => void;
}

// Types pour la navigation
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
}

// Types pour les filtres et la recherche
export interface FilterConfig<T> {
  field: keyof T;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  label: string;
  options?: { value: any; label: string }[];
  placeholder?: string;
}

export interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

// Types pour les permissions
export interface PermissionCheck {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
  resourceId?: string;
}

// Types pour les notifications
export interface NotificationConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration: number;
  maxNotifications: number;
}

// Types pour les thèmes
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}
