import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Entity,
  Contact,
  Mission,
  Opportunity,
  User,
  Interaction,
  AppState,
  StoreActions,
} from "../types";

interface CombinedState extends AppState, StoreActions {}

// Fonction de calcul du score selon le cahier des charges
const calculateEntityScore = (entity: Omit<Entity, "score">): number => {
  let score = 0;

  // CA (40%)
  if (entity.revenue && entity.revenue >= 100_000_000) score += 40;
  else if (entity.revenue && entity.revenue >= 50_000_000) score += 30;
  else if (entity.revenue && entity.revenue >= 10_000_000) score += 20;
  else score += 10;

  // Effectifs (30%)
  if (entity.employees && entity.employees >= 100) score += 30;
  else if (entity.employees && entity.employees >= 50) score += 25;
  else if (entity.employees && entity.employees >= 20) score += 20;
  else if (entity.employees && entity.employees >= 10) score += 15;
  else score += 10;

  // Statut (30%)
  if (entity.status === "client") score += 30;
  else score += 15;

  return Math.min(100, score);
};

// Données de démonstration
const mockEntities: Entity[] = [
  {
    id: "1",
    companyName: "ALPHA Industries SA",
    nif: "1234567890",
    sector: "Industrie",
    region: "Dakar",
    parentOrganization: "Groupe ALPHA International",
    status: "client",
    priority: "high",
    score: 85,
    revenue: 2500000,
    employees: 150,
    address: {
      street: "Avenue Léopold Sédar Senghor",
      city: "Dakar",
      postalCode: "BP 1234",
      country: "Sénégal",
    },
    legalInfo: {
      legalForm: "SA",
      registrationNumber: "SN-DKR-2020-A-001",
      vatNumber: "SN123456789",
      documents: [],
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-01"),
    lastInteraction: new Date("2024-01-15"),
  },
  {
    id: "2",
    companyName: "BETA Télécoms",
    nif: "0987654321",
    sector: "Télécommunications",
    region: "Thiès",
    status: "prospect",
    priority: "medium",
    score: 72,
    revenue: 1800000,
    employees: 95,
    address: {
      street: "Route de Dakar",
      city: "Thiès",
      postalCode: "BP 5678",
      country: "Sénégal",
    },
    legalInfo: {
      legalForm: "SARL",
      registrationNumber: "SN-THS-2021-B-002",
      documents: [],
    },
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-11-28"),
    lastInteraction: new Date("2024-01-12"),
  },
];

const mockContacts: Contact[] = [
  {
    id: "1",
    entityId: "1",
    name: "Amadou Traoré",
    role: "Directeur Général",
    email: "a.traore@sonabel.bf",
    phone: "+226 70 12 34 56",
    whatsapp: "+226 70 12 34 56",
    isPrimary: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    entityId: "2",
    name: "Marie Ouédraogo",
    role: "Directrice Financière",
    email: "m.ouedraogo@orange.bf",
    phone: "+226 71 23 45 67",
    isPrimary: true,
    createdAt: new Date("2024-02-10"),
  },
];

const mockUser: User = {
  id: "1",
  firstName: "Jean",
  lastName: "Sawadogo",
  email: "j.sawadogo@fidalli.bf",
  role: "director",
  permissions: [],
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
};

export const useStore = create<CombinedState>()(
  persist(
    (set, get) => ({
      // État initial
      entities: mockEntities.map((entity) => ({
        ...entity,
        score: calculateEntityScore(entity),
      })),
      contacts: mockContacts,
      missions: [],
      opportunities: [],
      interactions: [],
      currentUser: mockUser,
      selectedEntity: null,
      isLoading: false,
      
      // Pagination et filtres
      pagination: {
        entities: { page: 0, size: 20 },
        contacts: { page: 0, size: 20 },
        missions: { page: 0, size: 20 },
        opportunities: { page: 0, size: 20 },
      },
      
      filters: {
        entities: {},
        contacts: {},
        missions: {},
        opportunities: {},
      },

      // Actions UI
      setCurrentUser: (user) => set({ currentUser: user }),
      setSelectedEntity: (entity) => set({ selectedEntity: entity }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Actions Entity
      addEntity: (entityData) => {
        const id = Date.now().toString();
        const createdAt = new Date();
        const updatedAt = new Date();
        const entity: Entity = {
          ...entityData,
          id,
          createdAt,
          updatedAt,
          score: calculateEntityScore({
            ...entityData,
            id,
            createdAt,
            updatedAt,
          }),
        };
        set((state) => ({ entities: [...state.entities, entity] }));
      },

      updateEntity: (id, updates) => {
        set((state) => ({
          entities: state.entities.map((entity) => {
            if (entity.id === id) {
              const updated = { ...entity, ...updates, updatedAt: new Date() };
              return { ...updated, score: calculateEntityScore(updated) };
            }
            return entity;
          }),
        }));
      },

      deleteEntity: (id) => {
        set((state) => ({
          entities: state.entities.filter((entity) => entity.id !== id),
          contacts: state.contacts.filter((contact) => contact.entityId !== id),
          missions: state.missions.filter((mission) => mission.entityId !== id),
          opportunities: state.opportunities.filter((opp) => opp.entityId !== id),
        }));
      },

      // Contact actions
      addContact: (contactData) => {
        const contact: Contact = {
          ...contactData,
          id: Date.now().toString(),
          createdAt: new Date(),
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
        const mission: Mission = {
          ...missionData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ missions: [...state.missions, mission] }));
      },

      updateMission: (id, updates) => {
        set((state) => ({
          missions: state.missions.map((mission) =>
            mission.id === id ? { ...mission, ...updates, updatedAt: new Date() } : mission
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
        const opportunity: Opportunity = {
          ...opportunityData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ opportunities: [...state.opportunities, opportunity] }));
      },

      updateOpportunity: (id, updates) => {
        set((state) => ({
          opportunities: state.opportunities.map((opp) =>
            opp.id === id ? { ...opp, ...updates, updatedAt: new Date() } : opp
          ),
        }));
      },

      deleteOpportunity: (id) => {
        set((state) => ({
          opportunities: state.opportunities.filter((opp) => opp.id !== id),
        }));
      },

      // Actions Interaction
      addInteraction: (interactionData) => {
        const interaction: Interaction = {
          ...interactionData,
          id: Date.now().toString(),
          date: new Date(),
          userId: get().currentUser?.id || 'unknown',
        };
        set((state) => ({ interactions: [...state.interactions, interaction] }));
      },

      updateInteraction: (id, updates) => {
        set((state) => ({
          interactions: state.interactions.map((interaction) =>
            interaction.id === id ? { ...interaction, ...updates } : interaction
          ),
        }));
      },

      deleteInteraction: (id) => {
        set((state) => ({
          interactions: state.interactions.filter((interaction) => interaction.id !== id),
        }));
      },

      // Fonctions utilitaires
      calculateScore: calculateEntityScore,

      getEntitiesByStatus: (status) => {
        return get().entities.filter((entity) => entity.status === status);
      },

      getContactsByEntity: (entityId) => {
        return get().contacts.filter((contact) => contact.entityId === entityId);
      },

      getMissionsByEntity: (entityId) => {
        return get().missions.filter((mission) => mission.entityId === entityId);
      },

      getOpportunitiesByEntity: (entityId) => {
        return get().opportunities.filter((opp) => opp.entityId === entityId);
      },
    }),
    {
      name: 'fidalli-crm-store',
      partialize: (state) => ({
        // Persister seulement certaines données
        entities: state.entities,
        contacts: state.contacts,
        missions: state.missions,
        opportunities: state.opportunities,
        currentUser: state.currentUser,
        filters: state.filters,
      }),
    }
  )
);