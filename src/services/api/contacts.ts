// Service API pour la gestion des contacts
import { apiClient } from './base';
import { Contact as BackendContact, Experience, Contribution } from '../../types/models';
import { Contact, ContactFormData, PaginatedResponse, SearchParams, PaginationParams } from '../../types/frontend';

export class ContactsService {
  private readonly endpoint = '/contacts';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<BackendContact>> {
    return apiClient.get<PaginatedResponse<BackendContact>>(this.endpoint, params);
  }

  async getById(id: number): Promise<BackendContact> {
    return apiClient.get<BackendContact>(`${this.endpoint}/${id}`);
  }

  async create(contact: Omit<BackendContact, 'id'>): Promise<BackendContact> {
    return apiClient.post<BackendContact>(this.endpoint, contact);
  }

  async update(id: number, contact: Partial<BackendContact>): Promise<BackendContact> {
    return apiClient.put<BackendContact>(`${this.endpoint}/${id}`, contact);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<BackendContact[]> {
    return apiClient.get<BackendContact[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByCompany(companyId: number): Promise<BackendContact[]> {
    return apiClient.get<BackendContact[]>(`${this.endpoint}/by-company/${companyId}`);
  }

  async getByEmail(email: string): Promise<BackendContact | null> {
    try {
      return await apiClient.get<BackendContact>(`${this.endpoint}/by-email`, { email });
    } catch (error) {
      return null;
    }
  }

  // ================= Experiences =================
  
  async getExperiences(contactId: number): Promise<Experience[]> {
    return apiClient.get<Experience[]>(`${this.endpoint}/${contactId}/experiences`);
  }

  async addExperience(contactId: number, experience: Omit<Experience, 'id' | 'contactId'>): Promise<Experience> {
    return apiClient.post<Experience>(`${this.endpoint}/${contactId}/experiences`, experience);
  }

  async updateExperience(contactId: number, experienceId: number, experience: Partial<Experience>): Promise<Experience> {
    return apiClient.put<Experience>(`${this.endpoint}/${contactId}/experiences/${experienceId}`, experience);
  }

  async deleteExperience(contactId: number, experienceId: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${contactId}/experiences/${experienceId}`);
  }

  // ================= Contributions =================
  
  async getContributions(contactId: number): Promise<Contribution[]> {
    return apiClient.get<Contribution[]>(`${this.endpoint}/${contactId}/contributions`);
  }

  async addContribution(contactId: number, contribution: Omit<Contribution, 'id' | 'contactId'>): Promise<Contribution> {
    return apiClient.post<Contribution>(`${this.endpoint}/${contactId}/contributions`, contribution);
  }

  async updateContribution(contactId: number, contributionId: number, contribution: Partial<Contribution>): Promise<Contribution> {
    return apiClient.put<Contribution>(`${this.endpoint}/${contactId}/contributions/${contributionId}`, contribution);
  }

  async deleteContribution(contactId: number, contributionId: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${contactId}/contributions/${contributionId}`);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalContacts: number;
    contactsWithExperience: number;
    averageScore: number;
    topCompanies: { name: string; contactCount: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  // ================= Import/Export =================
  
  async importContacts(file: File): Promise<{ imported: number; errors: string[] }> {
    return apiClient.upload<any>(`${this.endpoint}/import`, file);
  }

  async exportContacts(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${apiClient['config'].baseURL}${this.endpoint}/export`, {
      method: 'GET',
      headers: {
        ...apiClient['getHeaders'](),
        'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }

    return response.blob();
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit un Contact backend en Contact frontend
   */
  static toFrontendContact(backendContact: BackendContact, companyId?: number): Contact {
    return {
      id: backendContact.id?.toString() || '',
      entityId: companyId?.toString() || '',
      name: `${backendContact.firstName} ${backendContact.lastName}`,
      role: '', // À mapper depuis Experience
      email: backendContact.email,
      phone: backendContact.phoneNumber || '',
      whatsapp: backendContact.whatsappNumber,
      isPrimary: false, // À déterminer selon la logique métier
      createdAt: backendContact.birthDate || new Date(),
    };
  }

  /**
   * Convertit un Contact frontend en Contact backend
   */
  static toBackendContact(frontendContact: ContactFormData): Omit<BackendContact, 'id'> {
    const [firstName, ...lastNameParts] = frontendContact.name.split(' ');
    const lastName = lastNameParts.join(' ');

    return {
      firstName: firstName || '',
      lastName: lastName || '',
      email: frontendContact.email,
      phoneNumber: frontendContact.phone,
      whatsappNumber: frontendContact.whatsapp,
      birthDate: new Date(),
      imagePath: '',
      score: 0, // Sera calculé côté backend
      postalBox: '',
      collaboratorId: undefined,
    };
  }
}

export const contactsService = new ContactsService();