import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FreelancerContext = createContext();

export const FreelancerProvider = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useTheme(); // Use global theme
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nouvelle commande reçue', date: 'Il y a 5 min', read: false },
    { id: 2, message: 'Votre profil a été mis à jour', date: 'Il y a 1 heure', read: true },
    { id: 3, message: 'Paiement reçu - 85€', date: 'Il y a 2 heures', read: true }
  ]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(false);

  const user = {
    name: 'Freelancer Test',
    email: 'freelancer@cleanix.com',
    phone: '+33 1 23 45 67 89',
    specialty: 'Nettoyage résidentiel',
    rating: 4.8
  };

  const earnings = {
    total: 1250,
    pending: 320,
    available: 930
  };

  const pendingOrders = 3;
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
    earnings,
    pendingOrders,
    rating,
    isOnline,
    setIsOnline,
    isAccountActive,
    setIsAccountActive
  };

  return (
    <FreelancerContext.Provider value={value}>
      {children}
    </FreelancerContext.Provider>
  );
};

export const useFreelancer = () => {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer must be used within a FreelancerProvider');
  }
  return context;
};

export { FreelancerContext };