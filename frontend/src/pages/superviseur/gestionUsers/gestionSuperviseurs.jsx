// src/pages/superviseur/gestionUsers/gestionSuperviseurs.jsx
import React, { useState, useContext, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { Search, Filter, Plus, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import superviseurService from '../../../services/superviseurService';

const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammadia"
];

const generateSecurePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*-_=+';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export default function GestionSuperviseurs() {
  const { isDarkMode } = useContext(SuperviseurContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [superviseurs, setSuperviseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingSuperviseur, setEditingSuperviseur] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    genre: '',
    ville: MAROC_VILLES[0],
    password: ''
  });

  useEffect(() => {
    loadSuperviseurs();
  }, [currentPage, searchTerm]);

  const loadSuperviseurs = async () => {
    try {
      setLoading(true);
      // For now, we'll use a mock list since we may not have API for supervisor listing
      // In a real implementation, add API endpoint to SuperviseurController
      const mockSuperviseurs = [
        {
          id: 1,
          prenom: 'Ahmed',
          nom: 'Alaoui',
          email: 'ahmed.alaoui@cleanix.com',
          telephone: '+212 612345678',
          genre: 'Homme',
          ville: 'Casablanca',
          created_at: new Date('2024-01-15').toLocaleDateString('fr-FR'),
          statut: 'actif'
        },
        {
          id: 2,
          prenom: 'Fatima',
          nom: 'Bouchard',
          email: 'fatima.bouchard@cleanix.com',
          telephone: '+212 698765432',
          genre: 'Femme',
          ville: 'Rabat',
          created_at: new Date('2024-02-20').toLocaleDateString('fr-FR'),
          statut: 'actif'
        }
      ];
      
      setSuperviseurs(mockSuperviseurs);
      setTotalPages(1);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Swal.fire('Erreur', 'Erreur lors du chargement des superviseurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuperviseur = () => {
    setEditingSuperviseur(null);
    const newPassword = generateSecurePassword();
    setGeneratedPassword(newPassword);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      genre: '',
      ville: MAROC_VILLES[0],
      password: newPassword
    });
    setShowModal(true);
  };

  const handleEditSuperviseur = (superviseur) => {
    setEditingSuperviseur(superviseur);
    setFormData({
      prenom: superviseur.prenom,
      nom: superviseur.nom,
      email: superviseur.email,
      telephone: superviseur.telephone,
      genre: superviseur.genre,
      ville: superviseur.ville,
      password: ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setGeneratedPassword(newPassword);
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom || !formData.email) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    try {
      if (editingSuperviseur) {
        // Update existing superviseur
        const response = await superviseurService.updateSuperviseur(editingSuperviseur.id, {
          ...formData,
          password: formData.password || undefined
        });

        if (response.success) {
          Swal.fire('Succès', 'Superviseur mis à jour avec succès', 'success');
          setShowModal(false);
          await loadSuperviseurs();
        } else {
          Swal.fire('Erreur', response.message || 'Erreur lors de la mise à jour', 'error');
        }
      } else {
        // Create new superviseur
        const response = await superviseurService.createSuperviseur({
          ...formData,
          password: generatedPassword,
          user_type: 'Superviseur'
        });

        if (response.success) {
          Swal.fire('Succès', 'Superviseur créé avec succès', 'success');
          setShowModal(false);
          await loadSuperviseurs();
        } else {
          Swal.fire('Erreur', response.message || 'Erreur lors de la création', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Erreur', error.message || 'Une erreur est survenue', 'error');
    }
  };

  const handleDeleteSuperviseur = async (superviseur) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: `Êtes-vous sûr de vouloir supprimer ${superviseur.prenom} ${superviseur.nom}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await superviseurService.deleteSuperviseur(superviseur.id);
        if (response.success) {
          Swal.fire('Succès', 'Superviseur supprimé avec succès', 'success');
          await loadSuperviseurs();
        } else {
          Swal.fire('Erreur', response.message || 'Erreur lors de la suppression', 'error');
        }
      } catch (error) {
        Swal.fire('Erreur', error.message || 'Une erreur est survenue', 'error');
      }
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSuperviseurs = superviseurs.filter(superviseur =>
    superviseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superviseur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superviseur.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Gestion des Superviseurs
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Gérez les comptes superviseurs de votre plateforme
        </p>
      </div>

      {/* Actions Bar */}
      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md flex justify-between items-center`}>
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <button
          onClick={handleAddSuperviseur}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chargement...</p>
        </div>
      )}

      {/* Superviseurs Table */}
      {!loading && (
        <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nom
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Téléphone
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ville
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date d'inscription
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Statut
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSuperviseurs.length > 0 ? (
                  filteredSuperviseurs.map((superviseur) => (
                    <tr key={superviseur.id} className={`border-t ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'} transition`}>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {superviseur.prenom.charAt(0)}{superviseur.nom.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold">{superviseur.prenom} {superviseur.nom}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {superviseur.genre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {superviseur.email}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {superviseur.telephone || '-'}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {superviseur.ville}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {superviseur.created_at}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          superviseur.statut === 'actif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {superviseur.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEditSuperviseur(superviseur)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-lg transition text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteSuperviseur(superviseur)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-slate-600 rounded-lg transition text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={`px-6 py-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Aucun superviseur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingSuperviseur ? 'Modifier Superviseur' : 'Ajouter Superviseur'}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ville
                  </label>
                  <select
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {MAROC_VILLES.map(ville => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingSuperviseur && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Mot de passe généré
                    </label>
                    <button
                      type="button"
                      onClick={handleRegeneratePassword}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Régénérer
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className={`flex-1 px-3 py-2 border rounded-lg font-mono text-sm ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedPassword, 'password')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition"
                    >
                      {copiedId === 'password' ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      )}
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ce mot de passe sera envoyé par email au superviseur
                  </p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex gap-3 justify-end pt-6 border-t" style={{borderColor: isDarkMode ? '#475569' : '#e5e7eb'}}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    isDarkMode
                      ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  {editingSuperviseur ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
