import { Contact, Experience, Contribution, PostName, ContributionRole } from '../types';

export class ContactsService {
  private contacts: Contact[] = [];
  private experiences: Experience[] = [];
  private contributions: Contribution[] = [];

  // ================= CRUD Operations =================
  
  async getAll(): Promise<Contact[]> {
    return Promise.resolve([...this.contacts]);
  }

  async getById(id: number): Promise<Contact | null> {
    const contact = this.contacts.find(c => c.id === id);
    return Promise.resolve(contact || null);
  }

  async create(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const id = Math.max(...this.contacts.map(c => c.id || 0), 0) + 1;
    const newContact: Contact = { ...contact, id };
    this.contacts.push(newContact);
    return Promise.resolve(newContact);
  }

  async update(id: number, updates: Partial<Contact>): Promise<Contact | null> {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.contacts[index] = { ...this.contacts[index], ...updates };
    return Promise.resolve(this.contacts[index]);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.contacts.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Search and Filters =================
  
  async search(query: string): Promise<Contact[]> {
    const searchTerm = query.toLowerCase();
    const results = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(results);
  }

  async getByEmail(email: string): Promise<Contact | null> {
    const contact = this.contacts.find(c => c.email === email);
    return Promise.resolve(contact || null);
  }

  // ================= Experiences =================
  
  async getExperiences(contactId: number): Promise<Experience[]> {
    const results = this.experiences.filter(exp => exp.contactId === contactId);
    return Promise.resolve(results);
  }

  async addExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
    const id = Math.max(...this.experiences.map(e => e.id || 0), 0) + 1;
    const newExperience: Experience = { ...experience, id };
    this.experiences.push(newExperience);
    return Promise.resolve(newExperience);
  }

  async updateExperience(id: number, updates: Partial<Experience>): Promise<Experience | null> {
    const index = this.experiences.findIndex(e => e.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.experiences[index] = { ...this.experiences[index], ...updates };
    return Promise.resolve(this.experiences[index]);
  }

  async deleteExperience(id: number): Promise<boolean> {
    const index = this.experiences.findIndex(e => e.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.experiences.splice(index, 1);
    return Promise.resolve(true);
  }

  // ================= Contributions =================
  
  async getContributions(contactId: number): Promise<Contribution[]> {
    const results = this.contributions.filter(contrib => contrib.contactId === contactId);
    return Promise.resolve(results);
  }

  async addContribution(contribution: Omit<Contribution, 'id'>): Promise<Contribution> {
    const id = Math.max(...this.contributions.map(c => c.id || 0), 0) + 1;
    const newContribution: Contribution = { ...contribution, id };
    this.contributions.push(newContribution);
    return Promise.resolve(newContribution);
  }

  // ================= Statistics =================
  
  async getStatistics(): Promise<{
    totalContacts: number;
    contactsWithExperience: number;
    averageScore: number;
  }> {
    const totalContacts = this.contacts.length;
    const contactsWithExperience = new Set(this.experiences.map(e => e.contactId)).size;
    const averageScore = this.contacts.reduce((sum, c) => sum + c.score, 0) / totalContacts || 0;

    return Promise.resolve({
      totalContacts,
      contactsWithExperience,
      averageScore: Math.round(averageScore)
    });
  }

  // ================= Utility Methods =================
  
  async getContactsByCompany(companyId: number): Promise<Contact[]> {
    // Récupérer les contacts via leurs expériences dans l'entreprise
    const companyExperiences = this.experiences.filter(exp => exp.companyId === companyId);
    const contactIds = companyExperiences.map(exp => exp.contactId);
    const results = this.contacts.filter(contact => contactIds.includes(contact.id!));
    return Promise.resolve(results);
  }

  getFullName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`;
  }

  getCurrentPosition(contactId: number, companyId: number): PostName | null {
    const currentExperience = this.experiences.find(exp => 
      exp.contactId === contactId && 
      exp.companyId === companyId && 
      !exp.endDate
    );
    return currentExperience?.postName || null;
  }
}

export const contactsService = new ContactsService();