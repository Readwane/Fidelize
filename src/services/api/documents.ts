// Service API pour la gestion des documents
import { apiClient } from './base';
import { 
  Document as BackendDocument, 
  DocumentType, 
  Template, 
  Invoice, 
  Analysis,
  AnalysisStatus,
  InvoiceStatus 
} from '../../types/models';
import { 
  Document, 
  PaginatedResponse, 
  SearchParams, 
  PaginationParams 
} from '../../types/frontend';

export class DocumentsService {
  private readonly endpoint = '/documents';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<BackendDocument>> {
    return apiClient.get<PaginatedResponse<BackendDocument>>(this.endpoint, params);
  }

  async getById(id: number): Promise<BackendDocument> {
    return apiClient.get<BackendDocument>(`${this.endpoint}/${id}`);
  }

  async upload(file: File, metadata: {
    typeId: number;
    purposeId: number;
    purposeType: string;
    ownerId: number;
  }): Promise<BackendDocument> {
    return apiClient.upload<BackendDocument>(`${this.endpoint}/upload`, file, metadata);
  }

  async update(id: number, document: Partial<BackendDocument>): Promise<BackendDocument> {
    return apiClient.put<BackendDocument>(`${this.endpoint}/${id}`, document);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Download =================
  
  async download(id: number): Promise<Blob> {
    const response = await fetch(`${apiClient['config'].baseURL}${this.endpoint}/${id}/download`, {
      method: 'GET',
      headers: apiClient['getHeaders'](),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement');
    }

    return response.blob();
  }

  async getDownloadUrl(id: number): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`${this.endpoint}/${id}/download-url`);
    return response.url;
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<BackendDocument[]> {
    return apiClient.get<BackendDocument[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByOwner(ownerId: number): Promise<BackendDocument[]> {
    return apiClient.get<BackendDocument[]>(`${this.endpoint}/by-owner/${ownerId}`);
  }

  async getByType(typeId: number): Promise<BackendDocument[]> {
    return apiClient.get<BackendDocument[]>(`${this.endpoint}/by-type/${typeId}`);
  }

  async getByPurpose(purposeId: number, purposeType: string): Promise<BackendDocument[]> {
    return apiClient.get<BackendDocument[]>(`${this.endpoint}/by-purpose`, { purposeId, purposeType });
  }

  // ================= Document Types =================
  
  async getDocumentTypes(): Promise<DocumentType[]> {
    return apiClient.get<DocumentType[]>('/document-types');
  }

  async createDocumentType(type: Omit<DocumentType, 'id'>): Promise<DocumentType> {
    return apiClient.post<DocumentType>('/document-types', type);
  }

  // ================= Templates =================
  
  async getTemplates(): Promise<Template[]> {
    return apiClient.get<Template[]>('/templates');
  }

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    return apiClient.post<Template>('/templates', template);
  }

  async updateTemplate(id: number, template: Partial<Template>): Promise<Template> {
    return apiClient.put<Template>(`/templates/${id}`, template);
  }

  async deleteTemplate(id: number): Promise<void> {
    return apiClient.delete<void>(`/templates/${id}`);
  }

  async generateFromTemplate(templateId: number, data: Record<string, any>): Promise<BackendDocument> {
    return apiClient.post<BackendDocument>(`/templates/${templateId}/generate`, data);
  }

  // ================= Analysis =================
  
  async analyzeDocument(documentId: number): Promise<Analysis> {
    return apiClient.post<Analysis>(`${this.endpoint}/${documentId}/analyze`, {});
  }

  async getAnalysis(documentId: number): Promise<Analysis[]> {
    return apiClient.get<Analysis[]>(`${this.endpoint}/${documentId}/analysis`);
  }

  async updateAnalysis(documentId: number, analysisId: number, analysis: Partial<Analysis>): Promise<Analysis> {
    return apiClient.put<Analysis>(`${this.endpoint}/${documentId}/analysis/${analysisId}`, analysis);
  }

  // ================= Invoices =================
  
  async getInvoices(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<Invoice>> {
    return apiClient.get<PaginatedResponse<Invoice>>('/invoices', params);
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    return apiClient.post<Invoice>('/invoices', invoice);
  }

  async updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<Invoice> {
    return apiClient.patch<Invoice>(`/invoices/${id}/status`, { status });
  }

  async getInvoicesByMission(missionId: number): Promise<Invoice[]> {
    return apiClient.get<Invoice[]>(`/invoices/by-mission/${missionId}`);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalDocuments: number;
    documentsThisMonth: number;
    analysisCompleted: number;
    templatesUsed: number;
    storageUsed: number;
    documentsByType: { type: string; count: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit un Document backend en Document frontend
   */
  static toFrontendDocument(backendDocument: BackendDocument): Document {
    return {
      id: backendDocument.id?.toString() || '',
      name: backendDocument.name,
      type: backendDocument.contentType,
      size: backendDocument.size,
      url: backendDocument.filePath,
      version: 1, // À gérer côté backend
      entityId: backendDocument.ownerId.toString(),
      uploadedBy: '', // À mapper depuis l'utilisateur
      uploadedAt: new Date(),
      tags: [],
    };
  }

  /**
   * Convertit un Document frontend en Document backend
   */
  static toBackendDocument(frontendDocument: Document, typeId: number, purposeId: number, purposeType: string): Omit<BackendDocument, 'id'> {
    return {
      name: frontendDocument.name,
      size: frontendDocument.size,
      contentType: frontendDocument.type,
      filePath: frontendDocument.url,
      isAnalysable: true,
      typeId,
      purposeId,
      purposeType: purposeType as any,
      ownerId: parseInt(frontendDocument.entityId || '0'),
    };
  }
}

export const documentsService = new DocumentsService();