// Constantes utilisées dans l'application
// Centralise les valeurs fixes pour faciliter la maintenance

// ================= Configuration API =================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// ================= Pagination =================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// ================= Cache =================

export const CACHE_CONFIG = {
  DEFAULT_TTL: 5, // minutes
  LONG_TTL: 60, // minutes
  SHORT_TTL: 1, // minute
} as const;

// ================= Formats =================

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
} as const;

export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: 'XOF',
  LOCALE: 'fr-FR',
  DECIMAL_PLACES: 0,
} as const;

// ================= Validation =================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{8,}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// ================= Statuts =================

export const ENTITY_STATUSES = {
  CLIENT: 'client',
  PROSPECT: 'prospect',
} as const;

export const ENTITY_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const MISSION_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  CANCELLED: 'cancelled',
} as const;

export const MISSION_TYPES = {
  AUDIT_LEGAL: 'audit_legal',
  PCA: 'pca',
  FORMATION: 'formation',
  ATTESTATION: 'attestation',
  OTHER: 'other',
} as const;

export const OPPORTUNITY_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  WON: 'won',
  LOST: 'lost',
} as const;

export const OPPORTUNITY_TYPES = {
  SPONTANEOUS: 'spontaneous',
  TECHNICAL: 'technical',
  TENDER: 'tender',
} as const;

export const INTERACTION_TYPES = {
  CALL: 'call',
  EMAIL: 'email',
  MEETING: 'meeting',
  VISIT: 'visit',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
} as const;

// ================= Secteurs d'activité =================

export const SECTORS = [
  'Industrie',
  'Télécommunications',
  'Banque',
  'ONG',
  'EPE',
  'Commerce',
  'Services',
  'Agriculture',
  'Mines',
  'Transport',
  'Santé',
  'Éducation',
  'Énergie',
  'Construction',
  'Tourisme',
] as const;

// ================= Régions du Sénégal =================

export const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Kaolack',
  'Diourbel',
  'Fatick',
  'Kolda',
  'Louga',
  'Matam',
  'Sédhiou',
  'Tambacounda',
  'Ziguinchor',
  'Kaffrine',
  'Kédougou',
] as const;

// ================= Formes juridiques =================

export const LEGAL_FORMS = [
  { value: 'SA', label: 'Société Anonyme (SA)' },
  { value: 'SARL', label: 'Société à Responsabilité Limitée (SARL)' },
  { value: 'SNC', label: 'Société en Nom Collectif (SNC)' },
  { value: 'SCS', label: 'Société en Commandite Simple (SCS)' },
  { value: 'GIE', label: 'Groupement d\'Intérêt Économique (GIE)' },
  { value: 'Association', label: 'Association' },
  { value: 'ONG', label: 'Organisation Non Gouvernementale (ONG)' },
  { value: 'EPE', label: 'Entreprise Publique d\'État (EPE)' },
  { value: 'Autre', label: 'Autre' },
] as const;

// ================= Rôles utilisateur =================

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTOR: 'director',
  MISSION_MANAGER: 'mission_manager',
  CONSULTANT: 'consultant',
  COMMERCIAL: 'commercial',
  SUPPORT: 'support',
  READONLY: 'readonly',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Administrateur',
  [USER_ROLES.DIRECTOR]: 'Directeur',
  [USER_ROLES.MISSION_MANAGER]: 'Chef de Mission',
  [USER_ROLES.CONSULTANT]: 'Consultant',
  [USER_ROLES.COMMERCIAL]: 'Commercial',
  [USER_ROLES.SUPPORT]: 'Support',
  [USER_ROLES.READONLY]: 'Lecture Seule',
} as const;

// ================= Permissions =================

export const PERMISSIONS = {
  ENTITIES: {
    CREATE: 'entities:create',
    READ: 'entities:read',
    UPDATE: 'entities:update',
    DELETE: 'entities:delete',
  },
  CONTACTS: {
    CREATE: 'contacts:create',
    READ: 'contacts:read',
    UPDATE: 'contacts:update',
    DELETE: 'contacts:delete',
  },
  MISSIONS: {
    CREATE: 'missions:create',
    READ: 'missions:read',
    UPDATE: 'missions:update',
    DELETE: 'missions:delete',
    MANAGE: 'missions:manage',
  },
  OPPORTUNITIES: {
    CREATE: 'opportunities:create',
    READ: 'opportunities:read',
    UPDATE: 'opportunities:update',
    DELETE: 'opportunities:delete',
    APPROVE: 'opportunities:approve',
  },
  REPORTS: {
    VIEW: 'reports:view',
    EXPORT: 'reports:export',
    CREATE: 'reports:create',
  },
  ADMIN: {
    USERS: 'admin:users',
    SETTINGS: 'admin:settings',
    BACKUP: 'admin:backup',
  },
} as const;

// ================= Notifications =================

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  ERROR_DURATION: 8000,
  SUCCESS_DURATION: 3000,
  MAX_NOTIFICATIONS: 5,
} as const;

// ================= Thème =================

export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

// ================= Limites =================

export const LIMITS = {
  FILE_UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  SEARCH_MIN_CHARS: 2,
  SEARCH_DEBOUNCE_MS: 300,
  AUTO_SAVE_DELAY_MS: 2000,
  SESSION_WARNING_MINUTES: 5,
  MAX_BULK_OPERATIONS: 100,
} as const;

// ================= Messages =================

export const MESSAGES = {
  ERRORS: {
    NETWORK: 'Erreur de connexion réseau',
    UNAUTHORIZED: 'Accès non autorisé',
    FORBIDDEN: 'Accès interdit',
    NOT_FOUND: 'Ressource non trouvée',
    VALIDATION: 'Erreur de validation des données',
    SERVER: 'Erreur serveur interne',
    TIMEOUT: 'Délai d\'attente dépassé',
    UNKNOWN: 'Une erreur inattendue est survenue',
  },
  SUCCESS: {
    CREATED: 'Élément créé avec succès',
    UPDATED: 'Élément mis à jour avec succès',
    DELETED: 'Élément supprimé avec succès',
    SAVED: 'Données sauvegardées avec succès',
    IMPORTED: 'Import réalisé avec succès',
    EXPORTED: 'Export réalisé avec succès',
  },
  CONFIRMATIONS: {
    DELETE: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    CANCEL: 'Êtes-vous sûr de vouloir annuler ? Les modifications non sauvegardées seront perdues.',
    LOGOUT: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },
} as const;

// ================= URLs et endpoints =================

export const ENDPOINTS = {
  AUTH: '/auth',
  COMPANIES: '/companies',
  CONTACTS: '/contacts',
  MISSIONS: '/missions',
  OPPORTUNITIES: '/opportunities',
  DOCUMENTS: '/documents',
  ANALYTICS: '/analytics',
  COLLABORATORS: '/collaborators',
  SETTINGS: '/settings',
} as const;

// ================= Configuration des graphiques =================

export const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
] as const;

export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  ANIMATION_DURATION: 750,
  GRID_COLOR: '#f3f4f6',
  TEXT_COLOR: '#6b7280',
} as const;