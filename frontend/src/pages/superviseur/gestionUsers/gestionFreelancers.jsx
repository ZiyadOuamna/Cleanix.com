// src/pages/GestionFreelancers.jsx
import React, { useState, useContext } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { 
    Activity, FileText, Hash, Smartphone, Building,
    Search, Filter, Plus, Edit, Trash2, User, Mail, Phone, 
    MapPin, Calendar, Star, Briefcase, DollarSign, Eye,
    CheckCircle, XCircle, Clock, Download, Send, Copy
} from 'lucide-react';
import Swal from 'sweetalert2';

const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammadia"
];

const SPECIALITES = [
  'Nettoyage Résidentiel',
  'Nettoyage Bureau',
  'Nettoyage Vitres',
  'Nettoyage Approfondi',
  'Entretien Régulier',
  'Désinfection',
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

export default function GestionFreelancers() {
    const { isDarkMode } = useContext(SuperviseurContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [specialiteFilter, setSpecialiteFilter] = useState('all');
    const [selectedService, setSelectedService] = useState(null); // AJOUTÉ

    // Données exemple des freelancers
    const [freelancers, setFreelancers] = useState([
        {
            id: 1,
            nom: 'Karim Benali',
            prenom: 'Karim', // AJOUTÉ
            email: 'karim.benali@email.com',
            telephone: '+33 6 12 34 56 78',
            adresse: '15 Rue de Marseille, Lyon',
            dateInscription: '2024-01-10',
            statut: 'actif',
            specialite: 'Nettoyage Résidentiel',
            note: 4.8,
            missionsTotal: 45,
            revenuTotal: 12500.00,
            documents: ['Informations Bancaire', 'CIN Rcto Verso', 'Photo Personnel'],
            dernierAcces: '2025-11-25 14:30',
            verifie: true, // AJOUTÉ
            estConnecte: true, // AJOUTÉ
            ville: 'Lyon', // AJOUTÉ
            detailsCompteBancaire: 'CIH *** 1234', // AJOUTÉ
            services: [ // AJOUTÉ
                { type: 'Nettoyage Résidentiel', tarifBase: 150 },
                { type: 'Nettoyage de Surface', tarifBase: 80 }
            ]
        },
        {
            id: 2,
            nom: 'Sophie Martin',
            prenom: 'Sophie', // AJOUTÉ
            email: 'sophie.martin@email.com',
            telephone: '+33 6 23 45 67 89',
            adresse: '8 Avenue Victor Hugo, Paris',
            dateInscription: '2024-02-15',
            statut: 'en_attente',
            specialite: 'Nettoyage Bureau',
            note: 0,
            missionsTotal: 0,
            revenuTotal: 0.00,
            documents: ['Informations Bancaire', 'CIN Rcto Verso', 'Photo Personnel'],
            dernierAcces: '2025-11-24 10:15',
            verifie: false, // AJOUTÉ
            estConnecte: false, // AJOUTÉ
            ville: 'Paris', // AJOUTÉ
            detailsCompteBancaire: 'BP *** 5678', // AJOUTÉ
            services: [ // AJOUTÉ
                { type: 'Nettoyage Bureau', tarifBase: 120 }
            ]
        },
        // ... autres freelancers avec les mêmes propriétés ajoutées
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingFreelancer, setEditingFreelancer] = useState(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        genre: '',
        ville: MAROC_VILLES[0],
        specialite: 'Nettoyage Résidentiel',
        statut: 'actif',
        password: ''
    });

    //l'icone de vérifer compte 
    const VerifiedAccount = ({ size = 20 }) => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none"
        >
            <circle cx="12" cy="12" r="10" fill="#1DA1F2" /> 
            <path 
                d="M16.2 9.2l-5.1 5.1-2.3-2.3" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );

    // Spécialités disponibles
    const SPECIALITES = [
        'Nettoyage Résidentiel',
        'Nettoyage Supérfécie',
        'Nettoyage Unitaire',
    ];

    // Filtrer les freelancers
    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesSearch = 
            freelancer.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.specialite.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || freelancer.statut === statusFilter;
        const matchesSpecialite = specialiteFilter === 'all' || freelancer.specialite === specialiteFilter;

        return matchesSearch && matchesStatus && matchesSpecialite;
    });

    // Stats
    const stats = {
        total: freelancers.length,
        actifs: freelancers.filter(f => f.statut === 'actif').length,
        enAttente: freelancers.filter(f => f.statut === 'en_attente').length,
        suspendus: freelancers.filter(f => f.statut === 'suspendu').length,
        totalMissions: freelancers.reduce((acc, f) => acc + f.missionsTotal, 0),
        totalRevenu: freelancers.reduce((acc, f) => acc + f.revenuTotal, 0)
    };

    // Ouvrir modal d'ajout
    const handleAddFreelancer = () => {
        setEditingFreelancer(null);
        const newPassword = generateSecurePassword();
        setGeneratedPassword(newPassword);
        setFormData({
            prenom: '',
            nom: '',
            email: '',
            telephone: '',
            genre: '',
            ville: MAROC_VILLES[0],
            specialite: 'Nettoyage Résidentiel',
            statut: 'actif',
            password: newPassword
        });
        setShowModal(true);
    };

    // Ouvrir modal d'édition
    const handleEditFreelancer = (freelancer) => {
        setEditingFreelancer(freelancer);
        setFormData({ ...freelancer });
        setShowModal(true);
    };

    // Ouvrir modal de détails
    const handleViewDetails = (freelancer) => {
        setSelectedFreelancer(freelancer);
        setShowDetailModal(true);
    };

    // Supprimer freelancer
    const handleDeleteFreelancer = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce freelancer ?')) {
            setFreelancers(freelancers.filter(freelancer => freelancer.id !== id));
        }
    };

    // Soumettre le formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFreelancer) {
            // Modification
            setFreelancers(freelancers.map(freelancer => 
                freelancer.id === editingFreelancer.id ? { ...freelancer, ...formData } : freelancer
            ));
        } else {
            // Ajout
            const newFreelancer = {
                ...formData,
                id: Date.now(),
                dateInscription: new Date().toISOString().split('T')[0],
                note: 0,
                missionsTotal: 0,
                revenuTotal: 0,
                documents: ['Informations Bancaire', 'CIN Rcto Verso', 'Photo Personnel'],
                dernierAcces: new Date().toLocaleString('fr-FR'),
                verifie: false,
                estConnecte: false,
                detailsCompteBancaire: 'Nouveau compte',
                services: []
            };
            setFreelancers([...freelancers, newFreelancer]);
        }
        setShowModal(false);
    };

    // Changer le statut d'un freelancer
    const handleChangeStatus = (id, newStatus) => {
        setFreelancers(freelancers.map(freelancer => 
            freelancer.id === id ? { ...freelancer, statut: newStatus } : freelancer
        ));
        
        // Mettre à jour le freelancer sélectionné si ouvert
        if (selectedFreelancer && selectedFreelancer.id === id) {
            setSelectedFreelancer({ ...selectedFreelancer, statut: newStatus });
        }
    };
// Fonction pour générer les PDFs
const generatePDF = (type, freelancer) => {
    // Simulation de génération de PDF
    const pdfContent = type === 'cin' 
        ? `Carte d'Identité - ${freelancer.prenom} ${freelancer.nom}`
        : `Informations Bancaires - ${freelancer.prenom} ${freelancer.nom}`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${freelancer.prenom}_${freelancer.nom}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Notification de succès
    alert(`PDF ${type === 'cin' ? 'Carte d\'Identité' : 'Informations Bancaires'} téléchargé avec succès!`);
};
    const getStatusColor = (statut) => {
        switch (statut) {
            case 'actif': return 'bg-green-100 text-green-800 border-green-200';
            case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'suspendu': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'actif': return 'Actif';
            case 'en_attente': return 'En attente';
            case 'suspendu': return 'Suspendu';
            default: return 'Inconnu';
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'actif': return <CheckCircle size={14} />;
            case 'en_attente': return <Clock size={14} />;
            case 'suspendu': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const renderStars = (note) => {
        return (
            <div className="flex items-center gap-1">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="text-sm font-medium">{note}</span>
                <span className="text-xs text-gray-500">({Math.floor(note * 10)} avis)</span>
            </div>
        );
    };

    // Fonction pour gérer l'envoi de message (AJOUTÉE)
    const handleSendMessage = (freelancer) => {
        alert(`Envoi de message à ${freelancer.nom}`);
    };

    // Fonction pour ServiceIcon (AJOUTÉE)
    const ServiceIcon = ({ serviceType }) => {
        return <Briefcase size={16} className="text-blue-600" />;
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Gestion des Freelancers</h1>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Gérez et surveillez tous vos freelancers en un seul endroit
                    </p>
                </div>

                {/* Barre d'actions */}
                <div className={`p-6 rounded-2xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                            {/* Barre de recherche */}
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un freelancer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                            </div>

                            {/* Filtres */}
                            <div className="flex flex-col sm:flex-row gap-2">
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
                                        <option value="en_attente">En attente</option>
                                        <option value="suspendu">Suspendu</option>
                                    </select>
                                </div>

                                <select
                                    value={specialiteFilter}
                                    onChange={(e) => setSpecialiteFilter(e.target.value)}
                                    className={`px-4 py-3 rounded-xl border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-800'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                >
                                    <option value="all">Toutes spécialités</option>
                                    {SPECIALITES.map(spe => (
                                        <option key={spe} value={spe}>{spe}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bouton d'ajout */}
                        <button
                            onClick={handleAddFreelancer}
                            className="w-full lg:w-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            <Plus size={20} />
                            Ajouter Freelancer
                        </button>
                    </div>
                </div>

                {/* Tableau des freelancers */}
                <div className={`rounded-2xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Freelancer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Spécialité</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Note</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Missions</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Revenu</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFreelancers.map((freelancer) => (
                                    <tr 
                                        key={freelancer.id} 
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
                                                    <p className="font-semibold">{freelancer.nom}</p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        ID: {freelancer.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={16} className="text-gray-400" />
                                                    <span className="text-sm">{freelancer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <span className="text-sm">{freelancer.telephone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-gray-400" />
                                                <span className="text-sm font-medium">{freelancer.specialite}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {freelancer.note > 0 ? renderStars(freelancer.note) : 'Aucune note'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold">{freelancer.missionsTotal}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-green-600">
                                                {freelancer.revenuTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}DH
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-28 ${getStatusColor(freelancer.statut)}`}>
                                                {getStatusIcon(freelancer.statut)}
                                                {getStatusText(freelancer.statut)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(freelancer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditFreelancer(freelancer)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFreelancer(freelancer.id)}
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

                    {filteredFreelancers.length === 0 && (
                        <div className="text-center py-12">
                            <User size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucun freelancer trouvé
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'ajout/modification */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-3xl rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h2 className="text-xl font-bold">
                                {editingFreelancer ? 'Modifier le Freelancer' : 'Ajouter un Freelancer'}
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

                            {/* Specialite + Statut */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Spécialité
                                    </label>
                                    <select
                                        value={formData.specialite}
                                        onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    >
                                        {SPECIALITES.map(spe => (
                                            <option key={spe} value={spe}>{spe}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Statut
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
                                        <option value="en_attente">En attente</option>
                                        <option value="suspendu">Suspendu</option>
                                    </select>
                                </div>
                            </div>

                            {/* Mot de passe généré automatiquement */}
                            {!editingFreelancer && (
                                <div>
                                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Mot de passe généré *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.password}
                                            className={`flex-1 px-3 py-2 rounded-lg border text-sm font-mono ${
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
                                            className="px-3 py-2 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                                        >
                                            Régénérer
                                        </button>
                                    </div>
                                </div>
                            )}

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
                                    {editingFreelancer ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de détails */}
            {showDetailModal && selectedFreelancer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-4xl rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Détails du Freelancer</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className={`p-2 rounded-full transition ${
                                    isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                }`}
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Carte Profil Principale */}
                                <div className={`lg:col-span-2 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                                {selectedFreelancer.prenom?.charAt(0)}{selectedFreelancer.nom?.charAt(0)}
                                            </div>
                                            
                                            {/* Indicateur estConnecte */}
                                            <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${selectedFreelancer.estConnecte ? 'bg-green-500' : 'bg-gray-400'}`} title={selectedFreelancer.estConnecte ? 'En ligne' : 'Hors ligne'}></div>
                                        </div>
                                        
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    {/* Nom avec badge vérifié */}
                                                    <div className="flex items-center gap-2">
                                                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {selectedFreelancer.prenom} {selectedFreelancer.nom}
                                                        </h2>
                                                        {selectedFreelancer.verifie && (
                                                            <VerifiedAccount size={20} className="text-blue-500 fill-current" title="Compte vérifié" />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Liste des services offerts avec icônes */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedFreelancer.services?.map((service, index) => (
                                                            <span 
                                                                key={index}
                                                                onClick={() => setSelectedService(service)}
                                                                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors"
                                                            >
                                                                <ServiceIcon serviceType={service.type} />
                                                                {service.type}
                                                                <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                                                                    {service.tarifBase} DHS
                                                                </span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {/* Statut de disponibilité */}
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    selectedFreelancer.statut === 'actif' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                    selectedFreelancer.statut === 'en_attente' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                                    'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                    {getStatusText(selectedFreelancer.statut)}
                                                </span>
                                            </div>
                                            
                                            {/* Informations détaillées */}
                                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <p className="flex items-center gap-2"><Hash size={16} /> {selectedFreelancer.id}</p>
                                                <p className="flex items-center gap-2"><MapPin size={16} /> {selectedFreelancer.ville}</p>
                                                <p className="flex items-center gap-2"><Calendar size={16} /> {selectedFreelancer.dateInscription}</p>
                                                <p className="flex items-center gap-2"><Mail size={16} /> {selectedFreelancer.email}</p>
                                                <p className="flex items-center gap-2"><Smartphone size={16} /> {selectedFreelancer.telephone}</p>
                                                <p className="flex items-center gap-2"><Building size={16} /> {selectedFreelancer.detailsCompteBancaire}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Actions */}
                                <div className="space-y-6">
                                    {/* Statut Actuel */}
                                    <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Activity size={20} />
                                            Statut Actuel
                                        </h3>
                                        <div className={`p-4 rounded-xl border-2 ${getStatusColor(selectedFreelancer.statut)} mb-4`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                {getStatusIcon(selectedFreelancer.statut)}
                                                <div>
                                                    <span className="font-bold text-lg block">{getStatusText(selectedFreelancer.statut)}</span>
                                                    <p className="text-sm opacity-75">
                                                        {selectedFreelancer.statut === 'actif' && 'Le freelancer peut recevoir des missions'}
                                                        {selectedFreelancer.statut === 'en_attente' && 'En attente de validation des documents'}
                                                        {selectedFreelancer.statut === 'suspendu' && 'Le freelancer est temporairement suspendu'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleChangeStatus(selectedFreelancer.id, 'actif')}
                                                disabled={selectedFreelancer.statut === 'actif'}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
                                            >
                                                <CheckCircle size={18} />
                                                Activer
                                            </button>
                                            <button
                                                onClick={() => handleChangeStatus(selectedFreelancer.id, 'suspendu')}
                                                disabled={selectedFreelancer.statut === 'suspendu'}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
                                            >
                                                <XCircle size={18} />
                                                Suspendre
                                            </button>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <FileText size={20} />
                                            Documents
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedFreelancer.documents?.map((doc, index) => (
                                                <div key={index} className={`flex justify-between items-center p-4 rounded-lg border-2 border-dashed transition-all hover:shadow-md ${
                                                    isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={18} className="text-blue-500" />
                                                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doc}</span>
                                                    </div>
                                                    <button 
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                                        title="Télécharger"
                                                        onClick={() => generatePDF(doc, selectedFreelancer)}
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour les détails du service */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Détails du Service</h3>
                            <button 
                                onClick={() => setSelectedService(null)}
                                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <ServiceIcon serviceType={selectedService.type} />
                                <div>
                                    <h4 className="font-bold text-lg">{selectedService.type}</h4>
                                    <p className="text-sm text-gray-500">{selectedService.description}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Tarif de base: <span className="text-green-600">{selectedService.tarifBase} DH</span></p>
                                <div>
                                    <p className="font-semibold mb-2">Options disponibles:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedService.options?.map((option, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}