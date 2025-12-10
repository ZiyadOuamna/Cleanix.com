import React, { useState, useContext, useEffect } from 'react';
import {
  DollarSign, Package, Star, Calendar, Clock,
  CheckCircle, XCircle, TrendingUp, TrendingDown,
  Download, RefreshCw, ShoppingBag, Wallet, CreditCard,
  MapPin, User, FileText, Bell, Settings,
  ChevronRight, Filter, Search, Plus, Eye
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';

const ClientDashboard = () => {
  const {
    user,
    wallet,
    bookings,
    isDarkMode
  } = useContext(ClientContext);

  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // Thème simple
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  };

  // Données du client
  const [clientData, setClientData] = useState({
    stats: {
      totalSpent: 0,
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      averageRating: 4.7,
      walletBalance: 0
    },
    monthlySpending: [],
    recentBookings: [],
    upcomingBookings: [],
    recentPayments: []
  });

  // Charger les données du client
  useEffect(() => {
    const loadClientData = async () => {
      setLoading(true);
      
      // Simuler un chargement
      setTimeout(() => {
        setClientData({
          stats: {
            totalSpent: 1250.50,
            totalBookings: 18,
            completedBookings: 15,
            pendingBookings: 3,
            averageRating: 4.7,
            walletBalance: 350.25
          },
          monthlySpending: [
            { month: 'Jan', amount: 320, bookings: 4 },
            { month: 'Fév', amount: 280, bookings: 3 },
            { month: 'Mar', amount: 450, bookings: 5 },
            { month: 'Avr', amount: 380, bookings: 4 },
            { month: 'Mai', amount: 520, bookings: 6 },
            { month: 'Juin', amount: 610, bookings: 7 }
          ],
          recentBookings: [
            {
              id: 1,
              service: 'Nettoyage complet',
              freelancer: 'Marie Martin',
              date: '15 Déc 2024',
              time: '14:00',
              status: 'completed',
              price: 85,
              rating: 4.8
            },
            {
              id: 2,
              service: 'Nettoyage vitres',
              freelancer: 'Pierre Dubois',
              date: '12 Déc 2024',
              time: '10:00',
              status: 'completed',
              price: 45,
              rating: 4.5
            },
            {
              id: 3,
              service: 'Nettoyage bureau',
              freelancer: 'Sophie Laurent',
              date: '20 Déc 2024',
              time: '09:00',
              status: 'pending',
              price: 120,
              rating: null
            },
            {
              id: 4,
              service: 'Nettoyage après travaux',
              freelancer: 'Thomas Bernard',
              date: '25 Déc 2024',
              time: '15:30',
              status: 'upcoming',
              price: 200,
              rating: null
            }
          ],
          upcomingBookings: [
            {
              id: 5,
              service: 'Nettoyage résidentiel',
              freelancer: 'Julie Moreau',
              date: '28 Déc 2024',
              time: '11:00',
              status: 'upcoming',
              price: 75
            }
          ],
          recentPayments: [
            {
              id: 1,
              service: 'Nettoyage complet',
              date: '15 Déc 2024',
              amount: 85,
              method: 'Carte bancaire',
              status: 'paid'
            },
            {
              id: 2,
              service: 'Nettoyage vitres',
              date: '12 Déc 2024',
              amount: 45,
              method: 'Portefeuille',
              status: 'paid'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadClientData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { 
          bg: 'bg-green-100 dark:bg-green-900/30', 
          text: 'text-green-800 dark:text-green-300',
          label: 'Terminé'
        };
      case 'pending':
        return { 
          bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
          text: 'text-yellow-800 dark:text-yellow-300',
          label: 'En attente'
        };
      case 'upcoming':
        return { 
          bg: 'bg-blue-100 dark:bg-blue-900/30', 
          text: 'text-blue-800 dark:text-blue-300',
          label: 'À venir'
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-800 dark:text-red-300',
          label: 'Annulé'
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-800 dark:text-gray-300',
          label: 'Inconnu'
        };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
      />
    ));
  };

  const handleNewBooking = () => {
    Swal.fire({
      title: 'Nouvelle réservation',
      text: 'Cette fonctionnalité sera bientôt disponible !',
      icon: 'info',
      confirmButtonColor: '#0891b2',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        title: 'Actualisé !',
        text: 'Les données ont été mises à jour.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className={`mt-4 ${theme.textMuted}`}>Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.textMain}`}>
            Bonjour, {user?.name?.split(' ')[0] || 'Client'} 👋
          </h1>
          <p className={`${theme.textSecondary} mt-1`}>
            Voici le résumé de votre activité
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg ${theme.hoverBg} border ${theme.border}`}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleNewBooking}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solde du portefeuille */}
        <div className={`${theme.cardBg} rounded-xl p-5 border ${theme.border} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.textMuted} mb-1`}>Solde disponible</p>
              <p className={`text-2xl font-bold ${theme.textMain}`}>
                {formatCurrency(clientData.stats.walletBalance)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +1500DH ce mois
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
              <Wallet size={24} className="text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Dépenses totales */}
        <div className={`${theme.cardBg} rounded-xl p-5 border ${theme.border} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.textMuted} mb-1`}>Dépenses totales</p>
              <p className={`text-2xl font-bold ${theme.textMain}`}>
                {formatCurrency(clientData.stats.totalSpent)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown size={14} className="text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  -8% vs mois dernier
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <DollarSign size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Réservations totales */}
        <div className={`${theme.cardBg} rounded-xl p-5 border ${theme.border} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.textMuted} mb-1`}>Réservations</p>
              <p className={`text-2xl font-bold ${theme.textMain}`}>
                {clientData.stats.totalBookings}
              </p>
              <p className={`text-sm ${theme.textMuted} mt-2`}>
                {clientData.stats.completedBookings} terminées • {clientData.stats.pendingBookings} en cours
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <Package size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Note moyenne */}
        <div className={`${theme.cardBg} rounded-xl p-5 border ${theme.border} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.textMuted} mb-1`}>Note moyenne</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${theme.textMain}`}>
                  {clientData.stats.averageRating}
                </span>
                <span className={theme.textMuted}>/5</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {renderStars(clientData.stats.averageRating)}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <Star size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique et réservations à venir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des dépenses */}
        <div className={`lg:col-span-2 ${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>
              Dépenses mensuelles
            </h3>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm ${
                    timeRange === range
                      ? 'bg-cyan-600 text-white'
                      : `${theme.textSecondary} ${theme.hoverBg}`
                  }`}
                >
                  {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>

          {/* Graphique simple */}
          <div className="h-64 mt-8">
            <div className="flex items-end justify-between h-48">
              {clientData.monthlySpending.map((month, index) => {
                const maxAmount = Math.max(...clientData.monthlySpending.map(m => m.amount));
                const height = (month.amount / maxAmount) * 150;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-10">
                      <div
                        className="w-10 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300 cursor-pointer"
                        style={{ height: `${height}px` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {formatCurrency(month.amount)}<br />
                        {month.bookings} réservations
                      </div>
                    </div>
                    <span className={`text-xs mt-3 ${theme.textMuted}`}>
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Légende */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded"></div>
                <span className={`text-sm ${theme.textMuted}`}>Dépenses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Réservations à venir */}
        <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>
              Prochaines réservations
            </h3>
            <button className={`text-sm text-cyan-600 hover:text-cyan-700 ${theme.textSecondary}`}>
              Voir tout
            </button>
          </div>

          <div className="space-y-4">
            {clientData.upcomingBookings.map(booking => (
              <div key={booking.id} className={`p-4 rounded-lg border ${theme.border} ${theme.hoverBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${theme.textMain}`}>
                      {booking.service}
                    </h4>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>
                      {booking.freelancer}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={14} className={theme.textMuted} />
                      <span className={`text-sm ${theme.textMuted}`}>
                        {booking.date} • {booking.time}
                      </span>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${theme.textMain}`}>
                    {formatCurrency(booking.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status).bg} ${getStatusColor(booking.status).text}`}>
                    {getStatusColor(booking.status).label}
                  </span>
                  <button className={`text-sm text-cyan-600 hover:text-cyan-700 ${theme.textSecondary}`}>
                    Détails
                  </button>
                </div>
              </div>
            ))}
            
            {clientData.upcomingBookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                <p className={theme.textMuted}>Aucune réservation à venir</p>
                <button
                  onClick={handleNewBooking}
                  className="mt-4 text-cyan-600 hover:text-cyan-700 text-sm"
                >
                  Réserver un service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dernières réservations et paiements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières réservations */}
        <div className={`${theme.cardBg} rounded-xl border ${theme.border}`}>
          <div className={`p-6 border-b ${theme.border}`}>
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>
              Dernières réservations
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {clientData.recentBookings.map(booking => {
              const statusColors = getStatusColor(booking.status);
              
              return (
                <div key={booking.id} className={`p-6 ${theme.hoverBg}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-medium ${theme.textMain}`}>
                        {booking.service}
                      </h4>
                      <p className={`text-sm ${theme.textMuted} mt-1`}>
                        {booking.freelancer}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`text-sm ${theme.textMuted}`}>
                          {booking.date} • {booking.time}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${statusColors.bg} ${statusColors.text}`}>
                          {statusColors.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${theme.textMain}`}>
                        {formatCurrency(booking.price)}
                      </p>
                      {booking.rating && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {renderStars(booking.rating)}
                          <span className={`text-xs ${theme.textMuted} ml-1`}>
                            {booking.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={`p-6 border-t ${theme.border}`}>
            <button className={`w-full text-center text-cyan-600 hover:text-cyan-700 ${theme.textSecondary}`}>
              Voir toutes les réservations
            </button>
          </div>
        </div>

        {/* Derniers paiements */}
        <div className={`${theme.cardBg} rounded-xl border ${theme.border}`}>
          <div className={`p-6 border-b ${theme.border}`}>
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>
              Derniers paiements
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {clientData.recentPayments.map(payment => (
              <div key={payment.id} className={`p-6 ${theme.hoverBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${theme.textMain}`}>
                      {payment.service}
                    </h4>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>
                      {payment.date}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CreditCard size={14} className={theme.textMuted} />
                      <span className={`text-sm ${theme.textMuted}`}>
                        {payment.method}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${theme.textMain}`}>
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className={`text-sm ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status === 'paid' ? 'Payé' : 'En attente'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`p-6 border-t ${theme.border}`}>
            <button className={`w-full text-center text-cyan-600 hover:text-cyan-700 ${theme.textSecondary}`}>
              Voir tous les paiements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;