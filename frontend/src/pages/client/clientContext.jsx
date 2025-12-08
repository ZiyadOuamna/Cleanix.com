import React, { createContext, useState, useContext, useEffect } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Votre service de nettoyage est confirmé', date: 'Il y a 5 min', read: false },
    { id: 2, message: 'Freelancer accepté votre demande', date: 'Il y a 1 heure', read: true },
    { id: 3, message: 'Service terminé avec succès', date: 'Il y a 2 heures', read: true }
  ]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const user = {
    name: 'Client Test',
    email: 'client@cleanix.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de Paris, 75000 Paris',
    avatar: '👤'
  };

  const wallet = {
    balance: 250.50,
    totalSpent: 1250.00,
    currency: 'EUR'
  };

  const bookings = {
    active: 2,
    completed: 8,
    cancelled: 1
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('clientDarkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

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
    bookings
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
