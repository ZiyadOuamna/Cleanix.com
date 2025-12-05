// src/pages/SuperviseurPage.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { ChevronRight, X, Sun, Moon, User, Briefcase, HelpCircle, DollarSign, Users, BarChart3, Phone, Settings, Bell, Menu, LogOut } from 'lucide-react';
import { SuperviseurProvider, SuperviseurContext } from './superviseurContext';
import { logoutUser } from '../../services/authService';

// constants (icons/colors trimmed to essentials)
const ICONS = {
  remboursement: <DollarSign size={16} />,
  users: <Users size={16} />,
  dashboard: <BarChart3 size={16} />,
  reclamations: <Phone size={16} />,
  settings: <Settings size={16} />,
  notifications: <Bell size={16} />,
  menuOpen: '➤',
  menuClose: '◀',
  chevronRight: <ChevronRight size={14} />,
  chevronDown: '▼',
  chevronUp: '▲',
  clients: <User size={16} />,
  freelancers: <Briefcase size={16} />,
  support: <HelpCircle size={16} />,
  menu: <Menu size={20} />,
};
const COLORS = { primary: '#2d2c86', background: '#f0fafe' };

// cette fonction représente le contenu principal de la page superviseur
function InnerLayout() { 
  
  const [activePage, setActivePage] = useState('');
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Vérifier l'authentification au montage du composant
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

  // consume shared state (for header / sidebar controls)
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isMenuOpen, setIsMenuOpen,
    isDarkMode, setIsDarkMode,
  } = useContext(SuperviseurContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, redirect to login
      navigate('/login');
    }
  };

  // Conditional check AFTER all hooks are declared
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      {/* SIDEBAR (responsive: overlay on mobile, push on desktop) */}
      <aside className={`fixed md:relative z-40 h-screen shadow-2xl transition-transform md:transition-none duration-300 ease-in-out flex flex-col ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} w-72 md:w-72 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isSidebarVisible ? 'md:translate-x-0' : 'md:-translate-x-full'}`}>
        <div className={`h-20 flex items-center justify-between px-6 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <span className="text-2xl font-extrabold" style={{ color: COLORS.primary }}>Cleanix</span>
          <button onClick={() => setIsSidebarVisible(false)} className="text-gray-400 hover:text-blue-600 md:hidden">
            {ICONS.menuClose}
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* Dashboard avec sous-menu */}
            <li>
              <button 
                onClick={() => { 
                  setIsDashboardOpen(!isDashboardOpen); 
                  setIsUsersOpen(false); // Fermer l'autre sous-menu
                }} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}
              >
                <div className="flex items-center gap-4">
                  {ICONS.dashboard}
                  <span>Dashboard</span>
                </div>
                <span className="text-xs transition">{isDashboardOpen ? ICONS.chevronUp : ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDashboardOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-6 space-y-1">
                  <li>
                    <button 
                      onClick={() => { navigate('dashboard-clients'); setActivePage('dashboard-clients'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'dashboard-clients' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.clients}
                      <span>Dashboard Clients</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('dashboard-freelancers'); setActivePage('dashboard-freelancer'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'dashboard-freelancer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.freelancers}
                      <span>Dashboard Freelancer</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('dashboard-support'); setActivePage('dashboard-support'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'dashboard-support' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.support}
                      <span>Dashboard Support</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Gestion Users avec sous-menu */}
            <li>
              <button 
                onClick={() => { 
                  setIsUsersOpen(!isUsersOpen); 
                  setIsDashboardOpen(false); // Fermer l'autre sous-menu
                }} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}
              >
                <div className="flex items-center gap-4">
                  {ICONS.users}
                  <span>Gestion Users</span>
                </div>
                <span className="text-xs transition">{isUsersOpen ? ICONS.chevronUp : ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isUsersOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-6 space-y-1">
                  <li>
                    <button 
                      onClick={() => { navigate('gestion-clients'); setActivePage('gestion-clients'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'gestion-clients' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.clients}
                      <span>Gestion Clients</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('gestion-freelancers'); setActivePage('gestion-freelancers'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'gestion-freelancers' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.freelancers}
                      <span>Gestion Freelancers</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('gestion-support'); setActivePage('gestion-support'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${activePage === 'gestion-support' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ICONS.support}
                      <span>Gestion Support</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <button onClick={() => { navigate('gestion-rembourssements'); setIsSidebarVisible(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}>
                {ICONS.remboursement}<span>Remboursement</span>
              </button>
            </li>

            <li>
              <button onClick={() => { navigate('gestion-reclamations'); setIsSidebarVisible(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}>
                {ICONS.reclamations}<span>Réclamations</span>
              </button>
            </li>
              
            <li>
              <button onClick={() => { navigate('settings-superviseur'); setIsSidebarVisible(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}>
                {ICONS.settings}<span>Paramètres</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="text-center">
            <button 
              onClick={handleLogout}
              className="text-red-500 font-bold hover:opacity-80 transition-all flex items-center justify-center gap-2 w-full"
              style={{ textShadow: '3px 3px 6px rgba(255, 0, 0, 0.8)' }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN (responsive: margin on desktop when sidebar open) */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isSidebarVisible ? 'md:ml-72' : 'md:ml-0'}`}>
        <header className={`h-20 flex items-center justify-between px-8 z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
          <button onClick={() => setIsSidebarVisible(true)} className="text-gray-600 hover:text-blue-600 md:hidden">
            {ICONS.menu}
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => toggleDarkMode()} className="p-1 rounded-full border-2 hover:bg-gray-500">
              {isDarkMode ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
            </button>


            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(s => !s)} className="relative p-2 rounded-full border-2 ${isDarkMode} hover:bg-gray-500">
                {ICONS.notifications}
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                  <h3 className="font-bold mb-2 text-gray-800">Notifications</h3>
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 border-b text-sm hover:bg-gray-50 cursor-pointer text-gray-600" onClick={() => markAsRead(n.id)}>
                      <p className={!n.read ? 'font-semibold' : ''}>{n.message}</p>
                      <span className="text-xs text-gray-400">{n.date}</span>
                    </div>
                  ))}
                  <button onClick={markAllAsRead} className="text-center w-full mt-2 text-sm text-blue-600 hover:underline">Tout lire</button>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* lmain c'est le contenu dynamique qui va s'affiche  si en clique sur une partie de menu  par exemple : settings */}
        <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f0fafe]'}`}>
            
          {/* Outlet: chaque page (separate files) s'affichera ici */}
          <Outlet context={ isDarkMode } /> {/* le context isDarkMode pour que les enfants dnas cette page utilise aussi la fct darkmode */}
        </main>
      </div>
    </div>
  );
}

// Export the provider-wrapped layout to use in routes
export default function SuperviseurPage() {
  return (
    <SuperviseurProvider>
      <InnerLayout />
    </SuperviseurProvider>
  );
}
