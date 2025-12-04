import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, Clock, Filter, RefreshCw, MapPin, Star, 
  Plus, Minus, Check, AlertCircle, X, CheckCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const OrdersReceived = () => {
  // Récupération du mode sombre depuis le layout parent
  const { isDarkMode, setUnreadOrdersCount } = useOutletContext();

  const [selectedService, setSelectedService] = useState('all');
  const [orders, setOrders] = useState([]);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [priceProposal, setPriceProposal] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);

  // Configuration SweetAlert2 pour le thème
  const swalTheme = {
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#374151',
    confirmButtonColor: isDarkMode ? '#10B981' : '#059669',
    cancelButtonColor: isDarkMode ? '#6B7280' : '#9CA3AF',
    backdrop: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'
  };

  // --- THÈME "EYE-FRIENDLY" & CONTRASTÉ ---
  const theme = {
    wrapperBg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200 shadow-sm',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    inputBg: isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300',
    bgSoft: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    hoverSoft: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
  };

  // Fonction helper pour les alertes
  const showAlert = (options) => {
    return MySwal.fire({
      background: swalTheme.background,
      color: swalTheme.color,
      backdrop: swalTheme.backdrop,
      customClass: {
        popup: isDarkMode ? 'dark-swal' : '',
        title: isDarkMode ? 'dark-swal-title' : '',
        htmlContainer: isDarkMode ? 'dark-swal-content' : '',
        confirmButton: isDarkMode ? 'dark-swal-confirm' : '',
        cancelButton: isDarkMode ? 'dark-swal-cancel' : '',
        actions: isDarkMode ? 'dark-swal-actions' : '',
      },
      ...options
    });
  };

  // Services disponibles pour le filtre
  const availableServices = [
    { id: 'all', name: 'Tous les services' },
    { id: 'nettoyage-complet', name: 'Nettoyage complet' },
    { id: 'nettoyage-printemps', name: 'Nettoyage de printemps' },
    { id: 'nettoyage-bureau', name: 'Nettoyage bureau' },
    { id: 'nettoyage-vitres', name: 'Nettoyage de vitres' },
    { id: 'nettoyage-apres-travaux', name: 'Nettoyage après travaux' }
  ];

  // Données simulées pour les commandes
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        clientName: "Jean Dupont",
        clientPhoto: "JD",
        rating: 4.5,
        completedOrders: 12,
        service: "Nettoyage complet",
        serviceId: "nettoyage-complet",
        address: "123 Rue de Paris, 75001 Paris",
        price: 85,
        time: "Il y a 15 min",
        status: "en attente",
        suggestedPrices: [93.5, 102, 110.5],
        unread: true
      },
      {
        id: 2,
        clientName: "Marie Martin",
        clientPhoto: "MM",
        rating: 4.8,
        completedOrders: 25,
        service: "Nettoyage de printemps",
        serviceId: "nettoyage-printemps",
        address: "456 Avenue des Champs, 75008 Paris",
        price: 120,
        time: "Il y a 30 min",
        status: "en attente",
        suggestedPrices: [132, 144, 156],
        unread: true
      },
      {
        id: 3,
        clientName: "Pierre Bernard",
        clientPhoto: "PB",
        rating: 4.2,
        completedOrders: 8,
        service: "Nettoyage bureau",
        serviceId: "nettoyage-bureau",
        address: "789 Boulevard Saint-Germain, 75006 Paris",
        price: 150,
        time: "Il y a 1 heure",
        status: "en attente",
        suggestedPrices: [165, 180, 195],
        unread: false
      },
      {
        id: 4,
        clientName: "Sophie Laurent",
        clientPhoto: "SL",
        rating: 4.9,
        completedOrders: 18,
        service: "Nettoyage de vitres",
        serviceId: "nettoyage-vitres",
        address: "321 Rue de Rivoli, 75004 Paris",
        price: 65,
        time: "Il y a 2 heures",
        status: "en attente",
        suggestedPrices: [71.5, 78, 84.5],
        unread: false
      },
      {
        id: 5,
        clientName: "Thomas Leroy",
        clientPhoto: "TL",
        rating: 4.7,
        completedOrders: 32,
        service: "Nettoyage après travaux",
        serviceId: "nettoyage-apres-travaux",
        address: "654 Rue de la Paix, 75002 Paris",
        price: 200,
        time: "Il y a 3 heures",
        status: "en attente",
        suggestedPrices: [220, 240, 260],
        unread: true
      }
    ];
    setOrders(mockOrders);
    
    // Calculer le nombre de commandes non lues
    const unreadCount = mockOrders.filter(order => order.unread && order.status === 'en attente').length;
    if (setUnreadOrdersCount) {
      setUnreadOrdersCount(unreadCount);
    }
  }, [setUnreadOrdersCount]);

  // Mettre à jour le compteur de notifications
  useEffect(() => {
    const unreadCount = orders.filter(order => order.unread && order.status === 'en attente').length;
    if (setUnreadOrdersCount) {
      setUnreadOrdersCount(unreadCount);
    }
  }, [orders, setUnreadOrdersCount]);

  const acceptOrder = (orderId) => {
    showAlert({
      title: 'Confirmer l\'acceptation',
      text: `Voulez-vous accepter la commande #${orderId} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: swalTheme.confirmButtonColor,
      cancelButtonColor: swalTheme.cancelButtonColor,
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler',
      iconColor: isDarkMode ? '#10B981' : '#059669',
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'acceptée', unread: false } : order
        ));
        showAlert({
          title: 'Commande acceptée !',
          text: `Commande #${orderId} acceptée avec succès`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          iconColor: isDarkMode ? '#10B981' : '#059669',
        });
      }
    });
  };

  const rejectOrder = (orderId) => {
    showAlert({
      title: 'Confirmer le refus',
      text: `Voulez-vous refuser la commande #${orderId} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: swalTheme.cancelButtonColor,
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Annuler',
      iconColor: isDarkMode ? '#EF4444' : '#DC2626',
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.filter(order => order.id !== orderId));
        showAlert({
          title: 'Commande refusée',
          text: `Commande #${orderId} a été refusée`,
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
          iconColor: isDarkMode ? '#3B82F6' : '#2563EB',
        });
      }
    });
  };

  const markAsRead = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, unread: false } : order
    ));
  };

  const proposePrice = (order) => {
    setSelectedOrder(order);
    setPriceProposal('');
    setSelectedPriceOption(null);
    setShowPriceProposal(true);
  };

  const submitPriceProposal = () => {
    if (!selectedOrder) return;

    let finalPrice;
    if (selectedPriceOption !== null) {
      finalPrice = selectedOrder.suggestedPrices[selectedPriceOption];
    } else if (priceProposal) {
      const customPrice = parseFloat(priceProposal);
      const maxPrice = selectedOrder.price * 2;
      
      if (customPrice <= selectedOrder.price) {
        showAlert({
          title: 'Prix invalide',
          text: `Le prix proposé doit être supérieur au prix initial (${selectedOrder.price}€)`,
          icon: 'error',
          confirmButtonColor: '#EF4444',
          iconColor: isDarkMode ? '#EF4444' : '#DC2626',
        });
        return;
      }
      
      if (customPrice > maxPrice) {
        showAlert({
          title: 'Prix trop élevé',
          text: `Le prix proposé ne peut pas dépasser le double du prix initial (max: ${maxPrice}€)`,
          icon: 'error',
          confirmButtonColor: '#EF4444',
          iconColor: isDarkMode ? '#EF4444' : '#DC2626',
        });
        return;
      }
      
      finalPrice = customPrice;
    } else {
      showAlert({
        title: 'Prix manquant',
        text: 'Veuillez sélectionner un prix ou saisir une proposition',
        icon: 'warning',
        confirmButtonColor: '#F59E0B',
        iconColor: isDarkMode ? '#F59E0B' : '#D97706',
      });
      return;
    }

    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? { 
        ...order, 
        status: 'proposée',
        proposedPrice: finalPrice,
        proposalTime: new Date().toLocaleString(),
        unread: false
      } : order
    ));
    
    showAlert({
      title: 'Proposition envoyée !',
      text: `Proposition de prix (${finalPrice}€) envoyée au client pour la commande #${selectedOrder.id}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      iconColor: isDarkMode ? '#10B981' : '#059669',
    });
    
    setShowPriceProposal(false);
    setSelectedOrder(null);
  };

  const refreshOrders = () => {
    showAlert({
      title: 'Actualisation',
      text: 'Actualisation des commandes en cours...',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false,
      iconColor: isDarkMode ? '#3B82F6' : '#2563EB',
    });
  };

  const increaseCustomPrice = () => {
    if (!selectedOrder) return;
    const current = parseFloat(priceProposal) || selectedOrder.price;
    const newPrice = current + 5;
    const maxPrice = selectedOrder.price * 2;
    
    if (newPrice <= maxPrice) {
      setPriceProposal(newPrice.toString());
      setSelectedPriceOption(null);
    }
  };

  const decreaseCustomPrice = () => {
    if (!selectedOrder) return;
    const current = parseFloat(priceProposal) || selectedOrder.price;
    const newPrice = current - 5;
    
    if (newPrice > selectedOrder.price) {
      setPriceProposal(newPrice.toString());
      setSelectedPriceOption(null);
    }
  };

  const filteredOrders = selectedService === 'all' 
    ? orders.filter(order => order.status === 'en attente')
    : orders.filter(order => order.status === 'en attente' && order.serviceId === selectedService);

  // Ajout de styles CSS pour les alertes en mode sombre
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .dark-swal {
        background-color: #1f2937 !important;
        color: #ffffff !important;
        border: 1px solid #374151 !important;
      }
      .dark-swal-title {
        color: #ffffff !important;
      }
      .dark-swal-content {
        color: #d1d5db !important;
      }
      .dark-swal-confirm {
        background-color: #10B981 !important;
        color: white !important;
        border: none !important;
      }
      .dark-swal-confirm:hover {
        background-color: #059669 !important;
      }
      .dark-swal-cancel {
        background-color: #6B7280 !important;
        color: white !important;
        border: none !important;
      }
      .dark-swal-cancel:hover {
        background-color: #4B5563 !important;
      }
      .swal2-popup.swal2-toast {
        background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
        color: ${isDarkMode ? '#ffffff' : '#374151'} !important;
        border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  return (
    <div className={`space-y-4 ${theme.wrapperBg} min-h-full p-4 transition-colors duration-200`}>
      
      {/* Modal pour la proposition de prix */}
      {showPriceProposal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-lg shadow-2xl p-5 w-full max-w-md border ${theme.cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${theme.textMain}`}>
                Proposition de prix - Commande #{selectedOrder.id}
              </h3>
              <button
                onClick={() => {
                  setShowPriceProposal(false);
                  setSelectedOrder(null);
                }}
                className={`p-1 rounded ${theme.hoverSoft}`}
              >
                <X size={20} className={theme.textSecondary} />
              </button>
            </div>
            
            <div className="mb-5">
              <p className={`font-medium mb-1 text-sm ${theme.textMain}`}>Prix initial du client :</p>
              <p className="text-xl font-bold text-green-600 mb-3">{selectedOrder.price}€</p>
              
              <p className={`font-medium mb-2 text-sm ${theme.textMain}`}>Prix suggérés :</p>
              <div className="space-y-1.5 mb-4">
                {selectedOrder.suggestedPrices.map((price, index) => {
                  const percentage = ((price - selectedOrder.price) / selectedOrder.price * 100).toFixed(0);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedPriceOption(index);
                        setPriceProposal('');
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left transition text-sm ${
                        selectedPriceOption === index 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : `${theme.inputBg} hover:border-green-400`
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`font-semibold ${selectedPriceOption === index ? '' : theme.textMain}`}>
                            {price}€
                          </span>
                          <span className={`text-xs ml-2 ${theme.textSecondary}`}>
                            (+{percentage}%)
                          </span>
                        </div>
                        {selectedPriceOption === index && (
                          <Check className="text-green-600" size={16} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mb-3">
                <p className={`font-medium mb-1.5 text-sm ${theme.textMain}`}>Ou saisissez votre prix :</p>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={decreaseCustomPrice}
                    disabled={(!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price}
                    className={`p-1.5 rounded-lg border ${theme.inputBg} ${
                      (!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price
                        ? 'opacity-50 cursor-not-allowed'
                        : theme.hoverSoft
                    }`}
                  >
                    <Minus size={14} className={theme.textMain} />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={priceProposal}
                      onChange={(e) => {
                        setPriceProposal(e.target.value);
                        setSelectedPriceOption(null);
                      }}
                      placeholder={`Min: ${selectedOrder.price + 1}€`}
                      min={selectedOrder.price + 1}
                      max={selectedOrder.price * 2}
                      className={`w-full p-2.5 pr-10 rounded-lg border text-sm ${theme.inputBg} focus:ring-2 focus:ring-green-500 focus:outline-none`}
                    />
                    <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`}>
                      €
                    </span>
                  </div>
                  
                  <button
                    onClick={increaseCustomPrice}
                    disabled={parseFloat(priceProposal) >= selectedOrder.price * 2}
                    className={`p-1.5 rounded-lg border ${theme.inputBg} ${
                      parseFloat(priceProposal) >= selectedOrder.price * 2
                        ? 'opacity-50 cursor-not-allowed'
                        : theme.hoverSoft
                    }`}
                  >
                    <Plus size={14} className={theme.textMain} />
                  </button>
                </div>
                
                <p className={`text-xs ${theme.textSecondary}`}>
                  Max: {selectedOrder.price * 2}€ (double du prix initial)
                </p>
                
                {priceProposal && parseFloat(priceProposal) > selectedOrder.price * 2 && (
                  <p className="text-red-500 text-xs mt-1">
                    Limite maximum dépassée
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPriceProposal(false);
                  setSelectedOrder(null);
                }}
                className={`flex-1 px-3 py-2 border rounded-lg transition text-sm ${theme.inputBg} ${theme.hoverSoft} font-medium`}
              >
                Annuler
              </button>
              <button
                onClick={submitPriceProposal}
                disabled={!selectedPriceOption && !priceProposal}
                className={`flex-1 px-3 py-2 bg-green-600 text-white rounded-lg transition text-sm font-medium ${
                  !selectedPriceOption && !priceProposal
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700'
                }`}
              >
                Proposer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header de la page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className={`text-xl font-bold ${theme.textMain}`}>Commandes Reçues</h2>
          <p className={`text-sm ${theme.textSecondary} mt-0.5`}>
            {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} en attente
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* Filtre par service */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`w-full px-3 py-2 pr-8 rounded-lg border appearance-none cursor-pointer text-sm ${theme.inputBg} focus:ring-2 focus:ring-green-500 focus:outline-none`}
            >
              {availableServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none ${theme.textSecondary}`}>
              <Filter size={14} />
            </div>
          </div>

          {/* Bouton Actualiser */}
          <button 
            onClick={refreshOrders}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            <RefreshCw size={14} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className={`text-center py-8 rounded-lg border ${theme.cardBg}`}>
            <Package size={48} className={`mx-auto mb-3 ${theme.textSecondary}`} />
            <h3 className={`text-lg font-bold mb-1 ${theme.textMain}`}>
              Aucune commande trouvée
            </h3>
            <p className={`text-sm ${theme.textSecondary}`}>
              {selectedService === 'all' 
                ? "Aucune commande en attente pour le moment"
                : `Aucune commande pour le service "${availableServices.find(s => s.id === selectedService)?.name}"`
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`rounded-lg p-3 border transition-all hover:shadow-sm ${theme.cardBg} ${order.unread ? 'border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Avatar Client */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {order.clientPhoto}
                    </div>
                    {order.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  
                  {/* Info Client */}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-base truncate ${theme.textMain}`}>
                        {order.clientName}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                        {order.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500">
                        <Star size={10} className="fill-current" />
                        <span>{order.rating}</span>
                      </div>
                      <span className={`text-xs ${theme.textSecondary}`}>
                        {order.completedOrders} commandes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-2.5 rounded-lg bg-slate-50/50 dark:bg-gray-700/30">
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme.textSecondary}`}>Service</h4>
                  <p className={`font-medium text-sm ${theme.textMain}`}>{order.service}</p>
                </div>
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme.textSecondary}`}>Adresse</h4>
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className={`font-medium text-sm ${theme.textMain} line-clamp-2`}>
                      {order.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="w-full sm:w-auto">
                  <div className="text-2xl font-bold text-green-600 mb-0.5">
                    {order.price}€
                  </div>
                  {order.status === 'proposée' ? (
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs ${theme.textSecondary}`}>Proposition :</span>
                      <span className="text-sm font-bold text-blue-600">
                        {order.proposedPrice}€
                      </span>
                      <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200 font-medium">
                        En attente
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prix initial client</p>
                  )}
                </div>
                
                {order.status === 'en attente' ? (
                  <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
                    {order.unread && (
                      <button 
                        onClick={() => markAsRead(order.id)}
                        className={`px-2.5 py-1.5 border rounded-lg text-xs transition font-medium ${theme.inputBg} ${theme.hoverSoft}`}
                        title="Marquer comme lu"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => rejectOrder(order.id)}
                      className={`px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium dark:border-red-900/50 dark:hover:bg-red-900/20`}
                    >
                      Refuser
                    </button>
                    <button 
                      onClick={() => proposePrice(order)}
                      className={`px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium dark:border-blue-900/50 dark:hover:bg-blue-900/20`}
                    >
                      Proposer
                    </button>
                    <button 
                      onClick={() => acceptOrder(order.id)}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold shadow-sm hover:shadow"
                    >
                      Accepter
                    </button>
                  </div>
                ) : order.status === 'proposée' && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <Clock size={14} className="text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      Proposition envoyée
                    </span>
                  </div>
                )}
              </div>
              
              {order.status === 'proposée' && order.proposalTime && (
                <div className="mt-2 pt-1 text-right">
                  <p className={`text-xs ${theme.textSecondary}`}>
                    Envoyée le {order.proposalTime}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersReceived;