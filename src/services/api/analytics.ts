// Service API pour les analytics et rapports
import { apiClient } from './base';
import { KPI, Alert } from '../../types/models';
import { AnalyticsData } from '../../types/frontend';

export class AnalyticsService {
  private readonly endpoint = '/analytics';

  // ================= Dashboard KPIs =================
  
  async getDashboardKPIs(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<KPI[]> {
    return apiClient.get<KPI[]>(`${this.endpoint}/kpis`, { period });
  }

  async getKPIHistory(kpiId: string, period: string, limit: number = 30): Promise<{
    date: string;
    value: number;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/kpis/${kpiId}/history`, { period, limit });
  }

  // ================= Revenue Analytics =================
  
  async getRevenueAnalytics(period: string): Promise<{
    totalRevenue: number;
    revenueGrowth: number;
    revenueByMonth: { month: string; revenue: number }[];
    revenueByService: { service: string; revenue: number }[];
    revenueByClient: { client: string; revenue: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/revenue`, { period });
  }

  async getRevenueForecast(months: number = 6): Promise<{
    month: string;
    predicted: number;
    confidence: number;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/revenue/forecast`, { months });
  }

  // ================= Sales Analytics =================
  
  async getSalesAnalytics(period: string): Promise<{
    totalDeals: number;
    wonDeals: number;
    lostDeals: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycle: number;
    dealsByStage: { stage: string; count: number; value: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/sales`, { period });
  }

  async getSalesPerformance(period: string): Promise<{
    collaboratorId: number;
    name: string;
    dealsWon: number;
    totalRevenue: number;
    conversionRate: number;
    averageDealSize: number;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/sales/performance`, { period });
  }

  // ================= Client Analytics =================
  
  async getClientAnalytics(period: string): Promise<{
    totalClients: number;
    newClients: number;
    clientRetention: number;
    clientSatisfaction: number;
    clientsBySegment: { segment: string; count: number }[];
    clientGrowth: { month: string; newClients: number; churnedClients: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/clients`, { period });
  }

  async getClientLifetimeValue(): Promise<{
    averageLTV: number;
    ltvBySegment: { segment: string; ltv: number }[];
    ltvDistribution: { range: string; count: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/clients/lifetime-value`);
  }

  // ================= Activity Analytics =================
  
  async getActivityAnalytics(period: string): Promise<{
    totalActivities: number;
    activitiesByType: { type: string; count: number }[];
    activitiesByOutcome: { outcome: string; count: number }[];
    averageResponseTime: number;
    activityTrends: { date: string; count: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/activities`, { period });
  }

  // ================= Mission Analytics =================
  
  async getMissionAnalytics(period: string): Promise<{
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    averageDuration: number;
    profitabilityRate: number;
    missionsByType: { type: string; count: number }[];
    profitabilityTrends: { month: string; profitability: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/missions`, { period });
  }

  // ================= Custom Reports =================
  
  async generateCustomReport(config: {
    metrics: string[];
    filters: Record<string, any>;
    groupBy?: string;
    period: string;
  }): Promise<{
    data: Record<string, any>[];
    summary: Record<string, number>;
    charts: {
      type: string;
      data: any[];
      config: Record<string, any>;
    }[];
  }> {
    return apiClient.post<any>(`${this.endpoint}/custom-report`, config);
  }

  async getReportTemplates(): Promise<{
    id: string;
    name: string;
    description: string;
    config: Record<string, any>;
  }[]> {
    return apiClient.get<any>(`${this.endpoint}/report-templates`);
  }

  async saveReportTemplate(template: {
    name: string;
    description: string;
    config: Record<string, any>;
  }): Promise<{ id: string }> {
    return apiClient.post<any>(`${this.endpoint}/report-templates`, template);
  }

  // ================= Export =================
  
  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await fetch(`${apiClient['config'].baseURL}${this.endpoint}/reports/${reportId}/export`, {
      method: 'GET',
      headers: {
        ...apiClient['getHeaders'](),
        'Accept': format === 'pdf' ? 'application/pdf' : 
                 format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                 'text/csv',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }

    return response.blob();
  }

  // ================= Alerts =================
  
  async getAlerts(): Promise<Alert[]> {
    return apiClient.get<Alert[]>(`${this.endpoint}/alerts`);
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    return apiClient.patch<void>(`${this.endpoint}/alerts/${alertId}/read`, {});
  }

  async dismissAlert(alertId: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/alerts/${alertId}`);
  }

  // ================= Real-time Updates =================
  
  async subscribeToUpdates(callback: (data: any) => void): Promise<() => void> {
    // Implémentation WebSocket ou Server-Sent Events
    const eventSource = new EventSource(`${apiClient['config'].baseURL}${this.endpoint}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Erreur lors du parsing des données temps réel:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erreur de connexion temps réel:', error);
    };

    // Retourner une fonction de nettoyage
    return () => {
      eventSource.close();
    };
  }
}

export const analyticsService = new AnalyticsService();