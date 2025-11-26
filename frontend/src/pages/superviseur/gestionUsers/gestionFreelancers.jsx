// src/pages/GestionFreelancers.jsx
import React, { useState, useContext } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { 
    Search, Filter, Plus, Edit, Trash2, User, Mail, Phone, 
    MapPin, Calendar, Star, Briefcase, DollarSign, Eye,
    CheckCircle, XCircle, Clock, Download, Send
} from 'lucide-react';

export default function GestionFreelancers() {
    const { isDarkMode } = useContext(SuperviseurContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [specialiteFilter, setSpecialiteFilter] = useState('all');

    // Données exemple des freelancers
    const [freelancers, setFreelancers] = useState([
        {
            id: 1,
            nom: 'Karim Benali',
            email: 'karim.benali@email.com',
            telephone: '+33 6 12 34 56 78',
            adresse: '15 Rue de Marseille, Lyon',
            dateInscription: '2024-01-10',
            statut: 'actif',
            specialite: 'Nettoyage Résidentiel',
            note: 4.8,
            missionsTotal: 45,
            revenuTotal: 12500.00,
            documents: ['CV', 'Certificat', 'RIB'],
            dernierAcces: '2025-11-25 14:30'
        },
        {
            id: 2,
            nom: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            telephone: '+33 6 23 45 67 89',
            adresse: '8 Avenue Victor Hugo, Paris',
            dateInscription: '2024-02-15',
            statut: 'en_attente',
            specialite: 'Nettoyage Bureau',
            note: 0,
            missionsTotal: 0,
            revenuTotal: 0.00,
            documents: ['CV', 'RIB'],
            dernierAcces: '2025-11-24 10:15'
        },
        {
            id: 3,
            nom: 'Ahmed Kone',
            email: 'ahmed.kone@email.com',
            telephone: '+33 6 34 56 78 90',
            adresse: '22 Boulevard Saint-Michel, Bordeaux',
            dateInscription: '2024-03-20',
            statut: 'actif',
            specialite: 'Nettoyage Industriel',
            note: 4.5,
            missionsTotal: 28,
            revenuTotal: 8400.00,
            documents: ['CV', 'Certificat', 'Permis', 'RIB'],
            dernierAcces: '2025-11-25 09:45'
        },
        {
            id: 4,
            nom: 'Laura Dubois',
            email: 'laura.dubois@email.com',
            telephone: '+33 6 45 67 89 01',
            adresse: '5 Rue de la République, Lille',
            dateInscription: '2024-04-05',
            statut: 'suspendu',
            specialite: 'Nettoyage Résidentiel',
            note: 4.2,
            missionsTotal: 32,
            revenuTotal: 7600.00,
            documents: ['CV', 'RIB'],
            dernierAcces: '2025-11-20 16:20'
        },
        {
            id: 5,
            nom: 'Mohammed Ali',
            email: 'mohammed.ali@email.com',
            telephone: '+33 6 56 78 90 12',
            adresse: '18 Place Bellecour, Lyon',
            dateInscription: '2024-05-12',
            statut: 'actif',
            specialite: 'Nettoyage après Construction',
            note: 4.9,
            missionsTotal: 67,
            revenuTotal: 20100.00,
            documents: ['CV', 'Certificat', 'Assurance', 'RIB'],
            dernierAcces: '2025-11-25 11:30'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingFreelancer, setEditingFreelancer] = useState(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        specialite: 'Nettoyage Résidentiel',
        statut: 'actif'
    });

    // Spécialités disponibles
    const SPECIALITES = [
        'Nettoyage Résidentiel',
        'Nettoyage Bureau',
        'Nettoyage Industriel',
        'Nettoyage après Construction',
        'Nettoyage Vitres',
        'Nettoyage Tapis'
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
        setFormData({
            nom: '',
            email: '',
            telephone: '',
            adresse: '',
            specialite: 'Nettoyage Résidentiel',
            statut: 'actif'
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
                freelancer.id === editingFreelancer.id ? { ...formData, id: editingFreelancer.id } : freelancer
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
                documents: ['CV', 'RIB'],
                dernierAcces: new Date().toLocaleString('fr-FR')
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

    // Envoyer un message au freelancer
    const handleSendMessage = (freelancer) => {
        alert(`Message envoyé à ${freelancer.nom} (${freelancer.email})`);
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
                                                {freelancer.revenuTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
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
                                                    onClick={() => handleSendMessage(freelancer)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Envoyer message"
                                                >
                                                    <Send size={16} />
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
                    <div className={`w-full max-w-2xl rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold">
                                {editingFreelancer ? 'Modifier le Freelancer' : 'Ajouter un Freelancer'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.telephone}
                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Spécialité</label>
                                    <select
                                        value={formData.specialite}
                                        onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border ${
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Adresse</label>
                                <textarea
                                    required
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-800'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Statut</label>
                                <select
                                    value={formData.statut}
                                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border ${
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

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 px-6 py-3 rounded-xl border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                                            : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                                    } transition-colors`}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
                                {/* Informations personnelles */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <User size={20} />
                                                Informations Personnelles
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Nom:</span>
                                                    <span className="font-medium">{selectedFreelancer.nom}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Email:</span>
                                                    <span className="font-medium">{selectedFreelancer.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Téléphone:</span>
                                                    <span className="font-medium">{selectedFreelancer.telephone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Adresse:</span>
                                                    <span className="font-medium text-right">{selectedFreelancer.adresse}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <Briefcase size={20} />
                                                Informations Professionnelles
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Spécialité:</span>
                                                    <span className="font-medium">{selectedFreelancer.specialite}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Date d'inscription:</span>
                                                    <span className="font-medium">{selectedFreelancer.dateInscription}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Dernier accès:</span>
                                                    <span className="font-medium">{selectedFreelancer.dernierAcces}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Note moyenne:</span>
                                                    <div className="flex items-center gap-1">
                                                        {selectedFreelancer.note > 0 ? renderStars(selectedFreelancer.note) : 'Aucune note'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                
                                </div>

                                {/* Actions et statut */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Statut Actuel</h3>
                                        <div className={`p-4 rounded-xl border ${getStatusColor(selectedFreelancer.statut)}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusIcon(selectedFreelancer.statut)}
                                                <span className="font-semibold">{getStatusText(selectedFreelancer.statut)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {selectedFreelancer.statut === 'actif' && 'Le freelancer peut recevoir des missions'}
                                                {selectedFreelancer.statut === 'en_attente' && 'En attente de validation des documents'}
                                                {selectedFreelancer.statut === 'suspendu' && 'Le freelancer est temporairement suspendu'}
                                            </p>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleChangeStatus(selectedFreelancer.id, 'actif')}
                                                    disabled={selectedFreelancer.statut === 'actif'}
                                                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                                >
                                                    Activer
                                                </button>
                                                <button
                                                    onClick={() => handleChangeStatus(selectedFreelancer.id, 'suspendu')}
                                                    disabled={selectedFreelancer.statut === 'suspendu'}
                                                    className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                                >
                                                    Suspendre
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Documents</h3>
                                        <div className="space-y-2">
                                            {selectedFreelancer.documents.map((doc, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                                                    <span className="text-sm">{doc}</span>
                                                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleSendMessage(selectedFreelancer)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Send size={16} />
                                            Envoyer un message
                                        </button>
                                        <button
                                            onClick={() => handleEditFreelancer(selectedFreelancer)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            <Edit size={16} />
                                            Modifier le profil
                                        </button>
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