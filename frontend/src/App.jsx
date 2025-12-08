import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "@fontsource/material-icons-two-tone";
import { ProtectedRoute, PublicRoute, validateToken } from './services/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

// les import des pages avant la connexion 
import CleanixLandingPage from './pages/homePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
// ( 1 ) les import des pages après la connexion de la page de superviseur 
import DashboardSuperviseur from './pages/superviseur/superviseur';

// les imports des pages de la partie : réclamations , rembourssement et settings chez superviseur 
import Reclamations from './pages/superviseur/gestionReclamations';
import RembourssementsPage from './pages/superviseur/gestionRembourssements';
import SettingsPage from './pages/superviseur/settings-Superviseur';

// les imports des pages de la partie gestion des utilisateurs chez superviseur 
import GestionClientsPage     from './pages/superviseur/gestionUsers/gestionClients';
import GestionFreelancersPage from './pages/superviseur/gestionUsers/gestionFreelancers';
import GestionSupportPage     from './pages/superviseur/gestionUsers/gestionSupport';

// les imports des pages de la partie dashboard chez superviseur 
import DashboardClients      from './pages/superviseur/gestionDashboard/dashboardClients-Superviseur';
import DashboardFreelancers  from './pages/superviseur/gestionDashboard/dashboardFreelancers-Superviseur';  

//----------------------------------------------------------------------//
// ( 2 ) les imports des pages après la connexion de la page de freelancer
import PageFreelancer    from './pages/freelancer/freelancer';
import ProfileFreelancer from './pages/freelancer/profileFreelancer';
import DashboardFreelancer from './pages/freelancer/freelancerDashboard';

// les imports des pages de la partie : portefeuille , settings et support chez freelancer
import PortefeuilleFreelancer from './pages/freelancer/portefeuille';
import SettingsFreelancer     from './pages/freelancer/settings';
import SupportFreelancer      from './pages/freelancer/support';

// les imports des pages de la partie Mes Commandes chez freelancer
import CommandesAcceptees from './pages/freelancer/commades/acceptedCmd';
import HistoriqueCommandes from './pages/freelancer/commades/historiqueCmd';
import OrdersReceived from './pages/freelancer/commades/ordersReceived';

// les imports des pages de la partie services chez freelancer 
import GestionServices from './pages/freelancer/services/gestionService';
import PublierService from './pages/freelancer/services/publierService';

// ( 3 ) imports des pages après la connexion de la page de Client
import DashboardClient from './pages/client/Client';
import ClientDashboard from './pages/client/clientDashboard';
import ProfileClient from './pages/client/profileClient';
import SupportClient from './pages/client/support';
import SettingsClient from './pages/client/settings';
import MyBookings from './pages/client/myBookings';
import BookingHistory from './pages/client/bookingHistory';
import WalletClient from './pages/client/walletClient';

//----------------------------------------------------------------------//
// ( 4 ) imports des pages après la connexion de la page de Support
//import DashboardSupportAgent from './pages/support/supportDashboard';

//import DashboardSupportAgent from './pages/support';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Valider le token au chargement de l'app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Vérifier que le token est valide avec le backend
        const isValid = await validateToken();
        if (!isValid) {
          // Token expiré ou invalide, rediriger vers login
          window.location.href = '/login';
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <ThemeProvider>
      <Routes>
      {/* Routes publiques - redirige vers dashboard si déjà connecté */}
      <Route path="/" element={<PublicRoute element={<CleanixLandingPage />} isLoading={isLoading} />} /> 
      <Route path="/register" element={<PublicRoute element={<RegisterPage />} isLoading={isLoading} />} />
      <Route path="/login" element={<PublicRoute element={<LoginPage />} isLoading={isLoading} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPasswordPage />} isLoading={isLoading} />} />
      <Route path="/reset-password" element={<PublicRoute element={<ResetPasswordPage />} isLoading={isLoading} />} />
      
      {/* Routes pour Superviseur - Protégées */}
      <Route path="/superviseur/dashboard" element={<ProtectedRoute element={<DashboardSuperviseur />} requiredUserType="superviseur" isLoading={isLoading} />}>
        {/* les routes des partie : réclamations , rembourssement et settings */}
        <Route path="gestion-reclamations"    element={<Reclamations />}/>
        <Route path="gestion-rembourssements" element={<RembourssementsPage />}/>
        <Route path="settings-superviseur"    element={<SettingsPage />}/>

        {/* les routes de la partie dashboard */}
        <Route path="dashboard-clients"     element={<DashboardClients/>} />
        <Route path="dashboard-freelancers" element={<DashboardFreelancers/>} />

        {/* les routes de la partie gestion des utilisateurs */}
        <Route path="gestion-clients"       element={<GestionClientsPage />} />
        <Route path="gestion-freelancers"   element={<GestionFreelancersPage />} />
        <Route path="gestion-support"       element={<GestionSupportPage />} />
      </Route>

      {/* Routes pour Client - Protégées */}
      <Route path='/client/dashboard' element={<ProtectedRoute element={<DashboardClient />} requiredUserType="client" isLoading={isLoading} />}>
        {/* Dashboard */}
        <Route path='dashboard-client' element={<ClientDashboard />} />
        
        {/* Mes Réservations */}
        <Route path='my-bookings' element={<MyBookings />} />
        
        {/* Historique */}
        <Route path='booking-history' element={<BookingHistory />} />
        
        {/* Portefeuille */}
        <Route path='wallet-client' element={<WalletClient />} />
        
        {/* Profil */}
        <Route path='profile-client' element={<ProfileClient />} />
        
        {/* Support */}
        <Route path='support-client' element={<SupportClient />} />
        
        {/* Paramètres */}
        <Route path='settings-client' element={<SettingsClient />} />
        
        {/* Page par défaut */}
        <Route index element={<MyBookings />} />
      </Route>

      {/* Routes pour Freelancer - Protégées */}
      <Route path='/freelancer/dashboard' element={<ProtectedRoute element={<PageFreelancer />} requiredUserType="freelancer" isLoading={isLoading} />}>
        {/* Dashboard Freelancer */}
        <Route path='dashboard-freelancer' element={<DashboardFreelancer />} />
        
        {/* Profil */}
        <Route path='profile-freelancer' element={<ProfileFreelancer />} />
        
        {/* Commandes */}
        <Route index element={<OrdersReceived />} /> {/* PAGE PAR DÉFAUT */}
        <Route path='orders-received' element={<OrdersReceived />} />
        <Route path='accepted-cmd-freelancer' element={<CommandesAcceptees />} />
        <Route path='historique-commandes-freelancer' element={<HistoriqueCommandes />} />
        
        {/* Services */}
        <Route path='gestion-services-freelancer' element={<GestionServices />} />
        <Route path='publier-service-freelancer' element={<PublierService />} />
        
        {/* Autres */}
        <Route path='portefeuille-freelancer' element={<PortefeuilleFreelancer />} />
        <Route path='settings-freelancer' element={<SettingsFreelancer />} />
        <Route path='support-freelancer' element={<SupportFreelancer />} />
      </Route>

    </Routes>
    </ThemeProvider>
  );
}