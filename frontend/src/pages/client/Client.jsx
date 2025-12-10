// src/pages/client/client.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sun, Moon, User, Briefcase, HelpCircle, DollarSign, 
  Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, 
  History, TrendingUp, FileText, Users, MapPin, Filter, RefreshCw, X, LogOut,
  Plus, CreditCard
} from 'lucide-react';
import { ClientProvider, ClientContext } from './clientContext';
import { logoutUser } from '../../services/authService';
import { useLogout } from '../../services/useLogout';
import logoCleanix from '../../imgs/logoCleanix.png';

// Constants Icons
const ICONS = {
  dashboard: Home,
  request: Plus,
  bookings: Package,
  history: History,
  wallet: CreditCard,
  support: HelpCircle,
  profile: User,
  earnings: DollarSign,
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
  chevronDown: '▼',
  chevronUp: '▲',
};

// Couleurs pour les icônes (indépendant du mode)
const ACCENT_COLORS = { 
  primary: '#0891b2', // Cyan pour le client
  request: '#10B981',
  bookings: '#8B5CF6', 
  history: '#06B6D4',
  wallet: '#10B981',
  earnings: '#10B981',
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
    isOnline,
    setIsOnline,
    user,
    wallet,
    bookings,
    pendingOrders,
    rating
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
    else if (path.includes('request-service')) setActivePage('request-service');
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
    return null;
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('clientDarkMode', JSON.stringify(newDarkMode));
  };
  
  const handleLogout = async () => {
    try {
      await secureLogout();
    } catch (error) {
      console.error('Logout failed:', error);
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
    if (path) {
      navigate(path);
    } else if (page === 'request-service') {
      navigate('/client/dashboard/request-service');
    }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" />
      )}
      
      {/* --- SIDEBAR --- */}
      <aside 
        ref={sidebarRef}
        className={`fixed md:relative z-40 h-screen transition-transform duration-300 ease-in-out flex flex-col w-72 
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${glassClasses}`}
      >

        {/* Header Sidebar */}
        <div className={`flex flex-col items-center justify-center py-8 px-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-slate-200/50'} relative`}>
          <button 
            onClick={() => setIsSidebarVisible(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-cyan-600 md:hidden"
          >
            <ICONS.close size={20} />
          </button>
          
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/30">
              {(user?.prenom || user?.name)?.charAt(0) || 'C'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
          
          <div className="text-center">
            <Link to="profile-client" className="group inline-block">
              <p className={`font-semibold text-lg transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {`${user?.prenom || ''} ${user?.nom || 'Client'}`.trim()}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ICONS.star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {rating}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin">
          <ul className="space-y-2">
            
            {/* Items Simples */}
            {[
              { id: 'dashboard-client', label: 'Tableau de Bord', icon: ICONS.dashboard, path: '/client/dashboard/dashboard-client' },
              { id: 'request-service', label: 'Demander un Service', icon: ICONS.request, path: '/client/dashboard/request-service' },
            ].map((item) => {
              const style = getMenuItemStyle(item.id);
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => handleNavigation(item.id, item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${style.className}`}
                    style={style.style}
                  >
                    <item.icon size={20} style={{ color: style.iconColor }} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            {/* Menu Déroulant Réservations */}
            <li>
              <button 
                onClick={() => toggleSubmenu('bookings')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-600 hover:bg-white/60'}`}
              >
                <div className="flex items-center gap-4">
                  <ICONS.bookings size={20} style={{ color: isDarkMode ? '#9CA3AF' : '#64748b' }} />
                  <span>Mes Réservations</span>
                  {pendingOrders > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {pendingOrders}
                    </span>
                  )}
                </div>
                <span className="text-xs">{openSubmenu === 'bookings' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === 'bookings' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className={`ml-4 space-y-1 border-l-2 pl-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-300'}`}>
                  {[
                    { id: 'my-bookings', label: 'Réservations Actives', icon: ICONS.clock, path: '/client/dashboard/my-bookings' },
                    { id: 'booking-history', label: 'Historique', icon: ICONS.history, path: '/client/dashboard/booking-history' },
                  ].map(sub => {
                    const style = getMenuItemStyle(sub.id);
                    return (
                      <li key={sub.id}>
                        <button 
                          onClick={() => handleNavigation(sub.id, sub.path)}
                          className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${style.className}`}
                          style={style.style}
                        >
                          <sub.icon size={16} style={{ color: style.iconColor }} />
                          <span>{sub.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>

            {/* Autres Items */}
            {[
              { id: 'wallet-client', label: 'Portefeuille', icon: ICONS.wallet, path: '/client/dashboard/wallet-client' },
              { id: 'support-client', label: 'Support', icon: ICONS.support, path: '/client/dashboard/support-client' },
              { id: 'profile-client', label: 'Profil', icon: ICONS.profile, path: '/client/dashboard/profile-client' },
              { id: 'settings-client', label: 'Paramètres', icon: ICONS.settings, path: '/client/dashboard/settings-client' },
            ].map((item) => {
              const style = getMenuItemStyle(item.id);
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => handleNavigation(item.id, item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${style.className}`}
                    style={style.style}
                  >
                    <item.icon size={20} style={{ color: style.iconColor }} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200/50'}`}>
          <button 
            onClick={handleLogout}
            className="text-red-500 font-bold hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-all w-full"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-4 md:px-6 z-20 border-b ${glassClasses} ${isDarkMode ? '' : 'border-white/40'}`}>
          
          <div className="flex items-center gap-3 flex-1 md:flex-none">
            <button onClick={() => setIsSidebarVisible(true)} className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 p-2 md:hidden">
              <ICONS.menu size={24} />
            </button>
            {/* Logo */}
            <img src={logoCleanix} alt="Cleanix" className="w-8 h-8 rounded-md hidden sm:block" />
            <span className="text-lg md:text-xl font-extrabold" style={{ color: ACCENT_COLORS.primary }}>Cleanix</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Toggle Mode */}
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white/60 text-slate-600'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(s => !s)} 
                className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white/60 text-slate-600'}`}
              >
                <ICONS.notifications size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center border-2 border-slate-50 dark:border-gray-800">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-xl border p-4 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/90 backdrop-blur-xl border-slate-200'
                }`}>
                  <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-gray-500 text-center py-2">Aucune nouvelle notification</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2 border-b text-sm cursor-pointer transition-colors ${
                          isDarkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-300' : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                        } ${!n.read ? 'font-semibold' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <p>{n.message}</p>
                        <span className="text-xs opacity-75">{n.date}</span>
                      </div>
                    ))
                  )}
                  <button 
                    onClick={markAllAsRead} 
                    className="text-center w-full mt-2 text-sm text-cyan-600 hover:underline"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`group relative flex items-center gap-2 p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/60'}`}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-sm">
                    {user?.prenom?.charAt(0) || user?.name?.charAt(0) || 'C'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <span className="hidden md:block text-sm font-medium dark:text-white">{`${user?.prenom || ''} ${user?.nom || 'Client'}`.trim()}</span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-2 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <Link 
                    to="profile-client"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white block"
                  >
                    <ICONS.profile size={16} />
                    Mon Profil
                  </Link>
                  <Link 
                    to="settings-client"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white block"
                  >
                    <ICONS.settings size={16} />
                    Paramètres
                  </Link>
                  <div className="border-t my-1 dark:border-gray-700"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-3"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6`}>
          <Outlet context={{ isDarkMode }} />
        </main>
      </div>
    </div>
  );
}

export default function ClientPage() {
  return (
    <ClientProvider>
      <InnerLayout />
    </ClientProvider>
  );
}