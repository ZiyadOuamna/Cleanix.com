import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

// Liste des principales villes du Maroc pour la liste déroulante
const MAROC_VILLES = [
  "Agadir", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Mohammadia"
];

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // État du formulaire avec les champs corrects
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    genre: '', // Pas de valeur par défaut - doit être choisi
    user_type: '', // IMPORTANT: Pas de valeur par défaut - l'utilisateur DOIT choisir
    password: '',
    password_confirmation: '',
    acceptTerms: false,
    // Champs Client (optionnels, affichés si user_type === 'Client')
    adresse: '',
    ville: MAROC_VILLES[0],
    code_postal: '',
    // Champs Freelancer (optionnels, affichés si user_type === 'Freelancer')
    details_compte_bancaire: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        user_type: formData.user_type,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      // Ajouter les champs Client si user_type === 'Client'
      if (formData.user_type === 'Client') {
        userData.adresse = formData.adresse;
        userData.ville = formData.ville;
        userData.code_postal = formData.code_postal;
      }

      // Ajouter les champs Freelancer si user_type === 'Freelancer'
      if (formData.user_type === 'Freelancer') {
        userData.details_compte_bancaire = formData.details_compte_bancaire;
      }

      console.log("Données envoyées à l'API:", userData);

      // Appel à l'API d'inscription
      const response = await registerUser(userData);
      
      setMessage(`✅ Inscription réussie! Bienvenue ${formData.prenom}.`);
      // Redirection après 2 secondes
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setMessage(`❌ Erreur: ${error.response?.data?.message || error.message || 'Problème de connexion'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Contenu marketing dynamique selon le type de compte
  const getMarketingContent = () => {
    if (formData.user_type === 'Client') {
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
    } else if (formData.user_type === 'Freelancer') {
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
        <div className="absolute inset-0 bg-black bg-opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-600 opacity-10"></div>
        <div className="absolute top-10 left-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3s' }}>🧹</div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-spin" style={{ animationDuration: '10s' }}>🏠</div>
        
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 text-white animate-fade-in" style={{ animationDuration: '2s' }}>{content.title}</h1>
          <p className="text-lg mb-8 leading-relaxed text-gray-300">{content.description}</p>
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
          <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8 shadow-sm">
            <p className="italic text-base text-white">{content.testimonial}</p>
          </div>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-500 transform hover:scale-105 shadow-md">
            Déjà Membre ? Connectez-vous !
          </button>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="lg:w-1/2 w-full flex justify-center items-center p-8 bg-white text-gray-900 relative overflow-hidden">
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-pulse">📝</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-bounce">✨</div>
        
        <div className="relative z-10 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">S'inscrire à Cleanix</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Ligne 1: Nom et Prénom */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Votre nom" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Votre prénom" />
              </div>
            </div>
            
            {/* Ligne 2: Email et Téléphone */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="votre.email@exemple.com" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Votre téléphone" />
              </div>
            </div>

            {/* Ligne 3: Genre et Rôle (IMPORTANT: Choix obligatoire) */}
            <div className="space-y-4">
              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="genre" value="Homme" checked={formData.genre === 'Homme'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Homme</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="genre" value="Femme" checked={formData.genre === 'Femme'} onChange={handleChange} className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500" />
                    <span className="ml-2 text-gray-700">Femme</span>
                  </label>
                </div>
              </div>

              {/* Choix du Type de Compte - OBLIGATOIRE */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Quel est votre rôle ? *</label>
                <div className="flex space-x-4">
                  <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg w-full transition ${formData.user_type === 'Client' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}>
                    <input type="radio" name="user_type" value="Client" checked={formData.user_type === 'Client'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="font-medium text-gray-900">Je suis un Client</span>
                  </label>
                  <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg w-full transition ${formData.user_type === 'Freelancer' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-green-400'}`}>
                    <input type="radio" name="user_type" value="Freelancer" checked={formData.user_type === 'Freelancer'} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                    <span className="font-medium text-gray-900">Je suis Freelancer</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Champs Client - Affichés si user_type === 'Client' */}
            {formData.user_type === 'Client' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
                <h3 className="font-semibold text-gray-900">Informations Client</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Votre adresse" />
                </div>

                <div className="flex space-x-4">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-700">Ville</label>
                    <select name="ville" value={formData.ville} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
                      {MAROC_VILLES.map((ville, index) => (
                        <option key={index} value={ville}>{ville}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                    <input type="text" name="code_postal" value={formData.code_postal} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Ex: 20000" />
                  </div>
                </div>
              </div>
            )}

            {/* Champs Freelancer - Affichés si user_type === 'Freelancer' */}
            {formData.user_type === 'Freelancer' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
                <h3 className="font-semibold text-gray-900">Informations Freelancer</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Détails du Compte Bancaire</label>
                  <textarea name="details_compte_bancaire" value={formData.details_compte_bancaire} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition" placeholder="IBAN, numéro de compte, titulaire, etc." rows="3" />
                </div>
                <p className="text-xs text-gray-600">Note: Nombre de missions, note moyenne, et nombre d'avis seront initialisés automatiquement.</p>
              </div>
            )}

            {/* Mots de passe */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Votre mot de passe" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Confirmation</label>
                <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Confirmer" />
              </div>
            </div>

            {/* Checkboxes Termes */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} required className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1" />
                <span className="text-sm text-gray-700 leading-relaxed">J'accepte les <a href="#" className="text-blue-600 hover:underline">Conditions d'Utilisation</a> et la <a href="#" className="text-blue-600 hover:underline">Politique de Confidentialité</a>.</span>
              </label>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:bg-gray-400">
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
          
          {message && <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          
          <p className="mt-4 text-center text-sm">
            Déjà un compte ? <a onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  );
}
