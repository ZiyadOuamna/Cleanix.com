// src/pages/SuperviseurPage.jsx
import React, { useRef, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronRight, X, Sun, Moon } from 'lucide-react';
import { SuperviseurProvider, SuperviseurContext } from './superviseurContext';

// constants (icons/colors trimmed to essentials)
const ICONS = {
  remboursement: '💰',
  users: '👥',
  dashboard: '📊',
  reclamations: '📞',
  settings: '⚙️',
  notifications: '🔔',
  menuOpen: '➤',
  menuClose: '◀',
  chevronRight: <ChevronRight size={14} />
};
const COLORS = { primary: '#2d2c86', background: '#f0fafe' };

// cette fonction représente le contenu principal de la page superviseur
function InnerLayout() { 
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  // consume shared state (for header / sidebar controls)
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isMenuOpen, setIsMenuOpen,
    isDarkMode, setIsDarkMode,
  } = useContext(SuperviseurContext);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        // this layout doesn't keep showNotifications state; pages can manage it or we can add one
        // For quick behavior we do nothing here. Notification dropdown handled locally below.
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  // local dropdown state for header notifications
  const [showNotifications, setShowNotifications] = React.useState(false);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      {/* SIDEBAR (kept inside layout) */}
      <aside className={`fixed md:relative z-30 h-screen shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} ${isMenuOpen ? 'w-72' : 'w-20'}`}>
        <div className={`h-20 flex items-center justify-between px-6 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {isMenuOpen ? <span className="text-2xl font-extrabold" style={{ color: COLORS.primary }}>Cleanix</span> : <span className="text-2xl font-bold mx-auto" style={{ color: COLORS.primary }}>C.</span>}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-blue-600">
            {isMenuOpen ? ICONS.menuClose : ICONS.menuOpen}
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('dashboard')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 ${isMenuOpen ? '' : 'justify-center'}`}>
                <div className="flex items-center gap-4"><span className="text-xl">{ICONS.dashboard}</span>{isMenuOpen && <span>Dashboard</span>}</div>
                {isMenuOpen && <span className={`text-xs transition`}>{ICONS.chevronRight}</span>}
              </button>
            </li>

            <li>
              <button onClick={() => navigate('users')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 ${isMenuOpen ? '' : 'justify-center'}`}>
                <div className="flex items-center gap-4"><span className="text-xl">{ICONS.users}</span>{isMenuOpen && <span>Utilisateurs</span>}</div>
                {isMenuOpen && <span className={`text-xs transition`}>{ICONS.chevronRight}</span>}
              </button>
            </li>

            <li>
              <button onClick={() => navigate('remboursement')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 ${isMenuOpen ? '' : 'justify-center'}`}>
                <span className="text-xl">{ICONS.remboursement}</span>{isMenuOpen && <span>Remboursement</span>}
              </button>
            </li>

            <li>
              <button onClick={() => navigate('gestion-reclamations')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 ${isMenuOpen ? '' : 'justify-center'}`}>
                <span className="text-xl">{ICONS.reclamations}</span>{isMenuOpen && <span>Réclamations</span>}
              </button>
            </li>

            <li>
              <button onClick={() => navigate('settings-superviseur')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 ${isMenuOpen ? '' : 'justify-center'}`}>
                <span className="text-xl">{ICONS.settings}</span>{isMenuOpen && <span>Paramètres</span>}
              </button>
            </li>
          </ul>
        </nav>

        {isMenuOpen && (
          <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Superviseur</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={`h-20 flex items-center justify-end px-8 z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              {isDarkMode ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
            </button>

            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(s => !s)} className="relative p-2 rounded-full bg-gray-100">
                <span className="text-xl">{ICONS.notifications}</span>
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
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
