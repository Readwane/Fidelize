// Ce fichier contient les interfaces TypeScript correspondant aux DTO Java.
// Chaque interface représente un modèle de données échangé via l’API REST.


//
// ================= ACTIVITIES =================
//

/**
 * Représente une entité exécutable dans le système, telle qu'une étape, une activité ou une tâche.
 * enregistrée à l'avance pour être utilisée dans des missions ou propositions commerciales.
 */
export interface Executable {
    id?: number;
    name: string;
    description?: string;
    estimateDuration?: string; // Duration ISO 8601
    executableType: ExecutableType; // enum ExecutableType
    parentId?: number;
}

/**
 * Représente l'exécution d'un exécutable prédéfini, dans un  cadre donné (mission ou proposition),
 * par un agent dans le système de mission ou de proprosition.
 */
export interface Execution {
    id?: number;
    status: ExecStatus; // enum ExecStatus
    rank?: number;
    startDate?: Date;
    endDate?: Date;
    duration?: string; // Duration ISO 8601
    executableId: number;
    agentId: number; // collaboratorId to execute the executable
    purposeId: number;
    purposeType: PurposeType; // enum PurposeType
}

/** Statut d’exécution d’un exécutable */
export enum ExecStatus {
    PENDING = "PENDING",       // En attente
    IN_PROGRESS = "IN_PROGRESS", // En cours
    COMPLETED = "COMPLETED",   // Terminé
    CANCELLED = "CANCELLED",   // Annulé
}

/** Type d’exécutable */
export enum ExecutableType {
    STEP = "STEP",        // Étape
    ACTIVITY = "ACTIVITY", // Activité
    TASK = "TASK",        // Tâche
    OTHER = "OTHER",      // Autre
}

/** Type de personne dans le système */
export enum PersonType {
    COLLABORATOR = "COLLABORATOR",
    CONTACT = "CONTACT",
    COMPANY = "COMPANY",
}

/** Type de cadre ou contexte */
export enum PurposeType {
    PROPOSITION = "PROPOSITION",
    MISSION = "MISSION",
    CONVERSION = "CONVERSION",
    ANALYSIS = "ANALYSIS",
    OTHER = "OTHER",
}

//
// ================= COLLABORATORS =================
//


/**
 * Représente un collaborateur dans le système.
 * Il peut etre alloué à des missions ou à des propositions commerciales en tant qu'agent.
 * Il appartient à un department donné
 */
export interface Collaborator {
    id?: number;
    email: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    birthDate?: Date; // LocalDate
    imagePath?: string;
    score: number;
    postalBox?: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    departmentId: number;
}

/**
 * Représente un agent chargé de l'execution d'un executable dans le système.
 * Un agent est un collaborateur alloué à à une mission ou à une proposition commerciale.
 * Il appartient à une Equipe de mission ou de proposition commerciale
 */
export interface Agent {
    id?: number;
    type: string; // enum AgentType
    grade: string; // enum Grade
    collaboratorId: number;
    teamId: number;
}

/** Représente une connexion active */
export interface Connection {
    id?: number;
    token: string;
    refreshToken: string;
    startTime: Date; // LocalDateTime
    endTime?: Date;  // LocalDateTime
    collaboratorId: number;
}

/** Représente un département */
export interface Department {
    id?: number;
    name: string;
    description?: string;
}

/** Association entre département et rôle */
export interface DepRole {
    id?: number;
    departmentId: number;
    roleId: number;
}

/***
 * Represente un forum de discusion lors de l'execution d'une mission ou une proposition commerciale
 */
export interface Forum {
    id?: number;
    name: string;
    description?: string;
    status: ForumStatus; // enum ForumStatus
    teamId: number;
}

/**
 * Représente une action effectuée sur un document ou une entité dans le système.
 * Cette classe est utilisée pour enregistrer les actions effectuées par les utilisateurs.
 */
export interface Operation {
    id?: number;
    operationType: OperationType; // enum OperationType
    entityType: string;
    details?: string;
    connectionId: number;
}

/** Représente un rôle */
export interface Role {
    id?: number;
    name: string;
    description?: string;
}

/***
 * Represente une équipe pour une mission ou une proposition commerciale dans le systeme
 */
export interface Team {
    id?: number;
    name: string;
    description?: string;
    purposeType: PurposeType; // enum PurposeType
    purposeId: number;
}

/** Type d’agent */
export enum AgentType {
    INTERNAL = "INTERNAL", // Collaborateur interne
    EXTERNAL = "EXTERNAL", // Collaborateur externe
    OTHER = "OTHER",
}

/** Statut d’un forum */
export enum ForumStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

/** Grade d’un agent */
export enum Grade {
    MISSION_DIRECTOR = "MISSION_DIRECTOR",
    MISSION_CHIEF = "MISSION_CHIEF",
    POINT_FOCAL = "POINT_FOCAL",
    ASSISTANT = "ASSISTANT",
    OTHER = "OTHER",
}

/** Type d’opération (actions CRUD, gestion, etc.) */
export enum OperationType {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    ASSIGN = "ASSIGN",
    UNASSIGN = "UNASSIGN",
    PLAN = "PLAN",
    START = "START",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    COMPLETE = "COMPLETE",
    CANCEL = "CANCEL",
    SUSPEND = "SUSPEND",
    SUBMIT = "SUBMIT",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    NOTIFY = "NOTIFY",
    SHARE = "SHARE",
    REQUEST = "REQUEST",
    VALIDATE = "VALIDATE",
    AUDIT = "AUDIT",
    BILL = "BILL",
    ARCHIVE = "ARCHIVE",
}


//
// ================= COMPANIES =================
//

/**
 * Représente une entreprise (client ou prospect) dans le système, avec des informations spécifiques telles que l'IFU, le RCCM, et la forme juridique.
 */
export interface Company {
    id?: number;
    companyName: string;
    email: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    birthDate?: Date;
    imagePath?: string;
    score: number;
    postalBox?: string;
    ifu: string;
    rccm: string;
    legalForm: LegalForm; // enum LegalForm
    isProspect?: boolean;
    description?: string;
    companyType: CompanyType; // enum CompanyType
    parentId?: number;
    locationId: number;
    website?: string;
}

/** Association entreprise-secteur */
export interface CompanySector {
    id?: number;
    companyId: number;
    sectorId: number;
}

/** Données financières d’une entreprise */
export interface FinancialData {
    id?: number;
    companyId: number;
    turnover: number;
    balanceSheetTotal: number;
    workforce: number;
    year: number;
    netProfit?: number;
    cashFlow?: number;
    ebitda?: number;
    totalDebt?: number;
    equity?: number;
}

/** Localisation (pays, ville, adresse, lienMaps) */
export interface Location {
    id?: number;
    country: string;
    city: string;
    address?: string;
    urlMaps?: string;
}

/**
 * Représente un secteur d'activité dans le système.
 * Un secteur regroupe des entreprises selon leur industrie ou leur domaine d'opération.
 */
export interface Sector {
    id?: number;
    name: string;
    description?: string;
}

/** Type d’entreprise */
export enum CompanyType {
    GROUP = "GROUP",
    FILIAL = "FILIAL",
    AGENCY = "AGENCY",
}

/** Forme juridique */
export enum LegalForm {
    SARL = "SARL",
    SA = "SA",
    SAS = "SAS",
    EURL = "EURL",
    SNC = "SNC",
    SCI = "SCI",
    SASU = "SASU",
    SCS = "SCS",
    SCA = "SCA",
    SELARL = "SELARL",
    SELAS = "SELAS",
}

//
// ================= CONTACTS =================
//

/***
 * Represente un contact dans le système. Il peut etre lié à une entreprise (dans via une experience) ou non dans le système
 */
export interface Contact {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    birthDate?: Date;
    imagePath?: string;
    score: number;
    postalBox?: string;
    collaboratorId?: number;
}

/** Contribution d’un contact à une mission */
export interface Contribution {
    id?: number;
    contactId: number;
    missionId: number;
    role: ContributionRole; // enum ContributionRole
    description?: string;
    weight?: number;
}

/** Expérience professionnelle d’un contact dans une entreprise donnée*/
export interface Experience {
    id?: number;
    postName: PostName; // enum PostName
    startDate: string;
    endDate?: string;
    description?: string;
    contactId: number;
    companyId: number;
}

/** Rôle de contribution d’un contact */
export enum ContributionRole {
    SOURCE = "SOURCE",
    FACILITATOR = "FACILITATOR",
    OTHER = "OTHER",
}

/** Fonction occupée lors d’une expérience professionnelle */
export enum PostName {
    DG = "DG",
    COORDINATOR = "COORDINATOR",
    RAF = "RAF",
    INTERNAL_AUDITOR = "INTERNAL_AUDITOR",
    INTERNAL_CONTROLLER = "INTERNAL_CONTROLLER",
    MANAGEMENT_CONTROLLER = "MANAGEMENT_CONTROLLER",
    HR_MANAGER = "HR_MANAGER",
    DAFC_DFC = "DAFC_DFC",
    TREASURER = "TREASURER",
    SPM_DNP_BUYER = "SPM_DNP_BUYER",
    CFO = "CFO",
    CEO = "CEO",
    COO = "COO",
    IT_MANAGER = "IT_MANAGER",
    LEGAL_MANAGER = "LEGAL_MANAGER",
    COMPLIANCE_OFFICER = "COMPLIANCE_OFFICER",
    RISK_MANAGER = "RISK_MANAGER",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    SALES_MANAGER = "SALES_MANAGER",
    MARKETING_MANAGER = "MARKETING_MANAGER",
    EXTERNAL_AUDITOR = "EXTERNAL_AUDITOR",
}

//
// ================= DOCUMENTS =================
//

/**
 * Représente l'analyse d'un document (Ex: PPM)  d'une entreprise dans le système, pouvant donner lieu à un besoin.
 */
export interface Analysis {
    id?: number;
    name: string;
    description?: string;
    status: AnalysisStatus; // enum AnalysisStatus
    documentId: number;
}

/** Document stocké dans le système */
export interface Document {
    id?: number;
    name: string;
    size: number;
    contentType: string;
    filePath: string;
    isAnalysable?: boolean;
    typeId: number;
    purposeId: number;
    purposeType: PurposeType; // enum PurposeType
    ownerId: number; // CompanyId
}

/** Type de document */
export interface DocumentType {
    id?: number;
    name: string;
    description?: string;
    executableId: number;
}

/** Facture */
export interface Invoice {
    id?: number;
    name: string;
    size: number;
    contentType: string;
    filePath: string;
    isAnalysable?: boolean;
    typeId: number;
    missionId: number;
    ownerId: number; // CompanyId
    number: string;
    amount: number;
    issueDate: Date;
    dueDate: Date;
    status: string; // enum InvoiceStatus
}

/** Modèle de document (template) */
export interface Template {
    id?: number;
    name: string;
    size: number;
    contentType: string;
    filePath: string;
    isAnalysable?: boolean;
    typeId: number;
    ownerId: number; // CompanyId
    version: number;
}

/** Statut d’analyse de document */
export enum AnalysisStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    OTHER = "OTHER",
}

/** Statut de facture */
export enum InvoiceStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    UNPAID = "UNPAID",
    OVERDUE = "OVERDUE",
}

//
// ================= MISSIONS =================
//

/** Évaluation liée à une mission */
export interface Evaluation {
    id?: number;
    score: number;
    comments?: string;
    evalDate: Date;
    missionId: number;
}

/** Mission */
export interface Mission {
    id?: number;
    name: string;
    description?: string;
    companyId: number;
    startDate: Date;
    endDate?: Date;
    status: MissionStatus; // enum MissionStatus
    typeId: number; // MissionTypeId
    sourceId?: number; // PropositionId
}

/** Type de mission */
export interface MissionType {
    id?: number;
    name: string;
    description?: string;
    serviceId?: number;
}

/** Service */
export interface Service {
    id?: number;
    name: string;
    domain: string;
    description?: string;
}

/** Statut d’une mission */
export enum MissionStatus {
    INITIATED = "INITIATED",
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}


//
// ================= OPPORTUNITIES =================
//

/** Besoin identifié */
export interface Need {
    id?: number;
    name: string;
    description?: string;
    serviceId?: number;
    comments: string;
    isExist: boolean;
}

/** Opportunité */
export interface Opportunity {
    id?: number;
    name: string;
    description: string;
    deadline?: Date;
    status: OpportunityStatus; // enum OpportunityStatus
    sourceId: number;
    needId: number;
}

/** Proposition commerciale */
export interface Proposition {
    id?: number;
    name: string;
    description?: string;
    companyId: number;
    opportunityId: number;
    type: PropositionType; // enum PropositionType
    submissionDate?: Date;
    estimatedAmount?: number;
    status: PropositionStatus; // enum PropositionStatus
}

/** Source d’opportunité */
export interface Source {
    id?: number;
    name: string;
    reference: string;
    description: string;
    type: SourceType; // enum SourceType
}

/** Statut d’une opportunité */
export enum OpportunityStatus {
    CLOSED_NOT_TACKED = "CLOSED_NOT_TACKED",
    OPEN = "OPEN",
    TACKED_AND_CLOSED = "TACKED_AND_CLOSED",
}

/** Statut d’une proposition commerciale */
export enum PropositionStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
}

/** Type de proposition commerciale */
export enum PropositionType {
    SPONTANOUS = "OFFRE SPONTANNEE",
    TECHNICAL_FINANCIAL = "OFFRE TECHNIQUE FINANCIERE",
    AMI = "AVIS A MANIFESTATION D'INTERET",
    OTHER = "AUTRE",
}

/** Type de source d’opportunité */
export enum SourceType {
    PAPERS = "PAPERS",
    INTERNET = "INTERNET",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    NETWORKING = "NETWORKING",
    NEEDCHEKED = "NEEDCHEKED",
}


//
// ================= Shared =================
//

/** Réponse d’erreur générique */
export interface ErrorResponse {
    message: string;
    details: string;
    timestamp: string;
}

/** Récompense attribuée à une personne */
export interface Award {
    id?: number;
    label: string;
    type: AwardType; // enum AwardType
    value?: number;
    status: AwardStatus; // enum AwardStatus
    description?: string;
    awardDate: Date;
    recipientType: PersonType; // enum PersonType
    recipientId?: number; // ContactId or CompanyId or CollaboratorId
}

/** Échange (message, communication, etc.) */
export interface Exchange {
    id?: number;
    category: ExchangeCategory; // enum ExchangeCategory
    type: ExchangeType; // enum ExchangeType
    content: string;
    object: string;
    exchangeDate: string;
    notes?: string;
    forumId?: number;
    senderId: number; // collaboratorId
    receiverId?: number; // collaboratorId or companyId or contactId
}

/** Réponse paginée générique */
export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

/** Lien de réseau social */
export interface SocialMediaLink {
    id?: number;
    platform: SocialMedia; // enum SocialMedia
    linkIconPath?: string;
    url: string;
    ownerType: PersonType; // enum PersonType
    ownerId?: number; // collaboratorId or companyId or contactId
}

/** Statut d’une récompense */
export enum AwardStatus {
    PENDING = "PENDING",
    AWARDED = "AWARDED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
}

/** Type de récompense */
export enum AwardType {
    CASH = "CASH",
    VOUCHER = "VOUCHER",
    PHYSICAL_GIFT = "PHYSICAL_GIFT",
    SERVICE = "SERVICE",
}

/** Catégorie d’échange */
export enum ExchangeCategory {
    MESSAGE = "MESSAGE",
    EMAIL = "EMAIL",
    CALL = "CALL",
    VISIT = "VISIT",
}

/** Type d’échange */
export enum ExchangeType {
    AUTOMATIC = "AUTOMATIC",
    MANUAL = "MANUAL",
}

/** Plateforme de réseau social */
export enum SocialMedia {
    LINKEDIN = "LINKEDIN",
    TWITTER = "TWITTER",
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    YOUTUBE = "YOUTUBE",
    TIKTOK = "TIKTOK",
    SNAPCHAT = "SNAPCHAT",
    WHATSAPP = "WHATSAPP",
    TELEGRAM = "TELEGRAM",
    DISCORD = "DISCORD",
    REDDIT = "REDDIT",
    PINTEREST = "PINTEREST",
    GITHUB = "GITHUB",
    GITLAB = "GITLAB",
    BITBUCKET = "BITBUCKET",
}


//
// ================= AUTH =================
//

/** Requête d’authentification ou de rafraîchissement de token */
export interface AuthRequest {
    username: string;
    password: string;
    rememberMe?: boolean;
    refreshToken?: string;
}

/** Réponse d’authentification contenant les tokens et session */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    sessionId?: number;
    tokenType?: string;
    expiresIn?: number;
    userId?: number;
}

/** Requête pour rafraîchir un token */
export interface RefreshTokenRequest {
    refreshToken: string;
}

//
// ================= DASHBOARD =================
//

/** Périodicité pour un KPI */
export enum KpiPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
}

/** Tendance d’un KPI */
export enum KpiTrend {
    UP = "up",
    DOWN = "down",
    STABLE = "stable",
}

/** Type d’alerte */
export enum AlertType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical",
}

/** Mode d’affichage du dashboard */
export enum DashboardLayout {
    GRID = "grid",
    LIST = "list",
}

/** Type de widget du dashboard */
export enum DashboardWidgetType {
    KPI = "kpi",
    CHART = "chart",
    TABLE = "table",
    INFO = "info",
    ALERT = "alert",
}

/** Taille d’un widget du dashboard */
export enum DashboardWidgetSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}

/** Représente un KPI suivi dans le dashboard */
export interface KPI {
    id: string;
    name: string;
    value: number;
    target?: number;
    unit: string;
    period: KpiPeriod;
    trend: KpiTrend;
    lastUpdated: Date;
}

/** Représente une alerte dans le système */
export interface Alert {
    id: string;
    type: AlertType;
    title: string;
    description: string;
    entityId?: string;
    entityType?: string;
    isRead: boolean;
}

/** Configuration pour un widget KPI */
export interface KpiConfig {
    target?: number;
    threshold?: number;
}

/** Configuration pour un widget de tableau */
export interface TableConfig {
    columns: string[];
    sortable?: boolean;
    pageSize?: number;
}

/** Configuration pour un widget de graphique */
export interface ChartConfig {
    chartType: "bar" | "line" | "pie";
    xAxis: string;
    yAxis: string;
    showLegend?: boolean;
    colors?: string[];
}

/** Union de tous les types possibles de configuration */
export type WidgetConfig = KpiConfig | TableConfig | ChartConfig;

/** Widget du dashboard */
export interface DashboardWidget {
    id: string;
    type: DashboardWidgetType;
    title: string;
    size: DashboardWidgetSize;
    positionX: number;
    positionY: number;
    config: WidgetConfig;
    dashboardConfigId: number;
}

/** Configuration du dashboard utilisateur */
export interface DashboardConfig {
    userId: string;
    layout: DashboardLayout;
    refreshInterval: number;
}
