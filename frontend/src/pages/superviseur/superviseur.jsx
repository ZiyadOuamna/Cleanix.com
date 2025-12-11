// src/pages/superviseur/superviseur.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sun, Moon, User, Briefcase, HelpCircle, DollarSign, 
  Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, 
  History, TrendingUp, FileText, Users, MapPin, Filter, RefreshCw, X, LogOut, Shield
} from 'lucide-react';
import { SuperviseurProvider, SuperviseurContext } from './superviseurContext';
import { logoutUser } from '../../services/authService';
import logoCleanix from '../../imgs/logoCleanix.png';

// Constants Icons
const ICONS = {
  dashboard: Home,
  users: Users,
  briefcase: Briefcase,
  verification: Shield,
  profile: User,
  remboursement: DollarSign,
  reclamations: MessageCircle,
  settings: Settings,
  notifications: Bell,
  menu: Menu,
  clock: Clock,
  star: Star,
  trending: TrendingUp,
  file: FileText,
  filter: Filter,
  refresh: RefreshCw,
  close: X,
};

const STRING_ICONS = {
  chevronDown: '▼',
  chevronUp: '▲',
};

// Couleurs fixes pour les icônes (bleu sombre pour superviseur)
const ACCENT_COLORS = { 
  primary: '#1e3a8a',  // Bleu sombre
  users: '#2563eb',     // Bleu
  dashboard: '#1e40af', // Bleu foncé
  verification: '#3b82f6', // Bleu clair
  remboursement: '#10b981', // Vert
  reclamations: '#f59e0b', // Amber
  settings: '#64748b'   // Gris
};

function InnerLayout() { 
  // Déclarer tous les hooks en premier
  const [activePage, setActivePage] = useState('dashboard-clients');
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
  
  // Consommer l'état partagé du contexte
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isDarkMode, 
    setIsDarkMode,
    user
  } = useContext(SuperviseurContext);

  // Vérifier l'authentification au montage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type');

    if (!token || userType !== 'Superviseur') {
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
    if (path.includes('dashboard-clients')) setActivePage('dashboard-clients');
    else if (path.includes('dashboard-freelancers')) setActivePage('dashboard-freelancers');
    else if (path.includes('gestion-clients')) setActivePage('gestion-clients');
    else if (path.includes('gestion-freelancers')) setActivePage('gestion-freelancers');
    else if (path.includes('superviseur-verification')) setActivePage('superviseur-verification');
    else if (path.includes('validation-services')) setActivePage('validation-services');
    else if (path.includes('gestion-rembourssements')) setActivePage('gestion-rembourssements');
    else if (path.includes('gestion-reclamations')) setActivePage('gestion-reclamations');
    else if (path.includes('settings-superviseur')) setActivePage('settings-superviseur');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
    localStorage.setItem('superviseurDarkMode', JSON.stringify(newDarkMode));
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login', { replace: true });
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
    }
  };

  // --- CONFIGURATION DU DESIGN "SOFT GRADIENT" ---
  const containerClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 text-slate-700';

  const glassClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/70 backdrop-blur-xl border-white/50 border-r shadow-sm';

  const getMenuItemStyle = (pageName) => {
    const isActive = activePage === pageName;
    const colorMap = {
      'dashboard-clients': ACCENT_COLORS.dashboard,
      'dashboard-freelancers': ACCENT_COLORS.dashboard,
      'gestion-clients': ACCENT_COLORS.users,
      'gestion-freelancers': ACCENT_COLORS.users,
      'superviseur-verification': ACCENT_COLORS.verification,
      'gestion-rembourssements': ACCENT_COLORS.remboursement,
      'gestion-reclamations': ACCENT_COLORS.reclamations,
      'settings-superviseur': ACCENT_COLORS.settings,
    };
    const color = colorMap[pageName] || ACCENT_COLORS.primary;
    
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
            className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 md:hidden"
          >
            <ICONS.close size={20} />
          </button>
          
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/30">
              {(user?.prenom || user?.name)?.charAt(0) || 'S'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} bg-blue-500`} />
          </div>
          
          <div className="text-center">
            <Link to="/superviseur/dashboard" className="group inline-block">
              <p className={`font-semibold text-lg transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {`${user?.prenom || ''} ${user?.nom || 'Superviseur'}`.trim()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Administrateur
              </p>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin">
          <ul className="space-y-2">
            
            {/* Items Simples */}
            {[
              { id: 'gestion-rembourssements', label: 'Remboursements', icon: ICONS.remboursement, path: 'gestion-rembourssements' },
              { id: 'gestion-reclamations', label: 'Réclamations', icon: ICONS.reclamations, path: 'gestion-reclamations' },
              { id: 'settings-superviseur', label: 'Paramètres', icon: ICONS.settings, path: 'settings-superviseur' },
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

            {/* Menu Déroulant Dashboard */}
            <li>
              <button 
                onClick={() => toggleSubmenu('dashboard')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-600 hover:bg-white/60'}`}
              >
                <div className="flex items-center gap-4">
                  <ICONS.dashboard size={20} style={{ color: isDarkMode ? '#9CA3AF' : '#64748b' }} />
                  <span>Dashboard</span>
                </div>
                <span className="text-xs">{openSubmenu === 'dashboard' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === 'dashboard' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className={`ml-4 space-y-1 border-l-2 pl-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-300'}`}>
                  {[
                    { id: 'dashboard-clients', label: 'Clients', icon: ICONS.users, path: 'dashboard-clients' },
                    { id: 'dashboard-freelancers', label: 'Freelancers', icon: ICONS.briefcase, path: 'dashboard-freelancers' },
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

            {/* Menu Déroulant Gestion */}
            <li>
              <button 
                onClick={() => toggleSubmenu('gestion')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-600 hover:bg-white/60'}`}
              >
                <div className="flex items-center gap-4">
                  <ICONS.users size={20} style={{ color: isDarkMode ? '#9CA3AF' : '#64748b' }} />
                  <span>Gestion Utilisateurs</span>
                </div>
                <span className="text-xs">{openSubmenu === 'gestion' ? STRING_ICONS.chevronUp : STRING_ICONS.chevronDown}</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === 'gestion' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className={`ml-4 space-y-1 border-l-2 pl-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-300'}`}>
                  {[
                    { id: 'gestion-clients', label: 'Clients', icon: ICONS.users, path: 'gestion-clients' },
                    { id: 'gestion-freelancers', label: 'Freelancers', icon: ICONS.briefcase, path: 'gestion-freelancers' },
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

            {/* Vérification Freelancers */}
            <li>
              <button 
                onClick={() => handleNavigation('superviseur-verification', 'superviseur-verification')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${getMenuItemStyle('superviseur-verification').className}`}
                style={getMenuItemStyle('superviseur-verification').style}
              >
                <ICONS.verification size={20} style={{ color: getMenuItemStyle('superviseur-verification').iconColor }} />
                <span>Vérification Freelancers</span>
              </button>
            </li>

            {/* Validation Services */}
            <li>
              <button 
                onClick={() => handleNavigation('validation-services', 'validation-services')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${getMenuItemStyle('validation-services').className}`}
                style={getMenuItemStyle('validation-services').style}
              >
                <ICONS.briefcase size={20} style={{ color: getMenuItemStyle('validation-services').iconColor }} />
                <span>Validation Services</span>
              </button>
            </li>

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
            <button onClick={() => setIsSidebarVisible(true)} className="text-slate-500 hover:text-blue-600 dark:text-gray-400 p-2 md:hidden">
              <ICONS.menu size={24} />
            </button>
            {/* Logo */}
            <img src={logoCleanix} alt="Cleanix" className="w-8 h-8 rounded-md hidden sm:block" />
            <span className="text-lg md:text-xl font-semibold tracking-wide" style={{ color: ACCENT_COLORS.primary }}>Cleanix</span>
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
                    className="text-center w-full mt-2 text-sm text-blue-600 hover:underline"
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
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-sm">
                    {user?.prenom?.charAt(0) || user?.name?.charAt(0) || 'S'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} bg-blue-500`} />
                </div>
                <span className="hidden md:block text-sm font-medium dark:text-white">{`${user?.prenom || ''} ${user?.nom || 'Superviseur'}`.trim()}</span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-2 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <Link 
                    to="/superviseur/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 dark:text-white block"
                  >
                    <ICONS.profile size={16} />
                    Mon Profil
                  </Link>
                  <Link 
                    to="/superviseur/dashboard/settings-superviseur"
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

export default function SuperviseurPage() {
  return (
    <SuperviseurProvider>
      <InnerLayout />
    </SuperviseurProvider>
  );
}
