import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getAuthenticatedUser } from '../../services/authService';

const FreelancerContext = createContext();

export const FreelancerProvider = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useTheme(); // Use global theme
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nouvelle commande reçue', date: 'Il y a 5 min', read: false },
    { id: 2, message: 'Votre profil a été mis à jour', date: 'Il y a 1 heure', read: true },
    { id: 3, message: 'Paiement reçu - 850DH', date: 'Il y a 2 heures', read: true }
  ]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données du user depuis localStorage
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du user depuis localStorage:', error);
    }
    return null;
  };

  // Charger les données du user depuis l'API au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Charger les données depuis l'API
          const response = await getAuthenticatedUser();
          if (response.data) {
            const apiUser = response.data;
            // Mettre à jour localStorage avec les données fraîches
            localStorage.setItem('user', JSON.stringify(apiUser));
            
            // Définir le user avec les données de l'API
            setUser({
              id: apiUser.id,
              name: `${apiUser.prenom || ''} ${apiUser.nom || ''}`.trim() || apiUser.name || 'Freelancer',
              prenom: apiUser.prenom,
              nom: apiUser.nom,
              email: apiUser.email || 'freelancer@cleanix.com',
              phone: apiUser.telephone || apiUser.phone || '+33 1 23 45 67 89',
              telephone: apiUser.telephone || '+33 1 23 45 67 89',
              specialty: apiUser.specialty || 'Spécialiste en nettoyage',
              localisation: apiUser.localisation || 'Non spécifiée',
              bio: apiUser.bio || '',
              photo_profil: apiUser.photo_profil || null,
              created_at: apiUser.created_at,
              rating: apiUser.freelancer?.note_moyenne || 4.8,
              freelancer: apiUser.freelancer
            });
          }
        } else {
          // Si pas de token, charger depuis localStorage
          const storedUserData = getStoredUser();
          if (storedUserData) {
            setUser({
              id: storedUserData.id,
              name: `${storedUserData.prenom || ''} ${storedUserData.nom || ''}`.trim() || storedUserData.name || 'Freelancer',
              prenom: storedUserData.prenom,
              nom: storedUserData.nom,
              email: storedUserData.email || 'freelancer@cleanix.com',
              phone: storedUserData.telephone || storedUserData.phone || '+33 1 23 45 67 89',
              telephone: storedUserData.telephone || '+33 1 23 45 67 89',
              specialty: storedUserData.specialty || 'Spécialiste en nettoyage',
              localisation: storedUserData.localisation || 'Non spécifiée',
              bio: storedUserData.bio || '',
              photo_profil: storedUserData.photo_profil || null,
              created_at: storedUserData.created_at,
              rating: 4.8
            });
          } else {
            setUser({
              name: 'Freelancer Test',
              email: 'freelancer@cleanix.com',
              phone: '+33 1 23 45 67 89',
              specialty: 'Nettoyage résidentiel',
              rating: 4.8
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du user:', error);
        // Fallback: utiliser les données du localStorage
        const storedUserData = getStoredUser();
        if (storedUserData) {
          setUser({
            id: storedUserData.id,
            name: `${storedUserData.prenom || ''} ${storedUserData.nom || ''}`.trim() || storedUserData.name || 'Freelancer',
            prenom: storedUserData.prenom,
            nom: storedUserData.nom,
            email: storedUserData.email || 'freelancer@cleanix.com',
            phone: storedUserData.telephone || storedUserData.phone || '+33 1 23 45 67 89',
            telephone: storedUserData.telephone || '+33 1 23 45 67 89',
            specialty: storedUserData.specialty || 'Spécialiste en nettoyage',
            localisation: storedUserData.localisation || 'Non spécifiée',
            bio: storedUserData.bio || '',
            photo_profil: storedUserData.photo_profil || null,
            created_at: storedUserData.created_at,
            rating: 4.8
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const earnings = {
    total: 1250,
    pending: 320,
    available: 930
  };

  const pendingOrders = 3;
  const rating = user?.rating || 4.8;

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
    setIsAccountActive,
    loading
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