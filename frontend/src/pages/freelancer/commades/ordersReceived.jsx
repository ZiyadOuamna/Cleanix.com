import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, Filter, RefreshCw, MapPin, Star, Plus, Minus, Check
} from 'lucide-react';

const OrdersReceived = () => {
  const { isDarkMode } = useOutletContext();
  const [selectedService, setSelectedService] = useState('all');
  const [orders, setOrders] = useState([]);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [priceProposal, setPriceProposal] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);

  // Services disponibles pour le filtre
  const availableServices = [
    { id: 'all', name: 'Tous les services' },
    { id: 'nettoyage-complet', name: 'Nettoyage complet' },
    { id: 'nettoyage-printemps', name: 'Nettoyage de printemps' },
    { id: 'nettoyage-bureau', name: 'Nettoyage bureau' },
    { id: 'nettoyage-vitres', name: 'Nettoyage de vitres' },
    { id: 'nettoyage-apres-travaux', name: 'Nettoyage après travaux' }
  ];

  // Classes conditionnelles pour le dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

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
        suggestedPrices: [93.5, 102, 110.5] // +10%, +20%, +30%
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
        suggestedPrices: [132, 144, 156] // +10%, +20%, +30%
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
        suggestedPrices: [165, 180, 195] // +10%, +20%, +30%
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
        suggestedPrices: [71.5, 78, 84.5] // +10%, +20%, +30%
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
    <div className={`space-y-6 ${bgClass} min-h-full`}>
      {/* Modal pour la proposition de prix */}
      {showPriceProposal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-lg p-6 w-full max-w-md ${cardBgClass}`}>
            <h3 className={`text-xl font-bold mb-4 ${textClass}`}>
              Proposer un prix pour la commande #{selectedOrder.id}
            </h3>
            
            <div className="mb-6">
              <p className={`font-medium mb-2 ${textClass}`}>Prix initial du client :</p>
              <p className="text-2xl font-bold text-green-600 mb-4">{selectedOrder.price}€</p>
              
              <p className={`font-medium mb-3 ${textClass}`}>Choisissez parmi les prix suggérés :</p>
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
                          ? 'border-green-500 bg-green-50 dark:bg-green-900' 
                          : borderClass
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{price}€</span>
                          <span className={`text-sm ml-2 ${textSecondaryClass}`}>
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
                <p className={`font-medium mb-3 ${textClass}`}>Ou saisissez votre propre prix :</p>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={decreaseCustomPrice}
                    disabled={(!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price}
                    className={`p-2 rounded-lg border ${borderClass} ${
                      (!priceProposal && selectedOrder.price === 0) || (parseFloat(priceProposal) || selectedOrder.price) <= selectedOrder.price
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Minus size={16} />
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
                      className={`w-full p-3 pr-12 rounded-lg border ${borderClass} ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
                    </span>
                  </div>
                  
                  <button
                    onClick={increaseCustomPrice}
                    disabled={parseFloat(priceProposal) >= selectedOrder.price * 2}
                    className={`p-2 rounded-lg border ${borderClass} ${
                      parseFloat(priceProposal) >= selectedOrder.price * 2
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <p className={`text-sm ${textSecondaryClass}`}>
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
                className={`flex-1 px-4 py-3 border ${borderClass} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
              >
                Annuler
              </button>
              <button
                onClick={submitPriceProposal}
                disabled={!selectedPriceOption && !priceProposal}
                className={`flex-1 px-4 py-3 bg-green-600 text-white rounded-lg transition ${
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className={`text-2xl font-bold ${textClass}`}>Commandes Reçues</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Filtre par service */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`w-full px-4 py-2 pr-10 rounded-lg border ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              {availableServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Filter size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </div>
          </div>

          {/* Bouton Actualiser */}
          <button 
            onClick={refreshOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className={`text-center py-12 rounded-xl shadow-lg border ${borderClass} ${cardBgClass}`}>
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold ${textSecondaryClass} mb-2`}>
              Aucune commande trouvée
            </h3>
            <p className={textSecondaryClass}>
              {selectedService === 'all' 
                ? "Aucune commande en attente pour le moment"
                : `Aucune commande pour le service "${availableServices.find(s => s.id === selectedService)?.name}"`
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`rounded-xl shadow-lg p-6 border ${borderClass} ${cardBgClass}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border font-bold ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    {order.clientPhoto}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${textClass}`}>{order.clientName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className={`text-sm ${textSecondaryClass}`}>{order.rating}</span>
                      </div>
                      <span className={`text-sm ${textSecondaryClass}`}>• {order.completedOrders} commandes</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm ${textSecondaryClass}`}>{order.time}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className={`font-medium mb-2 ${textClass}`}>Service demandé</h4>
                  <p className={textClass}>{order.service}</p>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${textClass}`}>Adresse</h4>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={textSecondaryClass} />
                    <span className={textClass}>{order.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {order.price}€
                  </div>
                  {order.status === 'proposée' && (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${textSecondaryClass}`}>
                        Prix proposé : 
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {order.proposedPrice}€
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        En attente du client
                      </span>
                    </div>
                  )}
                </div>
                
                {order.status === 'en attente' ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => rejectOrder(order.id)}
                      className={`px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition dark:hover:bg-red-900 dark:border-red-400 dark:text-red-400`}
                    >
                      Refuser
                    </button>
                    <button 
                      onClick={() => acceptOrder(order.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Accepter
                    </button>
                    <button 
                      onClick={() => proposePrice(order)}
                      className={`px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition dark:hover:bg-blue-900 dark:border-blue-400 dark:text-blue-400`}
                    >
                      Proposer un prix
                    </button>
                  </div>
                ) : order.status === 'proposée' && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                      Proposition envoyée
                    </span>
                  </div>
                )}
              </div>
              
              {order.status === 'proposée' && order.proposalTime && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-sm ${textSecondaryClass}`}>
                    Proposition envoyée le {order.proposalTime}
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