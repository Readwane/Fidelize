// Hook personnalisé pour la gestion des missions
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useMutation } from './useApi';
import { missionsService } from '../services/api';
import { Mission, MissionFormData } from '../types';
import { useToast } from './useToast';

export const useMissions = () => {
  const { 
    missions, 
    addMission, 
    updateMission, 
    deleteMission,
    getMissionsByEntity 
  } = useStore();
  const { success, error } = useToast();

  // Mutation pour créer une mission
  const createMissionMutation = useMutation(
    async (missionData: MissionFormData) => {
      // Ici on appellerait l'API backend
      // const backendMission = MissionsService.toBackendMission(missionData);
      // const result = await missionsService.create(backendMission);
      // return MissionsService.toFrontendMission(result);
      
      // Pour le moment, on utilise le store local
      const mission = {
        ...missionData,
        activities: [],
        tasks: [],
        documents: [],
        timesheets: [],
        milestones: [],
        actualCost: 0,
        profitability: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addMission(mission);
      return mission;
    },
    {
      onSuccess: () => {
        success('Mission créée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la création', errorMessage);
      },
    }
  );

  // Mutation pour mettre à jour une mission
  const updateMissionMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Mission> }) => {
      // Ici on appellerait l'API backend
      // await missionsService.update(parseInt(id), updates);
      
      // Pour le moment, on utilise le store local
      updateMission(id, updates);
      return { id, ...updates };
    },
    {
      onSuccess: () => {
        success('Mission mise à jour avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la mise à jour', errorMessage);
      },
    }
  );

  // Mutation pour supprimer une mission
  const deleteMissionMutation = useMutation(
    async (id: string) => {
      // Ici on appellerait l'API backend
      // await missionsService.delete(parseInt(id));
      
      // Pour le moment, on utilise le store local
      deleteMission(id);
      return id;
    },
    {
      onSuccess: () => {
        success('Mission supprimée avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la suppression', errorMessage);
      },
    }
  );

  // Fonctions utilitaires
  const getMissionById = useCallback((id: string): Mission | undefined => {
    return missions.find(mission => mission.id === id);
  }, [missions]);

  const getActiveMissions = useCallback((): Mission[] => {
    return missions.filter(mission => 
      ['draft', 'active'].includes(mission.status)
    );
  }, [missions]);

  const getCompletedMissions = useCallback((): Mission[] => {
    return missions.filter(mission => mission.status === 'completed');
  }, [missions]);

  const getMissionsByType = useCallback((type: Mission['type']): Mission[] => {
    return missions.filter(mission => mission.type === type);
  }, [missions]);

  const getMissionsByStatus = useCallback((status: Mission['status']): Mission[] => {
    return missions.filter(mission => mission.status === status);
  }, [missions]);

  const searchMissions = useCallback((query: string): Mission[] => {
    if (!query.trim()) return missions;
    
    const searchTerm = query.toLowerCase();
    return missions.filter(mission =>
      mission.title.toLowerCase().includes(searchTerm) ||
      mission.description.toLowerCase().includes(searchTerm)
    );
  }, [missions]);

  const getMissionStatistics = useCallback(() => {
    const total = missions.length;
    const active = missions.filter(m => ['draft', 'active'].includes(m.status)).length;
    const completed = missions.filter(m => m.status === 'completed').length;
    const averageProfitability = missions.length > 0 
      ? missions.reduce((sum, m) => sum + (m.profitability || 0), 0) / missions.length 
      : 0;
    
    const totalBudget = missions.reduce((sum, m) => sum + m.budget, 0);
    const totalActualCost = missions.reduce((sum, m) => sum + (m.actualCost || 0), 0);

    return {
      total,
      active,
      completed,
      averageProfitability: Math.round(averageProfitability),
      totalBudget,
      totalActualCost,
      overallProfitability: totalBudget > 0 
        ? Math.round(((totalBudget - totalActualCost) / totalBudget) * 100)
        : 0,
    };
  }, [missions]);

  const getOverdueMissions = useCallback((): Mission[] => {
    const now = new Date();
    return missions.filter(mission => 
      mission.endDate && 
      new Date(mission.endDate) < now && 
      mission.status !== 'completed'
    );
  }, [missions]);

  return {
    // Données
    missions,
    
    // Mutations
    createMission: createMissionMutation.mutate,
    updateMission: updateMissionMutation.mutate,
    deleteMission: deleteMissionMutation.mutate,
    
    // États des mutations
    isCreating: createMissionMutation.loading,
    isUpdating: updateMissionMutation.loading,
    isDeleting: deleteMissionMutation.loading,
    
    // Erreurs
    createError: createMissionMutation.error,
    updateError: updateMissionMutation.error,
    deleteError: deleteMissionMutation.error,
    
    // Fonctions utilitaires
    getMissionById,
    getMissionsByEntity,
    getActiveMissions,
    getCompletedMissions,
    getMissionsByType,
    getMissionsByStatus,
    searchMissions,
    getMissionStatistics,
    getOverdueMissions,
  };
};