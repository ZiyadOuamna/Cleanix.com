import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { Eye, EyeOff, Mail, Lock, Shield, CheckCircle, ArrowRight } from 'lucide-react';

// Liste des types d'utilisateurs avec contenu marketing
const USER_TYPES_CONTENT = {
  Client: {
    title: 'Bienvenue de retour, cher Client !',
    description: 'Reconnectez-vous pour profiter de nos services de nettoyage premium. Accédez à votre espace personnel, gérez vos réservations et bénéficiez d\'offres exclusives.',
    benefits: [
      { icon: '✨', title: 'Service Premium', desc: 'Des professionnels vérifiés pour un résultat impeccable' },
      { icon: '💰', title: 'Prix Avantageux', desc: 'Profitez de réductions pour vos commandes régulières' },
      { icon: '⏰', title: 'Flexibilité Totale', desc: 'Réservez quand vous voulez, annulez gratuitement' },
    ],
    testimonial: '"Cleanix a transformé ma façon de gérer le ménage. Service fiable et prix abordable!" - Nadia, Casablanca',
    color: 'from-teal-600 to-blue-600',
    icon: '👤'
  },
  Freelancer: {
    title: 'Bienvenue, Freelancer Ambitionneux !',
    description: 'Connectez-vous pour accéder à vos missions, gérer vos revenus et développer votre activité. Plus de clients, plus de profits.',
    benefits: [
      { icon: '💼', title: 'Missions Régulières', desc: 'Un flux constant de missions près de chez vous' },
      { icon: '📱', title: 'Application Mobile', desc: 'Gérez vos missions en toute simplicité' },
      { icon: '🛡️', title: 'Protection & Assurance', desc: 'Vous êtes couvert pendant vos missions' },
    ],
    testimonial: '"Avec Cleanix, j\'ai pu multiplier mes revenus par 3 en quelques mois seulement!" - Ahmed, Freelancer',
    color: 'from-blue-600 to-indigo-700',
    icon: '💼'
  },
  Superviseur: {
    title: 'Bienvenue, Superviseur !',
    description: 'Connectez-vous à votre interface de supervision pour analyser les performances et prendre des décisions stratégiques.',
    benefits: [
      { icon: '📊', title: 'Supervision Complète', desc: 'Vue d\'ensemble de toutes les opérations' },
      { icon: '👥', title: 'Gestion d\'équipe', desc: 'Gérez et motivez vos équipes efficacement' },
      { icon: '🎯', title: 'KPI en Temps Réel', desc: 'Suivez les performances instantanément' },
    ],
    testimonial: '"Avec ce dashboard, je peux gérer toute l\'entreprise facilement!" - Manager Principal',
    color: 'from-amber-600 to-orange-600',
    icon: '🎯'
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentUserType, setCurrentUserType] = useState('Client');
  const [rememberMe, setRememberMe] = useState(false);

  // Rotation automatique du contenu marketing
  useEffect(() => {
    const interval = setInterval(() => {
      const userTypes = Object.keys(USER_TYPES_CONTENT);
      setCurrentUserType(prev => {
        const currentIndex = userTypes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % userTypes.length;
        return userTypes[nextIndex];
      });
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!credentials.email || !credentials.password) {
      setMessage('❌ Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(credentials);
      
      // Stocker les données d'authentification
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('user_type', response.data.user.user_type);

      // Si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem('remembered_email', credentials.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      setMessage(`✅ Connexion réussie! Bienvenue ${response.data.user.prenom}.`);
      
      // Redirection en fonction du type d'utilisateur
      setTimeout(() => {
        const userType = response.data.user.user_type;
        switch (userType.toLowerCase()) {
          case 'client':
            navigate('/client/dashboard');
            break;
          case 'freelancer':
            navigate('/freelancer/dashboard');
            break;
          case 'superviseur':
            navigate('/superviseur/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setMessage(`❌ Erreur: ${error.response?.data?.message || error.message || 'Identifiants invalides'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const content = USER_TYPES_CONTENT[currentUserType] || USER_TYPES_CONTENT.Client;

  // Charger l'email mémorisé au montage
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setCredentials(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      
      {/* Left: Marketing Section */}
      <div className={`lg:w-1/2 w-full flex flex-col justify-center p-6 lg:p-10 bg-gradient-to-br ${content.color} text-white relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
        </div>
        
        <div className="relative z-10 max-w-lg mx-auto w-full">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <span className="text-xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Accès Sécurisé</h1>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 leading-tight">{content.title}</h1>
          <p className="text-base mb-6 leading-relaxed text-blue-100">{content.description}</p>
          
          <div className="space-y-3 mb-6">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="h-10 w-10 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xl">{benefit.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-blue-100">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 mb-6">
            <p className="italic text-base">{content.testimonial}</p>
          </div>
          
          {/* Indicateurs de changement */}
          <div className="flex justify-center space-x-2 mb-4">
            {Object.keys(USER_TYPES_CONTENT).map((type) => (
              <button
                key={type}
                onClick={() => setCurrentUserType(type)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentUserType === type 
                    ? 'bg-white w-8' 
                    : 'bg-white/30 w-2 hover:bg-white/50'
                }`}
                aria-label={`Choisir ${type}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => navigate('/register')} 
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 border border-white/30 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Pas encore membre ? Créez un compte
            </span>
          </button>
          
          <div className="mt-6 flex items-center justify-center text-blue-100 text-sm">
            <div className="flex items-center mr-4">
              <Shield size={16} className="mr-1" />
              <span className="font-semibold">Connexion Sécurisée</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="ml-4">
              <span className="font-semibold">SSL/TLS</span> Encryption
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-5 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion à votre compte</h2>
            <p className="text-sm text-gray-600">Accédez à votre espace personnel Cleanix</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <Mail size={14} className="mr-1 text-gray-400" />
                Adresse Email *
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email" 
                  value={credentials.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition pl-10"
                  placeholder="exemple@email.com"
                  autoComplete="email"
                />
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <Lock size={14} className="mr-1 text-gray-400" />
                Mot de passe *
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={credentials.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition pl-10 pr-10"
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                />
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options de connexion */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-xs text-gray-700">Se souvenir de moi</span>
              </label>
              
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-teal-600 hover:text-teal-800 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-300 flex items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
            
            {/* Message de statut */}
            {message && (
              <div className={`p-3 rounded text-center text-xs ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Vous n'avez pas encore de compte ?</span>
              </div>
            </div>
          </form>
          
          {/* Lien vers l'inscription */}
          <div className="pt-6 border-gray-200 text-center">
          
            <button 
              onClick={() => navigate('/register')} 
              className="w-full bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm"
            >
              Créer un nouveau compte
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              En vous connectant, vous acceptez nos{' '}
              <button onClick={() => navigate('/terms')} className="text-teal-600 hover:text-teal-800 font-medium">Conditions d'utilisation</button>
              {' '}et notre{' '}
              <button onClick={() => navigate('/privacy')} className="text-teal-600 hover:text-teal-800 font-medium">Politique de confidentialité</button>
            </p>
            
            {/* Assistance */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-800 flex items-center">
                <Shield size={12} className="mr-1" />
                <span>Besoin d'aide ? <button className="font-medium hover:underline">Contactez notre support</button></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}