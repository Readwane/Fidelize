import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Company,
  Contact,
  Mission,
  Opportunity,
  Collaborator,
  CompanyType,
  LegalForm,
  MissionStatus,
  OpportunityStatus,
  Location,
  Sector,
  FinancialData
} from "../types";
import { AppState, StoreActions } from "../types/frontend";

interface CombinedState extends AppState, StoreActions {}

// Fonction de calcul du score selon le cahier des charges
const calculateCompanyScore = (company: Company, financialData?: FinancialData): number => {
  let score = 0;

  // CA (40%) - basé sur les données financières
  if (financialData?.turnover) {
    if (financialData.turnover >= 100_000_000) score += 40;
    else if (financialData.turnover >= 50_000_000) score += 30;
    else if (financialData.turnover >= 10_000_000) score += 20;
    else score += 10;
  } else {
    score += 5; // Score minimal si pas de CA
  }

  // Effectifs (30%) - basé sur les données financières
  if (financialData?.workforce) {
    if (financialData.workforce >= 100) score += 30;
    else if (financialData.workforce >= 50) score += 25;
    else if (financialData.workforce >= 20) score += 20;
    else if (financialData.workforce >= 10) score += 15;
    else score += 10;
  } else {
    score += 5; // Score minimal si pas d'effectifs
  }

  // Statut (30%)
  if (!company.isProspect) score += 30; // Client
  else score += 15; // Prospect

  return Math.min(100, score);
};

// Données de démonstration basées sur les nouveaux modèles
const mockLocations: Location[] = [
  {
    id: 1,
    country: "Sénégal",
    city: "Dakar",
    address: "Avenue Léopold Sédar Senghor",
    urlMaps: "https://maps.google.com/dakar"
  },
  {
    id: 2,
    country: "Sénégal", 
    city: "Thiès",
    address: "Route de Dakar",
    urlMaps: "https://maps.google.com/thies"
  },
  {
    id: 3,
    country: "Sénégal",
    city: "Saint-Louis", 
    address: "Rue Blaise Diagne",
    urlMaps: "https://maps.google.com/saint-louis"
  }
];

const mockSectors: Sector[] = [
  { id: 1, name: "Industrie", description: "Secteur industriel" },
  { id: 2, name: "Télécommunications", description: "Secteur des télécommunications" },
  { id: 3, name: "ONG", description: "Organisations non gouvernementales" },
  { id: 4, name: "EPE", description: "Entreprises publiques d'État" }
];

const mockCompanies: Company[] = [
  {
    id: 1,
    companyName: "ALPHA Industries SA",
    email: "contact@alpha-industries.sn",
    phoneNumber: "+221 33 123 45 67",
    whatsappNumber: "+221 77 123 45 67",
    birthDate: new Date("2020-01-15"),
    imagePath: "",
    score: 85,
    postalBox: "BP 1234",
    ifu: "1234567890",
    rccm: "SN-DKR-2020-A-001",
    legalForm: LegalForm.SA,
    isProspect: false,
    description: "Entreprise industrielle leader au Sénégal",
    companyType: CompanyType.GROUP,
    locationId: 1,
    website: "https://alpha-industries.sn"
  },
  {
    id: 2,
    companyName: "BETA Télécoms",
    email: "info@beta-telecom.sn",
    phoneNumber: "+221 33 234 56 78",
    whatsappNumber: "+221 77 234 56 78",
    birthDate: new Date("2021-03-10"),
    imagePath: "",
    score: 72,
    postalBox: "BP 5678",
    ifu: "0987654321",
    rccm: "SN-THS-2021-B-002",
    legalForm: LegalForm.SARL,
    isProspect: true,
    description: "Opérateur de télécommunications",
    companyType: CompanyType.AGENCY,
    locationId: 2,
    website: "https://beta-telecom.sn"
  },
  {
    id: 3,
    companyName: "GAMMA ONG",
    email: "contact@gamma-ong.org",
    phoneNumber: "+221 33 345 67 89",
    birthDate: new Date("2019-06-20"),
    imagePath: "",
    score: 92,
    postalBox: "BP 9012",
    ifu: "1122334455",
    rccm: "SN-STL-2019-C-003",
    legalForm: LegalForm.SARL,
    isProspect: false,
    description: "ONG de développement social",
    companyType: CompanyType.AGENCY,
    locationId: 3,
    website: "https://gamma-ong.org"
  }
];

const mockContacts: Contact[] = [
  {
    id: 1,
    firstName: "Amadou",
    lastName: "Traoré",
    email: "a.traore@alpha-industries.sn",
    phoneNumber: "+221 77 123 45 67",
    whatsappNumber: "+221 77 123 45 67",
    birthDate: new Date("1975-05-15"),
    imagePath: "",
    score: 85,
    postalBox: "BP 1234"
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Ouédraogo",
    email: "m.ouedraogo@beta-telecom.sn",
    phoneNumber: "+221 77 234 56 78",
    birthDate: new Date("1980-08-22"),
    imagePath: "",
    score: 78,
    postalBox: "BP 5678"
  },
  {
    id: 3,
    firstName: "Fatou",
    lastName: "Diop",
    email: "f.diop@gamma-ong.org",
    phoneNumber: "+221 77 345 67 89",
    whatsappNumber: "+221 77 345 67 89",
    birthDate: new Date("1985-12-03"),
    imagePath: "",
    score: 90,
    postalBox: "BP 9012"
  }
];

const mockMissions: Mission[] = [
  {
    id: 1,
    name: "Audit Légal - ALPHA Industries",
    description: "Audit légal annuel pour l'exercice 2024",
    companyId: 1,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-15"),
    status: MissionStatus.IN_PROGRESS,
    typeId: 1
  },
  {
    id: 2,
    name: "PCA - BETA Télécoms",
    description: "Plan de Continuité d'Activité",
    companyId: 2,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-04-30"),
    status: MissionStatus.PLANNED,
    typeId: 2
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    name: "Audit Annuel ALPHA",
    description: "Proposition d'audit annuel pour ALPHA Industries",
    deadline: new Date("2024-03-15"),
    status: OpportunityStatus.OPEN,
    sourceId: 1,
    needId: 1
  },
  {
    id: 2,
    name: "Formation GAMMA",
    description: "Formation en comptabilité pour GAMMA ONG",
    deadline: new Date("2024-04-30"),
    status: OpportunityStatus.TACKED_AND_CLOSED,
    sourceId: 2,
    needId: 2
  }
];

const mockCollaborators: Collaborator[] = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Sawadogo",
    email: "j.sawadogo@fidalli.sn",
    phoneNumber: "+221 77 111 22 33",
    birthDate: new Date("1980-01-01"),
    imagePath: "",
    score: 95,
    postalBox: "BP 1111",
    username: "j.sawadogo",
    password: "hashed_password",
    departmentId: 1
  }
];

export const useStore = create<CombinedState>()(
  persist(
    (set, get) => ({
      // État initial
      companies: mockCompanies,
      contacts: mockContacts,
      missions: mockMissions,
      opportunities: mockOpportunities,
      collaborators: mockCollaborators,
      currentUser: mockCollaborators[0],
      selectedCompany: null,
      isLoading: false,
      
      // Pagination et filtres
      pagination: {
        companies: { page: 0, size: 20 },
        contacts: { page: 0, size: 20 },
        missions: { page: 0, size: 20 },
        opportunities: { page: 0, size: 20 },
      },
      
      filters: {
        companies: {},
        contacts: {},
        missions: {},
        opportunities: {},
      },

      // Actions UI
      setCurrentUser: (user) => set({ currentUser: user }),
      setSelectedCompany: (company) => set({ selectedCompany: company }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Actions Company
      addCompany: (companyData) => {
        const id = Math.max(...get().companies.map(c => c.id || 0)) + 1;
        const company: Company = {
          ...companyData,
          id,
          score: calculateCompanyScore(companyData),
        };
        set((state) => ({ companies: [...state.companies, company] }));
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((company) => {
            if (company.id === id) {
              const updated = { ...company, ...updates };
              return { ...updated, score: calculateCompanyScore(updated) };
            }
            return company;
          }),
        }));
      },

      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((company) => company.id !== id),
          contacts: state.contacts.filter((contact) => {
            // Vérifier si le contact appartient à cette entreprise via Experience
            return true; // TODO: implémenter la logique avec Experience
          }),
          missions: state.missions.filter((mission) => mission.companyId !== id),
        }));
      },

      // Contact actions
      addContact: (contactData) => {
        const id = Math.max(...get().contacts.map(c => c.id || 0)) + 1;
        const contact: Contact = {
          ...contactData,
          id,
        };
        set((state) => ({ contacts: [...state.contacts, contact] }));
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },

      // Actions Mission
      addMission: (missionData) => {
        const id = Math.max(...get().missions.map(m => m.id || 0)) + 1;
        const mission: Mission = {
          ...missionData,
          id,
        };
        set((state) => ({ missions: [...state.missions, mission] }));
      },

      updateMission: (id, updates) => {
        set((state) => ({
          missions: state.missions.map((mission) =>
            mission.id === id ? { ...mission, ...updates } : mission
          ),
        }));
      },

      deleteMission: (id) => {
        set((state) => ({
          missions: state.missions.filter((mission) => mission.id !== id),
        }));
      },

      // Actions Opportunity
      addOpportunity: (opportunityData) => {
        const id = Math.max(...get().opportunities.map(o => o.id || 0)) + 1;
        const opportunity: Opportunity = {
          ...opportunityData,
          id,
        };
        set((state) => ({ opportunities: [...state.opportunities, opportunity] }));
      },

      updateOpportunity: (id, updates) => {
        set((state) => ({
          opportunities: state.opportunities.map((opp) =>
            opp.id === id ? { ...opp, ...updates } : opp
          ),
        }));
      },

      deleteOpportunity: (id) => {
        set((state) => ({
          opportunities: state.opportunities.filter((opp) => opp.id !== id),
        }));
      },

      // Fonctions utilitaires
      getCompaniesByStatus: (isProspect) => {
        return get().companies.filter((company) => company.isProspect === isProspect);
      },

      getContactsByCompany: (companyId) => {
        // TODO: Implémenter avec Experience pour lier contacts et entreprises
        return get().contacts;
      },

      getMissionsByCompany: (companyId) => {
        return get().missions.filter((mission) => mission.companyId === companyId);
      },

      getOpportunitiesByCompany: (companyId) => {
        // TODO: Implémenter la logique pour lier opportunités et entreprises
        return get().opportunities;
      },
    }),
    {
      name: 'fidalli-crm-store',
      partialize: (state) => ({
        companies: state.companies,
        contacts: state.contacts,
        missions: state.missions,
        opportunities: state.opportunities,
        currentUser: state.currentUser,
        filters: state.filters,
      }),
    }
  )
);