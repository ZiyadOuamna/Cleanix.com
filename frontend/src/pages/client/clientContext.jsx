// src/pages/client/clientContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(false);

  // Charger les notifications depuis l'API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const response = await getNotifications();
        // La réponse du backend est: { data: [...], current_page, last_page, ... }
        const notificationsData = (response && response.data) ? response.data : [];
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    loadNotifications();
    
    // Recharger les notifications chaque 30 secondes
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

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

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
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