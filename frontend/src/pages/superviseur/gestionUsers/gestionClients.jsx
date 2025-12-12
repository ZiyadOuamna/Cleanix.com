// src/pages/GestionClients.jsx
import React, { useState, useContext, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { Search, Filter, Plus, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import superviseurService from '../../../services/superviseurService';

const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammadia"
];

// Fonction pour générer un mot de passe sécurisé aléatoire
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

export default function GestionClients() {
  const { isDarkMode } = useContext(SuperviseurContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Données du modal
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    genre: '',
    adresse: '',
    ville: MAROC_VILLES[0],
    code_postal: '',
    password: ''
  });

  // Charger les clients au montage et lors du changement de page/recherche
  useEffect(() => {
    loadClients();
  }, [currentPage, searchTerm, statusFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await superviseurService.getClients(currentPage, searchTerm, statusFilter);
      if (response.success) {
        setClients(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      } else {
        Swal.fire('Erreur', response.message || 'Erreur lors du chargement des clients', 'error');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Swal.fire('Erreur', error.message || 'Erreur lors du chargement des clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients localement
  const filteredClients = clients.filter(client => {
    const matchesSearch = (client.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (client.prenom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Ouvrir modal d'ajout
  const handleAddClient = () => {
    setEditingClient(null);
    const newPassword = generateSecurePassword();
    setGeneratedPassword(newPassword);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      genre: '',
      adresse: '',
      ville: MAROC_VILLES[0],
      code_postal: '',
      password: newPassword
    });
    setShowModal(true);
  };

  // Ouvrir modal d'édition
  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormData({ 
      prenom: client.prenom || '',
      nom: client.nom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      genre: client.genre || '',
      adresse: client.client?.adresse || '',
      ville: client.client?.ville || MAROC_VILLES[0],
      code_postal: client.client?.code_postal || '',
    });
    setShowModal(true);
  };

  // Supprimer client
  const handleDeleteClient = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await superviseurService.deleteClient(id);
        if (response.success) {
          Swal.fire('Supprimé!', 'Le client a été supprimé.', 'success');
          loadClients(); // Recharger la liste
        }
      } catch (error) {
        Swal.fire('Erreur', error.message || 'Erreur lors de la suppression', 'error');
      }
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingClient) {
        // Modification
        const response = await superviseurService.updateClient(editingClient.id, {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          genre: formData.genre,
          adresse: formData.adresse,
          ville: formData.ville,
          code_postal: formData.code_postal,
        });
        if (response.success) {
          Swal.fire('Succès', 'Client modifié avec succès', 'success');
        }
      } else {
        // Création
        const response = await superviseurService.createClient({
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          genre: formData.genre,
          adresse: formData.adresse,
          ville: formData.ville,
          code_postal: formData.code_postal,
          password: formData.password,
          user_type: 'Client',
        });
        if (response.success) {
          Swal.fire('Succès', 'Client créé avec succès', 'success');
        }
      }
      setShowModal(false);
      loadClients(); // Recharger la liste
    } catch (error) {
      Swal.fire('Erreur', error.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des Clients</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Gérez et surveillez tous vos clients en un seul endroit
          </p>
        </div>

        {/* Barre d'actions */}
        <div className={`p-6 rounded-2xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Barre de recherche */}
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Filtre par statut */}
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            {/* Bouton d'ajout */}
            <button
              onClick={handleAddClient}
              disabled={loading}
              className="w-full md:w-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Ajouter Client
            </button>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className={`rounded-2xl shadow-lg p-12 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Chargement des clients...
            </p>
          </div>
        )}

        {/* Message si aucun client */}
        {!loading && filteredClients.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-12 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <User className="mx-auto mb-4 opacity-50" size={48} />
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Aucun client trouvé. Créez votre premier client en cliquant sur le bouton ci-dessus.
            </p>
          </div>
        )}

        {/* Tableau des clients */}
        {!loading && filteredClients.length > 0 && (
        <div className={`rounded-2xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Inscription</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Commandes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Dépenses</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className={`border-b ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-750' 
                        : 'border-gray-100 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{client.nom}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {client.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm">{client.telephone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{new Date(client.dateInscription).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{client.commandesTotal}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        {client.montantDepense.toFixed(2)}DH
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.statut)}`}>
                        {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && filteredClients.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} my-8`}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingClient ? 'Modifier le Client' : 'Ajouter un Client'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Prénom et Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Nom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="exemple@email.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-xs font-medium mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="06 XX XX XX XX"
                />
              </div>

              {/* Genre et Ville */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Genre *</label>
                  <div className="flex space-x-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="genre" 
                        value="Homme" 
                        checked={formData.genre === 'Homme'} 
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })} 
                        className="h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs">Homme</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="genre" 
                        value="Femme" 
                        checked={formData.genre === 'Femme'} 
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })} 
                        className="h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs">Femme</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Ville *</label>
                  <select
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    {MAROC_VILLES.map((ville) => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mot de passe généré automatiquement */}
              {!editingClient && (
                <div>
                  <label className="block text-xs font-medium mb-1">Mot de passe généré *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={formData.password}
                      className={`flex-1 px-3 py-2.5 text-xs border rounded-lg font-mono ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-800'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.password);
                        Swal.fire({
                          icon: 'success',
                          title: 'Copié!',
                          text: 'Mot de passe copié dans le presse-papiers',
                          timer: 1500,
                          showConfirmButton: false,
                          background: isDarkMode ? '#1f2937' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#1f2937',
                        });
                      }}
                      className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Copier le mot de passe"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newPassword = generateSecurePassword();
                        setGeneratedPassword(newPassword);
                        setFormData({ ...formData, password: newPassword });
                      }}
                      className="px-3 py-2.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      Régénérer
                    </button>
                  </div>
                </div>
              )}

              {/* Statut */}
              <div>
                <label className="block text-xs font-medium mb-1">Statut *</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-6 py-2.5 rounded-lg border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {editingClient ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}