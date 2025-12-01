import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommandesAcceptees = ({ isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState('en_cours');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Classes conditionnelles pour le dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  // Données simulées des commandes acceptées
  const [orders, setOrders] = useState([
    {
      id: 'CMD-2024-001',
      clientName: 'Marie Dubois',
      clientPhone: '+212 6 12 34 56 78',
      clientEmail: 'marie.dubois@email.com',
      service: 'Nettoyage résidentiel',
      date: '2024-01-15',
      time: '10:00 - 13:00',
      address: '123 Avenue Hassan II, Casablanca',
      amount: 450.00,
      status: 'en_cours',
      paymentStatus: 'payé',
      specialInstructions: 'Préfère les produits écologiques. Clés chez le gardien.',
      createdAt: '2024-01-14 14:30',
      acceptedAt: '2024-01-14 15:45',
      beforePhotos: [],
      afterPhotos: [],
      submitted: false,
      clientValidation: false
    },
    {
      id: 'CMD-2024-002',
      clientName: 'Ahmed El Amrani',
      clientPhone: '+212 6 45 67 89 01',
      clientEmail: 'ahmed.elamrani@email.com',
      service: 'Nettoyage de bureau',
      date: '2024-01-18',
      time: '08:00 - 11:00',
      address: '12 Rue des Entrepreneurs, Casablanca',
      amount: 520.00,
      status: 'à_venir',
      paymentStatus: 'payé',
      specialInstructions: 'Bureau au 3ème étage. Code d\'accès: 1234',
      createdAt: '2024-01-16 16:45',
      acceptedAt: '2024-01-16 17:30',
      beforePhotos: [],
      afterPhotos: [],
      submitted: false,
      clientValidation: false
    }
  ]);

  // Vérifier si une commande est déjà en cours
  const hasOrderInProgress = () => {
    return orders.some(order => order.status === 'en_cours' && !order.submitted);
  };

  // Fonction pour développer/réduire les détails d'une commande
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Fonction pour démarrer une commande
  const startOrder = (orderId) => {
    if (hasOrderInProgress()) {
      alert('Vous avez déjà une commande en cours. Terminez-la avant d\'en démarrer une nouvelle.');
      return;
    }
    
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'en_cours' } : order
    ));
    alert(`Commande ${orderId} démarrée !`);
  };

  // Fonction pour annuler une commande
  const cancelOrder = (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      alert(`Commande ${orderId} annulée.`);
    }
  };

  // Filtres disponibles (seulement en cours et à venir)
  const filters = [
    { id: 'en_cours', label: 'En cours', count: orders.filter(o => o.status === 'en_cours').length },
    { id: 'à_venir', label: 'À venir', count: orders.filter(o => o.status === 'à_venir').length },
  ];

  // Filtrer les commandes
  const filteredOrders = activeFilter === 'toutes' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  // Fonction pour gérer l'upload de photos
  const handlePhotoUpload = (orderId, type, files) => {
    const fileList = Array.from(files);
    const photoUrls = fileList.map(file => URL.createObjectURL(file));
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            [type === 'before' ? 'beforePhotos' : 'afterPhotos']: [
              ...order[type === 'before' ? 'beforePhotos' : 'afterPhotos'],
              ...photoUrls
            ]
          }
        : order
    ));
  };

  // Fonction pour supprimer une photo
  const removePhoto = (orderId, type, photoIndex) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const photos = [...order[type === 'before' ? 'beforePhotos' : 'afterPhotos']];
        URL.revokeObjectURL(photos[photoIndex]);
        photos.splice(photoIndex, 1);
        return {
          ...order,
          [type === 'before' ? 'beforePhotos' : 'afterPhotos']: photos
        };
      }
      return order;
    }));
  };

  // Fonction pour soumettre une commande terminée
  const submitCompletedOrder = (orderId) => {
    // Marquer la commande comme soumise pour validation
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, submitted: true } : order
    ));
    
    // Simuler l'envoi de notification au client
    alert(`Notification envoyée au client pour valider la terminaison de la commande ${orderId}.`);
    
    // Simuler l'envoi de notification au superviseur
    alert(`Commande ${orderId} soumise au superviseur pour validation finale.`);
  };

  // Fonction pour soumettre une réclamation
  const submitComplaint = (orderId) => {
    const complaintReason = prompt('Veuillez décrire la raison de votre réclamation :');
    if (complaintReason) {
      alert(`Réclamation pour la commande ${orderId} envoyée au superviseur et au support.`);
      // Ici, vous pourriez envoyer la réclamation à une API
    }
  };

  // Fonction pour formater le statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'à_venir': { label: 'À venir', color: 'bg-blue-100 text-blue-800', darkColor: 'bg-blue-900 text-blue-200' },
      'en_cours': { label: 'En cours', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-900 text-yellow-200' },
      'soumis': { label: 'En validation', color: 'bg-purple-100 text-purple-800', darkColor: 'bg-purple-900 text-purple-200' },
      'validé': { label: 'Validé', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-900 text-green-200' },
    };
    const config = statusConfig[status] || statusConfig['en_cours'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDarkMode ? config.darkColor : config.color
      }`}>
        {config.label}
      </span>
    );
  };

  // Fonction pour formater le statut de paiement
  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      'payé': { label: 'Payé', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-900 text-green-200' },
      'acompte': { label: 'Acompte', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-900 text-yellow-200' },
      'non_payé': { label: 'À payer', color: 'bg-red-100 text-red-800', darkColor: 'bg-red-900 text-red-200' },
    };
    const config = paymentConfig[paymentStatus];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDarkMode ? config.darkColor : config.color
      }`}>
        {config.label}
      </span>
    );
  };

  // Rendu des photos
  const renderPhotos = (orderId, type, photos) => {
    if (photos.length === 0) {
      return (
        <div className="text-center py-4">
          <p className={textSecondaryClass}>Aucune photo ajoutée (optionnel)</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img 
              src={photo} 
              alt={`Photo ${type === 'before' ? 'avant' : 'après'} ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <button
              onClick={() => removePhoto(orderId, type, index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bgClass} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Commandes Acceptées</h1>
              <p className={`${textSecondaryClass} mt-2`}>Gérez vos interventions en cours et à venir</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/freelancer/commandes-disponibles"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Voir nouvelles commandes
              </Link>
            </div>
          </div>
        </div>

        {/* Avertissement si commande en cours */}
        {hasOrderInProgress() && (
          <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Vous avez une commande en cours
                </h3>
                <div className={`mt-2 text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  <p>
                    Vous ne pouvez avoir qu'une seule commande en cours à la fois. 
                    Terminez votre commande actuelle avant d'en accepter une nouvelle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className={`${cardBgClass} rounded-lg shadow mb-6 ${borderClass} border`}>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : `${textSecondaryClass} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeFilter === filter.id
                      ? 'bg-blue-500 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className={`${cardBgClass} rounded-lg shadow p-8 text-center ${borderClass} border`}>
              <div className="text-4xl mb-4">📭</div>
              <h3 className={`text-lg font-medium ${textClass} mb-2`}>Aucune commande trouvée</h3>
              <p className={textSecondaryClass}>
                Vous n'avez pas de commandes {activeFilter !== 'toutes' ? `avec le statut "${filters.find(f => f.id === activeFilter)?.label}"` : 'acceptées'}.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className={`${cardBgClass} rounded-lg shadow overflow-hidden ${borderClass} border`}>
                {/* En-tête de la commande */}
                <div className={`p-6 ${hoverBgClass} transition-colors cursor-pointer`} onClick={() => toggleOrderDetails(order.id)}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                        }`}>
                          <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            {order.clientName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className={`font-medium ${textClass}`}>
                            {order.clientName} • {order.service}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(order.status)}
                            {order.submitted && getStatusBadge('soumis')}
                            {getPaymentBadge(order.paymentStatus)}
                            <span className={`text-sm ${textSecondaryClass}`}>
                              {order.date} • {order.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className={`text-2xl font-bold ${textClass}`}>{order.amount.toFixed(2)} MAD</div>
                      <div className="flex items-center justify-end mt-1">
                        <span className={`text-sm ${textSecondaryClass}`}>
                          {order.id}
                        </span>
                        <svg 
                          className={`w-5 h-5 ml-2 transform transition-transform ${
                            expandedOrder === order.id ? 'rotate-180' : ''
                          } ${textSecondaryClass}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails de la commande (expandable) */}
                {expandedOrder === order.id && (
                  <div className={`border-t ${borderClass} p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informations client */}
                      <div>
                        <h4 className={`font-medium ${textClass} mb-3`}>👤 Informations client</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Nom :</span>
                            <span className={textClass}>{order.clientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Téléphone :</span>
                            <a href={`tel:${order.clientPhone}`} className="text-blue-600 hover:text-blue-800">
                              {order.clientPhone}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Email :</span>
                            <a href={`mailto:${order.clientEmail}`} className="text-blue-600 hover:text-blue-800">
                              {order.clientEmail}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Détails de la commande */}
                      <div>
                        <h4 className={`font-medium ${textClass} mb-3`}>📋 Détails de la commande</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Date :</span>
                            <span className={textClass}>{order.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Heure :</span>
                            <span className={textClass}>{order.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Adresse :</span>
                            <span className={`text-right ${textClass}`}>{order.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Instructions spéciales */}
                      {order.specialInstructions && (
                        <div className="md:col-span-2">
                          <h4 className={`font-medium ${textClass} mb-3`}>📝 Instructions spéciales</h4>
                          <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={textClass}>{order.specialInstructions}</p>
                          </div>
                        </div>
                      )}

                      {/* Historique */}
                      <div className="md:col-span-2">
                        <h4 className={`font-medium ${textClass} mb-3`}>🕒 Historique</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Créée le :</span>
                            <span className={textClass}>{order.createdAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={textSecondaryClass}>Acceptée le :</span>
                            <span className={textClass}>{order.acceptedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Formulaire de photos pour les commandes en cours */}
                      {order.status === 'en_cours' && !order.submitted && (
                        <div className="md:col-span-2 pt-4 border-t border-gray-200">
                          <h4 className={`font-medium ${textClass} mb-4`}>📸 Documentation de l'intervention (Optionnel)</h4>
                          
                          {/* Section photos avant */}
                          <div className="mb-6">
                            <h5 className={`font-medium ${textClass} mb-2`}>Photos avant l'intervention :</h5>
                            {renderPhotos(order.id, 'before', order.beforePhotos)}
                            <div className="mt-2">
                              <label className={`block text-sm font-medium ${textSecondaryClass} mb-2`}>
                                Ajouter des photos "avant" (optionnel)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoUpload(order.id, 'before', e.target.files)}
                                className={`block w-full text-sm ${textSecondaryClass} border ${borderClass} rounded-lg cursor-pointer focus:outline-none ${inputBgClass}`}
                              />
                              <p className={`mt-1 text-sm ${textSecondaryClass}`}>Format: JPG, PNG (max 5Mo)</p>
                            </div>
                          </div>

                          {/* Section photos après */}
                          <div className="mb-6">
                            <h5 className={`font-medium ${textClass} mb-2`}>Photos après l'intervention :</h5>
                            {renderPhotos(order.id, 'after', order.afterPhotos)}
                            <div className="mt-2">
                              <label className={`block text-sm font-medium ${textSecondaryClass} mb-2`}>
                                Ajouter des photos "après" (optionnel)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoUpload(order.id, 'after', e.target.files)}
                                className={`block w-full text-sm ${textSecondaryClass} border ${borderClass} rounded-lg cursor-pointer focus:outline-none ${inputBgClass}`}
                              />
                              <p className={`mt-1 text-sm ${textSecondaryClass}`}>Format: JPG, PNG (max 5Mo)</p>
                            </div>
                          </div>

                          {/* Bouton de soumission */}
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => submitCompletedOrder(order.id)}
                              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                            >
                              ✅ Terminer la commande
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message pour les commandes soumises */}
                      {order.submitted && (
                        <div className="md:col-span-2 pt-4 border-t border-gray-200">
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                  Commande en attente de validation
                                </h3>
                                <div className={`mt-2 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                  <p>
                                    Cette commande a été soumise. Le client doit valider la terminaison.
                                    Une fois validée par le client, le superviseur procédera au paiement.
                                  </p>
                                  <p className="mt-1">
                                    {order.beforePhotos.length > 0 || order.afterPhotos.length > 0 ? (
                                      `Photos avant : ${order.beforePhotos.length} | Photos après : ${order.afterPhotos.length}`
                                    ) : (
                                      "Aucune photo n'a été ajoutée"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => submitComplaint(order.id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                              >
                                🚨 Signaler un problème
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="md:col-span-2 pt-4 border-t border-gray-700">
                        <div className="flex flex-wrap gap-3">
                          {order.status === 'à_venir' && (
                            <button
                              onClick={() => startOrder(order.id)}
                              disabled={hasOrderInProgress()}
                              className={`px-4 py-2 rounded-md text-sm font-medium ${
                                hasOrderInProgress()
                                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              🚀 Démarrer la commande
                            </button>
                          )}
                          
                          {order.status === 'en_cours' && !order.submitted && (
                            <button
                              onClick={() => alert(`Contacter ${order.clientName}`)}
                              className={`border ${borderClass} px-4 py-2 rounded-md text-sm font-medium ${
                                isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              📞 Contacter le client
                            </button>
                          )}
                          
                          <button
                            onClick={() => alert(`Voir l'adresse sur la carte`)}
                            className={`border ${borderClass} px-4 py-2 rounded-md text-sm font-medium ${
                              isDarkMode 
                                ? 'text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            🗺️ Voir sur la carte
                          </button>
                          
                          {/* Bouton d'annulation */}
                          {!order.submitted && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                              ❌ Annuler la commande
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandesAcceptees;