import React, { useState, useContext } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Shield,
  Clock,
  User,
  LogOut
} from 'react-feather';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';

const SettingsClient = () => {
  const { user, isDarkMode, setIsDarkMode } = useContext(ClientContext);

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: user.email,
    phone: user.phone,
    notifications: {
      email: true,
      push: true,
      sms: false,
      newOffers: true,
      bookingReminders: true,
      promotions: true
    },
    privacy: {
      profileVisible: true,
      allowMessages: true,
      showPhone: false,
      shareLocation: false
    },
    passwords: {
      current: '',
      new: '',
      confirm: ''
    }
  });

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputText: isDarkMode ? 'text-white' : 'text-slate-900',
    toggleOn: 'bg-green-500',
    toggleOff: isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
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
    <div className={`max-w-4xl mx-auto space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textMain} flex items-center gap-3`}>
          <Settings size={32} />
          Paramètres
        </h1>
        <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos préférences et votre sécurité</p>
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-4 border-b ${theme.border} overflow-x-auto`}>
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
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} space-y-6`}>
          <h2 className={`text-2xl font-bold ${theme.textMain}`}>Paramètres généraux</h2>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-opacity-50 hover:bg-opacity-70 transition">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                <Settings size={20} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              </div>
              <div>
                <p className={`font-semibold ${theme.textMain}`}>Mode sombre</p>
                <p className={`text-sm ${theme.textSecondary}`}>Activer le thème sombre pour une meilleure expérience</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isDarkMode ? theme.toggleOn : theme.toggleOff
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
              <Mail size={16} />
              Email primaire
            </label>
            <input
              type="email"
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
              value={formData.phone}
              disabled
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <p className={`text-xs ${theme.textMuted} mt-2`}>Contactez le support pour modifier</p>
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
            { key: 'email', label: 'Notifications par email', desc: 'Recevez les mises à jour par email' },
            { key: 'push', label: 'Notifications push', desc: 'Recevez les alertes en temps réel' },
            { key: 'sms', label: 'Notifications SMS', desc: 'Recevez les mises à jour par SMS' },
            { key: 'newOffers', label: 'Offres spéciales', desc: 'Soyez informé des nouvelles offres' },
            { key: 'bookingReminders', label: 'Rappels de réservation', desc: 'Recevez des rappels avant vos services' },
            { key: 'promotions', label: 'Promotions', desc: 'Recevez les codes de réduction' }
          ].map(notif => (
            <div key={notif.key} className="flex items-center justify-between p-4 rounded-lg border border-opacity-20 hover:bg-opacity-50 transition">
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
            { key: 'allowMessages', label: 'Recevoir des messages', desc: 'Permettre aux freelancers de vous envoyer des messages' },
            { key: 'showPhone', label: 'Afficher le téléphone', desc: 'Afficher votre numéro de téléphone sur votre profil' },
            { key: 'shareLocation', label: 'Partager la localisation', desc: 'Partager votre localisation avec les freelancers' }
          ].map(privacy => (
            <div key={privacy.key} className="flex items-center justify-between p-4 rounded-lg border border-opacity-20 hover:bg-opacity-50 transition">
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
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
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
  );
};

export default SettingsClient;
