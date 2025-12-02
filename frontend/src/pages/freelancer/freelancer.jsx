// src/pages/freelancer/freelancer.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { 
  ChevronRight, Sun, Moon, User, Briefcase, HelpCircle, DollarSign, 
  Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, 
  History, TrendingUp, FileText, Users, MapPin, Filter, RefreshCw, X
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
  close: X,
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
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);
  
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

  // États pour les sous-menus
  const [openSubmenu, setOpenSubmenu] = useState(null);
  
  // États pour la visibilité
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Synchroniser activePage avec la route actuelle
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('accepted-cmd-freelancer')) {
      setActivePage('accepted-cmd-freelancer');
    } else if (path.includes('historique-commandes-freelancer')) {
      setActivePage('historique-commandes-freelancer');
    } else if (path.includes('portefeuille-freelancer')) {
      setActivePage('earnings');
    } else if (path.includes('settings-freelancer')) {
      setActivePage('settings');
    } else if (path.includes('support-freelancer')) {
      setActivePage('support');
    } else if (path === '/dev-freelancer-page' || path === '/dev-freelancer-page/') {
      // Page d'accueil
      setActivePage('orders-received');
    }
  }, [location.pathname]);

  // Gestion du clic en dehors de la sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
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

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleNavigation = (page, path = null) => {
    setActivePage(page);
    setIsSidebarVisible(false);
    
    if (path) {
      navigate(path);
    } else {
      // Si pas de chemin spécifié, naviguer vers la page d'accueil
      if (page === 'orders-received') {
        navigate('/dev-freelancer-page');
      }
    }
  };

  // Fonction pour déterminer le style des éléments de menu
  const getMenuItemStyle = (pageName) => {
    const isActive = activePage === pageName;
    const colorMap = {
      'orders-received': COLORS.orders,
      'accepted-cmd-freelancer': COLORS.orders,
      'historique-commandes-freelancer': COLORS.orders,
      'services-list': COLORS.services,
      'publish-service': COLORS.services,
      'earnings': COLORS.earnings,
      'support': COLORS.support,
      'settings': COLORS.settings,
      'profile': COLORS.settings
    };
    
    const color = colorMap[pageName] || COLORS.settings;
    
    if (isActive) {
      return {
        button: `bg-opacity-20 border font-semibold`,
        text: 'font-semibold',
        iconColor: color
      };
    }
    
    return {
      button: `text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400`,
      text: '',
      iconColor: '#6B7280',
    };
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-[#f0fdf4] text-gray-800'}`}>
      
      {/* Overlay pour mobile */}
      {isSidebarVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" />
      )}
      
      {/* SIDEBAR À GAUCHE */}
      <aside 
        ref={sidebarRef}
        className={`fixed md:relative z-40 h-screen shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} w-72 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >

        {/* Header Sidebar centré avec bouton fermer */}
        <div className="flex flex-col items-center justify-center py-8 px-4 border-b dark:border-gray-700 relative">
          {/* Bouton fermer visible seulement sur mobile */}
          <button 
            onClick={() => setIsSidebarVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-green-600 md:hidden"
          >
            <ICONS.close size={20} />
          </button>
          
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
                onClick={() => handleNavigation('dashboard', 'dashboard')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  getMenuItemStyle('dashboard').button
                }`}
                style={{ 
                  backgroundColor: activePage === 'dashboard' ? `${COLORS.dashboard}20` : '',
                  borderColor: activePage === 'dashboard' ? COLORS.dashboard : '',
                  color: activePage === 'dashboard' ? COLORS.dashboard : ''
                }}
              >
                <ICONS.dashboard size={20} style={{ color: getMenuItemStyle('dashboard').iconColor }} />
                <span className={getMenuItemStyle('dashboard').text}>Tableau de Bord</span>
              </button>
            </li>

            {/* Commandes avec sous-menu */}
            <li>
              <button 
                onClick={() => toggleSubmenu('orders')} 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <div className="flex items-center gap-4">
                  <ICONS.orders size={20} style={{ color: '#6B7280' }} />
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
                      onClick={() => handleNavigation('orders-received')}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        getMenuItemStyle('orders-received').button
                      }`}
                      style={{ 
                        backgroundColor: activePage === 'orders-received' ? `${COLORS.orders}20` : '',
                        borderColor: activePage === 'orders-received' ? COLORS.orders : '',
                        color: activePage === 'orders-received' ? COLORS.orders : ''
                      }}
                    >
                      <ICONS.clock size={16} style={{ color: getMenuItemStyle('orders-received').iconColor }} />
                      <span className={getMenuItemStyle('orders-received').text}>Commandes Reçues</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('accepted-cmd-freelancer', 'accepted-cmd-freelancer')}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        getMenuItemStyle('accepted-cmd-freelancer').button
                      }`}
                      style={{ 
                        backgroundColor: activePage === 'accepted-cmd-freelancer' ? `${COLORS.orders}20` : '',
                        borderColor: activePage === 'accepted-cmd-freelancer' ? COLORS.orders : '',
                        color: activePage === 'accepted-cmd-freelancer' ? COLORS.orders : ''
                      }}
                    >
                      <ICONS.trending size={16} style={{ color: getMenuItemStyle('accepted-cmd-freelancer').iconColor }} />
                      <span className={getMenuItemStyle('accepted-cmd-freelancer').text}>Commandes Acceptées</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('historique-commandes-freelancer', 'historique-commandes-freelancer')}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        getMenuItemStyle('historique-commandes-freelancer').button
                      }`}
                      style={{ 
                        backgroundColor: activePage === 'historique-commandes-freelancer' ? `${COLORS.orders}20` : '',
                        borderColor: activePage === 'historique-commandes-freelancer' ? COLORS.orders : '',
                        color: activePage === 'historique-commandes-freelancer' ? COLORS.orders : ''
                      }}
                    >
                      <ICONS.history size={16} style={{ color: getMenuItemStyle('historique-commandes-freelancer').iconColor }} />
                      <span className={getMenuItemStyle('historique-commandes-freelancer').text}>Historique</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Services avec sous-menu */}
            <li>
              <button 
                onClick={() => toggleSubmenu('services')} 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <div className="flex items-center gap-4">
                  <ICONS.services size={20} style={{ color: '#6B7280' }} />
                  <span>Services</span>
                </div>
                <span className="text-xs transition">{openSubmenu === 'services' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === 'services' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-4 space-y-1 border-l-2 border-cyan-200 dark:border-cyan-700 pl-4">
                  <li>
                    <button 
                      onClick={() => handleNavigation('services-list', 'services-list')}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        getMenuItemStyle('services-list').button
                      }`}
                      style={{ 
                        backgroundColor: activePage === 'services-list' ? `${COLORS.services}20` : '',
                        borderColor: activePage === 'services-list' ? COLORS.services : '',
                        color: activePage === 'services-list' ? COLORS.services : ''
                      }}
                    >
                      <ICONS.file size={16} style={{ color: getMenuItemStyle('services-list').iconColor }} />
                      <span className={getMenuItemStyle('services-list').text}>Gérer mes Services</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('publish-service', 'publish-service')}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                        getMenuItemStyle('publish-service').button
                      }`}
                      style={{ 
                        backgroundColor: activePage === 'publish-service' ? `${COLORS.services}20` : '',
                        borderColor: activePage === 'publish-service' ? COLORS.services : '',
                        color: activePage === 'publish-service' ? COLORS.services : ''
                      }}
                    >
                      <ICONS.services size={16} style={{ color: getMenuItemStyle('publish-service').iconColor }} />
                      <span className={getMenuItemStyle('publish-service').text}>Publier un Service</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Portefeuille */}
            <li>
              <button 
                onClick={() => handleNavigation('earnings', 'portefeuille-freelancer')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  getMenuItemStyle('earnings').button
                }`}
                style={{ 
                  backgroundColor: activePage === 'earnings' ? `${COLORS.earnings}20` : '',
                  borderColor: activePage === 'earnings' ? COLORS.earnings : '',
                  color: activePage === 'earnings' ? COLORS.earnings : ''
                }}
              >
                <ICONS.earnings size={20} style={{ color: getMenuItemStyle('earnings').iconColor }} />
                <span className={getMenuItemStyle('earnings').text}>Portefeuille</span>
              </button>
            </li>

            {/* Support */}
            <li>
              <button 
                onClick={() => handleNavigation('support', 'support-freelancer')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  getMenuItemStyle('support').button
                }`}
                style={{ 
                  backgroundColor: activePage === 'support' ? `${COLORS.support}20` : '',
                  borderColor: activePage === 'support' ? COLORS.support : '',
                  color: activePage === 'support' ? COLORS.support : ''
                }}
              >
                <ICONS.support size={20} style={{ color: getMenuItemStyle('support').iconColor }} />
                <span className={getMenuItemStyle('support').text}>Support</span>
              </button>
            </li>

            {/* Paramètres */}
            <li>
              <button 
                onClick={() => handleNavigation('settings', 'settings-freelancer')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  getMenuItemStyle('settings').button
                }`}
                style={{ 
                  backgroundColor: activePage === 'settings' ? `${COLORS.settings}20` : '',
                  borderColor: activePage === 'settings' ? COLORS.settings : '',
                  color: activePage === 'settings' ? COLORS.settings : ''
                }}
              >
                <ICONS.settings size={20} style={{ color: getMenuItemStyle('settings').iconColor }} />
                <span className={getMenuItemStyle('settings').text}>Paramètres</span>
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
                    onClick={() => { handleNavigation('profile', 'profile'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white"
                  >
                    <ICONS.profile size={16} />
                    Mon Profil
                  </button>
                  <button 
                    onClick={() => { handleNavigation('settings', 'settings-freelancer'); setShowProfileMenu(false); }}
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

        {/* Contenu principal - MAINTENANT TOUJOURS OUTLET */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f0fdf4]'}`}>
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