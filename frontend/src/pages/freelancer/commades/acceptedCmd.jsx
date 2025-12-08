import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Camera, Upload, X, Check, MapPin, Phone, Mail, Calendar, Clock, AlertCircle, Shield, ShieldCheck, ShieldOff, MessageCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const CommandesAcceptees = () => {
  const { isDarkMode } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState('en_cours');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [uploadingPhotos, setUploadingPhotos] = useState({ before: false, after: false });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedOrderForPermission, setSelectedOrderForPermission] = useState(null);

  // Système de thème complet
  const theme = {
    // Arrière-plans
    bgPrimary: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgSecondary: isDarkMode ? 'bg-gray-800' : 'bg-white',
    bgTertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    bgQuaternary: isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/80',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    
    // Textes
    textPrimary: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textLight: isDarkMode ? 'text-gray-500' : 'text-gray-500',
    
    // Bordures
    borderPrimary: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    borderSecondary: isDarkMode ? 'border-gray-600' : 'border-gray-200',
    borderLight: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderDashed: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    
    // Survols
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    hoverBorder: isDarkMode ? 'hover:border-gray-600' : 'hover:border-gray-400',
    
    // Boutons
    buttonPrimary: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    buttonSuccess: isDarkMode 
      ? 'bg-green-600 hover:bg-green-700 text-white' 
      : 'bg-green-600 hover:bg-green-700 text-white',
    buttonDanger: isDarkMode 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : 'bg-red-600 hover:bg-red-700 text-white',
    buttonWarning: isDarkMode 
      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
      : 'bg-yellow-600 hover:bg-yellow-700 text-white',
    
    // Inputs
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    inputText: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    inputPlaceholder: isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-500',
    
    // Badges et indicateurs
    badgeOnline: isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
    badgeOffline: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800',
    badgePending: isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    badgeSubmitted: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800',
    badgeCancelled: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
    
    // Cartes et conteneurs
    cardShadow: isDarkMode ? 'shadow-lg' : 'shadow-md',
    cardHover: isDarkMode ? 'hover:shadow-xl hover:border-gray-600' : 'hover:shadow-lg hover:border-gray-400',
    
    // Icônes
    iconPrimary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    iconSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    iconMuted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
    
    // États et alertes
    alertInfo: isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-300',
    alertWarning: isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' : 'bg-yellow-50 text-yellow-800 border-yellow-300',
    alertSuccess: isDarkMode ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-green-50 text-green-800 border-green-300',
    alertError: isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-800 border-red-300',
    
    // Tableaux et grilles
    tableHeader: isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700',
    tableRow: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    tableBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
  };

  // Données simulées - UNE SEULE COMMANDE
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
      photoPermission: 'pending',
      permissionRequestedAt: null,
      permissionResponseAt: null,
      permissionReason: '',
      submitted: false,
      clientValidation: false,
      rating: 4.8,
      completedOrders: 15
    }
  ]);

  // Fonction pour développer/réduire les détails d'une commande
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Fonction pour annuler une commande - AVEC SweetAlert2
  const cancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Annuler la commande',
      text: 'Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, garder',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    });

    if (result.isConfirmed) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'annulée' } : order
      ));
      
      await Swal.fire({
        title: 'Commande annulée',
        text: `La commande ${orderId} a été annulée avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Fonction pour demander la permission de photos
  const requestPhotoPermission = (orderId) => {
    setSelectedOrderForPermission(orderId);
    setShowPermissionModal(true);
  };

  // Fonction pour envoyer la demande de permission - AVEC SweetAlert2
  const sendPermissionRequest = async () => {
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
    
    setShowPermissionModal(false);
    setSelectedOrderForPermission(null);
    
    await Swal.fire({
      title: 'Demande envoyée !',
      html: `📩 Demande de permission envoyée au client ${selectedOrderForPermission} !<br>Le client recevra une notification pour autoriser les photos.`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    });
  };

  // Fonction pour simuler la réponse du client - AVEC SweetAlert2
  const simulateClientResponse = async (orderId, response) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        photoPermission: response,
        permissionResponseAt: new Date().toLocaleString()
      } : order
    ));
    
    if (response === 'granted') {
      await Swal.fire({
        title: 'Permission accordée !',
        text: `Le client a accepté la prise de photos pour la commande ${orderId}`,
        icon: 'success',
        iconColor: '#10B981',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } else {
      await Swal.fire({
        title: 'Permission refusée',
        text: `Le client a refusé la prise de photos pour la commande ${orderId}`,
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6b7280',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Fonction pour gérer l'upload de photos
  const handlePhotoUpload = (orderId, type, files) => {
    const order = orders.find(o => o.id === orderId);
    if (order.photoPermission !== 'granted') {
      Swal.fire({
        title: 'Permission requise',
        text: 'Vous devez avoir la permission du client pour ajouter des photos',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
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

  // Fonction pour soumettre une commande terminée - AVEC SweetAlert2
  const submitCompletedOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    
    if (order.photoPermission === 'granted' && order.afterPhotos.length === 0) {
      const result = await Swal.fire({
        title: 'Aucune photo "après"',
        text: "Le client a autorisé les photos mais vous n'avez pas ajouté de photos 'après'. Voulez-vous quand même soumettre la commande ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, soumettre',
        cancelButtonText: 'Non, annuler',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#ef4444',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });

      if (!result.isConfirmed) {
        return;
      }
    }
    
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'soumis', submitted: true } : order
    ));
    
    await Swal.fire({
      title: 'Commande terminée !',
      html: `🎉 Commande ${orderId} terminée et soumise !<br>Le client a reçu une notification pour validation.`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#10B981',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    });
  };

  // Fonction pour soumettre une réclamation - AVEC SweetAlert2
  const submitComplaint = async (orderId) => {
    const { value: complaintReason } = await Swal.fire({
      title: 'Soumettre une réclamation',
      input: 'textarea',
      inputLabel: 'Veuillez décrire la raison de votre réclamation :',
      inputPlaceholder: 'Décrivez le problème rencontré...',
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      inputAttributes: {
        'aria-label': 'Décrivez la raison de votre réclamation'
      },
      validationMessage: 'Veuillez fournir une description'
    });

    if (complaintReason) {
      await Swal.fire({
        title: 'Réclamation envoyée !',
        html: `🚨 Réclamation pour la commande ${orderId} envoyée au superviseur et au support.<br><br><strong>Raison:</strong> ${complaintReason}`,
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Fonction pour formater le statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { label: 'En cours', class: theme.badgePending },
      'soumis': { label: 'En validation', class: theme.badgeSubmitted },
      'validée': { label: 'Validée', class: theme.badgeOnline },
      'annulée': { label: 'Annulée', class: theme.badgeCancelled },
    };
    const config = statusConfig[status] || statusConfig['en_cours'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  // Fonction pour formater le statut de permission
  const getPermissionBadge = (permission) => {
    const permissionConfig = {
      'pending': { 
        label: 'Permission en attente', 
        class: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
        icon: <Shield size={14} className="text-yellow-600 dark:text-yellow-400" />
      },
      'granted': { 
        label: 'Photos autorisées', 
        class: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
        icon: <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
      },
      'denied': { 
        label: 'Photos refusées', 
        class: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
        icon: <ShieldOff size={14} className="text-red-600 dark:text-red-400" />
      },
    };
    const config = permissionConfig[permission] || permissionConfig['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Composant pour afficher le formulaire de photos
  const PhotoUploadForm = ({ orderId, beforePhotos, afterPhotos, permission }) => {
    if (permission !== 'granted') {
      return (
        <div className="mt-6">
          <h4 className={`text-lg font-semibold ${theme.textPrimary} mb-4 flex items-center gap-2`}>
            <Camera size={20} className={theme.iconPrimary} /> Documentation de l'intervention
          </h4>
          <div className={`p-6 rounded-lg border ${theme.borderPrimary} text-center ${theme.bgTertiary}`}>
            <ShieldOff size={48} className={`mx-auto mb-4 ${theme.iconMuted}`} />
            <h5 className={`font-medium ${theme.textPrimary} mb-2`}>
              {permission === 'pending' 
                ? 'En attente de permission du client' 
                : 'Photos non autorisées par le client'}
            </h5>
            <p className={theme.textMuted}>
              {permission === 'pending' 
                ? 'Le client n\'a pas encore répondu à votre demande de permission pour les photos.'
                : 'Le client a refusé la prise de photos. Vous pouvez terminer la commande sans photos.'}
            </p>
            {permission === 'pending' && (
              <p className={`text-sm ${theme.textMuted} mt-2`}>
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
          <h4 className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}>
            <Camera size={20} className={theme.iconPrimary} /> Documentation de l'intervention
          </h4>
          <div className="flex items-center gap-2">
            {getPermissionBadge('granted')}
            <span className={`text-sm ${theme.textMuted}`}>
              Autorisé le: {orders.find(o => o.id === orderId)?.permissionResponseAt}
            </span>
          </div>
        </div>
        
        <div className={`rounded-lg border ${theme.borderPrimary} overflow-hidden ${theme.cardShadow}`}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Colonne Photos Avant */}
            <div className={`p-4 border-r ${theme.borderPrimary}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-medium ${theme.textPrimary} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Photos Avant l'intervention
                </h5>
                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
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
                <div className={`text-center py-8 rounded border-2 border-dashed ${theme.borderDashed} mb-4`}>
                  <Camera size={32} className={`mx-auto mb-2 ${theme.iconMuted}`} />
                  <p className={theme.textMuted}>Aucune photo avant</p>
                </div>
              )}
              
              <label className={`block mb-2 text-sm font-medium ${theme.textPrimary}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(orderId, 'before', e.target.files)}
                  className="hidden"
                  id={`before-upload-${orderId}`}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${theme.borderPrimary} cursor-pointer ${theme.hoverBg} transition-colors ${uploadingPhotos.before ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={16} className={theme.iconSecondary} />
                  {uploadingPhotos.before ? 'Téléchargement...' : 'Ajouter des photos'}
                </div>
              </label>
              <p className={`text-xs ${theme.textMuted} mt-2`}>Maximum 10 photos, 5MB chacune</p>
            </div>

            {/* Colonne Photos Après */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-medium ${theme.textPrimary} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Photos Après l'intervention
                </h5>
                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
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
                <div className={`text-center py-8 rounded border-2 border-dashed ${theme.borderDashed} mb-4`}>
                  <Camera size={32} className={`mx-auto mb-2 ${theme.iconMuted}`} />
                  <p className={theme.textMuted}>Aucune photo après</p>
                </div>
              )}
              
              <label className={`block mb-2 text-sm font-medium ${theme.textPrimary}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(orderId, 'after', e.target.files)}
                  className="hidden"
                  id={`after-upload-${orderId}`}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${theme.borderPrimary} cursor-pointer ${theme.hoverBg} transition-colors ${uploadingPhotos.after ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={16} className={theme.iconSecondary} />
                  {uploadingPhotos.after ? 'Téléchargement...' : 'Ajouter des photos'}
                </div>
              </label>
              <p className={`text-xs ${theme.textMuted} mt-2`}>Maximum 10 photos, 5MB chacune</p>
            </div>
          </div>
          
          {/* Résumé du tableau */}
          <div className={`px-4 py-3 border-t ${theme.borderPrimary} ${theme.bgTertiary}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className={`text-sm ${theme.textMuted}`}>
                    Avant: {beforePhotos.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className={`text-sm ${theme.textMuted}`}>
                    Après: {afterPhotos.length}
                  </span>
                </div>
              </div>
              <div className={`text-sm ${theme.textMuted}`}>
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
        <div className={`rounded-xl shadow-2xl p-6 w-full max-w-md ${theme.bgSecondary} border ${theme.borderPrimary}`}>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-blue-600" />
            <h3 className={`text-xl font-bold ${theme.textPrimary}`}>
              Demande de permission
            </h3>
          </div>
          
          <p className={`mb-4 ${theme.textMuted}`}>
            Demander l'autorisation au client pour prendre des photos avant et après l'intervention.
          </p>
          
          <div className="mb-4">
            <label className={`block mb-2 text-sm font-medium ${theme.textPrimary}`}>
              Raison de la demande (optionnel) :
            </label>
            <textarea
              id="permission-reason"
              rows="3"
              className={`w-full p-3 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
              placeholder="Ex: Pour documenter la qualité du travail, pour notre assurance qualité..."
              defaultValue="Documentation de qualité pour notre assurance qualité"
            />
          </div>
          
          <div className={`p-3 rounded-lg mb-4 ${theme.alertInfo}`}>
            <p className="text-sm">
              📝 Le client recevra une notification et pourra accepter ou refuser la prise de photos.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedOrderForPermission(null);
              }}
              className={`flex-1 px-4 py-3 border ${theme.borderPrimary} rounded-lg ${theme.hoverBg} transition`}
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

  // Filtres disponibles - ajustés pour une seule commande
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
    <div className={`min-h-screen ${theme.bgPrimary} py-8 transition-colors duration-300`}>
      <PermissionModal />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Commandes Acceptées</h1>
              <p className={`${theme.textMuted} mt-2`}>Gérez vos interventions en cours</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${theme.bgSecondary} border ${theme.borderPrimary} ${theme.cardShadow}`}>
                <div className="mr-3">
                  <div className={`text-sm ${theme.textMuted}`}>Commande active</div>
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>{orders.filter(o => o.status === 'en_cours').length}</div>
                </div>
                <div className={`w-px h-10 ${theme.borderPrimary}`}></div>
                <div className="ml-3">
                  <div className={`text-sm ${theme.textMuted}`}>Permission</div>
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>
                    {orders.filter(o => o.photoPermission === 'granted').length}/{orders.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className={`${theme.bgSecondary} rounded-lg ${theme.cardShadow} mb-6 border ${theme.borderPrimary}`}>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : `${theme.textSecondary} ${theme.hoverBg}`
                  }`}
                >
                  {filter.label}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeFilter === filter.id
                      ? 'bg-blue-500 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
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
            <div className={`${theme.bgSecondary} rounded-lg ${theme.cardShadow} p-8 text-center border ${theme.borderPrimary}`}>
              <div className="text-4xl mb-4">📭</div>
              <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>Aucune commande trouvée</h3>
              <p className={theme.textMuted}>
                {activeFilter === 'toutes' 
                  ? "Vous n'avez pas encore de commandes acceptées."
                  : `Vous n'avez pas de commandes avec le statut "${filters.find(f => f.id === activeFilter)?.label}".`
                }
              </p>
              <Link 
                to="../" 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir les nouvelles commandes
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className={`${theme.bgSecondary} rounded-lg ${theme.cardShadow} overflow-hidden border ${theme.borderPrimary} ${theme.cardHover} transition-all`}>
                {/* En-tête de la commande */}
                <div className={`p-6 ${theme.hoverBg} transition-colors cursor-pointer`} onClick={() => toggleOrderDetails(order.id)}>
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
                          <h3 className={`font-medium ${theme.textPrimary}`}>
                            {order.clientName} • {order.service}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center gap-1">
                              <span className={`text-sm ${theme.textMuted}`}>
                                ⭐ {order.rating} ({order.completedOrders} commandes)
                              </span>
                            </div>
                            {getPermissionBadge(order.photoPermission)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className={`text-2xl font-bold ${theme.textPrimary}`}>{order.amount.toFixed(2)} MAD</div>
                      <div className="flex items-center justify-end gap-3 mt-1">
                        {getStatusBadge(order.status)}
                        <svg 
                          className={`w-5 h-5 transform transition-transform ${
                            expandedOrder === order.id ? 'rotate-180' : ''
                          } ${theme.iconSecondary}`}
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
                  <div className={`border-t ${theme.borderPrimary} p-6`}>
                    <div className="space-y-6">
                      {/* Informations principales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar size={18} className={theme.iconSecondary} />
                            <span className={`font-medium ${theme.textPrimary}`}>Date</span>
                          </div>
                          <p className={theme.textPrimary}>{order.date}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Clock size={18} className={theme.iconSecondary} />
                            <span className={`font-medium ${theme.textPrimary}`}>Heure</span>
                          </div>
                          <p className={theme.textPrimary}>{order.time}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin size={18} className={theme.iconSecondary} />
                            <span className={`font-medium ${theme.textPrimary}`}>Adresse</span>
                          </div>
                          <p className={theme.textPrimary}>{order.address}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-medium ${theme.textPrimary}`}>Montant</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{order.amount.toFixed(2)} MAD</p>
                        </div>
                      </div>

                      {/* Coordonnées du client */}
                      <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                        <h4 className={`font-medium ${theme.textPrimary} mb-3`}>📞 Coordonnées du client</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Phone size={16} className={theme.iconSecondary} />
                            <div>
                              <p className={`text-sm ${theme.textMuted}`}>Téléphone</p>
                              <a href={`tel:${order.clientPhone}`} className="text-blue-600 hover:text-blue-800">
                                {order.clientPhone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Mail size={16} className={theme.iconSecondary} />
                            <div>
                              <p className={`text-sm ${theme.textMuted}`}>Email</p>
                              <a href={`mailto:${order.clientEmail}`} className="text-blue-600 hover:text-blue-800">
                                {order.clientEmail}
                              </a>
                            </div>
                          </div>
                          
                          <div>
                            <p className={`text-sm ${theme.textMuted}`}>Client depuis</p>
                            <p className={theme.textPrimary}>{order.completedOrders} commandes</p>
                          </div>
                        </div>
                      </div>

                      {/* Instructions spéciales */}
                      {order.specialInstructions && (
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                          <h4 className={`font-medium ${theme.textPrimary} mb-3`}>📝 Instructions spéciales</h4>
                          <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={theme.textPrimary}>{order.specialInstructions}</p>
                          </div>
                        </div>
                      )}

                      {/* Section Permission de Photos */}
                      <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.bgTertiary}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-medium ${theme.textPrimary} flex items-center gap-2`}>
                            <Shield size={20} className={theme.iconPrimary} /> Permission pour les photos
                          </h4>
                          {order.photoPermission === 'pending' && order.permissionRequestedAt && (
                            <span className={`text-sm ${theme.textMuted}`}>
                              Demande envoyée le: {order.permissionRequestedAt}
                            </span>
                          )}
                          {order.photoPermission !== 'pending' && order.permissionResponseAt && (
                            <span className={`text-sm ${theme.textMuted}`}>
                              Réponse le: {order.permissionResponseAt}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={theme.textPrimary}>Statut de permission :</p>
                              <p className={`text-sm ${theme.textMuted}`}>
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
                            <div className={`p-3 rounded-lg ${theme.alertWarning}`}>
                              <div className="flex items-center gap-3">
                                <AlertCircle size={20} className="text-yellow-600" />
                                <div>
                                  <p className="text-sm">
                                    En attente de réponse du client
                                  </p>
                                  <p className={`text-xs ${theme.textMuted} mt-1`}>
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
                                onClick={() => Swal.fire({
                                  title: 'Demande déjà envoyée',
                                  text: 'En attente de réponse du client.',
                                  icon: 'info',
                                  confirmButtonText: 'OK',
                                  confirmButtonColor: '#3b82f6',
                                  background: isDarkMode ? '#1f2937' : '#ffffff',
                                  color: isDarkMode ? '#ffffff' : '#000000',
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg"
                              >
                                <MessageCircle size={16} />
                                Demande déjà envoyée
                              </button>
                            )}
                            
                            {/* Boutons de simulation */}
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

                      {/* Formulaire de photos */}
                      {order.status === 'en_cours' && !order.submitted && (
                        <>
                          <PhotoUploadForm 
                            orderId={order.id}
                            beforePhotos={order.beforePhotos}
                            afterPhotos={order.afterPhotos}
                            permission={order.photoPermission}
                          />

                          {/* Bouton de soumission */}
                          <div className={`flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t ${theme.borderPrimary}`}>
                            <div className="text-sm">
                              <p className={theme.textMuted}>
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
                                onClick={() => {
                                  Swal.fire({
                                    title: 'Contacter le client',
                                    html: `📞 <strong>${order.clientName}</strong><br>📱 ${order.clientPhone}<br>📧 ${order.clientEmail}`,
                                    icon: 'info',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#3b82f6',
                                    background: isDarkMode ? '#1f2937' : '#ffffff',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                  });
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.borderPrimary} ${
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
                        <div className={`p-4 rounded-lg border ${theme.borderPrimary} ${theme.alertSuccess}`}>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <Check size={24} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
                                Commande en attente de validation
                              </h4>
                              <div className={`space-y-2 ${theme.textMuted}`}>
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