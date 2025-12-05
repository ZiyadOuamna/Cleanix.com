import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Client, 1: Freelancer, 2: Support, 3: Superviseur
  const navigate = useNavigate();

  // Auto-rotation des slides toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
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
      // Appel à l'API de connexion
      const response = await loginUser(credentials);
      
      // Stocker les données d'authentification
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('user_type', response.data.user.user_type);

      setMessage(`✅ Connexion réussie! Bienvenue ${response.data.user.prenom}.`);
      
      // Redirection en fonction du type d'utilisateur
      setTimeout(() => {
        const userType = response.data.user.user_type;
        if (userType === 'Client') {
          navigate('/client/dashboard');
        } else if (userType === 'Freelancer') {
          navigate('/freelancer/dashboard');
        } else if (userType === 'Support') {
          navigate('/support/dashboard');
        } else if (userType === 'Superviseur') {
          navigate('/superviseur/dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setMessage(`❌ Erreur: ${error.response?.data?.message || error.message || 'Identifiants invalides'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Contenu pour chaque type d'utilisateur
  const slideContents = [
    {
      title: 'Bienvenue de retour, cher Client !',
      description: 'Reconnectez-vous pour profiter de nos services de nettoyage premium. Réservez un nettoyage rapide, suivez vos commandes et bénéficiez d\'offres exclusives pour une maison toujours impeccable.',
      benefits: [
        { icon: '🕒', title: 'Réservations Instantanées', desc: 'Commandez en un clic et recevez un service professionnel.' },
        { icon: '💸', title: 'Tarifs Avantageux', desc: 'Profitez de réductions pour vos commandes régulières.' },
        { icon: '🔒', title: 'Sécurité Garantie', desc: 'Vos données et paiements sont protégés.' },
      ],
      testimonial: '"Cleanix rend ma vie plus facile ! Je réserve en ligne et tout est parfait." - Ahmed, Client à Casablanca',
      icon: '👤',
    },
    {
      title: 'Bienvenue, Freelancer Ambitionneux !',
      description: 'Connectez-vous pour accepter des missions, gérer vos revenus et développer votre activité. Plus de clients, plus de profits – rejoignez notre réseau et faites croître votre business de nettoyage.',
      benefits: [
        { icon: '🕒', title: 'Missions Flexibles', desc: 'Choisissez vos horaires et gagnez selon vos disponibilités.' },
        { icon: '💸', title: 'Revenus Boostés', desc: 'Augmentez vos profits avec des commissions attractives.' },
        { icon: '🔒', title: 'Plateforme Fiable', desc: 'Gérez vos missions et paiements en toute sécurité.' },
      ],
      testimonial: '"Grâce à Cleanix, j\'ai doublé mes revenus en quelques mois !" - Karim, Freelancer à Rabat',
      icon: '💼',
    },
    {
      title: 'Bienvenue, Support Agent !',
      description: 'Connectez-vous à votre interface d\'administration. Gérez les tickets clients, répondez aux demandes d\'assistance et assurez la satisfaction de nos utilisateurs avec un support exemplaire.',
      benefits: [
        { icon: '📞', title: 'Support Réactif', desc: 'Gérez efficacement les demandes clients.' },
        { icon: '📊', title: 'Dashboard Complet', desc: 'Accédez aux statistiques et rapports en temps réel.' },
        { icon: '🔒', title: 'Plateforme Sécurisée', desc: 'Espace sécurisé pour l\'administration.' },
      ],
      testimonial: '"Grâce à ce système, je peux aider les clients rapidement et efficacement !" - Support Team',
      icon: '👨‍💼',
    },
    {
      title: 'Bienvenue, Superviseur !',
      description: 'Connectez-vous à votre interface de supervision. Supervisez les opérations, gérez les équipes, analysez les performances et prenez des décisions stratégiques pour l\'entreprise.',
      benefits: [
        { icon: '📊', title: 'Supervision Complète', desc: 'Vue d\'ensemble de toutes les opérations.' },
        { icon: '👥', title: 'Gestion d\'équipe', desc: 'Gérez et motivez vos équipes efficacement.' },
        { icon: '🔒', title: 'Contrôle Total', desc: 'Accès administrateur complet à la plateforme.' },
      ],
      testimonial: '"Avec ce dashboard, je peux gérer toute l\'entreprise facilement !" - Manager Principal',
      icon: '🎯',
    },
  ];

  const currentContent = slideContents[currentSlide];

  return (
    <div className="bg-gray-100 flex min-h-screen">
      {/* Right: Login Form with White Background */}
      <div className="lg:w-1/2 w-full flex justify-center items-center p-8 bg-white text-gray-900 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-pulse">🔐</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-bounce">✨</div>
        
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Connexion à Cleanix</h1>
          <p className="text-center text-gray-600 mb-8 text-sm">Connectez-vous pour accéder à votre compte</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="votre.email@exemple.com"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Votre mot de passe"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" id="remember" name="remember" className="h-4 w-4 text-blue-600 border-gray-300" />
              <label htmlFor="remember" className="text-gray-700 ml-2 text-sm">Se souvenir de moi</label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">Mot de passe oublié ?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:bg-gray-400"
            >
              {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
            </button>
          </form>
          
          {message && <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          
          {/* Sign up Link */}
          <p className="mt-6 text-center text-sm">
            Nouveau sur Cleanix ? <a onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Inscrivez-vous ici</a>
          </p>
        </div>
      </div>
      
      {/* Left: Dynamic Marketing Section - 4 Slides (Client, Freelancer, Support, Superviseur) */}
      <div className="w-1/2 h-screen hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-gray-700 via-slate-800 to-gray-900 text-white p-12 relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 bg-black bg-opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-600 opacity-10"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-10 left-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3s' }}>🧹</div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-spin" style={{ animationDuration: '10s' }}>🏠</div>
        
        {/* Content Container */}
        <div className="relative z-10 text-center max-w-md">
          <div className="text-5xl mb-4">{currentContent.icon}</div>
          <h1 className="text-4xl font-extrabold mb-6 text-white">{currentContent.title}</h1>
          <p className="text-lg mb-8 leading-relaxed text-gray-300">{currentContent.description}</p>
          
          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            {currentContent.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-4 bg-white bg-opacity-10 p-4 rounded-lg hover:bg-opacity-20 transition-all duration-500 transform hover:scale-105 shadow-sm">
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Testimonial */}
          <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8 shadow-sm">
            <p className="italic text-base text-white">{currentContent.testimonial}</p>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-blue-400 w-8' : 'bg-gray-500 w-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
