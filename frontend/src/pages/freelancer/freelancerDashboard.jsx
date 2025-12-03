import React, { useState, useContext, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, Clock, Target,
  DollarSign, Package, Users, Star, MessageSquare,
  CheckCircle, XCircle, AlertCircle, ArrowUpRight,
  Download, Filter, RefreshCw, MoreVertical, Eye,
  BarChart3, PieChart, LineChart, Activity, Award,
  Briefcase, MapPin, UserCheck, CalendarDays, Timer,
  FileText, ClipboardCheck, Loader, Zap, Edit3,
  Trophy, TrendingUp as TrendingUpIcon, Target as TargetIcon,
  ChevronRight, Settings, BarChart2, TrendingUp as ChartUp,
  Clock as ClockIcon, CheckCircle as CheckCircleIcon
} from 'lucide-react';
import { FreelancerContext } from './freelancerContext';
import Swal from 'sweetalert2';

const FreelancerDashboard = () => {
  const {
    user,
    earnings,
    pendingOrders,
    rating,
    isOnline,
    setIsOnline,
    notifications,
    isDarkMode
  } = useContext(FreelancerContext);

  const [timeRange, setTimeRange] = useState('week');
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [quickStats, setQuickStats] = useState({
    todayEarnings: 0,
    todayJobs: 0,
    responseTime: '1h 24m',
    acceptanceRate: 92
  });

  // Thème contrasté amélioré
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
      ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    
    // Indicateurs
    onlineIndicator: isDarkMode ? 'bg-green-500' : 'bg-green-500',
    offlineIndicator: isDarkMode ? 'bg-gray-500' : 'bg-gray-400',
    
    // Graphiques
    chartBg: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    chartBorder: isDarkMode ? 'border-gray-600' : 'border-slate-200',
  };

  // Données pour les graphiques
  const [performanceData, setPerformanceData] = useState({
    daily: [
      { day: 'Lun', revenue: 120, jobs: 4 },
      { day: 'Mar', revenue: 180, jobs: 6 },
      { day: 'Mer', revenue: 150, jobs: 5 },
      { day: 'Jeu', revenue: 220, jobs: 7 },
      { day: 'Ven', revenue: 195, jobs: 6 },
      { day: 'Sam', revenue: 160, jobs: 3 },
      { day: 'Dim', revenue: 90, jobs: 2 }
    ],
    weekly: [
      { week: 'Sem 1', revenue: 850, jobs: 25 },
      { week: 'Sem 2', revenue: 920, jobs: 28 },
      { week: 'Sem 3', revenue: 780, jobs: 23 },
      { week: 'Sem 4', revenue: 1100, jobs: 32 }
    ],
    monthly: [
      { month: 'Jan', revenue: 2450, jobs: 75 },
      { month: 'Fév', revenue: 2800, jobs: 82 },
      { month: 'Mar', revenue: 3200, jobs: 94 },
      { month: 'Avr', revenue: 2950, jobs: 86 },
      { month: 'Mai', revenue: 3500, jobs: 102 },
      { month: 'Juin', revenue: 3800, jobs: 110 }
    ]
  });

  // Données pour les objectifs
  const [goals, setGoals] = useState({
    monthly: {
      target: 4000,
      current: 2450,
      progress: 61,
      title: 'Revenu mensuel',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    weekly: {
      target: 1000,
      current: 520,
      progress: 52,
      title: 'Revenu hebdo',
      icon: TrendingUpIcon,
      color: 'from-blue-500 to-cyan-600',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    jobs: {
      target: 30,
      current: 18,
      progress: 60,
      title: 'Commandes mensuelles',
      icon: Package,
      color: 'from-purple-500 to-violet-600',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    rating: {
      target: 4.9,
      current: 4.8,
      progress: 98,
      title: 'Note moyenne',
      icon: Star,
      color: 'from-yellow-500 to-amber-600',
      bgColor: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
    },
    response: {
      target: 30,
      current: 45,
      progress: 67,
      title: 'Temps de réponse',
      icon: ClockIcon,
      color: 'from-indigo-500 to-blue-600',
      bgColor: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
    },
    satisfaction: {
      target: 95,
      current: 92,
      progress: 97,
      title: 'Satisfaction clients',
      icon: Trophy,
      color: 'from-pink-500 to-rose-600',
      bgColor: isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'
    }
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    jobCompletion: 96,
    clientSatisfaction: 4.8,
    repeatClients: 65,
    responseRate: 98,
    cancellationRate: 4,
    onTimeRate: 95
  });

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuickStats({
        todayEarnings: 245,
        todayJobs: 3,
        responseTime: '45m',
        acceptanceRate: 94
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getCurrentData = () => {
    switch (timeRange) {
      case 'day': return performanceData.daily;
      case 'week': return performanceData.weekly;
      case 'month': return performanceData.monthly;
      default: return performanceData.daily;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Fonction pour les styles de modale
  const getModalStyles = () => ({
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#1f2937',
    inputBg: isDarkMode ? '#374151' : '#ffffff',
    inputBorder: isDarkMode ? '#4b5563' : '#d1d5db',
    inputText: isDarkMode ? '#ffffff' : '#1f2937',
    labelText: isDarkMode ? '#d1d5db' : '#4b5563'
  });

  const handleEditGoal = (goalKey) => {
    const modalStyles = getModalStyles();
    
    Swal.fire({
      title: `Modifier l'objectif: ${goals[goalKey].title}`,
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Valeur actuelle</label>
            <input 
              type="number" 
              id="currentValue" 
              class="w-full px-3 py-2 border rounded-lg transition-colors" 
              style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}"
              value="${goals[goalKey].current}"
              step="${goalKey === 'rating' ? '0.1' : '1'}"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Objectif cible</label>
            <input 
              type="number" 
              id="targetValue" 
              class="w-full px-3 py-2 border rounded-lg transition-colors" 
              style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}"
              value="${goals[goalKey].target}"
              step="${goalKey === 'rating' ? '0.1' : '1'}"
            >
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      background: modalStyles.background,
      color: modalStyles.color,
      customClass: {
        popup: 'rounded-xl',
        title: `${isDarkMode ? 'text-white' : 'text-slate-900'}`,
        confirmButton: `${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium py-2 px-4 rounded-lg`,
        cancelButton: `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'} ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} font-medium py-2 px-4 rounded-lg`,
      },
      preConfirm: () => {
        const current = document.getElementById('currentValue').value;
        const target = document.getElementById('targetValue').value;
        
        if (!current || !target) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
          return false;
        }
        
        const currentNum = parseFloat(current);
        const targetNum = parseFloat(target);
        
        if (targetNum <= 0) {
          Swal.showValidationMessage('L\'objectif doit être supérieur à 0');
          return false;
        }
        
        if (currentNum > targetNum) {
          Swal.showValidationMessage('La valeur actuelle ne peut pas dépasser l\'objectif');
          return false;
        }
        
        return { current: currentNum, target: targetNum };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { current, target } = result.value;
        const progress = Math.round((current / target) * 100);
        
        setGoals(prev => ({
          ...prev,
          [goalKey]: {
            ...prev[goalKey],
            current,
            target,
            progress,
            bgColor: isDarkMode 
              ? prev[goalKey].bgColor.replace(/bg-.*?\//, 'bg-').replace(/\d+$/, '900/20')
              : prev[goalKey].bgColor.replace(/bg-.*?\//, 'bg-').replace(/\d+$/, '50')
          }
        }));
        
        Swal.fire({
          icon: 'success',
          title: 'Objectif mis à jour!',
          text: 'Votre objectif a été modifié avec succès.',
          background: modalStyles.background,
          color: modalStyles.color,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl'
          }
        });
      }
    });
  };

  const StatCard = ({ title, value, change, icon: Icon, color, loading, unit }) => (
    <div className={`rounded-2xl shadow-lg ${theme.cardBgGradient} border ${theme.border} p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${theme.textMuted}`}>{title}</p>
          <p className={`text-2xl font-bold ${theme.textMain} mt-1 flex items-center gap-2`}>
            {loading ? '...' : value}
            {unit && <span className="text-lg opacity-75">{unit}</span>}
          </p>
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

  const GoalCard = ({ goal, goalKey }) => {
    const Icon = goal.icon;
    
    return (
      <div className={`rounded-xl border ${theme.borderLight} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 hover:shadow-md transition-all ${theme.hoverBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${goal.bgColor}`}>
              <Icon size={18} className={goal.color.split(' ')[0].replace('from-', 'text-')} />
            </div>
            <div>
              <h4 className={`font-medium ${theme.textMain}`}>{goal.title}</h4>
              <p className={`text-sm ${theme.textMuted}`}>
                {goalKey === 'rating' 
                  ? `${goal.current} / ${goal.target}` 
                  : goalKey === 'response'
                  ? `${goal.current} min / ${goal.target} min`
                  : goalKey === 'satisfaction'
                  ? `${goal.current}% / ${goal.target}%`
                  : `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => handleEditGoal(goalKey)}
            className={`p-2 rounded-lg transition ${theme.hoverBg}`}
          >
            <Edit3 size={16} className={theme.textMuted} />
          </button>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className={theme.textMuted}>Progression</span>
            <span className={`font-semibold ${theme.textMain}`}>{goal.progress}%</span>
          </div>
          <div className={`w-full ${theme.chartBg} rounded-full h-2.5`}>
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${goal.color} transition-all duration-1000 ease-out`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className={theme.textMuted}>Début</span>
          <span className={theme.textMuted}>Objectif</span>
        </div>
      </div>
    );
  };

  const PerformanceChart = () => {
    const data = getCurrentData();
    const maxValue = Math.max(...data.map(d => d.revenue)) || 1;
    const maxJobs = Math.max(...data.map(d => d.jobs)) || 1;

    return (
      <div className={`rounded-2xl shadow-lg border ${theme.border} ${theme.cardBgGradient} p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textMain}`}>Performance des revenus</h3>
            <p className={`text-sm ${theme.textMuted}`}>
              Évolution sur la période sélectionnée
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex border ${theme.borderLight} rounded-lg overflow-hidden`}>
              {['day', 'week', 'month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : `${theme.textSecondary} ${theme.hoverBg}`
                  }`}
                >
                  {range === 'day' ? 'Jour' : range === 'week' ? 'Semaine' : 'Mois'}
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
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
              <span className={`text-xs font-medium ${theme.textMuted}`}>Revenus (€)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded"></div>
              <span className={`text-xs font-medium ${theme.textMuted}`}>Commandes</span>
            </div>
          </div>

          {/* Barres du graphique */}
          <div className="flex items-end justify-between gap-3 h-56 px-2">
            {data.map((item, index) => {
              const revenueHeight = Math.max(10, (item.revenue / maxValue) * 100);
              const jobsHeight = Math.max(10, (item.jobs / maxJobs) * 100);
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                  {/* Conteneur des deux barres */}
                  <div className="flex gap-1 items-end justify-center h-48 w-full">
                    {/* Barre Revenus */}
                    <div className="flex flex-col items-center flex-1 max-w-12">
                      <div className="relative w-full mb-2">
                        <div
                          className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-green-300 hover:to-green-400 cursor-pointer"
                          style={{ height: `${revenueHeight * 0.95}px` }}
                        />
                        {/* Tooltip au survol */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {item.revenue}€
                        </div>
                      </div>
                    </div>

                    {/* Barre Commandes */}
                    <div className="flex flex-col items-center flex-1 max-w-12">
                      <div className="relative w-full mb-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-md shadow-md hover:shadow-lg transition-all duration-200 hover:from-blue-300 hover:to-blue-400 cursor-pointer"
                          style={{ height: `${jobsHeight * 0.95}px` }}
                        />
                        {/* Tooltip au survol */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {item.jobs}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étiquette du jour/semaine/mois */}
                  <span className={`text-xs font-medium ${theme.textMuted} text-center mt-2`}>
                    {item.day || item.week || item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className={`grid grid-cols-2 gap-4 mt-8 pt-6 border-t ${theme.borderLight}`}>
          <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}€
            </p>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Revenu total
            </p>
          </div>
          <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.reduce((sum, item) => sum + item.jobs, 0)}
            </p>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Total commandes
            </p>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceMetrics = () => {
    const metrics = [
      { title: 'Taux de complétion', value: `${performanceMetrics.jobCompletion}%`, icon: CheckCircleIcon, color: 'text-green-600', bgColor: isDarkMode ? 'bg-green-900/30' : 'bg-green-100', change: '+2%' },
      { title: 'Satisfaction clients', value: performanceMetrics.clientSatisfaction, icon: Star, color: 'text-yellow-600', bgColor: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100', change: '+0.1' },
      { title: 'Clients fidèles', value: `${performanceMetrics.repeatClients}%`, icon: UserCheck, color: 'text-purple-600', bgColor: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100', change: '+5%' },
      { title: 'À l\'heure', value: `${performanceMetrics.onTimeRate}%`, icon: ClockIcon, color: 'text-blue-600', bgColor: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100', change: '+3%' }
    ];

    return (
      <div className={`rounded-2xl border ${theme.border} ${theme.cardBg} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold ${theme.textMain}`}>Métriques</h3>
            <p className={`text-sm font-medium ${theme.textMuted}`}>Vos indicateurs clés</p>
          </div>
          <BarChart2 size={20} className={theme.textSecondary} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`p-4 rounded-lg border ${theme.borderLight} transition hover:border-green-400`}>
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

  const refreshDashboard = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const modalStyles = getModalStyles();
      Swal.fire({
        icon: 'success',
        title: 'Actualisé!',
        text: 'Les données du dashboard ont été actualisées.',
        background: modalStyles.background,
        color: modalStyles.color,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl'
        }
      });
    }, 1000);
  };

  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    const modalStyles = getModalStyles();
    Swal.fire({
      icon: 'success',
      title: newStatus ? 'En ligne' : 'Hors ligne',
      text: newStatus 
        ? 'Vous êtes maintenant disponible pour les nouvelles commandes'
        : 'Vous êtes maintenant indisponible',
      background: modalStyles.background,
      color: modalStyles.color,
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  };

  const QuickStatsItem = ({ title, subtitle, value, unit, icon: Icon, color, bgColor, progress }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${theme.borderLight} ${isDarkMode ? bgColor : bgColor.replace('/20', '/10')}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <Icon size={18} className={color} />
        </div>
        <div>
          <p className={`font-medium ${theme.textMain}`}>{title}</p>
          <p className={`text-sm ${theme.textMuted}`}>{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${theme.textMain}`}>
          {value}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </p>
        {progress !== undefined && (
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${color.replace('text-', 'from-')} to-${color.replace('text-', '').split('-')[0]}-400`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const AdviceCard = ({ title, content, icon: Icon, color, borderColor, bgColor }) => (
    <div className={`p-4 rounded-lg border ${borderColor} ${bgColor}`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`${color} mt-0.5`} />
        <div>
          <p className={`font-medium ${theme.textMain}`}>{title}</p>
          <p className={`text-sm ${theme.textMuted} mt-1`}>{content}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-green-600" size={48} />
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
            Bonjour, <span className="text-green-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className={`${theme.textMuted} mt-1`}>
            Voici votre tableau de bord personnel
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'} border ${isDarkMode ? 'border-green-800' : 'border-green-200'}`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? theme.onlineIndicator : theme.offlineIndicator} ${isOnline ? 'animate-pulse' : ''}`} />
            <span className={`text-sm font-medium ${theme.textMain}`}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
          
          <button
            onClick={handleToggleOnline}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isOnline 
                ? `${theme.buttonPrimary} shadow-lg hover:from-green-600 hover:to-emerald-700` 
                : `${theme.buttonSecondary}`
            }`}
          >
            {isOnline ? '🟢 Actif' : '⚪ Inactif'}
          </button>
          
          <button
            onClick={refreshDashboard}
            className={`p-2 rounded-lg ${theme.buttonSecondary} border ${theme.borderLight} hover:shadow-md transition-all`}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenu total"
          value={formatCurrency(earnings?.total || 1250)}
          change={12}
          icon={DollarSign}
          color="text-green-600"
          loading={loading}
        />
        
        <StatCard
          title="Ce mois-ci"
          value={formatCurrency(earnings?.available || 930)}
          change={8}
          icon={TrendingUp}
          color="text-blue-600"
          loading={loading}
        />
        
        <StatCard
          title="En attente"
          value={pendingOrders || 3}
          change={-5}
          icon={Package}
          color="text-orange-600"
          loading={loading}
        />
        
        <StatCard
          title="Note moyenne"
          value={rating || 4.8}
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

      {/* Objectifs et métriques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectifs */}
        <div className={`rounded-2xl shadow-lg border ${theme.border} ${theme.cardBgGradient} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${theme.textMain}`}>Suivi des Objectifs</h3>
              <p className={`text-sm ${theme.textMuted}`}>
                Définissez et suivez vos objectifs personnels
              </p>
            </div>
            <TargetIcon size={20} className="text-green-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(goals).map(([key, goal]) => (
              <GoalCard key={key} goal={goal} goalKey={key} />
            ))}
          </div>
          
          <div className={`mt-6 pt-6 border-t ${theme.borderLight}`}>
            <button
              onClick={() => {
                const modalStyles = getModalStyles();
                Swal.fire({
                  title: 'Nouvel objectif',
                  html: `
                    <div class="text-left space-y-4">
                      <div>
                        <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Nom de l'objectif</label>
                        <input type="text" id="goalName" class="w-full px-3 py-2 border rounded-lg transition-colors" 
                          style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}"
                          placeholder="Ex: Taux d'acceptation">
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Valeur actuelle</label>
                        <input type="number" id="goalCurrent" class="w-full px-3 py-2 border rounded-lg transition-colors"
                          style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}"
                          value="0">
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Objectif cible</label>
                        <input type="number" id="goalTarget" class="w-full px-3 py-2 border rounded-lg transition-colors"
                          style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}"
                          value="100">
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2" style="color: ${modalStyles.labelText}">Type</label>
                        <select id="goalType" class="w-full px-3 py-2 border rounded-lg transition-colors"
                          style="background: ${modalStyles.inputBg}; border-color: ${modalStyles.inputBorder}; color: ${modalStyles.inputText}">
                          <option value="revenue">Revenu</option>
                          <option value="jobs">Commandes</option>
                          <option value="rating">Note</option>
                          <option value="time">Temps</option>
                          <option value="percentage">Pourcentage</option>
                        </select>
                      </div>
                    </div>
                  `,
                  showCancelButton: true,
                  confirmButtonText: 'Créer',
                  cancelButtonText: 'Annuler',
                  background: modalStyles.background,
                  color: modalStyles.color,
                  customClass: {
                    popup: 'rounded-xl',
                    title: `${isDarkMode ? 'text-white' : 'text-slate-900'}`,
                    confirmButton: `${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium py-2 px-4 rounded-lg`,
                    cancelButton: `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'} ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} font-medium py-2 px-4 rounded-lg`,
                  }
                }).then((result) => {
                  if (result.isConfirmed) {
                    const modalStyles = getModalStyles();
                    Swal.fire({
                      icon: 'success',
                      title: 'Objectif créé!',
                      text: 'Votre nouvel objectif a été ajouté.',
                      background: modalStyles.background,
                      color: modalStyles.color,
                      timer: 2000,
                      showConfirmButton: false,
                      customClass: {
                        popup: 'rounded-xl'
                      }
                    });
                  }
                });
              }}
              className={`w-full py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'} border border-dashed ${isDarkMode ? 'border-green-700' : 'border-green-300'} rounded-lg hover:border-green-500 transition flex items-center justify-center gap-2`}
            >
              <Plus size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">Ajouter un objectif</span>
            </button>
          </div>
        </div>

        {/* Statistiques rapides et conseils */}
        <div className="space-y-6">
          {/* Statistiques rapides */}
          <div className={`rounded-2xl border ${theme.border} ${theme.cardBg} p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textMain} mb-6`}>Statistiques rapides</h3>
            <div className="space-y-4">
              <QuickStatsItem
                title="Aujourd'hui"
                subtitle="Revenus & commandes"
                value={quickStats.todayEarnings}
                unit="€"
                icon={Clock}
                color="text-blue-600"
                bgColor={isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}
                secondValue={quickStats.todayJobs}
                secondUnit="commandes"
              />
              
              <QuickStatsItem
                title="Temps de réponse"
                subtitle="Moyenne actuelle"
                value={quickStats.responseTime}
                icon={Timer}
                color="text-purple-600"
                bgColor={isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}
              />
              
              <QuickStatsItem
                title="Taux d'acceptation"
                subtitle="Commandes acceptées"
                value={quickStats.acceptanceRate}
                unit="%"
                icon={TrendingUpIcon}
                color="text-yellow-600"
                bgColor={isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}
                progress={quickStats.acceptanceRate}
              />
            </div>
          </div>

          {/* Conseils de performance */}
          <div className={`rounded-2xl border ${theme.border} ${theme.cardBg} p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textMain} mb-6`}>Conseils de performance</h3>
            <div className="space-y-4">
              <AdviceCard
                title="Répondez rapidement"
                content="Les freelancers qui répondent en moins de 30 minutes obtiennent 50% plus de commandes."
                icon={CheckCircle}
                color="text-green-600"
                borderColor={isDarkMode ? 'border-green-800' : 'border-green-300'}
                bgColor={isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}
              />
              
              <AdviceCard
                title="Définissez vos objectifs"
                content="Les freelancers avec des objectifs clairs gagnent en moyenne 30% de plus."
                icon={Target}
                color="text-blue-600"
                borderColor={isDarkMode ? 'border-blue-800' : 'border-blue-300'}
                bgColor={isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}
              />
              
              <AdviceCard
                title="Demandez des avis"
                content="Chaque nouvel avis 5 étoiles augmente votre visibilité de 15%."
                icon={Star}
                color="text-purple-600"
                borderColor={isDarkMode ? 'border-purple-800' : 'border-purple-300'}
                bgColor={isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Plus pour le bouton
const Plus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default FreelancerDashboard;