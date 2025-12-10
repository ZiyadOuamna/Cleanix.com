import React, { useState, useContext, useRef } from 'react';
import { 
  Camera, Edit2, MapPin, Calendar, Star, Award, MessageCircle, 
  Download, Upload, Check, Settings, Shield, UserPlus,
  Share2, Bookmark, Heart, Trash2, Eye,
  Plus, ChevronRight, Image as ImageIcon, MoreVertical,
  MessageSquare, Send, Search, X, Filter
} from 'lucide-react';
import { ClientContext } from './clientContext';
import Swal from 'sweetalert2';

const ProfileClient = () => {
  const { user, isDarkMode } = useContext(ClientContext);
  
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
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Client',
    lastName: user?.name?.split(' ')[1] || 'Premium',
    title: 'Client Régulier Cleanix',
    bio: 'Je suis client régulier de la plateforme Cleanix. J\'apprécie les services de nettoyage de qualité et la ponctualité des prestataires.',
    location: user?.address || 'Paris, France',
    email: user?.email || 'client@email.com',
    phone: user?.phone || '+33 6 12 34 56 78',
    website: 'www.cleanix.com',
    joinDate: 'Janvier 2024',
    languages: ['Français', 'Anglais'],
    availability: 'Disponible tous les jours',
    serviceZones: ['Paris 1er', 'Paris 2e', 'Paris 3e'],
    responseTime: 'Réponse immédiate'
  });

  const [stats, setStats] = useState({
    completedServices: 24,
    favoriteFreelancers: 8,
    totalSpent: '2,450€',
    satisfaction: 98,
    reviews: 12,
    followers: 0,
    following: 0
  });

  // États pour les images
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

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
      likes: 5,
      userLiked: false,
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
      likes: 3,
      userLiked: true,
    },
  ]);

  const [searchReviews, setSearchReviews] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (type) => {
    if (type === 'profile') {
      fileInputRef.current?.click();
    } else {
      bannerInputRef.current?.click();
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

  const handleSave = async () => {
    Swal.fire({
      title: 'Enregistrer les modifications ?',
      text: 'Voulez-vous sauvegarder les modifications de votre profil ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
        Swal.fire({
          title: 'Succès',
          text: 'Votre profil a été mis à jour avec succès',
          icon: 'success',
          confirmButtonColor: '#0891b2',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1f2937',
        });
      }
    });
  };

  const handleDeleteReview = async (reviewId) => {
    Swal.fire({
      title: 'Supprimer cet avis ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        Swal.fire({
          title: 'Supprimé',
          text: 'L\'avis a été supprimé',
          icon: 'success',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1f2937',
        });
      }
    });
  };

  return (
    <div className={`min-h-screen ${theme.bgMain}`}>
      {/* Banner */}
      <div className={`relative h-48 ${bannerImage ? '' : isDarkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
        style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover' } : {}}
      >
        <button
          onClick={() => handleFileUpload('banner')}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition"
        >
          <Camera size={18} />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'banner')}
        />
      </div>

      {/* Profile Header */}
      <div className={`max-w-5xl mx-auto px-4 -mt-16 mb-8`}>
        <div className={`${theme.bgCard} rounded-xl shadow-lg p-8 border ${theme.border}`}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className={`w-32 h-32 rounded-full ${profileImage ? '' : 'bg-gradient-to-tr from-cyan-400 to-cyan-600'} flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ${isDarkMode ? 'ring-gray-700' : 'ring-white'}`}
                  style={profileImage ? { backgroundImage: `url(${profileImage})`, backgroundSize: 'cover' } : {}}
                >
                  {!profileImage && (profileData.firstName?.charAt(0) || 'C')}
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleFileUpload('profile')}
                    className="absolute bottom-0 right-0 bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition shadow-lg"
                  >
                    <Camera size={18} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'profile')}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className={`text-3xl font-bold ${theme.textMain}`}>
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className={`${theme.textSecondary} mt-2`}>{profileData.title}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className={`font-semibold ${theme.textMain}`}>{stats.satisfaction}/5</span>
                    </div>
                    <div className={`${theme.textMuted} text-sm`}>
                      <Calendar size={16} className="inline mr-1" /> {profileData.joinDate}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isEditing) handleSave();
                    else setIsEditing(true);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  {isEditing ? 'Enregistrer' : 'Modifier'}
                </button>
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} mt-4`}
                  rows="3"
                />
              ) : (
                <p className={`${theme.textSecondary} mt-4`}>{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`max-w-5xl mx-auto px-4 mb-8`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.bgCard} rounded-xl p-6 border ${theme.border} text-center`}>
            <div className={`text-3xl font-bold ${theme.textMain}`}>{stats.completedServices}</div>
            <div className={`${theme.textMuted} text-sm mt-2`}>Services utilisés</div>
          </div>
          <div className={`${theme.bgCard} rounded-xl p-6 border ${theme.border} text-center`}>
            <div className={`text-3xl font-bold ${theme.textMain}`}>{stats.favoriteFreelancers}</div>
            <div className={`${theme.textMuted} text-sm mt-2`}>Freelancers favoris</div>
          </div>
          <div className={`${theme.bgCard} rounded-xl p-6 border ${theme.border} text-center`}>
            <div className={`text-3xl font-bold ${theme.textMain}`}>{stats.totalSpent}</div>
            <div className={`${theme.textMuted} text-sm mt-2`}>Total dépensé</div>
          </div>
          <div className={`${theme.bgCard} rounded-xl p-6 border ${theme.border} text-center`}>
            <div className={`text-3xl font-bold ${theme.textMain}`}>{stats.reviews}</div>
            <div className={`${theme.textMuted} text-sm mt-2`}>Avis laissés</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`max-w-5xl mx-auto px-4`}>
        <div className="flex gap-4 border-b ${theme.border} mb-8 overflow-x-auto">
          {['about', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? `border-b-2 border-cyan-600 ${theme.textMain}`
                  : `${theme.textMuted} hover:${theme.textMain}`
              }`}
            >
              {tab === 'about' ? 'À propos' : 'Avis'}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-8 mb-12">
            {/* Contact Info */}
            <div className={`${theme.bgCard} rounded-xl p-8 border ${theme.border}`}>
              <h2 className={`text-xl font-bold ${theme.textMain} mb-6`}>Informations de contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${isEditing ? theme.inputBg : theme.bgMain} ${theme.textMain}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${isEditing ? theme.inputBg : theme.bgMain} ${theme.textMain}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold ${theme.textMain} mb-2`}>Localisation</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${isEditing ? theme.inputBg : theme.bgMain} ${theme.textMain}`}
                  />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className={`${theme.bgCard} rounded-xl p-8 border ${theme.border}`}>
              <h2 className={`text-xl font-bold ${theme.textMain} mb-6`}>Informations du compte</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 ${theme.hoverBg} rounded-lg`}>
                  <p className={`${theme.textMuted} text-sm mb-2`}>Date d'adhésion</p>
                  <p className={`${theme.textMain} font-semibold`}>{profileData.joinDate}</p>
                </div>
                <div className={`p-4 ${theme.hoverBg} rounded-lg`}>
                  <p className={`${theme.textMuted} text-sm mb-2`}>Statut du compte</p>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <p className={`${theme.textMain} font-semibold`}>Vérifié</p>
                  </div>
                </div>
                <div className={`p-4 ${theme.hoverBg} rounded-lg`}>
                  <p className={`${theme.textMuted} text-sm mb-2`}>Services favoris</p>
                  <p className={`${theme.textMain} font-semibold`}>Nettoyage Complet, Vitres</p>
                </div>
                <div className={`p-4 ${theme.hoverBg} rounded-lg`}>
                  <p className={`${theme.textMuted} text-sm mb-2`}>Note moyenne reçue</p>
                  <p className={`${theme.textMain} font-semibold`}>4.8/5.0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="mb-12">
            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={18} className={`absolute left-3 top-3 ${theme.textMuted}`} />
                <input
                  type="text"
                  placeholder="Rechercher un avis..."
                  value={searchReviews}
                  onChange={(e) => setSearchReviews(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
                />
              </div>
              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
              >
                <option value="all">Tous les avis</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className={`${theme.bgCard} rounded-xl p-6 border ${theme.border}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center font-bold ${theme.textMain}`}>
                        {review.freelancerAvatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${theme.textMain}`}>{review.freelancerName}</p>
                        <p className={`${theme.textMuted} text-sm`}>{review.freelancerUsername}</p>
                        <p className={`${theme.textMuted} text-xs mt-1`}>{review.service} • {review.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className={`${theme.textMuted} hover:text-red-500 transition`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : theme.textMuted}
                      />
                    ))}
                  </div>
                  <p className={`${theme.textSecondary}`}>{review.comment}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t ${theme.border}">
                    <button className={`flex items-center gap-2 ${review.userLiked ? 'text-red-500' : theme.textMuted} hover:text-red-500 transition`}>
                      <Heart size={16} className={review.userLiked ? 'fill-current' : ''} />
                      <span className="text-sm">{review.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileClient;
