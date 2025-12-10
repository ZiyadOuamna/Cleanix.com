import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  Camera, Edit2, MapPin, Calendar, Star, Award, Briefcase, 
  Mail, Phone, Globe, Users, Search, X, Filter,
  Download, Upload, Check, Settings, Shield, UserPlus,
  MessageCircle, Share2, Bookmark, Heart, Trash2, Eye,
  Plus, ChevronRight, Image, Video, FileText, MoreVertical,
  EyeOff, MessageSquare, Send, CreditCard, History, TrendingUp, DollarSign,
  ChevronDown, ChevronUp, MessageCircleReply
} from 'lucide-react';
import { ClientContext } from './clientContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProfileClient = () => {
  const { 
    user, 
    isDarkMode,
    setIsDarkMode
  } = useContext(ClientContext);
  
  const navigate = useNavigate();

  // Thème basé sur isDarkMode
  const theme = {
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    hoverBg: isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
    inputBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
  };

  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  
  // Données du profil client avec les informations de l'inscription
  const [profileData, setProfileData] = useState({
    firstName: user?.prenom || user?.name?.split(' ')[0] || 'Client',
    lastName: user?.nom || user?.name?.split(' ')[1] || 'Cleanix',
    title: 'Client Fidèle Cleanix',
    bio: 'Passionné par la propreté et la qualité des services. Je recherche toujours les meilleurs professionnels pour entretenir mes espaces.',
    location: user?.address || 'Paris, France',
    email: user?.email || 'client@email.com',
    phone: '+33 6 12 34 56 78',
    website: 'www.cleanix.com',
    joinDate: 'Janvier 2024',
    languages: ['Français', 'Anglais'],
    preferences: ['Nettoyage résidentiel', 'Nettoyage de printemps', 'Nettoyage vitres'],
    frequency: '2 fois par mois',
    averageRating: 4.8
  });

  const [stats, setStats] = useState({
    totalBookings: 24,
    totalSpent: 2450,
    reviewsGiven: 12,
    followers: 45,
    following: 18,
    satisfaction: 5,
    repeatFreelancers: 6 // Supprimé plus tard
  });

  // États pour les images
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // États pour les avis donnés
  const [reviews, setReviews] = useState([
    {
      id: 1,
      freelancerId: 1,
      freelancerName: 'Marie Martin',
      freelancerUsername: '@mariepro',
      freelancerAvatar: 'MM',
      rating: 5,
      date: '15 Jan 2024',
      comment: 'Excellent service ! Marie a nettoyé mon appartement impeccablement. Très professionnel et ponctuel.',
      service: 'Nettoyage Complet',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 2,
      freelancerId: 2,
      freelancerName: 'Pierre Dubois',
      freelancerUsername: '@pierre_clean',
      freelancerAvatar: 'PD',
      rating: 4,
      date: '10 Jan 2024',
      comment: 'Bon nettoyage des vitres. Très rapide et efficace.',
      service: 'Nettoyage Vitres',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 3,
      freelancerId: 3,
      freelancerName: 'Sophie Laurent',
      freelancerUsername: '@sophiel',
      freelancerAvatar: 'SL',
      rating: 5,
      date: '8 Jan 2024',
      comment: 'Service exceptionnel, je recommande vivement !',
      service: 'Nettoyage Bureau',
      clientComment: 'Merci pour votre service ! Je suis très satisfait.',
      clientCommentDate: '9 Jan 2024',
      isClientCommenting: false
    },
    {
      id: 4,
      freelancerId: 4,
      freelancerName: 'Thomas Bernard',
      freelancerUsername: '@thomas_b',
      freelancerAvatar: 'TB',
      rating: 5,
      date: '5 Jan 2024',
      comment: 'Très bon nettoyage après travaux.',
      service: 'Nettoyage Après Travaux',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 5,
      freelancerId: 5,
      freelancerName: 'Julie Moreau',
      freelancerUsername: '@juliem',
      freelancerAvatar: 'JM',
      rating: 4,
      date: '3 Jan 2024',
      comment: 'Service ponctuel et efficace.',
      service: 'Nettoyage Résidentiel',
      clientComment: 'Je confirme, très bon service !',
      clientCommentDate: '4 Jan 2024',
      isClientCommenting: false
    },
    {
      id: 6,
      freelancerId: 6,
      freelancerName: 'David Lefevre',
      freelancerUsername: '@davidl',
      freelancerAvatar: 'DL',
      rating: 5,
      date: '28 Dec 2023',
      comment: 'Excellent travail de nettoyage.',
      service: 'Nettoyage Complet',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 7,
      freelancerId: 7,
      freelancerName: 'Catherine Petit',
      freelancerUsername: '@catherinep',
      freelancerAvatar: 'CP',
      rating: 4,
      date: '25 Dec 2023',
      comment: 'Service rapide et de qualité.',
      service: 'Nettoyage Vitres',
      clientComment: 'Merci pour votre travail !',
      clientCommentDate: '26 Dec 2023',
      isClientCommenting: false
    },
    {
      id: 8,
      freelancerId: 8,
      freelancerName: 'Nicolas Dubois',
      freelancerUsername: '@nicolasd',
      freelancerAvatar: 'ND',
      rating: 5,
      date: '20 Dec 2023',
      comment: 'Service exceptionnel !',
      service: 'Nettoyage Bureau',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 9,
      freelancerId: 9,
      freelancerName: 'Isabelle Martin',
      freelancerUsername: '@isabellem',
      freelancerAvatar: 'IM',
      rating: 4,
      date: '15 Dec 2023',
      comment: 'Très satisfait du service.',
      service: 'Nettoyage Résidentiel',
      clientComment: '',
      clientCommentDate: '',
      isClientCommenting: false
    },
    {
      id: 10,
      freelancerId: 10,
      freelancerName: 'Marc Laurent',
      freelancerUsername: '@marcl',
      freelancerAvatar: 'ML',
      rating: 5,
      date: '10 Dec 2023',
      comment: 'Excellent service de nettoyage.',
      service: 'Nettoyage Après Travaux',
      clientComment: 'Merci beaucoup !',
      clientCommentDate: '11 Dec 2023',
      isClientCommenting: false
    }
  ]);

  // États pour les freelancers suivis
  const [following, setFollowing] = useState([
    { id: 1, name: 'Marie Martin', username: '@mariepro', avatar: 'MM', specialty: 'Nettoyage Résidentiel', rating: 4.9, isFollowing: true },
    { id: 2, name: 'Pierre Dubois', username: '@pierre_clean', avatar: 'PD', specialty: 'Nettoyage Vitres', rating: 4.7, isFollowing: true },
    { id: 3, name: 'Sophie Laurent', username: '@sophiel', avatar: 'SL', specialty: 'Nettoyage Bureau', rating: 4.8, isFollowing: true },
    { id: 4, name: 'Thomas Bernard', username: '@thomas_b', avatar: 'TB', specialty: 'Nettoyage Après Travaux', rating: 4.6, isFollowing: false },
  ]);

  // États pour les followers
  const [followers, setFollowers] = useState([
    { id: 1, name: 'Jean Dupont', username: '@jeand', avatar: 'JD', isFollowing: true },
    { id: 2, name: 'Sarah Cohen', username: '@sarahc', avatar: 'SC', isFollowing: false },
    { id: 3, name: 'Lucie Moreau', username: '@luciem', avatar: 'LM', isFollowing: true },
    { id: 4, name: 'Antoine Leroy', username: '@antoinel', avatar: 'AL', isFollowing: true },
    { id: 5, name: 'Emma Petit', username: '@emmap', avatar: 'EP', isFollowing: false },
  ]);
  
  const [searchFollowing, setSearchFollowing] = useState('');
  const [searchReviews, setSearchReviews] = useState('');
  const [searchFollowers, setSearchFollowers] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewDateFilter, setReviewDateFilter] = useState('recent');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllFollowing, setShowAllFollowing] = useState(false);
  const [showAllFollowers, setShowAllFollowers] = useState(false);

  // Ref pour les inputs de fichier dans le modal d'édition
  const modalFileInputRef = useRef(null);
  const modalBannerInputRef = useRef(null);

  // SweetAlert configuration
  const showAlert = (title, text, icon = 'success') => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#0891b2',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });
  };

  const showConfirm = (title, text, confirmButtonText = 'Oui', cancelButtonText = 'Non') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#ef4444',
      confirmButtonText,
      cancelButtonText,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });
  };

  // Gestion des images
  const handleFileUpload = (type, ref) => {
    const inputRef = ref || (type === 'profile' ? fileInputRef : bannerInputRef);
    if (inputRef.current) {
      inputRef.current.click();
    }
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
  const handleSaveProfile = async () => {
    const result = await Swal.fire({
      title: 'Enregistrer les modifications ?',
      text: 'Voulez-vous sauvegarder les modifications de votre profil ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });

    if (result.isConfirmed) {
      setIsEditing(false);
      showAlert('Profil mis à jour', 'Votre profil a été mis à jour avec succès !');
    }
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
      showAlert('Lien copié', 'Le lien du profil a été copié dans le presse-papier !');
    }
  };

  // Gestion des freelancers suivis
  const filteredFollowing = following.filter(freelancer => 
    freelancer.name.toLowerCase().includes(searchFollowing.toLowerCase()) ||
    freelancer.username.toLowerCase().includes(searchFollowing.toLowerCase()) ||
    freelancer.specialty.toLowerCase().includes(searchFollowing.toLowerCase())
  );

  const handleFollowToggle = async (freelancerId) => {
    const freelancer = following.find(f => f.id === freelancerId);
    const action = freelancer.isFollowing ? 'Ne plus suivre' : 'Suivre';
    
    const result = await showConfirm(
      `${action} ${freelancer.name}`,
      `Voulez-vous ${freelancer.isFollowing ? 'ne plus suivre' : 'suivre'} ${freelancer.name} ?`,
      action,
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setFollowing(following.map(freelancer => {
        if (freelancer.id === freelancerId) {
          const newFollowingStatus = !freelancer.isFollowing;
          setStats(prev => ({
            ...prev,
            following: newFollowingStatus ? prev.following + 1 : prev.following - 1
          }));
          return { ...freelancer, isFollowing: newFollowingStatus };
        }
        return freelancer;
      }));
      
      showAlert(
        'Suivi mis à jour',
        `Vous ${freelancer.isFollowing ? 'ne suivez plus' : 'suivez maintenant'} ${freelancer.name}`
      );
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/freelancer-profile/${userId}`);
  };

  // Gestion des commentaires sur les avis
  const handleAddComment = (reviewId, comment) => {
    if (!comment.trim()) {
      showAlert('Erreur', 'Le commentaire ne peut pas être vide', 'error');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          clientComment: comment,
          clientCommentDate: formattedDate,
          isClientCommenting: false
        };
      }
      return review;
    }));

    showAlert('Commentaire ajouté', 'Votre commentaire a été ajouté avec succès !');
  };

  const handleEditComment = (reviewId, comment) => {
    if (!comment.trim()) {
      showAlert('Erreur', 'Le commentaire ne peut pas être vide', 'error');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          clientComment: comment,
          clientCommentDate: formattedDate,
          isClientCommenting: false
        };
      }
      return review;
    }));

    showAlert('Commentaire modifié', 'Votre commentaire a été modifié avec succès !');
  };

  const handleDeleteComment = async (reviewId) => {
    const result = await showConfirm(
      'Supprimer le commentaire',
      'Êtes-vous sûr de vouloir supprimer votre commentaire ?',
      'Supprimer',
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            clientComment: '',
            clientCommentDate: '',
            isClientCommenting: false
          };
        }
        return review;
      }));
      showAlert('Commentaire supprimé', 'Votre commentaire a été supprimé avec succès.');
    }
  };

  // Gestion des filtres d'avis
  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = 
        review.freelancerName.toLowerCase().includes(searchReviews.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchReviews.toLowerCase()) ||
        review.service.toLowerCase().includes(searchReviews.toLowerCase());
      
      const matchesFilter = 
        reviewFilter === 'all' || 
        review.service === reviewFilter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (reviewDateFilter === 'recent') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  // Afficher seulement 5 avis par défaut
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);
  const displayedFollowing = showAllFollowing ? filteredFollowing : filteredFollowing.slice(0, 5);
  const displayedFollowers = showAllFollowers ? followers : followers.slice(0, 5);

  // Rendu des étoiles
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
      />
    ));
  };

  // Composant pour les cartes de statistiques
  const StatCard = ({ icon: Icon, value, label, color, onClick }) => (
    <div 
      className={`${theme.cardBg} rounded-xl p-4 shadow-sm border ${theme.border} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('text-', '')} size={20} />
        </div>
        <div>
          <p className={`text-2xl font-bold ${theme.textMain}`}>{value}</p>
          <p className={`text-sm ${theme.textMuted}`}>{label}</p>
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
              <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-semibold ${theme.textMain}`}>À propos</h3>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    <Edit2 size={14} />
                    Modifier
                  </button>
                </div>
                
                <p className={`${theme.textSecondary} mb-6`}>{profileData.bio}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className={theme.textMuted} />
                    <div>
                      <p className={`text-sm ${theme.textMuted}`}>Langues</p>
                      <p className={`font-medium ${theme.textMain}`}>{profileData.languages.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Préférences & Fréquence */}
              <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-4`}>Préférences & Fréquence</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Services préférés</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {profileData.preferences.map((pref, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Fréquence des services</span>
                    <span className={`font-medium ${theme.textMain}`}>{profileData.frequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Statistiques */}
            <div className="space-y-6">
              {/* Statistiques */}
              <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-4`}>Statistiques</h3>
                <div className="grid grid-cols-1 gap-4">
                  <StatCard
                    icon={History}
                    value={stats.totalBookings}
                    label="Services commandés"
                    color="text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'following':
        return (
          <div className="space-y-6">
            {/* Liste des freelancers suivis */}
            <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className={`text-lg font-semibold ${theme.textMain}`}>
                    Freelancers Suivis ({stats.following})
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`} size={18} />
                      <input
                        type="text"
                        placeholder="Rechercher un freelancer..."
                        value={searchFollowing}
                        onChange={(e) => setSearchFollowing(e.target.value)}
                        className={`pl-10 pr-4 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} w-full md:w-64`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {displayedFollowing.map((freelancer) => (
                  <div key={freelancer.id} className={`p-6 ${theme.hoverBg} transition-colors`}>
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigateToProfile(freelancer.id)}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {freelancer.avatar}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme.textMain} hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors`}>
                            {freelancer.name}
                          </h4>
                          <p className={`text-sm ${theme.textMuted}`}>{freelancer.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {renderStars(freelancer.rating)}
                            </div>
                            <span className={`text-xs ${theme.textMuted}`}>{freelancer.rating}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {freelancer.specialty}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(freelancer.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          freelancer.isFollowing
                            ? `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                            : 'bg-cyan-600 text-white hover:bg-cyan-700'
                        }`}
                      >
                        {freelancer.isFollowing ? '✓ Suivi' : 'Suivre'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredFollowing.length === 0 && (
                  <div className="p-6 text-center">
                    <Users className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className={theme.textMuted}>Aucun freelancer trouvé</p>
                  </div>
                )}
              </div>

              {filteredFollowing.length > 5 && (
                <div className={`p-4 border-t ${theme.border} flex justify-center`}>
                  <button
                    onClick={() => setShowAllFollowing(!showAllFollowing)}
                    className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    {showAllFollowing ? (
                      <>
                        <ChevronUp size={16} />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Voir tous ({filteredFollowing.length})
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* En-tête avec filtres */}
            <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>
                    Avis donnés ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(profileData.averageRating)}
                    </div>
                    <span className={`font-semibold ${theme.textMain} ml-2`}>{profileData.averageRating}/5</span>
                    <span className={theme.textMuted}>moyenne</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`} size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un avis..."
                      value={searchReviews}
                      onChange={(e) => setSearchReviews(e.target.value)}
                      className={`pl-10 pr-4 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} w-full`}
                    />
                  </div>
                  
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className={`px-4 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  >
                    <option value="all">Tous les services</option>
                    <option value="Nettoyage Complet">Nettoyage Complet</option>
                    <option value="Nettoyage Vitres">Nettoyage Vitres</option>
                    <option value="Nettoyage Bureau">Nettoyage Bureau</option>
                    <option value="Nettoyage Résidentiel">Nettoyage Résidentiel</option>
                    <option value="Nettoyage Après Travaux">Nettoyage Après Travaux</option>
                  </select>

                  <select
                    value={reviewDateFilter}
                    onChange={(e) => setReviewDateFilter(e.target.value)}
                    className={`px-4 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  >
                    <option value="recent">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des avis */}
            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigateToProfile(review.freelancerId)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.freelancerAvatar}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme.textMain} hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors`}>
                          {review.freelancerName}
                        </h4>
                        <p className={`text-sm ${theme.textMuted}`}>{review.freelancerUsername}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className={`text-sm ${theme.textMuted}`}>{review.date}</span>
                    </div>
                  </div>
                  
                  <p className={`${theme.textSecondary} mb-4`}>{review.comment}</p>
                  
                  <div className={`pt-4 border-t ${theme.border}`}>
                    <span className={`text-sm ${theme.textMuted}`}>
                      Service : <span className={`font-medium ${theme.textMain}`}>{review.service}</span>
                    </span>
                    
                    {/* Commentaire du client */}
                    {review.clientComment ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageCircleReply size={16} className="text-cyan-600" />
                            <span className={`text-sm font-medium ${theme.textMain}`}>Votre commentaire</span>
                            {review.clientCommentDate && (
                              <span className={`text-xs ${theme.textMuted}`}>{review.clientCommentDate}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setReviews(reviews.map(r => 
                                r.id === review.id ? { ...r, isClientCommenting: true } : r
                              ))}
                              className="text-sm text-cyan-600 hover:text-cyan-700"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteComment(review.id)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <p className={`${theme.textMain} bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3`}>
                          {review.clientComment}
                        </p>
                      </div>
                    ) : review.isClientCommenting ? (
                      <div className="mt-4">
                        <textarea
                          placeholder="Ajouter un commentaire..."
                          defaultValue={review.clientComment}
                          rows={3}
                          className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} mb-2`}
                          ref={ref => {
                            if (ref) {
                              ref.focus();
                              ref.value = review.clientComment || '';
                            }
                          }}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReviews(reviews.map(r => 
                              r.id === review.id ? { ...r, isClientCommenting: false } : r
                            ))}
                            className="px-4 py-2 text-sm border rounded-lg"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              const comment = document.querySelector(`textarea[placeholder="Ajouter un commentaire..."]`).value;
                              handleAddComment(review.id, comment);
                            }}
                            className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setReviews(reviews.map(r => 
                            r.id === review.id ? { ...r, isClientCommenting: true } : r
                          ))}
                          className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          <MessageCircleReply size={16} />
                          Ajouter un commentaire
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-12 text-center`}>
                  <Star className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Aucun avis trouvé</h3>
                  <p className={theme.textMuted}>
                    Aucun avis ne correspond à votre recherche ou filtre.
                  </p>
                </div>
              )}
            </div>

            {filteredReviews.length > 5 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                >
                  {showAllReviews ? (
                    <>
                      <ChevronUp size={16} />
                      Voir moins d'avis
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Voir tous les avis ({filteredReviews.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );

      case 'followers':
        return (
          <div className="space-y-6">
            <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className={`text-lg font-semibold ${theme.textMain}`}>
                    Followers ({stats.followers})
                  </h3>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`} size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un follower..."
                      value={searchFollowers}
                      onChange={(e) => setSearchFollowers(e.target.value)}
                      className={`pl-10 pr-4 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} w-full md:w-64`}
                    />
                  </div>
                </div>
              </div>

              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {displayedFollowers
                  .filter(follower => 
                    follower.name.toLowerCase().includes(searchFollowers.toLowerCase()) ||
                    follower.username.toLowerCase().includes(searchFollowers.toLowerCase())
                  )
                  .map((follower) => (
                    <div key={follower.id} className={`p-6 ${theme.hoverBg} transition-colors`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            {follower.avatar}
                          </div>
                          <div>
                            <h4 className={`font-semibold ${theme.textMain}`}>
                              {follower.name}
                            </h4>
                            <p className={`text-sm ${theme.textMuted}`}>{follower.username}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            const newIsFollowing = !follower.isFollowing;
                            setFollowers(followers.map(f => 
                              f.id === follower.id ? { ...f, isFollowing: newIsFollowing } : f
                            ));
                            setStats(prev => ({
                              ...prev,
                              followers: newIsFollowing ? prev.followers + 1 : prev.followers - 1
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            follower.isFollowing
                              ? `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                              : 'bg-cyan-600 text-white hover:bg-cyan-700'
                          }`}
                        >
                          {follower.isFollowing ? '✓ Suivi' : 'Suivre'}
                        </button>
                      </div>
                    </div>
                  ))}
                
                {followers.length === 0 && (
                  <div className="p-6 text-center">
                    <Users className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className={theme.textMuted}>Aucun follower</p>
                  </div>
                )}
              </div>

              {followers.length > 5 && (
                <div className={`p-4 border-t ${theme.border} flex justify-center`}>
                  <button
                    onClick={() => setShowAllFollowers(!showAllFollowers)}
                    className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    {showAllFollowers ? (
                      <>
                        <ChevronUp size={16} />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Voir tous ({followers.length})
                      </>
                    )}
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
        <div className={`${theme.cardBg} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <div className={`p-6 border-b ${theme.border}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold ${theme.textMain}`}>Modifier le profil</h2>
              <button
                onClick={() => setIsEditing(false)}
                className={`p-2 ${theme.hoverBg} rounded-lg`}
              >
                <X size={20} className={theme.textSecondary} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Inputs fichiers cachés dans le modal */}
            <input
              type="file"
              ref={modalFileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'profile')}
            />
            <input
              type="file"
              ref={modalBannerInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'banner')}
            />

            {/* Modifier les images */}
            <div className="space-y-4">
              <h3 className={`font-medium ${theme.textMain}`}>Photos</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Photo de profil */}
                <div className="space-y-2">
                  <label className={`text-sm ${theme.textMuted}`}>Photo de profil</label>
                  <div className={`relative w-32 h-32 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserPlus size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleFileUpload('profile', modalFileInputRef)}
                        className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow`}
                      >
                        <Camera size={16} />
                      </button>
                      {profileImage && (
                        <button
                          onClick={() => handleRemoveImage('profile')}
                          className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow`}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bannière */}
                <div className="space-y-2">
                  <label className={`text-sm ${theme.textMuted}`}>Bannière</label>
                  <div className={`relative w-full h-32 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {bannerImage ? (
                      <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleFileUpload('banner', modalBannerInputRef)}
                        className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}
                      >
                        <Camera size={16} />
                      </button>
                      {bannerImage && (
                        <button
                          onClick={() => handleRemoveImage('banner')}
                          className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}
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
              <h3 className={`font-medium ${theme.textMain}`}>Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Prénom</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Titre</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} resize-none`}
                />
              </div>

              {/* Adresse non modifiable */}
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Adresse <span className="text-xs text-gray-500">(Non modifiable)</span></label>
                <input
                  type="text"
                  value={profileData.location}
                  disabled
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${theme.textMain} cursor-not-allowed`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cette adresse correspond à celle utilisée lors de votre inscription.
                </p>
              </div>
            </div>
            
            {/* Boutons */}
            <div className={`flex justify-end gap-4 pt-6 border-t ${theme.border}`}>
              <button
                onClick={() => setIsEditing(false)}
                className={`px-6 py-2 border ${theme.border} rounded-lg ${theme.hoverBg} transition ${theme.textMain}`}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
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
    <div className={`max-w-7xl mx-auto pb-12 ${theme.bgMain}`}>
      {/* Inputs fichiers cachés pour la bannière et photo de profil principales */}
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
          className="h-64 w-full rounded-t-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500"
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
              onClick={() => handleFileUpload('banner', bannerInputRef)}
              className="hover:bg-white border dark:border-gray-900 dark:text-gray-900 p-2 rounded-lg shadow-lg transition flex items-center gap-2"
            >
              <Camera size={16} />
              <span className="text-sm font-medium">Modifier</span>
            </button>
          </div>
        </div>

        {/* Photo de profil */}
        <div className="absolute -bottom-16 left-6 md:left-8">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500">
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
                onClick={() => handleFileUpload('profile', fileInputRef)}
                className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg transition"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute right-6 md:right-8 -bottom-12 flex items-center gap-3">
          <button
            onClick={handleSocialShare}
            className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} rounded-lg ${theme.hoverBg} transition ${theme.textMain}`}
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
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.textMain}`}>
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className={`text-lg ${theme.textSecondary} mt-1`}>{profileData.title}</p>
        </div>

        {/* Localisation et note */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={16} className={theme.textMuted} />
            <span className={theme.textSecondary}>{profileData.location}</span>
          </div>
          
          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className={`font-semibold ${theme.textMain}`}>{profileData.averageRating}</span>
            <span className={theme.textMuted}>/5</span>
            <span className={`${theme.textMuted} underline`}>({stats.reviewsGiven} avis)</span>
          </div>
          
          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            onClick={() => setActiveTab('followers')}
          >
            <Users size={16} className="text-blue-500" />
            <span className={`${theme.textSecondary} underline`}>{stats.followers} followers</span>
          </div>

          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            onClick={() => setActiveTab('following')}
          >
            <UserPlus size={16} className="text-green-500" />
            <span className={`${theme.textSecondary} underline`}>{stats.following} freelancers suivis</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b ${theme.border} mb-6`}>
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'about', label: 'À propos' },
              { id: 'following', label: 'Freelancers suivis' },
              { id: 'reviews', label: 'Mes avis' },
              { id: 'followers', label: 'Followers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : `${theme.textSecondary} hover:${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`
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
              className="bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;