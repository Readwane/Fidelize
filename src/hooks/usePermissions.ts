// Hook personnalisé pour la gestion des permissions
import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { PERMISSIONS, USER_ROLES } from '../utils/constants';

export const usePermissions = () => {
  const { user, hasRole, hasAnyRole, canAccess } = useAuth();

  // Vérifications de permissions spécifiques
  const canCreateEntity = useCallback((): boolean => {
    return canAccess('entities', 'create') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canEditEntity = useCallback((entityId?: string): boolean => {
    return canAccess('entities', 'update') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canDeleteEntity = useCallback((entityId?: string): boolean => {
    return canAccess('entities', 'delete') || hasRole(USER_ROLES.DIRECTOR);
  }, [canAccess, hasRole]);

  const canCreateContact = useCallback((): boolean => {
    return canAccess('contacts', 'create') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL, USER_ROLES.CONSULTANT]);
  }, [canAccess, hasAnyRole]);

  const canEditContact = useCallback((contactId?: string): boolean => {
    return canAccess('contacts', 'update') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL, USER_ROLES.CONSULTANT]);
  }, [canAccess, hasAnyRole]);

  const canDeleteContact = useCallback((contactId?: string): boolean => {
    return canAccess('contacts', 'delete') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canCreateMission = useCallback((): boolean => {
    return canAccess('missions', 'create') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.MISSION_MANAGER]);
  }, [canAccess, hasAnyRole]);

  const canEditMission = useCallback((missionId?: string): boolean => {
    return canAccess('missions', 'update') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.MISSION_MANAGER]);
  }, [canAccess, hasAnyRole]);

  const canDeleteMission = useCallback((missionId?: string): boolean => {
    return canAccess('missions', 'delete') || hasRole(USER_ROLES.DIRECTOR);
  }, [canAccess, hasRole]);

  const canManageMission = useCallback((missionId?: string): boolean => {
    return canAccess('missions', 'manage') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.MISSION_MANAGER]);
  }, [canAccess, hasAnyRole]);

  const canCreateOpportunity = useCallback((): boolean => {
    return canAccess('opportunities', 'create') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canEditOpportunity = useCallback((opportunityId?: string): boolean => {
    return canAccess('opportunities', 'update') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canDeleteOpportunity = useCallback((opportunityId?: string): boolean => {
    return canAccess('opportunities', 'delete') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canApproveOpportunity = useCallback((opportunityId?: string): boolean => {
    return canAccess('opportunities', 'approve') || hasRole(USER_ROLES.DIRECTOR);
  }, [canAccess, hasRole]);

  const canViewReports = useCallback((): boolean => {
    return canAccess('reports', 'view') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.MISSION_MANAGER, USER_ROLES.COMMERCIAL]);
  }, [canAccess, hasAnyRole]);

  const canExportReports = useCallback((): boolean => {
    return canAccess('reports', 'export') || hasAnyRole([USER_ROLES.DIRECTOR, USER_ROLES.MISSION_MANAGER]);
  }, [canAccess, hasAnyRole]);

  const canCreateReports = useCallback((): boolean => {
    return canAccess('reports', 'create') || hasRole(USER_ROLES.DIRECTOR);
  }, [canAccess, hasRole]);

  const canAccessAdmin = useCallback((): boolean => {
    return hasAnyRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR]);
  }, [hasAnyRole]);

  const canManageUsers = useCallback((): boolean => {
    return canAccess('admin', 'users') || hasRole(USER_ROLES.SUPER_ADMIN);
  }, [canAccess, hasRole]);

  const canManageSettings = useCallback((): boolean => {
    return canAccess('admin', 'settings') || hasAnyRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR]);
  }, [canAccess, hasAnyRole]);

  const canManageBackup = useCallback((): boolean => {
    return canAccess('admin', 'backup') || hasRole(USER_ROLES.SUPER_ADMIN);
  }, [canAccess, hasRole]);

  // Vérification de permission générique avec cache
  const checkPermission = useCallback((module: string, action: string, resourceId?: string): boolean => {
    if (!user) return false;
    
    // Cache des permissions pour éviter les recalculs
    const cacheKey = `${module}:${action}:${resourceId || 'global'}`;
    
    // Super admin a tous les droits
    if (user.role === USER_ROLES.SUPER_ADMIN) return true;
    
    // Vérifier les permissions spécifiques
    return user.permissions.some(permission => 
      permission.module === module && 
      permission.actions.includes(action as any)
    );
  }, [user]);

  // Obtenir toutes les permissions de l'utilisateur
  const getUserPermissions = useCallback((): string[] => {
    if (!user) return [];
    
    return user.permissions.flatMap(permission => 
      permission.actions.map(action => `${permission.module}:${action}`)
    );
  }, [user]);

  // Vérifier si l'utilisateur a des permissions limitées
  const hasLimitedAccess = useCallback((): boolean => {
    return hasAnyRole([USER_ROLES.READONLY, USER_ROLES.SUPPORT]);
  }, [hasAnyRole]);

  // Obtenir le niveau d'accès de l'utilisateur
  const getAccessLevel = useCallback((): 'admin' | 'manager' | 'user' | 'readonly' => {
    if (!user) return 'readonly';
    
    if (hasAnyRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR])) return 'admin';
    if (hasAnyRole([USER_ROLES.MISSION_MANAGER, USER_ROLES.COMMERCIAL])) return 'manager';
    if (hasAnyRole([USER_ROLES.CONSULTANT])) return 'user';
    
    return 'readonly';
  }, [user, hasAnyRole]);

  return {
    // État utilisateur
    user,
    isLoading,
    isInitialized,
    
    // Permissions entités
    canCreateEntity,
    canEditEntity,
    canDeleteEntity,
    
    // Permissions contacts
    canCreateContact,
    canEditContact,
    canDeleteContact,
    
    // Permissions missions
    canCreateMission,
    canEditMission,
    canDeleteMission,
    canManageMission,
    
    // Permissions opportunités
    canCreateOpportunity,
    canEditOpportunity,
    canDeleteOpportunity,
    canApproveOpportunity,
    
    // Permissions rapports
    canViewReports,
    canExportReports,
    canCreateReports,
    
    // Permissions admin
    canAccessAdmin,
    canManageUsers,
    canManageSettings,
    canManageBackup,
    
    // Utilitaires
    checkPermission,
    getUserPermissions,
    hasLimitedAccess,
    getAccessLevel,
  };
};