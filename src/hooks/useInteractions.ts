// Hook personnalisé pour la gestion des interactions
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useMutation } from './useApi';
import { Interaction, InteractionFormData } from '../types';
import { useToast } from './useToast';

export const useInteractions = () => {
  const { 
    interactions, 
    addInteraction, 
    updateInteraction, 
    deleteInteraction 
  } = useStore();
  const { success, error } = useToast();

  // Mutation pour créer une interaction
  const createInteractionMutation = useMutation(
    async (interactionData: InteractionFormData) => {
      // Ici on appellerait l'API backend
      // const result = await interactionsService.create(interactionData);
      
      // Pour le moment, on utilise le store local
      addInteraction(interactionData);
      return interactionData;
    },
    {
      onSuccess: () => {
        success('Interaction enregistrée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de l\'enregistrement', errorMessage);
      },
    }
  );

  // Mutation pour mettre à jour une interaction
  const updateInteractionMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Interaction> }) => {
      // Ici on appellerait l'API backend
      // await interactionsService.update(parseInt(id), updates);
      
      // Pour le moment, on utilise le store local
      updateInteraction(id, updates);
      return { id, ...updates };
    },
    {
      onSuccess: () => {
        success('Interaction mise à jour avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la mise à jour', errorMessage);
      },
    }
  );

  // Mutation pour supprimer une interaction
  const deleteInteractionMutation = useMutation(
    async (id: string) => {
      // Ici on appellerait l'API backend
      // await interactionsService.delete(parseInt(id));
      
      // Pour le moment, on utilise le store local
      deleteInteraction(id);
      return id;
    },
    {
      onSuccess: () => {
        success('Interaction supprimée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la suppression', errorMessage);
      },
    }
  );

  // Fonctions utilitaires
  const getInteractionById = useCallback((id: string): Interaction | undefined => {
    return interactions.find(interaction => interaction.id === id);
  }, [interactions]);

  const getInteractionsByEntity = useCallback((entityId: string): Interaction[] => {
    return interactions.filter(interaction => interaction.entityId === entityId);
  }, [interactions]);

  const getInteractionsByContact = useCallback((contactId: string): Interaction[] => {
    return interactions.filter(interaction => interaction.contactId === contactId);
  }, [interactions]);

  const getInteractionsByType = useCallback((type: Interaction['type']): Interaction[] => {
    return interactions.filter(interaction => interaction.type === type);
  }, [interactions]);

  const getTodayInteractions = useCallback((): Interaction[] => {
    const today = new Date().toDateString();
    return interactions.filter(interaction => 
      new Date(interaction.date).toDateString() === today
    );
  }, [interactions]);

  const getInteractionsRequiringFollowUp = useCallback((): Interaction[] => {
    return interactions.filter(interaction => 
      interaction.followUpRequired && 
      interaction.followUpDate &&
      new Date(interaction.followUpDate) >= new Date()
    );
  }, [interactions]);

  const getOverdueFollowUps = useCallback((): Interaction[] => {
    const now = new Date();
    return interactions.filter(interaction => 
      interaction.followUpRequired && 
      interaction.followUpDate &&
      new Date(interaction.followUpDate) < now
    );
  }, [interactions]);

  const searchInteractions = useCallback((query: string): Interaction[] => {
    if (!query.trim()) return interactions;
    
    const searchTerm = query.toLowerCase();
    return interactions.filter(interaction =>
      interaction.subject.toLowerCase().includes(searchTerm) ||
      interaction.description.toLowerCase().includes(searchTerm) ||
      (interaction.outcome && interaction.outcome.toLowerCase().includes(searchTerm))
    );
  }, [interactions]);

  const getInteractionStatistics = useCallback(() => {
    const total = interactions.length;
    const today = getTodayInteractions().length;
    const followUpRequired = getInteractionsRequiringFollowUp().length;
    const overdueFollowUps = getOverdueFollowUps().length;
    
    const byType = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageDuration = interactions
      .filter(i => i.duration)
      .reduce((sum, i) => sum + (i.duration || 0), 0) / 
      interactions.filter(i => i.duration).length || 0;

    return {
      total,
      today,
      followUpRequired,
      overdueFollowUps,
      byType,
      averageDuration: Math.round(averageDuration),
    };
  }, [interactions, getTodayInteractions, getInteractionsRequiringFollowUp, getOverdueFollowUps]);

  const getRecentInteractions = useCallback((limit: number = 10): Interaction[] => {
    return [...interactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [interactions]);

  return {
    // Données
    interactions,
    
    // Mutations
    createInteraction: createInteractionMutation.mutate,
    updateInteraction: updateInteractionMutation.mutate,
    deleteInteraction: deleteInteractionMutation.mutate,
    
    // États des mutations
    isCreating: createInteractionMutation.loading,
    isUpdating: updateInteractionMutation.loading,
    isDeleting: deleteInteractionMutation.loading,
    
    // Erreurs
    createError: createInteractionMutation.error,
    updateError: updateInteractionMutation.error,
    deleteError: deleteInteractionMutation.error,
    
    // Fonctions utilitaires
    getInteractionById,
    getInteractionsByEntity,
    getInteractionsByContact,
    getInteractionsByType,
    getTodayInteractions,
    getInteractionsRequiringFollowUp,
    getOverdueFollowUps,
    searchInteractions,
    getInteractionStatistics,
    getRecentInteractions,
  };
};