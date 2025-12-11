import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Composant qui protège les routes nécessitant une authentification
 * Redirige vers /login si pas authentifié
 * Redirige vers le bon dashboard si l'utilisateur essaie d'accéder à une mauvaise route
 */
export const ProtectedRoute = ({ 
  element, 
  requiredUserType = null,
  isLoading = false 
}) => {
  const token = localStorage.getItem('auth_token');
  const userType = localStorage.getItem('user_type');
  
  // Si chargement en cours, afficher rien ou spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>;
  }

  // Pas de token = pas connecté
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si une route spécifique est requise, vérifier si le user_type correspond
  if (requiredUserType && userType?.toLowerCase() !== requiredUserType.toLowerCase()) {
    // Rediriger vers le dashboard correct selon le type d'utilisateur
    switch (userType?.toLowerCase()) {
      case 'client':
        return <Navigate to="/client/dashboard" replace />;
      case 'freelancer':
        return <Navigate to="/freelancer/dashboard" replace />;
      case 'superviseur':
        return <Navigate to="/superviseur/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Tout est ok, afficher le composant
  return element;
};

/**
 * PublicRoute - Composant pour les routes publiques (login, register)
 * Redirige vers le dashboard si déjà authentifié
 */
export const PublicRoute = ({ element, isLoading = false }) => {
  const token = localStorage.getItem('auth_token');
  const userType = localStorage.getItem('user_type');

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>;
  }

  // Si authentifié, rediriger vers le dashboard approprié
  if (token) {
    switch (userType?.toLowerCase()) {
      case 'client':
        return <Navigate to="/client/dashboard" replace />;
      case 'freelancer':
        return <Navigate to="/freelancer/dashboard" replace />;
      case 'superviseur':
        return <Navigate to="/superviseur/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Pas authentifié, afficher la page publique
  return element;
};

/**
 * Utilitaires pour vérifier l'état d'authentification
 */
export const isUserAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getCurrentUserType = () => {
  return localStorage.getItem('user_type');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Fonction pour valider le token avec le backend (optionnel mais recommandé)
 * À appeler au démarrage de l'app
 */
export const validateToken = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      // Token invalide, nettoyer et rediriger
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur validation token:', error);
    return false;
  }
};
