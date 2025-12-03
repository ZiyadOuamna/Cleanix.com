import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  Camera, Edit2, MapPin, Calendar, Star, Award, Briefcase, 
  Mail, Phone, Globe, Users, Search, X, Filter,
  Download, Upload, Check, Settings, Shield, UserPlus,
  MessageCircle, Share2, Bookmark, Heart, Trash2, Eye,
  Plus, ChevronRight, Image, Video, FileText, MoreVertical
} from 'lucide-react';
import { FreelancerContext } from './freelancerContext';
import { useNavigate } from 'react-router-dom';

const ProfileFreelancer = () => {
  const { 
    user, 
    rating,
    isDarkMode,
    setIsDarkMode
  } = useContext(FreelancerContext);
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Marie',
    lastName: 'Martin',
    title: 'Spécialiste en Nettoyage Résidentiel & Bureau',
    bio: 'Freelance passionnée par le nettoyage avec 5 ans d\'expérience. J\'aime rendre les espaces propres et accueillants. Qualité et satisfaction client sont mes priorités.',
    location: 'Paris, France',
    email: 'marie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    website: 'www.cleanix-pro.fr',
    joinDate: 'Mars 2023',
    languages: ['Français', 'Anglais', 'Espagnol'],
    availability: 'Disponible maintenant',
    hourlyRate: '35€/h',
    responseTime: 'Moins de 2h'
  });

  const [stats, setStats] = useState({
    completedJobs: 156,
    repeatClients: 42,
    responseRate: 98,
    onTimeRate: 96,
    satisfaction: 99,
    followers: 245,
    following: 128
  });

  // États pour les images
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // États pour les followers
  const [followers, setFollowers] = useState([
    { id: 1, name: 'Jean Dupont', username: '@jeandupont', avatar: 'JD', isFollowing: true },
    { id: 2, name: 'Sophie Laurent', username: '@sophiel', avatar: 'SL', isFollowing: true },
    { id: 3, name: 'Pierre Bernard', username: '@pierre_b', avatar: 'PB', isFollowing: true },
    { id: 4, name: 'Émilie Rousseau', username: '@emilier', avatar: 'ER', isFollowing: false },
    { id: 5, name: 'Thomas Martin', username: '@thomas_m', avatar: 'TM', isFollowing: true },
    { id: 6, name: 'Laura Dubois', username: '@laurad', avatar: 'LD', isFollowing: false },
  ]);
  const [searchFollowers, setSearchFollowers] = useState('');

  // États pour les services
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Nettoyage Complet',
      description: 'Nettoyage approfondi de toute la maison',
      price: 'À partir de 80€',
      rating: 4.9,
      reviews: 42,
      category: 'Résidentiel',
      status: 'active',
      images: []
    },
    {
      id: 2,
      title: 'Nettoyage Bureau',
      description: 'Nettoyage professionnel pour espaces de travail',
      price: 'À partir de 120€',
      rating: 4.8,
      reviews: 28,
      category: 'Commercial',
      status: 'active',
      images: []
    },
    {
      id: 3,
      title: 'Nettoyage Vitres',
      description: 'Nettoyage intérieur et extérieur des vitres',
      price: 'À partir de 60€',
      rating: 4.7,
      reviews: 35,
      category: 'Résidentiel',
      status: 'active',
      images: []
    },
  ]);

  // États pour les avis
  const [reviews, setReviews] = useState([
    {
      id: 1,
      clientId: 1,
      clientName: 'Jean Dupont',
      clientUsername: '@jeandupont',
      clientAvatar: 'JD',
      rating: 5,
      date: '15 Jan 2024',
      comment: 'Marie est exceptionnelle ! Mon appartement n\'a jamais été aussi propre. Professionnalisme et attention aux détails. Je recommande à 100% !',
      service: 'Nettoyage Complet',
      likes: 12,
      comments: 3,
      userLiked: false
    },
    {
      id: 2,
      clientId: 2,
      clientName: 'Sophie Laurent',
      clientUsername: '@sophiel',
      clientAvatar: 'SL',
      rating: 5,
      date: '12 Jan 2024',
      comment: 'Service impeccable. Marie est très minutieuse et respectueuse de l\'espace. Les vitres sont parfaitement propres !',
      service: 'Nettoyage Vitres',
      likes: 8,
      comments: 1,
      userLiked: true
    },
    {
      id: 3,
      clientId: 3,
      clientName: 'Pierre Bernard',
      clientUsername: '@pierre_b',
      clientAvatar: 'PB',
      rating: 4,
      date: '10 Jan 2024',
      comment: 'Très bon travail de nettoyage du bureau. Ponctuelle et efficace. Je ferai appel à ses services régulièrement.',
      service: 'Nettoyage Bureau',
      likes: 5,
      comments: 0,
      userLiked: false
    },
  ]);
  const [searchReviews, setSearchReviews] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');

  // États pour le portfolio
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      serviceId: 1,
      serviceTitle: 'Nettoyage Complet',
      clientName: 'Jean Dupont',
      date: '15 Jan 2024',
      beforeImages: ['before1.jpg', 'before2.jpg'],
      afterImages: ['after1.jpg', 'after2.jpg'],
      description: 'Appartement 3 pièces après déménagement'
    },
    {
      id: 2,
      serviceId: 2,
      serviceTitle: 'Nettoyage Bureau',
      clientName: 'Pierre Bernard',
      date: '10 Jan 2024',
      beforeImages: ['before3.jpg'],
      afterImages: ['after3.jpg'],
      description: 'Bureau d\'entreprise - 200m²'
    },
    {
      id: 3,
      serviceId: 1,
      serviceTitle: 'Nettoyage Complet',
      clientName: 'Sophie Laurent',
      date: '12 Jan 2024',
      beforeImages: ['before4.jpg'],
      afterImages: ['after4.jpg', 'after5.jpg'],
      description: 'Maison de campagne - nettoyage printemps'
    },
  ]);

  // États pour les actions utilisateur
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Gestion des images
  const handleFileUpload = (type) => {
    const input = type === 'profile' ? fileInputRef : bannerInputRef;
    input.current.click();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImage(reader.result);
        } else {
          setBannerImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'profile') {
      setProfileImage(null);
    } else {
      setBannerImage(null);
    }
  };

  // Sauvegarder le profil
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Ici, normalement, vous enverriez les données à votre API
    alert('Profil mis à jour avec succès!');
  };

  // Partager le profil
  const handleSocialShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez le profil de ${profileData.firstName} ${profileData.lastName} sur Cleanix`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Profil Cleanix',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien du profil copié dans le presse-papier!');
    }
  };

  // Gestion des followers
  const filteredFollowers = followers.filter(follower => 
    follower.name.toLowerCase().includes(searchFollowers.toLowerCase()) ||
    follower.username.toLowerCase().includes(searchFollowers.toLowerCase())
  );

  const handleFollowToggle = (followerId) => {
    setFollowers(followers.map(follower => 
      follower.id === followerId 
        ? { ...follower, isFollowing: !follower.isFollowing }
        : follower
    ));
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Gestion des avis
  const handleReviewLike = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            likes: review.userLiked ? review.likes - 1 : review.likes + 1,
            userLiked: !review.userLiked
          }
        : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.clientName.toLowerCase().includes(searchReviews.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchReviews.toLowerCase()) ||
      review.service.toLowerCase().includes(searchReviews.toLowerCase());
    
    const matchesFilter = 
      reviewFilter === 'all' || 
      review.service === reviewFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Gestion du portfolio
  const handleDeletePortfolioItem = (itemId) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== itemId));
  };

  const handleEditPortfolioItem = (itemId) => {
    // Ici, normalement, vous ouvririez un modal pour éditer
    alert(`Édition de l'item ${itemId}`);
  };

  // Gestion des services
  const handleDeleteService = (serviceId) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const handleEditService = (serviceId) => {
    // Ici, normalement, vous ouvririez un modal pour éditer
    alert(`Édition du service ${serviceId}`);
  };

  // Rendu des étoiles
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  // Composant pour les cartes de statistiques
  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('text-', '')} size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );

  // Tabs content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Informations */}
            <div className="lg:col-span-2 space-y-6">
              {/* À propos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">À propos</h3>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <Edit2 size={14} />
                    Modifier
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">{profileData.bio}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Spécialité</p>
                      <p className="font-medium dark:text-white">Nettoyage Résidentiel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expérience</p>
                      <p className="font-medium dark:text-white">5 ans</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Certifications</p>
                      <p className="font-medium dark:text-white">HACCP, Éco-certifié</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Langues</p>
                      <p className="font-medium dark:text-white">{profileData.languages.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Statistiques */}
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold dark:text-white mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <StatCard
                    icon={Check}
                    value={stats.completedJobs}
                    label="Travaux terminés"
                    color="text-green-600"
                  />
                  <StatCard
                    icon={Users}
                    value={stats.followers}
                    label="Followers"
                    color="text-blue-600"
                  />
                  <StatCard
                    icon={MessageCircle}
                    value={`${stats.responseRate}%`}
                    label="Taux de réponse"
                    color="text-purple-600"
                  />
                  <StatCard
                    icon={Calendar}
                    value={`${stats.onTimeRate}%`}
                    label="À l'heure"
                    color="text-orange-600"
                  />
                </div>
              </div>

              {/* Disponibilité */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold dark:text-white mb-4">Disponibilité</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Statut</span>
                    <span className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      {profileData.availability}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tarif horaire</span>
                    <span className="font-medium dark:text-white">{profileData.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Temps de réponse</span>
                    <span className="font-medium dark:text-white">{profileData.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'followers':
        return (
          <div className="space-y-6">
            {/* Statistiques followers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold dark:text-white">{stats.followers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <UserPlus className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold dark:text-white">{stats.following}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Users className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold dark:text-white">{followers.filter(f => f.isFollowing).length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Abonnés mutuels</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des followers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold dark:text-white">Liste des Followers</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Rechercher un follower..."
                        value={searchFollowers}
                        onChange={(e) => setSearchFollowers(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white w-full md:w-64"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFollowers.map((follower) => (
                  <div key={follower.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigateToProfile(follower.id)}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {follower.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {follower.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{follower.username}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(follower.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          follower.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {follower.isFollowing ? '✓ Suivi' : 'Suivre'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredFollowers.length === 0 && (
                  <div className="p-6 text-center">
                    <Users className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600 dark:text-gray-400">Aucun follower trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* En-tête avec filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-2">
                    Avis Clients ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    {renderStars(4.8)}
                    <span className="font-semibold dark:text-white ml-2">4.8/5</span>
                    <span className="text-gray-500 dark:text-gray-400">sur {reviews.length} avis</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un avis..."
                      value={searchReviews}
                      onChange={(e) => setSearchReviews(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white w-full"
                    />
                  </div>
                  
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                  >
                    <option value="all">Tous les services</option>
                    <option value="Nettoyage Complet">Nettoyage Complet</option>
                    <option value="Nettoyage Bureau">Nettoyage Bureau</option>
                    <option value="Nettoyage Vitres">Nettoyage Vitres</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des avis */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigateToProfile(review.clientId)}
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.clientAvatar}
                      </div>
                      <div>
                        <h4 className="font-semibold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {review.clientName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{review.clientUsername}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Service : <span className="font-medium dark:text-white">{review.service}</span>
                    </span>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleReviewLike(review.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
                          review.userLiked
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart size={16} className={review.userLiked ? 'fill-current' : ''} />
                        <span className="text-sm">{review.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition">
                        <MessageCircle size={16} />
                        <span className="text-sm">{review.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Star className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold dark:text-white mb-2">Aucun avis trouvé</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucun avis ne correspond à votre recherche ou filtre.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">Portfolio & Galerie</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <Plus size={16} />
                  Ajouter des photos
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                Ajoutez des photos avant/après de vos travaux pour montrer votre expertise.
              </p>
            </div>

            {/* Liste des projets */}
            <div className="space-y-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* En-tête du projet */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold dark:text-white">{item.serviceTitle}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Pour {item.clientName} • {item.date}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPortfolioItem(item.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition"
                        >
                          <Edit2 size={14} />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-700 dark:text-gray-300">{item.description}</p>
                  </div>

                  {/* Galerie avant/après */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Avant */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <h5 className="font-medium dark:text-white">Avant</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {item.beforeImages.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Après */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h5 className="font-medium dark:text-white">Après</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {item.afterImages.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {portfolioItems.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Image className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold dark:text-white mb-2">Aucun projet dans le portfolio</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ajoutez des photos de vos travaux pour montrer votre expertise.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <Plus size={16} />
                    Ajouter un projet
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">

            {/* Liste des services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                  {/* En-tête du service */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold dark:text-white mb-2">{service.title}</h4>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-300">
                          {service.category}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">{service.price}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(service.rating)}
                        <span className="text-sm text-gray-500">({service.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer avec statut */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{service.status}</span>
                      </div>
                      
                      <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Voir les détails
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {services.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold dark:text-white mb-2">Aucun service publié</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ajoutez des services pour commencer à recevoir des commandes.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <Plus size={16} />
                    Publier votre premier service
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Modal pour modifier le profil
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">Modifier le profil</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Modifier les images */}
            <div className="space-y-4">
              <h3 className="font-medium dark:text-white">Photos</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Photo de profil */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Photo de profil</label>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserPlus size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleFileUpload('profile')}
                        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow"
                      >
                        <Camera size={16} />
                      </button>
                      {profileImage && (
                        <button
                          onClick={() => handleRemoveImage('profile')}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bannière */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Bannière</label>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {bannerImage ? (
                      <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleFileUpload('banner')}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <Camera size={16} />
                      </button>
                      {bannerImage && (
                        <button
                          onClick={() => handleRemoveImage('banner')}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informations */}
            <div className="space-y-4">
              <h3 className="font-medium dark:text-white">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Prénom</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Titre</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white resize-none"
                />
              </div>
            </div>
            
            {/* Boutons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Inputs fichiers cachés */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'profile')}
      />
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'banner')}
      />

      {/* Bannière */}
      <div className="relative mb-20">
        <div 
          className="h-64 w-full rounded-t-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
          style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-xl" />
          
          {/* Boutons pour la bannière */}
          <div className="absolute top-4 right-4 flex gap-2">
            {bannerImage && (
              <button
                onClick={() => handleRemoveImage('banner')}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-2 rounded-lg shadow-lg transition flex items-center gap-2"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            )}
            <button
              onClick={() => handleFileUpload('banner')}
              className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-2 rounded-lg shadow-lg transition flex items-center gap-2"
            >
              <Camera size={16} />
              <span className="text-sm font-medium">Modifier</span>
            </button>
          </div>
        </div>

        {/* Photo de profil */}
        <div className="absolute -bottom-16 left-6 md:left-8">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Boutons pour la photo de profil */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              {profileImage && (
                <button
                  onClick={() => handleRemoveImage('profile')}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              )}
              <button
                onClick={() => handleFileUpload('profile')}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions - Empêcher de se suivre soi-même */}
        <div className="absolute right-6 md:right-8 -bottom-12 flex items-center gap-3">
          <button
            onClick={handleSocialShare}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Share2 size={16} />
            Partager
          </button>
        </div>
      </div>

      {/* Infos principales */}
      <div className="px-6 md:px-8 mt-4">
        {/* Nom et titre */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{profileData.title}</p>
        </div>

        {/* Localisation et note */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{profileData.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-semibold dark:text-white">{rating}</span>
            <span className="text-gray-500 dark:text-gray-400">({reviews.length} avis)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Check size={16} className="text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{profileData.availability}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users size={16} className="text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">{stats.followers} followers</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'about', label: 'À propos' },
              { id: 'followers', label: 'Followers' },
              { id: 'reviews', label: 'Avis' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'services', label: 'Services' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        {renderTabContent()}

        {/* Actions mobiles */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFreelancer;