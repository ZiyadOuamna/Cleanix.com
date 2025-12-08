import React, { useState, useContext, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, CheckCircle, Edit3, Upload } from 'react-feather';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';

const ProfileClient = () => {
  const { user, isDarkMode } = useContext(ClientContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar
  });

  const [isSaving, setIsSaving] = useState(false);
  const photoRef = useRef(null);

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputText: isDarkMode ? 'text-white' : 'text-slate-900'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profil mis à jour',
        text: 'Vos informations ont été enregistrées avec succès',
        confirmButtonColor: '#0891b2'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Mon Profil</h1>
        <p className={`mt-2 ${theme.textSecondary}`}>Gérez les informations de votre compte</p>
      </div>

      {/* Profile Card */}
      <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border}`}>
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-5xl shadow-lg">
              {formData.avatar}
            </div>
            {isEditing && (
              <button
                onClick={() => photoRef.current?.click()}
                className="absolute bottom-0 right-0 bg-cyan-600 text-white p-2 rounded-full hover:bg-cyan-700 transition"
              >
                <Camera size={16} />
              </button>
            )}
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <h2 className={`text-2xl font-bold ${theme.textMain}`}>{formData.name}</h2>
          <p className={`${theme.textMuted} text-sm mt-2`}>Compte Client Premium</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} transition ${
                isEditing 
                  ? `${theme.inputBg} ${theme.inputText}` 
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${theme.textMuted}`
              } disabled:cursor-not-allowed`}
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} transition ${
                isEditing 
                  ? `${theme.inputBg} ${theme.inputText}` 
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${theme.textMuted}`
              } disabled:cursor-not-allowed`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
              <Phone size={16} />
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} transition ${
                isEditing 
                  ? `${theme.inputBg} ${theme.inputText}` 
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${theme.textMuted}`
              } disabled:cursor-not-allowed`}
            />
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
              <MapPin size={16} />
              Adresse
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="3"
              className={`w-full px-4 py-3 rounded-lg border ${theme.border} transition ${
                isEditing 
                  ? `${theme.inputBg} ${theme.inputText}` 
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${theme.textMuted}`
              } disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition font-semibold"
            >
              <Edit3 size={18} />
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setFormData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    avatar: user.avatar
                  });
                  setIsEditing(false);
                }}
                className={`flex-1 px-6 py-3 rounded-lg transition font-semibold border ${theme.border} ${theme.textMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : <><CheckCircle size={18} /> Enregistrer</>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
        <h3 className={`text-lg font-bold ${theme.textMain} mb-4`}>Informations du compte</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className={`${theme.textMuted} text-sm mb-1`}>Date de création</p>
            <p className={`${theme.textMain} font-semibold`}>15 Janvier 2024</p>
          </div>
          <div>
            <p className={`${theme.textMuted} text-sm mb-1`}>Statut du compte</p>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <p className={`${theme.textMain} font-semibold`}>Actif</p>
            </div>
          </div>
          <div>
            <p className={`${theme.textMuted} text-sm mb-1`}>Services utilisés</p>
            <p className={`${theme.textMain} font-semibold`}>12 services</p>
          </div>
          <div>
            <p className={`${theme.textMuted} text-sm mb-1`}>Évaluation moyenne</p>
            <p className={`${theme.textMain} font-semibold`}>4.7/5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
