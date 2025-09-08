import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { mockEntities as entities } from '../Entities/EntitiesList';
import Button from '../../UI/Button';
import { Mission } from '../../../types';

interface MissionFormProps {
  mission?: Mission;
  onClose: () => void;
  onSave: (mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const MissionForm: React.FC<MissionFormProps> = ({
  mission,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: mission?.title || '',
    type: mission?.type || 'audit_legal' as const,
    entityId: mission?.entityId || '',
    status: mission?.status || 'draft' as const,
    startDate: mission?.startDate ? 
      new Date(mission.startDate).toISOString().split('T')[0] : '',
    endDate: mission?.endDate ? 
      new Date(mission.endDate).toISOString().split('T')[0] : '',
    budget: mission?.budget || 0,
    description: mission?.description || '',
    assignedUsers: mission?.assignedUsers || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.entityId) {
      newErrors.entityId = 'L\'entreprise est requise';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Le budget doit être supérieur à 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      // Simuler un délai d'API
      setTimeout(() => {
      const missionData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        activities: mission?.activities || [],
        tasks: mission?.tasks || [],
        documents: mission?.documents || [],
        timesheets: mission?.timesheets || [],
        milestones: mission?.milestones || [],
      };
      onSave(missionData);
      onClose();
        setIsSubmitting(false);
      }, 600);
    }
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const missionTypes = [
    { value: 'audit_legal', label: 'Audit Légal' },
    { value: 'pca', label: 'Plan de Continuité d\'Activité' },
    { value: 'formation', label: 'Formation' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'other', label: 'Autre' },
  ];

  const teamMembers = [
    { id: 'user1', name: 'Marie Dubois' },
    { id: 'user2', name: 'Jean Martin' },
    { id: 'user3', name: 'Sophie Laurent' },
    { id: 'user4', name: 'Pierre Durand' },
  ];

  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-orange-900">Nouvelle mission</h3>
          </div>
          <p className="text-xs text-orange-700 mt-1">
            Créez une nouvelle mission pour votre client
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la mission *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: Audit annuel - Société ABC"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de mission *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isSubmitting}
          >
            {missionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entreprise *
          </label>
          <select
            value={formData.entityId}
            onChange={(e) => handleChange('entityId', e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.entityId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Sélectionner une entreprise</option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.companyName}
              </option>
            ))}
          </select>
          {errors.entityId && (
            <p className="text-red-500 text-xs mt-1">{errors.entityId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isSubmitting}
          >
            <option value="draft">Brouillon</option>
            <option value="active">Active</option>
            <option value="completed">Terminée</option>
            <option value="archived">Archivée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de début *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin prévue
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget (FCFA) *
        </label>
        <input
          type="number"
          value={formData.budget}
          onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
          className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.budget ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="45000000"
          disabled={isSubmitting}
        />
        {errors.budget && (
          <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Équipe assignée
        </label>
        <div className="grid grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg">
          {teamMembers.map((member) => (
            <label key={member.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.assignedUsers.includes(member.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleChange('assignedUsers', [...formData.assignedUsers, member.id]);
                  } else {
                    handleChange('assignedUsers', formData.assignedUsers.filter(id => id !== member.id));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">{member.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Description détaillée de la mission..."
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
          Annuler
        </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Création...</span>
              </div>
            ) : (
              `${mission ? 'Modifier' : 'Créer'} la Mission`
            )}
          </Button>
      </div>
      </form>
    </div>
  );
};

export default MissionForm;