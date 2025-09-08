import { Company, Location, Sector, FinancialData, CompanySector, LegalForm, CompanyType } from '../types';

export class CompaniesService {
  private companies: Company[] = [];
  private locations: Location[] = [];
  private sectors: Sector[] = [];
  private financialData: FinancialData[] = [];

  // ================= CRUD Operations =================
  
  async getAll(): Promise<Company[]> {
    return Promise.resolve([...this.companies]);
  }

  async getById(id: number): Promise<Company | null> {
    const company = this.companies.find(c => c.id === id);
    return Promise.resolve(company || null);
  }

  async create(company: Omit<Company, 'id'>): Promise<Company> {
    const id = Math.max(...this.companies.map(c => c.id || 0), 0) + 1;
    const newCompany: Company = { ...company, id };
    this.companies.push(newCompany);
    return Promise.resolve(newCompany);
  }

  async update(id: number, updates: Partial<Company>): Promise<Company | null> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.companies[index] = { ...this.companies[index], ...updates };
    return Promise.resolve(this.companies[index]);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.companies.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Search and Filters =================
  
  async search(query: string): Promise<Company[]> {
    const searchTerm = query.toLowerCase();
    const results = this.companies.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm) ||
      company.email.toLowerCase().includes(searchTerm) ||
      company.description?.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(results);
  }

  async getByStatus(isProspect: boolean): Promise<Company[]> {
    const results = this.companies.filter(company => company.isProspect === isProspect);
    return Promise.resolve(results);
  }

  async getByLocation(locationId: number): Promise<Company[]> {
    const results = this.companies.filter(company => company.locationId === locationId);
    return Promise.resolve(results);
  }

  // ================= Financial Data =================
  
  async getFinancialData(companyId: number): Promise<FinancialData[]> {
    const results = this.financialData.filter(fd => fd.companyId === companyId);
    return Promise.resolve(results);
  }

  async addFinancialData(data: Omit<FinancialData, 'id'>): Promise<FinancialData> {
    const id = Math.max(...this.financialData.map(fd => fd.id || 0), 0) + 1;
    const newData: FinancialData = { ...data, id };
    this.financialData.push(newData);
    return Promise.resolve(newData);
  }

  // ================= Locations =================
  
  async getLocations(): Promise<Location[]> {
    return Promise.resolve([...this.locations]);
  }

  async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
    const id = Math.max(...this.locations.map(l => l.id || 0), 0) + 1;
    const newLocation: Location = { ...location, id };
    this.locations.push(newLocation);
    return Promise.resolve(newLocation);
  }

  // ================= Sectors =================
  
  async getSectors(): Promise<Sector[]> {
    return Promise.resolve([...this.sectors]);
  }

  async createSector(sector: Omit<Sector, 'id'>): Promise<Sector> {
    const id = Math.max(...this.sectors.map(s => s.id || 0), 0) + 1;
    const newSector: Sector = { ...sector, id };
    this.sectors.push(newSector);
    return Promise.resolve(newSector);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalCompanies: number;
    totalClients: number;
    totalProspects: number;
    averageScore: number;
  }> {
    const totalCompanies = this.companies.length;
    const totalClients = this.companies.filter(c => !c.isProspect).length;
    const totalProspects = this.companies.filter(c => c.isProspect).length;
    const averageScore = this.companies.reduce((sum, c) => sum + c.score, 0) / totalCompanies || 0;

    return Promise.resolve({
      totalCompanies,
      totalClients,
      totalProspects,
      averageScore: Math.round(averageScore)
    });
  }
}

export const companiesService = new CompaniesService();