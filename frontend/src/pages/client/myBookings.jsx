import React, { useState, useContext } from 'react';
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
  Filter
} from 'lucide-react';
import { ClientContext } from './clientContext';

const MyBookings = () => {
  const { isDarkMode, wallet } = useContext(ClientContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(null);

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
  };

  const bookings = [
    {
      id: 1,
      service: 'Nettoyage complet',
      freelancer: 'Ahmed M.',
      date: '20 Déc 2025',
      time: '10:00 - 12:00',
      location: '123 Rue de Paris, 75000 Paris',
      price: '850DH',
      status: 'confirmed',
      rating: null,
      image: '🧹'
    },
    {
      id: 2,
      service: 'Nettoyage de vitres',
      freelancer: 'Fatima K.',
      date: '22 Déc 2025',
      time: '14:00 - 15:30',
      location: '456 Avenue des Champs, 75008 Paris',
      price: '450DH',
      status: 'pending',
      rating: null,
      image: '🪟'
    },
    {
      id: 3,
      service: 'Nettoyage bureau',
      freelancer: 'Hassan D.',
      date: '15 Déc 2025',
      time: '09:00 - 11:00',
      location: '789 Boulevard Saint-Germain, 75005 Paris',
      price: '1200DH',
      status: 'completed',
      rating: 4.8,
      image: '🏢'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
      confirmed: 'Confirmée',
      pending: 'En attente',
      completed: 'Complétée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  return (
    <div className={`space-y-6 ${theme.bg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme.textMain}`}>Mes Réservations</h1>
          <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos services de nettoyage</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition">
          <Download size={20} />
          Exporter
        </button>
      </div>

      {/* Filters */}
      <div className={`${theme.cardBg} rounded-xl p-4 shadow-sm border ${theme.border} flex flex-wrap gap-2 items-center`}>
        <Filter size={20} className={theme.textMuted} />
        {[
          { id: 'all', label: 'Tous' },
          { id: 'confirmed', label: 'Confirmées' },
          { id: 'pending', label: 'En attente' },
          { id: 'completed', label: 'Complétées' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              activeFilter === filter.id
                ? 'bg-cyan-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }`}
          >
            {filter.label}
          </button>
        ))}
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
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Left: Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{booking.image}</div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${theme.textMain}`}>{booking.service}</h3>
                        <p className={`${theme.textSecondary} text-sm`}>avec {booking.freelancer}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
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
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setShowDetails(booking.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
                    >
                      <Eye size={18} />
                      Détails
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition">
                        <MessageCircle size={18} />
                        Message
                      </button>
                    )}
                    {booking.status === 'completed' && !booking.rating && (
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg transition">
                        <Star size={18} />
                        Évaluer
                      </button>
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
          <div className={`${theme.cardBg} rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto`}>
            {(() => {
              const booking = bookings.find(b => b.id === showDetails);
              return (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${theme.textMain}`}>{booking.service}</h2>
                    <button
                      onClick={() => setShowDetails(null)}
                      className={`p-2 rounded-lg ${theme.hoverBg} transition`}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`${theme.textMuted} text-sm mb-1`}>Freelancer</p>
                        <p className={`${theme.textMain} font-semibold`}>{booking.freelancer}</p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-sm mb-1`}>Statut</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-sm mb-1`}>Date</p>
                        <p className={`${theme.textMain} font-semibold`}>{booking.date} à {booking.time}</p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-sm mb-1`}>Prix</p>
                        <p className={`text-xl font-bold text-cyan-600`}>{booking.price}</p>
                      </div>
                    </div>

                    <div>
                      <p className={`${theme.textMuted} text-sm mb-1`}>Localisation</p>
                      <p className={`${theme.textMain} font-semibold flex items-center gap-2`}>
                        <MapPin size={16} />
                        {booking.location}
                      </p>
                    </div>

                    {booking.rating && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
                        <p className={`${theme.textMuted} text-sm mb-2`}>Votre évaluation</p>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < booking.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                          <span className={`ml-2 ${theme.textMain} font-semibold`}>{booking.rating}/5</span>
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
    </div>
  );
};

export default MyBookings;
