// Hook personnalisé pour la gestion des opportunités
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useMutation } from './useApi';
import { opportunitiesService } from '../services/api';
import { Opportunity, OpportunityFormData } from '../types';
import { useToast } from './useToast';

export const useOpportunities = () => {
  const { 
    opportunities, 
    addOpportunity, 
    updateOpportunity, 
    deleteOpportunity,
    getOpportunitiesByEntity 
  } = useStore();
  const { success, error } = useToast();

  // Mutation pour créer une opportunité
  const createOpportunityMutation = useMutation(
    async (opportunityData: OpportunityFormData) => {
      // Ici on appellerait l'API backend
      // const backendOpportunity = OpportunitiesService.toBackendOpportunity(opportunityData, 1, 1);
      // const result = await opportunitiesService.create(backendOpportunity);
      // return OpportunitiesService.toFrontendOpportunity(result);
      
      // Pour le moment, on utilise le store local
      const opportunity = {
        ...opportunityData,
        stage: 'prospection' as const,
        competitors: [],
        documents: [],
        activities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addOpportunity(opportunity);
      return opportunity;
    },
    {
      onSuccess: () => {
        success('Opportunité créée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la création', errorMessage);
      },
    }
  );

  // Mutation pour mettre à jour une opportunité
  const updateOpportunityMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Opportunity> }) => {
      // Ici on appellerait l'API backend
      // await opportunitiesService.update(parseInt(id), updates);
      
      // Pour le moment, on utilise le store local
      updateOpportunity(id, updates);
      return { id, ...updates };
    },
    {
      onSuccess: () => {
        success('Opportunité mise à jour avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la mise à jour', errorMessage);
      },
    }
  );

  // Mutation pour supprimer une opportunité
  const deleteOpportunityMutation = useMutation(
    async (id: string) => {
      // Ici on appellerait l'API backend
      // await opportunitiesService.delete(parseInt(id));
      
      // Pour le moment, on utilise le store local
      deleteOpportunity(id);
      return id;
    },
    {
      onSuccess: () => {
        success('Opportunité supprimée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la suppression', errorMessage);
      },
    }
  );

  // Fonctions utilitaires
  const getOpportunityById = useCallback((id: string): Opportunity | undefined => {
    return opportunities.find(opportunity => opportunity.id === id);
  }, [opportunities]);

  const getActiveOpportunities = useCallback((): Opportunity[] => {
    return opportunities.filter(opportunity => 
      !['won', 'lost'].includes(opportunity.stage)
    );
  }, [opportunities]);

  const getWonOpportunities = useCallback((): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.stage === 'won');
  }, [opportunities]);

  const getLostOpportunities = useCallback((): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.stage === 'lost');
  }, [opportunities]);

  const getOpportunitiesByStage = useCallback((stage: Opportunity['stage']): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.stage === stage);
  }, [opportunities]);

  const getOpportunitiesByType = useCallback((type: Opportunity['type']): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.type === type);
  }, [opportunities]);

  const searchOpportunities = useCallback((query: string): Opportunity[] => {
    if (!query.trim()) return opportunities;
    
    const searchTerm = query.toLowerCase();
    return opportunities.filter(opportunity =>
      opportunity.title.toLowerCase().includes(searchTerm) ||
      opportunity.description.toLowerCase().includes(searchTerm)
    );
  }, [opportunities]);

  const getOpportunityStatistics = useCallback(() => {
    const total = opportunities.length;
    const active = opportunities.filter(o => !['won', 'lost'].includes(o.stage)).length;
    const won = opportunities.filter(o => o.stage === 'won').length;
    const lost = opportunities.filter(o => o.stage === 'lost').length;
    
    const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);
    const weightedValue = opportunities.reduce((sum, o) => sum + (o.value * o.probability / 100), 0);
    const averageProbability = opportunities.length > 0 
      ? opportunities.reduce((sum, o) => sum + o.probability, 0) / opportunities.length 
      : 0;
    
    const conversionRate = total > 0 ? (won / total) * 100 : 0;
    const averageDealSize = won > 0 
      ? opportunities.filter(o => o.stage === 'won').reduce((sum, o) => sum + o.value, 0) / won 
      : 0;

    return {
      total,
      active,
      won,
      lost,
      totalValue,
      weightedValue,
      averageProbability: Math.round(averageProbability),
      conversionRate: Math.round(conversionRate),
      averageDealSize: Math.round(averageDealSize),
    };
  }, [opportunities]);

  const getOpportunitiesByProbability = useCallback((minProbability: number): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.probability >= minProbability);
  }, [opportunities]);

  const getHighValueOpportunities = useCallback>(minValue: number): Opportunity[] => {
    return opportunities.filter(opportunity => opportunity.value >= minValue);
  }, [opportunities]);

  const getOpportunitiesClosingSoon = useCallback((days: number = 30): Opportunity[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return opportunities.filter(opportunity => 
      new Date(opportunity.expectedCloseDate) <= cutoffDate &&
      !['won', 'lost'].includes(opportunity.stage)
    );
  }, [opportunities]);

  return {
    // Données
    opportunities,
    
    // Mutations
    createOpportunity: createOpportunityMutation.mutate,
    updateOpportunity: updateOpportunityMutation.mutate,
    deleteOpportunity: deleteOpportunityMutation.mutate,
    
    // États des mutations
    isCreating: createOpportunityMutation.loading,
    isUpdating: updateOpportunityMutation.loading,
    isDeleting: deleteOpportunityMutation.loading,
    
    // Erreurs
    createError: createOpportunityMutation.error,
    updateError: updateOpportunityMutation.error,
    deleteError: deleteOpportunityMutation.error,
    
    // Fonctions utilitaires
    getOpportunityById,
    getOpportunitiesByEntity,
    getActiveOpportunities,
    getWonOpportunities,
    getLostOpportunities,
    getOpportunitiesByStage,
    getOpportunitiesByType,
    searchOpportunities,
    getOpportunityStatistics,
    getOpportunitiesByProbability,
    getHighValueOpportunities,
    getOpportunitiesClosingSoon,
  };
};