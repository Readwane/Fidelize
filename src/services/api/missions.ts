// Service API pour la gestion des missions
import { apiClient } from './base';
import { 
  Mission as BackendMission, 
  MissionType, 
  Service, 
  Evaluation,
  MissionStatus 
} from '../../types/models';
import { 
  Mission, 
  MissionFormData, 
  PaginatedResponse, 
  SearchParams, 
  PaginationParams 
} from '../../types/frontend';

export class MissionsService {
  private readonly endpoint = '/missions';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<BackendMission>> {
    return apiClient.get<PaginatedResponse<BackendMission>>(this.endpoint, params);
  }

  async getById(id: number): Promise<BackendMission> {
    return apiClient.get<BackendMission>(`${this.endpoint}/${id}`);
  }

  async create(mission: Omit<BackendMission, 'id'>): Promise<BackendMission> {
    return apiClient.post<BackendMission>(this.endpoint, mission);
  }

  async update(id: number, mission: Partial<BackendMission>): Promise<BackendMission> {
    return apiClient.put<BackendMission>(`${this.endpoint}/${id}`, mission);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Status Management =================
  
  async updateStatus(id: number, status: MissionStatus): Promise<BackendMission> {
    return apiClient.patch<BackendMission>(`${this.endpoint}/${id}/status`, { status });
  }

  async startMission(id: number): Promise<BackendMission> {
    return apiClient.post<BackendMission>(`${this.endpoint}/${id}/start`, {});
  }

  async completeMission(id: number): Promise<BackendMission> {
    return apiClient.post<BackendMission>(`${this.endpoint}/${id}/complete`, {});
  }

  async cancelMission(id: number, reason?: string): Promise<BackendMission> {
    return apiClient.post<BackendMission>(`${this.endpoint}/${id}/cancel`, { reason });
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<BackendMission[]> {
    return apiClient.get<BackendMission[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByCompany(companyId: number): Promise<BackendMission[]> {
    return apiClient.get<BackendMission[]>(`${this.endpoint}/by-company/${companyId}`);
  }

  async getByStatus(status: MissionStatus): Promise<BackendMission[]> {
    return apiClient.get<BackendMission[]>(`${this.endpoint}/by-status`, { status });
  }

  async getByType(typeId: number): Promise<BackendMission[]> {
    return apiClient.get<BackendMission[]>(`${this.endpoint}/by-type/${typeId}`);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<BackendMission[]> {
    return apiClient.get<BackendMission[]>(`${this.endpoint}/by-date-range`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  // ================= Mission Types =================
  
  async getMissionTypes(): Promise<MissionType[]> {
    return apiClient.get<MissionType[]>('/mission-types');
  }

  async createMissionType(type: Omit<MissionType, 'id'>): Promise<MissionType> {
    return apiClient.post<MissionType>('/mission-types', type);
  }

  // ================= Services =================
  
  async getServices(): Promise<Service[]> {
    return apiClient.get<Service[]>('/services');
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    return apiClient.post<Service>('/services', service);
  }

  // ================= Evaluations =================
  
  async getEvaluations(missionId: number): Promise<Evaluation[]> {
    return apiClient.get<Evaluation[]>(`${this.endpoint}/${missionId}/evaluations`);
  }

  async addEvaluation(missionId: number, evaluation: Omit<Evaluation, 'id' | 'missionId'>): Promise<Evaluation> {
    return apiClient.post<Evaluation>(`${this.endpoint}/${missionId}/evaluations`, evaluation);
  }

  async updateEvaluation(missionId: number, evaluationId: number, evaluation: Partial<Evaluation>): Promise<Evaluation> {
    return apiClient.put<Evaluation>(`${this.endpoint}/${missionId}/evaluations/${evaluationId}`, evaluation);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    averageDuration: number;
    successRate: number;
    revenueByMonth: { month: string; revenue: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  async getProfitabilityReport(missionId: number): Promise<{
    budget: number;
    actualCost: number;
    profitability: number;
    timeSpent: number;
    estimatedTime: number;
  }> {
    return apiClient.get<any>(`${this.endpoint}/${missionId}/profitability`);
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit une Mission backend en Mission frontend
   */
  static toFrontendMission(backendMission: BackendMission): Mission {
    return {
      id: backendMission.id?.toString() || '',
      title: backendMission.name,
      type: 'other', // À mapper selon le type de mission
      entityId: backendMission.companyId.toString(),
      status: this.mapMissionStatus(backendMission.status),
      startDate: backendMission.startDate,
      endDate: backendMission.endDate,
      budget: 0, // À récupérer depuis une autre source
      actualCost: 0,
      profitability: 0,
      description: backendMission.description || '',
      activities: [],
      tasks: [],
      documents: [],
      timesheets: [],
      milestones: [],
      assignedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Convertit une Mission frontend en Mission backend
   */
  static toBackendMission(frontendMission: MissionFormData): Omit<BackendMission, 'id'> {
    return {
      name: frontendMission.title,
      description: frontendMission.description,
      companyId: parseInt(frontendMission.entityId),
      startDate: frontendMission.startDate,
      endDate: frontendMission.endDate,
      status: this.mapFrontendMissionStatus(frontendMission.status),
      typeId: 1, // À mapper selon le type
      sourceId: undefined,
    };
  }

  private static mapMissionStatus(status: MissionStatus): Mission['status'] {
    switch (status) {
      case MissionStatus.INITIATED:
      case MissionStatus.PLANNED:
        return 'draft';
      case MissionStatus.IN_PROGRESS:
        return 'active';
      case MissionStatus.COMPLETED:
        return 'completed';
      case MissionStatus.CANCELLED:
        return 'cancelled';
      default:
        return 'draft';
    }
  }

  private static mapFrontendMissionStatus(status: Mission['status']): MissionStatus {
    switch (status) {
      case 'draft':
        return MissionStatus.PLANNED;
      case 'active':
        return MissionStatus.IN_PROGRESS;
      case 'completed':
        return MissionStatus.COMPLETED;
      case 'cancelled':
        return MissionStatus.CANCELLED;
      case 'archived':
        return MissionStatus.COMPLETED;
      default:
        return MissionStatus.PLANNED;
    }
  }
}

export const missionsService = new MissionsService();