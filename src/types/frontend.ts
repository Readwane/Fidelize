// Types spécifiques au frontend (UI, formulaires, etc.)
// Ces types complètent les modèles backend pour les besoins de l'interface utilisateur

import { 
  Company, 
  Contact as BackendContact, 
  Mission as BackendMission,
  Opportunity as BackendOpportunity,
  Analysis as BackendAnalysis,
  Document as BackendDocument,
  Interaction as BackendInteraction
} from './models';

//
// ================= UI TYPES =================
//

/** Types pour les composants UI */
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface SearchFilters {
  query?: string;
  entityType?: "client" | "prospect";
  sector?: string;
  region?: string;
  revenueMin?: number;
  revenueMax?: number;
  employeesMin?: number;
  employeesMax?: number;
  priority?: string;
  scoreMin?: number;
  scoreMax?: number;
  lastInteractionFrom?: Date;
  lastInteractionTo?: Date;
}

//
// ================= FRONTEND ENTITIES =================
//

/** Entité frontend (extension du modèle Company backend) */
export interface Entity extends Omit<Company, 'id'> {
  id: string;
  companyName: string;
  nif?: string;
  sector: string;
  region: string;
  parentOrganization?: string;
  revenue?: number;
  employees?: number;
  status: "client" | "prospect";
  priority: "low" | "medium" | "high" | "critical";
  score: number;
  address: Address;
  legalInfo: LegalInfo;
  createdAt: Date;
  updatedAt: Date;
  lastInteraction?: Date;
  contactsCount?: number;
  missionsCount?: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface LegalInfo {
  legalForm: string;
  registrationNumber?: string;
  vatNumber?: string;
  documents: Document[];
}

/** Contact frontend (simplifié pour l'UI) */
export interface Contact {
  id: string;
  entityId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp?: string;
  isPrimary: boolean;
  createdAt: Date;
}

/** Mission frontend */
export interface Mission {
  id: string;
  title: string;
  type: "audit_legal" | "pca" | "formation" | "attestation" | "other";
  entityId: string;
  status: "draft" | "active" | "completed" | "archived" | "cancelled";
  startDate: Date;
  endDate?: Date;
  budget: number;
  actualCost?: number;
  profitability?: number;
  description: string;
  activities: Activity[];
  tasks: Task[];
  documents: Document[];
  timesheets: Timesheet[];
  milestones: Milestone[];
  assignedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  missionId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  assignedTo: string;
  startDate: Date;
  endDate?: Date;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  activityId?: string;
  missionId: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Timesheet {
  id: string;
  missionId: string;
  taskId?: string;
  userId: string;
  date: Date;
  hours: number;
  description: string;
  billable: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  missionId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  deliverables: string[];
  completedAt?: Date;
}

/** Opportunité frontend */
export interface Opportunity {
  id: string;
  title: string;
  entityId: string;
  type: "spontaneous" | "tender" | "referral";
  stage: "prospection" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  value: number;
  probability: number;
  expectedCloseDate: Date;
  description: string;
  competitors?: string[];
  documents: Document[];
  activities: OpportunityActivity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityActivity {
  id: string;
  opportunityId: string;
  type: "call" | "email" | "meeting" | "proposal" | "follow_up";
  description: string;
  date: Date;
  userId: string;
  outcome?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  version: number;
  entityId?: string;
  missionId?: string;
  opportunityId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
}

export interface Interaction {
  id: string;
  type: "call" | "email" | "meeting" | "visit" | "sms" | "whatsapp";
  subject: string;
  description: string;
  date: Date;
  duration?: number;
  entityId?: string;
  contactId?: string;
  userId: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  attachments: string[];
}

export interface NeedsAnalysis {
  id: string;
  entityId: string;
  analysisDate: Date;
  sourceDocuments: string[];
  identifiedNeeds: IdentifiedNeed[];
  recommendations: Recommendation[];
  score: number;
  status: "pending" | "reviewed" | "approved" | "implemented";
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface IdentifiedNeed {
  service: "cac" | "audit_internal" | "audit_external" | "pca" | "formation" | "other";
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  estimatedValue?: number;
  timeline?: string;
  confidence: number;
}

export interface Recommendation {
  id: string;
  needId: string;
  serviceType: string;
  description: string;
  estimatedCost: number;
  timeline: string;
  resources: string[];
  status: "draft" | "sent" | "accepted" | "rejected";
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "super_admin" | "director" | "mission_manager" | "consultant" | "commercial" | "support" | "readonly";
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Permission {
  module: string;
  actions: ("create" | "read" | "update" | "delete")[];
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  trend: "up" | "down" | "stable";
  lastUpdated: Date;
}

export interface Alert {
  id: string;
  type: "mission_overdue" | "opportunity_stagnant" | "budget_exceeded" | "contract_expiring";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  entityId?: string;
  missionId?: string;
  opportunityId?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp";
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationSequence {
  id: string;
  name: string;
  trigger: "mission_completed" | "opportunity_lost" | "manual" | "scheduled";
  steps: CommunicationStep[];
  isActive: boolean;
}

export interface CommunicationStep {
  id: string;
  sequenceId: string;
  order: number;
  delay: number; // en jours
  templateId: string;
  conditions?: string[];
}

export interface DashboardConfig {
  userId: string;
  widgets: DashboardWidget[];
  layout: "grid" | "list";
  refreshInterval: number;
}

export interface DashboardWidget {
  id: string;
  type: "kpi" | "chart" | "table" | "alert";
  title: string;
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

//
// ================= FORM TYPES =================
//

/** Types pour les formulaires */
export interface EntityFormData {
  companyName: string;
  nif?: string;
  sector: string;
  region: string;
  parentOrganization?: string;
  status: "client" | "prospect";
  priority: "low" | "medium" | "high" | "critical";
  revenue?: number;
  employees?: number;
  address: Address;
  legalInfo: Omit<LegalInfo, 'documents'>;
}

export interface ContactFormData {
  entityId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp?: string;
  isPrimary: boolean;
}

export interface MissionFormData {
  title: string;
  type: "audit_legal" | "pca" | "formation" | "attestation" | "other";
  entityId: string;
  status: "draft" | "active" | "completed" | "archived" | "cancelled";
  startDate: Date;
  endDate?: Date;
  budget: number;
  description: string;
  assignedUsers: string[];
}

export interface OpportunityFormData {
  entityId: string;
  title: string;
  description: string;
  type: "spontaneous" | "tender" | "referral";
  value: number;
  probability: number;
  expectedCloseDate: Date;
}

export interface InteractionFormData {
  type: "call" | "email" | "meeting" | "visit" | "sms" | "whatsapp";
  subject: string;
  description: string;
  entityId?: string;
  contactId?: string;
  duration?: number;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

//
// ================= API RESPONSE TYPES =================
//

/** Réponse API générique */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/** Réponse paginée */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Paramètres de pagination */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/** Paramètres de recherche */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

//
// ================= STORE TYPES =================
//

/** État global de l'application */
export interface AppState {
  // Données
  entities: Entity[];
  contacts: Contact[];
  missions: Mission[];
  opportunities: Opportunity[];
  interactions: Interaction[];
  
  // UI State
  currentUser: User | null;
  selectedEntity: Entity | null;
  isLoading: boolean;
  
  // Pagination et filtres
  pagination: {
    entities: PaginationParams;
    contacts: PaginationParams;
    missions: PaginationParams;
    opportunities: PaginationParams;
  };
  
  filters: {
    entities: SearchFilters;
    contacts: Record<string, any>;
    missions: Record<string, any>;
    opportunities: Record<string, any>;
  };
}

/** Actions du store */
export interface StoreActions {
  // UI Actions
  setCurrentUser: (user: User) => void;
  setSelectedEntity: (entity: Entity | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Entity actions
  addEntity: (entity: Omit<Entity, "id" | "createdAt" | "updatedAt">) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  deleteEntity: (id: string) => void;
  
  // Contact actions
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Mission actions
  addMission: (mission: Omit<Mission, "id" | "createdAt" | "updatedAt">) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  
  // Opportunity actions
  addOpportunity: (opportunity: Omit<Opportunity, "id" | "createdAt" | "updatedAt">) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  
  // Interaction actions
  addInteraction: (interaction: Omit<Interaction, "id" | "date" | "userId">) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;
  
  // Utility functions
  calculateScore: (entity: Omit<Entity, "score">) => number;
  getEntitiesByStatus: (status: Entity["status"]) => Entity[];
  getContactsByEntity: (entityId: string) => Contact[];
  getMissionsByEntity: (entityId: string) => Mission[];
  getOpportunitiesByEntity: (entityId: string) => Opportunity[];
}

//
// ================= NAVIGATION =================
//

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

//
// ================= FORM VALIDATION =================
//

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule;
  defaultValue?: any;
}

export interface FormErrors {
  [fieldName: string]: string;
}

//
// ================= CALENDAR =================
//

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'call' | 'visit' | 'deadline' | 'reminder';
  attendees?: string[];
  location?: string;
  entityId?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

//
// ================= NOTIFICATIONS =================
//

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

//
// ================= ANALYTICS =================
//

export interface AnalyticsData {
  period: string;
  metrics: {
    totalRevenue: number;
    newClients: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycle: number;
  };
  trends: {
    revenue: number[];
    clients: number[];
    opportunities: number[];
  };
  topPerformers: {
    name: string;
    sales: number;
    deals: number;
    conversion: number;
  }[];
}

//
// ================= SETTINGS =================
//

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
    widgets: string[];
  };
}

export interface SystemSettings {
  companyInfo: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
  };
  features: {
    enableAnalytics: boolean;
    enableAutomation: boolean;
    enableIntegrations: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
  };
}