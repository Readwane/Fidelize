// Service API pour la gestion des entreprises
import { apiClient } from './base';
import { Company, FinancialData, Location, Sector, CompanySector } from '../../types/models';
import { Entity, EntityFormData, PaginatedResponse, SearchParams, PaginationParams } from '../../types/frontend';

export class CompaniesService {
  private readonly endpoint = '/companies';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<Company>> {
    return apiClient.get<PaginatedResponse<Company>>(this.endpoint, params);
  }

  async getById(id: number): Promise<Company> {
    return apiClient.get<Company>(`${this.endpoint}/${id}`);
  }

  async create(company: Omit<Company, 'id'>): Promise<Company> {
    return apiClient.post<Company>(this.endpoint, company);
  }

  async update(id: number, company: Partial<Company>): Promise<Company> {
    return apiClient.put<Company>(`${this.endpoint}/${id}`, company);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<Company[]> {
    return apiClient.get<Company[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByStatus(isProspect: boolean): Promise<Company[]> {
    return apiClient.get<Company[]>(`${this.endpoint}/by-status`, { isProspect });
  }

  async getBySector(sectorId: number): Promise<Company[]> {
    return apiClient.get<Company[]>(`${this.endpoint}/by-sector/${sectorId}`);
  }

  async getByLocation(locationId: number): Promise<Company[]> {
    return apiClient.get<Company[]>(`${this.endpoint}/by-location/${locationId}`);
  }

  // ================= Financial Data =================
  
  async getFinancialData(companyId: number): Promise<FinancialData[]> {
    return apiClient.get<FinancialData[]>(`${this.endpoint}/${companyId}/financial-data`);
  }

  async addFinancialData(companyId: number, data: Omit<FinancialData, 'id' | 'companyId'>): Promise<FinancialData> {
    return apiClient.post<FinancialData>(`${this.endpoint}/${companyId}/financial-data`, data);
  }

  async updateFinancialData(companyId: number, dataId: number, data: Partial<FinancialData>): Promise<FinancialData> {
    return apiClient.put<FinancialData>(`${this.endpoint}/${companyId}/financial-data/${dataId}`, data);
  }

  // ================= Sectors =================
  
  async getCompanySectors(companyId: number): Promise<Sector[]> {
    return apiClient.get<Sector[]>(`${this.endpoint}/${companyId}/sectors`);
  }

  async addSectorToCompany(companyId: number, sectorId: number): Promise<CompanySector> {
    return apiClient.post<CompanySector>(`${this.endpoint}/${companyId}/sectors`, { sectorId });
  }

  async removeSectorFromCompany(companyId: number, sectorId: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${companyId}/sectors/${sectorId}`);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalCompanies: number;
    totalClients: number;
    totalProspects: number;
    averageScore: number;
    topSectors: { name: string; count: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  async getScoreDistribution(): Promise<{ range: string; count: number }[]> {
    return apiClient.get<any>(`${this.endpoint}/score-distribution`);
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit une Company backend en Entity frontend
   */
  static toEntity(company: Company, location?: Location): Entity {
    return {
      id: company.id?.toString() || '',
      companyName: company.companyName,
      nif: company.ifu,
      sector: '', // À mapper avec les secteurs
      region: location?.city || '',
      parentOrganization: undefined, // À mapper si nécessaire
      revenue: undefined, // À récupérer depuis FinancialData
      employees: undefined, // À récupérer depuis FinancialData
      status: company.isProspect ? 'prospect' : 'client',
      priority: 'medium', // À calculer selon la logique métier
      score: company.score,
      address: {
        street: location?.address || '',
        city: location?.city || '',
        postalCode: company.postalBox || '',
        country: location?.country || '',
      },
      legalInfo: {
        legalForm: company.legalForm,
        registrationNumber: company.rccm,
        vatNumber: company.ifu,
        documents: [],
      },
      createdAt: company.birthDate || new Date(),
      updatedAt: new Date(),
      email: company.email,
      phoneNumber: company.phoneNumber,
      whatsappNumber: company.whatsappNumber,
      imagePath: company.imagePath,
      postalBox: company.postalBox,
      description: company.description,
      companyType: company.companyType,
      parentId: company.parentId,
      locationId: company.locationId,
      website: company.website,
    };
  }

  /**
   * Convertit une Entity frontend en Company backend
   */
  static toCompany(entity: EntityFormData, locationId: number): Omit<Company, 'id'> {
    return {
      companyName: entity.companyName,
      email: '', // À remplir depuis le formulaire
      phoneNumber: '', // À remplir depuis le formulaire
      whatsappNumber: '', // À remplir depuis le formulaire
      birthDate: new Date(),
      imagePath: '',
      score: 0, // Sera calculé côté backend
      postalBox: entity.address.postalCode,
      ifu: entity.nif || '',
      rccm: entity.legalInfo.registrationNumber || '',
      legalForm: entity.legalInfo.legalForm as any,
      isProspect: entity.status === 'prospect',
      description: '',
      companyType: 'AGENCY' as any, // Valeur par défaut
      parentId: undefined,
      locationId,
      website: '',
    };
  }
}

export const companiesService = new CompaniesService();