// src/pages/freelancerContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const FreelancerContext = createContext();

export const FreelancerProvider = ({ children }) => {
  const getInitialDarkMode = () => {
    const saved = localStorage.getItem('freelancerDarkMode');
    return saved ? JSON.parse(saved) : false;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [isOnline, setIsOnline] = useState(true); // Statut en ligne

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nouvelle commande reçue #1234', date: '2024-01-15', read: false },
    { id: 2, message: 'Votre service a été évalué 5 étoiles', date: '2024-01-15', read: false },
    { id: 3, message: 'Paiement reçu: 85.50€', date: '2024-01-14', read: true },
  ]);

  const [user] = useState({
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    membership: 'Freelancer Premium',
    joinDate: '2023-03-20',
    specialty: 'Nettoyage résidentiel',
    phone: '+33 6 12 34 56 78'
  });

  const [earnings] = useState({
    total: 2450,
    thisMonth: 520,
    pending: 150
  });

  const [pendingOrders] = useState(3);
  const [rating] = useState(4.8);

  useEffect(() => {
    localStorage.setItem('freelancerDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isDarkMode,
    setIsDarkMode,
    isOnline,
    setIsOnline: toggleOnlineStatus,
    notifications,
    markAsRead,
    markAllAsRead,
    user,
    earnings,
    pendingOrders,
    rating
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