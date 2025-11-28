// src/pages/clientContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const ClientContext = createContext();

// Provider
export const ClientProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Votre commande #1234 a été acceptée', date: '2024-01-15', read: false },
    { id: 2, message: 'Nouveau message de votre freelancer', date: '2024-01-15', read: false },
    { id: 3, message: 'Promotion spéciale ce week-end', date: '2024-01-14', read: true },
  ]);

  const [user] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    membership: 'Client Premium',
    joinDate: '2023-06-15'
  });

  const [walletBalance] = useState(150.50);
  const [activeOrders] = useState(2);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isDarkMode,
    setIsDarkMode,
    notifications,
    markAsRead,
    markAllAsRead,
    user,
    walletBalance,
    activeOrders
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

// Hook personnalisé
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export { ClientContext };