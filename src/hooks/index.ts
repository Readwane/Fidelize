// Point d'entrée centralisé pour tous les hooks personnalisés
// Facilite l'importation des hooks dans les composants

// Hooks API
export { useApi, usePaginatedApi, useMutation, useCachedApi, useRealTimeApi } from './useApi';

// Hooks métier
export { useEntities } from './useEntities';
export { useContacts } from './useContacts';
export { useMissions } from './useMissions';
export { useOpportunities } from './useOpportunities';
export { useInteractions } from './useInteractions';

// Hooks UI
export { useToast } from './useToast';

// Hook pour la gestion de l'authentification
export { useAuth } from './useAuth';

// Hook pour la gestion des permissions
export { usePermissions } from './usePermissions';

// Hook pour la gestion des filtres et recherche
export { useFilters } from './useFilters';

// Hook pour la gestion de la pagination
export { usePagination } from './usePagination';