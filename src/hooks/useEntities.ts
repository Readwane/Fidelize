// Hook personnalisé pour la gestion des entités
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useMutation, useApi } from './useApi';
import { companiesService } from '../services/api';
import { Entity, EntityFormData } from '../types';
import { useToast } from './useToast';

export const useEntities = () => {
  const { 
    entities, 
    addEntity, 
    updateEntity, 
    deleteEntity,
    getEntitiesByStatus,
    calculateScore 
  } = useStore();
  const { success, error } = useToast();

  // Mutation pour créer une entité
  const createEntityMutation = useMutation(
    async (entityData: EntityFormData) => {
      // Ici on appellerait l'API backend
      // const result = await companiesService.create(CompaniesService.toCompany(entityData, 1));
      // return CompaniesService.toEntity(result);
      
      // Pour le moment, on utilise le store local
      const entity = {
        ...entityData,
        score: calculateScore(entityData),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addEntity(entity);
      return entity;
    },
    {
      onSuccess: () => {
        success('Entreprise créée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la création', errorMessage);
      },
    }
  );

  // Mutation pour mettre à jour une entité
  const updateEntityMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Entity> }) => {
      // Ici on appellerait l'API backend
      // const result = await companiesService.update(parseInt(id), updates);
      // return CompaniesService.toEntity(result);
      
      // Pour le moment, on utilise le store local
      updateEntity(id, updates);
      return { id, ...updates };
    },
    {
      onSuccess: () => {
        success('Entreprise mise à jour avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la mise à jour', errorMessage);
      },
    }
  );

  // Mutation pour supprimer une entité
  const deleteEntityMutation = useMutation(
    async (id: string) => {
      // Ici on appellerait l'API backend
      // await companiesService.delete(parseInt(id));
      
      // Pour le moment, on utilise le store local
      deleteEntity(id);
      return id;
    },
    {
      onSuccess: () => {
        success('Entreprise supprimée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la suppression', errorMessage);
      },
    }
  );

  // Fonctions utilitaires
  const getEntityById = useCallback((id: string): Entity | undefined => {
    return entities.find(entity => entity.id === id);
  }, [entities]);

  const getClientEntities = useCallback((): Entity[] => {
    return getEntitiesByStatus('client');
  }, [getEntitiesByStatus]);

  const getProspectEntities = useCallback((): Entity[] => {
    return getEntitiesByStatus('prospect');
  }, [getEntitiesByStatus]);

  const searchEntities = useCallback((query: string): Entity[] => {
    if (!query.trim()) return entities;
    
    const searchTerm = query.toLowerCase();
    return entities.filter(entity =>
      entity.companyName.toLowerCase().includes(searchTerm) ||
      entity.sector.toLowerCase().includes(searchTerm) ||
      entity.region.toLowerCase().includes(searchTerm)
    );
  }, [entities]);

  const getEntitiesByScore = useCallback((minScore: number): Entity[] => {
    return entities.filter(entity => entity.score >= minScore);
  }, [entities]);

  const getTopEntities = useCallback(limit: number = 10): Entity[] => {
    return [...entities]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [entities]);

  return {
    // Données
    entities,
    
    // Mutations
    createEntity: createEntityMutation.mutate,
    updateEntity: updateEntityMutation.mutate,
    deleteEntity: deleteEntityMutation.mutate,
    
    // États des mutations
    isCreating: createEntityMutation.loading,
    isUpdating: updateEntityMutation.loading,
    isDeleting: deleteEntityMutation.loading,
    
    // Erreurs
    createError: createEntityMutation.error,
    updateError: updateEntityMutation.error,
    deleteError: deleteEntityMutation.error,
    
    // Fonctions utilitaires
    getEntityById,
    getClientEntities,
    getProspectEntities,
    searchEntities,
    getEntitiesByScore,
    getTopEntities,
    calculateScore,
  };
};