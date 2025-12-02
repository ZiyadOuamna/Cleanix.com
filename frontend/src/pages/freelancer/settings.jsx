import React, { useState, useContext, useRef } from 'react';
import { Settings, Shield, Clock, Lock, RefreshCw, User, Bell, Camera, FileText, CheckCircle, XCircle, Upload, Eye, EyeOff, CreditCard } from "react-feather";

// Si FreelancerContext est défini dans un autre fichier, assurez-vous de l'importer correctement
// Exemple: import { FreelancerContext } from '../../context/FreelancerContext';
// Pour l'instant, je vais créer un contexte temporaire pour que le code fonctionne

// Si vous n'avez pas encore créé FreelancerContext, voici une version temporaire :
const FreelancerContext = React.createContext();

const SettingsFreelancer = () => {
  // Utilisation du contexte - assurez-vous que FreelancerContext est fourni par un Provider dans votre app
  const { 
    user = { name: '', email: '', phone: '', specialty: '' }, 
    isDarkMode = false, 
    setIsDarkMode = () => {},
    isOnline = true,
    setIsOnline = () => {}
  } = useContext(FreelancerContext) || {};

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Nouvelles informations pour la vérification
    identityVerification: {
      cinNumber: '',
      cinFront: null,
      cinBack: null,
      selfiePhoto: null,
      status: 'unverified', // unverified, pending, verified, rejected
      verificationDate: null,
      rejectionReason: ''
    },
    
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      nationality: '',
      taxNumber: '',
      bankInfo: {
        bankName: '',
        accountNumber: '',
        iban: '',
        swift: ''
      }
    },
    
    notifications: {
      email: true,
      push: true,
      sms: false,
      newOrders: true,
      messages: true,
      promotions: true
    },
    
    privacy: {
      profileVisible: true,
      showEarnings: false,
      allowMessages: true,
      showPhoneNumber: false,
      showEmail: false,
      shareLocation: false
    },
    
    availability: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: false, start: '10:00', end: '16:00' },
      sunday: { active: false, start: '10:00', end: '16:00' }
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState(null);

  // Références pour les inputs files
  const cinFrontRef = useRef(null);
  const cinBackRef = useRef(null);
  const selfieRef = useRef(null);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedChange = (section, subSection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (fileType, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileUrl = reader.result;
      
      setFormData(prev => ({
        ...prev,
        identityVerification: {
          ...prev.identityVerification,
          [fileType]: {
            file: file,
            preview: fileUrl,
            uploadedAt: new Date().toISOString(),
            filename: file.name
          }
        }
      }));

      // Si tous les documents sont uploadés, passer en attente de vérification
      const { cinFront, cinBack, selfiePhoto } = formData.identityVerification;
      if (
        (fileType === 'cinFront' || cinFront) &&
        (fileType === 'cinBack' || cinBack) &&
        (fileType === 'selfiePhoto' || selfiePhoto) &&
        formData.identityVerification.status === 'unverified'
      ) {
        setFormData(prev => ({
          ...prev,
          identityVerification: {
            ...prev.identityVerification,
            status: 'pending'
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fileType) => {
    setFormData(prev => ({
      ...prev,
      identityVerification: {
        ...prev.identityVerification,
        [fileType]: null
      }
    }));
  };

  const submitVerification = () => {
    if (!formData.identityVerification.cinNumber) {
      alert('Veuillez saisir votre numéro de CIN');
      return;
    }

    if (!formData.identityVerification.cinFront || !formData.identityVerification.cinBack) {
      alert('Veuillez uploader les deux côtés de votre CIN');
      return;
    }

    if (!formData.identityVerification.selfiePhoto) {
      alert('Veuillez uploader votre selfie');
      return;
    }

    // Simuler l'envoi pour vérification
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Votre demande de vérification a été soumise. Notre équipe va la vérifier sous 24-48h.');
    }, 1500);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveMessage('Paramètres sauvegardés avec succès!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleResetPassword = () => {
    alert('Un email de réinitialisation a été envoyé à votre adresse.');
  };

  const handleExportData = () => {
    alert('Export de vos données démarré...');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      alert('Demande de suppression du compte enregistrée.');
    }
  };

  const getVerificationStatusBadge = () => {
    const { status } = formData.identityVerification;
    
    const statusConfig = {
      unverified: { text: 'Non vérifié', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircle size={16} /> },
      pending: { text: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: <Clock size={16} /> },
      verified: { text: 'Vérifié', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: <CheckCircle size={16} /> },
      rejected: { text: 'Rejeté', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircle size={16} /> }
    };

    const config = statusConfig[status] || statusConfig.unverified;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: User },
    { id: 'privacy', name: 'Confidentialité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'availability', name: 'Disponibilité', icon: Clock },
    { id: 'security', name: 'Sécurité', icon: Lock }
  ];

  // Classes conditionnelles pour le dark mode (comme vous l'avez demandé)
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const TabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Informations personnelles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Spécialité
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => handleInputChange(null, 'specialty', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  >
                    <option value="Nettoyage résidentiel">Nettoyage résidentiel</option>
                    <option value="Nettoyage bureau">Nettoyage bureau</option>
                    <option value="Nettoyage vitres">Nettoyage vitres</option>
                    <option value="Nettoyage après travaux">Nettoyage après travaux</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Préférences d'application</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${textClass}`}>Mode sombre</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Activer l'interface sombre</p>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${textClass}`}>Statut en ligne</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Apparaître comme disponible pour les nouvelles commandes</p>
                  </div>
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isOnline ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOnline ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            {/* Vérification d'identité */}
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${textClass} flex items-center gap-2`}>
                    <User size={20} />
                    Vérification d'identité
                  </h3>
                  <p className={`text-sm ${textSecondaryClass} mt-1`}>
                    Vérifiez votre identité pour accéder à toutes les fonctionnalités
                  </p>
                </div>
                {getVerificationStatusBadge()}
              </div>

              {formData.identityVerification.status === 'rejected' && (
                <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={18} className="text-red-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Vérification rejetée</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    Raison : {formData.identityVerification.rejectionReason || "Documents non valides"}
                  </p>
                </div>
              )}

              {formData.identityVerification.status === 'verified' && (
                <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Identité vérifiée</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Vérifiée le : {formData.identityVerification.verificationDate || "Date non disponible"}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Numéro de CIN */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Numéro de CIN / Passeport
                  </label>
                  <input
                    type="text"
                    value={formData.identityVerification.cinNumber}
                    onChange={(e) => handleInputChange('identityVerification', 'cinNumber', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="Ex: AA123456"
                  />
                </div>

                {/* Upload de documents */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Recto CIN */}
                  <div className="text-center">
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Recto CIN
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.identityVerification.cinFront 
                          ? `${isDarkMode ? 'border-green-700 bg-green-900/20' : 'border-green-300 bg-green-50'}` 
                          : `${borderClass} hover:border-green-500`
                      }`}
                      onClick={() => cinFrontRef.current?.click()}
                    >
                      {formData.identityVerification.cinFront?.preview ? (
                        <div className="space-y-2">
                          <img 
                            src={formData.identityVerification.cinFront.preview} 
                            alt="Recto CIN" 
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile('cinFront');
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload size={32} className={`mx-auto ${textSecondaryClass} mb-2`} />
                          <p className={`text-sm ${textSecondaryClass}`}>Cliquez pour uploader</p>
                        </div>
                      )}
                      <input
                        ref={cinFrontRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('cinFront', e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Verso CIN */}
                  <div className="text-center">
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Verso CIN
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.identityVerification.cinBack 
                          ? `${isDarkMode ? 'border-green-700 bg-green-900/20' : 'border-green-300 bg-green-50'}` 
                          : `${borderClass} hover:border-green-500`
                      }`}
                      onClick={() => cinBackRef.current?.click()}
                    >
                      {formData.identityVerification.cinBack?.preview ? (
                        <div className="space-y-2">
                          <img 
                            src={formData.identityVerification.cinBack.preview} 
                            alt="Verso CIN" 
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile('cinBack');
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload size={32} className={`mx-auto ${textSecondaryClass} mb-2`} />
                          <p className={`text-sm ${textSecondaryClass}`}>Cliquez pour uploader</p>
                        </div>
                      )}
                      <input
                        ref={cinBackRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('cinBack', e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="text-center">
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Selfie avec CIN
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.identityVerification.selfiePhoto 
                          ? `${isDarkMode ? 'border-green-700 bg-green-900/20' : 'border-green-300 bg-green-50'}` 
                          : `${borderClass} hover:border-green-500`
                      }`}
                      onClick={() => selfieRef.current?.click()}
                    >
                      {formData.identityVerification.selfiePhoto?.preview ? (
                        <div className="space-y-2">
                          <img 
                            src={formData.identityVerification.selfiePhoto.preview} 
                            alt="Selfie" 
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile('selfiePhoto');
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Camera size={32} className={`mx-auto ${textSecondaryClass} mb-2`} />
                          <p className={`text-sm ${textSecondaryClass}`}>Cliquez pour uploader</p>
                        </div>
                      )}
                      <input
                        ref={selfieRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('selfiePhoto', e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>

                {/* Informations personnelles supplémentaires */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Nationalité
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.nationality}
                      onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                      placeholder="Ex: Marocaine"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Genre
                    </label>
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    >
                      <option value="">Sélectionner</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                      Numéro fiscal
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.taxNumber}
                      onChange={(e) => handleInputChange('personalInfo', 'taxNumber', e.target.value)}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                      placeholder="Ex: 123456789"
                    />
                  </div>
                </div>

                {/* Informations bancaires */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-semibold ${textClass} flex items-center gap-2`}>
                      <CreditCard size={18} />
                      Informations bancaires
                    </h4>
                    <button
                      onClick={() => setShowBankInfo(!showBankInfo)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showBankInfo ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showBankInfo ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>

                  {showBankInfo && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                          Nom de la banque
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.bankInfo.bankName}
                          onChange={(e) => handleNestedChange('personalInfo', 'bankInfo', 'bankName', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          placeholder="Ex: Banque Populaire"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                          Numéro de compte
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.bankInfo.accountNumber}
                          onChange={(e) => handleNestedChange('personalInfo', 'bankInfo', 'accountNumber', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          placeholder="Ex: 1234567890"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.bankInfo.iban}
                          onChange={(e) => handleNestedChange('personalInfo', 'bankInfo', 'iban', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          placeholder="Ex: FR76 1234 5678 9012 3456 7890 123"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                          Code SWIFT/BIC
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.bankInfo.swift}
                          onChange={(e) => handleNestedChange('personalInfo', 'bankInfo', 'swift', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          placeholder="Ex: BPPOMAMC"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton de soumission */}
                {formData.identityVerification.status !== 'verified' && (
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={submitVerification}
                      disabled={isSaving || formData.identityVerification.status === 'pending'}
                      className={`px-6 py-2 bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isSaving || formData.identityVerification.status === 'pending'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-green-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Soumission...
                        </>
                      ) : formData.identityVerification.status === 'pending' ? (
                        'En attente de vérification'
                      ) : (
                        'Soumettre pour vérification'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paramètres de confidentialité */}
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Paramètres de confidentialité</h3>
              <div className="space-y-4">
                {Object.entries(formData.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${textClass} capitalize`}>
                        {key === 'profileVisible' && 'Profil visible'}
                        {key === 'showEarnings' && 'Afficher les gains'}
                        {key === 'allowMessages' && 'Autoriser les messages'}
                        {key === 'showPhoneNumber' && 'Afficher le téléphone'}
                        {key === 'showEmail' && "Afficher l'email"}
                        {key === 'shareLocation' && 'Partager la localisation'}
                      </p>
                      <p className={`text-sm ${textSecondaryClass}`}>
                        {key === 'profileVisible' && 'Votre profil apparaît dans les recherches'}
                        {key === 'showEarnings' && 'Les clients peuvent voir vos revenus'}
                        {key === 'allowMessages' && 'Les clients peuvent vous envoyer des messages'}
                        {key === 'showPhoneNumber' && 'Afficher votre numéro de téléphone publiquement'}
                        {key === 'showEmail' && "Afficher votre email publiquement"}
                        {key === 'shareLocation' && 'Partager votre localisation approximative'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('privacy', key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Export et suppression de données */}
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Données et confidentialité</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className={`w-full text-left px-4 py-3 border ${borderClass} rounded-lg hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}
                >
                  <p className={`font-medium ${textClass}`}>Exporter mes données</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Télécharger une copie de vos données personnelles</p>
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className={`w-full text-left px-4 py-3 border ${isDarkMode ? 'border-red-800' : 'border-red-200'} rounded-lg hover:${isDarkMode ? 'bg-red-900' : 'bg-red-50'} transition ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                >
                  <p className="font-medium">Supprimer mon compte</p>
                  <p className="text-sm">Supprimer définitivement votre compte et toutes vos données</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Types de notifications</h3>
              <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${textClass} capitalize`}>
                        {key === 'email' && 'Notifications email'}
                        {key === 'push' && 'Notifications push'}
                        {key === 'sms' && 'Notifications SMS'}
                        {key === 'newOrders' && 'Nouvelles commandes'}
                        {key === 'messages' && 'Messages clients'}
                        {key === 'promotions' && 'Promotions et offres'}
                      </p>
                      <p className={`text-sm ${textSecondaryClass}`}>
                        {key === 'newOrders' && 'Recevoir des alertes pour les nouvelles commandes'}
                        {key === 'messages' && 'Notifications lors de nouveaux messages'}
                        {key === 'promotions' && 'Offres spéciales et promotions'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('notifications', key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Disponibilités hebdomadaires</h3>
              <div className="space-y-4">
                {Object.entries(formData.availability).map(([day, schedule]) => {
                  const dayNames = {
                    monday: 'Lundi',
                    tuesday: 'Mardi',
                    wednesday: 'Mercredi',
                    thursday: 'Jeudi',
                    friday: 'Vendredi',
                    saturday: 'Samedi',
                    sunday: 'Dimanche'
                  };

                  return (
                    <div key={day} className={`flex items-center justify-between p-4 border ${borderClass} rounded-lg`}>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleNestedChange('availability', day, 'active', !schedule.active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            schedule.active ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              schedule.active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`font-medium ${schedule.active ? textClass : 'text-gray-400'}`}>
                          {dayNames[day]}
                        </span>
                      </div>
                      
                      {schedule.active && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => handleNestedChange('availability', day, 'start', e.target.value)}
                            className={`px-2 py-1 border ${borderClass} rounded focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          />
                          <span className={textSecondaryClass}>-</span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleNestedChange('availability', day, 'end', e.target.value)}
                            className={`px-2 py-1 border ${borderClass} rounded focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Sécurité du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>

            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Sessions actives</h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 border ${borderClass} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${textClass}`}>Session actuelle</p>
                    <p className="text-sm text-gray-500">Paris, France • Navigateur Chrome</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
                </div>
                <div className={`flex items-center justify-between p-3 border ${borderClass} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${textClass}`}>Mobile Android</p>
                    <p className="text-sm text-gray-500">Lyon, France • Il y a 2 jours</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${bgClass} min-h-screen py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar des onglets */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} p-4`}>
              <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Paramètres</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : `${textSecondaryClass} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass}`}>
              <div className={`p-6 border-b ${borderClass}`}>
                <h1 className={`text-2xl font-bold ${textClass}`}>
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h1>
                <p className={`${textSecondaryClass} mt-1`}>
                  Gérez vos préférences et paramètres de compte
                </p>
              </div>

              <div className="p-6">
                <TabContent />
              </div>

              {/* Boutons d'action */}
              <div className={`p-6 border-t ${borderClass} ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} rounded-b-xl`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    {saveMessage && (
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {saveMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          specialty: user?.specialty || ''
                        });
                      }}
                      className={`px-6 py-2 border ${borderClass} ${textSecondaryClass} rounded-lg hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsFreelancer;