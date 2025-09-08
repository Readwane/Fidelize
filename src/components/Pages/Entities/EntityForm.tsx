import React, { useState } from 'react';
import Button from '../../UI/Button';
import { Entity } from '../../../types';

interface EntityFormProps {
  entity?: Entity;
  onClose: () => void;
  onSave: (entity: Omit<Entity, 'id'>) => void;
}

const EntityForm: React.FC<EntityFormProps> = ({ entity, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: entity?.companyName || '',
    nif: entity?.nif || '',
    sector: entity?.sector || '',
    region: entity?.region || '',
    parentOrganization: entity?.parentOrganization || '',
    status: entity?.status || 'prospect' as const,
    priority: entity?.priority || 'medium' as const,
    revenue: entity?.revenue || undefined,
    employees: entity?.employees || undefined,
    score: entity?.score || 0,
    address: {
      street: entity?.address?.street || '',
      city: entity?.address?.city || '',
      postalCode: entity?.address?.postalCode || '',
      country: entity?.address?.country || 'Burkina Faso',
    },
    legalInfo: {
      legalForm: entity?.legalInfo?.legalForm || '',
      registrationNumber: entity?.legalInfo?.registrationNumber || '',
      vatNumber: entity?.legalInfo?.vatNumber || '',
      documents: entity?.legalInfo?.documents || [],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.sector) {
      newErrors.sector = 'Le secteur est requis';
    }

    if (!formData.region) {
      newErrors.region = 'La région est requise';
    }

    if (formData.revenue && formData.revenue < 0) {
      newErrors.revenue = 'Le chiffre d\'affaires ne peut pas être négatif';
    }

    if (formData.employees && formData.employees < 0) {
      newErrors.employees = 'Le nombre d\'employés ne peut pas être négatif';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateScore = () => {
    let score = 0;

    // CA (40%)
    if (formData.revenue) {
      if (formData.revenue >= 100_000_000) score += 40;
      else if (formData.revenue >= 50_000_000) score += 30;
      else if (formData.revenue >= 10_000_000) score += 20;
      else score += 10;
    } else {
      score += 5; // Score minimal si pas de CA renseigné
    }

    // Effectifs (30%)
    if (formData.employees) {
      if (formData.employees >= 100) score += 30;
      else if (formData.employees >= 50) score += 25;
      else if (formData.employees >= 20) score += 20;
      else if (formData.employees >= 10) score += 15;
      else score += 10;
    } else {
      score += 5; // Score minimal si pas d'effectifs renseignés
    }

    // Statut (30%)
    if (formData.status === 'client') score += 30;
    else score += 15;

    return Math.min(100, score);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simuler un délai d'API
      setTimeout(() => {
        const entityData = {
          ...formData,
          createdAt: entity?.createdAt || new Date(),
          updatedAt: new Date(),
          score: calculateScore(),
        };
        onSave(entityData);
        onClose();
        setIsSubmitting(false);
      }, 800);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLegalInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      legalInfo: { ...prev.legalInfo, [field]: value }
    }));
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Progress Steps */}
      <div className="mb-6 px-6 py-4 bg-gray-50 -mx-6 -mt-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className={`ml-2 text-sm ${
                step <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Informations générales' : 
                 step === 2 ? 'Adresse & Légal' : 
                 'Validation'}
              </span>
              {step < totalSteps && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informations générales */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-1">Étape 1 : Informations générales</h3>
              <p className="text-xs text-blue-700">
                Renseignez les informations de base de l'entreprise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: ALPHA Industries SA"
                  disabled={isSubmitting}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleChange('nif', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ex: 1234567890"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur d'activité *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.sector ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner un secteur</option>
                  <option value="Industrie">Industrie</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Banque">Banque</option>
                  <option value="ONG">ONG</option>
                  <option value="EPE">EPE</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Services">Services</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Mines">Mines</option>
                  <option value="Transport">Transport</option>
                  <option value="Santé">Santé</option>
                  <option value="Éducation">Éducation</option>
                </select>
                {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutelle/Groupe (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.parentOrganization}
                  onChange={(e) => handleChange('parentOrganization', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ex: Ministère de l'Énergie"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.region ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner une région</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Diourbel">Diourbel</option>
                  <option value="Fatick">Fatick</option>
                  <option value="Kolda">Kolda</option>
                  <option value="Louga">Louga</option>
                  <option value="Matam">Matam</option>
                  <option value="Sédhiou">Sédhiou</option>
                  <option value="Tambacounda">Tambacounda</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                </select>
                {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
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
                  <option value="prospect">Prospect</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Adresse & Légal */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-1">Étape 2 : Adresse & Informations légales</h3>
              <p className="text-xs text-green-700">
                Complétez l'adresse et les informations légales
              </p>
            </div>

            {/* Section Adresse */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.street ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Avenue Kwame Nkrumah"
                    disabled={isSubmitting}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Ouagadougou"
                    disabled={isSubmitting}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ex: 01 BP 1234"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Section Informations légales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations légales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forme juridique
                  </label>
                  <select
                    value={formData.legalInfo.legalForm}
                    onChange={(e) => handleLegalInfoChange('legalForm', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner une forme juridique</option>
                    <option value="SA">Société Anonyme (SA)</option>
                    <option value="SARL">Société à Responsabilité Limitée (SARL)</option>
                    <option value="SNC">Société en Nom Collectif (SNC)</option>
                    <option value="SCS">Société en Commandite Simple (SCS)</option>
                    <option value="GIE">Groupement d'Intérêt Économique (GIE)</option>
                    <option value="Association">Association</option>
                    <option value="ONG">Organisation Non Gouvernementale (ONG)</option>
                    <option value="EPE">Entreprise Publique d'État (EPE)</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro RCCM (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.legalInfo.registrationNumber}
                    onChange={(e) => handleLegalInfoChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ex: BF-OUA-2023-A-001"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Validation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-900 mb-1">Étape 3 : Validation</h3>
              <p className="text-xs text-purple-700">
                Vérifiez les informations et finalisez la création
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiffre d'affaires (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => handleChange('revenue', parseInt(e.target.value) || undefined)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.revenue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="2500000"
                  disabled={isSubmitting}
                />
                {errors.revenue && <p className="text-red-500 text-xs mt-1">{errors.revenue}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'employés
                </label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => handleChange('employees', parseInt(e.target.value) || undefined)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.employees ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="150"
                  disabled={isSubmitting}
                />
                {errors.employees && <p className="text-red-500 text-xs mt-1">{errors.employees}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isSubmitting}
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Score calculé automatiquement</h4>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-blue-600">{calculateScore()}/100</div>
                <div className="flex-1">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${calculateScore()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Basé sur le CA, les effectifs et le statut client
              </p>
            </div>
          </div>
        )}

        {/* Navigation Steps */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                Précédent
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={isSubmitting}
              >
                Suivant
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  `${entity ? 'Modifier' : 'Créer'} l'Entreprise`
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EntityForm;