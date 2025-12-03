import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package,Clock, Filter, RefreshCw, MapPin, Star, Plus, Minus, Check
} from 'lucide-react';

const OrdersReceived = () => {
  // Récupération du mode sombre depuis le layout parent
  const { isDarkMode } = useOutletContext();

  const [selectedService, setSelectedService] = useState('all');
  const [orders, setOrders] = useState([]);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [priceProposal, setPriceProposal] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);

  // --- THÈME "EYE-FRIENDLY" & CONTRASTÉ ---
  const theme = {
    // FOND :
    // Mode Clair : Slate-50 (Gris papier doux)
    // Mode Sombre : Gray-900 (Classique)
    wrapperBg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',

    // CARTES :
    // Mode Clair : Blanc avec bordure Slate-300 (Visible) et ombre légère
    // Mode Sombre : Gray-800 avec bordure Gray-700
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-300 shadow-sm',

    // TEXTE PRINCIPAL (Titres, Noms, Prix) :
    // Mode Clair : Slate-900 (Noir/Gris très foncé pour contraste fort)
    // Mode Sombre : Blanc
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',

    // TEXTE SECONDAIRE (Labels, dates) :
    // Mode Clair : Slate-600 (Gris moyen foncé, pas pâle)
    // Mode Sombre : Gray-400
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',

    // INPUTS & BOUTONS SECONDAIRES :
    // Mode Clair : Fond blanc, Bordure Slate-300, Texte Slate-900
    inputBg: isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300',
    
    // ELEMENTS ACTIFS/HOVER (Fonds légers) :
    bgSoft: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    hoverSoft: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
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
        suggestedPrices: [93.5, 102, 110.5] 
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
        suggestedPrices: [132, 144, 156]
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
        suggestedPrices: [165, 180, 195]
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
        suggestedPrices: [71.5, 78, 84.5]
      }
    ];
    setOrders(mockOrders);
  }, []);

  const acceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'acceptée' } : order
    ));
    alert(`Commande #${orderId} acceptée avec succès!`);
  };

  const rejectOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    alert(`Commande #${orderId} refusée`);
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
        alert(`Le prix proposé doit être supérieur au prix initial (${selectedOrder.price}€)`);
        return;
      }
      
      if (customPrice > maxPrice) {
        alert(`Le prix proposé ne peut pas dépasser le double du prix initial (max: ${maxPrice}€)`);
        return;
      }
      
      finalPrice = customPrice;
    } else {
      alert('Veuillez sélectionner un prix ou saisir une proposition');
      return;
    }

    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? { 
        ...order, 
        status: 'proposée',
        proposedPrice: finalPrice,
        proposalTime: new Date().toLocaleString()
      } : order
    ));
    
    alert(`Proposition de prix (${finalPrice}€) envoyée au client pour la commande #${selectedOrder.id}`);
    setShowPriceProposal(false);
    setSelectedOrder(null);
  };

  const refreshOrders = () => {
    alert('Actualisation des commandes...');
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

  return (
    <div className={`space-y-6 ${theme.wrapperBg} min-h-full transition-colors duration-200`}>
      
      {/* Modal pour la proposition de prix */}
      {showPriceProposal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-xl shadow-2xl p-6 w-full max-w-md border ${theme.cardBg}`}>
            <h3 className={`text-xl font-bold mb-4 ${theme.textMain}`}>
              Proposer un prix pour la commande #{selectedOrder.id}
            </h3>
            
            <div className="mb-6">
              <p className={`font-medium mb-2 ${theme.textMain}`}>Prix initial du client :</p>
              <p className="text-2xl font-bold text-green-600 mb-4">{selectedOrder.price}€</p>
              
              <p className={`font-medium mb-3 ${theme.textMain}`}>Choisissez parmi les prix suggérés :</p>
              <div className="space-y-2 mb-6">
                {selectedOrder.suggestedPrices.map((price, index) => {
                  const percentage = ((price - selectedOrder.price) / selectedOrder.price * 100).toFixed(0);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedPriceOption(index);
                        setPriceProposal('');
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        selectedPriceOption === index 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : `${theme.inputBg} hover:border-green-400`
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`font-semibold ${selectedPriceOption === index ? '' : theme.textMain}`}>{price}€</span>
                          <span className={`text-sm ml-2 ${theme.textSecondary}`}>
                            (+{percentage}%)
                          </span>
                        </div>
                        {selectedPriceOption === index && (
                          <Check className="text-green-600" size={20} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mb-4">
                <p className={`font-medium mb-3 ${theme.textMain}`}>Ou saisissez votre propre prix :</p>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={decreaseCustomPrice}
                    disabled={(!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price}
                    className={`p-2 rounded-lg border ${theme.inputBg} ${
                      (!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price
                        ? 'opacity-50 cursor-not-allowed'
                        : theme.hoverSoft
                    }`}
                  >
                    <Minus size={16} className={theme.textMain} />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={priceProposal}
                      onChange={(e) => {
                        setPriceProposal(e.target.value);
                        setSelectedPriceOption(null);
                      }}
                      placeholder={`Minimum: ${selectedOrder.price + 1}€`}
                      min={selectedOrder.price + 1}
                      max={selectedOrder.price * 2}
                      className={`w-full p-3 pr-12 rounded-lg border ${theme.inputBg} focus:ring-2 focus:ring-green-500 focus:outline-none`}
                    />
                    <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`}>
                      €
                    </span>
                  </div>
                  
                  <button
                    onClick={increaseCustomPrice}
                    disabled={parseFloat(priceProposal) >= selectedOrder.price * 2}
                    className={`p-2 rounded-lg border ${theme.inputBg} ${
                      parseFloat(priceProposal) >= selectedOrder.price * 2
                        ? 'opacity-50 cursor-not-allowed'
                        : theme.hoverSoft
                    }`}
                  >
                    <Plus size={16} className={theme.textMain} />
                  </button>
                </div>
                
                <p className={`text-sm ${theme.textSecondary}`}>
                  Prix maximum autorisé : {selectedOrder.price * 2}€ (double du prix initial)
                </p>
                
                {priceProposal && parseFloat(priceProposal) > selectedOrder.price * 2 && (
                  <p className="text-red-500 text-sm mt-2">
                    Le prix dépasse la limite maximum de {selectedOrder.price * 2}€
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPriceProposal(false);
                  setSelectedOrder(null);
                }}
                className={`flex-1 px-4 py-3 border rounded-lg transition ${theme.inputBg} ${theme.hoverSoft} font-medium`}
              >
                Annuler
              </button>
              <button
                onClick={submitPriceProposal}
                disabled={!selectedPriceOption && !priceProposal}
                className={`flex-1 px-4 py-3 bg-green-600 text-white rounded-lg transition font-medium ${
                  !selectedPriceOption && !priceProposal
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700'
                }`}
              >
                Proposer ce prix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header de la page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className={`text-2xl font-bold ${theme.textMain}`}>Commandes Reçues</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Filtre par service */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`w-full px-4 py-2 pr-10 rounded-lg border appearance-none cursor-pointer ${theme.inputBg} focus:ring-2 focus:ring-green-500 focus:outline-none`}
            >
              {availableServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${theme.textSecondary}`}>
              <Filter size={16} />
            </div>
          </div>

          {/* Bouton Actualiser */}
          <button 
            onClick={refreshOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${theme.cardBg}`}>
            <Package size={64} className={`mx-auto mb-4 ${theme.textSecondary}`} />
            <h3 className={`text-xl font-bold mb-2 ${theme.textMain}`}>
              Aucune commande trouvée
            </h3>
            <p className={theme.textSecondary}>
              {selectedService === 'all' 
                ? "Aucune commande en attente pour le moment"
                : `Aucune commande pour le service "${availableServices.find(s => s.id === selectedService)?.name}"`
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`rounded-xl p-6 border transition-all hover:shadow-md ${theme.cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  {/* Avatar Client */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border font-bold text-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {order.clientPhoto}
                  </div>
                  
                  {/* Info Client */}
                  <div>
                    <h3 className={`font-bold text-lg ${theme.textMain}`}>{order.clientName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500">
                        <Star size={12} className="fill-current" />
                        <span>{order.rating}</span>
                      </div>
                      <span className={`text-sm ${theme.textSecondary}`}>• {order.completedOrders} commandes</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium ${theme.textSecondary} bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full`}>
                  {order.time}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${theme.textSecondary}`}>Service demandé</h4>
                  <p className={`font-medium ${theme.textMain}`}>{order.service}</p>
                </div>
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${theme.textSecondary}`}>Adresse</h4>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-red-500" />
                    <span className={`font-medium ${theme.textMain}`}>{order.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {order.price}€
                  </div>
                  {order.status === 'proposée' ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-sm ${theme.textSecondary}`}>
                        Prix proposé : 
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {order.proposedPrice}€
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200 font-medium">
                        En attente
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Prix initial proposé par le client</p>
                  )}
                </div>
                
                {order.status === 'en attente' ? (
                  <div className="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => rejectOrder(order.id)}
                      className={`flex-1 sm:flex-none px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium dark:border-red-900/50 dark:hover:bg-red-900/20`}
                    >
                      Refuser
                    </button>
                    <button 
                      onClick={() => proposePrice(order)}
                      className={`flex-1 sm:flex-none px-4 py-2.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium dark:border-blue-900/50 dark:hover:bg-blue-900/20`}
                    >
                      Proposer un prix
                    </button>
                    <button 
                      onClick={() => acceptOrder(order.id)}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow-sm hover:shadow"
                    >
                      Accepter
                    </button>
                  </div>
                ) : order.status === 'proposée' && (
                  <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <Clock size={18} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Proposition envoyée au client
                    </span>
                  </div>
                )}
              </div>
              
              {order.status === 'proposée' && order.proposalTime && (
                <div className="mt-4 pt-2 text-right">
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