import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { mockEntities as entities } from '../Entities/EntitiesList';
import Button from '../../UI/Button';
import { Opportunity } from './Opportunities';

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onClose: () => void;
  onSave: (opportunity: Omit<Opportunity, 'id' | 'createdAt'>) => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  opportunity,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    entityId: opportunity?.entityId || '',
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    type: opportunity?.type || 'spontaneous' as const,
    value: opportunity?.value || 0,
    probability: opportunity?.probability || 50,
    deadline: opportunity?.deadline 
      ? new Date(opportunity.deadline).toISOString().split('T')[0] 
      : '',
    status: opportunity?.status || 'draft' as const,
    requiresApproval: opportunity?.requiresApproval || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.entityId) newErrors.entityId = 'L\'entreprise est requise';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (formData.value <= 0) newErrors.value = 'La valeur doit être supérieure à 0';
    if (formData.probability < 0 || formData.probability > 100) 
      newErrors.probability = 'La probabilité doit être entre 0 et 100';
    if (!formData.deadline) newErrors.deadline = 'La date limite est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        const deadlineDate = new Date(formData.deadline);
        if (isNaN(deadlineDate.getTime())) {
          setErrors((prev) => ({ ...prev, deadline: 'Date invalide' }));
          setIsSubmitting(false);
          return;
        }

        const opportunityData = {
          ...formData,
          deadline: deadlineDate,
          requiresApproval: formData.value > 50_000_000,
        };
        onSave(opportunityData);
        onClose();
        setIsSubmitting(false);
      }, 700);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    let parsedValue = value;
    if (typeof value === 'string' && (field === 'value' || field === 'probability')) {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) parsedValue = 0; // Gestion des entrées invalides
    }

    setFormData((prev) => ({ 
      ...prev, 
      [field]: parsedValue 
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (
          (field === 'title' && parsedValue.toString().trim()) ||
          (field === 'description' && parsedValue.toString().trim()) ||
          (field === 'value' && parsedValue > 0) ||
          (field === 'probability' && parsedValue >= 0 && parsedValue <= 100) ||
          (field === 'deadline' && parsedValue)
        ) {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-green-900">Nouvelle opportunité</h3>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Créez une nouvelle opportunité commerciale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Titre de l'opportunité *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Audit annuel pour ALPHA Industries"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="entityId">
              Entreprise *
            </label>
            <select
              id="entityId"
              value={formData.entityId}
              onChange={(e) => handleChange('entityId', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.entityId ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.entityId}
              aria-describedby={errors.entityId ? 'entityId-error' : undefined}
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
              <p id="entityId-error" className="text-red-500 text-xs mt-1">{errors.entityId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'opportunité
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isSubmitting}
            >
              <option value="spontaneous">Spontanée</option>
              <option value="technical">Technique</option>
              <option value="tender">Appel d'offres</option>
            </select>
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
              <option value="submitted">Soumise</option>
              <option value="won">Gagnée</option>
              <option value="lost">Perdue</option>
            </select>
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
            placeholder="Description détaillée de l'opportunité..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valeur (FCFA) *
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => handleChange('value', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.value ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="45000000"
              disabled={isSubmitting}
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Probabilité (%) *
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange('probability', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-medium text-blue-600">{formData.probability}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date limite *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.deadline ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Valeur pondérée calculée</h4>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
              }).format((formData.value * formData.probability) / 100)}
            </div>
            <div className="text-sm text-purple-700">
              ({formData.value.toLocaleString()} FCFA × {formData.probability}%)
            </div>
          </div>
          {formData.value > 50_000_000 && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-orange-700 font-medium">
                Approbation requise (montant &gt; 50M FCFA)
              </span>
            </div>
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
              `${opportunity ? 'Modifier' : 'Créer'} l'Opportunité`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;