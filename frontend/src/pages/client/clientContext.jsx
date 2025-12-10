// src/pages/client/clientContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Votre service de nettoyage est confirmé', date: 'Il y a 5 min', read: false },
    { id: 2, message: 'Freelancer a accepté votre demande', date: 'Il y a 1 heure', read: true },
    { id: 3, message: 'Service terminé avec succès', date: 'Il y a 2 heures', read: true }
  ]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(false);

  // Charger les données du client depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Données utilisateur par défaut
  const [user, setUser] = useState({
    nom: 'Client',
    prenom: 'Test',
    email: 'client@cleanix.com',
    phone: '+33 1 23 45 67 89',
    specialty: 'Services de nettoyage',
    rating: 4.8
  });

  const wallet = {
    balance: 250.50,
    totalSpent: 1250.00,
    currency: 'MAD'
  };

  const bookings = {
    active: 2,
    completed: 8,
    cancelled: 1
  };

  const pendingOrders = 1;
  const rating = 4.8;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const value = {
    notifications,
    markAsRead,
    markAllAsRead,
    isMenuOpen,
    setIsMenuOpen,
    isDarkMode,
    setIsDarkMode,
    user,
    wallet,
    bookings,
    pendingOrders,
    rating,
    isOnline,
    setIsOnline,
    isAccountActive,
    setIsAccountActive,
    setUser
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export { ClientContext };
export default ClientContext;