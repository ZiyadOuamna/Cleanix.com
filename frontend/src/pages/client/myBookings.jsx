import React, { useState, useContext, useEffect } from 'react';
import {
  Package,
  Calendar,
  MapPin,
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  X,
  Filter,
  Image as ImageIcon,
  Truck,
  CheckCheck,
  ImagePlus,
  Send,
  Sparkles,
  Key,
  User,
  User2
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';
import { getOrderHistory } from '../../services/orderService';

const MyBookings = () => {
  const { isDarkMode, wallet } = useContext(ClientContext);
  const [activeFilter, setActiveFilter] = useState('in_progress');
  const [activeServiceFilter, setActiveServiceFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(null);
  const [validationRating, setValidationRating] = useState(0);
  const [validationComment, setValidationComment] = useState('');

  // Charger l'historique des commandes au montage du composant
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getOrderHistory();
        
        // Transformer les données de l'API au format du composant
        const formattedBookings = response.data.map((order) => ({
          id: order.id,
          service: order.service?.nom || order.service_type,
          serviceType: order.service_type,
          freelancer: order.freelancer ? `${order.freelancer.firstname} ${order.freelancer.lastname}` : 'À assigner',
          date: new Date(order.scheduled_date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: order.heure_execution ? new Date(order.heure_execution).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }) + ' - À déterminer' : 'Horaire à déterminer',
          location: `${order.adresse}, ${order.code_postal} ${order.ville}`,
          price: `${order.agreed_price || order.initial_price}DH`,
          status: order.status,
          rating: order.rating,
          image: getServiceIcon(order.service_type),
          freelancerAvatar: order.freelancer ? getAvatarEmoji(order.freelancer.gender) : '❓',
          photos_requested: order.status === 'completed',
          completed: order.status === 'completed',
          photos: order.photos_after ? JSON.parse(order.photos_after).map((photo, idx) => ({
            id: idx,
            type: 'after',
            url: photo,
            label: 'Après'
          })) : [],
          review: order.review,
          orderId: order.id
        }));
        
        setBookings(formattedBookings);
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Impossible de charger vos commandes');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger vos commandes. Veuillez réessayer.',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1f2937',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [isDarkMode]);

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
    inputBg: isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-slate-900'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending_approval':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      in_progress: 'En cours',
      pending_approval: 'En attente de validation',
      completed: 'Complétée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_progress':
        return <Truck size={18} />;
      case 'pending_approval':
        return <AlertCircle size={18} />;
      case 'completed':
        return <CheckCheck size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const getServiceIcon = (serviceType) => {
return serviceType === 'cles' ? <Key size={18} /> : <Sparkles size={18} />;
  };

  const getAvatarEmoji = (gender) => {
return gender === 'female' || gender === 'F' ? <User2 size={18}/> : <User size={18}/>;
  };

  const getServiceLabel = (serviceType) => {
    return serviceType === 'cles' ? 'Gestion de Clés' : 'Nettoyage';
  };

  // Helper pour les couleurs Swal selon le mode sombre/clair
  const getSwalTheme = () => {
    if (!isDarkMode) {
      return {
        confirmButtonColor: '#0891b2'
      };
    }
    return {
      background: '#1f2937',
      color: '#f3f4f6',
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#4b5563',
      inputBg: '#374151',
      didOpen: (modal) => {
        const popup = modal.querySelector('.swal2-popup');
        if (popup) {
          popup.style.backgroundColor = '#1f2937';
          popup.style.color = '#f3f4f6';
        }
        const input = modal.querySelector('.swal2-input');
        if (input) {
          input.style.backgroundColor = '#374151';
          input.style.color = '#f3f4f6';
          input.style.borderColor = '#4b5563';
        }
        const textarea = modal.querySelector('.swal2-textarea');
        if (textarea) {
          textarea.style.backgroundColor = '#374151';
          textarea.style.color = '#f3f4f6';
          textarea.style.borderColor = '#4b5563';
        }
      }
    };
  };

  // Fonction pour envoyer un message
  const handleSendMessage = (bookingId) => {
    if (!messageText.trim()) {
      Swal.fire({
        ...getSwalTheme(),
        icon: 'warning',
        title: 'Message vide',
        text: 'Veuillez écrire un message avant d\'envoyer'
      });
      return;
    }
    
    Swal.fire({
      ...getSwalTheme(),
      icon: 'success',
      title: 'Message envoyé',
      text: `Votre message a été envoyé au freelancer`
    });
    
    setMessageText('');
    setShowMessageModal(null);
  };

  // Fonction pour valider une commande
  const handleValidateBooking = (bookingId) => {
    setShowValidationModal(bookingId);
    setValidationRating(0);
    setValidationComment('');
  };

  // Fonction pour confirmer la validation avec note et avis
  const handleConfirmValidation = (bookingId) => {
    if (validationRating === 0) {
      Swal.fire({
        ...getSwalTheme(),
        icon: 'warning',
        title: 'Note requise',
        text: 'Veuillez donner une note au freelancer'
      });
      return;
    }

    // Mettre à jour le booking avec le statut complété
    setBookings(bookings.map(b => 
      b.id === bookingId ? {
        ...b,
        status: 'completed',
        rating: validationRating,
        review: validationComment
      } : b
    ));

    Swal.fire({
      ...getSwalTheme(),
      icon: 'success',
      title: 'Commande validée!',
      text: 'Merci pour votre avis. Le freelancer recevra le paiement dans les 24h'
    });

    setShowValidationModal(null);
    setShowDetails(null);
    setValidationRating(0);
    setValidationComment('');
  };

  // Fonction pour refuser une commande
  const handleRejectBooking = (bookingId) => {
    Swal.fire({
      ...getSwalTheme(),
      title: 'Refuser ce travail?',
      text: 'Pourquoi ne pouvez-vous pas accepter ce travail?',
      input: 'textarea',
      inputPlaceholder: 'Expliquez les raisons...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: isDarkMode ? '#4b5563' : '#d1d5db'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'in_progress', completed: false } : b
        ));
        Swal.fire({
          ...getSwalTheme(),
          icon: 'info',
          title: 'Travail renvoyé',
          text: 'Le freelancer a été notifié et pourra corriger'
        });
        setShowDetails(null);
      }
    });
  };

  const filteredBookings = bookings.filter(b => {
    const statusMatch = activeFilter === 'all' ? true : b.status === activeFilter;
    const serviceMatch = activeServiceFilter === 'all' ? true : b.serviceType === activeServiceFilter;
    return statusMatch && serviceMatch;
  });

  // Fonction pour exporter les réservations
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Service', 'Type', 'Freelancer', 'Date', 'Heure', 'Lieu', 'Prix', 'Statut', 'Note'],
      ...filteredBookings.map(b => [
        b.id,
        b.service,
        b.serviceType === 'nettoyage' ? 'Nettoyage' : 'Gestion de Clés',
        b.freelancer,
        b.date,
        b.time,
        b.location,
        b.price,
        getStatusLabel(b.status),
        b.rating ? `${b.rating}/5` : 'N/A'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      ...getSwalTheme(),
      icon: 'success',
      title: 'Export réussi',
      text: `${filteredBookings.length} réservations exportées en CSV`
    });
  };

  return (
    <div className={`space-y-6 ${theme.bg}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={theme.textSecondary}>Chargement de vos réservations...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme.textMain}`}>Mes Réservations</h1>
          <p className={`mt-2 ${theme.textSecondary}`}>Commandes en cours et en attente</p>
        </div>
        <button 
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download size={20} />
          Exporter
        </button>
      </div>

      {/* Filters */}
      <div className={`${theme.cardBg} rounded-xl p-4 shadow-sm border ${theme.border} space-y-3`}>
        {/* Filter par statut */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={20} className={theme.textMuted} />
          {[
            { id: 'in_progress', label: 'En cours' },
            { id: 'pending_approval', label: 'En attente' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                activeFilter === filter.id
                  ? 'bg-cyan-600 text-white'
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filter par type de service */}
        <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-300 dark:border-gray-600">
          <Package size={20} className={theme.textMuted} />
          {[
            { id: 'all', label: 'Tous les services', icon: '⭐' },
            { id: 'nettoyage', label: 'Nettoyage', icon: '✨' },
            { id: 'cles', label: 'Gestion de Clés', icon: '🔑' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveServiceFilter(filter.id)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
                activeServiceFilter === filter.id
                  ? 'bg-purple-600 text-white'
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className={`${theme.cardBg} rounded-xl p-12 text-center shadow-sm border ${theme.border}`}>
            <Package size={48} className={`${theme.textMuted} mx-auto mb-4`} />
            <p className={`${theme.textSecondary} text-lg`}>Aucune réservation trouvée</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className={`${theme.cardBg} rounded-xl overflow-hidden shadow-sm border ${theme.border} hover:shadow-md transition`}>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{booking.image}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`text-xl font-bold ${theme.textMain}`}>{booking.service}</h3>
                            <p className={`${theme.textSecondary} text-sm flex items-center gap-2 mt-1`}>
                              <span>{booking.freelancerAvatar}</span>
                              avec {booking.freelancer}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} whitespace-nowrap`}>
                            {getStatusIcon(booking.status)}
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Date</p>
                        <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                          <Calendar size={16} />
                          {booking.date}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Heure</p>
                        <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                          <Clock size={16} />
                          {booking.time}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Lieu</p>
                        <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                          <MapPin size={16} className="flex-shrink-0" />
                          <span className="truncate">{booking.location.split(',')[0]}</span>
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Montant</p>
                        <p className={`text-2xl font-bold text-cyan-600`}>{booking.price}</p>
                      </div>
                    </div>

                    {/* Photos Section - Only for pending approval or completed */}
                    {(booking.status === 'pending_approval' || booking.status === 'completed') && booking.photos_requested && (
                      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} border ${theme.border}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon size={16} className="text-cyan-600" />
                          <h4 className={`font-semibold ${theme.textMain}`}>Photos du travail</h4>
                        </div>
                        {booking.photos && booking.photos.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {booking.photos.map(photo => (
                              <div key={photo.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${theme.border} text-center`}>
                                <div className="text-3xl mb-2">{photo.url}</div>
                                <p className={`text-xs font-medium ${theme.textMuted}`}>{photo.label}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`${theme.textMuted} text-sm`}>Aucune photo fournie pour le moment</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-3 lg:min-w-[150px]">
                    <button
                      onClick={() => setShowDetails(booking.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium text-sm"
                    >
                      <Eye size={18} />
                      Détails
                    </button>

                    {booking.status === 'in_progress' && (
                      <button 
                        onClick={() => setShowMessageModal(booking.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                    )}

                    {booking.status === 'pending_approval' && (
                      <>
                        <button 
                          onClick={() => handleValidateBooking(booking.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
                        >
                          <CheckCircle size={18} />
                          Valider
                        </button>
                        <button 
                          onClick={() => handleRejectBooking(booking.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm"
                        >
                          <AlertCircle size={18} />
                          Refuser
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            {(() => {
              const booking = bookings.find(b => b.id === showDetails);
              return (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold ${theme.textMain}`}>{booking.service}</h2>
                      <p className={`${theme.textMuted} text-sm mt-1`}>Numéro de commande: #{booking.id}</p>
                    </div>
                    <button
                      onClick={() => setShowDetails(null)}
                      className={`p-2 rounded-lg ${theme.hoverBg} transition`}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Status and Freelancer Info */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} border ${theme.border}`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`${theme.textMuted} text-xs font-semibold uppercase mb-2`}>Freelancer</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{booking.freelancerAvatar}</span>
                            <div>
                              <p className={`${theme.textMain} font-semibold`}>{booking.freelancer}</p>
                              <p className={`${theme.textMuted} text-xs`}>Professional vérifié</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className={`${theme.textMuted} text-xs font-semibold uppercase mb-2`}>Statut</p>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} border ${theme.border}`}>
                      <h3 className={`font-semibold ${theme.textMain} mb-3`}>Détails du service</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`${theme.textMuted} text-xs font-semibold uppercase mb-1`}>Date et heure</p>
                          <p className={`${theme.textMain} font-semibold`}>{booking.date} à {booking.time}</p>
                        </div>
                        <div>
                          <p className={`${theme.textMuted} text-xs font-semibold uppercase mb-1`}>Prix</p>
                          <p className={`text-xl font-bold text-cyan-600`}>{booking.price}</p>
                        </div>
                        <div className="col-span-2">
                          <p className={`${theme.textMuted} text-xs font-semibold uppercase mb-1`}>Localisation</p>
                          <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                            <MapPin size={16} />
                            {booking.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Photos Section */}
                    {booking.photos_requested && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} border ${theme.border}`}>
                        <h3 className={`font-semibold ${theme.textMain} mb-3 flex items-center gap-2`}>
                          <ImageIcon size={18} />
                          Photos du travail
                        </h3>
                        {booking.photos && booking.photos.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {booking.photos.map(photo => (
                              <div key={photo.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${theme.border} text-center cursor-pointer hover:opacity-80 transition`}>
                                <div className="text-4xl mb-2">{photo.url}</div>
                                <p className={`text-sm font-medium ${theme.textMain}`}>{photo.label}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`${theme.textMuted} text-sm`}>Aucune photo fournie pour le moment</p>
                        )}
                      </div>
                    )}

                    {/* Timeline */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} border ${theme.border}`}>
                      <h3 className={`font-semibold ${theme.textMain} mb-3`}>Historique</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          <span className={theme.textSecondary}>Commande acceptée par {booking.freelancer}</span>
                        </div>
                        {booking.status === 'in_progress' && (
                          <div className="flex items-center gap-2">
                            <Truck size={16} className="text-blue-500 flex-shrink-0" />
                            <span className={theme.textSecondary}>Travail en cours...</span>
                          </div>
                        )}
                        {booking.status === 'pending_approval' && (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                              <span className={theme.textSecondary}>Travail complété par {booking.freelancer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} className="text-yellow-500 flex-shrink-0" />
                              <span className={theme.textSecondary}>En attente de votre validation</span>
                            </div>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <div className="flex items-center gap-2">
                            <CheckCheck size={16} className="text-green-500 flex-shrink-0" />
                            <span className={theme.textSecondary}>Commande finalisée et payée</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {booking.rating && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
                        <p className={`${theme.textMuted} text-sm mb-2 font-semibold`}>Votre évaluation</p>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < booking.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                          <span className={`ml-2 ${theme.textMain} font-semibold`}>{booking.rating}/5 ⭐</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-xl max-w-md w-full shadow-xl border ${theme.border}`}>
            <div className="p-6 border-b border-gray-300 dark:border-gray-600">
              <h2 className={`text-xl font-bold ${theme.textMain}`}>Envoyer un message</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>
                  Votre message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message au freelancer..."
                  className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  rows="4"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-300 dark:border-gray-600 flex gap-3">
              <button
                onClick={() => setShowMessageModal(null)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSendMessage(showMessageModal)}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal - Note & Comment */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-xl max-w-md w-full shadow-xl border ${theme.border}`}>
            <div className="p-6 border-b border-gray-300 dark:border-gray-600">
              <h2 className={`text-lg font-bold ${theme.textMain}`}>Évaluer ce travail</h2>
              <p className={`${theme.textSecondary} text-sm mt-1`}>Comment était le travail du freelancer?</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Rating Stars */}
              <div className="space-y-2">
                <p className={`${theme.textSecondary} text-sm font-medium`}>Note</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setValidationRating(star)}
                      className="p-2 hover:scale-110 transition"
                    >
                      <Star
                        size={32}
                        className={star <= validationRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
                {validationRating > 0 && (
                  <p className={`text-center ${theme.textMain} font-semibold text-sm`}>
                    {validationRating === 1 && 'Très insatisfait'}
                    {validationRating === 2 && 'Insatisfait'}
                    {validationRating === 3 && 'Acceptable'}
                    {validationRating === 4 && 'Très satisfait'}
                    {validationRating === 5 && 'Excellent!'}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <p className={`${theme.textSecondary} text-sm font-medium mb-2`}>Commentaire (optionnel)</p>
                <textarea
                  value={validationComment}
                  onChange={(e) => setValidationComment(e.target.value)}
                  placeholder="Partagez votre avis sur ce service..."
                  className={`w-full px-3 py-2 rounded-lg border ${theme.border} ${theme.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  rows="3"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-300 dark:border-gray-600 flex gap-3">
              <button
                onClick={() => setShowValidationModal(null)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleConfirmValidation(showValidationModal)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
              >
                Valider & Évaluer
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
