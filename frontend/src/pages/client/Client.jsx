import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sun, Moon, User, Briefcase, HelpCircle, DollarSign, 
  Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, 
  MapPin, Filter, RefreshCw, X, LogOut, CreditCard, History, Plus
} from 'lucide-react';
import { ClientProvider, ClientContext } from './clientContext';
import RequestService from './requestService';
import { logoutUser } from '../../services/authService';
import { useLogout } from '../../services/useLogout';

// Constants Icons
const ICONS = {
  dashboard: Home,
  request: Plus,
  bookings: Package,
  history: History,
  wallet: CreditCard,
  support: HelpCircle,
  profile: User,
  notifications: Bell,
  settings: Settings,
  menu: Menu,
  clock: Clock,
  star: Star,
  message: MessageCircle,
  location: MapPin,
  filter: Filter,
  refresh: RefreshCw,
  close: X,
};

const STRING_ICONS = {
  chevronDown: '▼',
  chevronUp: '▲',
};

// Couleurs pour les icônes (indépendant du mode)
const ACCENT_COLORS = { 
  primary: '#0891b2',
  request: '#10B981',
  bookings: '#8B5CF6', 
  history: '#06B6D4',
  wallet: '#10B981',
  support: '#F59E0B',
  settings: '#64748b' 
};

function InnerLayout() { 
  // Déclarer tous les hooks en premier
  const [activePage, setActivePage] = useState('request-service');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestService, setShowRequestService] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);
  const { logout: secureLogout } = useLogout();
  
  // Consommer l'état partagé du contexte
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isDarkMode, 
    setIsDarkMode,
    user,
    wallet,
    bookings
  } = useContext(ClientContext);

  // Vérifier l'authentification au montage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type');

    if (!token || userType !== 'Client') {
      navigate('/login');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  // Synchronisation page active
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('my-bookings')) setActivePage('my-bookings');
    else if (path.includes('dashboard-client')) setActivePage('dashboard-client');
    else if (path.includes('profile-client')) setActivePage('profile-client');
    else if (path.includes('booking-history')) setActivePage('booking-history');
    else if (path.includes('wallet-client')) setActivePage('wallet-client');
    else if (path.includes('settings-client')) setActivePage('settings-client');
    else if (path.includes('support-client')) setActivePage('support-client');
    else if (path === '/dev-client-page' || path === '/dev-client-page/') setActivePage('request-service');
  }, [location.pathname]);

  // Click outside
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

  const unreadCount = notifications.filter(n => !n.read).length;

  // Conditional return AFTER all hooks are declared
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirection déjà gérée dans useEffect
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme_mode', JSON.stringify(newDarkMode));
  };
  
  const handleLogout = async () => {
    try {
      // Utiliser la fonction de logout sécurisée avec cache-busting
      await secureLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Même en cas d'erreur, nettoyer et rediriger
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      navigate('/login', { replace: true });
    }
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleNavigation = (page, path = null) => {
    setActivePage(page);
    setIsSidebarVisible(false);
    setShowRequestService(false);
    if (path) navigate(path);
    else if (page === 'request-service') setActivePage('request-service');
  };

  // --- CONFIGURATION DU DESIGN "SOFT GRADIENT" ---
  const containerClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-slate-100 via-cyan-50 to-slate-200 text-slate-700';

  const glassClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/70 backdrop-blur-xl border-white/50 border-r shadow-sm';

  const getMenuItemStyle = (pageName) => {
    const isActive = activePage === pageName;
    const colorMap = {
      'request-service': ACCENT_COLORS.request,
      'bookings': ACCENT_COLORS.bookings,
      'my-bookings': ACCENT_COLORS.bookings,
      'dashboard-client': ACCENT_COLORS.primary,
      'booking-history': ACCENT_COLORS.history,
      'wallet-client': ACCENT_COLORS.wallet,
      'support-client': ACCENT_COLORS.support,
      'settings-client': ACCENT_COLORS.settings,
      'profile-client': ACCENT_COLORS.settings
    };
    const color = colorMap[pageName] || ACCENT_COLORS.settings;
    
    if (isActive) {
      return {
        className: isDarkMode 
          ? `bg-gray-700 text-white border-l-4 font-semibold`
          : `bg-white shadow-sm text-slate-800 border-l-4 font-semibold`,
        style: { borderColor: color },
        iconColor: color
      };
    }
    
    return {
      className: isDarkMode 
        ? `text-gray-400 hover:bg-gray-700` 
        : `text-slate-600 hover:bg-white/60 hover:text-slate-900`,
      style: {},
      iconColor: isDarkMode ? '#9CA3AF' : '#64748b',
    };
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${containerClasses}`}>
      
      {/* Overlay Mobile */}
      {isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed md:relative z-40 h-screen flex flex-col transition-transform duration-300 ${glassClasses} w-72 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header Sidebar avec Photo de Profil */}
        <div className={`flex flex-col items-center justify-center py-8 px-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-slate-200/50'} relative`}>
          <button 
            onClick={() => setIsSidebarVisible(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-cyan-600 md:hidden"
          >
            <ICONS.close size={20} />
          </button>
          
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/30">
              {user?.name?.charAt(0) || 'C'}
            </div>
          </div>
          
          <div className="text-center">
            <Link to="profile-client" className="group inline-block hover:opacity-80 transition">
              <p className={`font-semibold text-lg transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {user?.name || 'Client'}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ICONS.star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  4.8/5
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
          {/* Demander un Service - Premier Item */}
          <button
            onClick={() => handleNavigation('request-service')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('request-service').className}`}
            style={getMenuItemStyle('request-service').style}
          >
            {ICONS.request && <ICONS.request size={20} color={getMenuItemStyle('request-service').iconColor} />}
            <span>Demander un Service</span>
          </button>

          {/* Mes Réservations */}
          <button
            onClick={() => handleNavigation('my-bookings', 'my-bookings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('my-bookings').className}`}
            style={getMenuItemStyle('my-bookings').style}
          >
            {ICONS.bookings && <ICONS.bookings size={20} color={getMenuItemStyle('my-bookings').iconColor} />}
            <span>Mes Réservations</span>
          </button>

          {/* Dashboard */}
          <button
            onClick={() => handleNavigation('dashboard-client', 'dashboard-client')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('dashboard-client').className}`}
            style={getMenuItemStyle('dashboard-client').style}
          >
            {ICONS.dashboard && <ICONS.dashboard size={20} color={getMenuItemStyle('dashboard-client').iconColor} />}
            <span>Tableau de Bord</span>
          </button>

          {/* Historique */}
          <button
            onClick={() => handleNavigation('booking-history', 'booking-history')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('booking-history').className}`}
            style={getMenuItemStyle('booking-history').style}
          >
            {ICONS.history && <ICONS.history size={20} color={getMenuItemStyle('booking-history').iconColor} />}
            <span>Historique</span>
          </button>

          {/* Portefeuille */}
          <button
            onClick={() => handleNavigation('wallet-client', 'wallet-client')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('wallet-client').className}`}
            style={getMenuItemStyle('wallet-client').style}
          >
            {ICONS.wallet && <ICONS.wallet size={20} color={getMenuItemStyle('wallet-client').iconColor} />}
            <span>Portefeuille</span>
          </button>

          {/* Support */}
          <button
            onClick={() => handleNavigation('support-client', 'support-client')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('support-client').className}`}
            style={getMenuItemStyle('support-client').style}
          >
            {ICONS.support && <ICONS.support size={20} color={getMenuItemStyle('support-client').iconColor} />}
            <span>Support</span>
          </button>

          {/* Profil */}
          <button
            onClick={() => handleNavigation('profile-client', 'profile-client')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('profile-client').className}`}
            style={getMenuItemStyle('profile-client').style}
          >
            {ICONS.profile && <ICONS.profile size={20} color={getMenuItemStyle('profile-client').iconColor} />}
            <span>Profil</span>
          </button>

          {/* Paramètres */}
          <button
            onClick={() => handleNavigation('settings-client', 'settings-client')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${getMenuItemStyle('settings-client').className}`}
            style={getMenuItemStyle('settings-client').style}
          >
            {ICONS.settings && <ICONS.settings size={20} color={getMenuItemStyle('settings-client').iconColor} />}
            <span>Paramètres</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isDarkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${glassClasses} h-20 border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className={`p-2 rounded-lg transition-all md:hidden ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/60'}`}
            >
              {ICONS.menu && <ICONS.menu size={24} />}
            </button>
            <h1 className="hidden md:block text-xl font-semibold">Tableau de bord Client</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white/60 text-gray-600'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-all relative ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/60'}`}
              >
                {ICONS.notifications && <ICONS.notifications size={20} />}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-2xl z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}`}>
                  <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-slate-200'}`}>
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-cyan-600 hover:underline">
                        Marquer tout comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Aucune notification</div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b cursor-pointer transition-all ${notif.read ? 'opacity-60' : ''} ${isDarkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-slate-50 border-slate-200'}`}
                        >
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{notif.date}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/60'}`}
              >
                <span className="text-2xl">{user.avatar || '👤'}</span>
                <span className="hidden md:block text-sm font-medium">{user.name?.split(' ')[0]}</span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-2xl z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}`}>
                  <Link to="profile-client" className={`block px-4 py-3 border-b text-sm ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                    Mon Profil
                  </Link>
                  <Link to="/settings-client" className={`block px-4 py-3 border-b text-sm ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                    Paramètres
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-3 text-sm text-red-600 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'request-service' || showRequestService ? (
            <RequestService onBack={() => {
              setShowRequestService(false);
              setActivePage('request-service');
            }} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Client() {
  return (
    <ClientProvider>
      <InnerLayout />
    </ClientProvider>
  );
}
