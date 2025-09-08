import { 
  Mission, 
  MissionType, 
  Service, 
  Evaluation,
  MissionStatus,
  Execution,
  ExecStatus,
  PurposeType
} from '../types';

export class MissionsService {
  private missions: Mission[] = [];
  private missionTypes: MissionType[] = [];
  private services: Service[] = [];
  private evaluations: Evaluation[] = [];
  private executions: Execution[] = [];

  // ================= CRUD Operations =================
  
  async getAll(): Promise<Mission[]> {
    return Promise.resolve([...this.missions]);
  }

  async getById(id: number): Promise<Mission | null> {
    const mission = this.missions.find(m => m.id === id);
    return Promise.resolve(mission || null);
  }

  async create(mission: Omit<Mission, 'id'>): Promise<Mission> {
    const id = Math.max(...this.missions.map(m => m.id || 0), 0) + 1;
    const newMission: Mission = { ...mission, id };
    this.missions.push(newMission);
    return Promise.resolve(newMission);
  }

  async update(id: number, updates: Partial<Mission>): Promise<Mission | null> {
    const index = this.missions.findIndex(m => m.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.missions[index] = { ...this.missions[index], ...updates };
    return Promise.resolve(this.missions[index]);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.missions.findIndex(m => m.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.missions.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Status Management =================
  
  async updateStatus(id: number, status: MissionStatus): Promise<Mission | null> {
    return this.update(id, { status });
  }

  async startMission(id: number): Promise<Mission | null> {
    return this.update(id, { 
      status: MissionStatus.IN_PROGRESS,
      startDate: new Date()
    });
  }

  async completeMission(id: number): Promise<Mission | null> {
    return this.update(id, { 
      status: MissionStatus.COMPLETED,
      endDate: new Date()
    });
  }

  async cancelMission(id: number): Promise<Mission | null> {
    return this.update(id, { status: MissionStatus.CANCELLED });
  }

  // ================= Search and Filters =================
  
  async search(query: string): Promise<Mission[]> {
    const searchTerm = query.toLowerCase();
    const results = this.missions.filter(mission =>
      mission.name.toLowerCase().includes(searchTerm) ||
      mission.description?.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(results);
  }

  async getByCompany(companyId: number): Promise<Mission[]> {
    const results = this.missions.filter(mission => mission.companyId === companyId);
    return Promise.resolve(results);
  }

  async getByStatus(status: MissionStatus): Promise<Mission[]> {
    const results = this.missions.filter(mission => mission.status === status);
    return Promise.resolve(results);
  }

  async getByType(typeId: number): Promise<Mission[]> {
    const results = this.missions.filter(mission => mission.typeId === typeId);
    return Promise.resolve(results);
  }

  // ================= Mission Types =================
  
  async getMissionTypes(): Promise<MissionType[]> {
    return Promise.resolve([...this.missionTypes]);
  }

  async createMissionType(type: Omit<MissionType, 'id'>): Promise<MissionType> {
    const id = Math.max(...this.missionTypes.map(mt => mt.id || 0), 0) + 1;
    const newType: MissionType = { ...type, id };
    this.missionTypes.push(newType);
    return Promise.resolve(newType);
  }

  // ================= Services =================
  
  async getServices(): Promise<Service[]> {
    return Promise.resolve([...this.services]);
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const id = Math.max(...this.services.map(s => s.id || 0), 0) + 1;
    const newService: Service = { ...service, id };
    this.services.push(newService);
    return Promise.resolve(newService);
  }

  // ================= Evaluations =================
  
  async getEvaluations(missionId: number): Promise<Evaluation[]> {
    const results = this.evaluations.filter(eval => eval.missionId === missionId);
    return Promise.resolve(results);
  }

  async addEvaluation(evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation> {
    const id = Math.max(...this.evaluations.map(e => e.id || 0), 0) + 1;
    const newEvaluation: Evaluation = { ...evaluation, id };
    this.evaluations.push(newEvaluation);
    return Promise.resolve(newEvaluation);
  }

  // ================= Executions =================
  
  async getExecutions(missionId: number): Promise<Execution[]> {
    const results = this.executions.filter(exec => 
      exec.purposeId === missionId && exec.purposeType === PurposeType.MISSION
    );
    return Promise.resolve(results);
  }

  async createExecution(execution: Omit<Execution, 'id'>): Promise<Execution> {
    const id = Math.max(...this.executions.map(e => e.id || 0), 0) + 1;
    const newExecution: Execution = { ...execution, id };
    this.executions.push(newExecution);
    return Promise.resolve(newExecution);
  }

  async updateExecutionStatus(id: number, status: ExecStatus): Promise<Execution | null> {
    const index = this.executions.findIndex(e => e.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.executions[index] = { 
      ...this.executions[index], 
      status,
      endDate: status === ExecStatus.COMPLETED ? new Date() : this.executions[index].endDate
    };
    return Promise.resolve(this.executions[index]);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    averageDuration: number;
  }> {
    const totalMissions = this.missions.length;
    const activeMissions = this.missions.filter(m => m.status === MissionStatus.IN_PROGRESS).length;
    const completedMissions = this.missions.filter(m => m.status === MissionStatus.COMPLETED).length;
    
    // Calcul de la durée moyenne des missions terminées
    const completedWithDuration = this.missions.filter(m => 
      m.status === MissionStatus.COMPLETED && m.startDate && m.endDate
    );
    const averageDuration = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, m) => {
          const duration = (m.endDate!.getTime() - m.startDate.getTime()) / (1000 * 60 * 60 * 24);
          return sum + duration;
        }, 0) / completedWithDuration.length
      : 0;

    return Promise.resolve({
      totalMissions,
      activeMissions,
      completedMissions,
      averageDuration: Math.round(averageDuration)
    });
  }
}

export const missionsService = new MissionsService();