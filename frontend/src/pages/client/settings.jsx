import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Settings, Shield, Lock, User, Bell, Mail, Phone, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react';
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '+33 6 12 34 56 78',
    address: 'Paris, France',
    
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newProposals: true,
      serviceReminders: true,
      promotions: true,
      news: false
    },

    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      shareLocation: false
    },

    passwords: {
      current: '',
      new: '',
      confirm: ''
    }
  });

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    inputText: isDarkMode ? 'text-white' : 'text-gray-900',
    toggleOn: 'bg-green-500',
    toggleOff: isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      passwords: {
        ...prev.passwords,
        [name]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Swal.fire({
        icon: 'success',
        title: 'Paramètres sauvegardés',
        text: 'Vos préférences ont été mises à jour',
        confirmButtonColor: '#0891b2'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de sauvegarder les paramètres'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (formData.passwords.new.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le mot de passe doit contenir au moins 8 caractères'
      });
      return;
    }

    if (formData.passwords.new !== formData.passwords.confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Swal.fire({
        icon: 'success',
        title: 'Mot de passe changé',
        text: 'Votre mot de passe a été mis à jour avec succès',
        confirmButtonColor: '#0891b2'
      });
      setFormData(prev => ({
        ...prev,
        passwords: { current: '', new: '', confirm: '' }
      }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de changer le mot de passe'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${theme.textMain} flex items-center gap-3`}>
            <Settings size={32} />
            Paramètres
          </h1>
          <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos préférences et votre sécurité</p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-4 border-b ${theme.border} overflow-x-auto sticky top-0 ${theme.cardBg} px-4 py-3 rounded-t-xl`}>
          {[
            { id: 'general', label: 'Général', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Confidentialité', icon: Shield },
            { id: 'security', label: 'Sécurité', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `border-cyan-600 ${theme.textMain}`
                    : `border-transparent ${theme.textSecondary} hover:${theme.textMain}`
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} space-y-6`}>
            <h2 className={`text-2xl font-bold ${theme.textMain}`}>Paramètres généraux</h2>

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
                <Mail size={16} />
                Email primaire
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <p className={`text-xs ${theme.textMuted} mt-2`}>Contactez le support pour changer votre email</p>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
                <Phone size={16} />
                Numéro de téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
              />
            </div>

            {/* Address */}
            <div>
              <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
                <MapPin size={16} />
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
              />
            </div>

            {/* Online Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-opacity-20">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className={`font-semibold ${theme.textMain}`}>Statut en ligne</p>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isOnline ? theme.toggleOn : theme.toggleOff
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isOnline ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} space-y-6`}>
            <h2 className={`text-2xl font-bold ${theme.textMain}`}>Préférences de notification</h2>

            {[
              { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevez les mises à jour par email' },
              { key: 'smsNotifications', label: 'Notifications SMS', desc: 'Recevez les alertes par SMS' },
              { key: 'newProposals', label: 'Nouvelles propositions', desc: 'Soyez notifié des nouvelles propositions' },
              { key: 'serviceReminders', label: 'Rappels de service', desc: 'Recevez des rappels avant vos services' },
              { key: 'promotions', label: 'Promotions', desc: 'Recevez les codes de réduction' },
              { key: 'news', label: 'Actualités', desc: 'Recevez nos dernières actualités' }
            ].map(notif => (
              <div key={notif.key} className={`flex items-center justify-between p-4 rounded-lg border ${theme.border} hover:bg-opacity-50 transition`}>
                <div>
                  <p className={`font-semibold ${theme.textMain}`}>{notif.label}</p>
                  <p className={`text-sm ${theme.textSecondary}`}>{notif.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(notif.key)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    formData.notifications[notif.key] ? theme.toggleOn : theme.toggleOff
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      formData.notifications[notif.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Enregistrer les préférences'}
            </button>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} space-y-6`}>
            <h2 className={`text-2xl font-bold ${theme.textMain}`}>Paramètres de confidentialité</h2>

            {[
              { key: 'profileVisible', label: 'Profil public', desc: 'Permettre aux autres utilisateurs de voir votre profil' },
              { key: 'showEmail', label: 'Afficher l\'email', desc: 'Afficher votre adresse email sur votre profil' },
              { key: 'showPhone', label: 'Afficher le téléphone', desc: 'Afficher votre numéro de téléphone sur votre profil' },
              { key: 'allowMessages', label: 'Recevoir des messages', desc: 'Permettre aux freelancers de vous envoyer des messages' },
              { key: 'shareLocation', label: 'Partager la localisation', desc: 'Partager votre localisation avec les freelancers' }
            ].map(privacy => (
              <div key={privacy.key} className={`flex items-center justify-between p-4 rounded-lg border ${theme.border} hover:bg-opacity-50 transition`}>
                <div>
                  <p className={`font-semibold ${theme.textMain}`}>{privacy.label}</p>
                  <p className={`text-sm ${theme.textSecondary}`}>{privacy.desc}</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange(privacy.key)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    formData.privacy[privacy.key] ? theme.toggleOn : theme.toggleOff
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      formData.privacy[privacy.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
            </button>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} space-y-6`}>
            <h2 className={`text-2xl font-bold ${theme.textMain}`}>Sécurité et confidentialité</h2>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.textMain}`}>Changer le mot de passe</h3>

              {/* Current Password */}
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current"
                    value={formData.passwords.current}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute right-4 top-3 ${theme.textSecondary}`}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="new"
                    value={formData.passwords.new}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-3 ${theme.textSecondary}`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  name="confirm"
                  value={formData.passwords.confirm}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isSaving ? 'Changement...' : 'Changer le mot de passe'}
              </button>
            </form>

            {/* Active Sessions */}
            <div className={`pt-8 border-t ${theme.border}`}>
              <h3 className={`text-lg font-semibold ${theme.textMain} mb-4`}>Sessions actives</h3>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${theme.textMain}`}>Cet appareil</p>
                    <p className={`text-sm ${theme.textSecondary}`}>Navigateur: Chrome • IP: 192.168.1.1</p>
                  </div>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsClient;
