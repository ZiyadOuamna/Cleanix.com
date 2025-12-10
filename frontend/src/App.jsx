import './App.css';
import { Routes, Route } from 'react-router-dom';
import "@fontsource/material-icons-two-tone";

// les import des pages avant la connexion 
import CleanixLandingPage from './pages/homePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import ResetPasswordPage from '../src/pages/ResetPasswordPage';

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

//----------------------------------------------------------------------//
// ( 4 ) imports des pages après la connexion de la page de Support
//import DashboardSupportAgent from './pages/support';

export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<CleanixLandingPage />} /> 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Routes pour Superviseur */}
      <Route path="/superviseur/dashboard" element={<DashboardSuperviseur />}>
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

      {/* Routes pour Client - À COMPLÉTER */}
      <Route path='/client/dashboard' element={<DashboardClient />}>
        <Route index element={<div>Page d'accueil client</div>} />
        {/* Vous pourrez ajouter les sous-routes ici plus tard */}
      </Route>

      {/* Routes pour Freelancer */}
      <Route path='/freelancer/dashboard' element={<PageFreelancer />}>
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

      {/* Routes pour Support 
      <Route path='/support/dashboard' element={<DashboardSupportAgent />} />*/}

      {/* Route de compatibilité pour anciens liens - À SUPPRIMER PLUS TARD */}
      <Route path='/dev-freelancer-page' element={<PageFreelancer />}>
        <Route index element={<OrdersReceived />} />
        <Route path='dashboard-freelancer' element={<DashboardFreelancer />} />
        <Route path='profile-freelancer' element={<ProfileFreelancer />} />
        <Route path='accepted-cmd-freelancer' element={<CommandesAcceptees />} />
        <Route path='historique-commandes-freelancer' element={<HistoriqueCommandes />} />
        <Route path='gestion-services-freelancer' element={<GestionServices />} />
        <Route path='publier-service-freelancer' element={<PublierService />} />
        <Route path='portefeuille-freelancer' element={<PortefeuilleFreelancer />} />
        <Route path='settings-freelancer' element={<SettingsFreelancer />} />
        <Route path='support-freelancer' element={<SupportFreelancer />} />
      </Route>
    </Routes>
  );
}