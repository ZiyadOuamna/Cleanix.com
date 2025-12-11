import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Settings, Shield, Clock, Lock, RefreshCw, User, Bell, Camera, CheckCircle, XCircle, Upload, Eye, EyeOff, CreditCard, Mail, AtSign, Loader } from "react-feather";

// Assurez-vous que le chemin d'import est correct vers votre fichier context
import { FreelancerContext } from './freelancerContext';
import { 
  sendVerificationEmail as sendVerificationEmailAPI,
  confirmEmailCode as confirmEmailCodeAPI,
  updatePassword as updatePasswordAPI,
  updateNotificationSettings,
  updatePrivacySettings,
  updateAvailabilitySettings,
  updateBankInfo,
  getSettings,
  uploadIdentityDocuments
} from '../../services/settingsService';

const SettingsFreelancer = () => {
  const { 
    user = { name: '', email: '', phone: '', specialty: '' }, 
    isDarkMode, // Récupéré du contexte global
    isOnline = true,
    setIsOnline = () => {},
    setIsAccountActive
  } = useContext(FreelancerContext);

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    
    emailVerification: {
      verified: false,
      verificationCode: '',
      codeSent: false,
      verificationSent: false,
      verificationDate: null
    },
    
    identityVerification: {
      cinNumber: '',
      cinFront: null,
      cinBack: null,
      selfiePhoto: null,
      status: 'unverified',
      verificationDate: null,
      rejectionReason: '',
      submittedToSupervisor: false,
      supervisorStatus: 'pending' 
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
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  const cinFrontRef = useRef(null);
  const cinBackRef = useRef(null);
  const selfieRef = useRef(null);

  // Charger les données du profil utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Si l'utilisateur existe dans le contexte, mettre à jour les données
        if (user) {
          const userData = {
            name: user.name || `${user.prenom || ''} ${user.nom || ''}`.trim() || '',
            email: user.email || '',
            phone: user.telephone || user.phone || '',
            specialty: user.specialty || 'Non spécifié'
          };
          
          setFormData(prev => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            specialty: userData.specialty,
            personalInfo: {
              ...prev.personalInfo,
              dateOfBirth: user.date_of_birth || user.dateOfBirth || '',
              nationality: user.nationality || '',
              gender: user.gender || '',
              taxNumber: user.tax_number || user.taxNumber || ''
            },
            // Les paramètres de notification et confidentialité sont généralement gérés par l'utilisateur
            // donc on les laisse avec les valeurs par défaut sauf s'ils sont fournis par le serveur
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // --- THÈME "EYE-FRIENDLY" (Anti-Fatigue) ---
  const theme = {
    // FOND GLOBAL : 
    // Mode Clair : Slate-50 (Gris bleuté très pâle, aspect papier) -> Reposant
    // Mode Sombre : Gray-900 (Classique sombre)
    bg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    
    // CARTES :
    // Mode Clair : Blanc pur pour garder la hiérarchie, mais posé sur du gris
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    
    // TEXTE :
    // Mode Clair : Slate-700 (Gris anthracite) -> Moins agressif que le noir pur (#000)
    textMain: isDarkMode ? 'text-gray-100' : 'text-slate-700',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-500',
    
    // BORDURES :
    // Très subtiles en mode clair
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    
    // INPUTS (Champs de saisie) :
    // Mode Clair : Slate-100 (Gris très clair) -> Évite le "flash" blanc des inputs
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-slate-300',
    inputText: isDarkMode ? 'text-white' : 'text-slate-800',
    
    // NAVIGATION :
    navActive: isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-white text-green-700 shadow-sm border border-slate-200',
    navInactive: isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-500 hover:bg-slate-200'
  };

  const handleInputChange = useCallback((section, field, value) => {
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
  }, []);

  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save profile info
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty
      };
      
      // Only call API if we have profile data to save
      if (profileData.name || profileData.email || profileData.phone) {
        const { updateUserProfile } = await import('../../services/authService');
        await updateUserProfile(profileData);
      }

      // Save notification settings
      if (formData.notifications && Object.keys(formData.notifications).length > 0) {
        await updateNotificationSettings(formData.notifications);
      }

      // Save privacy settings
      if (formData.privacy && Object.keys(formData.privacy).length > 0) {
        await updatePrivacySettings(formData.privacy);
      }

      // Save availability settings
      if (formData.availability && Object.keys(formData.availability).length > 0) {
        await updateAvailabilitySettings(formData.availability);
      }

      // Save bank info if provided
      if (formData.personalInfo?.bankInfo && Object.keys(formData.personalInfo.bankInfo).some(k => formData.personalInfo.bankInfo[k])) {
        await updateBankInfo(formData.personalInfo.bankInfo);
      }

      setIsSaving(false);
      Swal.fire({
        icon: 'success',
        title: 'Enregistré!',
        text: 'Tous vos paramètres ont été sauvegardés avec succès!',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving settings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error?.response?.data?.message || 'Erreur lors de la sauvegarde des paramètres',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  }, [formData, isDarkMode]);

  const handleNestedChange = useCallback((section, subSection, field, value) => {
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
  }, []);

  const handleFileUpload = useCallback((fileType, file) => {
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

      const { cinFront, cinBack, selfiePhoto } = formData.identityVerification;
      const currentFiles = {
          cinFront: fileType === 'cinFront' ? true : !!cinFront,
          cinBack: fileType === 'cinBack' ? true : !!cinBack,
          selfiePhoto: fileType === 'selfiePhoto' ? true : !!selfiePhoto
      };
      
      const hasAllDocs = Object.values(currentFiles).every(Boolean);

      if (hasAllDocs && formData.identityVerification.status === 'unverified') {
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
  }, [formData.identityVerification]);

  const removeFile = useCallback((fileType) => {
    setFormData(prev => ({
      ...prev,
      identityVerification: {
        ...prev.identityVerification,
        [fileType]: null
      }
    }));
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!formData.email) {
      Swal.fire({
        icon: 'error',
        title: 'Email manquant',
        text: 'Veuillez saisir votre email',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await sendVerificationEmailAPI(formData.email);
      
      setFormData(prev => ({
        ...prev,
        emailVerification: {
          ...prev.emailVerification,
          codeSent: true
        }
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'Code envoyé!',
        html: `Un code de vérification a été envoyé à <strong>${formData.email}</strong>`,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'envoyer le code',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData.email, isDarkMode]);

  const verifyEmailCode = useCallback(async () => {
    if (!emailCode) {
      Swal.fire({
        icon: 'error',
        title: 'Code manquant',
        text: 'Veuillez saisir le code de vérification',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await confirmEmailCodeAPI(emailCode, formData.email);
      
      setFormData(prev => ({
        ...prev,
        emailVerification: {
          ...prev.emailVerification,
          verified: true,
          verificationDate: new Date().toISOString()
        }
      }));
      
      setEmailCode('');
      
      Swal.fire({
        icon: 'success',
        title: 'Email vérifié!',
        text: 'Votre adresse email a été vérifiée avec succès.',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: error.response?.data?.message || 'Le code saisi est incorrect',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setIsSaving(false);
    }
  }, [emailCode, formData.email, isDarkMode]);

  const submitVerificationToSupervisor = useCallback(async () => {
    if (!formData.emailVerification.verified) {
      Swal.fire({
        icon: 'error',
        title: 'Email non vérifié',
        text: 'Veuillez vérifier votre email avant de soumettre',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    if (!formData.identityVerification.cinNumber) {
      Swal.fire({
        icon: 'error',
        title: 'CIN manquant',
        text: 'Veuillez saisir votre numéro de CIN',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    if (!formData.identityVerification.cinFront || !formData.identityVerification.cinBack) {
      Swal.fire({
        icon: 'error',
        title: 'Documents manquants',
        text: 'Veuillez uploader les deux côtés de votre CIN',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    if (!formData.identityVerification.selfiePhoto) {
      Swal.fire({
        icon: 'error',
        title: 'Selfie manquant',
        text: 'Veuillez uploader votre selfie',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Upload des documents d'identité
      const formDataUpload = new FormData();
      if (formData.identityVerification.cinFront) {
        formDataUpload.append('cin_front', formData.identityVerification.cinFront);
      }
      if (formData.identityVerification.cinBack) {
        formDataUpload.append('cin_back', formData.identityVerification.cinBack);
      }
      if (formData.identityVerification.selfiePhoto) {
        formDataUpload.append('selfie', formData.identityVerification.selfiePhoto);
      }
      
      const response = await uploadIdentityDocuments(
        formData.identityVerification.cinNumber,
        formDataUpload
      );
      
      setFormData(prev => ({
        ...prev,
        identityVerification: {
          ...prev.identityVerification,
          submittedToSupervisor: true,
          supervisorStatus: 'pending',
          status: 'pending'
        }
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'Envoyé au superviseur!',
        html: `
          <div style="text-align: left;">
            <p><strong>Vos informations ont été envoyées au superviseur :</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
              <li>✓ Email vérifié: ${formData.email}</li>
              <li>✓ Numéro CIN: ${formData.identityVerification.cinNumber}</li>
              <li>✓ Documents d'identité uploadés</li>
              <li>✓ Selfie avec CIN uploadé</li>
              <li>✓ Informations personnelles complétées</li>
            </ul>
            <p style="margin-top: 15px;">Le superviseur va vérifier vos informations sous 24-48h.</p>
          </div>
        `,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        width: 500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de soumettre les documents',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, isDarkMode]);

  const getEmailVerificationBadge = () => {
    const { verified } = formData.emailVerification;
    
    if (verified) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle size={16} />
          Email vérifié
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <Clock size={16} />
          Email non vérifié
        </span>
      );
    }
  };

  const getVerificationStatusBadge = () => {
    const { status, supervisorStatus } = formData.identityVerification;
    
    const statusConfig = {
      unverified: { text: 'Non vérifié', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircle size={16} /> },
      pending: { text: 'En attente de vérification', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: <Clock size={16} /> },
      verified: { text: 'Vérifié et actif', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: <CheckCircle size={16} /> },
      rejected: { text: 'Rejeté', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircle size={16} /> }
    };

    const config = statusConfig[status] || statusConfig.unverified;
    
    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
          {config.icon}
          {config.text}
        </span>
        {supervisorStatus === 'pending' && (
          <span className={`text-xs ${theme.textSecondary}`}>
            En attente de validation par le superviseur
          </span>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: User },
    { id: 'privacy', name: 'Confidentialité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'availability', name: 'Disponibilité', icon: Clock },
    { id: 'security', name: 'Sécurité', icon: Lock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Informations personnelles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Nom complet', field: 'name', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Téléphone', field: 'phone', type: 'tel' }
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={formData[field]}
                      onChange={(e) => {
                        handleInputChange(null, field, e.target.value);
                        if (field === 'email') {
                          setFormData(prev => ({
                            ...prev,
                            emailVerification: {
                              ...prev.emailVerification,
                              verified: false,
                              codeSent: false
                            }
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText} transition-colors`}
                    />
                  </div>
                ))}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Spécialité
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => handleInputChange(null, 'specialty', e.target.value)}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                  >
                    <option value="Nettoyage résidentiel">Nettoyage résidentiel</option>
                    <option value="Nettoyage bureau">Nettoyage bureau</option>
                    <option value="Nettoyage vitres">Nettoyage vitres</option>
                    <option value="Nettoyage après travaux">Nettoyage après travaux</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Vérification d'email</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.emailVerification.verified ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                      <AtSign className={formData.emailVerification.verified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} />
                    </div>
                    <div>
                      <p className={`font-medium ${theme.textMain}`}>Statut de l'email</p>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        {formData.emailVerification.verified 
                          ? 'Votre email est vérifié et confirmé' 
                          : 'Vérifiez votre email pour activer votre compte'}
                      </p>
                    </div>
                  </div>
                  {getEmailVerificationBadge()}
                </div>

                {!formData.emailVerification.verified && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'}`}>
                    {!formData.emailVerification.codeSent ? (
                      <div className="space-y-3">
                        <p className={`text-sm ${theme.textSecondary}`}>
                          Un code de vérification sera envoyé à votre adresse email pour confirmer votre identité.
                        </p>
                        <button
                          onClick={sendVerificationEmail}
                          disabled={isSaving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Mail size={16} />
                              Envoyer le code de vérification
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className={`text-sm ${theme.textSecondary}`}>
                          Entrez le code à 6 chiffres envoyé à <strong>{formData.email}</strong>
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="000000"
                            maxLength="6"
                            className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.inputBg} ${theme.inputText}`}
                          />
                          <button
                            onClick={verifyEmailCode}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            Vérifier
                          </button>
                        </div>
                        <button
                          onClick={sendVerificationEmail}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Renvoyer le code
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Statut de disponibilité</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${theme.textMain}`}>Statut en ligne</p>
                  <p className={`text-sm ${theme.textSecondary}`}>Apparaître comme disponible pour les nouvelles commandes</p>
                </div>
                <button
                  onClick={() => {
                    const newStatus = !isOnline;
                    setIsOnline(newStatus);
                    Swal.fire({
                      icon: 'success',
                      title: newStatus ? 'En ligne' : 'Hors ligne',
                      text: newStatus 
                        ? 'Vous êtes maintenant disponible pour les nouvelles commandes'
                        : 'Vous êtes maintenant indisponible',
                      background: isDarkMode ? '#1f2937' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  }}
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
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textMain} flex items-center gap-2`}>
                    <Shield size={20} />
                    Vérification complète du compte
                  </h3>
                  <p className={`text-sm ${theme.textSecondary} mt-1`}>
                    Vérifiez votre identité pour accéder à toutes les fonctionnalités
                  </p>
                </div>
                {getVerificationStatusBadge()}
              </div>

              {/* Étape 1: Vérification d'email */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.emailVerification.verified 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textMain}`}>Vérification d'email</h4>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        Confirmez votre adresse email
                      </p>
                    </div>
                  </div>
                  {getEmailVerificationBadge()}
                </div>
                
                {!formData.emailVerification.verified && (
                  <div className="ml-11 mt-2">
                    <p className={`text-sm ${theme.textSecondary} mb-2`}>
                      Cette étape est requise pour continuer.
                    </p>
                    <button
                      onClick={() => setActiveTab('general')}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Aller vérifier mon email →
                    </button>
                  </div>
                )}
              </div>

              {/* Étape 2: Vérification d'identité */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.identityVerification.status === 'verified'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : formData.identityVerification.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textMain}`}>Vérification d'identité</h4>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        Téléchargez vos documents d'identité
                      </p>
                    </div>
                  </div>
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
                      Vérifiée le : {new Date(formData.identityVerification.verificationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                      Numéro de CIN / Passeport
                    </label>
                    <input
                      type="text"
                      value={formData.identityVerification.cinNumber}
                      onChange={(e) => handleInputChange('identityVerification', 'cinNumber', e.target.value)}
                      className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                      placeholder="Ex: AA123456"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { label: 'Recto CIN', fileType: 'cinFront', ref: cinFrontRef },
                      { label: 'Verso CIN', fileType: 'cinBack', ref: cinBackRef },
                      { label: 'Selfie avec CIN', fileType: 'selfiePhoto', ref: selfieRef, icon: Camera }
                    ].map(({ label, fileType, ref, icon: Icon }) => (
                      <div key={fileType} className="text-center">
                        <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                          {label}
                        </label>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.identityVerification[fileType] 
                              ? `${isDarkMode ? 'border-green-700 bg-green-900/20' : 'border-green-300 bg-green-50'}` 
                              : `${theme.border} hover:border-green-500`
                          }`}
                          onClick={() => ref.current?.click()}
                        >
                          {formData.identityVerification[fileType]?.preview ? (
                            <div className="space-y-2">
                              <img 
                                src={formData.identityVerification[fileType].preview} 
                                alt={label} 
                                className="w-full h-32 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(fileType);
                                }}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Supprimer
                              </button>
                            </div>
                          ) : (
                            <div className="py-8">
                              {Icon ? <Icon size={32} className={`mx-auto ${theme.textSecondary} mb-2`} /> : <Upload size={32} className={`mx-auto ${theme.textSecondary} mb-2`} />}
                              <p className={`text-sm ${theme.textSecondary}`}>Cliquez pour uploader</p>
                            </div>
                          )}
                          <input
                            ref={ref}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(fileType, e.target.files[0])}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'Date de naissance', field: 'dateOfBirth', type: 'date' },
                      { label: 'Nationalité', field: 'nationality', type: 'text', placeholder: 'Ex: Marocaine' },
                      { label: 'Genre', field: 'gender', type: 'select', options: ['', 'male', 'female', 'other'] },
                      { label: 'Numéro fiscal', field: 'taxNumber', type: 'text', placeholder: 'Ex: 123456789' }
                    ].map(({ label, field, type, options, placeholder }) => (
                      <div key={field}>
                        <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                          {label}
                        </label>
                        {type === 'select' ? (
                          <select
                            value={formData.personalInfo[field]}
                            onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                            className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                          >
                            <option value="">Sélectionner</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                            <option value="other">Autre</option>
                          </select>
                        ) : (
                          <input
                            type={type}
                            value={formData.personalInfo[field]}
                            onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                            className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                            placeholder={placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Bouton de soumission au superviseur */}
                  <div className={`pt-6 border-t ${theme.border}`}>
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-green-50'} rounded-xl p-6`}>
                      <h4 className={`text-lg font-semibold mb-3 ${theme.textMain} flex items-center gap-2`}>
                        <User size={20} />
                        Soumission au superviseur
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-3 rounded-lg ${formData.emailVerification.verified ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <div className="flex items-center gap-2">
                              {formData.emailVerification.verified ? (
                                <CheckCircle className="text-green-500" size={18} />
                              ) : (
                                <XCircle className="text-gray-400" size={18} />
                              )}
                              <span className={`font-medium ${formData.emailVerification.verified ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}`}>
                                Email vérifié
                              </span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${formData.identityVerification.cinNumber && formData.identityVerification.cinFront && formData.identityVerification.cinBack && formData.identityVerification.selfiePhoto ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <div className="flex items-center gap-2">
                              {formData.identityVerification.cinNumber && formData.identityVerification.cinFront && formData.identityVerification.cinBack && formData.identityVerification.selfiePhoto ? (
                                <CheckCircle className="text-green-500" size={18} />
                              ) : (
                                <XCircle className="text-gray-400" size={18} />
                              )}
                              <span className={`font-medium ${formData.identityVerification.cinNumber && formData.identityVerification.cinFront && formData.identityVerification.cinBack && formData.identityVerification.selfiePhoto ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}`}>
                                Documents complets
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className={`text-sm ${theme.textSecondary}`}>
                          Une fois soumis, vos informations seront envoyées au superviseur pour vérification. 
                          Votre compte sera activé après approbation.
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={submitVerificationToSupervisor}
                            disabled={isSaving || !formData.emailVerification.verified || !formData.identityVerification.cinNumber || !formData.identityVerification.cinFront || !formData.identityVerification.cinBack || !formData.identityVerification.selfiePhoto || formData.identityVerification.submittedToSupervisor}
                            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 ${
                              isSaving || !formData.emailVerification.verified || !formData.identityVerification.cinNumber || !formData.identityVerification.cinFront || !formData.identityVerification.cinBack || !formData.identityVerification.selfiePhoto || formData.identityVerification.submittedToSupervisor
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:from-blue-700 hover:to-green-700 hover:shadow-lg'
                            }`}
                          >
                            {isSaving ? (
                              <>
                                <RefreshCw size={16} className="animate-spin" />
                                Soumission...
                              </>
                            ) : formData.identityVerification.submittedToSupervisor ? (
                              <>
                                <Clock size={16} />
                                En attente du superviseur
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Soumettre au superviseur
                              </>
                            )}
                          </button>
                          
                          {/* Bouton de test pour simulation d'approbation (à supprimer en production) */}
                          {formData.identityVerification.submittedToSupervisor && formData.identityVerification.supervisorStatus === 'pending' && (
                            <button
                              onClick={simulateSupervisorApproval}
                              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                              Simuler approbation superviseur
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Paramètres de confidentialité</h3>
              <div className="space-y-4">
                {Object.entries(formData.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme.textMain} capitalize`}>
                        {key === 'profileVisible' && 'Profil visible'}
                        {key === 'showEarnings' && 'Afficher les gains'}
                        {key === 'allowMessages' && 'Autoriser les messages'}
                        {key === 'showPhoneNumber' && 'Afficher le téléphone'}
                        {key === 'showEmail' && "Afficher l'email"}
                        {key === 'shareLocation' && 'Partager la localisation'}
                      </p>
                      <p className={`text-sm ${theme.textSecondary}`}>
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

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Données et confidentialité</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Export démarré',
                      text: 'Export de vos données démarré...',
                      background: isDarkMode ? '#1f2937' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    });
                  }}
                  className={`w-full text-left px-4 py-3 border ${theme.border} rounded-lg hover:${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'} transition`}
                >
                  <p className={`font-medium ${theme.textMain}`}>Exporter mes données</p>
                  <p className={`text-sm ${theme.textSecondary}`}>Télécharger une copie de vos données personnelles</p>
                </button>
                
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Êtes-vous sûr?',
                      text: "Cette action est irréversible. Toutes vos données seront supprimées.",
                      icon: 'warning',
                      background: isDarkMode ? '#1f2937' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Oui, supprimer!',
                      cancelButtonText: 'Annuler'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire({
                          title: 'Supprimé!',
                          text: 'Votre compte sera supprimé sous 24h.',
                          icon: 'success',
                          background: isDarkMode ? '#1f2937' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#000000',
                        });
                      }
                    });
                  }}
                  className={`w-full text-left px-4 py-3 border ${isDarkMode ? 'border-red-800' : 'border-red-200'} rounded-lg hover:${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} transition ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
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
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Types de notifications</h3>
              <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme.textMain} capitalize`}>
                        {key === 'email' && 'Notifications email'}
                        {key === 'push' && 'Notifications push'}
                        {key === 'sms' && 'Notifications SMS'}
                        {key === 'newOrders' && 'Nouvelles commandes'}
                        {key === 'messages' && 'Messages clients'}
                        {key === 'promotions' && 'Promotions et offres'}
                      </p>
                      <p className={`text-sm ${theme.textSecondary}`}>
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
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Disponibilités hebdomadaires</h3>
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
                    <div key={day} className={`flex items-center justify-between p-4 border ${theme.border} rounded-lg`}>
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
                        <span className={`font-medium ${schedule.active ? theme.textMain : 'text-gray-400'}`}>
                          {dayNames[day]}
                        </span>
                      </div>
                      
                      {schedule.active && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => handleNestedChange('availability', day, 'start', e.target.value)}
                            className={`px-2 py-1 border ${theme.border} rounded focus:ring-2 focus:ring-green-500 ${theme.inputBg} ${theme.inputText}`}
                          />
                          <span className={theme.textSecondary}>-</span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleNestedChange('availability', day, 'end', e.target.value)}
                            className={`px-2 py-1 border ${theme.border} rounded focus:ring-2 focus:ring-green-500 ${theme.inputBg} ${theme.inputText}`}
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
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Sécurité du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: 'info',
                      title: 'Email envoyé',
                      text: 'Un email de réinitialisation a été envoyé à votre adresse.',
                      background: isDarkMode ? '#1f2937' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    });
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Sessions actives</h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 border ${theme.border} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${theme.textMain}`}>Session actuelle</p>
                    <p className="text-sm text-gray-500">Paris, France • Navigateur Chrome</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
                </div>
                <div className={`flex items-center justify-between p-3 border ${theme.border} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${theme.textMain}`}>Mobile Android</p>
                    <p className="text-sm text-gray-500">Lyon, France • Il y a 2 jours</p>
                  </div>
                  <button 
                    onClick={() => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Session déconnectée',
                        text: 'La session mobile a été déconnectée',
                        background: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                      });
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
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

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className={`${theme.bg} min-h-screen py-8 flex items-center justify-center transition-colors duration-200`}>
        <div className="text-center">
          <Loader className={`animate-spin mx-auto ${theme.textMain}`} size={40} />
          <p className={`mt-4 ${theme.textMain}`}>Chargement de vos paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} min-h-screen py-8 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-4`}>
              <h2 className={`text-xl font-bold mb-4 ${theme.textMain}`}>Paramètres</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? theme.navActive
                          : theme.navInactive
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

          <div className="flex-1">
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border}`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <h1 className={`text-2xl font-bold ${theme.textMain}`}>
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h1>
                <p className={`${theme.textSecondary} mt-1`}>
                  Gérez vos préférences et paramètres de compte
                </p>
              </div>

              <div className="p-6">
                {renderContent()}
              </div>

              <div className={`p-6 border-t ${theme.border} ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'} rounded-b-xl`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className={`text-sm ${theme.textSecondary}`}>
                    Tous les changements sont sauvegardés automatiquement
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
                        Swal.fire({
                          icon: 'info',
                          title: 'Modifications annulées',
                          background: isDarkMode ? '#1f2937' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#000000',
                          timer: 1500,
                          showConfirmButton: false,
                        });
                      }}
                      className={`px-6 py-2 border ${theme.border} ${theme.textSecondary} rounded-lg hover:${isDarkMode ? 'bg-gray-700' : 'bg-white'} transition`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveSettings}
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

export default React.memo(SettingsFreelancer);