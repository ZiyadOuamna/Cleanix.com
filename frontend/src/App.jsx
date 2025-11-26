import './App.css';
import { Routes, Route } from 'react-router-dom';// Importation des composants de routage depuis react-router-dom. dit par ziyad
//les import des pages avant la connexion 
import CleanixLandingPage from './pages/homePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ForgotPasswordPage from './pages/forgotPasswordPage';
//import ResetPasswordPage from './pages/ResetPasswordPage';
//les import des pages après la connexion de la page de superviseur 
import DashboardSuperviseur from './pages/superviseur/superviseur';


//les imports des pages de la partie : réclamations , rembourssement et settings
import Reclamations from './pages/superviseur/gestionReclamations';
import RembourssementsPage from './pages/superviseur/gestionRembourssements';
import SettingsPage from './pages/superviseur/settings-Superviseur';

//les imports des pages de la partie gestion des utilisateurs
import GestionClientsPage     from './pages/superviseur/gestionUsers/gestionClients';
import GestionFreelancersPage from './pages/superviseur/gestionUsers/gestionFreelancers';
import GestionSupportPage     from './pages/superviseur/gestionUsers/gestionSupport';

//les imports des pages de la partie dashboard
import DashboardClients      from './pages/superviseur/gestionDashboard/dashboardClients-Superviseur';
import DashboardFreelancers  from './pages/superviseur/gestionDashboard/dashboardFreelancers-Superviseur';  
import DashboardSupport      from './pages/superviseur/gestionDashboard/dashboardSupport-Superviseur';


function App() {
  return (
    // Routes kaydir l-mapping (liaison) bin l-URL w l-composant bach nkhdmo l spa. dit par ziyad
    <Routes>
      <Route path="/" element={<CleanixLandingPage />} /> 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/*<Route path="/reset-password/:token" element={<ResetPasswordPage />} />*/}
      
      <Route path="/dev-superviseur-page" element={<DashboardSuperviseur />}>

        {/* les routes des partie : réclamations , rembourssement et settings */}
        <Route path="gestion-reclamations"    element={<Reclamations />}/>
        <Route path="gestion-rembourssements" element={<RembourssementsPage />}/>
        <Route path="settings-superviseur"    element={<SettingsPage />}/>

        {/* les routes de la partie dashboard */}
        <Route path="dashboard-clients"     element={<DashboardClients/>} />
        <Route path="dashboard-freelancers"     element={<DashboardFreelancers/>} />

        {/* les routes de la partie gestion des utilisateurs */}
        <Route path="gestion-clients"       element={<GestionClientsPage />} />
        <Route path="gestion-freelancers"   element={<GestionFreelancersPage />} />

        
      </Route>

    </Routes>
  );
}

export default App;
