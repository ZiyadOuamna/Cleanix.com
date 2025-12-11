import React, { useState, useContext } from 'react';
import { Lock, DollarSign, Plus, TrendingDown, Calendar, ArrowDownLeft, ArrowUpRight, Download, AlertCircle, CheckCircle, Clock, X, RotateCcw, Send } from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

const WalletClient = () => {
  const { isDarkMode } = useContext(ClientContext);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1); // 1: Amount & Method, 2: Payment Form, 3: Confirmation
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('orange');
  
  // Transaction filters
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
  
  // Refund request states
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundDescription, setRefundDescription] = useState('');

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

  // Commandes avec fonds bloqués (escrow)
  const lockedFunds = [
    {
      id: 1,
      service: 'Nettoyage complet',
      freelancer: 'Ahmed M.',
      amount: 850,
      date: '15 Déc 2025',
      status: 'pending',
      image: '✨',
      location: '123 Rue de Paris'
    },
    {
      id: 2,
      service: 'Nettoyage bureau',
      freelancer: 'Hassan D.',
      amount: 1200,
      date: '12 Déc 2025',
      status: 'in_progress',
      image: '🏢',
      location: '789 Boulevard Saint-Germain'
    },
    {
      id: 3,
      service: 'Remise de clé',
      freelancer: 'Ali B.',
      amount: 50,
      date: '10 Déc 2025',
      status: 'pending',
      image: '🔑',
      location: '321 Rue Saint-Antoine'
    }
  ];

  // Transactions complétées
  const transactions = [
    {
      id: 1,
      type: 'released',
      description: 'Paiement libéré - Nettoyage de vitres',
      freelancer: 'Fatima K.',
      clientAmount: -450,
      freelancerGains: 405,
      cleanixGains: 45,
      date: '08 Déc 2025',
      time: '15:45',
      status: 'completed'
    },
    {
      id: 2,
      type: 'refund',
      description: 'Remboursement - Service annulé',
      freelancer: 'Service annulé',
      clientAmount: 300,
      freelancerGains: 0,
      cleanixGains: 0,
      date: '05 Déc 2025',
      time: '11:20',
      status: 'completed'
    },
    {
      id: 3,
      type: 'locked',
      description: 'Fonds bloqués - Nettoyage complet',
      freelancer: 'Ahmed M.',
      clientAmount: -850,
      freelancerGains: 765,
      cleanixGains: 85,
      date: '01 Déc 2025',
      time: '09:00',
      status: 'locked'
    },
    {
      id: 4,
      type: 'released',
      description: 'Paiement libéré - Gestion de clés',
      freelancer: 'Mohamed B.',
      clientAmount: -50,
      freelancerGains: 45,
      cleanixGains: 5,
      date: '28 Nov 2025',
      time: '14:30',
      status: 'completed'
    },
    {
      id: 5,
      type: 'locked',
      description: 'Fonds bloqués - Nettoyage bureau',
      freelancer: 'Hassan D.',
      clientAmount: -1200,
      freelancerGains: 1080,
      cleanixGains: 120,
      date: '25 Nov 2025',
      time: '10:15',
      status: 'locked'
    },
    {
      id: 6,
      type: 'released',
      description: 'Paiement libéré - Nettoyage cuisine',
      freelancer: 'Zahra M.',
      clientAmount: -600,
      freelancerGains: 540,
      cleanixGains: 60,
      date: '20 Nov 2025',
      time: '16:20',
      status: 'completed'
    },
    {
      id: 7,
      type: 'refund',
      description: 'Remboursement - Freelancer non accepté',
      freelancer: 'Service annulé',
      clientAmount: 200,
      freelancerGains: 0,
      cleanixGains: 0,
      date: '18 Nov 2025',
      time: '09:45',
      status: 'completed'
    }
  ];

  // Calculs
  const totalLockedAmount = lockedFunds.reduce((sum, f) => sum + f.amount, 0);
  const totalAvailable = 5000;
  const totalSpent = 2850;

  const handleAddFunds = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validation étape 1: Montant + Méthode
      if (!amount || parseFloat(amount) <= 0) {
        showAlert({
          icon: 'error',
          title: 'Montant invalide',
          text: 'Veuillez entrer un montant valide'
        });
        return;
      }
      if (!selectedMethod) {
        showAlert({
          icon: 'error',
          title: 'Méthode non sélectionnée',
          text: 'Veuillez choisir une méthode de paiement'
        });
        return;
      }
      // Passer à l'étape 2
      setStep(2);
    } else if (step === 2) {
      // Validation étape 2: Informations de paiement
      if (selectedMethod === 'card') {
        if (!cardNumber || cardNumber.length < 13 || !cardExpiry || !cardCvc || !cardName) {
          showAlert({
            icon: 'error',
            title: 'Informations incomplètes',
            text: 'Veuillez remplir tous les champs de la carte'
          });
          return;
        }
      } else if (selectedMethod === 'bank') {
        if (!bankAccount || !bankName || !accountHolder) {
          showAlert({
            icon: 'error',
            title: 'Informations incomplètes',
            text: 'Veuillez remplir tous les détails bancaires'
          });
          return;
        }
      } else if (selectedMethod === 'mobile') {
        if (!mobileNumber || mobileNumber.length < 10) {
          showAlert({
            icon: 'error',
            title: 'Numéro invalide',
            text: 'Veuillez entrer un numéro de téléphone valide'
          });
          return;
        }
      }
      // Passer à la confirmation
      setStep(3);
    } else if (step === 3) {
      // Traitement du paiement
      showAlert({
        icon: 'success',
        title: 'Paiement réussi!',
        text: `${amount}DH ont été déposés avec succès`
      });

      // Réinitialiser tous les états
      setAmount('');
      setStep(1);
      setSelectedMethod(null);
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setCardName('');
      setBankAccount('');
      setBankName('');
      setAccountHolder('');
      setMobileNumber('');
      setMobileProvider('orange');
      setShowAddFunds(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddFunds(false);
    setAmount('');
    setStep(1);
    setSelectedMethod(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardName('');
    setBankAccount('');
    setBankName('');
    setAccountHolder('');
    setMobileNumber('');
    setMobileProvider('orange');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Refund modal handler
  const handleOpenRefundModal = (transaction) => {
    setRefundData(transaction);
    setRefundAmount(Math.abs(transaction.clientAmount).toString());
    setRefundReason('');
    setRefundDescription('');
    setShowRefundModal(true);
  };

  // Submit refund request
  const handleSubmitRefundRequest = () => {
    if (!refundReason || !refundDescription) {
      showAlert({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Veuillez remplir tous les champs requis'
      });
      return;
    }

    showAlert({
      icon: 'success',
      title: 'Demande de remboursement envoyée',
      text: `Votre demande de ${refundAmount}DH a été transmise au superviseur Cleanix pour examen.`,
      confirmButtonColor: '#0891b2'
    });

    // Reset form
    setShowRefundModal(false);
    setRefundData(null);
    setRefundReason('');
    setRefundAmount('');
    setRefundDescription('');
  };

  // Helper pour SweetAlert2 avec thème dark/light
  const showAlert = (config) => {
    const swalConfig = {
      ...config,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      confirmButtonColor: config.confirmButtonColor || '#0891b2',
      cancelButtonColor: config.cancelButtonColor || '#6b7280',
    };
    return Swal.fire(swalConfig);
  };

  // Download wallet statement as PDF
  const handleDownloadStatement = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Header
    pdf.setFontSize(18);
    pdf.setTextColor(8, 145, 178); // Cyan color
    pdf.text('RELEVÉ DE PORTEFEUILLE CLEANIX', margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);
    
    yPos += 15;

    // Summary Section
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('RÉSUMÉ DU COMPTE', margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 25);
    
    pdf.text(`Solde disponible: ${totalAvailable.toLocaleString()} DH`, margin + 5, yPos);
    yPos += 7;
    pdf.text(`Fonds verrouillés: ${totalLockedAmount.toLocaleString()} DH`, margin + 5, yPos);
    yPos += 7;
    pdf.text(`Solde total: ${(totalAvailable + totalLockedAmount).toLocaleString()} DH`, margin + 5, yPos);
    
    yPos += 20;

    // Transactions Section
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('HISTORIQUE DES TRANSACTIONS', margin, yPos);
    
    yPos += 7;

    // Table headers
    const columns = ['Date', 'Description', 'Montant', 'Type', 'Statut'];
    const colWidths = [25, 60, 25, 25, 30];
    let xPos = margin;

    pdf.setFontSize(9);
    pdf.setTextColor(8, 145, 178);
    pdf.setFillColor(240, 240, 240);

    columns.forEach((col, i) => {
      pdf.rect(xPos, yPos - 4, colWidths[i], 6, 'F');
      pdf.text(col, xPos + 2, yPos);
      xPos += colWidths[i];
    });

    yPos += 8;

    // Table data
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);

    transactions.slice(0, 10).forEach((tx) => {
      const date = tx.date || '---';
      const desc = tx.description.substring(0, 25);
      const amount = `${tx.amount}`;
      const type = tx.type === 'income' ? 'Crédit' : 'Débit';
      const status = tx.status === 'completed' ? '✓ Complétée' : 'En attente';

      xPos = margin;
      const rowHeight = 6;

      // Add page break if needed
      if (yPos + rowHeight > pageHeight - 20) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.text(date, xPos + 2, yPos);
      xPos += colWidths[0];
      pdf.text(desc, xPos + 2, yPos);
      xPos += colWidths[1];
      pdf.text(amount, xPos + 2, yPos);
      xPos += colWidths[2];
      pdf.text(type, xPos + 2, yPos);
      xPos += colWidths[3];
      pdf.text(status, xPos + 2, yPos);

      yPos += rowHeight;
    });

    // Footer
    yPos = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Ce document est un relevé officiel de votre portefeuille Cleanix.', margin, yPos);
    pdf.text(`Page 1`, pageWidth / 2 - 5, yPos + 5);

    // Download
    pdf.save(`Releve_Portefeuille_${new Date().getTime()}.pdf`);

    showAlert({
      icon: 'success',
      title: 'Téléchargement réussi',
      text: 'Votre relevé de portefeuille a été téléchargé avec succès.'
    });
  };

  const handleCancelOrder = (orderId) => {
    showAlert({
      title: 'Annuler la commande?',
      text: 'Les fonds seront remboursés à votre portefeuille',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        showAlert({
          icon: 'success',
          title: 'Commande annulée',
          text: 'Les fonds ont été remboursés'
        });
      }
    });
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Complété';
      case 'locked': return 'Verrouillé';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700';
      case 'in_progress':
        return isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700';
      case 'completed':
        return isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700';
      case 'locked':
        return isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Portefeuille</h1>
        <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos fonds et vos paiements en escrow</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border} bg-gradient-to-br from-green-500 to-green-600 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-green-100 text-sm font-semibold">Solde disponible</p>
            <DollarSign size={24} className="text-green-200" />
          </div>
          <h2 className="text-3xl font-bold">{totalAvailable.toLocaleString()}DH</h2>
          <p className="text-green-100 text-xs mt-2">Prêt à être utilisé</p>
        </div>

        {/* Locked Funds */}
        <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border} bg-gradient-to-br from-orange-500 to-orange-600 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-orange-100 text-sm font-semibold">Fonds verrouillés</p>
            <Lock size={24} className="text-orange-200" />
          </div>
          <h2 className="text-3xl font-bold">{totalLockedAmount.toLocaleString()}DH</h2>
          <p className="text-orange-100 text-xs mt-2">{lockedFunds.length} commande(s) en cours</p>
        </div>

        {/* Total Spent */}
        <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border}`}>
          <div className="flex items-center justify-between mb-4">
            <p className={`${theme.textSecondary} text-sm font-semibold`}>Total dépensé</p>
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textMain}`}>{totalSpent.toLocaleString()}DH</h2>
          <p className={`${theme.textSecondary} text-xs mt-2`}>Services complétés</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddFunds(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold text-sm"
        >
          <Plus size={18} />
          Ajouter des fonds
        </button>
        <button 
          onClick={handleDownloadStatement}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition font-semibold text-sm"
        >
          <Download size={18} />
          Télécharger relevé
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-lg max-w-md w-full p-6 border ${theme.border}`}>
            {/* Header avec progression */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${theme.textMain}`}>Ajouter des fonds</h2>
                <button
                  onClick={handleCloseModal}
                  className={`p-1 rounded hover:${theme.cardBg}`}
                >
                  <X size={20} className={theme.textMuted} />
                </button>
              </div>
              {/* Progress bar */}
              <div className="flex gap-2">
                <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-cyan-500' : isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-cyan-500' : isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-cyan-500' : isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
              </div>
              <p className={`text-xs ${theme.textMuted} mt-2`}>Étape {step} sur 3</p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-4">
              {/* Étape 1: Montant et Méthode de paiement */}
              {step === 1 && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Montant (DH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Entrez le montant"
                      required
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  {/* Quick amounts */}
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className={`py-2 rounded-lg font-semibold text-sm transition border ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                      >
                        {val}DH
                      </button>
                    ))}
                  </div>

                  {/* Payment method selection */}
                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-3`}>Méthode de paiement</label>
                    <div className="space-y-2">
                      {/* Card */}
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('card')}
                        className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                          selectedMethod === 'card'
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : `border-${theme.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                          💳
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${theme.textMain}`}>Carte bancaire</p>
                          <p className={`text-xs ${theme.textMuted}`}>Visa, Mastercard</p>
                        </div>
                      </button>

                      {/* Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('bank')}
                        className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                          selectedMethod === 'bank'
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : `border-${theme.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                          🏦
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${theme.textMain}`}>Virement bancaire</p>
                          <p className={`text-xs ${theme.textMuted}`}>Compte RIB</p>
                        </div>
                      </button>

                      {/* Mobile Wallet */}
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('mobile')}
                        className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                          selectedMethod === 'mobile'
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : `border-${theme.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                          📱
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${theme.textMain}`}>Portefeuille mobile</p>
                          <p className={`text-xs ${theme.textMuted}`}>Orange Money, Maroc Telecom</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Étape 2: Formulaire de paiement */}
              {step === 2 && selectedMethod === 'card' && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Numéro de carte</label>
                    <input
                      type="text"
                      maxLength="19"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="0000 0000 0000 0000"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>MM/YY</label>
                      <input
                        type="text"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          }
                          setCardExpiry(val);
                        }}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>CVC</label>
                      <input
                        type="text"
                        maxLength="4"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="000"
                        className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Nom du titulaire</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nom complet"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>
                </>
              )}

              {/* Étape 2: Formulaire virement bancaire */}
              {step === 2 && selectedMethod === 'bank' && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Nom de la banque</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="ex: Banque Marocaine du Commerce Extérieur"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Numéro de compte RIB</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="00000000000000000000"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Nom du titulaire du compte</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder="Nom complet"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>
                </>
              )}

              {/* Étape 2: Formulaire portefeuille mobile */}
              {step === 2 && selectedMethod === 'mobile' && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Opérateur</label>
                    <select
                      value={mobileProvider}
                      onChange={(e) => setMobileProvider(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    >
                      <option value="orange">Orange Money</option>
                      <option value="maroc">Maroc Telecom (Mobicash)</option>
                      <option value="inwi">Inwi (WafiCash)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="06XX XXX XXX"
                      className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>
                </>
              )}

              {/* Étape 3: Confirmation */}
              {step === 3 && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border ${isDarkMode ? 'border-green-800' : 'border-green-200'}`}>
                  <div className="flex gap-3">
                    <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className={`font-semibold ${theme.textMain} mb-2`}>Vérifiez les informations</p>
                      <div className={`text-sm ${theme.textSecondary} space-y-1`}>
                        <p><strong>Montant:</strong> {amount}DH</p>
                        <p>
                          <strong>Méthode:</strong>{' '}
                          {selectedMethod === 'card' && 'Carte bancaire'}
                          {selectedMethod === 'bank' && 'Virement bancaire'}
                          {selectedMethod === 'mobile' && 'Portefeuille mobile'}
                        </p>
                        {selectedMethod === 'card' && (
                          <p><strong>Carte:</strong> ••••••••••••{cardNumber.slice(-4)}</p>
                        )}
                        {selectedMethod === 'bank' && (
                          <p><strong>Banque:</strong> {bankName}</p>
                        )}
                        {selectedMethod === 'mobile' && (
                          <p><strong>Téléphone:</strong> {mobileNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={step === 1 ? handleCloseModal : handleBack}
                  className={`flex-1 px-4 py-2 rounded-lg transition border ${theme.border} ${theme.textMain} text-sm font-semibold`}
                >
                  {step === 1 ? 'Annuler' : 'Retour'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                >
                  {step === 3 ? 'Payer' : 'Suivant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locked Funds Section */}
      <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border}`}>
        <h2 className={`text-xl font-bold ${theme.textMain} mb-4 flex items-center gap-2`}>
          <Lock size={24} className="text-orange-500" />
          Commandes avec fonds bloqués ({lockedFunds.length})
        </h2>

        <div className="space-y-3">
          {lockedFunds.length === 0 ? (
            <p className={`${theme.textSecondary} text-sm`}>Aucun fonds verrouillé</p>
          ) : (
            lockedFunds.map(fund => (
              <div key={fund.id} className={`p-4 rounded-lg border ${theme.border} ${isDarkMode ? 'bg-gray-700/50' : 'bg-slate-50'} flex items-start justify-between`}>
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl flex-shrink-0">{fund.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${theme.textMain} text-sm`}>{fund.service}</p>
                    <p className={`${theme.textSecondary} text-xs`}>avec {fund.freelancer}</p>
                    <p className={`${theme.textMuted} text-xs mt-1`}>{fund.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(fund.status)}`}>
                        {getStatusLabel(fund.status)}
                      </span>
                      <span className={`text-xs ${theme.textMuted}`}>{fund.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-lg font-bold text-orange-600">{fund.amount}DH</p>
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => handleOpenRefundModal({ id: fund.id, description: fund.service, clientAmount: -fund.amount, freelancer: fund.freelancer })}
                      className="text-xs text-white bg-orange-600 hover:bg-orange-700 font-semibold px-3 py-2 rounded-lg transition duration-200"
                    >
                      💰 Rembourser
                    </button>
                    <button
                      onClick={() => handleCancelOrder(fund.id)}
                      className="text-xs text-white bg-red-600 hover:bg-red-700 active:bg-red-800 font-semibold px-3 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Commission Info */}
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-800' : 'border-blue-200'} flex gap-2`}>
          <AlertCircle size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <strong>💡 Conseil:</strong> Quand le service est complété, le freelancer reçoit 90% et Cleanix prend 10% de commission
          </p>
        </div>
      </div>

      {/* Transactions History - IMPROVED */}
      <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border}`}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.textMain} mb-1 flex items-center gap-2`}>
            <Calendar size={28} />
            Historique des transactions
          </h2>
          <p className={`${theme.textSecondary} text-sm`}>Consultez l'historique complet de vos transactions</p>
        </div>

        {/* Filters Section */}
        <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-slate-50'} border ${theme.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div>
              <label className={`block text-xs font-semibold ${theme.textMuted} mb-2 uppercase tracking-wide`}>Rechercher</label>
              <input
                type="text"
                placeholder="Description, freelancer..."
                value={transactionSearchTerm}
                onChange={(e) => setTransactionSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className={`block text-xs font-semibold ${theme.textMuted} mb-2 uppercase tracking-wide`}>Type</label>
              <select
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              >
                <option value="all">Tous les types</option>
                <option value="released">Libérées</option>
                <option value="locked">Verrouillées</option>
                <option value="refund">Remboursements</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-xs font-semibold ${theme.textMuted} mb-2 uppercase tracking-wide`}>Statut</label>
              <select
                value={transactionStatusFilter}
                onChange={(e) => setTransactionStatusFilter(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Complétées</option>
                <option value="locked">Verrouillées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions
            .filter(tx => {
              const matchesSearch = transactionSearchTerm === '' ||
                tx.description.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                tx.freelancer.toLowerCase().includes(transactionSearchTerm.toLowerCase());
              const matchesType = transactionTypeFilter === 'all' || tx.type === transactionTypeFilter;
              const matchesStatus = transactionStatusFilter === 'all' || tx.status === transactionStatusFilter;
              return matchesSearch && matchesType && matchesStatus;
            })
            .map(tx => (
            <div key={tx.id} className={`p-4 rounded-lg border ${theme.border} hover:${isDarkMode ? 'bg-gray-700/30' : 'bg-slate-50'} transition flex items-start gap-4`}>
              {/* Icon Badge */}
              <div className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${
                tx.type === 'released' ? (isDarkMode ? 'bg-green-900/20' : 'bg-green-100') :
                tx.type === 'refund' ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100') :
                (isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100')
              }`}>
                {tx.type === 'released' ? (
                  <CheckCircle className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={24} />
                ) : tx.type === 'refund' ? (
                  <ArrowUpRight className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
                ) : (
                  <Lock className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} size={24} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Description & Freelancer */}
                <div className="mb-2">
                  <p className={`font-semibold ${theme.textMain} text-sm leading-tight`}>{tx.description}</p>
                  <p className={`${theme.textSecondary} text-xs mt-1`}>Freelancer: <span className="font-medium">{tx.freelancer}</span></p>
                </div>

                {/* Commission Details */}
                {(tx.type === 'released' || tx.type === 'locked') && (tx.freelancerGains > 0 || tx.cleanixGains > 0) && (
                  <div className={`text-xs ${theme.textMuted} p-2 rounded ${isDarkMode ? 'bg-gray-700/30' : 'bg-slate-100'} grid grid-cols-2 gap-2 mb-2`}>
                    <div>
                      <span className="block text-xs opacity-75">💼 Freelancer (90%)</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{tx.freelancerGains}DH</span>
                    </div>
                    <div>
                      <span className="block text-xs opacity-75">🏢 Cleanix (10%)</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{tx.cleanixGains}DH</span>
                    </div>
                  </div>
                )}
                
                {/* Date & Time */}
                <p className={`text-xs ${theme.textMuted} flex items-center gap-1`}>
                  <Clock size={14} />
                  {tx.date} à {tx.time}
                </p>
              </div>

              {/* Amount & Status */}
              <div className="text-right flex-shrink-0">
                <p className={`text-lg font-bold ${tx.clientAmount < 0 ? 'text-red-600' : isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {tx.clientAmount > 0 ? '+' : ''}{tx.clientAmount}DH
                </p>
                <span className={`text-xs px-3 py-1 rounded-full font-medium inline-block mt-2 ${
                  tx.status === 'completed' ? (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700') :
                  (isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700')
                }`}>
                  {getStatusLabel(tx.status)}
                </span>
                {/* Refund Button */}
                <button
                  onClick={() => handleOpenRefundModal(tx)}
                  className="text-xs text-orange-600 hover:text-orange-700 hover:underline font-semibold mt-3 block"
                >
                  💰 Rembourser
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {transactions.filter(tx => {
              const matchesSearch = transactionSearchTerm === '' ||
                tx.description.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                tx.freelancer.toLowerCase().includes(transactionSearchTerm.toLowerCase());
              const matchesType = transactionTypeFilter === 'all' || tx.type === transactionTypeFilter;
              const matchesStatus = transactionStatusFilter === 'all' || tx.status === transactionStatusFilter;
              return matchesSearch && matchesType && matchesStatus;
            }).length === 0 && (
            <div className={`text-center py-12 ${theme.textMuted}`}>
              <Calendar size={48} className="mx-auto opacity-30 mb-3" />
              <p className="text-sm">Aucune transaction ne correspond à votre recherche</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className={`mt-6 pt-6 border-t ${theme.border} grid grid-cols-1 md:grid-cols-3 gap-4`}>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-slate-50'}`}>
            <p className={`text-xs ${theme.textMuted} mb-1`}>Nombre de transactions</p>
            <p className={`text-2xl font-bold ${theme.textMain}`}>{transactions.length}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <p className={`text-xs ${theme.textMuted} mb-1`}>Total libéré</p>
            <p className="text-2xl font-bold text-green-600">{transactions.filter(t => t.type === 'released').reduce((sum, t) => sum + Math.abs(t.clientAmount), 0)}DH</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
            <p className={`text-xs ${theme.textMuted} mb-1`}>En attente</p>
            <p className="text-2xl font-bold text-orange-600">{transactions.filter(t => t.status === 'locked').length}</p>
          </div>
        </div>
      </div>

      {/* FAQ/Help Section */}
      <div className={`${theme.cardBg} rounded-lg p-6 shadow-sm border ${theme.border}`}>
        <h2 className={`text-xl font-bold ${theme.textMain} mb-4`}>Comment fonctionne le système d'escrow?</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <p className={`font-semibold ${theme.textMain} mb-2`}>1️⃣ Fonds bloqués</p>
            <p className={`${theme.textSecondary}`}>Quand vous créez une commande, les fonds sont bloqués dans votre portefeuille. Ils ne quittent pas votre compte.</p>
          </div>
          
          <div>
            <p className={`font-semibold ${theme.textMain} mb-2`}>2️⃣ Validation du service</p>
            <p className={`${theme.textSecondary}`}>Une fois le freelancer accepte et complète le service, les fonds sont libérés.</p>
          </div>
          
          <div>
            <p className={`font-semibold ${theme.textMain} mb-2`}>3️⃣ Distribution</p>
            <p className={`${theme.textSecondary}`}>• Le freelancer reçoit 90% du montant • Cleanix prend 10% de commission</p>
          </div>
          
          <div>
            <p className={`font-semibold ${theme.textMain} mb-2`}>4️⃣ Remboursement</p>
            <p className={`${theme.textSecondary}`}>Si vous annulez avant que le freelancer n'accepte, les fonds sont intégralement remboursés.</p>
          </div>
        </div>
      </div>

      {/* Refund Request Modal */}
      {showRefundModal && refundData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-lg max-w-md w-full p-6 border ${theme.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${theme.textMain} flex items-center gap-2`}>
                <RotateCcw size={24} className="text-orange-500" />
                Demander un remboursement
              </h2>
              <button
                onClick={() => setShowRefundModal(false)}
                className={`p-1 rounded hover:${theme.cardBg}`}
              >
                <X size={20} className={theme.textMuted} />
              </button>
            </div>

            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'} border ${isDarkMode ? 'border-orange-800' : 'border-orange-200'} mb-4`}>
              <p className={`text-sm ${theme.textSecondary}`}>
                <strong>Montant demandé:</strong> {refundAmount}DH
              </p>
              <p className={`text-sm ${theme.textSecondary} mt-1`}>
                <strong>Transaction:</strong> {refundData.description}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitRefundRequest(); }} className="space-y-4">
              {/* Reason Select */}
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Raison du remboursement</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <option value="">-- Sélectionnez une raison --</option>
                  <option value="poor_quality">Mauvaise qualité de service</option>
                  <option value="not_completed">Service non complété</option>
                  <option value="freelancer_cancelled">Freelancer a annulé</option>
                  <option value="technical_issue">Problème technique</option>
                  <option value="other">Autre raison</option>
                </select>
              </div>

              {/* Description Textarea */}
              <div>
                <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Description détaillée</label>
                <textarea
                  value={refundDescription}
                  onChange={(e) => setRefundDescription(e.target.value)}
                  placeholder="Décrivez en détail pourquoi vous demandez un remboursement..."
                  rows="4"
                  className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition border ${theme.border} ${theme.textMain} text-sm font-semibold`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Envoyer
                </button>
              </div>

              <p className={`text-xs ${theme.textMuted} text-center pt-2`}>
                ⏱️ Un superviseur Cleanix traitera votre demande dans les 24-48h
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletClient;
