import React, { useState, useContext, useEffect } from 'react';
import { FreelancerContext } from './freelancerContext';
import { CheckCircle, Clock, AlertCircle, CreditCard, DollarSign, User, Mail, Smartphone, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  getWallet,
  getTransactions,
  getPaymentMethods,
  addPaymentMethod,
  requestWithdrawal
} from '../../services/walletService';

const Portefeuille = () => {
  const { isDarkMode } = useContext(FreelancerContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    pending: 0,
    totalEarned: 0,
    transactions: []
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [verificationData, setVerificationData] = useState({
    methodType: '',
    firstName: '',
    lastName: '',
    cardNumberStart: '',
    cardNumberEnd: '',
    expiryMonth: '01',
    expiryYear: '2024',
    email: '',
    phoneNumber: '',
    accountName: '',
    bankName: '',
    iban: ''
  });

  // États pour les images
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  
  // États pour la vérification PayPal
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Thème amélioré avec bordures plus claires
  const theme = {
    wrapper: isDarkMode ? 'min-h-screen bg-gray-900 text-white' : 'min-h-screen bg-slate-50 text-slate-800',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-100',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-slate-200 text-slate-900',
    tabActive: isDarkMode ? 'border-green-500 text-green-400' : 'border-green-600 text-green-700 bg-green-50/50',
    tabInactive: isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100',
    tableHeader: isDarkMode ? 'bg-gray-700/50' : 'bg-slate-50',
    tableRow: isDarkMode ? 'bg-gray-800 hover:bg-gray-700/50' : 'bg-white hover:bg-slate-50'
  };

  // Charger les données du portefeuille depuis l'API
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setLoading(true);
        
        // Charger le portefeuille
        const walletResponse = await getWallet();
        if (walletResponse.data) {
          setWalletData({
            balance: walletResponse.data.balance || 0,
            pending: walletResponse.data.pending || 0,
            totalEarned: walletResponse.data.total_earned || 0,
            transactions: []
          });
        }
        
        // Charger les transactions
        const transactionsResponse = await getTransactions();
        if (transactionsResponse.data) {
          setWalletData(prev => ({
            ...prev,
            transactions: transactionsResponse.data || []
          }));
        }
        
        // Charger les méthodes de paiement
        const methodsResponse = await getPaymentMethods();
        if (methodsResponse.data) {
          setPaymentMethods(methodsResponse.data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du portefeuille:', error);
        // Garder les données par défaut en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, []);

  const stats = [
    { label: 'Solde disponible', value: `${walletData.balance} MAD`, color: isDarkMode ? 'text-green-400' : 'text-green-700' },
    { label: 'En attente', value: `${walletData.pending} MAD`, color: isDarkMode ? 'text-yellow-400' : 'text-yellow-700' },
    { label: 'Total gagné', value: `${walletData.totalEarned} MAD`, color: isDarkMode ? 'text-blue-400' : 'text-blue-700' },
  ];

  // Gérer le retrait
  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Montant invalide',
        text: 'Veuillez entrer un montant valide',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    
    if (amount > walletData.balance) {
      Swal.fire({
        icon: 'error',
        title: 'Solde insuffisant',
        text: 'Le montant demandé dépasse votre solde disponible',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const verifiedMethods = paymentMethods.filter(method => method.verified);
    if (verifiedMethods.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Aucune méthode vérifiée',
        text: 'Veuillez vérifier une méthode de paiement avant de retirer',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (!selectedPaymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Méthode non sélectionnée',
        text: 'Veuillez sélectionner une méthode de paiement',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    Swal.fire({
      title: 'Confirmer le retrait',
      html: `
        <div class="text-left space-y-4">
          <div class="flex justify-between">
            <span class="${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">Montant:</span>
            <span class="font-bold text-green-600">${amount} MAD</span>
          </div>
          <div class="flex justify-between">
            <span class="${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">Frais:</span>
            <span class="font-bold text-red-600">5 MAD</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">Total à recevoir:</span>
            <span class="font-bold text-green-600">${amount - 5} MAD</span>
          </div>
          <p class="text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4">
            Le retrait sera traité dans les 24 heures
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      confirmButtonColor: '#10b981',
      cancelButtonColor: isDarkMode ? '#4b5563' : '#d1d5db',
      preConfirm: () => {
        return { success: true };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const withdrawResponse = await requestWithdrawal(amount, selectedPaymentMethod);
          
          Swal.fire({
            icon: 'success',
            title: 'Retrait confirmé !',
            text: `Votre demande de retrait de ${amount} MAD a été envoyée.`,
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#10b981',
            timer: 3000,
            showConfirmButton: false
          });
          setWithdrawAmount('');
          
          // Recharger les données du portefeuille
          const updatedWallet = await getWallet();
          if (updatedWallet.data) {
            setWalletData(prev => ({
              ...prev,
              balance: updatedWallet.data.balance || prev.balance,
              pending: updatedWallet.data.pending || prev.pending
            }));
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.response?.data?.message || 'Impossible de traiter le retrait',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
        }
      }
    });
  };

  // Démarrer la vérification d'une méthode de paiement
  const startVerification = (methodType) => {
    setVerificationData({
      methodType,
      firstName: '',
      lastName: '',
      cardNumberStart: '',
      cardNumberEnd: '',
      expiryMonth: '01',
      expiryYear: '2024',
      email: '',
      phoneNumber: '',
      accountName: '',
      bankName: '',
      iban: ''
    });
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setVerificationCode('');
    setIsCodeSent(false);
    setVerificationAttempts(0);
    setVerificationStep(1);
    setShowVerificationModal(true);
  };

  // Gérer le téléversement d'images
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Fichier trop volumineux',
        text: 'La taille maximale est de 5MB',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Vérifier le type
    if (!file.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        title: 'Format invalide',
        text: 'Veuillez téléverser une image (JPG, PNG, etc.)',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (type === 'front') {
      setFrontImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Envoyer le code de vérification par email
  const sendVerificationCode = () => {
    if (!verificationData.email || !verificationData.email.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Email invalide',
        text: 'Veuillez entrer une adresse email valide',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Générer un code à 6 chiffres
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simuler l'envoi du code
    Swal.fire({
      icon: 'info',
      title: 'Code envoyé',
      html: `Un code de vérification a été envoyé à <strong>${verificationData.email}</strong><br><br>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 mb-2">${generatedCode}</div>
              <small class="text-gray-500">(Pour démonstration seulement)</small>
            </div>`,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Code copié'
    }).then(() => {
      setIsCodeSent(true);
      setVerificationStep(2);  // Passer à l'étape 2
      // Stocker le code pour la vérification
      sessionStorage.setItem('paypalVerificationCode', generatedCode);
      
      // Définir un délai d'expiration (10 minutes)
      setTimeout(() => {
        sessionStorage.removeItem('paypalVerificationCode');
      }, 10 * 60 * 1000);
    });
  };

  // Vérifier le code PayPal
  const verifyPayPalCode = () => {
    const storedCode = sessionStorage.getItem('paypalVerificationCode');
    
    if (!verificationCode || verificationCode.length !== 6) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: 'Veuillez entrer le code à 6 chiffres',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return false;
    }

    if (verificationCode !== storedCode) {
      const newAttempts = verificationAttempts + 1;
      setVerificationAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        Swal.fire({
          icon: 'error',
          title: 'Trop de tentatives',
          text: 'Veuillez redémarrer le processus de vérification',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          confirmButtonColor: '#3b82f6'
        });
        sessionStorage.removeItem('paypalVerificationCode');
        setVerificationStep(1);
        setIsCodeSent(false);
        setVerificationAttempts(0);
        return false;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Code incorrect',
        text: `Il vous reste ${3 - newAttempts} tentative(s)`,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        confirmButtonColor: '#3b82f6'
      });
      return false;
    }

    // Code correct
    sessionStorage.removeItem('paypalVerificationCode');
    return true;
  };

  // Passer à l'étape suivante de vérification
  const handleVerificationNext = () => {
    // Validation des données selon le type de méthode et l'étape
    if (verificationData.methodType === 'paypal') {
      if (verificationStep === 1) {
        if (!verificationData.email || !verificationData.email.includes('@')) {
          Swal.fire({
            icon: 'error',
            title: 'Email invalide',
            text: 'Veuillez entrer une adresse email valide',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
        // Envoyer le code et passer à l'étape de vérification
        sendVerificationCode();
        return;
      } else if (verificationStep === 2) {
        if (!verifyPayPalCode()) {
          return;
        }
      }
    } else if (verificationData.methodType === 'bank') {
      if (verificationStep === 1) {
        if (!verificationData.accountName || !verificationData.bankName || !verificationData.iban) {
          Swal.fire({
            icon: 'error',
            title: 'Champs manquants',
            text: 'Veuillez remplir tous les champs obligatoires',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
      }
    } else if (verificationData.methodType === 'mobile_money') {
      if (verificationStep === 1) {
        if (!verificationData.phoneNumber || verificationData.phoneNumber.length < 10) {
          Swal.fire({
            icon: 'error',
            title: 'Numéro invalide',
            text: 'Veuillez entrer un numéro de téléphone valide',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
      }
    } else if (['visa', 'mastercard', 'american_express'].includes(verificationData.methodType)) {
      if (verificationStep === 1) {
        if (!verificationData.firstName || !verificationData.lastName || 
            !verificationData.cardNumberStart || verificationData.cardNumberStart.length !== 4 ||
            !verificationData.cardNumberEnd || verificationData.cardNumberEnd.length !== 4) {
          Swal.fire({
            icon: 'error',
            title: 'Champs manquants',
            text: 'Veuillez remplir tous les champs obligatoires',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
        
        // Vérification des images
        if (!frontImage || !backImage) {
          Swal.fire({
            icon: 'error',
            title: 'Images manquantes',
            text: 'Veuillez téléverser les photos du recto et du verso de la carte',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
      }
    }
    
    setVerificationStep(verificationStep + 1);
  };

  const handleVerificationBack = () => {
    if (verificationData.methodType === 'paypal' && verificationStep === 2) {
      setIsCodeSent(false);
      setVerificationCode('');
    }
    setVerificationStep(verificationStep - 1);
  };

  // Soumettre la vérification
  const submitVerification = () => {
    const methodName = getMethodName(verificationData.methodType);
    const methodDetails = getMethodDetails(verificationData);
    
    Swal.fire({
      title: 'Confirmer l\'ajout',
      html: `
        <div class="text-left space-y-3">
          <p><strong>Type:</strong> ${methodName}</p>
          <p><strong>Détails:</strong> ${methodDetails}</p>
          ${verificationData.methodType === 'paypal' ? `<p><strong>Email:</strong> ${verificationData.email}</p>` : ''}
          ${['visa', 'mastercard', 'american_express'].includes(verificationData.methodType) 
            ? `<p><strong>Titulaire:</strong> ${verificationData.firstName} ${verificationData.lastName}</p>` 
            : ''}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      confirmButtonColor: '#10b981',
      cancelButtonColor: isDarkMode ? '#4b5563' : '#d1d5db',
      preConfirm: () => {
        return { success: true };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newMethod = {
          id: Date.now(),
          type: verificationData.methodType,
          name: methodName,
          details: methodDetails,
          verified: false,
          ...verificationData,
          ...(verificationData.methodType === 'paypal' && { emailVerified: true }),
          ...(['visa', 'mastercard', 'american_express'].includes(verificationData.methodType) && {
            frontImage: frontPreview,
            backImage: backPreview
          })
        };

        setPaymentMethods(prev => [...prev, newMethod]);
        setShowVerificationModal(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Méthode ajoutée !',
          text: 'Votre méthode de paiement a été soumise pour vérification.',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          confirmButtonColor: '#10b981',
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  };

  // Fonctions utilitaires
  const getMethodName = (type) => {
    switch (type) {
      case 'visa': return 'Carte Visa';
      case 'mastercard': return 'Carte Mastercard';
      case 'american_express': return 'American Express';
      case 'paypal': return 'PayPal';
      case 'bank': return 'Virement bancaire';
      case 'mobile_money': return 'Mobile Money';
      default: return 'Carte bancaire';
    }
  };

  const getMethodDetails = (data) => {
    switch (data.methodType) {
      case 'visa':
      case 'mastercard':
      case 'american_express':
        return `${data.cardNumberStart}•••• ••••${data.cardNumberEnd}`;
      case 'paypal':
        return data.email;
      case 'bank':
        return `${data.bankName} - ${data.accountName}`;
      case 'mobile_money':
        return data.phoneNumber;
      default:
        return 'Méthode de paiement';
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'american_express': return '💳';
      case 'paypal': return '📱';
      case 'bank': return '🏦';
      case 'mobile_money': return '📲';
      default: return '💳';
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'visa': return 'bg-blue-600';
      case 'mastercard': return 'bg-red-600';
      case 'american_express': return 'bg-green-600';
      case 'paypal': return 'bg-blue-400';
      case 'bank': return 'bg-purple-600';
      case 'mobile_money': return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  // Générer les options pour les mois et années
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = (new Date().getFullYear() + i).toString();
    return { value: year, label: year };
  });

  // Obtenir le nombre total d'étapes selon la méthode
  const getTotalSteps = () => {
    if (verificationData.methodType === 'paypal') {
      return 3; // Étape 1: email, Étape 2: code, Étape 3: confirmation
    }
    return 2; // Pour toutes les autres méthodes
  };

  return (
    <div className={`${theme.wrapper} py-8 transition-colors duration-300`}>
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className={theme.textSecondary}>Chargement des données...</p>
          </div>
        </div>
      )}
      
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.textMain}`}>Mon Portefeuille</h1>
          <p className={`${theme.textSecondary} mt-2`}>Gérez vos gains et vos retraits</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`rounded-lg p-6 border shadow-sm ${theme.card}`}>
              <p className={`text-sm font-medium ${theme.textSecondary}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation par onglets */}
        <div className={`rounded-lg shadow-sm mb-8 border ${theme.card}`}>
          <div className={`border-b ${theme.border}`}>
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
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? theme.tabActive
                      : theme.tabInactive
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
                <h3 className={`text-lg font-bold mb-4 ${theme.textMain}`}>Aperçu du portefeuille</h3>
                <div className="space-y-4">
                  <div className={`flex justify-between items-center p-4 rounded-lg border ${theme.border} ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      Prochain paiement
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      {walletData.pending} MAD
                    </span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg border ${theme.border} ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                    <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                      Disponible immédiatement
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                      {walletData.balance} MAD
                    </span>
                  </div>
                  <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-100'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                      💡 <strong>Conseil :</strong> Les retraits sont traités le jour même. 
                      Assurez-vous d'avoir une méthode de paiement vérifiée.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 className={`text-lg font-bold mb-4 ${theme.textMain}`}>Historique des transactions</h3>
                <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border ${theme.border}`}>
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className={theme.tableHeader}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>
                          Date
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>
                          Description
                        </th>
                        <th className={`px-6 py-3 text-right text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>
                          Montant
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme.border}`}>
                      {walletData.transactions.map((transaction) => (
                        <tr key={transaction.id} className={theme.tableRow}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textMain}`}>
                            {transaction.date}
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme.textMain}`}>
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                            transaction.type === 'credit' 
                              ? (isDarkMode ? 'text-green-400' : 'text-green-700') 
                              : (isDarkMode ? 'text-red-400' : 'text-red-700')
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'} {transaction.amount} MAD
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'completed' 
                                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                                : (isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
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
                <h3 className={`text-lg font-bold mb-4 ${theme.textMain}`}>Demander un retrait</h3>
                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                      Montant à retirer (MAD)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      min="100"
                      max={walletData.balance}
                      step="0.01"
                      className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                    />
                    <p className={`text-sm mt-1 ${theme.textSecondary}`}>
                      Solde disponible: {walletData.balance} MAD
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                      Méthode de retrait
                    </label>
                    <select 
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
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
                    isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      Informations importantes
                    </h4>
                    <ul className={`text-sm space-y-1 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-800'
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
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Demander le retrait
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'payment-methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-lg font-bold ${theme.textMain}`}>Méthodes de Paiement</h3>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => startVerification('visa')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      + Ajouter Carte
                    </button>
                    <button 
                      onClick={() => startVerification('paypal')}
                      className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                      + Ajouter PayPal
                    </button>
                    <button 
                      onClick={() => startVerification('bank')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      + Ajouter Banque
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className={`p-4 border rounded-lg ${theme.border}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-8 ${getCardColor(method.type)} rounded flex items-center justify-center text-white shadow-sm`}>
                            <span className="font-bold text-xs">
                              {getCardIcon(method.type)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className={`font-medium ${theme.textMain}`}>{method.name}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                method.verified 
                                  ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                                  : (isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                              }`}>
                                {method.verified ? '✓ Vérifiée' : '⏳ En vérification'}
                              </span>
                            </div>
                            <p className={`text-sm ${theme.textSecondary}`}>{method.details}</p>
                            {method.verified && (
                              <p className="text-green-600 text-xs mt-1 font-medium">✓ Sécurisée et vérifiée</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-sm font-medium ${theme.textSecondary}`}>
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
                    <div className={`text-center py-12 border-2 border-dashed rounded-lg ${theme.border}`}>
                      <p className={theme.textSecondary}>Aucune méthode de paiement ajoutée</p>
                      <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                        Ajoutez une méthode de paiement vérifiée pour effectuer des retraits
                      </p>
                    </div>
                  )}
                </div>

                {/* Section Sécurité */}
                <div className={`mt-8 border rounded-lg p-6 ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h4 className={`font-bold mb-3 ${theme.textMain}`}>🔒 Sécurité des Paiements</h4>
                  <ul className={`text-sm space-y-2 ${theme.textSecondary}`}>
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

      {/* Modal de vérification */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${theme.card}`}>
            <div className={`p-6 border-b ${theme.border}`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold ${theme.textMain}`}>
                  Ajouter une Méthode de Paiement
                </h3>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex mt-4">
                {Array.from({ length: getTotalSteps() }).map((_, stepIndex) => {
                  const step = stepIndex + 1;
                  return (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        verificationStep >= step ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-slate-200 text-slate-500')
                      }`}>
                        {step}
                      </div>
                      {step < getTotalSteps() && (
                        <div className={`w-12 h-1 mx-2 rounded ${
                          verificationStep > step ? 'bg-blue-600' : (isDarkMode ? 'bg-gray-700' : 'bg-slate-200')
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {verificationStep === 1 && (
                <div>
                  <h4 className={`text-lg font-bold mb-4 ${theme.textMain}`}>
                    {verificationData.methodType === 'paypal' ? 'Informations PayPal' : 
                     verificationData.methodType === 'bank' ? 'Informations Bancaires' :
                     verificationData.methodType === 'mobile_money' ? 'Informations Mobile Money' :
                     'Informations de la Carte'}
                  </h4>
                  
                  {['visa', 'mastercard', 'american_express'].includes(verificationData.methodType) && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                            Prénom *
                          </label>
                          <input
                            type="text"
                            placeholder="John"
                            value={verificationData.firstName}
                            onChange={(e) => setVerificationData({...verificationData, firstName: e.target.value})}
                            className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                            Nom *
                          </label>
                          <input
                            type="text"
                            placeholder="Doe"
                            value={verificationData.lastName}
                            onChange={(e) => setVerificationData({...verificationData, lastName: e.target.value})}
                            className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Numéro de carte (4 premiers et 4 derniers chiffres) *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="1234"
                            value={verificationData.cardNumberStart}
                            onChange={(e) => setVerificationData({...verificationData, cardNumberStart: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            className={`w-1/2 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                            maxLength={4}
                          />
                          <div className="flex items-center">
                            <span className="text-gray-400">•••• •••• ••••</span>
                          </div>
                          <input
                            type="text"
                            placeholder="5678"
                            value={verificationData.cardNumberEnd}
                            onChange={(e) => setVerificationData({...verificationData, cardNumberEnd: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            className={`w-1/2 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                            maxLength={4}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Entrez seulement les 4 premiers et 4 derniers chiffres
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                            Mois d'expiration *
                          </label>
                          <select
                            value={verificationData.expiryMonth}
                            onChange={(e) => setVerificationData({...verificationData, expiryMonth: e.target.value})}
                            className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                          >
                            {months.map(month => (
                              <option key={month.value} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                            Année d'expiration *
                          </label>
                          <select
                            value={verificationData.expiryYear}
                            onChange={(e) => setVerificationData({...verificationData, expiryYear: e.target.value})}
                            className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                          >
                            {years.map(year => (
                              <option key={year.value} value={year.value}>
                                {year.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Section téléversement d'images */}
                      <div className="space-y-4">
                        <div className={`border-2 border-dashed rounded-lg p-4 ${theme.border} hover:border-blue-500 transition-colors`}>
                          <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-500 mb-2">
                              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <label className="cursor-pointer">
                              <span className="text-blue-600 font-medium">Téléverser le recto de la carte</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'front')}
                                className="hidden"
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Photo du recto de la carte (masquer tous les chiffres sauf les 4 premiers et 4 derniers)
                            </p>
                          </div>
                          {frontPreview && (
                            <div className="mt-4">
                              <img 
                                src={frontPreview} 
                                alt="Recto de la carte" 
                                className="max-h-40 mx-auto rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className={`border-2 border-dashed rounded-lg p-4 ${theme.border} hover:border-blue-500 transition-colors`}>
                          <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-500 mb-2">
                              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <label className="cursor-pointer">
                              <span className="text-blue-600 font-medium">Téléverser le verso de la carte</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'back')}
                                className="hidden"
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Photo du verso de la carte (masquer le CVV)
                            </p>
                          </div>
                          {backPreview && (
                            <div className="mt-4">
                              <img 
                                src={backPreview} 
                                alt="Verso de la carte" 
                                className="max-h-40 mx-auto rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4`}>
                          <h5 className="font-bold text-yellow-800 dark:text-yellow-300 text-sm mb-2">⚠️ Instructions importantes :</h5>
                          <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                            <li>• Pour le recto : Masquez tous les chiffres du numéro de carte sauf les 4 premiers et 4 derniers</li>
                            <li>• Pour le verso : Masquer complètement le CVV (les 3 chiffres à droite)</li>
                            <li>• Assurez-vous que la date d'expiration et votre nom sont visibles</li>
                            <li>• Utilisez un stylo, un sticker ou un logiciel de retouche pour masquer</li>
                            <li>• Photos claires et non floues</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationData.methodType === 'paypal' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Adresse email PayPal *
                        </label>
                        <input
                          type="email"
                          placeholder="votre@email.com"
                          value={verificationData.email}
                          onChange={(e) => setVerificationData({...verificationData, email: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        />
                      </div>
                      <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                          📧 Un code de vérification sera envoyé à cette adresse email pour confirmer que vous en êtes le propriétaire.
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationData.methodType === 'bank' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Nom de la banque *
                        </label>
                        <input
                          type="text"
                          placeholder="Banque Centrale Populaire"
                          value={verificationData.bankName}
                          onChange={(e) => setVerificationData({...verificationData, bankName: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Nom du titulaire du compte *
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={verificationData.accountName}
                          onChange={(e) => setVerificationData({...verificationData, accountName: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Numéro de compte / IBAN *
                        </label>
                        <input
                          type="text"
                          placeholder="MA64 1234 5678 9012 3456 7890 123"
                          value={verificationData.iban}
                          onChange={(e) => setVerificationData({...verificationData, iban: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        />
                      </div>
                    </div>
                  )}

                  {verificationData.methodType === 'mobile_money' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Numéro de téléphone *
                        </label>
                        <input
                          type="text"
                          placeholder="+212 6 12 34 56 78"
                          value={verificationData.phoneNumber}
                          onChange={(e) => setVerificationData({...verificationData, phoneNumber: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                          Opérateur
                        </label>
                        <select
                          value={verificationData.bankName}
                          onChange={(e) => setVerificationData({...verificationData, bankName: e.target.value})}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                        >
                          <option value="">Sélectionnez un opérateur</option>
                          <option value="Maroc Telecom">Maroc Telecom (IAM)</option>
                          <option value="Orange">Orange Maroc</option>
                          <option value="Inwi">Inwi</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                      🔒 <strong>Sécurité :</strong> Toutes vos données sont cryptées et sécurisées. 
                      Nous respectons les normes PCI DSS pour la protection de vos informations.
                    </p>
                  </div>
                </div>
              )}

              {verificationStep === 2 && verificationData.methodType === 'paypal' && (
                <div>
                  <h4 className={`text-lg font-bold mb-6 ${theme.textMain}`}>Vérification de l'email</h4>
                  
                  <div className={`space-y-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-slate-50'} p-6 rounded-lg`}>
                    <div className="text-center">
                      <div className="mx-auto h-16 w-16 text-green-500 mb-4">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h5 className={`text-lg font-bold mb-2 ${theme.textMain}`}>Vérifiez votre email</h5>
                      <p className={`mb-4 ${theme.textSecondary}`}>
                        Nous avons envoyé un code à 6 chiffres à l'adresse :
                      </p>
                      <div className={`inline-block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'} mb-6`}>
                        <p className="font-medium text-blue-600">{verificationData.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>
                        Code de vérification *
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                          maxLength={6}
                        />
                        <button
                          type="button"
                          onClick={sendVerificationCode}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
                        >
                          Renvoyer le code
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Entrez le code à 6 chiffres reçu par email
                      </p>
                    </div>

                    <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-yellow-700 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        ⏳ Le code expire dans 10 minutes. Vous avez 3 tentatives.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {((verificationStep === 2 && verificationData.methodType !== 'paypal') || 
                (verificationStep === 3 && verificationData.methodType === 'paypal')) && (
                <div>
                  <h4 className={`text-lg font-bold mb-6 ${theme.textMain}`}>Confirmation</h4>
                  
                  <div className={`space-y-4 mb-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-slate-50'} p-4 rounded-lg`}>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Type de méthode:</span>
                      <span className={`font-medium ${theme.textMain}`}>{getMethodName(verificationData.methodType)}</span>
                    </div>
                    
                    {verificationData.methodType === 'paypal' && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Email:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.email}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className={theme.textSecondary}>Vérification email:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Vérifié
                          </span>
                        </div>
                      </>
                    )}
                    
                    {['visa', 'mastercard', 'american_express'].includes(verificationData.methodType) && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Titulaire:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.firstName} {verificationData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Numéro de carte:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.cardNumberStart}•••• ••••{verificationData.cardNumberEnd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Date d'expiration:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.expiryMonth}/{verificationData.expiryYear}</span>
                        </div>
                      </>
                    )}
                    
                    {verificationData.methodType === 'bank' && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Banque:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Titulaire:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>IBAN:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.iban}</span>
                        </div>
                      </>
                    )}
                    
                    {verificationData.methodType === 'mobile_money' && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Numéro:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textSecondary}>Opérateur:</span>
                          <span className={`font-medium ${theme.textMain}`}>{verificationData.bankName}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Affichage des images téléversées */}
                  {['visa', 'mastercard', 'american_express'].includes(verificationData.methodType) && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {frontPreview && (
                        <div>
                          <p className={`text-sm font-medium mb-2 ${theme.textSecondary}`}>Recto de la carte :</p>
                          <img 
                            src={frontPreview} 
                            alt="Recto" 
                            className="h-32 w-full object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      )}
                      {backPreview && (
                        <div>
                          <p className={`text-sm font-medium mb-2 ${theme.textSecondary}`}>Verso de la carte :</p>
                          <img 
                            src={backPreview} 
                            alt="Verso" 
                            className="h-32 w-full object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-yellow-700 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      ⚠️ <strong>Important :</strong> Votre méthode de paiement sera vérifiée avant d'être activée. 
                      Ce processus peut prendre 24-48 heures.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={verificationStep === 1 ? () => setShowVerificationModal(false) : handleVerificationBack}
                  className={`px-6 py-2 border rounded-md font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {verificationStep === 1 ? 'Annuler' : 'Retour'}
                </button>
                <button
                  onClick={verificationStep === getTotalSteps() ? submitVerification : handleVerificationNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
                >
                  {verificationStep === getTotalSteps() ? 'Ajouter la méthode' : 'Continuer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default Portefeuille;