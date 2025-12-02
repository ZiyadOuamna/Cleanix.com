import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Camera, Upload, X, Check, MapPin, Phone, Mail, Calendar, Clock, AlertCircle, Shield, ShieldCheck, ShieldOff, MessageCircle } from 'lucide-react';

const CommandesAcceptees = () => {
  const { isDarkMode } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState('en_cours');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [uploadingPhotos, setUploadingPhotos] = useState({ before: false, after: false });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedOrderForPermission, setSelectedOrderForPermission] = useState(null);

  // Classes conditionnelles pour le dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

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
      photoPermission: 'pending', // 'pending', 'granted', 'denied'
      permissionRequestedAt: null,
      permissionResponseAt: null,
      permissionReason: '',
      submitted: false,
      clientValidation: false,
      rating: 4.8,
      completedOrders: 15
    },
    {
      id: 'CMD-2024-002',
      clientName: 'Ahmed El Amrani',
      clientPhone: '+212 6 45 67 89 01',
      clientEmail: 'ahmed.elamrani@email.com',
      service: 'Nettoyage de bureau',
      date: '2024-01-16',
      time: '08:00 - 11:00',
      address: '12 Rue des Entrepreneurs, Casablanca',
      amount: 520.00,
      status: 'en_cours',
      paymentStatus: 'payé',
      specialInstructions: 'Bureau au 3ème étage. Code d\'accès: 1234',
      createdAt: '2024-01-16 16:45',
      acceptedAt: '2024-01-16 17:30',
      beforePhotos: [],
      afterPhotos: [],
      photoPermission: 'pending',
      permissionRequestedAt: null,
      permissionResponseAt: null,
      permissionReason: '',
      submitted: false,
      clientValidation: false,
      rating: 4.5,
      completedOrders: 8
    }
  ]);

  // Fonction pour développer/réduire les détails d'une commande
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Fonction pour annuler une commande
  const cancelOrder = (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.')) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'annulée' } : order
      ));
      alert(`Commande ${orderId} annulée.`);
    }
  };

  // Fonction pour demander la permission de photos
  const requestPhotoPermission = (orderId) => {
    setSelectedOrderForPermission(orderId);
    setShowPermissionModal(true);
  };

  // Fonction pour envoyer la demande de permission
  const sendPermissionRequest = () => {
    if (!selectedOrderForPermission) return;
    
    const reason = document.getElementById('permission-reason')?.value || 
                   'Documentation de qualité pour notre assurance qualité';
    
    setOrders(prev => prev.map(order => 
      order.id === selectedOrderForPermission ? { 
        ...order, 
        photoPermission: 'pending',
        permissionRequestedAt: new Date().toLocaleString(),
        permissionReason: reason
      } : order
    ));
    
    // Simuler l'envoi de notification au client
    alert(`📩 Demande de permission envoyée au client ${selectedOrderForPermission} !\nLe client recevra une notification pour autoriser les photos.`);
    
    setShowPermissionModal(false);
    setSelectedOrderForPermission(null);
  };

  // Fonction pour simuler la réponse du client (dans la réalité, ce serait côté client)
  const simulateClientResponse = (orderId, response) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        photoPermission: response,
        permissionResponseAt: new Date().toLocaleString()
      } : order
    ));
    
    if (response === 'granted') {
      alert(`✅ Le client a accepté la prise de photos pour la commande ${orderId}`);
    } else {
      alert(`❌ Le client a refusé la prise de photos pour la commande ${orderId}`);
    }
  };

  // Fonction pour gérer l'upload de photos (seulement si permission accordée)
  const handlePhotoUpload = (orderId, type, files) => {
    const order = orders.find(o => o.id === orderId);
    if (order.photoPermission !== 'granted') {
      alert('Vous devez avoir la permission du client pour ajouter des photos');
      return;
    }
    
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
    
    setUploadingPhotos({ ...uploadingPhotos, [type]: true });
    setTimeout(() => setUploadingPhotos({ ...uploadingPhotos, [type]: false }), 1000);
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
    const order = orders.find(o => o.id === orderId);
    
    // Vérifier si des photos sont requises (si permission accordée)
    if (order.photoPermission === 'granted' && order.afterPhotos.length === 0) {
      if (!window.confirm("Le client a autorisé les photos mais vous n'avez pas ajouté de photos 'après'. Voulez-vous quand même soumettre la commande ?")) {
        return;
      }
    }
    
    // Marquer la commande comme soumise pour validation
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'soumis', submitted: true } : order
    ));
    
    // Simuler l'envoi de notification au client
    alert(`🎉 Commande ${orderId} terminée et soumise !\nLe client a reçu une notification pour validation.`);
  };

  // Fonction pour soumettre une réclamation
  const submitComplaint = (orderId) => {
    const complaintReason = prompt('Veuillez décrire la raison de votre réclamation :');
    if (complaintReason) {
      alert(`🚨 Réclamation pour la commande ${orderId} envoyée au superviseur et au support.\n\nRaison: ${complaintReason}`);
    }
  };

  // Fonction pour formater le statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { label: 'En cours', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-900 text-yellow-200' },
      'soumis': { label: 'En validation', color: 'bg-purple-100 text-purple-800', darkColor: 'bg-purple-900 text-purple-200' },
      'validée': { label: 'Validée', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-900 text-green-200' },
      'annulée': { label: 'Annulée', color: 'bg-red-100 text-red-800', darkColor: 'bg-red-900 text-red-200' },
    };
    const config = statusConfig[status] || statusConfig['en_cours'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isDarkMode ? config.darkColor : config.color
      }`}>
        {config.label}
      </span>
    );
  };

  // Fonction pour formater le statut de permission
  const getPermissionBadge = (permission) => {
    const permissionConfig = {
      'pending': { label: 'Permission en attente', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-900 text-yellow-200', icon: <Shield size={14} /> },
      'granted': { label: 'Photos autorisées', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-900 text-green-200', icon: <ShieldCheck size={14} /> },
      'denied': { label: 'Photos refusées', color: 'bg-red-100 text-red-800', darkColor: 'bg-red-900 text-red-200', icon: <ShieldOff size={14} /> },
    };
    const config = permissionConfig[permission] || permissionConfig['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        isDarkMode ? config.darkColor : config.color
      }`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Composant pour afficher le formulaire de photos en tableau (seulement si permission accordée)
  const PhotoUploadForm = ({ orderId, beforePhotos, afterPhotos, permission }) => {
    if (permission !== 'granted') {
      return (
        <div className="mt-6">
          <h4 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
            <Camera size={20} /> Documentation de l'intervention
          </h4>
          <div className={`p-6 rounded-lg border ${borderClass} text-center ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <ShieldOff size={48} className="mx-auto text-gray-400 mb-4" />
            <h5 className={`font-medium ${textClass} mb-2`}>
              {permission === 'pending' 
                ? 'En attente de permission du client' 
                : 'Photos non autorisées par le client'}
            </h5>
            <p className={textSecondaryClass}>
              {permission === 'pending' 
                ? 'Le client n\'a pas encore répondu à votre demande de permission pour les photos.'
                : 'Le client a refusé la prise de photos. Vous pouvez terminer la commande sans photos.'}
            </p>
            {permission === 'pending' && (
              <p className={`text-sm ${textSecondaryClass} mt-2`}>
                Demande envoyée le: {orders.find(o => o.id === orderId)?.permissionRequestedAt}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`text-lg font-semibold ${textClass} flex items-center gap-2`}>
            <Camera size={20} /> Documentation de l'intervention
          </h4>
          <div className="flex items-center gap-2">
            {getPermissionBadge('granted')}
            <span className={`text-sm ${textSecondaryClass}`}>
              Autorisé le: {orders.find(o => o.id === orderId)?.permissionResponseAt}
            </span>
          </div>
        </div>
        
        <div className={`rounded-lg border ${borderClass} overflow-hidden`}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Colonne Photos Avant */}
            <div className={`p-4 border-r ${borderClass}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-medium ${textClass} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Photos Avant l'intervention
                </h5>
                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                  {beforePhotos.length} photo{beforePhotos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {beforePhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {beforePhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo avant ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => removePhoto(orderId, 'before', index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 rounded border-2 border-dashed ${borderClass} mb-4`}>
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className={textSecondaryClass}>Aucune photo avant</p>
                </div>
              )}
              
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(orderId, 'before', e.target.files)}
                  className="hidden"
                  id={`before-upload-${orderId}`}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${borderClass} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${uploadingPhotos.before ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={16} />
                  {uploadingPhotos.before ? 'Téléchargement...' : 'Ajouter des photos'}
                </div>
              </label>
              <p className={`text-xs ${textSecondaryClass} mt-2`}>Maximum 10 photos, 5MB chacune</p>
            </div>

            {/* Colonne Photos Après */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-medium ${textClass} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Photos Après l'intervention
                </h5>
                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                  {afterPhotos.length} photo{afterPhotos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {afterPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {afterPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo après ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => removePhoto(orderId, 'after', index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 rounded border-2 border-dashed ${borderClass} mb-4`}>
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className={textSecondaryClass}>Aucune photo après</p>
                </div>
              )}
              
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(orderId, 'after', e.target.files)}
                  className="hidden"
                  id={`after-upload-${orderId}`}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${borderClass} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${uploadingPhotos.after ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={16} />
                  {uploadingPhotos.after ? 'Téléchargement...' : 'Ajouter des photos'}
                </div>
              </label>
              <p className={`text-xs ${textSecondaryClass} mt-2`}>Maximum 10 photos, 5MB chacune</p>
            </div>
          </div>
          
          {/* Résumé du tableau */}
          <div className={`px-4 py-3 border-t ${borderClass} ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className={`text-sm ${textSecondaryClass}`}>
                    Avant: {beforePhotos.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className={`text-sm ${textSecondaryClass}`}>
                    Après: {afterPhotos.length}
                  </span>
                </div>
              </div>
              <div className={`text-sm ${textSecondaryClass}`}>
                Total: {beforePhotos.length + afterPhotos.length} photos
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal pour demander la permission
  const PermissionModal = () => {
    if (!showPermissionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-xl shadow-lg p-6 w-full max-w-md ${cardBgClass}`}>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-blue-600" />
            <h3 className={`text-xl font-bold ${textClass}`}>
              Demande de permission
            </h3>
          </div>
          
          <p className={`mb-4 ${textSecondaryClass}`}>
            Demander l'autorisation au client pour prendre des photos avant et après l'intervention.
          </p>
          
          <div className="mb-4">
            <label className={`block mb-2 text-sm font-medium ${textClass}`}>
              Raison de la demande (optionnel) :
            </label>
            <textarea
              id="permission-reason"
              rows="3"
              className={`w-full p-3 rounded-lg border ${borderClass} ${inputBgClass}`}
              placeholder="Ex: Pour documenter la qualité du travail, pour notre assurance qualité..."
              defaultValue="Documentation de qualité pour notre assurance qualité"
            />
          </div>
          
          <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              📝 Le client recevra une notification et pourra accepter ou refuser la prise de photos.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedOrderForPermission(null);
              }}
              className={`flex-1 px-4 py-3 border ${borderClass} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
            >
              Annuler
            </button>
            <button
              onClick={sendPermissionRequest}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Envoyer la demande
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filtres disponibles
  const filters = [
    { id: 'en_cours', label: 'En cours', count: orders.filter(o => o.status === 'en_cours').length },
    { id: 'soumis', label: 'En validation', count: orders.filter(o => o.status === 'soumis').length },
    { id: 'validée', label: 'Validée', count: orders.filter(o => o.status === 'validée').length },
    { id: 'annulée', label: 'Annulée', count: orders.filter(o => o.status === 'annulée').length },
  ];

  // Filtrer les commandes
  const filteredOrders = activeFilter === 'toutes' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  return (
    <div className={`min-h-screen ${bgClass} py-8 transition-colors duration-300`}>
      <PermissionModal />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Commandes Acceptées</h1>
              <p className={`${textSecondaryClass} mt-2`}>Gérez vos interventions en cours</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${borderClass} border`}>
                <div className="mr-3">
                  <div className={`text-sm ${textSecondaryClass}`}>Commandes actives</div>
                  <div className={`text-xl font-bold ${textClass}`}>{orders.filter(o => o.status === 'en_cours').length}</div>
                </div>
                <div className={`w-px h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="ml-3">
                  <div className={`text-sm ${textSecondaryClass}`}>Permissions</div>
                  <div className={`text-xl font-bold ${textClass}`}>
                    {orders.filter(o => o.photoPermission === 'granted').length}/{orders.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className={`${cardBgClass} rounded-lg shadow mb-6 ${borderClass} border`}>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : `${textSecondaryClass} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
                >
                  {filter.label}
                  <span className={`px-2 py-1 text-xs rounded-full ${
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
                {activeFilter === 'toutes' 
                  ? "Vous n'avez pas encore de commandes acceptées."
                  : `Vous n'avez pas de commandes avec le statut "${filters.find(f => f.id === activeFilter)?.label}".`
                }
              </p>
              <Link 
                to="/freelancer/commandes" 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir les nouvelles commandes
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className={`${cardBgClass} rounded-lg shadow overflow-hidden ${borderClass} border`}>
                {/* En-tête de la commande */}
                <div className={`p-6 ${hoverBgClass} transition-colors cursor-pointer`} onClick={() => toggleOrderDetails(order.id)}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
                            <div className="flex items-center gap-1">
                              <span className={`text-sm ${textSecondaryClass}`}>
                                ⭐ {order.rating} ({order.completedOrders} commandes)
                              </span>
                            </div>
                            {getPermissionBadge(order.photoPermission)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className={`text-2xl font-bold ${textClass}`}>{order.amount.toFixed(2)} MAD</div>
                      <div className="flex items-center justify-end gap-3 mt-1">
                        {getStatusBadge(order.status)}
                        <svg 
                          className={`w-5 h-5 transform transition-transform ${
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
                    <div className="space-y-6">
                      {/* Informations principales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg border ${borderClass}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar size={18} className={textSecondaryClass} />
                            <span className={`font-medium ${textClass}`}>Date</span>
                          </div>
                          <p className={textClass}>{order.date}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${borderClass}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Clock size={18} className={textSecondaryClass} />
                            <span className={`font-medium ${textClass}`}>Heure</span>
                          </div>
                          <p className={textClass}>{order.time}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${borderClass}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin size={18} className={textSecondaryClass} />
                            <span className={`font-medium ${textClass}`}>Adresse</span>
                          </div>
                          <p className={textClass}>{order.address}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${borderClass}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-medium ${textClass}`}>Montant</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{order.amount.toFixed(2)} MAD</p>
                        </div>
                      </div>

                      {/* Coordonnées du client */}
                      <div className={`p-4 rounded-lg border ${borderClass}`}>
                        <h4 className={`font-medium ${textClass} mb-3`}>📞 Coordonnées du client</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Phone size={16} className={textSecondaryClass} />
                            <div>
                              <p className={`text-sm ${textSecondaryClass}`}>Téléphone</p>
                              <a href={`tel:${order.clientPhone}`} className="text-blue-600 hover:text-blue-800">
                                {order.clientPhone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Mail size={16} className={textSecondaryClass} />
                            <div>
                              <p className={`text-sm ${textSecondaryClass}`}>Email</p>
                              <a href={`mailto:${order.clientEmail}`} className="text-blue-600 hover:text-blue-800">
                                {order.clientEmail}
                              </a>
                            </div>
                          </div>
                          
                          <div>
                            <p className={`text-sm ${textSecondaryClass}`}>Client depuis</p>
                            <p className={textClass}>{order.completedOrders} commandes</p>
                          </div>
                        </div>
                      </div>

                      {/* Instructions spéciales */}
                      {order.specialInstructions && (
                        <div className={`p-4 rounded-lg border ${borderClass}`}>
                          <h4 className={`font-medium ${textClass} mb-3`}>📝 Instructions spéciales</h4>
                          <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={textClass}>{order.specialInstructions}</p>
                          </div>
                        </div>
                      )}

                      {/* Section Permission de Photos */}
                      <div className={`p-4 rounded-lg border ${borderClass}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-medium ${textClass} flex items-center gap-2`}>
                            <Shield size={20} /> Permission pour les photos
                          </h4>
                          {order.photoPermission === 'pending' && order.permissionRequestedAt && (
                            <span className={`text-sm ${textSecondaryClass}`}>
                              Demande envoyée le: {order.permissionRequestedAt}
                            </span>
                          )}
                          {order.photoPermission !== 'pending' && order.permissionResponseAt && (
                            <span className={`text-sm ${textSecondaryClass}`}>
                              Réponse le: {order.permissionResponseAt}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={textClass}>Statut de permission :</p>
                              <p className={`text-sm ${textSecondaryClass}`}>
                                {order.photoPermission === 'pending' 
                                  ? 'En attente de réponse du client'
                                  : order.photoPermission === 'granted'
                                  ? 'Le client a autorisé la prise de photos'
                                  : 'Le client a refusé la prise de photos'}
                              </p>
                            </div>
                            <div>
                              {getPermissionBadge(order.photoPermission)}
                            </div>
                          </div>
                          
                          {order.photoPermission === 'pending' && (
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                              <div className="flex items-center gap-3">
                                <AlertCircle size={20} className="text-yellow-600" />
                                <div>
                                  <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                                    En attente de réponse du client
                                  </p>
                                  <p className={`text-xs ${textSecondaryClass} mt-1`}>
                                    Vous pouvez toujours terminer la commande sans photos
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-3">
                            {order.photoPermission === 'pending' && !order.permissionRequestedAt && (
                              <button
                                onClick={() => requestPhotoPermission(order.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <MessageCircle size={16} />
                                Demander la permission
                              </button>
                            )}
                            
                            {order.photoPermission === 'pending' && order.permissionRequestedAt && (
                              <button
                                onClick={() => alert('La demande a déjà été envoyée. En attente de réponse du client.')}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg"
                              >
                                <MessageCircle size={16} />
                                Demande déjà envoyée
                              </button>
                            )}
                            
                            {/* Boutons de simulation pour le développement (à enlever en production) */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => simulateClientResponse(order.id, 'granted')}
                                className="flex items-center gap-2 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                (Simuler Acceptation)
                              </button>
                              <button
                                onClick={() => simulateClientResponse(order.id, 'denied')}
                                className="flex items-center gap-2 px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                (Simuler Refus)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Formulaire de photos (seulement si permission accordée) */}
                      {order.status === 'en_cours' && !order.submitted && (
                        <>
                          <PhotoUploadForm 
                            orderId={order.id}
                            beforePhotos={order.beforePhotos}
                            afterPhotos={order.afterPhotos}
                            permission={order.photoPermission}
                          />

                          {/* Bouton de soumission */}
                          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-700">
                            <div className="text-sm">
                              <p className={textSecondaryClass}>
                                {order.photoPermission === 'granted' && (order.beforePhotos.length > 0 || order.afterPhotos.length > 0) ? (
                                  <span className="flex items-center gap-2 text-green-600">
                                    <Check size={16} />
                                    {order.beforePhotos.length + order.afterPhotos.length} photo(s) ajoutée(s)
                                  </span>
                                ) : order.photoPermission === 'denied' ? (
                                  <span className="flex items-center gap-2 text-gray-600">
                                    <ShieldOff size={16} />
                                    Photos non autorisées par le client
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2 text-yellow-600">
                                    <AlertCircle size={16} />
                                    {order.photoPermission === 'pending' 
                                      ? 'En attente de permission pour les photos'
                                      : 'Ajoutez des photos pour terminer la commande'}
                                  </span>
                                )}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => alert(`Contacter ${order.clientName}`)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${borderClass} ${
                                  isDarkMode 
                                    ? 'text-gray-300 hover:bg-gray-700' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <Phone size={16} />
                                Contacter
                              </button>
                              
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <X size={16} />
                                Annuler
                              </button>
                              
                              <button
                                onClick={() => submitCompletedOrder(order.id)}
                                disabled={order.photoPermission === 'granted' && order.afterPhotos.length === 0}
                                className={`flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium transition-colors ${
                                  order.photoPermission === 'granted' && order.afterPhotos.length === 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-green-700'
                                }`}
                              >
                                <Check size={16} />
                                Terminer la commande
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Message pour les commandes soumises */}
                      {order.status === 'soumis' && (
                        <div className={`p-4 rounded-lg border border-purple-300 dark:border-purple-700 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <Check size={24} className="text-purple-600" />
                            </div>
                            <div>
                              <h4 className={`text-lg font-medium ${textClass} mb-2`}>
                                Commande en attente de validation
                              </h4>
                              <div className={`space-y-2 ${textSecondaryClass}`}>
                                <p>
                                  ✅ La commande a été soumise avec succès.
                                </p>
                                <p>
                                  ⏳ Le client doit maintenant valider l'intervention.
                                </p>
                                <p>
                                  💰 Une fois validée, le superviseur procédera au paiement.
                                </p>
                                {order.photoPermission === 'granted' && (
                                  <p>
                                    📸 Photos : {order.beforePhotos.length + order.afterPhotos.length} photo(s) ajoutée(s)
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                  onClick={() => submitComplaint(order.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                                >
                                  <AlertCircle size={16} />
                                  Signaler un problème
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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