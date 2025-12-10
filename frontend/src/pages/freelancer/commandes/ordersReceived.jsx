import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, Clock, Filter, RefreshCw, MapPin, Star, 
  Plus, Minus, Check, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getReceivedOrders, proposePrice } from '../../../services/orderService';

const MySwal = withReactContent(Swal);

const OrdersReceived = () => {
  const { isDarkMode } = useOutletContext();

  const [selectedService, setSelectedService] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [priceProposal, setPriceProposal] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Charger les commandes reçues
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getReceivedOrders();
        if (response.success) {
          setOrders(response.data);
        } else {
          showAlert({
            title: 'Erreur',
            text: response.message || 'Impossible de charger les commandes',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        showAlert({
          title: 'Erreur',
          text: 'Impossible de charger les commandes',
          icon: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const proposePrice = (order) => {
    setSelectedOrder(order);
    setPriceProposal('');
    setSelectedPriceOption(null);
    setShowPriceProposal(true);
  };

  const submitPriceProposal = async () => {
    if (!selectedOrder) return;

    let finalPrice;
    if (selectedPriceOption !== null) {
      finalPrice = selectedOrder.suggestedPrices[selectedPriceOption];
    } else if (priceProposal) {
      finalPrice = parseFloat(priceProposal);
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

    try {
      setIsSubmitting(true);
      const response = await proposePrice(selectedOrder.id, {
        proposed_price: finalPrice,
        description: '',
        estimated_duration_hours: null,
        estimated_completion_date: null
      });

      if (response.success) {
        showAlert({
          title: 'Proposition envoyée !',
          text: `Proposition de prix (${finalPrice}DH) envoyée au client pour la commande #${selectedOrder.id}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          iconColor: isDarkMode ? '#10B981' : '#059669',
        });

        // Mettre à jour la liste
        setOrders(orders.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, proposals: [...(order.proposals || []), response.data] }
            : order
        ));

        setShowPriceProposal(false);
        setSelectedOrder(null);
      } else {
        showAlert({
          title: 'Erreur',
          text: response.message || 'Impossible d\'envoyer la proposition',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      showAlert({
        title: 'Erreur',
        text: 'Impossible d\'envoyer la proposition',
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const increaseCustomPrice = () => {
    if (!selectedOrder) return;
    const current = parseFloat(priceProposal) || parseFloat(selectedOrder.initial_price) || 0;
    const newPrice = current + 5;
    setPriceProposal(newPrice.toString());
    setSelectedPriceOption(null);
  };

  const decreaseCustomPrice = () => {
    if (!selectedOrder) return;
    const current = parseFloat(priceProposal) || parseFloat(selectedOrder.initial_price) || 0;
    const newPrice = current - 5;
    if (newPrice > 0) {
      setPriceProposal(newPrice.toString());
      setSelectedPriceOption(null);
    }
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

  // Inject dark mode styles for SweetAlert2
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  const filteredOrders = selectedService === 'all' 
    ? orders.filter(order => order.status === 'pending')
    : orders.filter(order => order.status === 'pending' && order.service_type === selectedService);

  if (isLoading) {
    return (
      <div className={`${theme.wrapperBg} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={theme.textSecondary}>Chargement...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-xl font-bold text-green-600 mb-3">{parseFloat(selectedOrder.initial_price || 0).toFixed(2)}DH</p>
              
              <p className={`font-medium mb-2 text-sm ${theme.textMain}`}>Ou saisissez votre prix :</p>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={decreaseCustomPrice}
                  disabled={!priceProposal || parseFloat(priceProposal) <= 0}
                  className={`p-1.5 rounded-lg border ${theme.inputBg} ${
                    (!priceProposal || parseFloat(priceProposal) <= 0)
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
                    placeholder={`Votre prix`}
                    min="0"
                    step="0.01"
                    className={`w-full p-2.5 pr-10 rounded-lg border text-sm ${theme.inputBg} focus:ring-2 focus:ring-green-500 focus:outline-none`}
                  />
                  <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`}>
                    DH
                  </span>
                </div>
                
                <button
                  onClick={increaseCustomPrice}
                  className={`p-1.5 rounded-lg border ${theme.inputBg} ${theme.hoverSoft}`}
                >
                  <Plus size={14} className={theme.textMain} />
                </button>
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
                disabled={!priceProposal || isSubmitting}
                className={`flex-1 px-3 py-2 bg-green-600 text-white rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 ${
                  !priceProposal || isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Proposer
                  </>
                )}
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
              Aucune commande en attente pour le moment
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`rounded-lg p-3 border transition-all hover:shadow-sm ${theme.cardBg}`}>
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Avatar Client */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {(order.client?.nom || 'C')?.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Info Client */}
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-base truncate ${theme.textMain}`}>
                      {`${order.client?.prenom || ''} ${order.client?.nom || 'Client'}`.trim()}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500">
                        <Star size={10} className="fill-current" />
                        <span>4.5</span>
                      </div>
                      <span className={`text-xs ${theme.textSecondary}`}>
                        25 commandes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-2.5 rounded-lg bg-slate-50/50 dark:bg-gray-700/30">
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme.textSecondary}`}>Service</h4>
                  <p className={`font-medium text-sm ${theme.textMain}`}>{order.service_type}</p>
                </div>
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme.textSecondary}`}>Adresse</h4>
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className={`font-medium text-sm ${theme.textMain} line-clamp-2`}>
                      {order.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="w-full sm:w-auto">
                  <div className="text-2xl font-bold text-green-600 mb-0.5">
                    {parseFloat(order.initial_price || 0).toFixed(2)}DH
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Prix initial client</p>
                </div>
                
                <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersReceived;
