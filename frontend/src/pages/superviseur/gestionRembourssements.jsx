import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
    Check, X, FileText, Search, DollarSign, Clock, CheckCircle, XCircle, Filter, RefreshCcw 
} from 'lucide-react';
import { SuperviseurContext } from './superviseurContext';
// Données fictives
const MOCK_REFUNDS = [
    { id: 'R-901', commande: '#CMD-442', client: 'Yassine A.', montant: '150.00', motif: 'Annulation prestataire', date: '19 Nov 2024', statut: 'En attente' },
    { id: 'R-902', commande: '#CMD-331', client: 'Mouna L.', montant: '300.50', motif: 'Service non rendu', date: '18 Nov 2024', statut: 'En attente' },
    { id: 'R-903', commande: '#CMD-210', client: 'Karim B.', montant: '45.00', motif: 'Erreur montant', date: '15 Nov 2024', statut: 'Validé' },
    { id: 'R-904', commande: '#CMD-105', client: 'Sara K.', montant: '120.00', motif: 'Insatisfaction', date: '10 Nov 2024', statut: 'Refusé' },
];

export default function RemboursementSuperviseurPage() {
    const { isDarkMode } = useContext(SuperviseurContext);
    const [refunds, setRefunds] = useState(MOCK_REFUNDS);
    const [filterStatus, setFilterStatus] = useState('En attente'); // 'All', 'En attente', 'Validé', 'Refusé'
    const [searchTerm, setSearchTerm] = useState('');

    // --- LOGIQUE ---

    // Filtrer les remboursements
    const filteredRefunds = refunds.filter(r => {
        const statusMatch = filterStatus === 'All' || r.statut === filterStatus;
        const searchMatch = r.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.id.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    });

    // Actions de validation/refus (Simulation)
    const handleAction = (id, action) => {
        const newStatus = action === 'approve' ? 'Validé' : 'Refusé';
        if(window.confirm(`Voulez-vous vraiment ${action === 'approve' ? 'valider' : 'refuser'} ce remboursement ?`)) {
            setRefunds(prev => prev.map(r => r.id === id ? { ...r, statut: newStatus } : r));
        }
    };

    // Stats rapides (calculées sur toutes les données)
    const stats = {
        pendingCount: refunds.filter(r => r.statut === 'En attente').length,
        pendingAmount: refunds.filter(r => r.statut === 'En attente').reduce((acc, curr) => acc + parseFloat(curr.montant), 0),
        approvedAmount: refunds.filter(r => r.statut === 'Validé').reduce((acc, curr) => acc + parseFloat(curr.montant), 0),
    };

    // Helpers de style
    const getStatusBadge = (statut) => {
        switch(statut) {
            case 'Validé': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12}/> Validé</span>;
            case 'Refusé': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle size={12}/> Refusé</span>;
            default: return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12}/> En attente</span>;
        }
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
                            <option value="Validé">Validé</option>
                            <option value="Refusé">Refusé</option>
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
                            <th className="px-6 py-4 text-right">Validation</th>
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
                                        {r.statut === 'En attente' ? (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleAction(r.id, 'approve')}
                                                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition" 
                                                    title="Valider"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(r.id, 'reject')}
                                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition" 
                                                    title="Refuser"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Traité</span>
                                        )}
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
        </div>
    );
}