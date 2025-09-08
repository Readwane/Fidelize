// Service API pour la gestion des collaborateurs
import { apiClient } from './base';
import { 
  Collaborator, 
  Agent, 
  Department, 
  Role, 
  Team, 
  Connection,
  AgentType,
  Grade 
} from '../../types/models';
import { 
  User, 
  PaginatedResponse, 
  SearchParams, 
  PaginationParams 
} from '../../types/frontend';

export class CollaboratorsService {
  private readonly endpoint = '/collaborators';

  // ================= CRUD Operations =================
  
  async getAll(params?: PaginationParams & SearchParams): Promise<PaginatedResponse<Collaborator>> {
    return apiClient.get<PaginatedResponse<Collaborator>>(this.endpoint, params);
  }

  async getById(id: number): Promise<Collaborator> {
    return apiClient.get<Collaborator>(`${this.endpoint}/${id}`);
  }

  async create(collaborator: Omit<Collaborator, 'id'>): Promise<Collaborator> {
    return apiClient.post<Collaborator>(this.endpoint, collaborator);
  }

  async update(id: number, collaborator: Partial<Collaborator>): Promise<Collaborator> {
    return apiClient.put<Collaborator>(`${this.endpoint}/${id}`, collaborator);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // ================= Authentication =================
  
  async getCurrentUser(): Promise<Collaborator> {
    return apiClient.get<Collaborator>(`${this.endpoint}/me`);
  }

  async updateProfile(data: Partial<Collaborator>): Promise<Collaborator> {
    return apiClient.put<Collaborator>(`${this.endpoint}/me`, data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // ================= Departments =================
  
  async getDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>('/departments');
  }

  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    return apiClient.post<Department>('/departments', department);
  }

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department> {
    return apiClient.put<Department>(`/departments/${id}`, department);
  }

  async getByDepartment(departmentId: number): Promise<Collaborator[]> {
    return apiClient.get<Collaborator[]>(`${this.endpoint}/by-department/${departmentId}`);
  }

  // ================= Roles =================
  
  async getRoles(): Promise<Role[]> {
    return apiClient.get<Role[]>('/roles');
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    return apiClient.post<Role>('/roles', role);
  }

  async assignRole(collaboratorId: number, roleId: number): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/${collaboratorId}/roles`, { roleId });
  }

  async removeRole(collaboratorId: number, roleId: number): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${collaboratorId}/roles/${roleId}`);
  }

  // ================= Teams =================
  
  async getTeams(): Promise<Team[]> {
    return apiClient.get<Team[]>('/teams');
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    return apiClient.post<Team>('/teams', team);
  }

  async getTeamMembers(teamId: number): Promise<Agent[]> {
    return apiClient.get<Agent[]>(`/teams/${teamId}/members`);
  }

  async addTeamMember(teamId: number, agent: Omit<Agent, 'id' | 'teamId'>): Promise<Agent> {
    return apiClient.post<Agent>(`/teams/${teamId}/members`, agent);
  }

  async removeTeamMember(teamId: number, agentId: number): Promise<void> {
    return apiClient.delete<void>(`/teams/${teamId}/members/${agentId}`);
  }

  // ================= Connections =================
  
  async getActiveConnections(collaboratorId: number): Promise<Connection[]> {
    return apiClient.get<Connection[]>(`${this.endpoint}/${collaboratorId}/connections`);
  }

  async terminateConnection(connectionId: number): Promise<void> {
    return apiClient.post<void>(`/connections/${connectionId}/terminate`, {});
  }

  // ================= Search and Filters =================
  
  async search(query: string, filters?: Record<string, any>): Promise<Collaborator[]> {
    return apiClient.get<Collaborator[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  async getByRole(roleId: number): Promise<Collaborator[]> {
    return apiClient.get<Collaborator[]>(`${this.endpoint}/by-role/${roleId}`);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalCollaborators: number;
    activeCollaborators: number;
    departmentDistribution: { name: string; count: number }[];
    averageScore: number;
    topPerformers: { name: string; score: number }[];
  }> {
    return apiClient.get<any>(`${this.endpoint}/statistics`);
  }

  // ================= Conversion Methods =================
  
  /**
   * Convertit un Collaborator backend en User frontend
   */
  static toFrontendUser(collaborator: Collaborator): User {
    return {
      id: collaborator.id?.toString() || '',
      firstName: collaborator.firstName,
      lastName: collaborator.lastName,
      email: collaborator.email,
      role: 'consultant', // À mapper selon le département/rôle
      permissions: [], // À récupérer depuis les rôles
      isActive: true,
      lastLogin: undefined,
      createdAt: collaborator.birthDate || new Date(),
    };
  }

  /**
   * Convertit un User frontend en Collaborator backend
   */
  static toBackendCollaborator(user: User, departmentId: number): Omit<Collaborator, 'id'> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: '',
      whatsappNumber: '',
      birthDate: new Date(),
      imagePath: '',
      score: 0,
      postalBox: '',
      username: user.email,
      password: '', // À gérer séparément
      departmentId,
    };
  }
}

export const collaboratorsService = new CollaboratorsService();