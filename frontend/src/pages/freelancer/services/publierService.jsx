import React, { useState, useContext, useRef } from 'react';
import { 
  Upload, Camera, Plus, X, DollarSign, Clock, Tag, Package, ArrowLeft, AlertCircle,
  Check, Image as ImageIcon, FileText, MapPin, Calendar, ChevronRight
} from 'lucide-react';
import { FreelancerContext } from '../freelancerContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PublierService = () => {
  const { isDarkMode, user } = useContext(FreelancerContext);
  const navigate = useNavigate();

  // --- THÈME ADAPTÉ ---
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    textMain: isDarkMode ? 'text-gray-100' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-slate-50 text-slate-900 border-slate-300 focus:bg-white',
  };

  const imageUploadRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    detailedDescription: '',
    availability: {
      lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false, dimanche: false
    },
    zones: [],
    includedItems: ['Matériel de nettoyage', 'Produits professionnels'],
    status: 'pending_review',
    termsAccepted: false,
    pricingAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Zones simulées
  const cityZones = {
    'Casablanca': ['Maarif', 'Anfa', 'Ain Diab', 'Sidi Maarouf', 'Bernoussi', 'Hay Mohammadi'],
    'Rabat': ['Agdal', 'Hay Riad', 'Souissi', 'Hassan', 'Océan'],
    'Marrakech': ['Guéliz', 'Hivernage', 'Medina', 'Palmeraie'],
    'Tanger': ['Centre', 'Malabata', 'Marchan']
  };

  const userCity = user?.city || 'Casablanca';
  const specificZones = cityZones[userCity] || ['Zone 1', 'Zone 2', 'Zone 3'];
  const availableZones = [`Toute la ville (${userCity})`, ...specificZones];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const toggleZone = (zone) => {
    const isAllCity = zone.startsWith('Toute la ville');
    setFormData(prev => {
      let newZones = [...prev.zones];
      if (isAllCity) {
        if (newZones.includes(zone)) newZones = [];
        else newZones = [zone];
      } else {
        newZones = newZones.filter(z => !z.startsWith('Toute la ville'));
        if (newZones.includes(zone)) newZones = newZones.filter(z => z !== zone);
        else newZones.push(zone);
      }
      return { ...prev, zones: newZones };
    });
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: return formData.name && formData.category && formData.description;
      case 2: return true; // Pas de validation nécessaire pour cette étape
      case 3: return formData.zones.length > 0;
      case 4: return formData.termsAccepted && formData.pricingAccepted;
      default: return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted || !formData.pricingAccepted) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Service soumis !',
      text: 'Votre service a été envoyé au superviseur pour validation.',
      confirmButtonText: 'Voir mes services',
      confirmButtonColor: '#10B981',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      allowOutsideClick: true, 
      allowEscapeKey: true
    }).then(() => {
      navigate('/dev-freelancer-page/gestion-services-freelancer', { 
        state: { newService: { ...formData, id: Date.now(), status: 'pending_review' } } 
      });
    });
  };

  const categories = [
    'Nettoyage résidentiel', 'Nettoyage commercial', 'Nettoyage de bureau',
    'Nettoyage après travaux', 'Nettoyage de printemps', 'Nettoyage de vitres'
  ];

  const ServicePreview = () => (
    <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6 sticky top-6`}>
      <h3 className={`text-xl font-bold ${theme.textMain} mb-4`}>Aperçu du service</h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-semibold ${theme.textMain}`}>{formData.name || "Nom du service"}</h4>
            <span className={`px-3 py-1 text-xs rounded-full ${isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'}`}>
              En attente
            </span>
          </div>
          <span className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-700'}`}>
             {formData.category || "Catégorie"}
          </span>
          <p className={`mt-3 text-sm ${theme.textSecondary}`}>{formData.description || "Description courte..."}</p>
        </div>

        <div>
          <p className={`text-sm font-medium ${theme.textMain} mb-2 flex items-center gap-2`}>
            <MapPin size={14} /> Zones desservies
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.zones.length > 0 ? (
              formData.zones.map((z, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                  {z}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Aucune zone sélectionnée</span>
            )}
          </div>
        </div>

        <div>
          <p className={`text-sm font-medium ${theme.textMain} mb-2 flex items-center gap-2`}>
            <Calendar size={14} /> Disponibilité type
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(formData.availability).map(([day, active]) => (
              <span key={day} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                active ? 'bg-green-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
              }`} title={day}>
                {day.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {formData.includedItems.length > 0 && (
           <div>
             <p className={`text-sm font-medium ${theme.textMain} mb-2`}>Inclus</p>
             <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
               {formData.includedItems.map((item, i) => (
                 <li key={i} className="flex items-center gap-2"><Check size={12} className="text-green-500"/> {item}</li>
               ))}
             </ul>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} py-8 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => navigate('gestion-services-freelancer')} 
            className={`flex items-center gap-2 ${theme.textSecondary} hover:${theme.textMain} transition`}
          >
            <ArrowLeft size={20} />
            <span>Retour à mes services</span>
          </button>
          
          <button onClick={() => setShowPreview(!showPreview)} className={`lg:hidden px-4 py-2 border ${theme.border} rounded-lg text-sm font-medium ${theme.textMain}`}>
            {showPreview ? 'Masquer l\'aperçu' : 'Voir l\'aperçu'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Colonne Formulaire */}
          <div className={`flex-1 ${theme.cardBg} rounded-xl shadow-lg border ${theme.border} flex flex-col`}>
            
            {/* Stepper */}
            <div className={`px-6 py-4 border-b ${theme.border}`}>
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step <= currentStep 
                        ? 'bg-green-600 text-white' 
                        : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-8 sm:w-16 h-1 mx-2 rounded ${
                        step < currentStep ? 'bg-green-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center">
                <span className={`text-sm font-medium ${theme.textMain}`}>
                  {currentStep === 1 && 'Informations Générales'}
                  {currentStep === 2 && 'Éléments inclus'}
                  {currentStep === 3 && 'Zones & Disponibilités'}
                  {currentStep === 4 && 'Validation'}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ETAPE 1 */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Nom du service *</label>
                      <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${theme.inputBg} focus:ring-2 focus:ring-green-500 outline-none`} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Catégorie *</label>
                      <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${theme.inputBg} focus:ring-2 focus:ring-green-500 outline-none`} required>
                        <option value="">Choisir...</option>
                        {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Description courte *</label>
                      <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows="3" className={`w-full px-4 py-2 rounded-lg border ${theme.inputBg} focus:ring-2 focus:ring-green-500 outline-none`} required maxLength={150}/>
                    </div>
                  </div>
                )}

                {/* ETAPE 2 */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                     <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Éléments inclus</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                           {formData.includedItems.map((item, idx) => (
                              <span key={idx} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-700'}`}>
                                 {item} <button type="button" onClick={() => {
                                    const newItems = [...formData.includedItems];
                                    newItems.splice(idx, 1);
                                    handleInputChange('includedItems', newItems);
                                 }}><X size={12}/></button>
                              </span>
                           ))}
                        </div>
                        <div className="flex gap-2">
                           <input type="text" id="newItemInput" placeholder="Ajouter un élément..." className={`flex-1 px-3 py-2 rounded-lg border ${theme.inputBg} text-sm`} 
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                       handleInputChange('includedItems', [...formData.includedItems, e.target.value.trim()]);
                                       e.target.value = '';
                                    }
                                 }
                              }}
                           />
                           <button type="button" onClick={() => {
                              const input = document.getElementById('newItemInput');
                              if (input.value.trim()) {
                                 handleInputChange('includedItems', [...formData.includedItems, input.value.trim()]);
                                 input.value = '';
                              }
                           }} className="px-3 py-2 bg-green-600 text-white rounded-lg"><Plus size={16}/></button>
                        </div>
                     </div>
                  </div>
                )}

                {/* ETAPE 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${theme.textMain}`}>Zones desservies *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableZones.map((zone) => {
                           const isAllCity = zone.startsWith('Toute la ville');
                           const isSelected = formData.zones.includes(zone);
                           const isDisabled = !isAllCity && formData.zones.some(z => z.startsWith('Toute la ville'));

                           return (
                             <button
                               key={zone}
                               type="button"
                               onClick={() => toggleZone(zone)}
                               disabled={isDisabled}
                               className={`p-2 rounded border text-sm text-left transition-all ${
                                 isSelected
                                   ? 'bg-green-600 text-white border-green-600'
                                   : isDisabled
                                   ? `opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`
                                   : `${theme.inputBg} hover:border-green-500`
                               }`}
                             >
                               {zone}
                             </button>
                           );
                        })}
                      </div>
                      {formData.zones.some(z => z.startsWith('Toute la ville')) && (
                         <p className="text-xs text-yellow-600 mt-2">ℹ️ L'option "Toute la ville" inclut automatiquement tous les quartiers.</p>
                      )}
                    </div>

                    <div>
                       <label className={`block text-sm font-medium mb-3 ${theme.textMain}`}>Jours de disponibilité</label>
                       <div className="flex flex-wrap gap-2">
                          {Object.entries(formData.availability).map(([day, isActive]) => (
                             <button
                                key={day}
                                type="button"
                                onClick={() => handleNestedChange('availability', day, !isActive)}
                                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                                   isActive 
                                   ? 'bg-green-600 text-white' 
                                   : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                                }`}
                             >
                                {day}
                             </button>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* ETAPE 4 */}
                {currentStep === 4 && (
                   <div className="space-y-6 text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                         <FileText size={32} />
                      </div>
                      <div>
                         <h3 className={`text-xl font-bold ${theme.textMain}`}>Tout est prêt !</h3>
                         <p className={`mt-2 ${theme.textSecondary}`}>
                            Veuillez confirmer les points ci-dessous pour valider.
                         </p>
                      </div>
                      
                      {/* CASES À COCHER OBLIGATOIRES */}
                      <div className={`p-6 rounded-lg text-left space-y-4 border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                         <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              id="terms" 
                              checked={formData.termsAccepted}
                              onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className={`text-sm cursor-pointer ${theme.textMain}`}>
                              Je certifie que les informations fournies sont exactes et que je dispose des compétences nécessaires.
                            </label>
                         </div>
                         <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              id="pricing" 
                              checked={formData.pricingAccepted}
                              onChange={(e) => handleInputChange('pricingAccepted', e.target.checked)}
                              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                            />
                            <label htmlFor="pricing" className={`text-sm cursor-pointer ${theme.textMain}`}>
                              Je m'engage à respecter les tarifs annoncés et à fournir un service de qualité.
                            </label>
                         </div>
                      </div>
                   </div>
                )}

                {/* Navigation */}
                <div className={`flex justify-between pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'}`}>
                  {currentStep > 1 ? (
                     <button type="button" onClick={prevStep} className={`px-6 py-2 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'}`}>
                        Retour
                     </button>
                  ) : (<div></div>)}
                  
                  {currentStep < 4 ? (
                     <button type="button" onClick={nextStep} disabled={!validateCurrentStep()} className={`px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 ${!validateCurrentStep() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Suivant <ChevronRight size={16} />
                     </button>
                  ) : (
                     <button 
                        type="submit" 
                        disabled={isSubmitting || !formData.termsAccepted || !formData.pricingAccepted} 
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 font-bold text-white transition-all
                           ${(isSubmitting || !formData.termsAccepted || !formData.pricingAccepted) 
                              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}`
                        }
                     >
                        {isSubmitting ? 'Envoi...' : 'Publier le service'}
                     </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Colonne Aperçu (Desktop) */}
          <div className={`hidden lg:block w-80`}>
            <ServicePreview />
          </div>

          {/* Aperçu Mobile (Overlay) */}
          {showPreview && (
             <div className="fixed inset-0 z-50 bg-black/80 lg:hidden flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                <div className="w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                   <ServicePreview />
                   <button className="w-full mt-4 py-3 bg-white text-black font-bold rounded-lg" onClick={() => setShowPreview(false)}>Fermer l'aperçu</button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PublierService;