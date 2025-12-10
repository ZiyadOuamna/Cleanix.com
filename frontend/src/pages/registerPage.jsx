import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

// Liste des principales villes du Maroc pour la liste déroulante
const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammadia"
];

// Contenu marketing pour chaque type d'utilisateur
const USER_TYPES_CONTENT = {
  Client: {
    title: 'Rejoignez-nous en tant que Client',
    description: 'Accédez à nos services premium de nettoyage, réservez facilement et bénéficiez d\'avantages exclusifs.',
    benefits: [
      { icon: '✨', title: 'Service Premium', desc: 'Des professionnels vérifiés pour un résultat impeccable' },
      { icon: '💰', title: 'Prix Transparents', desc: 'Pas de surprises, des tarifs fixes et justes' },
      { icon: '⏰', title: 'Flexibilité Totale', desc: 'Réservez quand vous voulez, annulez gratuitement' },
    ],
    testimonial: '"Cleanix a transformé ma façon de gérer le ménage. Service fiable et prix abordable!" - Nadia, Casablanca',
    color: 'from-teal-600 to-blue-600',
  },
  Freelancer: {
    title: 'Devenez Freelancer Cleanix',
    description: 'Développez votre activité de nettoyage avec des missions régulières et une rémunération attractive.',
    benefits: [
      { icon: '💼', title: 'Missions Régulières', desc: 'Un flux constant de missions près de chez vous' },
      { icon: '📱', title: 'Application Mobile', desc: 'Gérez vos missions en toute simplicité' },
      { icon: '🛡️', title: 'Protection & Assurance', desc: 'Vous êtes couvert pendant vos missions' },
    ],
    testimonial: '"Avec Cleanix, j\'ai pu multiplier mes revenus par 3 en quelques mois seulement!" - Ahmed, Freelancer',
    color: 'from-blue-600 to-indigo-700',
  },
};

// Note: Support users cannot self-register, they must be created by superviseur only

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // État du formulaire avec les champs corrects
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    genre: '', // Pas de valeur par défaut - doit être choisi
    ville: MAROC_VILLES[0], // Ville par défaut : Agadir
    user_type: '', // IMPORTANT: Pas de valeur par défaut - l'utilisateur DOIT choisir
    password: '',
    password_confirmation: '',
    acceptTerms: false,
  });
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUserType, setCurrentUserType] = useState('Client');

  // Rotation automatique du contenu marketing
  useEffect(() => {
    if (!formData.user_type) {
      const userTypes = Object.keys(USER_TYPES_CONTENT);
      const interval = setInterval(() => {
        setCurrentUserType(prev => {
          const currentIndex = userTypes.indexOf(prev);
          const nextIndex = (currentIndex + 1) % userTypes.length;
          return userTypes[nextIndex];
        });
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [formData.user_type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Si l'utilisateur change le type, mettre à jour le contenu marketing
    if (name === 'user_type' && value) {
      setCurrentUserType(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Validation: user_type doit être choisi
    if (!formData.user_type) {
      setMessage('❌ Veuillez choisir votre rôle (Client ou Freelancer).');
      setIsLoading(false);
      return;
    }

    // Validation: genre doit être choisi
    if (!formData.genre) {
      setMessage('❌ Veuillez choisir votre genre (Homme ou Femme).');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setMessage('❌ Vous devez accepter les Conditions d\'Utilisation et la Politique de Confidentialité pour continuer.');
      setIsLoading(false);
      return;
    }

    // Validation: passwords doivent être identiques
    if (formData.password !== formData.password_confirmation) {
      setMessage('❌ Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {
      // Construire l'objet de données à envoyer
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        genre: formData.genre,
        ville: formData.ville, // Ville pour tous les utilisateurs
        user_type: formData.user_type,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };
      console.log("Données envoyées à l'API:", userData);

      // Appel à l'API d'inscription
      const response = await registerUser(userData);
      
      setMessage(`✅ Inscription réussie! Bienvenue ${formData.prenom}.`);
      
      // Stockage du token et des infos utilisateur
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_type', response.data.user.user_type);
        
        // Redirection selon le type d'utilisateur
        setTimeout(() => {
          const userType = response.data.user.user_type.toLowerCase();
          switch (userType) {
            case 'client':
              navigate('/client/dashboard');
              break;
            case 'freelancer':
              navigate('/freelancer/dashboard');
              break;
            default:
              navigate('/');
          }
        }, 1500);
      } else {
        // Si pas de token (peut-être rediriger vers login)
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setMessage(`❌ Erreur: ${error.response?.data?.message || error.message || 'Problème de connexion'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const content = USER_TYPES_CONTENT[currentUserType] || USER_TYPES_CONTENT.Client;

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
              <span className="text-xl">🚀</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Rejoignez Cleanix</h1>
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
          
          {/* Indicateurs de changement - seulement si pas de type sélectionné */}
          {!formData.user_type && (
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
          )}
          
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 border border-white/30 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Déjà membre ? Connectez-vous
            </span>
          </button>
          
          <div className="mt-6 flex items-center justify-center text-blue-100 text-sm">
            <div className="flex items-center mr-4">
              <span className="text-xl mr-1">🛡</span>
              <span className="font-semibold">Données Sécurisées</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="ml-4">
              <span className="font-semibold">RGPD</span> Compliant
            </div>
          </div>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-5 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Créez votre compte</h2>
            <p className="text-sm text-gray-600">Rejoignez la communauté Cleanix en quelques étapes</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                <input 
                  type="text" 
                  name="prenom" 
                  value={formData.prenom} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                <input 
                  type="text" 
                  name="nom" 
                  value={formData.nom} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                placeholder="exemple@email.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
              <input 
                type="tel" 
                name="telephone" 
                value={formData.telephone} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                placeholder="06 XX XX XX XX"
              />
            </div>

            {/* Genre et Ville sur la même ligne */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Genre *</label>
                <div className="flex space-x-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="genre" 
                      value="Homme" 
                      checked={formData.genre === 'Homme'} 
                      onChange={handleChange} 
                      className="h-3.5 w-3.5 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Homme</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="genre" 
                      value="Femme" 
                      checked={formData.genre === 'Femme'} 
                      onChange={handleChange} 
                      className="h-3.5 w-3.5 text-pink-600 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Femme</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ville *</label>
                <select 
                  name="ville" 
                  value={formData.ville} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition appearance-none bg-white"
                >
                  {MAROC_VILLES.map((ville, index) => (
                    <option key={index} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type d'utilisateur */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Je m'inscris en tant que *</label>
              <div className="flex space-x-3">
                {Object.keys(USER_TYPES_CONTENT).map((type) => (
                  <label 
                    key={type}
                    className={`flex-1 cursor-pointer p-3 rounded-lg text-xs font-medium transition-all text-center ${
                      formData.user_type === type
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="user_type" 
                      value={type} 
                      checked={formData.user_type === type} 
                      onChange={handleChange} 
                      className="hidden"
                    />
                    {type === 'Client' ? 'Je suis un Client' : 'Je suis Freelancer'}
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="password_confirmation" 
                  value={formData.password_confirmation} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                name="acceptTerms" 
                checked={formData.acceptTerms} 
                onChange={handleChange} 
                className="h-3.5 w-3.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5"
              />
              <label className="ml-2 text-xs text-gray-700">
                J'accepte les{' '}
                <Link to="/terms" className="text-teal-600 hover:text-teal-800 font-medium">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-teal-600 hover:text-teal-800 font-medium">
                  Politique de confidentialité
                </Link>
              </label>
            </div>
            
            {/* Submit button */}
            <div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-white mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création du compte...
                  </div>
                ) : 'Créer mon compte'}
              </button>
            </div>
            
            {message && (
              <div className={`p-3 rounded text-center text-xs ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Déjà membre ?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="font-semibold text-teal-600 hover:text-teal-800 transition-colors"
              >
                Connectez-vous
              </button>
            </p>
            
            <p className="text-xs text-gray-500 mt-2">
              En créant un compte, vous acceptez nos{' '}
              <Link to="/terms" className="text-teal-600 hover:text-teal-800">Conditions d'utilisation</Link> 
              {' '}et notre{' '}
              <Link to="/privacy" className="text-teal-600 hover:text-teal-800">Politique de confidentialité</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}