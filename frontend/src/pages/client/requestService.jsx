import React, { useState, useContext, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, Check, AlertCircle,
  ChevronRight, Home, Briefcase, Zap, Loader
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const RequestService = ({ onBack }) => {
  const { user, isDarkMode } = useContext(ClientContext);
  
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
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    serviceType: '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    squareMeters: '',
    numberOfRooms: '',
    preferredDate: '',
    preferredTime: '',
    specialRequests: '',
    paymentMethod: 'card',
    preferredFreelancerGender: 'Pas de preference'
  });

  const [quote, setQuote] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les services disponibles depuis l'API
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/services/categories');
      
      if (response.data && response.data.success && response.data.data) {
        // Transformer les catégories en services avec icônes et couleurs
        const servicesData = response.data.data.map((category, index) => {
          const icons = [Home, Briefcase, Zap];
          const colors = [
            'from-blue-500 to-cyan-500',
            'from-green-500 to-emerald-500',
            'from-orange-500 to-red-500',
            'from-cyan-500 to-blue-500'
          ];
          
          return {
            id: category.id || category.name.toLowerCase().replace(/\s+/g, '-'),
            name: category.name,
            icon: icons[index % icons.length],
            price: 80 + (index * 20), // Prix par défaut augmentant
            description: `Service de ${category.name}`,
            color: colors[index % colors.length],
            availableDate: category.available_date || new Date().toISOString().split('T')[0]
          };
        });
        
        setServices(servicesData);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Services indisponibles',
        text: 'Impossible de charger les services. Veuillez réessayer.',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData(prev => ({ ...prev, serviceType: service.name }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateQuote = () => {
    if (!formData.squareMeters || !formData.numberOfRooms) {
      Swal.fire({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Veuillez remplir tous les champs obligatoires',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
      return;
    }

    const basePrice = selectedService.price;
    const squareMeterPrice = parseFloat(formData.squareMeters) * 5; // 5DH par m²
    const roomMultiplier = parseFloat(formData.numberOfRooms) * 100; // 100DH par pièce
    const subtotal = basePrice + squareMeterPrice + roomMultiplier;
    const tax = subtotal * 0.20; // 20% TVA
    const total = subtotal + tax;

    setQuote({
      basePrice,
      squareMeterPrice: parseFloat(squareMeterPrice.toFixed(2)),
      roomMultiplier: parseFloat(roomMultiplier.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    });

    setStep(3);
  };

  const handleConfirmAndPay = async () => {
    // Validation des champs obligatoires
    if (!formData.address || !formData.city || !formData.preferredDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Veuillez remplir tous les champs obligatoires (adresse, ville, date)',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
      return;
    }

    // Valider que la date est au moins demain ou aujourd'hui
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      Swal.fire({
        icon: 'warning',
        title: 'Date invalide',
        text: 'La date doit être aujourd\'hui ou dans le futur',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Pas de token d\'authentification trouvé');
      }

      // Préparer les données pour l'API
      // Déterminer l'horaire préféré basé sur l'heure saisie
      let horairePrefere = null;
      if (formData.preferredTime) {
        const hour = parseInt(formData.preferredTime.split(':')[0]);
        if (hour >= 6 && hour < 12) {
          horairePrefere = 'Matin';
        } else if (hour >= 12 && hour < 17) {
          horairePrefere = 'Apres-midi';
        } else if (hour >= 17) {
          horairePrefere = 'Soir';
        }
      }

      const orderData = {
        service_type: selectedService.name,
        description: formData.specialRequests,
        adresse: formData.address,
        ville: formData.city,
        code_postal: formData.postalCode || '',
        square_meters: formData.squareMeters ? parseFloat(formData.squareMeters) : null,
        number_of_rooms: formData.numberOfRooms ? parseInt(formData.numberOfRooms) : null,
        horaire_prefere: horairePrefere,
        genre_freelancer_prefere: formData.preferredFreelancerGender,
        initial_price: quote.total,
        scheduled_date: formData.preferredDate, // Format: YYYY-MM-DD
        notes_speciales: formData.specialRequests
      };

      // Appel API pour créer la commande
      const response = await axios.post(
        'http://localhost:8000/api/orders',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Commande Confirmée!',
          text: `Votre commande pour "${selectedService.name}" a été créée avec succès. Le freelancer recevra votre demande dans quelques instants.`,
          confirmButtonColor: '#0891b2',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1f2937',
        }).then(() => {
          setIsProcessing(false);
          // Réinitialiser le formulaire
          setStep(1);
          setSelectedService(null);
          setQuote(null);
          setFormData({
            serviceType: '',
            address: user?.address || '',
            city: '',
            postalCode: '',
            squareMeters: '',
            numberOfRooms: '',
            preferredDate: '',
            preferredTime: '',
            specialRequests: '',
            paymentMethod: 'card',
            preferredFreelancerGender: 'Pas de preference'
          });
          onBack();
        });
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Erreur lors de la création de la commande:', error);
      
      let errorMessage = 'Erreur lors de la création de la commande';
      
      // Afficher les erreurs de validation si disponibles
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorList = Object.keys(validationErrors)
          .map(field => `${field}: ${validationErrors[field].join(', ')}`)
          .join('\n');
        errorMessage = 'Erreurs de validation:\n' + errorList;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
    }
  };

  return (
    <div className={`${theme.bgMain} min-h-screen p-4 sm:p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Demander un Service</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
              s <= step 
                ? 'bg-cyan-600 text-white' 
                : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
            }`}>
              {s < step ? <Check size={20} /> : s}
            </div>
            {s < 4 && <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-cyan-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <>
          {loadingServices ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Loader className="animate-spin mx-auto mb-4 text-cyan-600" size={40} />
                <p className={`${theme.textMuted}`}>Chargement des services...</p>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 text-yellow-600" size={40} />
                <p className={`${theme.textMain}`}>Aucun service disponible pour le moment</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`${theme.bgCard} rounded-xl p-6 border-2 ${theme.border} hover:border-cyan-500 transition cursor-pointer transform hover:scale-105`}
                  >
                    <div className={`bg-gradient-to-tr ${service.color} rounded-lg p-4 mb-4 w-fit`}>
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${theme.textMain} mb-2`}>{service.name}</h3>
                    <p className={`${theme.textMuted} text-sm mb-4`}>{service.description}</p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-2 text-cyan-600" />
                        <span className={theme.textMuted}>Disponible: {new Date(service.availableDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold text-cyan-600`}>{service.price}DH</span>
                      <ChevronRight size={20} className="text-cyan-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Step 2: Service Details */}
      {step === 2 && selectedService && (
        <div className={`max-w-2xl mx-auto ${theme.bgCard} rounded-xl p-8 border ${theme.border}`}>
          <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Détails du Service</h2>
          
          <div className="space-y-6">
            {/* Service Info */}
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg border ${theme.border}`}>
              <p className={`${theme.textMuted} text-sm mb-2`}>Service sélectionné</p>
              <p className={`text-xl font-semibold ${theme.textMain}`}>{selectedService.name}</p>
            </div>

            {/* Address */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <MapPin size={16} className="inline mr-2" />
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Votre adresse complète"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* City */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ex: Casablanca"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Code Postal
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Ex: 20000"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Square Meters */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Surface (m²)
              </label>
              <input
                type="number"
                name="squareMeters"
                value={formData.squareMeters}
                onChange={handleInputChange}
                placeholder="Ex: 120"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Number of Rooms */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <Users size={16} className="inline mr-2" />
                Nombre de pièces
              </label>
              <input
                type="number"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleInputChange}
                placeholder="Ex: 4"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Preferred Gender */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Préférence Genre du Freelancer
              </label>
              <select
                name="preferredFreelancerGender"
                value={formData.preferredFreelancerGender}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              >
                <option value="Pas de preference">Pas de préférence</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <Calendar size={16} className="inline mr-2" />
                Date préférée *
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <Clock size={16} className="inline mr-2" />
                Heure préférée
              </label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Demandes spéciales
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Décrivez vos demandes spéciales..."
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className={`flex-1 px-6 py-3 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              Précédent
            </button>
            <button
              onClick={calculateQuote}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold"
            >
              Voir le Devis
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quote Review */}
      {step === 3 && quote && (
        <div className={`max-w-2xl mx-auto ${theme.bgCard} rounded-xl p-8 border ${theme.border}`}>
          <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Devis</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className={theme.textMuted}>Prix de base ({selectedService.name})</span>
              <span className={theme.textMain}>{quote.basePrice}DH</span>
            </div>
            <div className="flex justify-between">
              <span className={theme.textMuted}>Surface ({formData.squareMeters} m² × 5DH)</span>
              <span className={theme.textMain}>{quote.squareMeterPrice}DH</span>
            </div>
            <div className="flex justify-between">
              <span className={theme.textMuted}>Pièces ({formData.numberOfRooms} × 100DH)</span>
              <span className={theme.textMain}>{quote.roomMultiplier}DH</span>
            </div>
            <div className={`border-t ${theme.border} pt-4 flex justify-between`}>
              <span className={theme.textMuted}>Sous-total</span>
              <span className={theme.textMain}>{quote.subtotal}DH</span>
            </div>
            <div className="flex justify-between">
              <span className={theme.textMuted}>TVA (20%)</span>
              <span className={theme.textMain}>{quote.tax}DH</span>
            </div>
            <div className={`border-t ${theme.border} pt-4 flex justify-between font-bold text-lg`}>
              <span className={theme.textMain}>Total</span>
              <span className="text-cyan-600">{quote.total}DH</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold ${theme.textMain} mb-4`}>Méthode de paiement</label>
            <div className="space-y-3">
              {[
                { id: 'card', name: 'Carte Bancaire', icon: '💳' },
                { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                { id: 'transfer', name: 'Virement Bancaire', icon: '🏦' },
              ].map(method => (
                <label key={method.id} className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                  formData.paymentMethod === method.id 
                    ? `border-cyan-600 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}` 
                    : theme.border
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <span className={theme.textMain}>{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-yellow-200'} mb-8 flex gap-3`}>
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className={`text-sm ${theme.textMuted}`}>
                En confirmant votre commande, vous acceptez les conditions d'utilisation et le freelancer recevra votre demande immédiatement.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className={`flex-1 px-6 py-3 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              Précédent
            </button>
            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirmer et Payer {quote.total}DH
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestService;
