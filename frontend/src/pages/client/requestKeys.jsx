import React, { useState, useContext } from 'react';
import { 
  ArrowLeft, Key, User, Phone, MapPin, Clock, Copy, Check, AlertCircle
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';

const RequestKeys = ({ onBack }) => {
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

  // Helper pour SweetAlert2 avec thème dark/light
  const showAlert = (config) => {
    const swalConfig = {
      ...config,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      confirmButtonColor: config.confirmButtonColor || '#0891b2',
      cancelButtonColor: config.cancelButtonColor || '#6b7280',
    };
    return Swal.fire(swalConfig);
  };

  // Generate unique ID with format LOC-YYYY-CIN
  const generateRequestId = () => {
    const year = new Date().getFullYear();
    const cin = user?.cin || Math.random().toString(36).substring(7).toUpperCase();
    return `LOC-${year}-${cin}`;
  };

  const requestId = generateRequestId();

  const [formData, setFormData] = useState({
    fullName: user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : '',
    phone: user?.telephone || '',
    email: user?.email || '',
    address: user?.address || '',
    operationType: 'remise', // remise (delivery) or recuperation (pickup)
    preferredDate: '',
    preferredTime: '',
    keyDescription: '',
    quantity: 1,
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.preferredDate || !formData.preferredTime) {
      showAlert({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    setIsProcessing(true);

    // Simulation API call
    setTimeout(() => {
      setIsProcessing(false);
      setRequestSubmitted(true);
      
      showAlert({
        icon: 'success',
        title: 'Demande Confirmée!',
        html: `
          <div class="text-left">
            <p class="mb-3"><strong>Numéro de demande:</strong> <span class="text-cyan-600 font-mono">${requestId}</span></p>
            <p class="mb-3"><strong>Type d'opération:</strong> ${formData.operationType === 'remise' ? 'Remise des clés' : 'Récupération des clés'}</p>
            <p class="mb-3"><strong>Date:</strong> ${formData.preferredDate}</p>
            <p class="mb-3"><strong>Heure:</strong> ${formData.preferredTime}</p>
            <p class="text-sm text-gray-500 mt-4">Vous recevrez une confirmation par SMS et email.</p>
          </div>
        `,
      }).then(() => {
        onBack();
      });
    }, 1500);
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId);
    showAlert({
      icon: 'success',
      title: 'Copié!',
      text: 'Le numéro de demande a été copié au presse-papiers',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (requestSubmitted) {
    return (
      <div className={`${theme.bgMain} min-h-screen p-4 sm:p-6`}>
        <div className="max-w-2xl mx-auto">
          <div className={`${theme.bgCard} rounded-xl p-8 border ${theme.border} text-center`}>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className={`text-2xl font-bold ${theme.textMain} mb-2`}>Demande Confirmée</h2>
              <p className={theme.textMuted}>Votre demande de clés a été enregistrée avec succès</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-6 mb-6 border ${theme.border}`}>
              <p className={`${theme.textMuted} text-sm mb-2`}>Numéro de suivi</p>
              <div className="flex items-center justify-center gap-3">
                <p className={`text-3xl font-mono font-bold text-cyan-600`}>{requestId}</p>
                <button
                  onClick={copyRequestId}
                  className="p-2 hover:bg-cyan-600 hover:text-white rounded-lg transition"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className={`space-y-3 mb-8 text-left ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Opération:</span>
                <span className={theme.textMain}>{formData.operationType === 'remise' ? 'Remise des clés' : 'Récupération des clés'}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Date:</span>
                <span className={theme.textMain}>{formData.preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Heure:</span>
                <span className={theme.textMain}>{formData.preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textMuted}>Adresse:</span>
                <span className={theme.textMain}>{formData.address}</span>
              </div>
            </div>

            <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg border ${theme.border} mb-8 flex gap-3`}>
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className={`text-sm ${theme.textMuted}`}>
                  Un préposé vous contactera pour confirmer le rendez-vous. Vous recevrez aussi une notification par SMS et email.
                </p>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold"
            >
              Retour au Tableau de Bord
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Demander un Service de Clés</h1>
      </div>

      {/* Main Form */}
      <div className={`max-w-3xl mx-auto ${theme.bgCard} rounded-xl p-8 border ${theme.border}`}>
        
        {/* Auto-Generated Request ID */}
        <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-cyan-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-cyan-200'}`}>
          <p className={`text-sm ${theme.textMuted} mb-2`}>Numéro de demande (généré automatiquement)</p>
          <div className="flex items-center justify-between">
            <p className={`text-2xl font-mono font-bold text-cyan-600`}>{requestId}</p>
            <button
              onClick={copyRequestId}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-600 hover:text-white transition"
            >
              <Copy size={16} />
              <span className="text-sm">Copier</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type d'opération */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-4`}>Type d'opération *</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'remise', label: 'Remise des clés', icon: '📮', desc: 'Je souhaite déposer mes clés' },
                { id: 'recuperation', label: 'Récupération des clés', icon: '🔑', desc: 'Je souhaite récupérer mes clés' }
              ].map(option => (
                <label
                  key={option.id}
                  className={`relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                    formData.operationType === option.id
                      ? `border-cyan-600 ${isDarkMode ? 'bg-gray-700' : 'bg-cyan-50'}`
                      : theme.border
                  }`}
                >
                  <input
                    type="radio"
                    name="operationType"
                    value={option.id}
                    checked={formData.operationType === option.id}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-2xl mb-2 block">{option.icon}</span>
                    <p className={`font-semibold ${theme.textMain}`}>{option.label}</p>
                    <p className={`text-xs ${theme.textMuted}`}>{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Nom complet (non modifiable) */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              <User size={16} className="inline mr-2" />
              Nom complet (par défaut) *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              disabled
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} opacity-75 cursor-not-allowed`}
            />
            <p className={`text-xs ${theme.textMuted} mt-1`}>Ce champ est pré-rempli avec vos informations de compte et ne peut pas être modifié</p>
          </div>

          {/* Email et Téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <Phone size={16} className="inline mr-2" />
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="06 XX XX XX XX"
                required
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              <MapPin size={16} className="inline mr-2" />
              Adresse *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Adresse complète du lieu de rendez-vous"
              required
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
            />
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                Date préférée *
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
                <Clock size={16} className="inline mr-2" />
                Heure préférée *
              </label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              />
            </div>
          </div>

          {/* Description des clés */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              <Key size={16} className="inline mr-2" />
              Description des clés
            </label>
            <input
              type="text"
              name="keyDescription"
              value={formData.keyDescription}
              onChange={handleInputChange}
              placeholder="Ex: Clés de la porte principale, clés du garage..."
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
            />
          </div>

          {/* Quantité */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              Nombre de jeux de clés
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              max="10"
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
            />
          </div>

          {/* Notes supplémentaires */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              Notes supplémentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Toute information importante pour le préposé..."
              rows="4"
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
            />
          </div>

          {/* Info Box */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-yellow-200'} flex gap-3`}>
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className={`text-sm font-semibold ${theme.textMain} mb-2`}>Information importante</p>
              <p className={`text-sm ${theme.textMuted}`}>
                Le numéro de demande <strong className="text-cyan-600 font-mono">{requestId}</strong> ne peut pas être modifié. 
                Veuillez le conserver précieusement. Il vous servira à suivre votre demande.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={onBack}
              className={`flex-1 px-6 py-3 rounded-lg border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Soumettre la Demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Pricing Info */}
      <div className={`max-w-3xl mx-auto mt-6 ${theme.bgCard} rounded-xl p-6 border ${theme.border}`}>
        <h3 className={`font-semibold ${theme.textMain} mb-4`}>Tarifs des services de clés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <p className={`font-semibold ${theme.textMain} mb-2`}>📮 Remise des clés</p>
            <p className="text-2xl font-bold text-cyan-600 mb-2">50 DH</p>
            <p className={`text-sm ${theme.textMuted}`}>Par visite</p>
          </div>
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <p className={`font-semibold ${theme.textMain} mb-2`}>🔑 Récupération des clés</p>
            <p className="text-2xl font-bold text-cyan-600 mb-2">50 DH</p>
            <p className={`text-sm ${theme.textMuted}`}>Par visite</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestKeys;
