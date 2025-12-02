import React, { useState } from 'react';

const Portefeuille = ({ isDarkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    methodType: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    documentFront: null,
    documentBack: null,
    selfie: null
  });

  // Données simulées pour le portefeuille
  const walletData = {
    balance: 2450.75,
    pending: 320.50,
    totalEarned: 12890.25,
    transactions: [
      { id: 1, date: '2024-01-15', description: 'Nettoyage résidentiel - Casablanca', amount: 450.00, status: 'completed', type: 'credit' },
      { id: 2, date: '2024-01-12', description: 'Nettoyage commercial - Rabat', amount: 680.00, status: 'completed', type: 'credit' },
      { id: 3, date: '2024-01-10', description: 'Retrait bancaire', amount: 1000.00, status: 'completed', type: 'debit' },
      { id: 4, date: '2024-01-08', description: 'Nettoyage après déménagement - Casablanca', amount: 320.50, status: 'pending', type: 'credit' },
      { id: 5, date: '2024-01-05', description: 'Nettoyage régulier - Mohammedia', amount: 275.00, status: 'completed', type: 'credit' },
      { id: 6, date: '2024-01-02', description: 'Frais de service', amount: 45.00, status: 'completed', type: 'debit' },
    ]
  };

  // Méthodes de paiement avec statut de vérification
  const [paymentMethods, setPaymentMethods] = useState([
    { 
      id: 1, 
      type: 'visa', 
      name: 'Carte Visa', 
      details: '•••• 1234', 
      verified: true,
      cardNumber: '4111111111111234',
      expiryDate: '12/25',
      cardHolder: 'John Doe'
    },
    { 
      id: 2, 
      type: 'mastercard', 
      name: 'Carte Mastercard', 
      details: '•••• 5678', 
      verified: false,
      cardNumber: '5500000000005678',
      expiryDate: '09/24',
      cardHolder: 'John Doe'
    },
    { 
      id: 3, 
      type: 'paypal', 
      name: 'PayPal', 
      details: 'freelancer@email.com', 
      verified: true,
      email: 'freelancer@email.com'
    }
  ]);

  const stats = [
    { label: 'Solde disponible', value: `${walletData.balance} MAD`, color: 'text-green-600' },
    { label: 'En attente', value: `${walletData.pending} MAD`, color: 'text-yellow-600' },
    { label: 'Total gagné', value: `${walletData.totalEarned} MAD`, color: 'text-blue-600' },
  ];

  // Classes conditionnelles pour le dark mode
  const bgClass = isDarkMode;
  const textClass = isDarkMode;
  const textSecondaryClass = isDarkMode;
  const cardBgClass = isDarkMode;
  const borderClass = isDarkMode;
  const inputBgClass = isDarkMode;
  const tableHeaderBgClass = isDarkMode;
  const tableRowBgClass = isDarkMode;

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (withdrawAmount && parseFloat(withdrawAmount) > 0) {
      if (parseFloat(withdrawAmount) <= walletData.balance) {
        const verifiedMethods = paymentMethods.filter(method => method.verified);
        if (verifiedMethods.length === 0) {
          alert('Veuillez vérifier une méthode de paiement avant de retirer.');
          return;
        }
        
        alert(`Demande de retrait de ${withdrawAmount} MAD envoyée ! Traitement le jour même.`);
        setWithdrawAmount('');
      } else {
        alert('Le montant demandé dépasse votre solde disponible.');
      }
    }
  };

  const startVerification = (methodType) => {
    setVerificationData({
      methodType,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      documentFront: null,
      documentBack: null,
      selfie: null
    });
    setVerificationStep(1);
    setShowVerificationModal(true);
  };

  const handleVerificationNext = () => {
    if (verificationStep === 1) {
      // Validation des informations de carte
      if (!verificationData.cardNumber || !verificationData.expiryDate || !verificationData.cvv || !verificationData.cardHolder) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
    }
    setVerificationStep(verificationStep + 1);
  };

  const handleVerificationBack = () => {
    setVerificationStep(verificationStep - 1);
  };

  const handleFileUpload = (fileType, file) => {
    setVerificationData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const submitVerification = () => {
    // Simulation d'envoi sécurisé au backend
    const newMethod = {
      id: Date.now(),
      type: verificationData.methodType,
      name: verificationData.methodType === 'visa' ? 'Carte Visa' : 
            verificationData.methodType === 'mastercard' ? 'Carte Mastercard' : 'Carte Bancaire',
      details: `•••• ${verificationData.cardNumber.slice(-4)}`,
      verified: false, // En attente de vérification manuelle
      cardNumber: verificationData.cardNumber,
      expiryDate: verificationData.expiryDate,
      cardHolder: verificationData.cardHolder
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setShowVerificationModal(false);
    alert('Votre méthode de paiement a été soumise pour vérification. Vous serez notifié une fois la vérification complétée (24-48h).');
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'paypal': return '📱';
      default: return '🏦';
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'visa': return 'bg-blue-500';
      case 'mastercard': return 'bg-red-500';
      case 'paypal': return 'bg-blue-300';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold`}>Mon Portefeuille</h1>
          <p className={`dark:text-gray-400 mt-2`}>Gérez vos gains et vos retraits</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          {stats.map((stat, index) => (
            <div key={index} className={`rounded-lg shadow p-6 border`}>
              <p className={`text-sm font-medium`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation par onglets */}
        <div className={`rounded-lg shadow mb-8 border`}>
          <div className={`border-b`}>
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Aperçu' },
                { id: 'transactions', label: 'Historique' },
                { id: 'withdraw', label: 'Retrait' },
                { id: 'payment-methods', label: 'Méthodes de Paiement' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : `border-transparent hover:bg-gray-100 dark:hover:text-gray-900 hover:border-gray-300`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className={`text-lg font-medium ${textClass} mb-4`}>Aperçu du portefeuille</h3>
                <div className="space-y-4">
                  <div className={`
                    flex justify-between items-center p-4 rounded-lg ${isDarkMode}
                    border  
                  
                  `}>
                    <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Prochain paiement
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      {walletData.pending} MAD
                    </span>
                  </div>
                  <div className={`
                    flex justify-between items-center p-4 rounded-lg ${isDarkMode}
                    border
                  `}>
                    <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                      Disponible immédiatement
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                      {walletData.balance} MAD
                    </span>
                  </div>
                  <div className={`
                    border rounded-lg p-4 ${isDarkMode}
                    bg-orange-700
                  `}>
                    <p className={`text-sm ${isDarkMode}`}>
                      💡 <strong>Conseil :</strong> Les retraits sont traités le jour même. 
                      Assurez-vous d'avoir une méthode de paiement vérifiée.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 className={`text-lg font-medium ${isDarkMode} mb-4`}>Historique des transactions</h3>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className={tableHeaderBgClass}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${bgClass}`}>
                      {walletData.transactions.map((transaction) => (
                        <tr key={transaction.id} className={tableRowBgClass}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'} {transaction.amount} MAD
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="max-w-md">
                <h3 className={`text-lg font-medium ${textClass} mb-4`}>Demander un retrait</h3>
                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-2`}>
                      Montant à retirer (MAD)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      max={walletData.balance}
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${inputBgClass}`}
                    />
                    <p className={`text-sm ${textSecondaryClass} mt-1`}>
                      Solde disponible: {walletData.balance} MAD
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-2`}>
                      Méthode de retrait
                    </label>
                    <select 
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${inputBgClass}`}
                    >
                      <option value="">Sélectionnez une méthode</option>
                      {paymentMethods
                        .filter(method => method.verified)
                        .map(method => (
                          <option key={method.id} value={method.id}>
                            {method.name} - {method.details}
                          </option>
                        ))
                      }
                      {paymentMethods.filter(method => method.verified).length === 0 && (
                        <option value="">Aucune méthode vérifiée</option>
                      )}
                    </select>
                    {paymentMethods.filter(method => method.verified).length === 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        Veuillez vérifier une méthode de paiement avant de retirer.
                      </p>
                    )}
                  </div>

                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <h4 className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-900'} mb-2`}>
                      Informations importantes
                    </h4>
                    <ul className={`text-sm space-y-1 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      <li>• Retrait minimum: 100 MAD</li>
                      <li>• Frais de traitement: 5 MAD par retrait</li>
                      <li>• Délai de traitement: Le jour même</li>
                      <li>• Les retraits sont traités tous les jours</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) < 100 || !selectedPaymentMethod}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Demander le retrait
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'payment-methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-lg font-medium ${textClass}`}>Méthodes de Paiement</h3>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => startVerification('visa')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      + Ajouter Carte Visa
                    </button>
                    <button 
                      onClick={() => startVerification('mastercard')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      + Ajouter Mastercard
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className={`p-4 border ${borderClass} rounded-lg`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-8 ${getCardColor(method.type)} rounded flex items-center justify-center`}>
                            <span className="text-white font-bold">
                              {getCardIcon(method.type)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className={`font-medium ${textClass}`}>{method.name}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                method.verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {method.verified ? '✓ Vérifiée' : '⏳ En vérification'}
                              </span>
                            </div>
                            <p className={`text-sm ${textSecondaryClass}`}>{method.details}</p>
                            {method.verified && (
                              <p className="text-green-600 text-xs mt-1">✓ Sécurisée et vérifiée</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-sm ${textSecondaryClass}`}>
                            {method.verified ? 'Active' : 'En attente'}
                          </p>
                          {!method.verified && (
                            <p className="text-yellow-600 text-xs">Vérification en cours</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {paymentMethods.length === 0 && (
                    <div className={`text-center py-12 border-2 border-dashed ${borderClass} rounded-lg`}>
                      <p className={textSecondaryClass}>Aucune méthode de paiement ajoutée</p>
                      <p className={`text-sm ${textSecondaryClass} mt-2`}>
                        Ajoutez une méthode de paiement vérifiée pour effectuer des retraits
                      </p>
                    </div>
                  )}
                </div>

                {/* Section d'information sur la sécurité */}
                <div className={`mt-8 border rounded-lg p-6 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`font-medium ${textClass} mb-3`}>🔒 Sécurité des Paiements</h4>
                  <ul className={`text-sm space-y-2 ${textSecondaryClass}`}>
                    <li>• Toutes les données sont cryptées de bout en bout</li>
                    <li>• Conformité PCI DSS niveau 1</li>
                    <li>• Vérification en 2 étapes pour la sécurité</li>
                    <li>• Aucune information de carte n'est stockée sur nos serveurs</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de vérification professionnel */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBgClass} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold ${textClass}`}>
                  Vérification de Méthode de Paiement
                </h3>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex mt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      verificationStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        verificationStep > step ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {verificationStep === 1 && (
                <div>
                  <h4 className={`text-lg font-medium ${textClass} mb-4`}>Informations de la Carte</h4>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${textClass} mb-2`}>
                        Numéro de carte *
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={verificationData.cardNumber}
                        onChange={(e) => setVerificationData({...verificationData, cardNumber: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md ${inputBgClass}`}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${textClass} mb-2`}>
                          Date d'expiration *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={verificationData.expiryDate}
                          onChange={(e) => setVerificationData({...verificationData, expiryDate: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md ${inputBgClass}`}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${textClass} mb-2`}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={verificationData.cvv}
                          onChange={(e) => setVerificationData({...verificationData, cvv: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md ${inputBgClass}`}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textClass} mb-2`}>
                        Titulaire de la carte *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={verificationData.cardHolder}
                        onChange={(e) => setVerificationData({...verificationData, cardHolder: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md ${inputBgClass}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === 2 && (
                <div>
                  <h4 className={`text-lg font-medium ${textClass} mb-4`}>Vérification d'Identité</h4>
                  <div className="space-y-6">
                    <div className={`border rounded-lg p-4 ${borderClass}`}>
                      <h5 className={`font-medium ${textClass} mb-2`}>Recto de la carte d'identité</h5>
                      <p className={`text-sm ${textSecondaryClass} mb-3`}>
                        Prenez une photo claire du recto de votre pièce d'identité
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('documentFront', e.target.files[0])}
                          className="hidden"
                          id="documentFront"
                        />
                        <label htmlFor="documentFront" className="cursor-pointer">
                          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className={`mt-2 text-sm ${textSecondaryClass}`}>
                            {verificationData.documentFront ? 'Fichier sélectionné' : 'Cliquez pour uploader'}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className={`border rounded-lg p-4 ${borderClass}`}>
                      <h5 className={`font-medium ${textClass} mb-2`}>Verso de la carte d'identité</h5>
                      <p className={`text-sm ${textSecondaryClass} mb-3`}>
                        Prenez une photo claire du verso de votre pièce d'identité
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('documentBack', e.target.files[0])}
                          className="hidden"
                          id="documentBack"
                        />
                        <label htmlFor="documentBack" className="cursor-pointer">
                          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className={`mt-2 text-sm ${textSecondaryClass}`}>
                            {verificationData.documentBack ? 'Fichier sélectionné' : 'Cliquez pour uploader'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === 3 && (
                <div>
                  <h4 className={`text-lg font-medium ${textClass} mb-4`}>Selfie de Vérification</h4>
                  <div className={`border rounded-lg p-4 ${borderClass}`}>
                    <p className={`text-sm ${textSecondaryClass} mb-4`}>
                      Prenez un selfie clair où l'on voit votre visage et la carte d'identité
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('selfie', e.target.files[0])}
                        className="hidden"
                        id="selfie"
                      />
                      <label htmlFor="selfie" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className={`mt-2 text-sm ${textSecondaryClass}`}>
                          {verificationData.selfie ? 'Selfie sélectionné' : 'Cliquez pour prendre un selfie'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-lg ${
                    isDarkMode ? 'bg-blue-900' : 'bg-blue-50'
                  }`}>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                      🔒 <strong>Sécurité :</strong> Toutes vos données sont cryptées et sécurisées. 
                      Nous respectons les normes PCI DSS pour la protection de vos informations.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={verificationStep === 1 ? () => setShowVerificationModal(false) : handleVerificationBack}
                  className={`px-6 py-2 border rounded-md ${
                    isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {verificationStep === 1 ? 'Annuler' : 'Retour'}
                </button>
                <button
                  onClick={verificationStep === 3 ? submitVerification : handleVerificationNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  {verificationStep === 3 ? 'Soumettre la Vérification' : 'Continuer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portefeuille;