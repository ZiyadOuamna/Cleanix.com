import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icônes pour les menus
const ICONS = {
  remboursement: '💰',
  users: '👥',
  dashboard: '📊',
  reclamations: '📞',
  settings: '⚙️',
  notifications: '🔔',
  menuOpen: '➤',
  menuClose: '◀',
  chevronDown: '▼',
  chevronRight: '▶',
  sun: '☀️',
  moon: '🌙',
};

// Couleurs cohérentes avec les pages précédentes
const COLORS = {
  primary: '#2d2c86',
  secondary: '#3ec0f0',
  background: '#f0fafe',
  textSecondary: '#918a84',
  sidebarBg: '#ffffff',
  sidebarText: '#4b5563',
};

export default function SuperviseurPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard'); // Page active par défaut
  const [activeSubPage, setActiveSubPage] = useState('client'); // Sous-page active pour dashboard
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // État pour afficher/masquer le menu
  const [isDarkMode, setIsDarkMode] = useState(false); // État pour le mode sombre/clair
  
  // Référence pour la détection du clic en dehors des notifications
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Client Ahmed a annulé 5 réservations successives. Statut changé à "Client à Risque".', date: '2023-10-01', read: false },
    { id: 2, message: 'Nouveau freelancer inscrit : Karim de Rabat.', date: '2023-10-02', read: true },
    { id: 3, message: 'Réclamation urgente : Commande #123.', date: 'Il y a 30min', read: false },
  ]);

  // Gestionnaire Click Outside pour fermer les notifications
  useEffect(() => {
      function handleClickOutside(event) {
          if (notificationRef.current && !notificationRef.current.contains(event.target)) {
              setShowNotifications(false);
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setActivePage(page);
    if (page !== 'dashboard') {
      setActiveSubPage(''); // Réinitialiser sous-page si pas dashboard
    } else {
        if(activeSubPage === '') setActiveSubPage('client');
    }
  };

  // Fonction pour changer de sous-page
  const handleSubPageChange = (subPage) => {
    setActiveSubPage(subPage);
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Compter les notifications non lues
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // --- Rendu du contenu principal basé sur la page active (SWITCH CASE GÉANT) ---
  const renderContent = () => {
    switch (activePage) {
      case 'remboursement':
        return (
             <div className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>Gestion des Remboursements</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tableau des remboursements en attente...</p>
            </div>
        );
      case 'users':
        return (
             <div className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>Utilisateurs</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Liste des clients et freelancers...</p>
            </div>
        );
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { title: 'Utilisateurs Totaux', value: '1,234', change: '+12%', color: 'green' },
                { title: 'Revenus (Commissions)', value: '15,400 DH', change: '+5%', color: 'green' },
                { title: 'Réclamations Ouvertes', value: '3', change: '-2', color: 'red' }
            ].map((stat, idx) => (
                <div key={idx} className={`p-6 rounded-2xl shadow-sm border transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</h3>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                    <span className={`text-sm font-medium text-${stat.color}-500`}>{stat.change} ce mois</span>
                </div>
            ))}
            
            <div className={`col-span-full p-8 rounded-2xl shadow-sm border mt-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>
                    <span>{ICONS.dashboard}</span>
                    Détails : {activeSubPage ? activeSubPage.charAt(0).toUpperCase() + activeSubPage.slice(1) : 'Vue Globale'}
                </h3>
                <div className={`h-64 rounded-xl flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <p>Graphique des statistiques {activeSubPage} ici...</p>
                </div>
            </div>
          </div>
        );
      case 'reclamations':
        return (
            <div className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>Réclamations</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tickets ouverts...</p>
            </div>
        );
      case 'settings':
        return (
            <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b" style={{ color: isDarkMode ? '#fff' : COLORS.primary, borderColor: isDarkMode ? '#374151' : '#f3f4f6' }}>
                    Paramètres du Compte
                </h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Formulaire de paramètres ici...</p>
            </div>
        );
      default:
        return <div><h2 className="text-xl font-bold mb-4">Bienvenue</h2><p>Sélectionnez une option dans le menu.</p></div>;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      
      {/* --- SIDEBAR (Menu Latéral) --- */}
      <aside 
        className={`
            fixed md:relative z-30 h-screen shadow-2xl transition-all duration-300 ease-in-out flex flex-col
            ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}
            ${isMenuOpen ? 'w-72' : 'w-20'}
        `}
      >
        {/* Logo & Toggle */}
        <div className={`h-24 flex items-center justify-between px-6 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            {isMenuOpen ? (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
                    <span className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.primary }}>Cleanix</span>
                </div>
            ) : (
                <span className="text-2xl font-bold mx-auto" style={{ color: COLORS.primary }}>C.</span>
            )}
            
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-blue-50 text-gray-500'}`}
            >
                {isMenuOpen ? ICONS.menuClose : ICONS.menuOpen}
            </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide">
            <ul className="space-y-2">
                
                {/* Item Dashboard (Avec Sous-Menu) */}
                <li>
                    <button
                        onClick={() => handlePageChange('dashboard')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                            ${activePage === 'dashboard' 
                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                            ${isDarkMode && activePage !== 'dashboard' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : ''}
                            ${isDarkMode && activePage === 'dashboard' ? 'bg-indigo-900/50 text-indigo-300' : ''}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-xl">{ICONS.dashboard}</span>
                            {isMenuOpen && <span>Dashboard</span>}
                        </div>
                        {/* Indicateur de sous-menu (Chevron) */}
                        {isMenuOpen && (
                            <span className={`text-xs transition-transform duration-200 ${activePage === 'dashboard' ? 'rotate-90' : ''}`}>
                                {ICONS.chevronRight}
                            </span>
                        )}
                        {/* Indicateur Actif (Barre gauche) */}
                        {activePage === 'dashboard' && <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"></div>}
                    </button>

                    {/* Sous-menu Dashboard (Animation de hauteur simple) */}
                    {isMenuOpen && activePage === 'dashboard' && (
                        <div className="ml-6 mt-2 pl-4 border-l-2 border-gray-100 space-y-1 animate-fade-in-down">
                            {['client', 'freelancer', 'support'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleSubPageChange(type)}
                                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition flex items-center gap-2
                                        ${activeSubPage === type 
                                            ? 'text-indigo-600 font-medium bg-indigo-50' 
                                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
                                        ${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : ''}
                                        ${isDarkMode && activeSubPage === type ? 'bg-gray-700 text-white' : ''}
                                    `}
                                >
                                    {activeSubPage === type && <span className="text-[10px]">{ICONS.chevronRight}</span>}
                                    Statistiques {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </li>
                
                {/* Séparateur visuel */}
                <div className={`h-px my-4 mx-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>

                {/* Autres Liens (Remboursement, Users, etc.) */}
                {[
                    { id: 'remboursement', label: 'Remboursement', icon: ICONS.remboursement },
                    { id: 'users', label: 'Utilisateurs', icon: ICONS.users },
                    { id: 'reclamations', label: 'Réclamations', icon: ICONS.reclamations },
                    { id: 'settings', label: 'Paramètres', icon: ICONS.settings },
                ].map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => handlePageChange(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative
                                ${activePage === item.id 
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                ${isDarkMode && activePage !== item.id ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : ''}
                                ${isDarkMode && activePage === item.id ? 'bg-indigo-900/50 text-indigo-300' : ''}
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isMenuOpen && <span>{item.label}</span>}
                            
                            {/* Indicateur Actif (Barre gauche) */}
                            {activePage === item.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"></div>}
                        </button>
                    </li>
                ))}

            </ul>
        </nav>

        {/* Footer Sidebar (Profil Rapide) */}
        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className={`flex items-center gap-3 p-2 rounded-xl transition ${isMenuOpen ? 'hover:bg-gray-50 cursor-pointer' : 'justify-center'} ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                    S
                </div>
                {isMenuOpen && (
                    <div className="overflow-hidden">
                        <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Superviseur</p>
                        <p className="text-xs text-gray-400 truncate">admin@cleanix.ma</p>
                    </div>
                )}
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className={`shadow p-4 flex justify-between items-center h-20 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: isDarkMode ? '#fff' : COLORS.primary }}>
                {activePage === 'dashboard' ? `Dashboard / ${activeSubPage.charAt(0).toUpperCase() + activeSubPage.slice(1)}` : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h1>
            <p className="text-sm text-gray-400">Bienvenue sur votre espace de gestion</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-gray-700 text-yellow-400 shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`} title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}>
                {isDarkMode ? ICONS.sun : ICONS.moon}
             </button>

             <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 ${showNotifications ? 'bg-indigo-50 ring-2 ring-indigo-100' : 'hover:bg-gray-50'} ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                >
                  <div className="relative">
                    <span className="text-2xl">{ICONS.notifications}</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
                        {unreadCount}
                        </span>
                    )}
                  </div>
                  <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notifications</span>
                </button>
                {showNotifications && (
                  <div className={`absolute right-0 mt-4 w-96 rounded-2xl shadow-2xl border overflow-hidden z-50 transform transition-all origin-top-right animate-scale-in ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`}>
                    <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-50 bg-gray-50/50'}`}>
                        <h3 className="font-bold text-lg">Vos Notifications</h3>
                        {unreadCount > 0 ? <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-bold">{unreadCount} nouvelles</span> : <span className="text-xs text-gray-400">À jour</span>}
                    </div>
                    <ul className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <li className="p-12 text-center flex flex-col items-center text-gray-400"><span className="text-4xl mb-2">📭</span>Aucune notification pour le moment</li>
                      ) : (
                        notifications.map((notif) => (
                          <li
                            key={notif.id}
                            className={`p-4 border-b cursor-pointer transition-colors duration-200 flex gap-3 items-start ${!notif.read ? (isDarkMode ? 'bg-indigo-900/20 border-l-4 border-l-indigo-500' : 'bg-blue-50/60 border-l-4 border-l-indigo-500') : (isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-50 hover:bg-gray-50')}`}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!notif.read ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                                <p className={`text-sm mb-1 leading-snug ${!notif.read ? 'font-bold' : 'font-normal text-gray-500'}`}>{notif.message}</p>
                                <p className="text-xs text-gray-400 flex justify-between items-center mt-2"><span>{notif.date}</span>{!notif.read && <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold">Nouveau</span>}</p>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className={`p-3 text-center border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                        <button onClick={markAllAsRead} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition">Tout marquer comme lu</button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </header>

        {/* Contenu dynamique */}
        <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f0fafe]'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}