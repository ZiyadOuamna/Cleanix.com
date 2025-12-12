import React, { useState, useContext, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Star,
  Download,
  Search,
  Filter,
  Package,
  Sparkles,
  ChevronDown,
  Eye,
  Loader
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';
import { getOrderHistory } from '../../services/orderService';

const BookingHistory = () => {
  const { isDarkMode } = useContext(ClientContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeServiceFilter, setActiveServiceFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('completed');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  // Charger l'historique des réservations au montage
  useEffect(() => {
    loadBookingHistory();
  }, []);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching booking history from API...');
      const response = await getOrderHistory();
      
      console.log('API Response:', response);
      
      // Extract the data from the response
      const ordersData = (response && response.data) ? response.data : [];
      
      console.log('Orders data:', ordersData);
      console.log('Orders count:', ordersData.length);
      
      // Transform the data to match the component's expectations
      const formattedHistory = ordersData.map((order) => ({
        id: order.id,
        service: order.service?.nom || order.service_type || 'Service',
        serviceType: order.service_type ? order.service_type.toLowerCase() : 'nettoyage',
        freelancer: order.freelancer ? `${order.freelancer.firstname} ${order.freelancer.lastname}` : 'À assigner',
        date: new Date(order.scheduled_date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        price: `${order.agreed_price || order.initial_price}DH`,
        rating: order.rating || null,
        image: '🧹', // Default cleaning emoji
        freelancerAvatar: order.freelancer ? (order.freelancer.gender === 'female' || order.freelancer.gender === 'F' ? '👩' : '👨') : '❓',
        location: `${order.adresse}, ${order.code_postal} ${order.ville}`,
        completedDate: order.completed_at ? new Date(order.completed_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Non complétée',
        review: order.review || null,
        status: order.status || 'pending'
      }));
      
      console.log('Formatted history:', formattedHistory);
      setHistory(formattedHistory);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger votre historique de réservations',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });
      setLoading(false);
    }
  };

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-transparent',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    border: isDarkMode ? 'border-gray-700' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-slate-900'
  };

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
      didOpen: (modal) => {
        const popup = modal.querySelector('.swal2-popup');
        if (popup) {
          popup.style.backgroundColor = '#1f2937';
          popup.style.color = '#f3f4f6';
        }
      }
    };
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Service', 'Type', 'Freelancer', 'Date', 'Prix', 'Note', 'Lieu', 'Statut'],
      ...filteredHistory.map(h => [
        h.id,
        h.service,
        h.serviceType === 'nettoyage' ? 'Nettoyage' : 'Gestion de Clés',
        h.freelancer,
        h.date,
        h.price,
        h.rating ? `${h.rating}/5` : 'N/A',
        h.location,
        h.status === 'completed' ? 'Complétée' : 'Annulée'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      ...getSwalTheme(),
      icon: 'success',
      title: 'Export réussi',
      text: `${filteredHistory.length} commandes exportées en CSV`
    });
  };

  const filteredHistory = history.filter(h => {
    const matchSearch = h.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       h.freelancer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = activeServiceFilter === 'all' ? true : h.serviceType === activeServiceFilter;
    const matchStatus = h.status === activeStatusFilter;
    return matchSearch && matchService && matchStatus;
  });

  // Calculs des statistiques
  const completedCommands = history.filter(h => h.status === 'completed');
  const totalCompleted = completedCommands.length;
  const avgRating = completedCommands.filter(h => h.rating).length > 0
    ? (completedCommands.reduce((sum, h) => sum + (h.rating || 0), 0) / completedCommands.filter(h => h.rating).length).toFixed(1)
    : 0;
  const totalSpent = completedCommands.reduce((sum, h) => {
    const price = parseInt(h.price);
    return sum + price;
  }, 0);
  const ratingCount = completedCommands.filter(h => h.rating).length;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
        <span className={`text-xs font-semibold ml-1 ${theme.textMain}`}>{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin" size={32} />
          <p className={theme.textSecondary}>Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${theme.bg}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${theme.textMain}`}>
          Historique des Commandes
        </h1>
        <p className={`${theme.textSecondary}`}>
          Consultez toutes vos réservations passées et vos annulations
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-sm mb-1 ${theme.textMuted}`}>Services Complétés</p>
          <p className="text-2xl font-bold text-blue-600">{totalCompleted}</p>
        </div>
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className={`text-sm mb-1 ${theme.textMuted}`}>Évaluation Moyenne</p>
          <p className="text-2xl font-bold text-yellow-600">{avgRating} / 5</p>
          <p className={`text-xs ${theme.textMuted}`}>({ratingCount} évalués)</p>
        </div>
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-200'}`}>
          <p className={`text-sm mb-1 ${theme.textMuted}`}>Montant Total Dépensé</p>
          <p className="text-2xl font-bold text-green-600">{totalSpent.toLocaleString()} DH</p>
        </div>
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-200'}`}>
          <p className={`text-sm mb-1 ${theme.textMuted}`}>Annulations</p>
          <p className="text-2xl font-bold text-purple-600">{history.filter(h => h.status === 'cancelled').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={`${theme.cardBg} rounded-lg p-3 shadow-sm border ${theme.border} space-y-2`}>
        {/* Search */}
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-3 ${theme.textMuted}`} />
          <input
            type="text"
            placeholder="Rechercher par service ou freelancer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${theme.border} ${theme.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
          />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={16} className={theme.textMuted} />
          {[
            { id: 'all', label: 'Tous', icon: '⭐' },
            { id: 'nettoyage', label: 'Nettoyage', icon: '✨' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveServiceFilter(filter.id)}
              className={`px-3 py-1 rounded-full transition font-medium text-xs flex items-center gap-1 ${
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

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-600">
          {[
            { id: 'completed', label: 'Complétées', icon: '✅' },
            { id: 'cancelled', label: 'Annulées', icon: '❌' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => setActiveStatusFilter(status.id)}
              className={`px-3 py-1 rounded-full transition font-medium text-xs flex items-center gap-1 ${
                activeStatusFilter === status.id
                  ? 'bg-cyan-600 text-white'
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              <span>{status.icon}</span>
              {status.label}
            </button>
          ))}
          
          {/* Export Button */}
          <div className="ml-auto">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-full transition font-medium text-xs"
            >
              <Download size={14} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-1">
        {filteredHistory.length === 0 ? (
          <div className={`${theme.cardBg} rounded-lg p-6 text-center shadow-sm border ${theme.border}`}>
            <Package size={32} className={`${theme.textMuted} mx-auto mb-2`} />
            <p className={`${theme.textSecondary} text-sm`}>Aucune commande trouvée</p>
          </div>
        ) : (
          filteredHistory.map(item => (
            <div
              key={item.id}
              className={`${theme.cardBg} rounded-lg shadow-sm border ${theme.border} hover:shadow-md transition overflow-hidden`}
            >
              {/* Main Row */}
              <div
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="p-2 cursor-pointer hover:bg-opacity-50 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Icon & Service */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div className="text-xl flex-shrink-0">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${theme.textMain} truncate`}>{item.service}</p>
                      <p className={`text-xs ${theme.textSecondary} flex items-center gap-0.5`}>
                        <span className="text-sm">{item.freelancerAvatar}</span>
                        <span className="truncate">{item.freelancer}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Date & Price */}
                  <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                    <p className={`text-xs ${theme.textMuted}`}>{item.date}</p>
                    <p className={`text-xs font-bold ${theme.textMain}`}>{item.price}</p>
                  </div>

                  {/* Right: Rating & Toggle */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[...Array(Math.round(item.rating))].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className='text-yellow-500 fill-yellow-500'
                        />
                      ))}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`${theme.textMuted} transition ${
                        expandedId === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <div className={`border-t ${theme.border} p-2 bg-opacity-50 space-y-1.5`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className={`${theme.textMuted} font-medium`}>Date de fin</p>
                      <p className={`${theme.textMain} text-xs`}>{item.completedDate}</p>
                    </div>
                    <div>
                      <p className={`${theme.textMuted} font-medium`}>Lieu</p>
                      <p className={`${theme.textMain} flex items-center gap-0.5 truncate text-xs`}>
                        <MapPin size={10} />
                        {item.location.split(',')[0]}
                      </p>
                    </div>
                    <div>
                      <p className={`${theme.textMuted} font-medium`}>Type</p>
                      <p className={`${theme.textMain} text-xs`}>
                        {item.serviceType === 'nettoyage' ? 'Nettoyage' : 'Clés'}
                      </p>
                    </div>
                  </div>

                  {item.review && (
                    <div className={`p-1.5 rounded-md text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
                      <p className={`${theme.textMuted} font-medium mb-0.5`}>Avis</p>
                      <p className={`italic ${theme.textSecondary}`}>"{item.review}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
