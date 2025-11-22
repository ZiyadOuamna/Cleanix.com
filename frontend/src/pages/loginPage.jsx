import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState('client'); // Slide actuel : 'client' ou 'freelancer'
  const [direction, setDirection] = useState('left'); // Direction du glissement : 'left' ou 'right'
  const navigate = useNavigate();

  // Effet pour changer de slide toutes les 5 secondes avec direction alternée
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = prevSlide === 'client' ? 'freelancer' : 'client';
        setDirection(prevSlide === 'client' ? 'left' : 'right'); // Alterner la direction
        return nextSlide;
      });
    }, 5000); // 5000 ms = 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, []);

  // Fonction pour naviguer manuellement
  const navigateSlide = (newSlide) => {
    const prevSlide = currentSlide;
    setCurrentSlide(newSlide);
    setDirection(newSlide === 'client' ? 'right' : 'left'); // Direction basée sur le changement
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulation d'une connexion (remplacez par votre logique API)
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        setMessage('Connexion réussie !');
        // Rediriger vers le dashboard
        navigate('/dashboard');
      } else {
        setMessage('Erreur : Vérifiez vos informations.');
      }
      setIsLoading(false);
    }, 2000);
  };

  // Contenu pour chaque slide
  const clientContent = {
    title: 'Bienvenue de retour, cher Client !',
    description: 'Reconnectez-vous pour profiter de nos services de nettoyage premium. Réservez un nettoyage rapide, suivez vos commandes et bénéficiez d\'offres exclusives pour une maison toujours impeccable.',
    benefits: [
      { icon: '🕒', title: 'Réservations Instantanées', desc: 'Commandez en un clic et recevez un service professionnel.' },
      { icon: '💸', title: 'Tarifs Avantageux', desc: 'Profitez de réductions pour vos commandes régulières.' },
      { icon: '🔒', title: 'Sécurité Garantie', desc: 'Vos données et paiements sont protégés.' },
    ],
    testimonial: '"Cleanix rend ma vie plus facile ! Je réserve en ligne et tout est parfait." - Ahmed, Client à Casablanca',
    ctaButton: 'S\'inscrire',
    ctaAction: () => navigate('/register'),
  };

  const freelancerContent = {
    title: 'Bienvenue, Freelancer Ambitionneux !',
    description: 'Connectez-vous pour accepter des missions, gérer vos revenus et développer votre activité. Plus de clients, plus de profits – rejoignez notre réseau et faites croître votre business de nettoyage.',
    benefits: [
      { icon: '🕒', title: 'Missions Flexibles', desc: 'Choisissez vos horaires et gagnez selon vos disponibilités.' },
      { icon: '💸', title: 'Revenus Boostés', desc: 'Augmentez vos profits avec des commissions attractives.' },
      { icon: '🔒', title: 'Plateforme Fiable', desc: 'Gérez vos missions et paiements en toute sécurité.' },
    ],
    testimonial: '"Grâce à Cleanix, j\'ai doublé mes revenus en quelques mois !" - Karim, Freelancer à Rabat',
    ctaButton: 'S\'inscrire',
    ctaAction: () => navigate('/register'),
  };

  return (
    <div className="bg-gray-100 flex min-h-screen">
      {/* Right: Login Form with White Background */}
      <div className="lg:w-1/2 w-full flex justify-center items-center p-8 bg-white text-gray-900 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-pulse">🔐</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-bounce">✨</div>
        
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Connexion à Cleanix</h1>
          
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
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" id="remember" name="remember" className="text-blue-600" />
              <label htmlFor="remember" className="text-gray-700 ml-2">Se souvenir de moi</label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-blue-600">
              <a href="./forgot-password" className="hover:underline">Mot de passe oublié ?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
            </button>
          </form>
          
          {message && <p className={`mt-4 text-center text-sm ${message.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          
          {/* Sign up Link */}
          <p className="mt-6 text-center text-sm">
            Nouveau sur Cleanix ? <a onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Inscrivez-vous ici</a>
          </p>
        </div>
      </div>
      
      {/* Left: Dynamic Marketing Section - Slides avec glissement */}
      <div className="w-1/2 h-screen hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-gray-700 via-slate-800 to-gray-900 text-white p-12 relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 bg-black bg-opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-600 opacity-10"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-10 left-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3s' }}>🧹</div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-spin" style={{ animationDuration: '10s' }}>🏠</div>
        
        {/* Slides Container avec glissement */}
        <div className="relative w-full max-w-md overflow-hidden">
          <div
            className={`flex transition-transform duration-1000 ${
              currentSlide === 'client'
                ? direction === 'left'
                  ? 'translate-x-0'
                  : 'translate-x-0'
                : direction === 'left'
                  ? '-translate-x-full'
                  : 'translate-x-full'
            }`}
          >
            {/* Slide Client */}
            <div className="w-full flex-shrink-0 text-center">
              <h1 className="text-4xl font-extrabold mb-6 text-white">{clientContent.title}</h1>
              <p className="text-lg mb-8 leading-relaxed text-gray-300">{clientContent.description}</p>
              
              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {clientContent.benefits.map((benefit, index) => (
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
                <p className="italic text-base text-white">{clientContent.testimonial}</p>
              </div>
              
              {/* Navigation Arrows and CTA Button */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigateSlide(currentSlide === 'client' ? 'freelancer' : 'client')}
                  className="text-white text-2xl hover:text-blue-300 transition"
                >
                  ←
                </button>
                <button 
                  onClick={clientContent.ctaAction} 
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-500 transform hover:scale-105 shadow-md"
                >
                  {clientContent.ctaButton}
                </button>
                <button
                  onClick={() => navigateSlide(currentSlide === 'client' ? 'freelancer' : 'client')}
                  className="text-white text-2xl hover:text-blue-300 transition"
                >
                  →
                </button>
              </div>
            </div>
            
            {/* Slide Freelancer */}
            <div className="w-full flex-shrink-0 text-center">
              <h1 className="text-4xl font-extrabold mb-6 text-white">{freelancerContent.title}</h1>
              <p className="text-lg mb-8 leading-relaxed text-gray-300">{freelancerContent.description}</p>
              
              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {freelancerContent.benefits.map((benefit, index) => (
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
                <p className="italic text-base text-white">{freelancerContent.testimonial}</p>
              </div>
              
              {/* Navigation Arrows and CTA Button */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigateSlide(currentSlide === 'client' ? 'freelancer' : 'client')}
                  className="text-white text-2xl hover:text-blue-300 transition"
                >
                  ←
                </button>
                <button 
                  onClick={freelancerContent.ctaAction} 
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-500 transform hover:scale-105 shadow-md"
                >
                  {freelancerContent.ctaButton}
                </button>
                <button
                  onClick={() => navigateSlide(currentSlide === 'client' ? 'freelancer' : 'client')}
                  className="text-white text-2xl hover:text-blue-300 transition"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
