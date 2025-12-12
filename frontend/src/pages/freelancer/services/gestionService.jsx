import React, { useState, useContext, useEffect } from 'react';
import { 
  Edit, Trash2, Plus, Eye, EyeOff, Check, X, Star, DollarSign, Clock, Tag, Package, Search, Filter, AlertCircle, Save, Loader 
} from 'lucide-react';
import { FreelancerContext } from '../freelancerContext';
import { getMyServices, updateService, deleteService } from '../../../services/serviceService';
import Swal from 'sweetalert2';

const GestionServices = () => {
  const { isDarkMode } = useContext(FreelancerContext);
  
  // --- SYSTÈME DE THÈME (Eye-Friendly & Contrasté) ---
  const theme = {
    // Arrière-plans
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-300 shadow-sm',
    
    // Textes
    textMain: isDarkMode ? 'text-white' : 'text-slate-900', // Noir/Gris foncé pour lecture nette
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    
    // Inputs & Éléments interactifs
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-slate-300 text-slate-900',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
    
    // Badges spécifiques (Correction du problème "Dark en mode clair")
    badge: isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-slate-100 text-slate-700 border-slate-200',
    
    // Bordures
    border: isDarkMode ? 'border-gray-700' : 'border-slate-300'
  };

  // Configuration des couleurs pour SweetAlert2
  const swalColors = {
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f3f4f6' : '#1f2937',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#dc2626'
  };

  // Mixin Toast
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: swalColors.background,
    color: swalColors.color,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  // Données depuis l'API
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour la modification
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  // État pour stocker le service original avant modif (Pour activer/désactiver le bouton)
  const [originalService, setOriginalService] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Charger les services du freelancer au montage
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMyServices();
        
        if (response.success && response.data) {
          const formattedServices = response.data.map((service) => ({
            id: service.id,
            name: service.nom,
            category: service.category || 'Non catégorisé',
            description: service.description || '',
            detailedDescription: service.detailed_description || '',
            duration: service.duree_prevue || 0,
            address: service.adresse || '',
            zones: service.zones || [],
            availability: service.availability || {},
            includedItems: service.included_items || [],
            status: service.status || 'pending_review',
            estActif: service.est_actif,
            image: service.image,
            createdAt: new Date(service.created_at).toLocaleDateString('fr-FR'),
            freelancerId: service.freelancer_id
          }));
          
          setServices(formattedServices);
        } else {
          setError('Impossible de charger vos services');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError('Impossible de charger vos services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Catégories
  const categories = [
    'Nettoyage résidentiel',
    'Nettoyage commercial',
    'Nettoyage spécialisé',
    'Nettoyage saisonnier',
    'Nettoyage après travaux'
  ];

  // Filtrer les services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'active') {
      matchesStatus = service.estActif === true;
    } else if (filterStatus === 'inactive') {
      matchesStatus = service.estActif === false;
    } else if (filterStatus === 'pending_review') {
      matchesStatus = service.status === 'pending_review';
    } else if (filterStatus === 'approved') {
      matchesStatus = service.status === 'approved';
    } else if (filterStatus === 'rejected') {
      matchesStatus = service.status === 'rejected';
    }
    
    return matchesSearch && matchesStatus;
  });

  // Toggle Status
  const toggleServiceStatus = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    const newStatus = !service.estActif;
    
    try {
      const response = await updateService(serviceId, { 
        name: service.name,
        category: service.category,
        description: service.description,
        detailedDescription: service.detailedDescription,
        zones: service.zones,
        availability: service.availability,
        includedItems: service.includedItems,
        est_actif: newStatus 
      });
      
      if (response.success) {
        setServices(services.map(s => 
          s.id === serviceId 
            ? { ...s, estActif: newStatus }
            : s
        ));
        
        Toast.fire({
          icon: 'success',
          title: `Service ${newStatus ? 'activé' : 'désactivé'}`
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Toast.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour le service'
      });
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer "${service.name}" ? Cette action est irréversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: swalColors.background,
      color: swalColors.color
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteService(serviceId);
          if (response.success) {
            setServices(services.filter(s => s.id !== serviceId));
            Swal.fire({
              title: 'Supprimé !',
              text: 'Le service a été supprimé avec succès.',
              icon: 'success',
              background: swalColors.background,
              color: swalColors.color
            });
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Impossible de supprimer le service',
            icon: 'error',
            background: swalColors.background,
            color: swalColors.color
          });
        }
      }
    });
  };

  // --- LOGIQUE DE MODIFICATION ---

  const handleEditClick = (service) => {
    const serviceCopy = { ...service };
    setEditingService(serviceCopy);
    setOriginalService(serviceCopy); // Sauvegarde de l'état initial
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value
    }));
  };

  // Vérification des changements pour le bouton
  const hasChanges = JSON.stringify(editingService) !== JSON.stringify(originalService);

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    
    try {
      const updateData = {
        name: editingService.name,
        category: editingService.category,
        description: editingService.description,
        detailedDescription: editingService.detailedDescription,
        zones: editingService.zones,
        availability: editingService.availability,
        includedItems: editingService.includedItems,
      };

      const response = await updateService(editingService.id, updateData);
      
      if (response.success) {
        setServices(prevServices => 
          prevServices.map(s => 
            s.id === editingService.id 
              ? { ...editingService, status: 'pending_review' }
              : s
          )
        );
        setShowEditModal(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Envoyé au superviseur !',
          text: 'Les modifications ont été soumises pour validation.',
          background: swalColors.background,
          color: swalColors.color,
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour le service',
        background: swalColors.background,
        color: swalColors.color,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Statistiques
  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    totalOrders: services.reduce((sum, service) => sum + service.totalOrders, 0),
    avgRating: (services.reduce((sum, service) => sum + service.rating, 0) / services.length).toFixed(1)
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} py-8 transition-colors duration-300`}>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={theme.textSecondary}>Chargement de vos services...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
      {/* --- MODAL DE MODIFICATION --- */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme.cardBg} border ${theme.border}`}>
            <div className={`sticky top-0 p-6 border-b ${theme.border} ${theme.cardBg} flex justify-between items-center z-10`}>
              <h3 className={`text-xl font-bold ${theme.textMain}`}>Modifier le service</h3>
              <button onClick={() => setShowEditModal(false)} className={`p-2 rounded-lg ${theme.hover}`}>
                <X size={20} className={theme.textSecondary} />
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="p-6 space-y-6">
              {/* Nom */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Nom du service</label>
                <input 
                  type="text" 
                  name="name"
                  value={editingService.name}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Catégorie</label>
                <select 
                  name="category"
                  value={editingService.category}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Description</label>
                <textarea 
                  name="description"
                  value={editingService.description}
                  onChange={handleEditChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                  required
                />
              </div>

              {/* Durée */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textMain}`}>Durée estimée (heures)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="duration"
                    value={editingService.duration}
                    onChange={handleEditChange}
                    className={`w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                    min="0.5"
                    step="0.5"
                    required
                  />
                  <Clock size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex gap-3">
                  <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    <strong>Note :</strong> Toute modification entraînera une revalidation par un superviseur. 
                    Le service passera en statut "En attente" pendant ce processus.
                  </p>
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t ${theme.border}`}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`px-6 py-2 border rounded-lg transition ${theme.border} ${theme.textMain} ${theme.hover}`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !hasChanges}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition flex items-center gap-2 
                    ${(isSaving || !hasChanges) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                  `}
                >
                  {isSaving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Enregistrer et Soumettre
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête Principal */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${theme.textMain}`}>Gérer mes Services</h1>
              <p className={`${theme.textSecondary} mt-2`}>Créez et gérez vos offres de services</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="./publier-service-freelancer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow"
              >
                <Plus size={16} />
                Publier un service
              </a>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Services total', value: stats.total, icon: Package, color: 'text-blue-500' },
            { label: 'Services actifs', value: stats.active, icon: Check, color: 'text-green-500' },
            { label: 'Total commandes', value: stats.totalOrders, icon: Star, color: 'text-yellow-500' },
            { label: 'Note moyenne', value: `${stats.avgRating}/5`, icon: Star, color: 'text-yellow-500' }
          ].map((stat, index) => (
            <div key={index} className={`${theme.cardBg} rounded-lg p-4 border ${theme.border} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme.textSecondary}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${theme.textMain} mt-1`}>{stat.value}</p>
                </div>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Filtres et recherche */}
        <div className={`${theme.cardBg} rounded-lg shadow mb-6 ${theme.border} border p-4`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${theme.input} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none`}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'all', label: 'Tous', icon: null },
                { id: 'active', label: 'Actifs', icon: Check },
                { id: 'inactive', label: 'Inactifs', icon: X },
                { id: 'pending_review', label: 'En attente', icon: Clock },
                { id: 'approved', label: 'Validés', icon: Check },
                { id: 'rejected', label: 'Rejetés', icon: X }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id)}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 whitespace-nowrap ${
                    filterStatus === filter.id
                      ? 'bg-green-600 text-white'
                      : `${theme.textSecondary} ${theme.hover}`
                  }`}
                >
                  {filter.icon && <filter.icon size={14} />}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des services */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className={`${theme.cardBg} rounded-lg shadow p-12 text-center ${theme.border} border`}>
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className={`text-xl font-bold ${theme.textMain} mb-2`}>Aucun service trouvé</h3>
              <p className={theme.textSecondary}>
                {searchTerm ? "Aucun service ne correspond à votre recherche" : "Vous n'avez pas encore de services"}
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className={`${theme.cardBg} rounded-xl shadow-lg p-6 border ${theme.border} transition hover:shadow-xl`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-lg font-bold ${theme.textMain}`}>{service.name}</h3>
                          
                          {/* Badge de statut */}
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                              : service.status === 'pending_review'
                              ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                              : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }`}>
                            {service.status === 'active' ? 'Actif' : service.status === 'pending_review' ? 'En validation' : 'Inactif'}
                          </span>
                        </div>
                        <p className={`mt-2 ${theme.textSecondary} line-clamp-2`}>{service.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          {/* CORRECTION DU BADGE CATÉGORIE ICI */}
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${theme.badge}`}>
                            <Tag size={12} className={theme.textSecondary} />
                            <span className={theme.textMain}>{service.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-xs">
                            <DollarSign size={12} className="text-blue-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                              {service.price}DH {service.priceType === 'par_heure' ? '/h' : 'forfait'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className={theme.textSecondary} />
                            <span className={`text-sm ${theme.textMain}`}>{service.duration}h estimées</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span className={`text-sm ${theme.textMain}`}>{service.rating} ({service.totalOrders})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className={`flex flex-col sm:flex-row gap-3 border-t lg:border-t-0 lg:border-l ${theme.border} pt-4 lg:pt-0 lg:pl-6 lg:ml-2 justify-center`}>
                    <button
                      onClick={() => handleEditClick(service)}
                      className={`px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center justify-center gap-2 font-medium`}
                    >
                      <Edit size={16} />
                      Modifier
                    </button>
                    
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium ${
                        service.estActif
                          ? `bg-green-600 text-white hover:bg-green-700`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {service.estActif ? (
                        <>
                          <Eye size={16} />
                          Actif
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} />
                          Inactif
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conseils */}
        <div className={`mt-8 ${theme.cardBg} rounded-lg border ${theme.border} p-6`}>
          <h3 className={`font-semibold ${theme.textMain} mb-4 flex items-center gap-2`}>
            <AlertCircle size={20} className="text-blue-500" />
            Conseils pour optimiser vos services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-800' : 'border-blue-100'}`}>
              <h4 className={`font-medium ${theme.textMain} mb-1`}>📸 Photos</h4>
              <p className={`text-xs ${theme.textSecondary}`}>3x plus de demandes avec de belles photos.</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border ${isDarkMode ? 'border-green-800' : 'border-green-100'}`}>
              <h4 className={`font-medium ${theme.textMain} mb-1`}>📝 Description</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Soyez précis sur ce qui est inclus.</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} border ${isDarkMode ? 'border-yellow-800' : 'border-yellow-100'}`}>
              <h4 className={`font-medium ${theme.textMain} mb-1`}>💰 Tarification</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Les prix se négocient dans les propositions avec les clients.</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border ${isDarkMode ? 'border-purple-800' : 'border-purple-100'}`}>
              <h4 className={`font-medium ${theme.textMain} mb-1`}>⏱️ Durée</h4>
              <p className={`text-xs ${theme.textSecondary}`}>Ne sous-estimez pas le temps nécessaire.</p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default GestionServices;