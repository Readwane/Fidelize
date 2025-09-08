// Service API pour la gestion des opportunités
import { apiClient } from './base';
import { 
  Opportunity as BackendOpportunity, 
  Proposition, 
  Need, 
  Source,
  OpportunityStatus,
  PropositionStatus,
  PropositionType 
} from '../../types/models';
import { 
  Opportunity, 
  OpportunityFormData, 
  PaginatedResponse, 
  SearchParams, 
  PaginationParams 
} from '../../types/frontend';

export class OpportunitiesService {
  private readonly endpoint = '/opportunities';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<BackendOpportunity>> {
    return apiClient.get<PaginatedResponse<BackendOpportunity>>(this.endpoint, params);
  }

  async getById(id: number): Promise<BackendOpportunity> {
    return apiClient.get<BackendOpportunity>(`${this.endpoint}/${id}`);
  }

  async create(opportunity: Omit<BackendOpportunity, 'id'>): Promise<BackendOpportunity> {
    return apiClient.post<BackendOpportunity>(this.endpoint, opportunity);
  }

  async update(id: number, opportunity: Partial<BackendOpportunity>): Promise<BackendOpportunity> {
    return apiClient.put<BackendOpportunity>(`${this.endpoint}/${id}`, opportunity);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Status Management =================
  
  async updateStatus(id: number, status: OpportunityStatus): Promise<BackendOpportunity> {
    return apiClient.patch<BackendOpportunity>(`${this.endpoint}/${id}/status`, { status });
  }

  async closeOpportunity(id: number, won: boolean, reason?: string): Promise<BackendOpportunity> {
    return apiClient.post<BackendOpportunity>(`${this.endpoint}/${id}/close`, { won, reason });
  }

  // ================= Propositions =================
  
  async getPropositions(opportunityId: number): Promise<Proposition[]> {
    return apiClient.get<Proposition[]>(`${this.endpoint}/${opportunityId}/propositions`);
  }

  async createProposition(opportunityId: number, proposition: Omit<Proposition, 'id' | 'opportunityId'>): Promise<Proposition> {
    return apiClient.post<Proposition>(`${this.endpoint}/${opportunityId}/propositions`, proposition);
  }

  async updateProposition(opportunityId: number, propositionId: number, proposition: Partial<Proposition>): Promise<Proposition> {
    return apiClient.put<Proposition>(`${this.endpoint}/${opportunityId}/propositions/${propositionId}`, proposition);
  }

  async submitProposition(opportunityId: number, propositionId: number): Promise<Proposition> {
    return apiClient.post<Proposition>(`${this.endpoint}/${opportunityId}/propositions/${propositionId}/submit`, {});
  }

  // ================= Needs =================
  
  async getNeeds(): Promise<Need[]> {
    return apiClient.get<Need[]>('/needs');
  }

  async createNeed(need: Omit<Need, 'id'>): Promise<Need> {
    return apiClient.post<Need>('/needs', need);
  }

  async updateNeed(id: number, need: Partial<Need>): Promise<Need> {
    return apiClient.put<Need>(`/needs/${id}`, need);
  }

  // ================= Sources =================
  
  async getSources(): Promise<Source[]> {
    return apiClient.get<Source[]>('/sources');
  }

  async createSource(source: Omit<Source, 'id'>): Promise<Source> {
    return apiClient.post<Source>('/sources', source);
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<BackendOpportunity[]> {
    return apiClient.get<BackendOpportunity[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByCompany(companyId: number): Promise<BackendOpportunity[]> {
    return apiClient.get<BackendOpportunity[]>(`${this.endpoint}/by-company/${companyId}`);
  }

  async getByStatus(status: OpportunityStatus): Promise<BackendOpportunity[]> {
    return apiClient.get<BackendOpportunity[]>(`${this.endpoint}/by-status`, { status });
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<BackendOpportunity[]> {
    return apiClient.get<BackendOpportunity[]>(`${this.endpoint}/by-date-range`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalOpportunities: number;
    activeOpportunities: number;
    wonOpportunities: number;
    lostOpportunities: number;
    totalValue: number;
    averageProbability: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycle: number;
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  async getPipelineData(): Promise<{
    stage: string;
    count: number;
    value: number;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/pipeline`);
  }

  async getConversionFunnel(): Promise<{
    stage: string;
    count: number;
    conversionRate: number;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/conversion-funnel`);
  }

  // ================= Forecasting =================
  
  async getForecast(period: 'month' | 'quarter' | 'year'): Promise<{
    period: string;
    predictedRevenue: number;
    confidence: number;
    opportunities: {
      id: number;
      name: string;
      probability: number;
      value: number;
    }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/forecast`, { period });
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit une Opportunity backend en Opportunity frontend
   */
  static toFrontendOpportunity(backendOpportunity: BackendOpportunity): Opportunity {
    return {
      id: backendOpportunity.id?.toString() || '',
      title: backendOpportunity.name,
      entityId: '', // À mapper depuis sourceId ou needId
      type: 'spontaneous', // À déterminer selon la logique métier
      stage: this.mapOpportunityStatus(backendOpportunity.status),
      value: 0, // À récupérer depuis Proposition
      probability: 50, // Valeur par défaut
      expectedCloseDate: backendOpportunity.deadline || new Date(),
      description: backendOpportunity.description,
      competitors: [],
      documents: [],
      activities: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Convertit une Opportunity frontend en Opportunity backend
   */
  static toBackendOpportunity(frontendOpportunity: OpportunityFormData, sourceId: number, needId: number): Omit<BackendOpportunity, 'id'> {
    return {
      name: frontendOpportunity.title,
      description: frontendOpportunity.description,
      deadline: frontendOpportunity.expectedCloseDate,
      status: OpportunityStatus.OPEN,
      sourceId,
      needId,
    };
  }

  private static mapOpportunityStatus(status: OpportunityStatus): Opportunity['stage'] {
    switch (status) {
      case OpportunityStatus.OPEN:
        return 'prospection';
      case OpportunityStatus.TACKED_AND_CLOSED:
        return 'won';
      case OpportunityStatus.CLOSED_NOT_TACKED:
        return 'lost';
      default:
        return 'prospection';
    }
  }
}

export const opportunitiesService = new OpportunitiesService();