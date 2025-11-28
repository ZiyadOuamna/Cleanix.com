import React, { createContext, useState, useEffect } from 'react';

export const SuperviseurContext = createContext(null);

export function SuperviseurProvider({ children }) {
  // shared state (mocks from your original file)
  const MOCK_RECLAMATIONS = [
    { id: 'REC-2024-001', client: 'Yassine A.', email: 'yassine@mail.com', titre: 'Problème de paiement', agent: 'Agent Karim', statut: 'Ouvert', urgence: 'High', date: '2025-11-19', description: "Le paiement a été débité mais la commande n'est pas validée." },
    { id: 'REC-2024-002', client: 'Sara B.', email: 'sara@mail.com', titre: 'Freelancer absent', agent: 'Non assigné', statut: 'En cours', urgence: 'Medium', date: '2025-11-18', description: "Le freelancer ne s'est pas présenté à l'heure prévue." },
    { id: 'REC-2024-003', client: 'Ahmed K.', email: 'ahmed@mail.com', titre: 'Qualité du service', agent: 'Agent Lina', statut: 'Résolu', urgence: 'Low', date: '2025-11-15', description: "Le nettoyage n'était pas complet dans la cuisine." },
  ];

  const [reclamations, setReclamations] = useState(MOCK_RECLAMATIONS);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Client Ahmed a annulé 5 réservations.', date: 'Il y a 2h', read: false },
    { id: 2, message: 'Nouveau freelancer inscrit.', date: 'Hier', read: true },
    { id: 3, message: 'Réclamation urgente : Commande #123.', date: 'Il y a 30min', read: false },
  ]);

  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // other shared state you used
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // --- MODIFICATION ICI : GESTION DU DARK MODE PERSISTANT ---
  
  // 1. Initialisation : On regarde si une valeur existe déjà dans le navigateur
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode === 'true'; // Retourne true si stocké, sinon false
  });

  // 2. Sauvegarde : À chaque changement de isDarkMode, on met à jour le localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // -----------------------------------------------------------

  // expose helper functions for status/urgency coloring
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
      isDarkMode,      // Passé une seule fois
      setIsDarkMode,   // Passé une seule fois
      getStatusColor,
      getUrgencyColor
    }}>
      {children}
    </SuperviseurContext.Provider>
  );
}