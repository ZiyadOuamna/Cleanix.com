import React, { useState, useContext } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, DollarSign, Package, 
  Star, CheckCircle, Clock, AlertCircle, MapPin, User,
  Download, RefreshCw, BarChart2, Activity
} from 'lucide-react';
import { ClientContext } from './clientContext';

const ClientDashboard = () => {
  const { user, wallet, bookings, isDarkMode } = useContext(ClientContext);

  const [timeRange, setTimeRange] = useState('month');

  // Thème cohérent
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
  };

  // Stats du client
  const stats = [
    {
      title: 'Réservations actives',
      value: bookings.active,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      title: 'Solde du portefeuille',
      value: `€${wallet.balance.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    {
      title: 'Services complétés',
      value: bookings.completed,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'
    },
    {
      title: 'Dépenses totales',
      value: `€${wallet.totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    }
  ];

  // Données pour les graphiques mensuels
  const monthlyData = [
    { month: 'Jan', spending: 120, services: 3 },
    { month: 'Fév', spending: 180, services: 4 },
    { month: 'Mar', spending: 150, services: 5 },
    { month: 'Avr', spending: 220, services: 6 },
    { month: 'Mai', spending: 195, services: 5 },
    { month: 'Juin', spending: 160, services: 4 }
  ];

  // Réservations récentes
  const recentBookings = [
    {
      id: 1,
      service: 'Nettoyage complet',
      freelancer: 'Ahmed M.',
      date: '15 Déc 2025',
      status: 'completed',
      price: '85€',
      rating: 4.8
    },
    {
      id: 2,
      service: 'Nettoyage de vitres',
      freelancer: 'Fatima K.',
      date: '10 Déc 2025',
      status: 'completed',
      price: '45€',
      rating: 4.5
    },
    {
      id: 3,
      service: 'Nettoyage bureau',
      freelancer: 'Hassan D.',
      date: '20 Déc 2025',
      status: 'pending',
      price: '120€',
      rating: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-8 ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme.textMain}`}>Bienvenue, {user.name}</h1>
          <p className={`mt-2 ${theme.textSecondary}`}>Gérez vos réservations et services de nettoyage</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition">
          <Download size={20} />
          Télécharger les reçus
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`${theme.textMuted} text-sm font-medium mb-1`}>{stat.title}</p>
                  <p className={`${theme.textMain} text-2xl font-bold`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Bookings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className={`lg:col-span-2 ${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${theme.textMain}`}>Dépenses par mois</h2>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    timeRange === range
                      ? 'bg-cyan-600 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range === 'week' ? 'Sem' : range === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t" style={{ height: `${(data.spending / 250) * 200}px` }}></div>
                <p className={`text-xs mt-2 ${theme.textMuted}`}>{data.month}</p>
                <p className={`text-sm font-semibold ${theme.textMain}`}>€{data.spending}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-cyan-600" size={24} />
              <h3 className={`font-semibold ${theme.textMain}`}>Activité</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={theme.textSecondary}>Ce mois</span>
                <span className={`font-bold ${theme.textMain}`}>{bookings.active + bookings.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={theme.textSecondary}>Moyenne</span>
                <span className={`font-bold ${theme.textMain}`}>5.2/mois</span>
              </div>
            </div>
          </div>

          <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
            <div className="flex items-center gap-3 mb-4">
              <Star className="text-yellow-500" size={24} />
              <h3 className={`font-semibold ${theme.textMain}`}>Évaluation</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${theme.textMain}`}>4.7</span>
              <span className={theme.textSecondary}>/5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className={`${theme.cardBg} rounded-xl p-6 shadow-sm border ${theme.border}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme.textMain}`}>Réservations récentes</h2>
          <button className={`text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition`}>
            Voir tout <span>→</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme.border}`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Service</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Freelancer</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Date</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Statut</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme.textMuted}`}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id} className={`border-b ${theme.border} hover:${theme.hoverBg} transition`}>
                  <td className={`px-4 py-3 text-sm ${theme.textMain} font-medium`}>{booking.service}</td>
                  <td className={`px-4 py-3 text-sm ${theme.textSecondary}`}>{booking.freelancer}</td>
                  <td className={`px-4 py-3 text-sm ${theme.textSecondary}`}>{booking.date}</td>
                  <td className={`px-4 py-3 text-sm`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status === 'completed' ? 'Complétée' : 'En attente'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold ${theme.textMain}`}>{booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
