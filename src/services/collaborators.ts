import { 
  Collaborator, 
  Agent, 
  Department, 
  Role, 
  Team, 
  Connection,
  AgentType,
  Grade,
  PurposeType
} from '../types';

export class CollaboratorsService {
  private collaborators: Collaborator[] = [];
  private agents: Agent[] = [];
  private departments: Department[] = [];
  private roles: Role[] = [];
  private teams: Team[] = [];
  private connections: Connection[] = [];

  // ================= CRUD Operations =================
  
  async getAll(): Promise<Collaborator[]> {
    return Promise.resolve([...this.collaborators]);
  }

  async getById(id: number): Promise<Collaborator | null> {
    const collaborator = this.collaborators.find(c => c.id === id);
    return Promise.resolve(collaborator || null);
  }

  async create(collaborator: Omit<Collaborator, 'id'>): Promise<Collaborator> {
    const id = Math.max(...this.collaborators.map(c => c.id || 0), 0) + 1;
    const newCollaborator: Collaborator = { ...collaborator, id };
    this.collaborators.push(newCollaborator);
    return Promise.resolve(newCollaborator);
  }

  async update(id: number, updates: Partial<Collaborator>): Promise<Collaborator | null> {
    const index = this.collaborators.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.collaborators[index] = { ...this.collaborators[index], ...updates };
    return Promise.resolve(this.collaborators[index]);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.collaborators.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.collaborators.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Authentication =================
  
  async getCurrentUser(): Promise<Collaborator | null> {
    // Simuler la récupération de l'utilisateur actuel
    return Promise.resolve(this.collaborators[0] || null);
  }

  async updateProfile(id: number, data: Partial<Collaborator>): Promise<Collaborator | null> {
    return this.update(id, data);
  }

  // ================= Departments =================
  
  async getDepartments(): Promise<Department[]> {
    return Promise.resolve([...this.departments]);
  }

  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    const id = Math.max(...this.departments.map(d => d.id || 0), 0) + 1;
    const newDepartment: Department = { ...department, id };
    this.departments.push(newDepartment);
    return Promise.resolve(newDepartment);
  }

  async getByDepartment(departmentId: number): Promise<Collaborator[]> {
    const results = this.collaborators.filter(c => c.departmentId === departmentId);
    return Promise.resolve(results);
  }

  // ================= Teams =================
  
  async getTeams(): Promise<Team[]> {
    return Promise.resolve([...this.teams]);
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    const id = Math.max(...this.teams.map(t => t.id || 0), 0) + 1;
    const newTeam: Team = { ...team, id };
    this.teams.push(newTeam);
    return Promise.resolve(newTeam);
  }

  async getTeamMembers(teamId: number): Promise<Agent[]> {
    const results = this.agents.filter(agent => agent.teamId === teamId);
    return Promise.resolve(results);
  }

  async addTeamMember(agent: Omit<Agent, 'id'>): Promise<Agent> {
    const id = Math.max(...this.agents.map(a => a.id || 0), 0) + 1;
    const newAgent: Agent = { ...agent, id };
    this.agents.push(newAgent);
    return Promise.resolve(newAgent);
  }

  // ================= Connections =================
  
  async getActiveConnections(collaboratorId: number): Promise<Connection[]> {
    const results = this.connections.filter(conn => 
      conn.collaboratorId === collaboratorId && !conn.endTime
    );
    return Promise.resolve(results);
  }

  async createConnection(connection: Omit<Connection, 'id'>): Promise<Connection> {
    const id = Math.max(...this.connections.map(c => c.id || 0), 0) + 1;
    const newConnection: Connection = { ...connection, id };
    this.connections.push(newConnection);
    return Promise.resolve(newConnection);
  }

  // ================= Search and Filters =================
  
  async search(query: string): Promise<Collaborator[]> {
    const searchTerm = query.toLowerCase();
    const results = this.collaborators.filter(collaborator =>
      collaborator.firstName.toLowerCase().includes(searchTerm) ||
      collaborator.lastName.toLowerCase().includes(searchTerm) ||
      collaborator.email.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(results);
  }

  // ================= Utility Methods =================
  
  getFullName(collaborator: Collaborator): string {
    return `${collaborator.firstName} ${collaborator.lastName}`;
  }

  async getCollaboratorsByRole(roleId: number): Promise<Collaborator[]> {
    // TODO: Implémenter avec la table de liaison DepRole
    return Promise.resolve([]);
  }
}

export const collaboratorsService = new CollaboratorsService();