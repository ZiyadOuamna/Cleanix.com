import React, { createContext, useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';

export const SuperviseurContext = createContext(null);

export function SuperviseurProvider({ children }) {
  const MOCK_RECLAMATIONS = [
    { id: 'REC-2024-001', client: 'Yassine A.', email: 'yassine@mail.com', titre: 'Problème de paiement', agent: 'Agent Karim', statut: 'Ouvert', urgence: 'High', date: '2025-11-19', description: "Le paiement a été débité mais la commande n'est pas validée." },
    { id: 'REC-2024-002', client: 'Sara B.', email: 'sara@mail.com', titre: 'Freelancer absent', agent: 'Non assigné', statut: 'En cours', urgence: 'Medium', date: '2025-11-18', description: "Le freelancer ne s'est pas présenté à l'heure prévue." },
    { id: 'REC-2024-003', client: 'Ahmed K.', email: 'ahmed@mail.com', titre: 'Qualité du service', agent: 'Agent Lina', statut: 'Résolu', urgence: 'Low', date: '2025-11-15', description: "Le nettoyage n'était pas complet dans la cuisine." },
  ];

  const [reclamations, setReclamations] = useState(MOCK_RECLAMATIONS);

  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

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

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Ajoutez l'utilisateur superviseur
  const [user, setUser] = useState({
    id: 1,
    name: 'Superviseur Ahmed',
    email: 'supervisor@example.com',
    role: 'supervisor'
  });

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Ouvert': return 'bg-red-100 text-red-800 border-red-200';
      case 'En cours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Résolu': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getUrgencyColor = (urg) => {
    if (urg === 'High') return 'text-red-600 font-bold';
    if (urg === 'Medium') return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <SuperviseurContext.Provider value={{
      reclamations,
      setReclamations,
      notifications,
      markAsRead,
      markAllAsRead,
      isMenuOpen,
      setIsMenuOpen,
      isDarkMode,
      setIsDarkMode,
      user, // Ajouté
      setUser, // Ajouté
      getStatusColor,
      getUrgencyColor
    }}>
      {children}
    </SuperviseurContext.Provider>
  );
}