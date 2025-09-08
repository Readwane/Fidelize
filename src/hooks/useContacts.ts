// Hook personnalisé pour la gestion des contacts
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useMutation } from './useApi';
import { contactsService } from '../services/api';
import { Contact, ContactFormData } from '../types';
import { useToast } from './useToast';

export const useContacts = () => {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact,
    getContactsByEntity 
  } = useStore();
  const { success, error } = useToast();

  // Mutation pour créer un contact
  const createContactMutation = useMutation(
    async (contactData: ContactFormData) => {
      // Ici on appellerait l'API backend
      // const backendContact = ContactsService.toBackendContact(contactData);
      // const result = await contactsService.create(backendContact);
      // return ContactsService.toFrontendContact(result, parseInt(contactData.entityId));
      
      // Pour le moment, on utilise le store local
      addContact(contactData);
      return contactData;
    },
    {
      onSuccess: () => {
        success('Contact créé avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la création', errorMessage);
      },
    }
  );

  // Mutation pour mettre à jour un contact
  const updateContactMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Contact> }) => {
      // Ici on appellerait l'API backend
      // await contactsService.update(parseInt(id), updates);
      
      // Pour le moment, on utilise le store local
      updateContact(id, updates);
      return { id, ...updates };
    },
    {
      onSuccess: () => {
        success('Contact mis à jour avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la mise à jour', errorMessage);
      },
    }
  );

  // Mutation pour supprimer un contact
  const deleteContactMutation = useMutation(
    async (id: string) => {
      // Ici on appellerait l'API backend
      // await contactsService.delete(parseInt(id));
      
      // Pour le moment, on utilise le store local
      deleteContact(id);
      return id;
    },
    {
      onSuccess: () => {
        success('Contact supprimé avec succès');
      },
      onError: (errorMessage) => {
        error('Erreur lors de la suppression', errorMessage);
      },
    }
  );

  // Fonctions utilitaires
  const getContactById = useCallback((id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  }, [contacts]);

  const getPrimaryContacts = useCallback((): Contact[] => {
    return contacts.filter(contact => contact.isPrimary);
  }, [contacts]);

  const getContactsWithWhatsApp = useCallback((): Contact[] => {
    return contacts.filter(contact => contact.whatsapp);
  }, [contacts]);

  const searchContacts = useCallback((query: string): Contact[] => {
    if (!query.trim()) return contacts;
    
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.role.toLowerCase().includes(searchTerm)
    );
  }, [contacts]);

  const getContactsByRole = useCallback((role: string): Contact[] => {
    return contacts.filter(contact => 
      contact.role.toLowerCase().includes(role.toLowerCase())
    );
  }, [contacts]);

  const getContactStatistics = useCallback(() => {
    const total = contacts.length;
    const primary = contacts.filter(c => c.isPrimary).length;
    const withWhatsApp = contacts.filter(c => c.whatsapp).length;
    const entitiesCovered = new Set(contacts.map(c => c.entityId)).size;

    return {
      total,
      primary,
      withWhatsApp,
      entitiesCovered,
    };
  }, [contacts]);

  return {
    // Données
    contacts,
    
    // Mutations
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    
    // États des mutations
    isCreating: createContactMutation.loading,
    isUpdating: updateContactMutation.loading,
    isDeleting: deleteContactMutation.loading,
    
    // Erreurs
    createError: createContactMutation.error,
    updateError: updateContactMutation.error,
    deleteError: deleteContactMutation.error,
    
    // Fonctions utilitaires
    getContactById,
    getContactsByEntity,
    getPrimaryContacts,
    getContactsWithWhatsApp,
    searchContacts,
    getContactsByRole,
    getContactStatistics,
  };
};