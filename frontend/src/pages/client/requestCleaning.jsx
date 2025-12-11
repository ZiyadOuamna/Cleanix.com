import React, { useState, useContext, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Users, Check, AlertCircle,
  ChevronRight, Home, KeyRound, Wind, Package,
  DoorOpen, Truck, Calendar, Zap
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const RequestService = ({ onBack }) => {
  const { user, isDarkMode } = useContext(ClientContext);
  const navigate = useNavigate();
  
  const theme = {
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
  };

  const [step, setStep] = useState(1);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
    
    // Champs spécifiques NettoyageResidential
    nombrePieces: '',
    nombreSallesBain: '',
    superficieTotale: '',
    options: [],
    
    // Champs spécifiques NettoyageSuperficie
    surfaceM2: '',
    typeSurface: 'moquette',
    
    // Champs spécifiques NettoyageUnitaire
    nombreUnites: '',
    typeObject: 'fenetre',
    
    // Champs spécifiques ServiceGestionCies
    chiLocataire: '',
    nomLocataire: '',
    typeOperation: 'remise',
    idCle: '',
    departement: '',
    adresseAppartement: '',
    dateOperation: '',
    heureOperation: '',
  });

  const [quote, setQuote] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate ID for keys service
  useEffect(() => {
    if (selectedServiceType === 'gestion_cles' && !formData.chiLocataire) {
      const year = new Date().getFullYear();
      const idAppartement = user?.id || Math.random().toString(36).substring(2, 9).toUpperCase();
      const generatedId = `Cle-${year}-${idAppartement}`;
      setFormData(prev => ({ 
        ...prev, 
        chiLocataire: generatedId,
        nomLocataire: user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : ''
      }));
    }
  }, [selectedServiceType, user?.id, user?.prenom, user?.nom]);

  const serviceTypes = [
    { 
      id: 'nettoyage_residential', 
      name: 'Nettoyage Résidentiel', 
      icon: Home, 
      description: 'Nettoyage complet de votre domicile',
      color: 'from-blue-500 to-cyan-500',
      category: 'nettoyage'
    },
    { 
      id: 'nettoyage_superficie', 
      name: 'Nettoyage par Surface', 
      icon: Wind, 
      description: 'Nettoyage spécifique par type de surface',
      color: 'from-green-500 to-emerald-500',
      category: 'nettoyage'
    },
    { 
      id: 'nettoyage_unitaire', 
      name: 'Nettoyage Unitaire', 
      icon: Package, 
      description: 'Nettoyage d\'objets spécifiques',
      color: 'from-purple-500 to-pink-500',
      category: 'nettoyage'
    },
    { 
      id: 'gestion_cles', 
      name: 'Gestion de Clés', 
      icon: KeyRound, 
      description: 'Service de gestion de clés',
      color: 'from-orange-500 to-red-500',
      category: 'cles'
    }
  ];

  const cleaningOptions = [
    { id: 'vitres', label: 'Nettoyage vitres', price: 25 },
    { id: 'moquette', label: 'Shampouineuse', price: 40 },
    { id: 'frigo', label: 'Réfrigérateur', price: 30 },
    { id: 'four', label: 'Four', price: 35 },
    { id: 'sdb_prof', label: 'Désinfection salle de bain', price: 45 }
  ];

  const surfaceTypes = [
    { id: 'moquette', label: 'Moquette', rate: 12 },
    { id: 'parquet', label: 'Parquet', rate: 15 },
    { id: 'carrelage', label: 'Carrelage', rate: 8 },
    { id: 'marbre', label: 'Marbre', rate: 20 }
  ];

  const objectTypes = [
    { id: 'fenetre', label: 'Fenêtre', rate: 25 },
    { id: 'meuble', label: 'Meuble', rate: 40 },
    { id: 'appareil', label: 'Appareil électroménager', rate: 30 },
    { id: 'lumiere', label: 'Lustre/Lumière', rate: 35 }
  ];

  const operationTypes = [
    { id: 'remise', label: 'Remise de clés', rate: 50 },
    { id: 'recuperation', label: 'Récupération', rate: 50 }
  ];

  const handleServiceSelect = (service) => {
    setSelectedServiceType(service.id);
    setFormData(prev => ({ 
      ...prev, 
      nom: service.name,
      description: service.description
    }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionToggle = (optionId) => {
    setFormData(prev => {
      const newOptions = prev.options.includes(optionId)
        ? prev.options.filter(id => id !== optionId)
        : [...prev.options, optionId];
      return { ...prev, options: newOptions };
    });
  };

  const calculateQuote = () => {
    let basePrice = 0;
    let details = [];

    switch(selectedServiceType) {
      case 'nettoyage_residential':
        const prixBaseResidential = 100;
        const prixParPiece = 25 * (parseFloat(formData.nombrePieces) || 0);
        const prixParSalleBain = 35 * (parseFloat(formData.nombreSallesBain) || 0);
        
        let prixOptions = 0;
        formData.options.forEach(optionId => {
          const option = cleaningOptions.find(o => o.id === optionId);
          if (option) prixOptions += option.price;
        });

        basePrice = prixBaseResidential + prixParPiece + prixParSalleBain + prixOptions;
        
        details = [
          { label: 'Prix de base', value: prixBaseResidential },
          { label: `${formData.nombrePieces || 0} pièces`, value: prixParPiece },
          { label: `${formData.nombreSallesBain || 0} salles de bain`, value: prixParSalleBain }
        ];
        if (prixOptions > 0) {
          details.push({ label: 'Options additionnelles', value: prixOptions });
        }
        break;

      case 'nettoyage_superficie':
        const surface = parseFloat(formData.surfaceM2) || 0;
        const surfaceType = surfaceTypes.find(t => t.id === formData.typeSurface);
        const tauxM2 = surfaceType ? surfaceType.rate : 10;
        
        basePrice = surface * tauxM2;
        if (basePrice < 50) basePrice = 50; // Prix minimum
        
        details = [
          { label: `${surface} m² de ${surfaceType?.label || 'surface'}`, value: basePrice }
        ];
        break;

      case 'nettoyage_unitaire':
        const unites = parseInt(formData.nombreUnites) || 0;
        const objectType = objectTypes.find(t => t.id === formData.typeObject);
        const tauxUnitaire = objectType ? objectType.rate : 25;
        
        basePrice = unites * tauxUnitaire;
        
        details = [
          { label: `${unites} ${objectType?.label || 'objet'}(s)`, value: basePrice }
        ];
        break;

      case 'gestion_cles':
        const operationType = operationTypes.find(t => t.id === formData.typeOperation);
        const prixBaseCles = operationType ? operationType.rate : 30;
        
        basePrice = prixBaseCles;
        
        details = [
          { label: operationType?.label || 'Opération', value: basePrice }
        ];
        break;

      default:
        basePrice = 0;
    }

    // TVA 20%
    const tax = basePrice * 0.20;
    const total = basePrice + tax;

    setQuote({
      serviceType: selectedServiceType,
      basePrice: parseFloat(basePrice.toFixed(2)),
      details,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    });

    setStep(3);
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#0891b2',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });
  };

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      showAlert('success', 'Demande envoyée!', 
        'Votre demande a été envoyée aux freelancers disponibles. Vous serez notifié dès qu\'un freelancer l\'acceptera.');
      
      setStep(1);
      setSelectedServiceType('');
      setQuote(null);
      
      setTimeout(() => {
        navigate('my-bookings');
      }, 2000);
    }, 2000);
  };

  const renderServiceForm = () => {
    switch(selectedServiceType) {
      case 'nettoyage_residential':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Nombre de pièces *
                </label>
                <input
                  type="number"
                  name="nombrePieces"
                  value={formData.nombrePieces}
                  onChange={handleInputChange}
                  placeholder="Ex: 4"
                  min="1"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Salles de bain *
                </label>
                <input
                  type="number"
                  name="nombreSallesBain"
                  value={formData.nombreSallesBain}
                  onChange={handleInputChange}
                  placeholder="Ex: 2"
                  min="0"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Superficie (m²)
                </label>
                <input
                  type="number"
                  name="superficieTotale"
                  value={formData.superficieTotale}
                  onChange={handleInputChange}
                  placeholder="Ex: 120"
                  min="10"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>
                Options additionnelles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cleaningOptions.map(option => (
                  <label key={option.id} className={`flex items-center gap-2 p-2 rounded-lg border ${theme.border} cursor-pointer hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={formData.options.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <span className={`text-xs ${theme.textMain}`}>{option.label}</span>
                      <span className={`text-xs ${theme.textMuted}`}>+{option.price}€</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'nettoyage_superficie':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                Surface à nettoyer (m²) *
              </label>
              <input
                type="number"
                name="surfaceM2"
                value={formData.surfaceM2}
                onChange={handleInputChange}
                placeholder="Ex: 80"
                min="1"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>
                Type de surface *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {surfaceTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, typeSurface: type.id }))}
                    className={`px-3 py-2 text-xs rounded-lg border transition ${
                      formData.typeSurface === type.id
                        ? 'border-cyan-600 bg-cyan-600 text-white'
                        : `${theme.border} ${theme.textMain} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'nettoyage_unitaire':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                Nombre d'unités *
              </label>
              <input
                type="number"
                name="nombreUnites"
                value={formData.nombreUnites}
                onChange={handleInputChange}
                placeholder="Ex: 3"
                min="1"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>
                Type d'objet *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {objectTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, typeObject: type.id }))}
                    className={`px-3 py-2 text-xs rounded-lg border transition ${
                      formData.typeObject === type.id
                        ? 'border-cyan-600 bg-cyan-600 text-white'
                        : `${theme.border} ${theme.textMain} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gestion_cles':
        return (
          <div className="space-y-6">
            {/* Auto-Generated Request ID */}
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-cyan-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-cyan-200'}`}>
              <p className={`text-sm ${theme.textMuted} mb-2`}>ID de la clé (généré automatiquement)</p>
              <p className={`text-2xl font-mono font-bold text-cyan-600`}>{formData.chiLocataire || 'Cle-2025-XXXXX'}</p>
            </div>

            {/* Full Name (Pre-filled, Disabled) */}
            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                Nom complet (par défaut) *
              </label>
              <input
                type="text"
                name="nomLocataire"
                value={formData.nomLocataire || (user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : '')}
                disabled
                className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} opacity-75 cursor-not-allowed`}
              />
              <p className={`text-xs ${theme.textMuted} mt-1`}>Ce champ est pré-rempli avec vos informations de compte</p>
            </div>

            {/* Type d'opération */}
            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>
                Type d'opération *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {operationTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, typeOperation: type.id }))}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      formData.typeOperation === type.id
                        ? 'border-cyan-600 bg-cyan-600 bg-opacity-10'
                        : `${theme.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                    }`}
                  >
                    <p className={`font-semibold ${theme.textMain} text-sm`}>{type.label}</p>
                    <p className={`text-lg font-bold text-cyan-600`}>{type.rate}DH</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date et Heure de l'opération */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Date de l'opération *
                </label>
                <input
                  type="date"
                  name="dateOperation"
                  value={formData.dateOperation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Heure de l'opération *
                </label>
                <input
                  type="time"
                  name="heureOperation"
                  value={formData.heureOperation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
            </div>

            {/* Description des clés */}
            <div>
              <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                Description des clés
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Clés de la porte principale, clés du garage..."
                className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${theme.bgMain} min-h-screen py-2 px-3`}>
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}
          >
            <ArrowLeft size={20} className="text-cyan-600" />
          </button>
          <div>
            <h1 className={`text-lg font-bold ${theme.textMain}`}>Demander un Service</h1>
            <p className={`text-xs ${theme.textMuted}`}>Obtenez un service rapidement</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex mb-3 ml-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                s <= step 
                  ? 'bg-cyan-600 text-white' 
                  : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 rounded ${
                  s < step ? 'bg-cyan-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Type Selection */}
        {step === 1 && (
          <div>
            <h2 className={`text-base font-semibold ${theme.textMain} mb-3 ml-2`}>
              Sélectionnez un service
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {serviceTypes.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`${theme.bgCard} rounded-lg p-2.5 border ${theme.border} hover:border-cyan-500 transition text-left flex items-center gap-2.5`}
                  >
                    <div className={`bg-gradient-to-tr ${service.color} rounded-lg p-1.5`}>
                      <IconComponent size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold text-xs ${theme.textMain}`}>{service.name}</h3>
                        <ChevronRight size={14} className="text-cyan-600" />
                      </div>
                      <p className={`${theme.textMuted} text-xs mt-0.5`}>{service.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && selectedServiceType && (
          <div className={`${theme.bgCard} rounded-lg p-3 border ${theme.border} max-h-[70vh] overflow-y-auto`}>
            <div className="flex items-center gap-2 mb-3 sticky top-0 bg-inherit">
              <div className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
                <Zap size={14} />
              </div>
              <div>
                <h2 className={`font-semibold text-sm ${theme.textMain}`}>
                  {serviceTypes.find(s => s.id === selectedServiceType)?.name}
                </h2>
                <p className={`text-xs ${theme.textMuted}`}>Service immédiat - Trouvé dans les 30 min</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Service Info */}
              <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
                <p className={`${theme.textMuted} text-xs mb-0.5`}>Service urgent</p>
                <p className={`text-xs ${theme.textMain}`}>
                  <Clock size={10} className="inline mr-0.5" />
                  Un freelancer sera assigné dans les 30 minutes
                </p>
              </div>

              {/* Address */}
              <div>
                <label className={`block text-xs font-medium ${theme.textMain} mb-1`}>
                  Adresse du service *
                </label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="Entrez l'adresse complète"
                  rows="2"
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} resize-none`}
                  required
                />
              </div>

              {/* Service Specific Fields */}
              <div className="border-t pt-2">
                <h3 className={`font-semibold text-xs ${theme.textMain} mb-2`}>
                  Détails du service
                </h3>
                {renderServiceForm()}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-medium ${theme.textMain} mb-1`}>
                  Instructions supplémentaires
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Détails supplémentaires pour le freelancer..."
                  rows="2"
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} resize-none`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t sticky bottom-0 bg-inherit">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition text-xs font-medium`}
              >
                Retour
              </button>
              <button
                onClick={calculateQuote}
                className="flex-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition text-xs font-medium"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Quote Review */}
        {step === 3 && quote && (
          <div className={`${theme.bgCard} rounded-lg p-3 border ${theme.border}`}>
            <h2 className={`font-semibold text-sm ${theme.textMain} mb-2`}>Récapitulatif</h2>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between">
                <span className={`text-xs ${theme.textMuted}`}>Service</span>
                <span className={`text-xs ${theme.textMain} font-medium`}>
                  {serviceTypes.find(s => s.id === quote.serviceType)?.name}
                </span>
              </div>
              
              {quote.details.map((detail, index) => (
                <div key={index} className="flex justify-between">
                  <span className={`text-xs ${theme.textMuted}`}>{detail.label}</span>
                  <span className={`text-xs ${theme.textMain}`}>{detail.value}€</span>
                </div>
              ))}
              
              <div className={`border-t pt-1.5 flex justify-between`}>
                <span className={`text-xs font-medium ${theme.textMain}`}>Sous-total</span>
                <span className={`text-xs font-medium ${theme.textMain}`}>{quote.basePrice}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className={`text-xs ${theme.textMuted}`}>TVA (20%)</span>
                <span className={`text-xs ${theme.textMuted}`}>{quote.tax}€</span>
              </div>
              
              <div className={`border-t pt-1.5 flex justify-between font-bold`}>
                <span className={`text-sm ${theme.textMain}`}>Total</span>
                <span className="text-cyan-600 font-bold">{quote.total}€</span>
              </div>
            </div>

            {/* Terms */}
            <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg mb-3 flex gap-1.5`}>
              <AlertCircle size={12} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className={`text-xs ${theme.textMuted}`}>
                Le paiement sera effectué après la réalisation du service par le freelancer.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className={`flex-1 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition text-xs font-medium`}
              >
                Modifier
              </button>
              <button
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className="flex-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestService;