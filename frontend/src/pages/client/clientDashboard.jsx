import React, { useState, useContext, useEffect } from 'react';
import {
  DollarSign, Package, Star, Calendar, Clock,
  CheckCircle, XCircle, TrendingUp, TrendingDown,
  Download, RefreshCw, ShoppingBag, Wallet, CreditCard,
  MapPin, User, FileText, Bell, Settings,
  ChevronRight, Filter, Search, Plus, Eye,
  BarChart3, PieChart, LineChart, Activity, Trophy,
  Target, Users, MessageSquare, Zap, Loader,
  Edit3, MoreVertical, ArrowUpRight, ClipboardCheck
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
  const [activeMetric, setActiveMetric] = useState('spending');

  // Thème amélioré (comme freelancer)
  const theme = {
    // Arrière-plans
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardBgAlt: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardBgGradient: isDarkMode 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-white to-gray-50',
    cardBgSoft: isDarkMode ? 'bg-gray-700' : 'bg-slate-50',
    
    // Textes
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    
    // Bordures
    border: isDarkMode ? 'border-gray-700' : 'border-slate-300',
    borderLight: isDarkMode ? 'border-gray-600' : 'border-slate-200',
    
    // Survol
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
    
    // Boutons
    buttonPrimary: isDarkMode 
      ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white' 
      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    
    // Graphiques
    chartBg: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    chartBorder: isDarkMode ? 'border-gray-600' : 'border-slate-200',
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
    // Données pour graphiques
    daily: [
      { day: 'Lun', amount: 120, bookings: 3 },
      { day: 'Mar', amount: 180, bookings: 4 },
      { day: 'Mer', amount: 150, bookings: 3 },
      { day: 'Jeu', amount: 220, bookings: 5 },
      { day: 'Ven', amount: 195, bookings: 4 },
      { day: 'Sam', amount: 160, bookings: 2 },
      { day: 'Dim', amount: 90, bookings: 1 }
    ],
    weekly: [
      { week: 'Sem 1', amount: 850, bookings: 18 },
      { week: 'Sem 2', amount: 920, bookings: 20 },
      { week: 'Sem 3', amount: 780, bookings: 16 },
      { week: 'Sem 4', amount: 1100, bookings: 24 }
    ],
    monthly: [
      { month: 'Jan', amount: 2450, bookings: 45 },
      { month: 'Fév', amount: 2800, bookings: 52 },
      { month: 'Mar', amount: 3200, bookings: 58 },
      { month: 'Avr', amount: 2950, bookings: 50 },
      { month: 'Mai', amount: 3500, bookings: 62 },
      { month: 'Juin', amount: 3800, bookings: 68 }
    ],
    yearly: [
      { year: '2021', amount: 12500, bookings: 220 },
      { year: '2022', amount: 15800, bookings: 280 },
      { year: '2023', amount: 19500, bookings: 350 },
      { year: '2024', amount: 24500, bookings: 420 }
    ],
    recentBookings: [],
    upcomingBookings: [],
    recentPayments: [],
    quickStats: {
      todaySpending: 0,
      todayBookings: 0,
      monthlyGoal: 4000,
      monthlyProgress: 61,
      favoriteService: 'Nettoyage complet'
    }
  });

  // Métriques de performance
  const [performanceMetrics, setPerformanceMetrics] = useState({
    bookingCompletion: 96,
    satisfactionRate: 4.8,
    repeatFreelancers: 45,
    onTimeRate: 92,
    cancellationRate: 8
  });

  // Charger les données du client
  useEffect(() => {
    const loadClientData = async () => {
      setLoading(true);
      
      // Simuler un chargement
      setTimeout(() => {
        setClientData({
          stats: {
            totalSpent: 12550,
            totalBookings: 18,
            completedBookings: 15,
            pendingBookings: 3,
            averageRating: 4.7,
            walletBalance: 3500
          },
          quickStats: {
            todaySpending: 245,
            todayBookings: 2,
            monthlyGoal: 5000,
            monthlyProgress: 63,
            favoriteService: 'Nettoyage complet'
          },
          daily: [
            { day: 'Lun', amount: 320, bookings: 4 },
            { day: 'Mar', amount: 280, bookings: 3 },
            { day: 'Mer', amount: 450, bookings: 5 },
            { day: 'Jeu', amount: 380, bookings: 4 },
            { day: 'Ven', amount: 520, bookings: 6 },
            { day: 'Sam', amount: 610, bookings: 7 },
            { day: 'Dim', amount: 290, bookings: 3 }
          ],
          weekly: [
            { week: 'Sem 1', amount: 1850, bookings: 18 },
            { week: 'Sem 2', amount: 1920, bookings: 20 },
            { week: 'Sem 3', amount: 1780, bookings: 16 },
            { week: 'Sem 4', amount: 2100, bookings: 24 }
          ],
          monthly: [
            { month: 'Jan', amount: 2450, bookings: 45 },
            { month: 'Fév', amount: 2800, bookings: 52 },
            { month: 'Mar', amount: 3200, bookings: 58 },
            { month: 'Avr', amount: 2950, bookings: 50 },
            { month: 'Mai', amount: 3500, bookings: 62 },
            { month: 'Juin', amount: 3800, bookings: 68 }
          ],
          yearly: [
            { year: '2021', amount: 12500, bookings: 220 },
            { year: '2022', amount: 15800, bookings: 280 },
            { year: '2023', amount: 19500, bookings: 350 },
            { year: '2024', amount: 24500, bookings: 420 }
          ],
          recentBookings: [
            {
              id: 1,
              service: 'Nettoyage complet',
              freelancer: 'Marie Martin',
              date: '15 Déc 2024',
              time: '14:00',
              status: 'completed',
              price: 850,
              rating: 4.8
            },
            {
              id: 2,
              service: 'Nettoyage vitres',
              freelancer: 'Pierre Dubois',
              date: '12 Déc 2024',
              time: '10:00',
              status: 'completed',
              price: 450,
              rating: 4.5
            },
            {
              id: 3,
              service: 'Nettoyage bureau',
              freelancer: 'Sophie Laurent',
              date: '20 Déc 2024',
              time: '09:00',
              status: 'pending',
              price: 1200,
              rating: null
            },
            {
              id: 4,
              service: 'Nettoyage après travaux',
              freelancer: 'Thomas Bernard',
              date: '25 Déc 2024',
              time: '15:30',
              status: 'upcoming',
              price: 2000,
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
              price: 750
            }
          ],
          recentPayments: [
            {
              id: 1,
              service: 'Nettoyage complet',
              date: '15 Déc 2024',
              amount: 850,
              method: 'Carte bancaire',
              status: 'paid'
            },
            {
              id: 2,
              service: 'Nettoyage vitres',
              date: '12 Déc 2024',
              amount: 450,
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
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
    // Redirection vers la page "Demander un service"
    window.location.href = 'request-cleaning';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const modalStyles = getModalStyles();
      Swal.fire({
        title: 'Actualisé!',
        text: 'Les données ont été mises à jour.',
        icon: 'success',
        background: modalStyles.background,
        color: modalStyles.color,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl'
        }
      });
    }, 800);
  };

  const getCurrentData = () => {
    switch (timeRange) {
      case 'day': return clientData.daily;
      case 'week': return clientData.weekly;
      case 'month': return clientData.monthly;
      case 'year': return clientData.yearly;
      default: return clientData.monthly;
    }
  };

  const getModalStyles = () => ({
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#1f2937'
  });

  const StatCard = ({ title, value, change, icon: Icon, color, loading, unit, subtitle }) => (
    <div className={`rounded-2xl shadow-lg ${theme.cardBgGradient} border ${theme.border} p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${theme.textMuted}`}>{title}</p>
          <p className={`text-2xl font-bold ${theme.textMain} mt-1 flex items-center gap-2`}>
            {loading ? '...' : value}
            {unit && <span className="text-lg opacity-75">{unit}</span>}
          </p>
          {subtitle && (
            <p className={`text-sm ${theme.textMuted} mt-1`}>{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change > 0 ? (
                <>
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{change}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    {change}%
                  </span>
                </>
              )}
              <span className={`text-xs ${theme.textMuted} ml-1`}>
                vs période précédente
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  const PerformanceChart = () => {
    const data = getCurrentData();
    const maxAmount = Math.max(...data.map(d => d.amount)) || 1;
    const maxBookings = Math.max(...data.map(d => d.bookings)) || 1;

    return (
      <div className={`rounded-2xl shadow-lg border ${theme.border} ${theme.cardBgGradient} p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>Dépenses et réservations</h3>
            <p className={`text-sm ${theme.textMuted}`}>
              Évolution sur la période sélectionnée
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex border ${theme.borderLight} rounded-lg overflow-hidden`}>
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : `${theme.textSecondary} ${theme.hoverBg}`
                  }`}
                >
                  {range === 'day' ? 'Jour' : range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
            
            <button className={`p-2 rounded-lg transition ${theme.hoverBg}`}>
              <MoreVertical size={18} className={theme.textSecondary} />
            </button>
          </div>
        </div>

        {/* Graphique amélioré */}
        <div className="mt-8">
          {/* Légende */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded"></div>
              <span className={`text-xs font-medium ${theme.textMuted}`}>Dépenses (DH)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded"></div>
              <span className={`text-xs font-medium ${theme.textMuted}`}>Réservations</span>
            </div>
          </div>

          {/* Barres du graphique */}
          <div className="flex items-end justify-between gap-3 h-56 px-2">
            {data.map((item, index) => {
              const amountHeight = Math.max(10, (item.amount / maxAmount) * 100);
              const bookingsHeight = Math.max(10, (item.bookings / maxBookings) * 100);
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                  {/* Conteneur des deux barres */}
                  <div className="flex gap-1 items-end justify-center h-48 w-full">
                    {/* Barre Dépenses */}
                    <div className="flex flex-col items-center flex-1 max-w-12">
                      <div className="relative w-full mb-2">
                        <div
                          className="w-full bg-gradient-to-t from-cyan-400 to-cyan-500 rounded-t-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-cyan-300 hover:to-cyan-400 cursor-pointer"
                          style={{ height: `${amountHeight * 0.95}px` }}
                        />
                        {/* Tooltip au survol */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {item.amount} DH
                        </div>
                      </div>
                    </div>

                    {/* Barre Réservations */}
                    <div className="flex flex-col items-center flex-1 max-w-12">
                      <div className="relative w-full mb-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-blue-300 hover:to-blue-400 cursor-pointer"
                          style={{ height: `${bookingsHeight * 0.95}px` }}
                        />
                        {/* Tooltip au survol */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {item.bookings} réservations
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étiquette */}
                  <span className={`text-xs font-medium ${theme.textMuted} text-center mt-2`}>
                    {item.day || item.week || item.month || item.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className={`grid grid-cols-2 gap-4 mt-8 pt-6 border-t ${theme.borderLight}`}>
          <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-cyan-50 to-blue-50'}`}>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} DH
            </p>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Total dépensé
            </p>
          </div>
          <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.reduce((sum, item) => sum + item.bookings, 0)}
            </p>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Total réservations
            </p>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceMetrics = () => {
    const metrics = [
      { title: 'Taux de complétion', value: `${performanceMetrics.bookingCompletion}%`, icon: CheckCircle, color: 'text-green-600', bgColor: isDarkMode ? 'bg-green-900/30' : 'bg-green-100', change: '+2%' },
      { title: 'Satisfaction', value: performanceMetrics.satisfactionRate, icon: Star, color: 'text-yellow-600', bgColor: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100', change: '+0.1' },
      { title: 'Ponctualité', value: `${performanceMetrics.onTimeRate}%`, icon: Clock, color: 'text-blue-600', bgColor: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100', change: '+3%' },
      { title: 'Freelancers fidèles', value: `${performanceMetrics.repeatFreelancers}%`, icon: Users, color: 'text-purple-600', bgColor: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100', change: '+5%' }
    ];

    return (
      <div className={`rounded-2xl border ${theme.border} ${theme.cardBg} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold ${theme.textMain}`}>Métriques</h3>
            <p className={`text-sm font-medium ${theme.textMuted}`}>Vos indicateurs clés</p>
          </div>
          <BarChart3 size={20} className={theme.textSecondary} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`p-4 rounded-lg border ${theme.borderLight} transition hover:border-cyan-400`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}><Icon size={18} className={metric.color} /></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>{metric.change}</span>
                </div>
                <p className={`text-2xl font-bold ${theme.textMain}`}>{metric.value}</p>
                <p className={`text-sm font-medium ${theme.textMuted} mt-1`}>{metric.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const QuickStatsItem = ({ title, value, icon: Icon, color, bgColor, progress, unit }) => (
    <div className={`p-4 rounded-lg border ${theme.borderLight} ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className={`font-medium ${theme.textMain}`}>{title}</p>
            <p className={`text-lg font-bold ${theme.textMain}`}>
              {value}
              {unit && <span className="text-sm ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        {progress !== undefined && (
          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${color.replace('text-', 'from-')} to-${color.replace('text-', '').split('-')[0]}-400`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const BookingCard = ({ booking, showActions = false }) => {
    const statusColors = getStatusColor(booking.status);
    
    return (
      <div className={`p-4 rounded-lg border ${theme.borderLight} hover:border-cyan-400 transition-colors ${theme.hoverBg}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-semibold ${theme.textMain}`}>{booking.service}</h4>
                <p className={`text-sm ${theme.textMuted} mt-1`}>
                  {booking.freelancer}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${statusColors.bg} ${statusColors.text}`}>
                {statusColors.label}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className={theme.textMuted} />
                <span className={`text-sm ${theme.textMuted}`}>
                  {booking.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className={theme.textMuted} />
                <span className={`text-sm ${theme.textMuted}`}>
                  {booking.time}
                </span>
              </div>
            </div>
            
            {booking.rating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {renderStars(booking.rating)}
                </div>
                <span className={`text-sm ${theme.textMuted}`}>
                  {booking.rating}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-right ml-4">
            <p className={`text-lg font-bold ${theme.textMain}`}>
              {formatCurrency(booking.price)}
            </p>
            {showActions && booking.status === 'upcoming' && (
              <div className="flex gap-2 mt-2">
                <button className="text-xs text-red-600 hover:text-red-700">
                  Annuler
                </button>
                <button className="text-xs text-cyan-600 hover:text-cyan-700">
                  Modifier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-cyan-600" size={48} />
          <p className={`mt-4 ${theme.textMuted}`}>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bienvenue et actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.textMain}`}>
            Bonjour, <span className="text-cyan-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className={`${theme.textMuted} mt-1`}>
            Voici votre tableau de bord client
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg ${theme.buttonSecondary} border ${theme.borderLight} hover:shadow-md transition-all`}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={handleNewBooking}
            className={`px-4 py-2 ${theme.buttonPrimary} rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Plus size={18} />
            Demander un service
          </button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Portefeuille"
          value={formatCurrency(clientData.stats.walletBalance)}
          change={15}
          icon={Wallet}
          color="text-cyan-600"
          loading={loading}
        />
        
        <StatCard
          title="Total dépensé"
          value={formatCurrency(clientData.stats.totalSpent)}
          change={12}
          icon={DollarSign}
          color="text-blue-600"
          loading={loading}
        />
        
        <StatCard
          title="Réservations"
          value={clientData.stats.totalBookings}
          subtitle={`${clientData.stats.completedBookings} terminées • ${clientData.stats.pendingBookings} en cours`}
          change={8}
          icon={Package}
          color="text-green-600"
          loading={loading}
        />
        
        <StatCard
          title="Note moyenne"
          value={clientData.stats.averageRating}
          change={2}
          icon={Star}
          color="text-yellow-600"
          loading={loading}
          unit="/5"
        />
      </div>

      {/* Graphique de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;