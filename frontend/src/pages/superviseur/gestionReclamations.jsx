import React, { useState } from 'react';
import { 
    Search, Filter, RefreshCcw, Eye, UserPlus, CheckCircle, 
    X, MessageSquare, Clock
} from 'lucide-react';

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
    { id: 'REC-2024-001', client: 'Yassine A.', email: 'yassine@mail.com', titre: 'Problème de paiement', agent: 'Agent Karim', statut: 'Ouvert', urgence: 'High', date: '2025-11-19', description: "Le paiement a été débité mais la commande n'est pas validée." },
    { id: 'REC-2024-002', client: 'Sara B.', email: 'sara@mail.com', titre: 'Freelancer absent', agent: 'Non assigné', statut: 'En cours', urgence: 'Medium', date: '2025-11-18', description: "Le freelancer ne s'est pas présenté à l'heure prévue." },
    { id: 'REC-2024-003', client: 'Ahmed K.', email: 'ahmed@mail.com', titre: 'Qualité du service', agent: 'Agent Lina', statut: 'Résolu', urgence: 'Low', date: '2025-11-15', description: "Le nettoyage n'était pas complet dans la cuisine." },
    { id: 'REC-2024-004', client: 'Fatima Z.', email: 'fatima@mail.com', titre: 'Erreur facture', agent: 'Agent Karim', statut: 'Ouvert', urgence: 'Medium', date: '2025-11-20', description: "Erreur sur le montant de la facture." },
];

export default function ReclamationsPage({ isDarkMode }) {
    const [reclamations] = useState(MOCK_RECLAMATIONS);
    const [selectedTicket, setSelectedTicket] = useState(null); 
    
    // États pour les filtres
    const [filterStatus, setFilterStatus] = useState('All'); // All, Ouvert, En cours, Résolu
    const [searchTerm, setSearchTerm] = useState(''); // Texte de recherche

    // --- LOGIQUE DE FILTRAGE ---
    const filteredReclamations = reclamations.filter(ticket => {
        // 1. Filtre par Statut
        let statusMatch = true;
        if (filterStatus === 'All') {
            // Par défaut ("All"), on cache les tickets "Résolu" comme tu as demandé
            // Sauf si l'utilisateur veut explicitement voir "Résolu" via le dropdown
            statusMatch = ticket.statut !== 'Résolu';
        } else {
            // Sinon, on montre exactement ce qui est demandé (ex: 'Résolu' ou 'Ouvert')
            statusMatch = ticket.statut === filterStatus;
        }

        // 2. Filtre par Recherche (ID, Client ou Titre)
        const searchLower = searchTerm.toLowerCase();
        const searchMatch = 
            ticket.id.toLowerCase().includes(searchLower) ||
            ticket.client.toLowerCase().includes(searchLower) ||
            ticket.titre.toLowerCase().includes(searchLower);

        return statusMatch && searchMatch;
    });


    // Stats rapides (Calculées sur la totalité des données, pas seulement filtrées)
    const stats = {
        ouvert: reclamations.filter(r => r.statut === 'Ouvert').length,
        enCours: reclamations.filter(r => r.statut === 'En cours').length,
        resolu: reclamations.filter(r => r.statut === 'Résolu').length,
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'Ouvert': return 'bg-red-100 text-red-700 border-red-200';
            case 'En cours': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Résolu': return 'bg-green-100 text-green-700 border-green-200';
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

    return (
        <div className="space-y-6 animate-fade-in">
            
            {/* --- 1. HEADER & STATS --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>Réclamations</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Gestion centralisée des tickets support.</p>
                </div>
                
                <div className="flex gap-4 ${isDarkMode}">
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3`}>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div><p className="text-xs">Ouvertes</p><p className={`font-bold`}>{stats.ouvert}</p></div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3`}>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div><p className="text-xs">En cours</p><p className={`font-bold`}>{stats.enCours}</p></div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3`}>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div><p className="text-xs">Résolues</p><p className={`font-bold`}>{stats.resolu}</p></div>
                    </div>
                </div>
            </div>

            {/* --- 2. BARRE D'ACTIONS (Filtres, Recherche) --- */}
            <div className={`p-4 rounded-xl border flex flex-wrap gap-4 justify-between items-center ${isDarkMode}`}>
                
           {/* Champ de Recherche avec Dark Mode */}
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
                            <option value="All">En cours & Ouvert</option>
                            <option value="Ouvert">Ouvert</option>
                            <option value="En cours">En cours</option>
                            <option value="Résolu">Résolu (Archives)</option>
                        </select>
                        <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    </div>
                </div>
            </div>

            {/* --- 3. TABLEAU DES RÉCLAMATIONS --- */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-left text-xs font-semibold uppercase tracking-wider border-b ${isDarkMode}`}>
                            <tr>
                                <th className="px-6 py-4">Réf</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Titre</th>
                                <th className="px-6 py-4">Assigné à</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Urgence</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                            {/* Utilisation de filteredReclamations au lieu de reclamations */}
                            {filteredReclamations.length > 0 ? (
                                filteredReclamations.map((ticket) => (
                                    <tr key={ticket.id} className={`transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-700'}`}>
                                        <td className={`px-6 py-4 font-medium ${isDarkMode}`}>{ticket.id}</td>
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
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        Aucune réclamation trouvée pour ces filtres.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 4. MODAL DE DÉTAILS (Overlay) --- */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        
                        {/* Modal Header */}
                        <div className={`px-8 py-6 border-b flex justify-between items-start ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold">Ticket #{selectedTicket.id}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket.statut)}`}>
                                        {selectedTicket.statut}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Clock size={14} /> Créé le {selectedTicket.date} • Urgence : <span className={getUrgencyColor(selectedTicket.urgence)}>{selectedTicket.urgence}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* ... (Contenu du modal identique à avant) ... */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Description</h4>
                                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-50/30 border-blue-100'}`}>
                                            <p className="leading-relaxed">{selectedTicket.description}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* ... */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}