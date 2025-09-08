// Types frontend spécifiques à l'interface utilisateur
// Ces types complètent les modèles backend définis dans index.ts

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface FilterState {
  [key: string]: any;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// ================= UI State Types =================

export interface AppState {
  companies: Company[];
  contacts: Contact[];
  missions: Mission[];
  opportunities: Opportunity[];
  collaborators: Collaborator[];
  currentUser: Collaborator | null;
  selectedCompany: Company | null;
  isLoading: boolean;
  pagination: {
    companies: { page: number; size: number };
    contacts: { page: number; size: number };
    missions: { page: number; size: number };
    opportunities: { page: number; size: number };
  };
  filters: {
    companies: FilterState;
    contacts: FilterState;
    missions: FilterState;
    opportunities: FilterState;
  };
}

export interface StoreActions {
  // UI Actions
  setCurrentUser: (user: Collaborator | null) => void;
  setSelectedCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;

  // Company Actions
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: number, updates: Partial<Company>) => void;
  deleteCompany: (id: number) => void;

  // Contact Actions
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: number, updates: Partial<Contact>) => void;
  deleteContact: (id: number) => void;

  // Mission Actions
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (id: number, updates: Partial<Mission>) => void;
  deleteMission: (id: number) => void;

  // Opportunity Actions
  addOpportunity: (opportunity: Omit<Opportunity, 'id'>) => void;
  updateOpportunity: (id: number, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: number) => void;

  // Utility Functions
  getCompaniesByStatus: (isProspect: boolean) => Company[];
  getContactsByCompany: (companyId: number) => Contact[];
  getMissionsByCompany: (companyId: number) => Mission[];
  getOpportunitiesByCompany: (companyId: number) => Opportunity[];
}

// Re-export types from index.ts for convenience
export type {
  Company,
  Contact,
  Mission,
  Opportunity,
  Collaborator,
  Document,
  CompanyType,
  LegalForm,
  MissionStatus,
  OpportunityStatus,
  PropositionStatus,
  PropositionType,
  PersonType,
  PurposeType,
  ExecStatus,
  ExecutableType
} from './index';