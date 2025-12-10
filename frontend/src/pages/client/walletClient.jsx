import React, { useState, useContext } from 'react';
import { CreditCard, DollarSign, Plus, TrendingDown, Calendar, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { ClientContext } from './clientContext';

const WalletClient = () => {
  const { wallet, isDarkMode } = useContext(ClientContext);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputText: isDarkMode ? 'text-white' : 'text-slate-900',
  };

  // Transactions simulées
  const transactions = [
    {
      id: 1,
      type: 'debit',
      description: 'Nettoyage complet',
      freelancer: 'Ahmed M.',
      amount: '-850.00DH',
      date: '15 Déc 2025',
      time: '10:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      description: 'Nettoyage de vitres',
      freelancer: 'Fatima K.',
      amount: '-450.00DH',
      date: '10 Déc 2025',
      time: '15:00',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      description: 'Remboursement',
      freelancer: 'Service annulé',
      amount: '+300.00DH',
      date: '05 Déc 2025',
      time: '11:20',
      status: 'completed'
    },
    {
      id: 4,
      type: 'debit',
      description: 'Nettoyage bureau',
      freelancer: 'Hassan D.',
      amount: '-1200.00DH',
      date: '01 Déc 2025',
      time: '09:00',
      status: 'completed'
    },
    {
      id: 5,
      type: 'credit',
      description: 'Crédit bonus',
      freelancer: 'Promotion',
      amount: '+500.00DH',
      date: '25 Nov 2025',
      time: '14:45',
      status: 'completed'
    }
  ];

  const handleAddFunds = (e) => {
    e.preventDefault();
    // Logique d'ajout de fonds
    setAmount('');
    setShowAddFunds(false);
  };

  return (
    <div className={`space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Portefeuille</h1>
        <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos paiements et vos transactions</p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Balance */}
        <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border} bg-gradient-to-br from-cyan-500 to-cyan-600 text-white`}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-cyan-100">Solde disponible</p>
            <CreditCard size={32} className="text-cyan-200" />
          </div>
          <h2 className="text-4xl font-bold mb-2">{wallet.balance.toFixed(2)}DH</h2>
          <p className="text-cyan-100 text-sm">Prêt à être dépensé</p>
        </div>

        {/* Total Spent */}
        <div className={`${theme.cardBg} rounded-xl p-8 shadow-sm border ${theme.border}`}>
          <div className="flex items-center justify-between mb-6">
            <p className={`${theme.textSecondary} text-sm`}>Total dépensé</p>
            <TrendingDown className="text-red-500" size={32} />
          </div>
          <h2 className={`text-4xl font-bold ${theme.textMain} mb-2`}>{wallet.totalSpent.toFixed(2)}DH</h2>
          <p className={`${theme.textSecondary} text-sm`}>Depuis la création du compte</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddFunds(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Ajouter des fonds
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold">
          <Download size={20} />
          Télécharger relevé
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-xl max-w-md w-full p-8`}>
            <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Ajouter des fonds</h2>
            
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Montant (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Entrez le montant"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} transition`}
                />
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`py-2 rounded-lg font-semibold transition border ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                  >
                    {val}DH
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFunds(false);
                    setAmount('');
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg transition border ${theme.border} ${theme.textMain}`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions History */}
      <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
        <h2 className={`text-xl font-bold ${theme.textMain} mb-6 flex items-center gap-2`}>
          <Calendar size={24} />
          Historique des transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme.border}`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Description</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Freelancer</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Date</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme.textMuted}`}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className={`border-b ${theme.border} hover:bg-opacity-50 transition`}>
                  <td className={`px-4 py-3 text-sm`}>
                    <div className="flex items-center gap-3">
                      {tx.type === 'debit' ? (
                        <ArrowDownLeft className="text-red-500" size={18} />
                      ) : (
                        <ArrowUpRight className="text-green-500" size={18} />
                      )}
                      <div>
                        <p className={`font-medium ${theme.textMain}`}>{tx.description}</p>
                        <p className={`${theme.textMuted} text-xs`}>{tx.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${theme.textSecondary}`}>{tx.freelancer}</td>
                  <td className={`px-4 py-3 text-sm ${theme.textSecondary}`}>{tx.date}</td>
                  <td className={`px-4 py-3 text-sm text-right font-bold ${tx.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
        <h2 className={`text-xl font-bold ${theme.textMain} mb-6`}>Méthodes de paiement</h2>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${theme.border} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <div>
                <p className={`font-semibold ${theme.textMain}`}>Carte Visa</p>
                <p className={`text-sm ${theme.textSecondary}`}>**** **** **** 4242</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">Par défaut</span>
          </div>

          <button className={`w-full py-3 border-2 border-dashed ${theme.border} rounded-lg transition hover:bg-opacity-50 ${theme.textSecondary}`}>
            + Ajouter une nouvelle méthode de paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletClient;
