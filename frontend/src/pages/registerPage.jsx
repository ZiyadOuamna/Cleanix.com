import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Liste des principales villes du Maroc pour la liste déroulante
const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammedia"
];

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // Tous les champs que tu as définis
  const [formData, setFormData] = useState({
    cin: '',
    name: '',
    prenom: '',
    tel: '',
    type_compte: 'client', // Valeur par défaut
    ville: MAROC_VILLES[0], // Valeur par défaut
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonction générale pour mettre à jour l'état
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      // NOTE: Dans le code réel, on va appeler registerUser(formData);
      console.log("Données envoyées à l'API:", formData); 
      
      setMessage(`✅ Inscription envoyée! Type: ${formData.type_compte}.`);
      setTimeout(() => navigate('/login'), 2000); // Rediriger après 2s
      
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error.response?.data);
      setMessage(`❌ Erreur: ${error.response?.data?.message || 'Problème de connexion'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Contenu dynamique pour la section gauche selon le type_compte
  const getMarketingContent = () => {
    if (formData.type_compte === 'client') {
      return {
        title: 'Rejoignez Cleanix en tant que Client !',
        description: 'Inscrivez-vous pour accéder à nos services de nettoyage premium. Réservez des professionnels vérifiés, bénéficiez de tarifs avantageux et profitez d\'une tranquillité d\'esprit totale pour votre maison.',
        benefits: [
          { icon: '🕒', title: 'Réservations Rapides', desc: 'Commandez en quelques clics et recevez un service impeccable.' },
          { icon: '💸', title: 'Prix Transparents', desc: 'Économisez avec nos offres exclusives pour nouveaux clients.' },
          { icon: '🔒', title: 'Sécurité Assurée', desc: 'Vos données et paiements sont protégés.' },
        ],
        testimonial: '"S\'inscrire chez Cleanix a changé ma vie ! Tout est si simple et propre." - Ahmed, Nouveau Client à Casablanca',
      };
    } else if (formData.type_compte === 'freelancer') {
      return {
        title: 'Devenez Freelancer chez Cleanix !',
        description: 'Inscrivez-vous pour travailler à votre rythme, accepter des missions flexibles et booster vos revenus. Rejoignez notre réseau et développez votre business de nettoyage avec des clients réguliers.',
        benefits: [
          { icon: '🕒', title: 'Horaires Flexibles', desc: 'Choisissez vos missions et gagnez selon vos disponibilités.' },
          { icon: '💸', title: 'Revenus Boostés', desc: 'Augmentez vos profits avec des commissions attractives et des primes.' },
          { icon: '🔒', title: 'Plateforme Fiable', desc: 'Gérez vos missions et paiements en toute sécurité.' },
        ],
        testimonial: '"En m\'inscrivant, j\'ai doublé mes gains en quelques semaines !" - Karim, Nouveau Freelancer à Rabat',
      };
    }
    // Par défaut, si aucun type sélectionné (mais type_compte a une valeur par défaut)
    return {
      title: 'Bienvenue chez Cleanix !',
      description: 'Découvrez une expérience de nettoyage sereine et professionnelle. Rejoignez notre communauté pour des espaces impeccables et une tranquillité d\'esprit.',
      benefits: [
        { icon: '🕒', title: 'Rapide & Efficace', desc: 'Réservations en quelques clics' },
        { icon: '💸', title: 'Économique', desc: 'Prix transparents et justes' },
        { icon: '🔒', title: 'Fiable', desc: 'Professionnels vérifiés' },
      ],
      testimonial: '"Cleanix apporte une touche de sérénité à mon quotidien. Tout est si propre et facile !" - Fatima, Cliente à Marrakech',
    };
  };

  const content = getMarketingContent();

  return (
    <div className="bg-gray-100 flex min-h-screen">
      {/* Left: Dynamic Marketing Section */}
      <div className="w-1/2 h-screen hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-gray-700 via-slate-800 to-gray-900 text-white p-12 relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 bg-black bg-opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-600 opacity-10"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-10 left-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3s' }}>🧹</div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-spin" style={{ animationDuration: '10s' }}>🏠</div>
        
        {/* Dynamic Hero Content */}
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 text-white animate-fade-in" style={{ animationDuration: '2s' }}>{content.title}</h1>
          <p className="text-lg mb-8 leading-relaxed text-gray-300">
            {content.description}
          </p>
          
          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            {content.benefits.map((benefit, index) => (
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
            <p className="italic text-base text-white">{content.testimonial}</p>
          </div>
          
          {/* Call to Action Button */}
          <button 
            onClick={() => navigate('/login')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-500 transform hover:scale-105 shadow-md"
          >
            Déjà Membre ? Connectez-vous !
          </button>
        </div>
      </div>

      {/* Right: Registration Form with White Background */}
      <div className="lg:w-1/2 w-full flex justify-center items-center p-8 bg-white text-gray-900 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-pulse">📝</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-bounce">✨</div>
        
        <div className="relative z-10 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">S'inscrire à Cleanix</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Ligne 1: Nom et Prénom */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Votre nom"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input 
                  type="text" 
                  name="prenom" 
                  value={formData.prenom} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Votre prénom"
                />
              </div>
            </div>
            
            {/* Ligne 2: CIN et Téléphone */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">CIN</label>
                <input 
                  type="text" 
                  name="cin" 
                  value={formData.cin} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Votre CIN"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input 
                  type="tel" 
                  name="tel" 
                  value={formData.tel} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Votre téléphone"
                />
              </div>
            </div>

            {/* Ligne 3: Choix de la Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
              >
                <option value="" disabled className="text-gray-500">Sélectionner une ville</option>
                {MAROC_VILLES.map((ville, index) => (
                  <option key={index} value={ville} className="text-gray-900">
                    {ville}
                  </option>
                ))}
              </select>
            </div>

            {/* Ligne 4: Choix du Type de Compte */}
            <div className="pt-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">Quel est votre rôle ?</label>
              <div className="flex space-x-6">
                
                {/* Choix 1: Client */}
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-300 rounded-lg bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition w-full">
                  <input
                    type="radio"
                    name="type_compte"
                    value="client"
                    checked={formData.type_compte === 'client'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">Je suis un Client</span>
                </label>
                
                {/* Choix 2: Freelancer */}
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-300 rounded-lg bg-gray-50 hover:border-green-400 hover:bg-green-50 transition w-full">
                  <input
                    type="radio"
                    name="type_compte"
                    value="freelancer"
                    checked={formData.type_compte === 'freelancer'}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="font-medium text-gray-900">Je suis un Freelancer</span>
                </label>

              </div>
            </div>
            
            {/* Ligne 5: Email */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="votre.email@exemple.com"
              />
            </div>

            {/* Ligne 6: Mots de passe */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Votre mot de passe"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  name="password_confirmation" 
                  value={formData.password_confirmation} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
          
          {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
          
          <p className="mt-4 text-center text-sm">
            Déjà un compte ? <a onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  );
}
