import { useNavigate } from 'react-router-dom';
import { logoutUser } from './authService';

/**
 * Hook personnalisé pour gérer la déconnexion de manière sécurisée
 * Inclut la prévention du cache et la redirection appropriée
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Appeler le endpoint logout du backend
      await logoutUser();
      
      // Ajouter des headers de cache-busting
      const noCacheHeaders = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      // Modifier l'historique du navigateur
      window.history.replaceState(null, null, '/login');
      
      // Rediriger vers la page de connexion
      navigate('/login', { replace: true });
      
      // Vider le cache du navigateur pour cette page
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, rediriger
      window.history.replaceState(null, null, '/login');
      navigate('/login', { replace: true });
    }
  };

  return { logout };
};
