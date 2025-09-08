import { 
  Opportunity, 
  Proposition, 
  Need, 
  Source,
  OpportunityStatus,
  PropositionStatus,
  PropositionType,
  SourceType
} from '../types';

export class OpportunitiesService {
  private opportunities: Opportunity[] = [];
  private propositions: Proposition[] = [];
  private needs: Need[] = [];
  private sources: Source[] = [];

  // ================= CRUD Operations =================
  
  async getAll(): Promise<Opportunity[]> {
    return Promise.resolve([...this.opportunities]);
  }

  async getById(id: number): Promise<Opportunity | null> {
    const opportunity = this.opportunities.find(o => o.id === id);
    return Promise.resolve(opportunity || null);
  }

  async create(opportunity: Omit<Opportunity, 'id'>): Promise<Opportunity> {
    const id = Math.max(...this.opportunities.map(o => o.id || 0), 0) + 1;
    const newOpportunity: Opportunity = { ...opportunity, id };
    this.opportunities.push(newOpportunity);
    return Promise.resolve(newOpportunity);
  }

  async update(id: number, updates: Partial<Opportunity>): Promise<Opportunity | null> {
    const index = this.opportunities.findIndex(o => o.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.opportunities[index] = { ...this.opportunities[index], ...updates };
    return Promise.resolve(this.opportunities[index]);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.opportunities.findIndex(o => o.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.opportunities.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Status Management =================
  
  async updateStatus(id: number, status: OpportunityStatus): Promise<Opportunity | null> {
    return this.update(id, { status });
  }

  async closeOpportunity(id: number, won: boolean): Promise<Opportunity | null> {
    const status = won ? OpportunityStatus.TACKED_AND_CLOSED : OpportunityStatus.CLOSED_NOT_TACKED;
    return this.update(id, { status });
  }

  // ================= Propositions =================
  
  async getPropositions(opportunityId: number): Promise<Proposition[]> {
    const results = this.propositions.filter(prop => prop.opportunityId === opportunityId);
    return Promise.resolve(results);
  }

  async createProposition(proposition: Omit<Proposition, 'id'>): Promise<Proposition> {
    const id = Math.max(...this.propositions.map(p => p.id || 0), 0) + 1;
    const newProposition: Proposition = { ...proposition, id };
    this.propositions.push(newProposition);
    return Promise.resolve(newProposition);
  }

  async updateProposition(id: number, updates: Partial<Proposition>): Promise<Proposition | null> {
    const index = this.propositions.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.propositions[index] = { ...this.propositions[index], ...updates };
    return Promise.resolve(this.propositions[index]);
  }

  async submitProposition(id: number): Promise<Proposition | null> {
    return this.updateProposition(id, { 
      status: PropositionStatus.SUBMITTED,
      submissionDate: new Date()
    });
  }

  // ================= Needs =================
  
  async getNeeds(): Promise<Need[]> {
    return Promise.resolve([...this.needs]);
  }

  async createNeed(need: Omit<Need, 'id'>): Promise<Need> {
    const id = Math.max(...this.needs.map(n => n.id || 0), 0) + 1;
    const newNeed: Need = { ...need, id };
    this.needs.push(newNeed);
    return Promise.resolve(newNeed);
  }

  // ================= Sources =================
  
  async getSources(): Promise<Source[]> {
    return Promise.resolve([...this.sources]);
  }

  async createSource(source: Omit<Source, 'id'>): Promise<Source> {
    const id = Math.max(...this.sources.map(s => s.id || 0), 0) + 1;
    const newSource: Source = { ...source, id };
    this.sources.push(newSource);
    return Promise.resolve(newSource);
  }

  // ================= Search and Filters =================
  
  async search(query: string): Promise<Opportunity[]> {
    const searchTerm = query.toLowerCase();
    const results = this.opportunities.filter(opportunity =>
      opportunity.name.toLowerCase().includes(searchTerm) ||
      opportunity.description.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(results);
  }

  async getByStatus(status: OpportunityStatus): Promise<Opportunity[]> {
    const results = this.opportunities.filter(opportunity => opportunity.status === status);
    return Promise.resolve(results);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalOpportunities: number;
    activeOpportunities: number;
    wonOpportunities: number;
    lostOpportunities: number;
    conversionRate: number;
  }> {
    const totalOpportunities = this.opportunities.length;
    const activeOpportunities = this.opportunities.filter(o => o.status === OpportunityStatus.OPEN).length;
    const wonOpportunities = this.opportunities.filter(o => o.status === OpportunityStatus.TACKED_AND_CLOSED).length;
    const lostOpportunities = this.opportunities.filter(o => o.status === OpportunityStatus.CLOSED_NOT_TACKED).length;
    const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    return Promise.resolve({
      totalOpportunities,
      activeOpportunities,
      wonOpportunities,
      lostOpportunities,
      conversionRate: Math.round(conversionRate)
    });
  }
}

export const opportunitiesService = new OpportunitiesService();