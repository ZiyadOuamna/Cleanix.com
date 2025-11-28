// src/pages/FreelancerPage.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { 
  ChevronRight, Sun, Moon, User, Briefcase, HelpCircle, DollarSign, 
  Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, 
  History, TrendingUp, FileText, Users, MapPin, Filter, RefreshCw
} from 'lucide-react';
import { FreelancerProvider, FreelancerContext } from './freelancerContext';

// Constants
const ICONS = {
  dashboard: Home,
  orders: Package,
  services: Briefcase,
  support: HelpCircle,
  profile: User,
  earnings: DollarSign,
  history: History,
  notifications: Bell,
  settings: Settings,
  menu: Menu,
  clock: Clock,
  star: Star,
  message: MessageCircle,
  trending: TrendingUp,
  file: FileText,
  clients: Users,
  location: MapPin,
  filter: Filter,
  refresh: RefreshCw,
};

const STRING_ICONS = {
  menuOpen: '➤',
  menuClose: '◀',
  chevronDown: '▼',
  chevronUp: '▲',
};

const COLORS = { 
  primary: '#059669', 
  background: '#f0fdf4',
  dashboard: '#3B82F6',
  orders: '#8B5CF6', 
  services: '#06B6D4',
  earnings: '#10B981',
  support: '#F59E0B',
  settings: '#6B7280'
};

// Layout principal de la page freelancer
function InnerLayout() { 
  const [activePage, setActivePage] = useState('orders-received');
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Consommer l'état partagé
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isMenuOpen, setIsMenuOpen,
    isDarkMode, setIsDarkMode,
    user,
    earnings,
    pendingOrders,
    rating,
    isOnline
  } = useContext(FreelancerContext);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // États pour les sous-menus - maintenant un seul peut être ouvert à la fois
  const [openSubmenu, setOpenSubmenu] = useState('orders');
  
  // États pour la visibilité
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // États pour les filtres
  const [selectedService, setSelectedService] = useState('all');
  const [orders, setOrders] = useState([]);

  // Services disponibles pour le filtre
  const availableServices = [
    { id: 'all', name: 'Tous les services' },
    { id: 'nettoyage-complet', name: 'Nettoyage complet' },
    { id: 'nettoyage-printemps', name: 'Nettoyage de printemps' },
    { id: 'nettoyage-bureau', name: 'Nettoyage bureau' },
    { id: 'nettoyage-vitres', name: 'Nettoyage de vitres' },
    { id: 'nettoyage-apres-travaux', name: 'Nettoyage après travaux' }
  ];

  // Données simulées pour les commandes
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        clientName: "Jean Dupont",
        clientPhoto: "JD",
        rating: 4.5,
        completedOrders: 12,
        service: "Nettoyage complet",
        serviceId: "nettoyage-complet",
        address: "123 Rue de Paris, 75001 Paris",
        price: 85,
        time: "Il y a 15 min",
        status: "en attente"
      },
      {
        id: 2,
        clientName: "Marie Martin",
        clientPhoto: "MM",
        rating: 4.8,
        completedOrders: 25,
        service: "Nettoyage de printemps",
        serviceId: "nettoyage-printemps",
        address: "456 Avenue des Champs, 75008 Paris",
        price: 120,
        time: "Il y a 30 min",
        status: "en attente"
      },
      {
        id: 3,
        clientName: "Pierre Bernard",
        clientPhoto: "PB",
        rating: 4.2,
        completedOrders: 8,
        service: "Nettoyage bureau",
        serviceId: "nettoyage-bureau",
        address: "789 Boulevard Saint-Germain, 75006 Paris",
        price: 150,
        time: "Il y a 1 heure",
        status: "en attente"
      },
      {
        id: 4,
        clientName: "Sophie Laurent",
        clientPhoto: "SL",
        rating: 4.9,
        completedOrders: 18,
        service: "Nettoyage de vitres",
        serviceId: "nettoyage-vitres",
        address: "321 Rue de Rivoli, 75004 Paris",
        price: 65,
        time: "Il y a 2 heures",
        status: "en attente"
      }
    ];
    setOrders(mockOrders);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('freelancerDarkMode', JSON.stringify(newDarkMode));
  };

  const acceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'acceptée' } : order
    ));
    alert(`Commande #${orderId} acceptée avec succès!`);
  };

  const rejectOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    alert(`Commande #${orderId} refusée`);
  };

  const refreshOrders = () => {
    // Simuler un rafraîchissement des commandes
    alert('Actualisation des commandes...');
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const filteredOrders = selectedService === 'all' 
    ? orders.filter(order => order.status === 'en attente')
    : orders.filter(order => order.status === 'en attente' && order.serviceId === selectedService);

  // Composant pour afficher les commandes (page par défaut)
  const OrdersReceived = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Commandes Reçues</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Filtre par service */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {availableServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <ICONS.filter size={16} />
            </div>
          </div>

          {/* Bouton Actualiser */}
          <button 
            onClick={refreshOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <ICONS.refresh size={16} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <ICONS.orders size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedService === 'all' 
                ? "Aucune commande en attente pour le moment"
                : `Aucune commande pour le service "${availableServices.find(s => s.id === selectedService)?.name}"`
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {order.clientPhoto}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{order.clientName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <ICONS.star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{order.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">• {order.completedOrders} commandes</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{order.time}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Service demandé</h4>
                  <p className="text-gray-900 dark:text-white">{order.service}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse</h4>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <ICONS.location size={14} />
                    {order.address}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600">{order.price}€</div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => rejectOrder(order.id)}
                    className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition dark:hover:bg-red-900 dark:border-red-400 dark:text-red-400"
                  >
                    Refuser
                  </button>
                  <button 
                    onClick={() => acceptOrder(order.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Accepter
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fdf4] text-gray-800'}`}>
      
      {/* SIDEBAR À GAUCHE */}
      <aside className={`fixed md:relative z-40 h-screen shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} w-72 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        {/* Header Sidebar centré */}
        <div className="flex flex-col items-center justify-center py-8 px-4 border-b dark:border-gray-700">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0) || 'F'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isOnline ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg dark:text-white">{user?.name}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ICONS.star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{rating}</span>
            </div>
          </div>
        </div>

        {/* Navigation centrée */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-3">
            {/* Tableau de Bord */}
            <li>
              <button 
                onClick={() => { navigate('dashboard'); setActivePage('dashboard'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  activePage === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <ICONS.dashboard size={20} style={{ color: COLORS.dashboard }} />
                <span>Tableau de Bord</span>
              </button>
            </li>

            {/* Commandes avec sous-menu */}
            <li>
              <button 
                onClick={() => toggleSubmenu('orders')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activePage.startsWith('orders') ? ' font-semibold ' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-red-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <ICONS.orders size={20} style={{ color: COLORS.orders }} />
                  <span>Mes Commandes</span>
                  {pendingOrders > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingOrders}
                    </span>
                  )}
                </div>
                <span className="text-xs transition">{openSubmenu === 'orders' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === 'orders' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-4 space-y-1 border-l-2 border-purple-200 dark:border-purple-700 pl-4">
                  <li>
                    <button 
                      onClick={() => { setActivePage('orders-received'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        activePage === 'orders-received' ? 'bg-purple-50 text-purple-700 font-semibold dark:bg-purple-900 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <ICONS.clock size={16} style={{ color: COLORS.orders }} />
                      <span>Commandes Reçues</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('orders-accepted'); setActivePage('orders-accepted'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        activePage === 'orders-accepted' ? 'bg-purple-50 text-purple-700 font-semibold dark:bg-purple-900 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <ICONS.trending size={16} style={{ color: COLORS.orders }} />
                      <span>Commandes Acceptées</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('orders-history'); setActivePage('orders-history'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        activePage === 'orders-history' ? 'bg-purple-50 text-purple-700 font-semibold dark:bg-purple-900 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <ICONS.history size={16} style={{ color: COLORS.orders }} />
                      <span>Historique</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Services avec sous-menu */}
            <li>
              <button 
                onClick={() => toggleSubmenu('services')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400`}
              >
                <div className="flex items-center gap-4">
                  <ICONS.services size={20} style={{ color: COLORS.services }} />
                  <span>Services</span>
                </div>
                <span className="text-xs transition">{openSubmenu === 'services' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === 'services' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-4 space-y-1 border-l-2 border-cyan-200 dark:border-cyan-700 pl-4">
                  <li>
                    <button 
                      onClick={() => { navigate('services-list'); setActivePage('services-list'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        activePage === 'services-list' ? 'bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-900 dark:text-cyan-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <ICONS.file size={16} style={{ color: COLORS.services }} />
                      <span>Gérer mes Services</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('publish-service'); setActivePage('publish-service'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        activePage === 'publish-service' ? 'bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-900 dark:text-cyan-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <ICONS.services size={16} style={{ color: COLORS.services }} />
                      <span>Publier un Service</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Portefeuille */}
            <li>
              <button 
                onClick={() => { navigate('earnings'); setActivePage('earnings'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  activePage === 'earnings' 
                    ? 'bg-green-50 text-green-700 font-semibold border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <ICONS.earnings size={20} style={{ color: COLORS.earnings }} />
                <span>Portefeuille</span>
              </button>
            </li>

            {/* Support */}
            <li>
              <button 
                onClick={() => { navigate('support'); setActivePage('support'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  activePage === 'support' 
                    ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <ICONS.support size={20} style={{ color: COLORS.support }} />
                <span>Support</span>
              </button>
            </li>

            {/* Paramètres */}
            <li>
              <button 
                onClick={() => { navigate('settings'); setActivePage('settings'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  activePage === 'settings' 
                    ? 'bg-gray-100 text-gray-700 font-semibold border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <ICONS.settings size={20} style={{ color: COLORS.settings }} />
                <span>Paramètres</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t dark:border-gray-700">
          <div className="text-center">
            <button 
              onClick={() => { /* Logique déconnexion */ setIsSidebarVisible(false); }} 
              className="text-red-500 font-bold hover:opacity-80 transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT À DROITE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header simplifié */}
        <header className={`h-16 flex items-center justify-between px-4 md:px-6 z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white border-b border-gray-200'}`}>
          
          {/* Partie gauche: Menu mobile seulement */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsSidebarVisible(true)} className="text-gray-600 hover:text-green-600 dark:text-gray-400 p-2">
              <ICONS.menu size={24} />
            </button>
          </div>

          {/* Logo centré sur mobile, à gauche sur desktop */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <span className="text-xl md:text-2xl font-extrabold" style={{ color: COLORS.primary }}>Cleanix</span>
          </div>

          {/* Partie droite: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Bouton nouveau service - visible sur desktop seulement */}
            <button 
              onClick={() => { navigate('publish-service'); setActivePage('publish-service'); }}
              className="hidden md:flex bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition duration-200 items-center gap-2 text-sm"
            >
              <Plus size={14} />
              Publier
            </button>

            {/* Mode sombre */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(s => !s)} 
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ICONS.notifications size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-xl border p-4 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="font-bold mb-2">Notifications</h3>
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2 border-b text-sm hover:bg-opacity-50 cursor-pointer ${
                        isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                      } ${!n.read ? 'font-semibold' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <p>{n.message}</p>
                      <span className="text-xs opacity-75">{n.date}</span>
                    </div>
                  ))}
                  <button 
                    onClick={markAllAsRead} 
                    className="text-center w-full mt-2 text-sm text-green-600 hover:underline"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
              )}
            </div>

            {/* Profile avec indicateur en ligne */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(s => !s)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'F'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <span className="hidden md:block text-sm font-medium dark:text-white">{user?.name}</span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-2 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <button 
                    onClick={() => { navigate('profile'); setActivePage('profile'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white"
                  >
                    <ICONS.profile size={16} />
                    Mon Profil
                  </button>
                  <button 
                    onClick={() => { navigate('settings'); setActivePage('settings'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white"
                  >
                    <ICONS.settings size={16} />
                    Paramètres
                  </button>
                  <div className="border-t my-1 dark:border-gray-700"></div>
                  <button 
                    onClick={() => { /* Logique déconnexion */ }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-3"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f0fdf4]'}`}>
          {/* Afficher les commandes reçues par défaut */}
          {activePage === 'orders-received' && <OrdersReceived />}
          
          {/* Outlet pour les autres pages */}
          <Outlet context={{ isDarkMode }} />
        </main>
      </div>
    </div>
  );
}

// Export du composant principal
export default function FreelancerPage() {
  return (
    <FreelancerProvider>
      <InnerLayout />
    </FreelancerProvider>
  );
}

// Composant Plus
const Plus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);