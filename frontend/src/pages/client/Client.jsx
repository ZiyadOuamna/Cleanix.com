// src/pages/ClientPage.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { ChevronRight, X, Sun, Moon, User, ShoppingCart, HelpCircle, DollarSign, Home, Clock, Star, MessageCircle, Settings, Bell, Menu, Package, History, Wallet } from 'lucide-react';
import { ClientProvider, ClientContext } from './clientContext';

// Constants
const ICONS = {
  dashboard: <Home size={16} />,
  orders: <ShoppingCart size={16} />,
  services: <Package size={16} />,
  support: <HelpCircle size={16} />,
  profile: <User size={16} />,
  wallet: <Wallet size={16} />,
  history: <History size={16} />,
  notifications: <Bell size={16} />,
  settings: <Settings size={16} />,
  menuOpen: '➤',
  menuClose: '◀',
  chevronRight: <ChevronRight size={14} />,
  chevronDown: '▼',
  chevronUp: '▲',
  menu: <Menu size={20} />,
  clock: <Clock size={16} />,
  star: <Star size={16} />,
  message: <MessageCircle size={16} />,
};

const COLORS = { primary: '#2563eb', background: '#f8fafc' };

// Layout principal de la page client
function InnerLayout() { 
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  
  // Consommer l'état partagé
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isMenuOpen, setIsMenuOpen,
    isDarkMode, setIsDarkMode,
    user,
    walletBalance,
    activeOrders
  } = useContext(ClientContext);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // États pour les sous-menus
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  // État pour la visibilité de la sidebar
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  // État local pour les notifications
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f8fafc] text-gray-800'}`}>
      {/* SIDEBAR */}
      <aside className={`fixed md:relative z-40 h-screen shadow-2xl transition-transform md:transition-none duration-300 ease-in-out flex flex-col ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} w-72 md:w-72 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isSidebarVisible ? 'md:translate-x-0' : 'md:-translate-x-full'}`}>
        
        {/* Header Sidebar */}
        <div className={`h-20 flex items-center justify-between px-6 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <span className="text-2xl font-extrabold" style={{ color: COLORS.primary }}>Cleanix</span>
          <button onClick={() => setIsSidebarVisible(false)} className="text-gray-400 hover:text-blue-600 md:hidden">
            {ICONS.menuClose}
          </button>
        </div>

        {/* Carte utilisateur */}
        <div className={`px-6 py-4 mx-4 mb-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name || 'Utilisateur'}</p>
              <p className="text-sm opacity-75 truncate">{user?.membership || 'Client Standard'}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div>
              <p className="text-sm opacity-75">Solde</p>
              <p className="font-bold text-lg">{walletBalance}€</p>
            </div>
            <button 
              onClick={() => { navigate('wallet'); setActivePage('wallet'); }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Recharger
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* Tableau de Bord */}
            <li>
              <button 
                onClick={() => { navigate('dashboard'); setActivePage('dashboard'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {ICONS.dashboard}
                <span>Tableau de Bord</span>
              </button>
            </li>

            {/* Commandes avec sous-menu */}
            <li>
              <button 
                onClick={() => setIsOrdersOpen(!isOrdersOpen)} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50`}
              >
                <div className="flex items-center gap-4">
                  {ICONS.orders}
                  <span>Mes Commandes</span>
                  {activeOrders > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeOrders}
                    </span>
                  )}
                </div>
                <span className="text-xs transition">{isOrdersOpen ? ICONS.chevronUp : ICONS.chevronDown}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOrdersOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-6 space-y-1">
                  <li>
                    <button 
                      onClick={() => { navigate('orders-active'); setActivePage('orders-active'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${
                        activePage === 'orders-active' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {ICONS.clock}
                      <span>Commandes Actives</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate('orders-history'); setActivePage('orders-history'); setIsSidebarVisible(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all ${
                        activePage === 'orders-history' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {ICONS.history}
                      <span>Historique</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>

            {/* Services */}
            <li>
              <button 
                onClick={() => { navigate('services'); setActivePage('services'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'services' 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {ICONS.services}
                <span>Services</span>
              </button>
            </li>

            {/* Support */}
            <li>
              <button 
                onClick={() => { navigate('support'); setActivePage('support'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'support' 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {ICONS.support}
                <span>Support</span>
              </button>
            </li>

            {/* Portefeuille */}
            <li>
              <button 
                onClick={() => { navigate('wallet'); setActivePage('wallet'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'wallet' 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {ICONS.wallet}
                <span>Mon Portefeuille</span>
              </button>
            </li>

            {/* Paramètres */}
            <li>
              <button 
                onClick={() => { navigate('settings'); setActivePage('settings'); setIsSidebarVisible(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  activePage === 'settings' 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {ICONS.settings}
                <span>Paramètres</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="text-center">
            <button 
              onClick={() => { /* Logique de déconnexion */ setIsSidebarVisible(false); }} 
              className="text-red-500 font-bold hover:opacity-80 transition-all"
              style={{ textShadow: '3px 3px 6px rgba(255, 0, 0, 0.8)' }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isSidebarVisible ? 'md:ml-72' : 'md:ml-0'}`}>
        
        {/* Header */}
        <header className={`h-20 flex items-center justify-between px-8 z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
          
          {/* Bouton menu mobile */}
          <button onClick={() => setIsSidebarVisible(true)} className="text-gray-600 hover:text-blue-600 md:hidden">
            {ICONS.menu}
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un service..."
                className={`w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Actions header */}
          <div className="flex items-center gap-4">
            {/* Bouton nouvelle commande */}
            <button 
              onClick={() => { navigate('services'); setActivePage('services'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nouvelle Commande
            </button>

            {/* Mode sombre . */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full border-2 hover:bg-gray-500">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(s => !s)} className={`relative p-2 rounded-full border-2 hover:bg-gray-500`}>
                {ICONS.notifications}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border p-4 z-50 ${
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
                    className="text-center w-full mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
              )}
            </div>
            {/* Mon Profile Client 
            <button onClick={() => {navigate('client-profile')}} className="p-2 rounded-full border-2 hover:bg-gray-500">
                <User size={18} />
            </button>*/}
          </div>
        </header>

        {/* Contenu principal */}
        <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
          {/* Outlet pour les pages enfants */}
          <Outlet context={{ isDarkMode }} />
        </main>
      </div>
    </div>
  );
}

// Export du composant principal
export default function ClientPage() {
  return (
    <ClientProvider>
      <InnerLayout />
    </ClientProvider>
  );
}

// Composant Plus manquant
const Plus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);