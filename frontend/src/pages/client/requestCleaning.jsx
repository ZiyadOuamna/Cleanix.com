import React, { useState, useContext } from 'react';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, Check, AlertCircle,
  ChevronRight, Home, Briefcase, Zap, Building, Truck, Package,
  Wind, Droplets, Scissors, Brush, Sparkles, WindIcon as Fan
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
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    address: user?.address || '',
    squareMeters: '',
    numberOfRooms: '',
    preferredDate: '',
    preferredTime: '',
    duration: '2',
    frequency: 'once',
    specialRequests: '',
    paymentMethod: 'wallet'
  });

  const [quote, setQuote] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const services = [
    { 
      id: 'move', 
      name: 'Nettoyage de déménagement', 
      icon: Truck, 
      baseRate: 60, 
      description: 'Nettoyage après un déménagement', 
      color: 'from-orange-500 to-red-500',
      ratePerMeter: 3,
      ratePerRoom: 50
    },
    { 
      id: 'office', 
      name: 'Nettoyage bureau', 
      icon: Briefcase, 
      baseRate: 50, 
      description: 'Nettoyage d\'espaces professionnels', 
      color: 'from-blue-500 to-cyan-500',
      ratePerMeter: 2.5,
      ratePerRoom: 40
    },
    { 
      id: 'postwork', 
      name: 'Nettoyage post-travaux', 
      icon: Building, 
      baseRate: 70, 
      description: 'Nettoyage après rénovation/construction', 
      color: 'from-gray-500 to-gray-700',
      ratePerMeter: 4,
      ratePerRoom: 60
    },
    { 
      id: 'residential', 
      name: 'Nettoyage résidentiel', 
      icon: Home, 
      baseRate: 45, 
      description: 'Nettoyage régulier de votre domicile', 
      color: 'from-green-500 to-emerald-500',
      ratePerMeter: 2,
      ratePerRoom: 30
    },
    { 
      id: 'windows', 
      name: 'Nettoyage vitres', 
      icon: Wind, 
      baseRate: 40, 
      description: 'Nettoyage de vitres et baies vitrées', 
      color: 'from-cyan-500 to-blue-500',
      ratePerMeter: 3,
      ratePerRoom: 35
    },
    { 
      id: 'deep', 
      name: 'Nettoyage approfondi', 
      icon: Sparkles, 
      baseRate: 80, 
      description: 'Nettoyage en profondeur complet', 
      color: 'from-purple-500 to-pink-500',
      ratePerMeter: 5,
      ratePerRoom: 70
    }
  ];

  const frequencies = [
    { id: 'once', name: 'Ponctuel', discount: 0 },
    { id: 'weekly', name: 'Hebdomadaire', discount: 10 },
    { id: 'biweekly', name: 'Bi-hebdomadaire', discount: 15 },
    { id: 'monthly', name: 'Mensuel', discount: 20 }
  ];

  const durations = [
    { id: '2', name: '2 heures', hours: 2 },
    { id: '3', name: '3 heures', hours: 3 },
    { id: '4', name: '4 heures', hours: 4 },
    { id: '5', name: '5 heures', hours: 5 },
    { id: '6', name: '6 heures', hours: 6 },
    { id: 'custom', name: 'Personnalisée', hours: 0 }
  ];

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
    // Validation
    if (!formData.squareMeters || !formData.numberOfRooms) {
      showAlert('warning', 'Informations manquantes', 'Veuillez remplir la surface et le nombre de pièces');
      return;
    }

    const baseRate = selectedService.baseRate;
    const squareMeterPrice = parseFloat(formData.squareMeters) * selectedService.ratePerMeter;
    const roomPrice = parseFloat(formData.numberOfRooms) * selectedService.ratePerRoom;
    
    // Calcul de la durée
    const durationHours = formData.duration === 'custom' ? 
      (parseFloat(formData.customDuration) || 2) : 
      parseFloat(formData.duration);
    
    // Prix de base par heure
    const hourlyRate = baseRate * 0.5; // 50% du taux de base par heure
    
    // Calcul du total
    const baseSubtotal = squareMeterPrice + roomPrice + (hourlyRate * durationHours);
    
    // Appliquer réduction selon la fréquence
    const frequency = frequencies.find(f => f.id === formData.frequency);
    const discount = (baseSubtotal * frequency.discount) / 100;
    const subtotal = baseSubtotal - discount;
    
    // TVA 20%
    const tax = subtotal * 0.20;
    const total = subtotal + tax;

    setQuote({
      baseRate: selectedService.baseRate,
      squareMeterPrice: parseFloat(squareMeterPrice.toFixed(2)),
      roomPrice: parseFloat(roomPrice.toFixed(2)),
      hourlyRate: parseFloat(hourlyRate.toFixed(2)),
      durationHours,
      frequencyDiscount: frequency.discount,
      discountAmount: parseFloat(discount.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
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

    // Simulation de traitement
    setTimeout(() => {
      setIsProcessing(false);
      showAlert('success', 'Demande envoyée!', 
        'Votre demande a été envoyée aux freelancers disponibles. Vous serez notifié dès qu\'un freelancer l\'acceptera.');
      
      // Réinitialiser et rediriger
      setStep(1);
      setSelectedService(null);
      setQuote(null);
      
      // Rediriger vers les réservations
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    }, 2000);
  };

  return (
    <div className={`${theme.bgMain} min-h-screen py-4 sm:py-6`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme.textMain}`}>Demander un Service</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition ${
                s <= step 
                  ? 'bg-cyan-600 text-white' 
                  : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
              }`}>
                {s < step ? <Check size={20} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-cyan-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div>
            <h2 className={`text-xl font-semibold ${theme.textMain} mb-6 text-center`}>
              Choisissez un type de service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`${theme.bgCard} rounded-lg p-4 border ${theme.border} hover:border-cyan-500 transition cursor-pointer hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`bg-gradient-to-tr ${service.color} rounded-lg p-2 flex-shrink-0`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className={`font-bold ${theme.textMain} mb-1`}>{service.name}</h3>
                        <p className={`${theme.textMuted} text-xs mb-2`}>{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold text-cyan-600`}>
                            À partir de {service.baseRate}€
                          </span>
                          <ChevronRight size={16} className="text-cyan-600" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && selectedService && (
          <div className={`${theme.bgCard} rounded-xl p-4 sm:p-6 border ${theme.border}`}>
            <h2 className={`text-xl font-bold ${theme.textMain} mb-4`}>Détails du Service</h2>
            
            <div className="space-y-4">
              {/* Service Info */}
              <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg border ${theme.border}`}>
                <p className={`${theme.textMuted} text-xs mb-1`}>Service sélectionné</p>
                <p className={`font-semibold ${theme.textMain}`}>{selectedService.name}</p>
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  <MapPin size={14} className="inline mr-1" />
                  Adresse
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Entrez l'adresse complète du service"
                  rows="2"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Square Meters */}
                <div>
                  <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                    Surface (m²) *
                  </label>
                  <input
                    type="number"
                    name="squareMeters"
                    value={formData.squareMeters}
                    onChange={handleInputChange}
                    placeholder="Ex: 120"
                    min="10"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>

                {/* Number of Rooms */}
                <div>
                  <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                    <Users size={14} className="inline mr-1" />
                    Nombre de pièces *
                  </label>
                  <input
                    type="number"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    placeholder="Ex: 4"
                    min="1"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>
              </div>

              {/* When do you need the service */}
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>
                  Quand avez-vous besoin de ce service ?
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Preferred Date */}
                  <div>
                    <label className={`block text-xs ${theme.textMuted} mb-2`}>
                      Date préférée
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className={`block text-xs ${theme.textMuted} mb-2`}>
                      Heure préférée
                    </label>
                    <input
                      type="time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className={`block text-xs ${theme.textMuted} mb-2`}>
                    Durée estimée
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            duration: duration.id,
                            customDuration: duration.id === 'custom' ? '2' : ''
                          }));
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition ${
                          formData.duration === duration.id
                            ? 'border-cyan-600 bg-cyan-600 text-white'
                            : `${theme.border} ${theme.textMain} ${theme.hoverBg}`
                        }`}
                      >
                        {duration.name}
                      </button>
                    ))}
                  </div>
                  
                  {formData.duration === 'custom' && (
                    <div className="mt-3">
                      <input
                        type="number"
                        name="customDuration"
                        value={formData.customDuration || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e.target.value }))}
                        placeholder="Nombre d'heures"
                        min="1"
                        max="24"
                        className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                      />
                    </div>
                  )}
                </div>

                {/* Frequency */}
                <div>
                  <label className={`block text-xs ${theme.textMuted} mb-2`}>
                    Fréquence
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {frequencies.map((frequency) => (
                      <button
                        key={frequency.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, frequency: frequency.id }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition ${
                          formData.frequency === frequency.id
                            ? 'border-cyan-600 bg-cyan-600 text-white'
                            : `${theme.border} ${theme.textMain} ${theme.hoverBg}`
                        }`}
                      >
                        {frequency.name}
                        {frequency.discount > 0 && ` (-${frequency.discount}%)`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className={`block text-sm font-medium ${theme.textMain} mb-2`}>
                  Demandes spécifiques (optionnel)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Décrivez vos besoins spécifiques..."
                  rows="3"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} resize-none`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t ${theme.border}">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 px-4 py-3 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition text-sm font-medium`}
              >
                Retour
              </button>
              <button
                onClick={calculateQuote}
                className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium text-sm"
              >
                Voir le Devis
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Quote Review */}
        {step === 3 && quote && (
          <div className={`${theme.bgCard} rounded-xl p-4 sm:p-6 border ${theme.border}`}>
            <h2 className={`text-xl font-bold ${theme.textMain} mb-4`}>Votre Devis</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className={`text-sm ${theme.textMuted}`}>Service</span>
                <span className={`text-sm ${theme.textMain}`}>{selectedService.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className={`text-sm ${theme.textMuted}`}>Surface ({formData.squareMeters} m² × {selectedService.ratePerMeter}€)</span>
                <span className={`text-sm ${theme.textMain}`}>{quote.squareMeterPrice}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className={`text-sm ${theme.textMuted}`}>Pièces ({formData.numberOfRooms} × {selectedService.ratePerRoom}€)</span>
                <span className={`text-sm ${theme.textMain}`}>{quote.roomPrice}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className={`text-sm ${theme.textMuted}`}>Durée ({quote.durationHours}h × {quote.hourlyRate}€/h)</span>
                <span className={`text-sm ${theme.textMain}`}>{(quote.hourlyRate * quote.durationHours).toFixed(2)}€</span>
              </div>
              
              {quote.frequencyDiscount > 0 && (
                <div className="flex justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Réduction {frequencies.find(f => f.id === formData.frequency)?.name} (-{quote.frequencyDiscount}%)</span>
                  <span className={`text-sm text-green-600`}>-{quote.discountAmount}€</span>
                </div>
              )}
              
              <div className={`border-t ${theme.border} pt-3 flex justify-between`}>
                <span className={`font-medium ${theme.textMain}`}>Sous-total</span>
                <span className={`font-medium ${theme.textMain}`}>{quote.subtotal}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className={`text-sm ${theme.textMuted}`}>TVA (20%)</span>
                <span className={`text-sm ${theme.textMuted}`}>{quote.tax}€</span>
              </div>
              
              <div className={`border-t ${theme.border} pt-3 flex justify-between font-bold`}>
                <span className={`${theme.textMain}`}>Total à payer</span>
                <span className="text-cyan-600">{quote.total}€</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${theme.textMain} mb-3`}>Méthode de paiement</label>
              <div className="space-y-2">
                {[
                  { id: 'wallet', name: 'Portefeuille Cleanix', icon: '💰', description: `Solde disponible: ${user?.walletBalance || '0'}€` },
                  { id: 'card', name: 'Carte Bancaire', icon: '💳', description: 'Paiement sécurisé' },
                  { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Paiement rapide' },
                ].map(method => (
                  <label 
                    key={method.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                      formData.paymentMethod === method.id 
                        ? `border-cyan-600 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}` 
                        : theme.border
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{method.icon}</span>
                        <span className={`font-medium ${theme.textMain}`}>{method.name}</span>
                      </div>
                      <p className={`text-xs ${theme.textMuted} mt-1`}>{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-yellow-200'} mb-6 flex gap-3`}>
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs ${theme.textMuted}`}>
                  En soumettant votre demande, vous acceptez que les freelancers disponibles puissent consulter et accepter votre demande. 
                  Le paiement ne sera débité qu'après confirmation du freelancer et exécution du service.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className={`flex-1 px-4 py-3 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition text-sm font-medium`}
              >
                Modifier
              </button>
              <button
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Soumettre la demande
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