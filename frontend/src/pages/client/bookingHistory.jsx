import React, { useState, useContext } from 'react';
import { Calendar, MapPin, Star, MessageCircle, Download, Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { ClientContext } from './clientContext';

const BookingHistory = () => {
  const { isDarkMode } = useContext(ClientContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
  };

  const bookingHistory = [
    {
      id: 1,
      service: 'Nettoyage complet',
      freelancer: 'Ahmed M.',
      date: '15 Déc 2025',
      location: '123 Rue de Paris, 75000 Paris',
      price: '850DH',
      status: 'completed',
      rating: 4.8,
      review: 'Excellent travail, très professionnel!',
      duration: '2h 30m'
    },
    {
      id: 2,
      service: 'Nettoyage de vitres',
      freelancer: 'Fatima K.',
      date: '10 Déc 2025',
      location: '456 Avenue des Champs, 75008 Paris',
      price: '450DH',
      status: 'completed',
      rating: 4.5,
      review: 'Très satisfait du service',
      duration: '1h 30m'
    },
    {
      id: 3,
      service: 'Nettoyage après travaux',
      freelancer: 'Mohamed B.',
      date: '05 Déc 2025',
      location: '789 Boulevard Saint-Germain, 75005 Paris',
      price: '1500DH',
      status: 'completed',
      rating: 5,
      review: 'Parfait! Tout est impeccable',
      duration: '4h'
    },
    {
      id: 4,
      service: 'Nettoyage bureau',
      freelancer: 'Hassan D.',
      date: '28 Nov 2025',
      location: '321 Rue Rivoli, 75001 Paris',
      price: '1200DH',
      status: 'cancelled',
      rating: null,
      review: null,
      duration: 'N/A'
    },
    {
      id: 5,
      service: 'Nettoyage complet',
      freelancer: 'Aïcha L.',
      date: '20 Nov 2025',
      location: '654 Rue de Turenne, 75003 Paris',
      price: '900DH',
      status: 'completed',
      rating: 4.7,
      review: 'Très bien, je recommande!',
      duration: '2h 45m'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
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
      completed: 'Complétée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredBookings = bookingHistory.filter(b => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const getAverageRating = () => {
    const ratings = filteredBookings.filter(b => b.rating).map(b => b.rating);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const totalServices = filteredBookings.length;
  const completedServices = filteredBookings.filter(b => b.status === 'completed').length;

  return (
    <div className={`space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme.textMain}`}>Historique des réservations</h1>
          <p className={`mt-2 ${theme.textSecondary}`}>Consultez toutes vos réservations passées</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition">
          <Download size={20} />
          Exporter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
          <p className={`${theme.textMuted} text-sm mb-2`}>Services complétés</p>
          <p className={`text-3xl font-bold ${theme.textMain}`}>{completedServices}</p>
          <p className={`text-xs ${theme.textSecondary} mt-2`}>{totalServices} au total</p>
        </div>

        <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
          <p className={`${theme.textMuted} text-sm mb-2`}>Évaluation moyenne</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${theme.textMain}`}>{getAverageRating()}</p>
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
          </div>
          <p className={`text-xs ${theme.textSecondary} mt-2`}>basée sur {filteredBookings.filter(b => b.rating).length} avis</p>
        </div>

        <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
          <p className={`${theme.textMuted} text-sm mb-2`}>Montant total dépensé</p>
          <p className={`text-3xl font-bold text-cyan-600`}>
            {filteredBookings.reduce((sum, b) => sum + parseInt(b.price), 0)}DH
          </p>
          <p className={`text-xs ${theme.textSecondary} mt-2`}>en services</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`${theme.cardBg} rounded-xl p-4 shadow-sm border ${theme.border} flex flex-wrap gap-2 items-center`}>
        <Filter size={20} className={theme.textMuted} />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              activeFilter === 'all'
                ? 'bg-cyan-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              activeFilter === 'completed'
                ? 'bg-cyan-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }`}
          >
            Complétées
          </button>
          <button
            onClick={() => setActiveFilter('cancelled')}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              activeFilter === 'cancelled'
                ? 'bg-cyan-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }`}
          >
            Annulées
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className={`${theme.cardBg} rounded-xl p-12 text-center shadow-sm border ${theme.border}`}>
            <Calendar size={48} className={`${theme.textMuted} mx-auto mb-4`} />
            <p className={`${theme.textSecondary} text-lg`}>Aucune réservation trouvée</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className={`${theme.cardBg} rounded-xl overflow-hidden shadow-sm border ${theme.border} hover:shadow-md transition`}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Left: Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div>
                        <h3 className={`text-xl font-bold ${theme.textMain}`}>{booking.service}</h3>
                        <p className={`${theme.textSecondary} text-sm`}>avec {booking.freelancer}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Date</p>
                        <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                          <Calendar size={14} />
                          {booking.date}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Durée</p>
                        <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                          <Clock size={14} />
                          {booking.duration}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs uppercase mb-1`}>Montant</p>
                        <p className={`text-xl font-bold text-cyan-600`}>{booking.price}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mt-4 flex items-start gap-2">
                      <MapPin size={16} className={theme.textMuted} />
                      <p className={`text-sm ${theme.textSecondary}`}>{booking.location}</p>
                    </div>

                    {/* Rating and Review */}
                    {booking.status === 'completed' && booking.rating && (
                      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < booking.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                          <span className={`ml-2 ${theme.textMain} font-semibold`}>{booking.rating}/5</span>
                        </div>
                        <p className={`text-sm ${theme.textSecondary}`}>{booking.review}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Status Icon */}
                  <div className="flex items-center justify-center">
                    {booking.status === 'completed' ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="text-green-500 mb-2" size={40} />
                        <p className={`text-xs ${theme.textSecondary}`}>Complétée</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <AlertCircle className="text-red-500 mb-2" size={40} />
                        <p className={`text-xs ${theme.textSecondary}`}>Annulée</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
