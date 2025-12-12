import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  Camera, Edit2, MapPin, Calendar, Star, Award, Briefcase, 
  Mail, Phone, Globe, Users, Search, X, Filter,
  Download, Upload, Check, Settings, Shield, UserPlus,
  MessageCircle, Share2, Bookmark, Heart, Trash2, Eye,
  Plus, ChevronRight, Image, Video, FileText, MoreVertical,
  EyeOff, MessageSquare, Send, Loader
} from 'lucide-react';
import { FreelancerContext } from './freelancerContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMyServices } from '../../services/serviceService';
import { getAcceptedOrders, getReceivedOrders } from '../../services/orderService';
import { updateUserProfile } from '../../services/authService';

const ProfileFreelancer = () => {
  const { 
    user, 
    rating,
    isDarkMode,
    setIsDarkMode
  } = useContext(FreelancerContext);
  
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
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: user?.prenom || 'N/A',
    lastName: user?.nom || 'N/A',
    title: user?.specialty || 'Spécialiste en nettoyage',
    bio: user?.bio || 'Freelance passionnée par le nettoyage',
    location: user?.localisation || 'Non spécifiée',
    email: user?.email || '',
    phone: user?.telephone || '',
    website: user?.website || '',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'N/A',
    languages: ['Français'],
    availability: 'Disponible maintenant',
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    workZones: [],
    responseTime: 'Moins de 2h'
  });

  const [stats, setStats] = useState({
    completedJobs: 0,
    repeatClients: 0,
    responseRate: 0,
    onTimeRate: 0,
    satisfaction: rating || 0,
    followers: 0,
    following: 0
  });

  // États pour les images
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  
  // États pour les modaux
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    serviceTitle: '',
    clientName: '',
    date: '',
    description: '',
    beforeImages: [],
    afterImages: []
  });

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

  // États pour les services - ajout d'un champ visible
  const [services, setServices] = useState([]);

  // États pour les avis - ajout des réponses
  const [reviews, setReviews] = useState([]);
  
  const [searchReviews, setSearchReviews] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [responseText, setResponseText] = useState('');

  // États pour le portfolio - avec gestion avancée des images
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      serviceId: 1,
      serviceTitle: 'Nettoyage Complet',
      clientName: 'Jean Dupont',
      date: '15 Jan 2024',
      beforeImages: [
        { id: 1, url: null, file: null, visible: true },
        { id: 2, url: null, file: null, visible: true }
      ],
      afterImages: [
        { id: 1, url: null, file: null, visible: true },
        { id: 2, url: null, file: null, visible: true }
      ],
      description: 'Appartement 3 pièces après déménagement',
      isEditing: false
    },
    {
      id: 2,
      serviceId: 2,
      serviceTitle: 'Nettoyage Bureau',
      clientName: 'Pierre Bernard',
      date: '10 Jan 2024',
      beforeImages: [
        { id: 1, url: null, file: null, visible: true }
      ],
      afterImages: [
        { id: 1, url: null, file: null, visible: true }
      ],
      description: 'Bureau d\'entreprise - 200m²',
      isEditing: false
    },
    {
      id: 3,
      serviceId: 1,
      serviceTitle: 'Nettoyage Complet',
      clientName: 'Sophie Laurent',
      date: '12 Jan 2024',
      beforeImages: [
        { id: 1, url: null, file: null, visible: true }
      ],
      afterImages: [
        { id: 1, url: null, file: null, visible: true },
        { id: 2, url: null, file: null, visible: true }
      ],
      description: 'Maison de campagne - nettoyage printemps',
      isEditing: false
    },
  ]);

  // États pour les actions utilisateur
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Ref pour les inputs de fichier dans le modal d'édition
  const modalFileInputRef = useRef(null);
  const modalBannerInputRef = useRef(null);
  const portfolioImageRefs = useRef({});

  // Charger les données du profil depuis la base de données
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        
        // Charger les services
        const servicesResponse = await getMyServices();
        if (servicesResponse && Array.isArray(servicesResponse)) {
          const formattedServices = servicesResponse.map(service => ({
            id: service.id,
            title: service.nom || 'Sans titre',
            description: service.detailed_description || service.description || '',
            category: service.category || 'Général',
            status: service.est_actif ? 'active' : 'inactive',
            visible: service.est_actif,
            serviceZones: service.localisation ? [service.localisation] : [],
            workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
            includedItems: service.included_items ? JSON.parse(service.included_items) : []
          }));
          setServices(formattedServices);
        }
        
        // Charger les commandes acceptées pour calculer les statistiques
        const acceptedOrdersResponse = await getAcceptedOrders();
        const receivedOrdersResponse = await getReceivedOrders();
        
        if (acceptedOrdersResponse && Array.isArray(acceptedOrdersResponse)) {
          setStats(prev => ({
            ...prev,
            completedJobs: acceptedOrdersResponse.length,
            satisfaction: rating || prev.satisfaction
          }));
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du profil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [user, rating]);

  // SweetAlert configuration
  const showAlert = (title, text, icon = 'success') => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#10b981',
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
      confirmButtonColor: '#10b981',
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

  const handlePortfolioImageChange = (itemId, imageType, imageId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioItems(portfolioItems.map(item => {
          if (item.id === itemId) {
            const updatedImages = item[imageType === 'before' ? 'beforeImages' : 'afterImages'].map(img =>
              img.id === imageId ? { ...img, url: reader.result, file: file } : img
            );
            return {
              ...item,
              [imageType === 'before' ? 'beforeImages' : 'afterImages']: updatedImages
            };
          }
          return item;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewProjectImageChange = (imageType, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 6 - newProjectData[imageType === 'before' ? 'beforeImages' : 'afterImages'].length).map((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return {
        id: Date.now() + index,
        file: file,
        url: null,
        visible: true
      };
    });

    setNewProjectData(prev => ({
      ...prev,
      [imageType === 'before' ? 'beforeImages' : 'afterImages']: [
        ...prev[imageType === 'before' ? 'beforeImages' : 'afterImages'],
        ...newImages
      ]
    }));
  };

  const handleRemoveImage = (type) => {
    if (type === 'profile') {
      setProfileImage(null);
    } else {
      setBannerImage(null);
    }
  };

  const handleRemovePortfolioImage = async (itemId, imageType, imageId) => {
    const result = await showConfirm(
      'Supprimer l\'image',
      'Êtes-vous sûr de vouloir supprimer cette image ?',
      'Supprimer',
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setPortfolioItems(portfolioItems.map(item => {
        if (item.id === itemId) {
          const images = item[imageType === 'before' ? 'beforeImages' : 'afterImages'];
          if (images.length > 2) {
            const updatedImages = images.filter(img => img.id !== imageId);
            return {
              ...item,
              [imageType === 'before' ? 'beforeImages' : 'afterImages']: updatedImages
            };
          }
        }
        return item;
      }));
      showAlert('Image supprimée', 'L\'image a été supprimée avec succès.');
    }
  };

  const handleRemoveNewProjectImage = async (imageType, imageId) => {
    const result = await showConfirm(
      'Supprimer l\'image',
      'Êtes-vous sûr de vouloir supprimer cette image ?',
      'Supprimer',
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setNewProjectData(prev => ({
        ...prev,
        [imageType === 'before' ? 'beforeImages' : 'afterImages']: 
          prev[imageType === 'before' ? 'beforeImages' : 'afterImages'].filter(img => img.id !== imageId)
      }));
    }
  };

  // Sauvegarder le profil avec le backend
  const handleSaveProfile = async () => {
    try {
      const result = await Swal.fire({
        title: 'Enregistrer les modifications ?',
        text: 'Voulez-vous sauvegarder les modifications de votre profil ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Enregistrer',
        cancelButtonText: 'Annuler',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937',
      });

      if (result.isConfirmed) {
        // Préparer les données à envoyer au backend
        const updateData = {
          prenom: profileData.firstName || user?.prenom || '',
          nom: profileData.lastName || user?.nom || '',
          bio: profileData.bio || ''
        };
        
        try {
          // Appeler l'API pour mettre à jour le profil
          const response = await updateUserProfile(updateData);
          
          // Mettre à jour le user dans le contexte
          if (response.data || response.user) {
            const updatedUser = response.data || response.user;
            // Mettre à jour localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Recharger la page pour rafraîchir les données
            window.location.reload();
          }
          
          setIsEditing(false);
          showAlert('Profil mis à jour', 'Votre profil a été mis à jour avec succès !');
        } catch (apiError) {
          console.error('Erreur API:', apiError);
          setIsEditing(false);
          showAlert('Profil mis à jour localement', 'Votre profil a été mis à jour. Les données seront synchronisées avec le serveur.', 'info');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showAlert('Erreur', 'Une erreur est survenue lors de la sauvegarde.', 'error');
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

  // ============================================
  // FONCTIONS DES FOLLOWERS - COMMENTÉES
  // ============================================
  // Les fonctions suivantes sont commentées car la gestion des followers
  // sera implémentée ultérieurement avec le backend
  //
  // - handleFollowToggle: Permet de suivre/ne plus suivre un utilisateur
  // - filteredFollowers: Filtre les followers selon la recherche
  //
  // TODO: Créer les endpoints API pour:
  //   - GET /api/followers/:userId
  //   - POST /api/follow/:userId
  //   - DELETE /api/unfollow/:userId
  // ============================================

  // Navigation vers le profil d'un utilisateur
  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  /*
  // Gestion des followers
  const filteredFollowers = followers.filter(follower => 
    follower.name.toLowerCase().includes(searchFollowers.toLowerCase()) ||
    follower.username.toLowerCase().includes(searchFollowers.toLowerCase())
  );

  const handleFollowToggle = async (followerId) => {
    const follower = followers.find(f => f.id === followerId);
    const action = follower.isFollowing ? 'Ne plus suivre' : 'Suivre';
    
    const result = await showConfirm(
      `${action} ${follower.name}`,
      `Voulez-vous ${follower.isFollowing ? 'ne plus suivre' : 'suivre'} ${follower.name} ?`,
      action,
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setFollowers(followers.map(follower => {
        if (follower.id === followerId) {
          const newFollowingStatus = !follower.isFollowing;
          setStats(prev => ({
            ...prev,
            followers: newFollowingStatus ? prev.followers + 1 : prev.followers - 1
          }));
          return { ...follower, isFollowing: newFollowingStatus };
        }
        return follower;
      }));
      
      showAlert(
        'Suivi mis à jour',
        `Vous ${follower.isFollowing ? 'ne suivez plus' : 'suivez maintenant'} ${follower.name}`
      );
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  */

  // Gestion des avis et réponses
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

  const handleStartResponse = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, isResponding: true }
        : review
    ));
    setResponseText('');
  };

  const handleCancelResponse = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, isResponding: false }
        : review
    ));
    setResponseText('');
  };

  const handleSendResponse = async (reviewId) => {
    if (!responseText.trim()) {
      showAlert('Champ vide', 'Veuillez écrire une réponse avant d\'envoyer.', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Envoyer la réponse ?',
      text: 'Votre réponse sera visible par le client et les autres utilisateurs.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });

    if (result.isConfirmed) {
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              response: responseText,
              isResponding: false 
            }
          : review
      ));
      setResponseText('');
      showAlert('Réponse envoyée', 'Votre réponse a été publiée avec succès !');
    }
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
  const handleDeletePortfolioItem = async (itemId) => {
    const result = await showConfirm(
      'Supprimer le projet',
      'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.',
      'Supprimer',
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== itemId));
      showAlert('Projet supprimé', 'Le projet a été supprimé avec succès.');
    }
  };

  const handleToggleImageVisibility = (itemId, type, imageId) => {
    setPortfolioItems(portfolioItems.map(item => {
      if (item.id === itemId) {
        const updatedImages = item[type === 'before' ? 'beforeImages' : 'afterImages'].map(img =>
          img.id === imageId ? { ...img, visible: !img.visible } : img
        );
        return {
          ...item,
          [type === 'before' ? 'beforeImages' : 'afterImages']: updatedImages
        };
      }
      return item;
    }));
  };

  const handleAddPortfolioImage = (itemId, type) => {
    setPortfolioItems(portfolioItems.map(item => {
      if (item.id === itemId) {
        const images = item[type === 'before' ? 'beforeImages' : 'afterImages'];
        if (images.length < 6) {
          const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
          const newImage = {
            id: newId,
            url: null,
            file: null,
            visible: true
          };
          return {
            ...item,
            [type === 'before' ? 'beforeImages' : 'afterImages']: [...images, newImage]
          };
        }
      }
      return item;
    }));
  };

  const handleTogglePortfolioEdit = (itemId) => {
    setPortfolioItems(portfolioItems.map(item =>
      item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
    ));
  };

  const handleSavePortfolioItem = async (itemId) => {
    const result = await Swal.fire({
      title: 'Enregistrer les modifications ?',
      text: 'Voulez-vous sauvegarder les modifications de ce projet ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });

    if (result.isConfirmed) {
      setPortfolioItems(portfolioItems.map(item =>
        item.id === itemId ? { ...item, isEditing: false } : item
      ));
      showAlert('Modifications enregistrées', 'Les modifications ont été sauvegardées avec succès !');
    }
  };

  const handleAddNewProject = async () => {
    if (newProjectData.beforeImages.length < 2 || newProjectData.afterImages.length < 2) {
      showAlert('Photos manquantes', 'Veuillez ajouter au moins 2 photos avant et 2 photos après', 'warning');
      return;
    }

    if (!newProjectData.serviceTitle.trim()) {
      showAlert('Titre manquant', 'Veuillez saisir un titre pour le projet', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Ajouter le projet ?',
      text: 'Voulez-vous ajouter ce nouveau projet à votre portfolio ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
    });

    if (result.isConfirmed) {
      const newId = portfolioItems.length > 0 ? Math.max(...portfolioItems.map(item => item.id)) + 1 : 1;
      const newProject = {
        id: newId,
        serviceId: 1,
        serviceTitle: newProjectData.serviceTitle || 'Nouveau Projet',
        clientName: newProjectData.clientName || 'Client',
        date: newProjectData.date || new Date().toLocaleDateString('fr-FR'),
        beforeImages: newProjectData.beforeImages,
        afterImages: newProjectData.afterImages,
        description: newProjectData.description || 'Description du projet',
        isEditing: false
      };

      setPortfolioItems([...portfolioItems, newProject]);
      setShowAddProjectModal(false);
      setNewProjectData({
        serviceTitle: '',
        clientName: '',
        date: '',
        description: '',
        beforeImages: [],
        afterImages: []
      });
      showAlert('Projet ajouté', 'Le projet a été ajouté à votre portfolio avec succès !');
    }
  };

  // Gestion des services
  const handleToggleServiceVisibility = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    const action = service.visible ? 'masquer' : 'afficher';
    
    const result = await showConfirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} le service`,
      `Voulez-vous ${action} le service "${service.title}" sur votre profil ?`,
      action.charAt(0).toUpperCase() + action.slice(1),
      'Annuler'
    );
    
    if (result.isConfirmed) {
      setServices(services.map(service =>
        service.id === serviceId ? { ...service, visible: !service.visible } : service
      ));
      
      showAlert(
        'Visibilité modifiée',
        `Le service "${service.title}" est maintenant ${service.visible ? 'masqué' : 'visible'} sur votre profil.`
      );
    }
  };

  // Composant pour l'aperçu du service
  const ServicePreview = ({ service }) => {
    // Si aucun service n'est passé ou les services ne sont pas chargés, afficher un message
    if (!service) {
      return (
        <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
          <h3 className={`text-lg font-bold ${theme.textMain} mb-4`}>Aperçu du service</h3>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6 text-center`}>
            <p className={theme.textMuted}>Aucun service disponible pour l'aperçu</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.border} p-6`}>
        <h3 className={`text-lg font-bold ${theme.textMain} mb-4`}>Aperçu du service</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-lg font-semibold ${theme.textMain}`}>{service.title || "Nom du service"}</h4>
              <span className={`px-3 py-1 text-xs rounded-full ${isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'}`}>
                {service.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-700'}`}>
              {service.category || "Catégorie"}
            </span>
            <p className={`mt-3 text-sm ${theme.textSecondary}`}>{service.description || "Description courte..."}</p>
          </div>

          <div>
            <p className={`text-sm font-medium ${theme.textMain} mb-2 flex items-center gap-2`}>
              <MapPin size={14} /> Zones desservies
            </p>
            <div className="flex flex-wrap gap-2">
              {service.serviceZones && service.serviceZones.length > 0 ? (
                service.serviceZones.slice(0, 3).map((z, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    {z}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Aucune zone sélectionnée</span>
              )}
              {service.serviceZones && service.serviceZones.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded">
                  +{service.serviceZones.length - 3} autres
                </span>
              )}
            </div>
          </div>

          <div>
            <p className={`text-sm font-medium ${theme.textMain} mb-2 flex items-center gap-2`}>
              <Calendar size={14} /> Jours de travail
            </p>
            <div className="flex flex-wrap gap-1">
              {service.workingDays && service.workingDays.map((day) => (
                <span key={day} className={`px-2 py-1 text-xs rounded ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  {day}
              </span>
            ))}
          </div>
        </div>

        {service.includedItems && service.includedItems.length > 0 && (
          <div>
            <p className={`text-sm font-medium ${theme.textMain} mb-2`}>Inclus dans le service</p>
            <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
              {service.includedItems.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={12} className="text-green-500"/>
                  {item}
                </li>
              ))}
              {service.includedItems.length > 3 && (
                <li className="text-xs text-gray-400">
                  + {service.includedItems.length - 3} autres éléments inclus
                </li>
              )}
            </ul>
          </div>
        )}
        </div>
      </div>
    );
  };

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
  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className={`${theme.cardBg} rounded-xl p-4 shadow-sm border ${theme.border}`}>
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
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Edit2 size={14} />
                    Modifier
                  </button>
                </div>
                
                <p className={`${theme.textSecondary} mb-6`}>{profileData.bio || user?.bio || 'Aucune description fournie'}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className={theme.textMuted} />
                    <div>
                      <p className={`text-sm ${theme.textMuted}`}>Spécialité</p>
                      <p className={`font-medium ${theme.textMain}`}>{user?.specialty || profileData.specialty || 'Spécialiste en nettoyage'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className={theme.textMuted} />
                    <div>
                      <p className={`text-sm ${theme.textMuted}`}>Membre depuis</p>
                      <p className={`font-medium ${theme.textMain}`}>{profileData.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={18} className={theme.textMuted} />
                    <div>
                      <p className={`text-sm ${theme.textMuted}`}>Services</p>
                      <p className={`font-medium ${theme.textMain}`}>{services.length} service(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={18} className={theme.textMuted} />
                    <div>
                      <p className={`text-sm ${theme.textMuted}`}>Localisation</p>
                      <p className={`font-medium ${theme.textMain}`}>{user?.localisation || profileData.location || 'Non spécifiée'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disponibilité */}
              <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-4`}>Disponibilité & Zones</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Statut</span>
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      {profileData.availability}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Temps de réponse</span>
                    <span className={`font-medium ${theme.textMain}`}>{profileData.responseTime}</span>
                  </div>
                  <div>
                    <span className={`text-sm ${theme.textSecondary} block mb-2`}>Jours de travail</span>
                    <div className="flex flex-wrap gap-2">
                      {profileData.workingDays.map((day, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={`text-sm ${theme.textSecondary} block mb-2`}>Zones de travail</span>
                    <div className="flex flex-wrap gap-2">
                      {profileData.workZones.slice(0, 4).map((zone, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {zone}
                        </span>
                      ))}
                      {profileData.workZones.length > 4 && (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          +{profileData.workZones.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Statistiques */}
            <div className="space-y-6">
              {/* Statistiques */}
              <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-4`}>Statistiques</h3>
                <div className="space-y-4">
                  <StatCard
                    icon={Check}
                    value={stats.completedJobs}
                    label="Travaux terminés"
                    color="text-green-600"
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
            </div>
          </div>
        );

      // case 'followers':
      //   return (
      //     <div className="space-y-6">
          
            
      //       <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} text-center`}>
      //         <Users className={`mx-auto ${theme.textMuted} mb-4`} size={48} />
      //         <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Followers</h3>
      //         <p className={theme.textSecondary}>
      //           La gestion des followers sera disponible très prochainement. 
      //         </p>
      //       </div>

            {/* 
            {/* Statistiques followers */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme.textMain}`}>{stats.followers}</p>
                    <p className={`text-sm ${theme.textMuted}`}>Followers</p>
                  </div>
                </div>
              </div>
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <UserPlus className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme.textMain}`}>{stats.following}</p>
                    <p className={`text-sm ${theme.textMuted}`}>Following</p>
                  </div>
                </div>
              </div>
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                    <Users className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme.textMain}`}>{followers.filter(f => f.isFollowing).length}</p>
                    <p className={`text-sm ${theme.textMuted}`}>Abonnés mutuels</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des followers */}
            {/* <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className={`text-lg font-semibold ${theme.textMain}`}>Liste des Followers</h3>
                  <div className="flex items-center gap-4">
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
              </div>

              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredFollowers.map((follower) => (
                  <div key={follower.id} className={`p-6 ${theme.hoverBg} transition-colors`}>
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigateToProfile(follower.id)}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {follower.avatar}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme.textMain} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                            {follower.name}
                          </h4>
                          <p className={`text-sm ${theme.textMuted}`}>{follower.username}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(follower.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          follower.isFollowing
                            ? `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
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
                    <p className={theme.textMuted}>Aucun follower trouvé</p>
                  </div>
                )}
              </div>
            </div> */}
        //   </div>
        // );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* En-tête avec filtres */}
            <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>
                    Avis Clients ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    {renderStars(4.8)}
                    <span className={`font-semibold ${theme.textMain} ml-2`}>4.8/5</span>
                    <span className={theme.textMuted}>sur {reviews.length} avis</span>
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
                    <option value="Nettoyage Bureau">Nettoyage Bureau</option>
                    <option value="Nettoyage Vitres">Nettoyage Vitres</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des avis */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigateToProfile(review.clientId)}
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.clientAvatar}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme.textMain} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                          {review.clientName}
                        </h4>
                        <p className={`text-sm ${theme.textMuted}`}>{review.clientUsername}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-sm ${theme.textMuted}`}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`${theme.textSecondary} mb-4`}>{review.comment}</p>
                  
                  {/* Réponse existante */}
                  {review.response && (
                    <div className={`ml-10 p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} mb-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          {profileData.firstName.charAt(0)}
                        </div>
                        <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Votre réponse</span>
                      </div>
                      <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>{review.response}</p>
                    </div>
                  )}
                  
                  {/* Formulaire de réponse */}
                  {review.isResponding && (
                    <div className="ml-10 mb-4">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Écrivez votre réponse..."
                        rows={3}
                        className={`w-full p-3 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleCancelResponse(review.id)}
                          className={`px-4 py-2 ${theme.textMuted} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg`}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSendResponse(review.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Send size={16} />
                          Envoyer la réponse
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex justify-between items-center pt-4 border-t ${theme.border}`}>
                    <span className={`text-sm ${theme.textMuted}`}>
                      Service : <span className={`font-medium ${theme.textMain}`}>{review.service}</span>
                    </span>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleReviewLike(review.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
                          review.userLiked
                            ? `${isDarkMode ? 'bg-red-900/30 text-red-600' : 'bg-red-50 text-red-600'}`
                            : `${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                        }`}
                      >
                        <Heart size={16} className={review.userLiked ? 'fill-current' : ''} />
                        <span className="text-sm">{review.likes}</span>
                      </button>
                      
                      <button className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <MessageCircle size={16} />
                        <span className="text-sm">{review.comments}</span>
                      </button>
                      
                      {/* Bouton pour répondre */}
                      {!review.response && !review.isResponding && (
                        <button
                          onClick={() => handleStartResponse(review.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                        >
                          <MessageSquare size={16} />
                          Répondre
                        </button>
                      )}
                    </div>
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
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            {/* En-tête */}
            <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme.textMain}`}>Portfolio & Galerie</h3>
                <button 
                  onClick={() => setShowAddProjectModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Plus size={16} />
                  Ajouter un projet
                </button>
              </div>
              
              <p className={theme.textMuted}>
                Ajoutez des photos avant/après de vos travaux pour montrer votre expertise (min 2, max 6 photos par section).
              </p>
            </div>

            {/* Liste des projets */}
            <div className="space-y-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
                  {/* En-tête du projet */}
                  <div className={`p-6 border-b ${theme.border}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-semibold ${theme.textMain}`}>{item.serviceTitle}</h4>
                        <p className={`text-sm ${theme.textMuted} mt-1`}>
                          Pour {item.clientName} • {item.date}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {item.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSavePortfolioItem(item.id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                              <Check size={14} />
                              Enregistrer
                            </button>
                            <button
                              onClick={() => handleTogglePortfolioEdit(item.id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                              <X size={14} />
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleTogglePortfolioEdit(item.id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                            >
                              <Edit2 size={14} />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeletePortfolioItem(item.id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className={`mt-4 ${theme.textSecondary}`}>{item.description}</p>
                  </div>

                  {/* Galerie avant/après */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Avant */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <h5 className={`font-medium ${theme.textMain}`}>Avant</h5>
                            <span className={`text-xs ${theme.textMuted}`}>({item.beforeImages.length}/6)</span>
                          </div>
                          {item.isEditing && item.beforeImages.length < 6 && (
                            <button
                              onClick={() => handleAddPortfolioImage(item.id, 'before')}
                              className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                              <Plus size={12} />
                              Ajouter
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {item.beforeImages.map((img, idx) => (
                            <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden group ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              {img.url ? (
                                <img 
                                  src={img.url} 
                                  alt={`Avant ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image size={24} className="text-gray-400" />
                                </div>
                              )}
                              <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-black/50 text-white rounded">
                                {idx + 1}
                              </span>
                              
                              {item.isEditing && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={el => portfolioImageRefs.current[`${item.id}-before-${img.id}`] = el}
                                    onChange={(e) => handlePortfolioImageChange(item.id, 'before', img.id, e)}
                                  />
                                  <button
                                    onClick={() => portfolioImageRefs.current[`${item.id}-before-${img.id}`]?.click()}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    title="Changer l'image"
                                  >
                                    <Camera size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleImageVisibility(item.id, 'before', img.id)}
                                    className={`p-2 rounded-lg ${img.visible ? 'bg-green-600' : 'bg-gray-600'} text-white hover:opacity-90`}
                                    title={img.visible ? "Masquer" : "Afficher"}
                                  >
                                    {img.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                  </button>
                                  {item.beforeImages.length > 2 && (
                                    <button
                                      onClick={() => handleRemovePortfolioImage(item.id, 'before', img.id)}
                                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                      title="Supprimer"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {item.beforeImages.length === 0 && (
                            <div className={`col-span-2 aspect-video rounded-lg border-2 border-dashed ${theme.border} flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <Image className="text-gray-400 mb-2" size={32} />
                              <p className={`text-sm ${theme.textMuted}`}>Aucune photo</p>
                              {item.isEditing && (
                                <button
                                  onClick={() => handleAddPortfolioImage(item.id, 'before')}
                                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Après */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h5 className={`font-medium ${theme.textMain}`}>Après</h5>
                            <span className={`text-xs ${theme.textMuted}`}>({item.afterImages.length}/6)</span>
                          </div>
                          {item.isEditing && item.afterImages.length < 6 && (
                            <button
                              onClick={() => handleAddPortfolioImage(item.id, 'after')}
                              className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                              <Plus size={12} />
                              Ajouter
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {item.afterImages.map((img, idx) => (
                            <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden group ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              {img.url ? (
                                <img 
                                  src={img.url} 
                                  alt={`Après ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image size={24} className="text-gray-400" />
                                </div>
                              )}
                              <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-black/50 text-white rounded">
                                {idx + 1}
                              </span>
                              
                              {item.isEditing && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={el => portfolioImageRefs.current[`${item.id}-after-${img.id}`] = el}
                                    onChange={(e) => handlePortfolioImageChange(item.id, 'after', img.id, e)}
                                  />
                                  <button
                                    onClick={() => portfolioImageRefs.current[`${item.id}-after-${img.id}`]?.click()}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    title="Changer l'image"
                                  >
                                    <Camera size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleImageVisibility(item.id, 'after', img.id)}
                                    className={`p-2 rounded-lg ${img.visible ? 'bg-green-600' : 'bg-gray-600'} text-white hover:opacity-90`}
                                    title={img.visible ? "Masquer" : "Afficher"}
                                  >
                                    {img.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                  </button>
                                  {item.afterImages.length > 2 && (
                                    <button
                                      onClick={() => handleRemovePortfolioImage(item.id, 'after', img.id)}
                                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                      title="Supprimer"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {item.afterImages.length === 0 && (
                            <div className={`col-span-2 aspect-video rounded-lg border-2 border-dashed ${theme.border} flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <Image className="text-gray-400 mb-2" size={32} />
                              <p className={`text-sm ${theme.textMuted}`}>Aucune photo</p>
                              {item.isEditing && (
                                <button
                                  onClick={() => handleAddPortfolioImage(item.id, 'after')}
                                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {portfolioItems.length === 0 && (
                <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-12 text-center`}>
                  <Image className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Aucun projet dans le portfolio</h3>
                  <p className={`${theme.textMuted} mb-6`}>
                    Ajoutez des photos de vos travaux pour montrer votre expertise.
                  </p>
                  <button 
                    onClick={() => setShowAddProjectModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Plus size={16} />
                    Ajouter un projet
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      // case 'services':
      //   return (
      //     <div className="space-y-6">
            
            
            {/* <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} text-center`}>
              <Briefcase className={`mx-auto ${theme.textMuted} mb-4`} size={48} />
              <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Services</h3>
              <p className={theme.textSecondary}>
                Les services sont gérés dans la section "Services" de la barre latérale.
              </p>
              <p className={`text-sm ${theme.textMuted} mt-2`}>
                Cliquez sur "Services" dans le menu pour créer, modifier ou gérer vos services.
              </p>
            </div> */}

            {/* 
            {/* Liste des services avec aperçu */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des services */}
            {/* <div className="lg:col-span-2 space-y-6">
                {services.map((service) => (
                  <div key={service.id} className={`${theme.cardBg} rounded-xl shadow-sm border ${service.visible ? theme.border : 'border-gray-200 dark:border-gray-800 opacity-70'} overflow-hidden hover:shadow-md transition-shadow`}>
                    {/* En-tête du service */}
                    {/* <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className={`font-semibold ${theme.textMain} mb-2`}>{service.title}</h4>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
                            {service.category}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleServiceVisibility(service.id)}
                            className={`p-2 rounded-lg ${service.visible ? (isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200') : (isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
                            title={service.visible ? "Masquer du profil" : "Afficher sur le profil"}
                          >
                            {service.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${theme.textSecondary} mb-4 line-clamp-2`}>
                        {service.description}
                      </p>
                      
                      <div className="space-y-3">
                        {/* Zones de service */}
                        {/* <div>
                          <p className={`text-xs font-medium ${theme.textMuted} mb-1`}>Zones de service</p>
                          <div className="flex flex-wrap gap-1">
                            {service.serviceZones.slice(0, 3).map((zone, idx) => (
                              <span key={idx} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                {zone}
                              </span>
                            ))}
                            {service.serviceZones.length > 3 && (
                              <span className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                +{service.serviceZones.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Jours de travail */}
                        {/* <div>
                          <p className={`text-xs font-medium ${theme.textMuted} mb-1`}>Jours de travail</p>
                          <div className="flex flex-wrap gap-1">
                            {service.workingDays.map((day, idx) => (
                              <span key={idx} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                                {day.charAt(0).toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Inclus dans le service */}
                        {/* <div>
                          <p className={`text-xs font-medium ${theme.textMuted} mb-1`}>Inclus</p>
                          <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                            {service.includedItems.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <Check size={10} className="text-green-500"/>
                                {item}
                              </li>
                            ))}
                            {service.includedItems.length > 2 && (
                              <li className="text-xs text-gray-400">
                                + {service.includedItems.length - 2} autres éléments
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer avec statut */}
                    {/* <div className={`px-6 py-4 border-t ${theme.border} ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${service.visible ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-sm ${theme.textMuted}`}>
                            {service.visible ? 'Visible sur le profil' : 'Masqué du profil'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {services.length === 0 && (
                  <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-12 text-center`}>
                    <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Aucun service publié</h3>
                    <p className={`${theme.textMuted} mb-6`}>
                      Ajoutez des services pour commencer à recevoir des commandes.
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      <Plus size={16} />
                      Publier votre premier service
                    </button>
                  </div>
                )}
              </div>

              {/* Aperçu du service sélectionné */}
              {/* <div className="space-y-6">
                <ServicePreview service={services[0]} />
                <div className={`${theme.cardBg} rounded-xl shadow-sm border ${theme.border} p-6`}>
                  <h4 className={`font-semibold ${theme.textMain} mb-4`}>Statut des services</h4>
                  <div className="space-y-3">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center justify-between">
                        <span className={`text-sm ${theme.textSecondary}`}>{service.title}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${service.visible ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-xs ${theme.textMuted}`}>
                            {service.visible ? 'Visible' : 'Masqué'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
        //   </div>
        // );

      default:
        return null;
    }
  };

  // Modal pour ajouter un nouveau projet
  if (showAddProjectModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${theme.cardBg} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
          <div className={`p-6 border-b ${theme.border}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold ${theme.textMain}`}>Ajouter un nouveau projet</h2>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className={`p-2 ${theme.hoverBg} rounded-lg`}
              >
                <X size={20} className={theme.textSecondary} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Informations du projet */}
            <div className="space-y-4">
              <h3 className={`font-medium ${theme.textMain}`}>Informations du projet</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Titre du service</label>
                  <input
                    type="text"
                    value={newProjectData.serviceTitle}
                    onChange={(e) => setNewProjectData({...newProjectData, serviceTitle: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                    placeholder="Ex: Nettoyage Complet"
                  />
                </div>
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Nom du client</label>
                  <input
                    type="text"
                    value={newProjectData.clientName}
                    onChange={(e) => setNewProjectData({...newProjectData, clientName: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Date</label>
                  <input
                    type="text"
                    value={newProjectData.date}
                    onChange={(e) => setNewProjectData({...newProjectData, date: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                    placeholder="Ex: 15 Jan 2024"
                  />
                </div>
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Nombre total de photos</label>
                  <div className={`text-sm ${theme.textMuted}`}>
                    {(newProjectData.beforeImages.length + newProjectData.afterImages.length)} / 12
                  </div>
                </div>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Description</label>
                <textarea
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} resize-none`}
                  placeholder="Décrivez le projet..."
                />
              </div>
            </div>
            
            {/* Photos avant */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${theme.textMain}`}>Photos Avant</h3>
                <span className={`text-sm ${theme.textMuted}`}>
                  ({newProjectData.beforeImages.length}/6) - Minimum 2 photos
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newProjectData.beforeImages.map((img, idx) => (
                  <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden group ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {img.url ? (
                      <img 
                        src={img.url} 
                        alt={`Avant ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : img.file ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText size={24} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">{img.file.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleRemoveNewProjectImage('before', img.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-black/50 text-white rounded">
                      {idx + 1}
                    </span>
                  </div>
                ))}
                
                {newProjectData.beforeImages.length < 6 && (
                  <div
                    className={`aspect-square rounded-lg border-2 border-dashed ${theme.border} flex flex-col items-center justify-center cursor-pointer ${theme.hoverBg} transition`}
                    onClick={() => document.getElementById('before-images-input').click()}
                  >
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <p className={`text-sm ${theme.textMuted}`}>Ajouter une photo</p>
                    <input
                      id="before-images-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleNewProjectImageChange('before', e)}
                    />
                  </div>
                )}
              </div>
              
              {newProjectData.beforeImages.length < 2 && (
                <p className="text-sm text-red-500">
                  ⚠️ Ajoutez au moins {2 - newProjectData.beforeImages.length} photo(s) avant
                </p>
              )}
            </div>
            
            {/* Photos après */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${theme.textMain}`}>Photos Après</h3>
                <span className={`text-sm ${theme.textMuted}`}>
                  ({newProjectData.afterImages.length}/6) - Minimum 2 photos
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newProjectData.afterImages.map((img, idx) => (
                  <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden group ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {img.url ? (
                      <img 
                        src={img.url} 
                        alt={`Après ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : img.file ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText size={24} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">{img.file.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleRemoveNewProjectImage('after', img.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-black/50 text-white rounded">
                      {idx + 1}
                    </span>
                  </div>
                ))}
                
                {newProjectData.afterImages.length < 6 && (
                  <div
                    className={`aspect-square rounded-lg border-2 border-dashed ${theme.border} flex flex-col items-center justify-center cursor-pointer ${theme.hoverBg} transition`}
                    onClick={() => document.getElementById('after-images-input').click()}
                  >
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <p className={`text-sm ${theme.textMuted}`}>Ajouter une photo</p>
                    <input
                      id="after-images-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleNewProjectImageChange('after', e)}
                    />
                  </div>
                )}
              </div>
              
              {newProjectData.afterImages.length < 2 && (
                <p className="text-sm text-red-500">
                  ⚠️ Ajoutez au moins {2 - newProjectData.afterImages.length} photo(s) après
                </p>
              )}
            </div>
            
            {/* Boutons */}
            <div className={`flex justify-end gap-4 pt-6 border-t ${theme.border}`}>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className={`px-6 py-2 border ${theme.border} rounded-lg ${theme.hoverBg} transition ${theme.textMain}`}
              >
                Annuler
              </button>
              <button
                onClick={handleAddNewProject}
                disabled={newProjectData.beforeImages.length < 2 || newProjectData.afterImages.length < 2}
                className={`px-6 py-2 rounded-lg transition ${
                  newProjectData.beforeImages.length < 2 || newProjectData.afterImages.length < 2
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Ajouter le projet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    value={profileData.firstName || user?.prenom || ''}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${theme.textMuted}`}>Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName || user?.nom || ''}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} opacity-50 cursor-not-allowed`}
                />
                <p className={`text-xs ${theme.textMuted} mt-1`}>L'email ne peut pas être modifié</p>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Téléphone</label>
                <input
                  type="tel"
                  value={user?.telephone || ''}
                  disabled
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} opacity-50 cursor-not-allowed`}
                />
                <p className={`text-xs ${theme.textMuted} mt-1`}>Contactez le support pour modifier le téléphone</p>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Spécialité</label>
                <input
                  type="text"
                  value={user?.specialty || ''}
                  disabled
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} opacity-50 cursor-not-allowed`}
                />
                <p className={`text-xs ${theme.textMuted} mt-1`}>Modifiez votre spécialité dans les paramètres</p>
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Localisation</label>
                <input
                  type="text"
                  value={user?.localisation || ''}
                  disabled
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} opacity-50 cursor-not-allowed`}
                />
              </div>
              
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Bio</label>
                <textarea
                  value={profileData.bio || user?.bio || ''}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  placeholder="Décrivez-vous en quelques mots..."
                  className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain} resize-none`}
                />
              </div>

              {/* Jours de travail */}
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Jours de travail</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const isSelected = profileData.workingDays.includes(day);
                        setProfileData({
                          ...profileData,
                          workingDays: isSelected
                            ? profileData.workingDays.filter(d => d !== day)
                            : [...profileData.workingDays, day]
                        });
                      }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        profileData.workingDays.includes(day)
                          ? 'bg-green-600 text-white'
                          : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zones de travail */}
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Zones de travail</label>
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Ajouter une zone (ex: Paris 1er)"
                    className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.inputBg} ${theme.textMain}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setProfileData({
                          ...profileData,
                          workZones: [...profileData.workZones, e.target.value.trim()]
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {profileData.workZones.map((zone, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {zone}
                        <button
                          type="button"
                          onClick={() => {
                            setProfileData({
                              ...profileData,
                              workZones: profileData.workZones.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
    <>
      {loading ? (
        <div className={`${theme.bgMain} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <Loader className={`animate-spin mx-auto ${theme.textMain} mb-4`} size={40} />
            <p className={`${theme.textMain}`}>Chargement de votre profil...</p>
          </div>
        </div>
      ) : (
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
                onClick={() => handleFileUpload('profile', fileInputRef)}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition"
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
          
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className={`font-semibold ${theme.textMain}`}>{rating}</span>
            <span className={theme.textMuted}>({reviews.length} avis)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Check size={16} className="text-green-500" />
            <span className={theme.textSecondary}>{profileData.availability}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users size={16} className="text-blue-500" />
            <span className={theme.textSecondary}>{stats.followers} followers</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b ${theme.border} mb-6`}>
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'about', label: 'À propos' },
              // { id: 'followers', label: 'Followers' },
              { id: 'reviews', label: 'Avis' },
              { id: 'portfolio', label: 'Portfolio' },
              // { id: 'services', label: 'Services' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
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
              className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>
      </div>
        </div>
      )}
    </>
  );
};

export default ProfileFreelancer;