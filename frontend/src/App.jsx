import './App.css';
import { Routes, Route } from 'react-router-dom';// Importation des composants de routage depuis react-router-dom. dit par ziyad
import CleanixLandingPage from './pages/homePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; // <-- Importation du composant ResetPasswordPage
import ForgotPasswordPage from './pages/forgotPasswordPage';



function App() {
  return (
    // Routes kaydir l-mapping (liaison) bin l-URL w l-composant bach nkhdmo l spa. dit par ziyad
    <Routes>
      <Route path="/" element={<CleanixLandingPage />} /> 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/password-reset" element={<ResetPasswordPage />} />

      <Route path="/dashboard" element={<h1>Bienvenue sur le Tableau de Bord !</h1>} />
      {/* Hna n9deru nzidou les autres routes : /login, /client/dashboard, etc. */}
    </Routes>
  );
}

export default App;

