import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
    Check, X, FileText, Search, DollarSign, Clock, CheckCircle, 
    XCircle, Filter, RefreshCcw, MessageSquare, Send, User, Shield,
    RotateCcw
} from 'lucide-react';
import { SuperviseurContext } from './superviseurContext';

// Données fictives enrichies
const MOCK_REFUNDS = [
    { 
        id: 'R-901', 
        commande: '#CMD-442', 
        client: 'Yassine A.', 
        email: 'yassine@email.com',
        montant: '150.00', 
        motif: 'Annulation prestataire', 
        description: 'Le prestataire n\'est pas venu au rendez-vous prévu',
        date: '19 Nov 2024', 
        statut: 'En attente',
        messages: [
            { id: 1, auteur: 'Client', message: "Bonjour, le prestataire ne s'est pas présenté à l'heure convenue. Je demande un remboursement.", date: '2024-11-19 10:30' },
            { id: 2, auteur: 'Support', message: "Nous vérifions avec le prestataire. Nous vous tiendrons informé.", date: '2024-11-19 11:15' }
        ]
    },
    { 
        id: 'R-902', 
        commande: '#CMD-331', 
        client: 'Mouna L.', 
        email: 'mouna@email.com',
        montant: '300.50', 
        motif: 'Service non rendu', 
        description: 'Le service n\'a pas été effectué correctement',
        date: '18 Nov 2024', 
        statut: 'En attente',
        messages: [
            { id: 1, auteur: 'Client', message: "Le nettoyage n'a pas été fait correctement. Il reste de la saleté partout.", date: '2024-11-18 14:20' }
        ]
    },
    { 
        id: 'R-903', 
        commande: '#CMD-210', 
        client: 'Karim B.', 
        email: 'karim@email.com',
        montant: '45.00', 
        motif: 'Erreur montant', 
        description: 'Montant facturé incorrect',
        date: '15 Nov 2024', 
        statut: 'Validé',
        messages: [
            { id: 1, auteur: 'Client', message: "J'ai été facturé 450DH de trop sur ma commande.", date: '2024-11-15 09:45' },
            { id: 2, auteur: 'Superviseur', message: "Nous avons vérifié et effectué le remboursement. Désolé pour cet erreur.", date: '2024-11-15 10:30' }
        ]
    },
    { 
        id: 'R-904', 
        commande: '#CMD-105', 
        client: 'Sara K.', 
        email: 'sara@email.com',
        montant: '120.00', 
        motif: 'Insatisfaction', 
        description: 'Client non satisfait du service',
        date: '10 Nov 2024', 
        statut: 'Refusé temporairement',
        messages: [
            { id: 1, auteur: 'Client', message: "Je ne suis pas satisfait de la qualité du service.", date: '2024-11-10 16:00' },
            { id: 2, auteur: 'Superviseur', message: "Pouvez-vous nous expliquer plus en détail ce qui ne vous a pas convenu ? Nous voulons comprendre votre situation.", date: '2024-11-10 17:30' },
            { id: 3, auteur: 'Client', message: "Le prestataire a utilisé des produits qui ont abîmé mes meubles.", date: '2024-11-11 09:15' }
        ]
    },
];

export default function RemboursementSuperviseurPage() {
    const { isDarkMode } = useContext(SuperviseurContext);
    const [refunds, setRefunds] = useState(MOCK_REFUNDS);
    const [filterStatus, setFilterStatus] = useState('En attente');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    // Filtrer les remboursements
    const filteredRefunds = refunds.filter(r => {
        const statusMatch = filterStatus === 'All' || r.statut === filterStatus;
        const searchMatch = r.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.id.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    });

    // Action de validation définitive
    const handleApprove = (id) => {
        if(window.confirm('Voulez-vous vraiment valider définitivement ce remboursement ?')) {
            const updatedRefunds = refunds.map(r => {
                if (r.id === id) {
                    const messageSysteme = {
                        id: r.messages.length + 1,
                        auteur: 'Système',
                        message: 'Le remboursement a été validé définitivement. Le montant sera crédité sur votre compte dans les 24-48h.',
                        date: new Date().toLocaleString('fr-FR')
                    };
                    
                    return { 
                        ...r, 
                        statut: 'Validé',
                        messages: [...r.messages, messageSysteme]
                    };
                }
                return r;
            });
            
            setRefunds(updatedRefunds);
            
            if (selectedRefund && selectedRefund.id === id) {
                setSelectedRefund(updatedRefunds.find(r => r.id === id));
            }
        }
    };

    // Action de refus temporaire (discussion reste ouverte)
    const handleTemporaryReject = (id) => {
        const updatedRefunds = refunds.map(r => {
            if (r.id === id) {
                const messageSysteme = {
                    id: r.messages.length + 1,
                    auteur: 'Système',
                    message: 'Votre demande a été temporairement refusée. Vous pouvez fournir plus d\'informations pour que nous réévaluions votre situation.',
                    date: new Date().toLocaleString('fr-FR')
                };
                
                return { 
                    ...r, 
                    statut: 'Refusé temporairement',
                    messages: [...r.messages, messageSysteme]
                };
            }
            return r;
        });
        
        setRefunds(updatedRefunds);
        
        if (selectedRefund && selectedRefund.id === id) {
            setSelectedRefund(updatedRefunds.find(r => r.id === id));
        }
    };

    // Réouvrir une demande refusée
    const handleReopen = (id) => {
        const updatedRefunds = refunds.map(r => {
            if (r.id === id) {
                const messageSysteme = {
                    id: r.messages.length + 1,
                    auteur: 'Système',
                    message: 'La demande a été réouverte. Nous allons réexaminer votre cas.',
                    date: new Date().toLocaleString('fr-FR')
                };
                
                return { 
                    ...r, 
                    statut: 'En attente',
                    messages: [...r.messages, messageSysteme]
                };
            }
            return r;
        });
        
        setRefunds(updatedRefunds);
        
        if (selectedRefund && selectedRefund.id === id) {
            setSelectedRefund(updatedRefunds.find(r => r.id === id));
        }
    };

    // Envoyer un message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedRefund) return;

        const updatedMessages = [
            ...selectedRefund.messages,
            {
                id: selectedRefund.messages.length + 1,
                auteur: 'Superviseur',
                message: newMessage,
                date: new Date().toLocaleString('fr-FR')
            }
        ];

        const updatedRefund = {
            ...selectedRefund,
            messages: updatedMessages
        };

        setSelectedRefund(updatedRefund);
        setRefunds(refunds.map(r => r.id === selectedRefund.id ? updatedRefund : r));
        setNewMessage('');
    };

    // Stats rapides
    const stats = {
        pendingCount: refunds.filter(r => r.statut === 'En attente').length,
        pendingAmount: refunds.filter(r => r.statut === 'En attente').reduce((acc, curr) => acc + parseFloat(curr.montant), 0),
        approvedAmount: refunds.filter(r => r.statut === 'Validé').reduce((acc, curr) => acc + parseFloat(curr.montant), 0),
        temporaryRejected: refunds.filter(r => r.statut === 'Refusé temporairement').length,
    };

    // Helpers de style
    const getStatusBadge = (statut) => {
        switch(statut) {
            case 'Validé': 
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12}/> Validé</span>;
            case 'Refusé temporairement': 
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 flex items-center gap-1 w-fit"><Clock size={12}/> Discussion en cours</span>;
            default: 
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12}/> En attente</span>;
        }
    };

    const getStatusColor = (statut) => {
        switch(statut) {
            case 'Validé': return 'text-green-600';
            case 'Refusé temporairement': return 'text-orange-600';
            default: return 'text-yellow-600';
        }
    };

    const canSendMessages = (statut) => {
        return statut === 'En attente' || statut === 'Refusé temporairement';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            
            {/* --- 1. HEADER & STATS --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Demandes de Remboursement</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Gérez les flux financiers sortants vers les clients.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">En Attente</p>
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.pendingCount} <span className="text-xs font-normal text-gray-400">({stats.pendingAmount} DH)</span></p>
                        </div>
                    </div>
                    <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Total Remboursé</p>
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.approvedAmount} DH</p>
                        </div>
                    </div>
                    <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><MessageSquare size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">En Discussion</p>
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.temporaryRejected}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. BARRE D'ACTIONS --- */}
            <div className={`p-4 rounded-xl border flex flex-wrap gap-4 justify-between items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher (ID, Client, Commande)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 transition
                            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-700 focus:ring-blue-100 focus:border-blue-400'}
                        `}
                    />
                </div>
                
                <div className="flex gap-3">
                    <button className={`p-2 rounded-lg border transition hover:bg-gray-50 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600'}`}>
                        <RefreshCcw size={20} />
                    </button>
                    
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`appearance-none pl-10 pr-8 py-2 rounded-lg border outline-none cursor-pointer hover:bg-gray-50 transition
                                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-700'}
                            `}
                        >
                            <option value="All">Tous les statuts</option>
                            <option value="En attente">En attente</option>
                            <option value="Refusé temporairement">En discussion</option>
                            <option value="Validé">Validé</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            </div>
            
            {/* --- 3. TABLEAU DES REMBOURSEMENTS --- */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className={`text-xs uppercase font-semibold border-b ${isDarkMode ? 'bg-gray-700/50 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Commande</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Montant</th>
                            <th className="px-6 py-4">Motif</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                        {filteredRefunds.length > 0 ? (
                            filteredRefunds.map((r) => (
                                <tr key={r.id} className={`transition ${isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/80'}`}>
                                    <td className={`px-6 py-4 font-mono text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{r.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-indigo-500 font-medium text-sm bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{r.commande}</span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{r.client}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{r.montant} DH</td>
                                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{r.motif}</td>
                                    <td className="px-6 py-4 text-xs text-gray-400">{r.date}</td>
                                    <td className="px-6 py-4">{getStatusBadge(r.statut)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Bouton de discussion */}
                                            <button 
                                                onClick={() => setSelectedRefund(r)}
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition" 
                                                title="Ouvrir la discussion"
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                            
                                            {/* Bouton de réouverture pour les demandes refusées temporairement */}
                                            {r.statut === 'Refusé temporairement' && (
                                                <button 
                                                    onClick={() => handleReopen(r.id)}
                                                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition" 
                                                    title="Réouvrir la demande"
                                                >
                                                    <RotateCcw size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className={`px-6 py-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Aucune demande trouvée.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* --- MODAL DE DISCUSSION --- */}
            {selectedRefund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        
                        {/* Header du modal */}
                        <div className={`px-8 py-6 border-b flex justify-between items-start ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold">Demande {selectedRefund.id}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRefund.statut)} bg-opacity-10`}>
                                        {selectedRefund.statut}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Client: <span className="font-medium">{selectedRefund.client}</span> • 
                                    Commande: <span className="font-medium">{selectedRefund.commande}</span> • 
                                    Montant: <span className="font-bold text-green-600">{selectedRefund.montant} DH</span>
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Motif: <span className="font-medium">{selectedRefund.motif}</span>
                                </p>
                                {selectedRefund.description && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        Description: <span className="font-medium">{selectedRefund.description}</span>
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => setSelectedRefund(null)}
                                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Contenu du modal */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Colonne de discussion */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                            <MessageSquare size={16} />
                                            Discussion ({selectedRefund.messages.length} messages)
                                        </h4>
                                        
                                        <div className={`space-y-4 max-h-96 overflow-y-auto p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            {selectedRefund.messages.map((msg) => (
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

                                        {/* Formulaire d'envoi de message */}
                                        {canSendMessages(selectedRefund.statut) && (
                                            <div className="mt-4">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Tapez votre message au client..."
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

                                {/* Colonne d'informations et actions */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Informations</h4>
                                        <div className={`space-y-3 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Statut:</span>
                                                <span className={`text-sm font-medium ${getStatusColor(selectedRefund.statut)}`}>
                                                    {selectedRefund.statut}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Client:</span>
                                                <span className="text-sm font-medium">{selectedRefund.client}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Email:</span>
                                                <span className="text-sm">{selectedRefund.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Montant:</span>
                                                <span className="text-sm font-bold text-green-600">{selectedRefund.montant} DH</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Date demande:</span>
                                                <span className="text-sm">{selectedRefund.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions selon le statut */}
                                    {selectedRefund.statut === 'En attente' && (
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Décision</h4>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleApprove(selectedRefund.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    <Check size={16} />
                                                    Valider Définitivement
                                                </button>
                                                <button
                                                    onClick={() => handleTemporaryReject(selectedRefund.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                                                >
                                                    <MessageSquare size={16} />
                                                    Demander Plus d'Infos
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRefund.statut === 'Refusé temporairement' && (
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Actions</h4>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleApprove(selectedRefund.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    <Check size={16} />
                                                    Valider Après Discussion
                                                </button>
                                                <button
                                                    onClick={() => handleReopen(selectedRefund.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    <RotateCcw size={16} />
                                                    Remettre en Attente
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                La discussion reste ouverte pour permettre au client de fournir plus de détails.
                                            </p>
                                        </div>
                                    )}

                                    {/* Message si validé */}
                                    {selectedRefund.statut === 'Validé' && (
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="text-green-800 font-medium text-sm">Remboursement Validé</p>
                                                    <p className="text-green-700 text-xs mt-1">
                                                        Cette demande a été traitée définitivement.
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
        </div>
    );
}