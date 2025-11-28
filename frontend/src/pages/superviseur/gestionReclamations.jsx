import React, { useContext, useState } from 'react';
import { 
    Search, Filter, RefreshCcw, Eye, UserPlus, CheckCircle, 
    X, MessageSquare, Clock, Send, User, Shield, AlertTriangle,
    PauseCircle, RotateCcw
} from 'lucide-react';
import { SuperviseurContext } from './superviseurContext';

// Couleurs
const COLORS = {
    primary: '#2d2c86',
    secondary: '#3ec0f0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    textSecondary: '#918a84',
};

// Données fictives pour les réclamations
const MOCK_RECLAMATIONS = [
    { 
        id: 'REC-2024-001', 
        client: 'Yassine A.', 
        email: 'yassine@mail.com', 
        titre: 'Problème de paiement', 
        agent: 'Agent Karim', 
        statut: 'Ouvert', 
        urgence: 'High', 
        date: '2025-11-19', 
        description: "Le paiement a été débité mais la commande n'est pas validée.",
        transfere: true,
        raisonTransfert: "Le support n'a pas pu résoudre le problème dans les délais impartis",
        messages: [
            { id: 1, auteur: 'Client', message: "Bonjour, mon paiement a été débité mais ma commande n'est pas validée. Que se passe-t-il ?", date: '2025-11-19 10:30' },
            { id: 2, auteur: 'Support', message: "Bonjour, nous vérifions avec notre service financier. Nous vous tiendrons informé.", date: '2025-11-19 11:15' }
        ]
    },
    { 
        id: 'REC-2024-002', 
        client: 'Sara B.', 
        email: 'sara@mail.com', 
        titre: 'Freelancer absent', 
        agent: 'Non assigné', 
        statut: 'En cours', 
        urgence: 'Medium', 
        date: '2025-11-18', 
        description: "Le freelancer ne s'est pas présenté à l'heure prévue.",
        transfere: false,
        raisonTransfert: "",
        messages: [
            { id: 1, auteur: 'Client', message: "Le freelancer n'est jamais venu à mon rendez-vous. Je suis très déçu.", date: '2025-11-18 09:20' }
        ]
    },
    { 
        id: 'REC-2024-003', 
        client: 'Ahmed K.', 
        email: 'ahmed@mail.com', 
        titre: 'Qualité du service', 
        agent: 'Agent Lina', 
        statut: 'Résolu', 
        urgence: 'Low', 
        date: '2025-11-15', 
        description: "Le nettoyage n'était pas complet dans la cuisine.",
        transfere: true,
        raisonTransfert: "Réclamation complexe nécessitant une approbation supérieure",
        messages: [
            { id: 1, auteur: 'Client', message: "La cuisine n'a pas été nettoyée correctement. Il reste des taches sur le plan de travail.", date: '2025-11-15 14:00' },
            { id: 2, auteur: 'Support', message: "Nous allons envoyer un autre freelancer pour compléter le nettoyage.", date: '2025-11-15 15:30' },
            { id: 3, auteur: 'Superviseur', message: "Problème résolu. Un remboursement partiel a été accordé.", date: '2025-11-16 10:00' }
        ]
    },
];

// Liste des agents disponibles pour la réassignation
const AGENTS_DISPONIBLES = [
    'Agent Karim',
    'Agent Lina', 
    'Agent Samir',
    'Agent Fatima',
    'Non assigné'
];

export default function ReclamationsPage() {
    const {isDarkMode} = useContext(SuperviseurContext);
    const [reclamations, setReclamations] = useState(MOCK_RECLAMATIONS);
    const [selectedTicket, setSelectedTicket] = useState(null); 
    const [newMessage, setNewMessage] = useState('');
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState('');
    
    // États pour les filtres
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrer les réclamations
    const filteredReclamations = reclamations.filter(ticket => {
        let statusMatch = true;
        if (filterStatus === 'All') {
            statusMatch = ticket.statut !== 'Résolu';
        } else {
            statusMatch = ticket.statut === filterStatus;
        }

        const searchLower = searchTerm.toLowerCase();
        const searchMatch = 
            ticket.id.toLowerCase().includes(searchLower) ||
            ticket.client.toLowerCase().includes(searchLower) ||
            ticket.titre.toLowerCase().includes(searchLower);

        return statusMatch && searchMatch;
    });

    // Stats rapides
    const stats = {
        ouvert: reclamations.filter(r => r.statut === 'Ouvert').length,
        enCours: reclamations.filter(r => r.statut === 'En cours').length,
        resolu: reclamations.filter(r => r.statut === 'Résolu').length,
        transfere: reclamations.filter(r => r.transfere).length,
        enAttente: reclamations.filter(r => r.statut === 'En attente').length,
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'Ouvert': return 'bg-red-100 text-red-700 border-red-200';
            case 'En cours': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Résolu': return 'bg-green-100 text-green-700 border-green-200';
            case 'En attente': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'High': return 'text-red-600 font-bold';
            case 'Medium': return 'text-orange-500 font-medium';
            case 'Low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    // Envoyer un nouveau message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedTicket) return;

        const updatedMessages = [
            ...selectedTicket.messages,
            {
                id: selectedTicket.messages.length + 1,
                auteur: 'Superviseur',
                message: newMessage,
                date: new Date().toLocaleString('fr-FR')
            }
        ];

        const updatedTicket = {
            ...selectedTicket,
            messages: updatedMessages
        };

        setSelectedTicket(updatedTicket);
        
        // Mettre à jour la liste des réclamations
        setReclamations(reclamations.map(ticket => 
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));

        setNewMessage('');
    };

    // Fermer la réclamation (Marquer comme Résolu)
    const handleCloseReclamation = () => {
        if (!selectedTicket) return;

        const messageFermeture = {
            id: selectedTicket.messages.length + 1,
            auteur: 'Système',
            message: "La réclamation a été marquée comme résolue et fermée. Un email de confirmation a été envoyé au client. Aucun message supplémentaire ne sera reçu après cette fermeture.",
            date: new Date().toLocaleString('fr-FR')
        };

        const updatedTicket = {
            ...selectedTicket,
            statut: 'Résolu',
            messages: [...selectedTicket.messages, messageFermeture]
        };

        setSelectedTicket(updatedTicket);
        setReclamations(reclamations.map(ticket => 
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));

        // Simulation d'envoi d'email au client
        setTimeout(() => {
            alert(`Email envoyé à ${selectedTicket.client} : Votre réclamation #${selectedTicket.id} a été résolue. La réclamation est maintenant fermée.`);
        }, 500);
    };

    // Réassigner à un agent
    const handleReassignerAgent = () => {
        if (!selectedTicket) return;
        setShowReassignModal(true);
        setSelectedAgent(selectedTicket.agent);
    };

    const confirmerReassignation = () => {
        if (!selectedTicket || !selectedAgent) return;

        const messageReassignation = {
            id: selectedTicket.messages.length + 1,
            auteur: 'Système',
            message: `La réclamation a été réassignée à ${selectedAgent}.`,
            date: new Date().toLocaleString('fr-FR')
        };

        const updatedTicket = {
            ...selectedTicket,
            agent: selectedAgent,
            messages: [...selectedTicket.messages, messageReassignation]
        };

        setSelectedTicket(updatedTicket);
        setReclamations(reclamations.map(ticket => 
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));

        setShowReassignModal(false);
        setSelectedAgent('');
    };

    // Mettre en attente
    const handleMettreEnAttente = () => {
        if (!selectedTicket) return;

        const messageAttente = {
            id: selectedTicket.messages.length + 1,
            auteur: 'Système',
            message: "La réclamation a été mise en attente en attendant des informations supplémentaires.",
            date: new Date().toLocaleString('fr-FR')
        };

        const updatedTicket = {
            ...selectedTicket,
            statut: 'En attente',
            messages: [...selectedTicket.messages, messageAttente]
        };

        setSelectedTicket(updatedTicket);
        setReclamations(reclamations.map(ticket => 
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
    };

    // Réouvrir une réclamation
    const handleReouvrirReclamation = () => {
        if (!selectedTicket) return;

        const messageReouverture = {
            id: selectedTicket.messages.length + 1,
            auteur: 'Système',
            message: "La réclamation a été réouverte.",
            date: new Date().toLocaleString('fr-FR')
        };

        const updatedTicket = {
            ...selectedTicket,
            statut: 'Ouvert',
            messages: [...selectedTicket.messages, messageReouverture]
        };

        setSelectedTicket(updatedTicket);
        setReclamations(reclamations.map(ticket => 
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            
            {/* --- 1. HEADER & STATS --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>Réclamations</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Gestion centralisée des tickets support.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div><p className="text-xs">Ouvertes</p><p className={`font-bold`}>{stats.ouvert}</p></div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div><p className="text-xs">En cours</p><p className={`font-bold`}>{stats.enCours}</p></div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <div><p className="text-xs">Transférées</p><p className={`font-bold`}>{stats.transfere}</p></div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div><p className="text-xs">En attente</p><p className={`font-bold`}>{stats.enAttente}</p></div>
                    </div>
                </div>
            </div>

            {/* --- 2. BARRE D'ACTIONS (Filtres, Recherche) --- */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    {/* Champ de Recherche */}
                    <div className="relative flex-1 max-w-md">
                        <Search 
                            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                            size={20} 
                        />
                        <input 
                            type="text" 
                            placeholder="Rechercher par référence, client..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`
                                w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 transition
                                ${isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500' 
                                    : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-blue-100 focus:border-blue-400'}
                            `}
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <button className={`p-2 rounded-lg border transition ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            <RefreshCcw size={20} />
                        </button>
                        
                        <div className="relative">
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`appearance-none pl-10 pr-8 py-2 rounded-lg border outline-none cursor-pointer transition
                                    ${isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                <option value="All">Tous (sauf résolus)</option>
                                <option value="Ouvert">Ouvert</option>
                                <option value="En cours">En cours</option>
                                <option value="En attente">En attente</option>
                                <option value="Résolu">Résolu (Archives)</option>
                            </select>
                            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. TABLEAU DES RÉCLAMATIONS --- */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-left text-xs font-semibold uppercase tracking-wider border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                            <tr>
                                <th className="px-6 py-4">Réf</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Titre</th>
                                <th className="px-6 py-4">Assigné à</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Transfert</th>
                                <th className="px-6 py-4">Urgence</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredReclamations.length > 0 ? (
                                filteredReclamations.map((ticket) => (
                                    <tr key={ticket.id} className={`transition ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                                        <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {ticket.client.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.client}</p>
                                                    <p className="text-xs text-gray-400">{ticket.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{ticket.titre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {ticket.agent === 'Non assigné' ? (
                                                <span className="italic text-gray-400">--</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-indigo-500 font-medium">
                                                    <UserPlus size={14} /> {ticket.agent}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.statut)}`}>
                                                {ticket.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {ticket.transfere ? (
                                                <div className="flex items-center gap-1 text-purple-600 text-xs">
                                                    <Shield size={14} />
                                                    <span>Transféré</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Direct</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <span className={getUrgencyColor(ticket.urgence)}>{ticket.urgence}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{ticket.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition" 
                                                    title="Voir détails"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        Aucune réclamation trouvée pour ces filtres.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 4. MODAL DE DÉTAILS --- */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        
                        {/* Modal Header */}
                        <div className={`px-8 py-6 border-b flex justify-between items-start ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold">Ticket #{selectedTicket.id}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket.statut)}`}>
                                        {selectedTicket.statut}
                                    </span>
                                    {selectedTicket.transfere && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                                            <Shield size={12} />
                                            Transféré du Support
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Clock size={14} /> Créé le {selectedTicket.date} • 
                                    Urgence : <span className={getUrgencyColor(selectedTicket.urgence)}>{selectedTicket.urgence}</span> • 
                                    Client : <span className="font-medium">{selectedTicket.client}</span>
                                </p>
                                
                                {/* Affichage de la raison du transfert */}
                                {selectedTicket.transfere && selectedTicket.raisonTransfert && (
                                    <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                                            <div>
                                                <p className="text-yellow-800 font-medium text-sm">Raison du transfert :</p>
                                                <p className="text-yellow-700 text-sm">{selectedTicket.raisonTransfert}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Colonne de gauche - Description et Discussion */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Description */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Description</h4>
                                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-50/30 border-blue-100'}`}>
                                            <p className="leading-relaxed">{selectedTicket.description}</p>
                                        </div>
                                    </div>

                                    {/* Discussion */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                            <MessageSquare size={16} />
                                            Discussion ({selectedTicket.messages.length} messages)
                                        </h4>
                                        
                                        <div className={`space-y-4 max-h-96 overflow-y-auto p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            {selectedTicket.messages.map((msg) => (
                                                <div key={msg.id} className={`p-3 rounded-lg ${
                                                    msg.auteur === 'Client' 
                                                        ? 'bg-orange-50 border border-orange-100' 
                                                        : msg.auteur === 'Superviseur'
                                                        ? 'bg-blue-50 border border-blue-100'
                                                        : msg.auteur === 'Système'
                                                        ? 'bg-green-50 border border-green-100'
                                                        : 'bg-gray-100 border border-gray-200'
                                                }`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-semibold text-sm ${
                                                                msg.auteur === 'Client' ? 'text-orange-700' :
                                                                msg.auteur === 'Superviseur' ? 'text-blue-700' :
                                                                msg.auteur === 'Système' ? 'text-green-700' :
                                                                'text-gray-700'
                                                            }`}>
                                                                {msg.auteur}
                                                            </span>
                                                            {msg.auteur === 'Client' && <User size={14} className="text-orange-600" />}
                                                            {msg.auteur === 'Superviseur' && <Shield size={14} className="text-blue-600" />}
                                                            {msg.auteur === 'Système' && <CheckCircle size={14} className="text-green-600" />}
                                                        </div>
                                                        <span className="text-xs text-gray-500">{msg.date}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{msg.message}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Formulaire d'envoi de message (seulement si non résolu) */}
                                        {selectedTicket.statut !== 'Résolu' && (
                                            <div className="mt-4">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Tapez votre réponse au client..."
                                                        className={`flex-1 px-4 py-3 rounded-lg border outline-none focus:ring-2 transition
                                                            ${isDarkMode 
                                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500' 
                                                                : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-blue-100 focus:border-blue-400'}
                                                        `}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        disabled={!newMessage.trim()}
                                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                                                    >
                                                        <Send size={16} />
                                                        Envoyer
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Colonne de droite - Actions et Informations */}
                                <div className="space-y-6">
                                    {/* Actions */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Actions</h4>
                                        <div className="space-y-3">
                                            {selectedTicket.statut !== 'Résolu' ? (
                                                <>
                                                    <button
                                                        onClick={handleCloseReclamation}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        <CheckCircle size={16} />
                                                        Marquer comme Résolu
                                                    </button>
                                                    <button
                                                        onClick={handleReassignerAgent}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        <UserPlus size={16} />
                                                        Réassigner à un Agent
                                                    </button>
                                                    <button
                                                        onClick={handleMettreEnAttente}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                                    >
                                                        <PauseCircle size={16} />
                                                        Mettre en Attente
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={handleReouvrirReclamation}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                                >
                                                    <RotateCcw size={16} />
                                                    Réouvrir le Ticket
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Informations du ticket */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Informations</h4>
                                        <div className={`space-y-3 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Statut:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.statut)}`}>
                                                    {selectedTicket.statut}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Urgence:</span>
                                                <span className={getUrgencyColor(selectedTicket.urgence)}>{selectedTicket.urgence}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Assigné à:</span>
                                                <span className="text-sm font-medium">{selectedTicket.agent}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Date création:</span>
                                                <span className="text-sm">{selectedTicket.date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Transfert:</span>
                                                <span className={`text-sm ${selectedTicket.transfere ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                                                    {selectedTicket.transfere ? 'Oui' : 'Non'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message important si résolu */}
                                    {selectedTicket.statut === 'Résolu' && (
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="text-green-800 font-medium text-sm">Réclamation Résolue</p>
                                                    <p className="text-green-700 text-xs mt-1">
                                                        Cette réclamation est fermée. Le client a été informé et aucun message supplémentaire ne sera reçu.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE RÉASSIGNATION --- */}
            {showReassignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className="text-lg font-bold">Réassigner la réclamation</h3>
                            <p className="text-sm text-gray-500 mt-1">Choisissez un agent à qui assigner cette réclamation</p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Agent assigné</label>
                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 transition
                                        ${isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' 
                                            : 'bg-white border-gray-200 text-gray-700 focus:ring-blue-100 focus:border-blue-400'}
                                    `}
                                >
                                    <option value="">Sélectionnez un agent</option>
                                    {AGENTS_DISPONIBLES.map(agent => (
                                        <option key={agent} value={agent}>{agent}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowReassignModal(false)}
                                    className={`flex-1 px-6 py-3 rounded-lg border transition ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmerReassignation}
                                    disabled={!selectedAgent}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}