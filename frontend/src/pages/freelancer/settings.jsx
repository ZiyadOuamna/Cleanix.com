import React, { useState, useContext } from 'react';
import { Settings,Shield,Clock,Lock,RefreshCw, User, Bell } from "react-feather";
import { FreelancerContext } from './freelancerContext';

const SettingsFreelancer = () => {
  const { 
    user, 
    isDarkMode, 
    setIsDarkMode,
    isOnline,
    setIsOnline
  } = useContext(FreelancerContext);

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
      allowMessages: true
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

  const tabs = [
    { id: 'general', name: 'Général', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Confidentialité', icon: Shield },
    { id: 'availability', name: 'Disponibilité', icon: Clock },
    { id: 'security', name: 'Sécurité', icon: Lock }
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Informations personnelles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spécialité
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => handleInputChange(null, 'specialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Nettoyage résidentiel">Nettoyage résidentiel</option>
                    <option value="Nettoyage bureau">Nettoyage bureau</option>
                    <option value="Nettoyage vitres">Nettoyage vitres</option>
                    <option value="Nettoyage après travaux">Nettoyage après travaux</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Préférences d'application</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Mode sombre</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Activer l'interface sombre</p>
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
                    <p className="font-medium dark:text-white">Statut en ligne</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Apparaître comme disponible pour les nouvelles commandes</p>
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

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Types de notifications</h3>
              <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white capitalize">
                        {key === 'email' && 'Notifications email'}
                        {key === 'push' && 'Notifications push'}
                        {key === 'sms' && 'Notifications SMS'}
                        {key === 'newOrders' && 'Nouvelles commandes'}
                        {key === 'messages' && 'Messages clients'}
                        {key === 'promotions' && 'Promotions et offres'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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

      case 'privacy':
        return (
          <div className="space-y-6">
            

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Données et confidentialité</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <p className="font-medium dark:text-white">Exporter mes données</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Télécharger une copie de vos données personnelles</p>
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-3 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition text-red-600 dark:text-red-400"
                >
                  <p className="font-medium">Supprimer mon compte</p>
                  <p className="text-sm">Supprimer définitivement votre compte et toutes vos données</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Disponibilités hebdomadaires</h3>
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
                    <div key={day} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
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
                        <span className={`font-medium ${schedule.active ? 'dark:text-white' : 'text-gray-400'}`}>
                          {dayNames[day]}
                        </span>
                      </div>
                      
                      {schedule.active && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => handleNestedChange('availability', day, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleNestedChange('availability', day, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Sécurité du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Sessions actives</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-white">Session actuelle</p>
                    <p className="text-sm text-gray-500">Paris, France • Navigateur Chrome</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-white">Mobile Android</p>
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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar des onglets */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Paramètres</h2>
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
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gérez vos préférences et paramètres de compte
              </p>
            </div>

            <div className="p-6">
              <TabContent />
            </div>

            {/* Boutons d'action */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  {saveMessage && (
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {saveMessage}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 ${isSaving ? 'opacity-50 pointer-events-none' : ''} ${isDarkMode ? 'dark:text-red-500' : ''}">
                  <button
                    onClick={() => setFormData({
                      ...formData,
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      specialty: user?.specialty || ''
                    })}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
  );
};

export default SettingsFreelancer;