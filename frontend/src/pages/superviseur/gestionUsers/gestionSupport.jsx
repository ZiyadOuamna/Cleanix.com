import React, { useState, useContext } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { Search, Filter, Plus, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, Copy } from 'lucide-react';
import Swal from 'sweetalert2';

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

export default function GestionSupport() {
  const { isDarkMode } = useContext(SuperviseurContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Données exemple des agents support
  const [supportAgents, setSupportAgents] = useState([
    {
      id: 1,
      nom: 'Jean Dupuis',
      prenom: 'Jean',
      email: 'jean.dupuis@cleanix.com',
      telephone: '+212 6 12 34 56 78',
      genre: 'Homme',
      ville: 'Casablanca',
      dateInscription: '2024-01-15',
      statut: 'actif',
      ticketsResolved: 245,
      averageRating: 4.7
    },
    {
      id: 2,
      nom: 'Marie Moreau',
      prenom: 'Marie',
      email: 'marie.moreau@cleanix.com',
      telephone: '+212 6 23 45 67 89',
      genre: 'Femme',
      ville: 'Rabat',
      dateInscription: '2024-02-20',
      statut: 'actif',
      ticketsResolved: 189,
      averageRating: 4.5
    },
    {
      id: 3,
      nom: 'Ahmed Bennani',
      prenom: 'Ahmed',
      email: 'ahmed.bennani@cleanix.com',
      telephone: '+212 6 34 56 78 90',
      genre: 'Homme',
      ville: 'Marrakech',
      dateInscription: '2024-03-10',
      statut: 'inactif',
      ticketsResolved: 92,
      averageRating: 4.2
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    genre: '',
    ville: MAROC_VILLES[0],
    statut: 'actif',
    password: ''
  });

  // Filtrer les agents
  const filteredAgents = supportAgents.filter(agent => {
    const matchesSearch = agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || agent.statut === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Ouvrir modal d'ajout
  const handleAddAgent = () => {
    setEditingAgent(null);
    const newPassword = generateSecurePassword();
    setGeneratedPassword(newPassword);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      genre: '',
      ville: MAROC_VILLES[0],
      statut: 'actif',
      password: newPassword
    });
    setShowModal(true);
  };

  // Ouvrir modal d'édition
  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setFormData({
      prenom: agent.prenom,
      nom: agent.nom,
      email: agent.email,
      telephone: agent.telephone,
      genre: agent.genre,
      ville: agent.ville,
      statut: agent.statut,
      password: ''
    });
    setShowModal(true);
  };

  // Supprimer agent
  const handleDeleteAgent = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent support ?')) {
      setSupportAgents(supportAgents.filter(agent => agent.id !== id));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAgent) {
      // Modification
      setSupportAgents(supportAgents.map(agent => 
        agent.id === editingAgent.id ? { ...agent, ...formData } : agent
      ));
    } else {
      // Ajout
      const newAgent = {
        ...formData,
        id: Date.now(),
        dateInscription: new Date().toISOString().split('T')[0],
        ticketsResolved: 0,
        averageRating: 0
      };
      setSupportAgents([...supportAgents, newAgent]);
    }
    setShowModal(false);
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
          <h1 className="text-3xl font-bold mb-2">Gestion du Support</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Gérez et surveillez tous vos agents support en un seul endroit
          </p>
        </div>

        {/* Contrôles */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>

          <button
            onClick={handleAddAgent}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Ajouter un Agent
          </button>
        </div>

        {/* Tableau */}
        <div className={`rounded-2xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Agent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tickets Résolus</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Note Moyenne</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className={`border-b ${
                      isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{agent.prenom} {agent.nom}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {agent.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm">{agent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm">{agent.telephone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        agent.ticketsResolved > 150 ? 'bg-green-100 text-green-800' :
                        agent.ticketsResolved > 50 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {agent.ticketsResolved}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">{agent.averageRating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.statut)}`}>
                        {agent.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
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

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                Aucun agent support trouvé
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-3xl rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-bold">
                  {editingAgent ? 'Modifier l\'Agent Support' : 'Ajouter un Agent Support'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Prenom + Nom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Nom"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Email"
                  />
                </div>

                {/* Telephone */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Téléphone"
                  />
                </div>

                {/* Genre + Ville */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Genre
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="genre"
                          value="Homme"
                          checked={formData.genre === 'Homme'}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span>Homme</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="genre"
                          value="Femme"
                          checked={formData.genre === 'Femme'}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span>Femme</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Ville
                    </label>
                    <select
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      {MAROC_VILLES.map(ville => (
                        <option key={ville} value={ville}>{ville}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mot de passe généré automatiquement */}
                {!editingAgent && (
                  <div>
                    <label className="block text-xs font-medium mb-2">Mot de passe généré *</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={formData.password}
                        className={`flex-1 px-3 py-2 text-xs border rounded-lg font-mono ${
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
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Statut *
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                        : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {editingAgent ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
