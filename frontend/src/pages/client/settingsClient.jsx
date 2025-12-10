import React, { useState, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Settings, Shield, Lock, User, Bell, Mail, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { ClientContext } from './clientContext';

const SettingsClient = () => {
  const { 
    user = { email: '', phone: '' }, 
    isDarkMode,
    isOnline,
    setIsOnline
  } = useContext(ClientContext);

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Infos personnelles
    email: user?.email || '',
    phone: user?.phone || '+33 6 12 34 56 78',
    address: 'Paris, France',
    
    // Notifications
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newProposals: true,
      serviceReminders: true,
      promotions: true,
      news: false
    },

    // Confidentialité
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      shareLocation: false
    },

    // Sécurité
    security: {
      twoFactorAuth: false,
      passwordChange: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  });

  // Thème
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    inputText: isDarkMode ? 'text-white' : 'text-gray-900',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    buttonGreen: 'bg-green-600 hover:bg-green-700',
    buttonRed: 'bg-red-600 hover:bg-red-700',
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

  const handleToggle = useCallback((section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  }, []);

  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        icon: 'success',
        title: 'Paramètres enregistrés',
        text: 'Vos paramètres ont été mis à jour avec succès.',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#10B981'
      });
    }, 1500);
  }, [isDarkMode]);

  const changePassword = useCallback(() => {
    const { currentPassword, newPassword, confirmPassword } = formData.security.passwordChange;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le mot de passe doit contenir au moins 8 caractères',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFormData(prev => ({
        ...prev,
        security: {
          ...prev.security,
          passwordChange: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        }
      }));
      Swal.fire({
        icon: 'success',
        title: 'Mot de passe changé',
        text: 'Votre mot de passe a été modifié avec succès.',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#10B981'
      });
    }, 1500);
  }, [formData.security.passwordChange, isDarkMode]);

  const tabs = [
    { id: 'general', name: 'Général', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Confidentialité', icon: Shield },
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
                  { label: 'Email', field: 'email', type: 'email', icon: Mail },
                  { label: 'Téléphone', field: 'phone', type: 'tel', icon: Phone },
                  { label: 'Adresse', field: 'address', type: 'text', icon: MapPin }
                ].map(({ label, field, type, icon: Icon }) => (
                  <div key={field} className="md:col-span-1">
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme.textSecondary}`}>
                      <Icon size={16} />
                      {label}
                    </label>
                    <input
                      type={type}
                      value={formData[field]}
                      onChange={(e) => handleInputChange(null, field, e.target.value)}
                      className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText} transition-colors`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Statut en ligne</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme.textSecondary}`}>Afficher votre statut en ligne</p>
                  <p className={`text-sm ${theme.textMuted}`}>Permettre aux autres de voir si vous êtes en ligne</p>
                </div>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                    isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme.textMain}`}>Préférences de notifications</h3>
            <div className="space-y-4">
              {Object.entries(formData.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className={`${theme.textSecondary}`}>
                      {key === 'emailNotifications' && 'Notifications par email'}
                      {key === 'smsNotifications' && 'Notifications par SMS'}
                      {key === 'newProposals' && 'Nouvelles propositions'}
                      {key === 'serviceReminders' && 'Rappels de service'}
                      {key === 'promotions' && 'Promotions et offres'}
                      {key === 'news' && 'Nouvelles du site'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-green-600' : 'bg-gray-400'
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
        );

      case 'privacy':
        return (
          <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme.textMain}`}>Paramètres de confidentialité</h3>
            <div className="space-y-4">
              {Object.entries(formData.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className={`${theme.textSecondary}`}>
                      {key === 'profileVisible' && 'Profil visible'}
                      {key === 'showEmail' && 'Afficher votre email'}
                      {key === 'showPhone' && 'Afficher votre téléphone'}
                      {key === 'allowMessages' && 'Autoriser les messages'}
                      {key === 'shareLocation' && 'Partager votre localisation'}
                    </p>
                    <p className={`text-xs ${theme.textMuted}`}>
                      {key === 'profileVisible' && 'Les freelancers peuvent voir votre profil'}
                      {key === 'showEmail' && 'Afficher votre email dans votre profil'}
                      {key === 'showPhone' && 'Afficher votre téléphone dans votre profil'}
                      {key === 'allowMessages' && 'Les freelancers peuvent vous envoyer des messages'}
                      {key === 'shareLocation' && 'Partager votre localisation pour les services'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-green-600' : 'bg-gray-400'
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
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Modifier le mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={formData.security.passwordChange.currentPassword}
                    onChange={(e) => handleInputChange('passwordChange', 'currentPassword', e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.security.passwordChange.newPassword}
                      onChange={(e) => handleInputChange('passwordChange', 'newPassword', e.target.value)}
                      placeholder="Entrez votre nouveau mot de passe"
                      className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-2.5 ${theme.textMuted} hover:${theme.textSecondary}`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.security.passwordChange.confirmPassword}
                    onChange={(e) => handleInputChange('passwordChange', 'confirmPassword', e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.inputBg} ${theme.inputText}`}
                  />
                </div>

                <button
                  onClick={changePassword}
                  disabled={isSaving}
                  className={`w-full ${theme.buttonGreen} text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50`}
                >
                  {isSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </div>

            <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textMain}`}>Authentification double facteur</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme.textSecondary}`}>Sécuriser votre compte</p>
                  <p className={`text-sm ${theme.textMuted}`}>Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.security.twoFactorAuth ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.textMain} flex items-center gap-3 mb-2`}>
            <Settings size={32} className="text-green-600" />
            Paramètres
          </h1>
          <p className={`${theme.textMuted}`}>Gérez vos préférences et votre compte</p>
        </div>

        {/* Tabs */}
        <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} overflow-hidden mb-6`}>
          <div className={`flex border-b ${theme.border} overflow-x-auto`}>
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:flex-none px-6 py-4 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id
                      ? `border-green-600 ${theme.textMain}`
                      : `border-transparent ${theme.textMuted} ${theme.hoverBg}`
                  }`}
                >
                  <TabIcon size={20} />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-gray-700 flex gap-3">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className={`flex-1 ${theme.buttonGreen} text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50`}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            <button
              className={`px-6 py-2 border ${theme.border} rounded-lg ${theme.textMain} hover:${theme.hoverBg} transition-colors`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
