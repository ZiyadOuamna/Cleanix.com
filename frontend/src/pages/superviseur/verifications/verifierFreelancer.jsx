import React, { useState, useContext, useEffect } from 'react';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Clock, 
  Download, User, Mail, Phone, Calendar, FileText,
  Shield, AlertCircle, ChevronDown, ChevronUp,
  ExternalLink, MoreVertical, RefreshCw, ThumbsUp,
  ThumbsDown, Briefcase, MapPin, CreditCard, Percent
} from 'react-feather';
import { SuperviseurContext } from '../superviseurContext';
import Swal from 'sweetalert2';

const SupervisorFreelancerVerification = () => {
  const { isDarkMode } = useContext(SuperviseurContext);
  
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-400',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputText: isDarkMode ? 'text-white' : 'text-gray-900',
  };

  // Configuration pour SweetAlert2
  const swalTheme = {
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#1f2937'
  };

  // Données simulées de freelancers en attente de vérification
  const [pendingFreelancers, setPendingFreelancers] = useState([
    {
      id: 3,
      name: 'Karim Benjelloun',
      email: 'karim.benjelloun@example.com',
      phone: '+212 6 55 44 33 22',
      specialty: 'Nettoyage vitres',
      registrationDate: '2024-01-05',
      verificationStatus: 'pending',
      documents: {
        cinNumber: 'CC345678',
        cinFront: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=CIN+Recto',
        cinBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=CIN+Verso',
        selfie: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Selfie+CIN',
      },
      personalInfo: {
        dateOfBirth: '1992-03-08',
        gender: 'male',
        nationality: 'Marocaine',
        taxNumber: 'TAX567890123',
      },
      stats: {
        totalServices: 5,
        avgRating: 4.8,
        completionRate: 100,
      },
      submittedAt: '2024-01-22T09:15:00Z',
      supervisorNotes: 'Vérifier l\'authenticité du CIN',
      priority: 'low',
    },
    {
      id: 1,
      name: 'Mohammed Alami',
      email: 'mohammed.alami@example.com',
      phone: '+212 6 12 34 56 78',
      specialty: 'Nettoyage résidentiel',
      registrationDate: '2024-01-15',
      verificationStatus: 'pending',
      documents: {
        cinNumber: 'AA123456',
        cinFront: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=CIN+Recto',
        cinBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=CIN+Verso',
        selfie: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Selfie+CIN',
      },
      personalInfo: {
        dateOfBirth: '1990-05-15',
        gender: 'male',
        nationality: 'Marocaine',
        taxNumber: 'TAX123456789',
      },
      stats: {
        totalServices: 0,
        avgRating: null,
        completionRate: null,
      },
      submittedAt: '2024-01-20T10:30:00Z',
      supervisorNotes: '',
      priority: 'high',
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      email: 'fatima.zahra@example.com',
      phone: '+212 6 87 65 43 21',
      specialty: 'Nettoyage bureau',
      registrationDate: '2024-01-10',
      verificationStatus: 'pending',
      documents: {
        cinNumber: 'BB789012',
        cinFront: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=CIN+Recto',
        cinBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=CIN+Verso',
        selfie: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Selfie+CIN',
      },
      personalInfo: {
        dateOfBirth: '1988-11-22',
        gender: 'female',
        nationality: 'Marocaine',
        taxNumber: 'TAX987654321',
      },
      stats: {
        totalServices: 0,
        avgRating: null,
        completionRate: null,
      },
      submittedAt: '2024-01-18T14:45:00Z',
      supervisorNotes: '',
      priority: 'medium',
    },
  ]);

  const [verifiedFreelancers, setVerifiedFreelancers] = useState([
    {
      id: 4,
      name: 'Amina Touati',
      email: 'amina.touati@example.com',
      phone: '+212 6 99 88 77 66',
      specialty: 'Nettoyage après travaux',
      registrationDate: '2023-12-01',
      verificationStatus: 'verified',
      verifiedAt: '2023-12-05T11:20:00Z',
      verifiedBy: 'Superviseur Ahmed',
      documents: {
        cinNumber: 'DD901234',
      },
      personalInfo: {
        dateOfBirth: '1991-07-30',
        gender: 'female',
        nationality: 'Marocaine',
      },
      stats: {
        totalServices: 42,
        avgRating: 4.9,
        completionRate: 98,
      },
    },
  ]);

  const [rejectedFreelancers, setRejectedFreelancers] = useState([
    {
      id: 5,
      name: 'Hassan El Fassi',
      email: 'hassan.elfassi@example.com',
      phone: '+212 6 33 22 11 00',
      specialty: 'Nettoyage résidentiel',
      registrationDate: '2024-01-03',
      verificationStatus: 'rejected',
      rejectedAt: '2024-01-08T16:30:00Z',
      rejectedBy: 'Superviseur Ahmed',
      rejectionReason: 'Selfie ne correspond pas au CIN',
      documents: {
        cinNumber: 'EE567890',
      },
      stats: {
        totalServices: 0,
        avgRating: null,
        completionRate: null,
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedView, setExpandedView] = useState('documents');

  // Calculer les statistiques
  const [stats, setStats] = useState({
    pending: 3,
    verified: 1,
    rejected: 1,
    approvalRate: 0,
    todayVerifications: 2,
  });

  useEffect(() => {
    // Calculer le taux d'approbation
    const totalProcessed = stats.verified + stats.rejected;
    const approvalRate = totalProcessed > 0 
      ? Math.round((stats.verified / totalProcessed) * 100) 
      : 0;
    
    setStats(prev => ({
      ...prev,
      approvalRate
    }));
  }, [stats.verified, stats.rejected]);

  // Filtrer les freelancers par recherche
  const filteredPending = pendingFreelancers
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)) // Tri par plus ancien d'abord
    .filter(freelancer =>
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.documents.cinNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredVerified = verifiedFreelancers.filter(freelancer =>
    freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejected = rejectedFreelancers.filter(freelancer =>
    freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFreelancer(null);
  };

  const approveFreelancer = (freelancerId) => {
    Swal.fire({
      title: 'Approuver ce freelancer ?',
      text: 'Le compte sera activé et pourra recevoir des commandes.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, approuver',
      cancelButtonText: 'Annuler',
      background: swalTheme.background,
      color: swalTheme.color,
      customClass: {
        popup: 'rounded-xl',
        title: 'font-bold',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const freelancer = pendingFreelancers.find(f => f.id === freelancerId);
        
        // Mettre à jour les listes
        setPendingFreelancers(prev => prev.filter(f => f.id !== freelancerId));
        setVerifiedFreelancers(prev => [{
          ...freelancer,
          verificationStatus: 'verified',
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'Superviseur',
        }, ...prev]);

        // Mettre à jour les stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          verified: prev.verified + 1,
          todayVerifications: prev.todayVerifications + 1,
        }));

        Swal.fire({
          title: 'Approuvé !',
          text: 'Le compte freelancer a été activé avec succès.',
          icon: 'success',
          background: swalTheme.background,
          color: swalTheme.color,
          customClass: {
            popup: 'rounded-xl',
            title: 'font-bold',
            confirmButton: 'px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700'
          }
        });
      }
    });
  };

  const rejectFreelancer = (freelancerId, reason) => {
    if (!reason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Raison requise',
        text: 'Veuillez spécifier une raison pour le rejet.',
        background: swalTheme.background,
        color: swalTheme.color,
        customClass: {
          popup: 'rounded-xl',
          title: 'font-bold',
          confirmButton: 'px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700'
        }
      });
      return;
    }

    const freelancer = pendingFreelancers.find(f => f.id === freelancerId);
    
    // Mettre à jour les listes
    setPendingFreelancers(prev => prev.filter(f => f.id !== freelancerId));
    setRejectedFreelancers(prev => [{
      ...freelancer,
      verificationStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Superviseur',
      rejectionReason: reason,
    }, ...prev]);

    // Mettre à jour les stats
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      rejected: prev.rejected + 1,
    }));

    Swal.fire({
      title: 'Rejeté !',
      text: 'Le compte freelancer a été rejeté.',
      icon: 'success',
      background: swalTheme.background,
      color: swalTheme.color,
      customClass: {
        popup: 'rounded-xl',
        title: 'font-bold',
        confirmButton: 'px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700'
      }
    });

    handleCloseModal();
  };

  const requestMoreInfo = (freelancerId) => {
    Swal.fire({
      title: 'Demander plus d\'informations',
      input: 'textarea',
      inputLabel: 'Quelles informations supplémentaires sont nécessaires ?',
      inputPlaceholder: 'Ex: Photo plus claire du CIN, selfie sans lunettes...',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Envoyer la demande',
      cancelButtonText: 'Annuler',
      background: swalTheme.background,
      color: swalTheme.color,
      customClass: {
        popup: 'rounded-xl',
        title: 'font-bold',
        input: `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg border border-gray-300 dark:border-gray-600`,
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Demande envoyée !',
          text: 'Le freelancer recevra une notification.',
          icon: 'success',
          background: swalTheme.background,
          color: swalTheme.color,
          customClass: {
            popup: 'rounded-xl',
            title: 'font-bold',
            confirmButton: 'px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700'
          }
        });
      }
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: <Clock size={14} /> },
      verified: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: <CheckCircle size={14} /> },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircle size={14} /> },
    };
    
    const { color, icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {icon}
        {status === 'pending' ? 'En attente' : status === 'verified' ? 'Vérifié' : 'Rejeté'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`${theme.bg} min-h-screen p-4 md:p-6`}>
      {/* Header simplifié */}
      <div className="mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.textMain} mb-2`}>
          Vérification Freelancers
        </h1>
        <p className={`${theme.textSecondary}`}>
          Gérez les demandes de vérification des freelancers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            title: 'En attente', 
            value: stats.pending, 
            color: 'bg-yellow-500', 
            icon: <Clock className="text-yellow-600 dark:text-yellow-400" />,
            change: 'À traiter'
          },
          { 
            title: 'Vérifiés', 
            value: stats.verified, 
            color: 'bg-green-500',
            icon: <CheckCircle className="text-green-600 dark:text-green-400" />,
            change: 'Total vérifiés'
          },
          { 
            title: 'Rejetés', 
            value: stats.rejected, 
            color: 'bg-red-500',
            icon: <XCircle className="text-red-600 dark:text-red-400" />,
            change: 'Total rejetés'
          },
          { 
            title: 'Taux d\'approbation', 
            value: `${stats.approvalRate}%`, 
            color: 'bg-blue-500',
            icon: <Percent className="text-blue-600 dark:text-blue-400" />,
            change: 'Taux de réussite'
          },
        ].map((stat, index) => (
          <div key={index} className={`${theme.cardBg} rounded-xl p-4 border ${theme.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {stat.icon}
              </div>
              <span className={`text-sm ${theme.textSecondary}`}>{stat.title}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-2xl font-bold ${theme.textMain}`}>{stat.value}</div>
                <div className={`text-xs ${theme.textMuted} mt-1`}>{stat.change}</div>
              </div>
              <div className={`w-12 h-1 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={`${theme.cardBg} rounded-xl p-4 border ${theme.border} mb-6`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un freelancer par nom, email ou CIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.inputText}`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section En Attente */}
        <div className="lg:col-span-2">
          <div className={`${theme.cardBg} rounded-xl border ${theme.border} overflow-hidden`}>
            <div className={`p-4 border-b ${theme.border} flex items-center justify-between`}>
              <div>
                <h2 className={`text-lg font-semibold ${theme.textMain}`}>Demandes en attente</h2>
                <p className={`text-sm ${theme.textSecondary}`}>{pendingFreelancers.length} demandes à traiter</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>
                {pendingFreelancers.length} en attente
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {filteredPending.length > 0 ? (
                <table className="w-full">
                  <thead className={`border-b ${theme.border}`}>
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Freelancer</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">CIN</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Date de soumission</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPending.map((freelancer) => (
                      <tr key={freelancer.id} className={`border-b ${theme.border} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                              <User size={20} className={theme.textSecondary} />
                            </div>
                            <div>
                              <div className={`font-medium ${theme.textMain}`}>{freelancer.name}</div>
                              <div className={`text-sm ${theme.textSecondary}`}>{freelancer.email}</div>
                              <div className={`text-xs ${theme.textMuted}`}>{freelancer.specialty}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`font-mono ${theme.textMain}`}>{freelancer.documents.cinNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className={`text-sm ${theme.textSecondary}`}>
                            {formatDate(freelancer.submittedAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(freelancer)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                              title="Examiner"
                            >
                              <Eye size={18} className={theme.textSecondary} />
                            </button>
                            <button
                              onClick={() => approveFreelancer(freelancer.id)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition text-green-600 dark:text-green-400"
                              title="Approuver"
                            >
                              <ThumbsUp size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <CheckCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className={`text-lg font-medium ${theme.textMain} mb-2`}>
                    {searchTerm ? 'Aucun résultat trouvé' : 'Toutes les demandes sont traitées !'}
                  </h3>
                  <p className={theme.textSecondary}>
                    {searchTerm ? 'Essayez avec d\'autres termes' : 'Aucune demande en attente'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sections Vérifiés et Rejetés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Vérifiés */}
            <div className={`${theme.cardBg} rounded-xl border ${theme.border} overflow-hidden`}>
              <div className={`p-4 border-b ${theme.border}`}>
                <h3 className={`font-semibold ${theme.textMain} flex items-center gap-2`}>
                  <CheckCircle size={18} className="text-green-600" />
                  Derniers vérifiés
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {filteredVerified.slice(0, 3).map((freelancer) => (
                  <div key={freelancer.id} className={`p-3 rounded-lg border ${theme.border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${theme.textMain}`}>{freelancer.name}</span>
                      {getStatusBadge('verified')}
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Vérifié le {formatDate(freelancer.verifiedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejetés */}
            <div className={`${theme.cardBg} rounded-xl border ${theme.border} overflow-hidden`}>
              <div className={`p-4 border-b ${theme.border}`}>
                <h3 className={`font-semibold ${theme.textMain} flex items-center gap-2`}>
                  <XCircle size={18} className="text-red-600" />
                  Derniers rejetés
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {filteredRejected.slice(0, 3).map((freelancer) => (
                  <div key={freelancer.id} className={`p-3 rounded-lg border ${theme.border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${theme.textMain}`}>{freelancer.name}</span>
                      {getStatusBadge('rejected')}
                    </div>
                    <div className={`text-xs ${theme.textSecondary} line-clamp-2`}>
                      Raison : {freelancer.rejectionReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Statistiques */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className={`${theme.cardBg} rounded-xl border ${theme.border} p-4`}>
            <h3 className={`font-semibold ${theme.textMain} mb-4`}>Aperçu des vérifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={theme.textSecondary}>Vérifications aujourd'hui</span>
                <span className={`font-medium ${theme.textMain}`}>{stats.todayVerifications}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={theme.textSecondary}>Total vérifiés</span>
                <span className={`font-medium ${theme.textMain}`}>{stats.verified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={theme.textSecondary}>Total rejetés</span>
                <span className={`font-medium ${theme.textMain}`}>{stats.rejected}</span>
              </div>
            </div>
          </div>

          {/* Conseils de vérification */}
          <div className={`${theme.cardBg} rounded-xl border ${theme.border} p-4`}>
            <h3 className={`font-semibold ${theme.textMain} mb-4 flex items-center gap-2`}>
              <Shield size={18} className="text-blue-600" />
              Conseils de vérification
            </h3>
            <div className="space-y-3">
              {[
                'Vérifier la correspondance photo CIN / selfie',
                'S\'assurer que le CIN n\'est pas expiré',
                'Vérifier la cohérence des informations',
                'Attention aux photos floues ou illisibles',
                'Vérifier l\'authenticité des documents',
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className={`text-sm ${theme.textSecondary}`}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vérification détaillée */}
      {isModalOpen && selectedFreelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${theme.cardBg} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${theme.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${theme.textMain}`}>
                    Vérification de {selectedFreelancer.name}
                  </h2>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    CIN: {selectedFreelancer.documents.cinNumber} • 
                    Soumis le {formatDate(selectedFreelancer.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge('pending')}
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Navigation */}
              <div className="flex border-b ${theme.border} mb-6">
                {['documents', 'personal', 'stats'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExpandedView(tab)}
                    className={`px-4 py-2 font-medium ${
                      expandedView === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : theme.textSecondary
                    }`}
                  >
                    {tab === 'documents' ? 'Documents' : 
                     tab === 'personal' ? 'Informations personnelles' : 
                     'Statistiques'}
                  </button>
                ))}
              </div>

              {/* Contenu du tab */}
              {expandedView === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`font-semibold ${theme.textMain} mb-4`}>Documents d'identité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h4 className={`font-medium ${theme.textMain} mb-2`}>Recto CIN</h4>
                        <img 
                          src={selectedFreelancer.documents.cinFront} 
                          alt="Recto CIN" 
                          className="w-full h-48 object-cover rounded-lg border ${theme.border}"
                        />
                        <button
                          onClick={() => window.open(selectedFreelancer.documents.cinFront, '_blank')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Agrandir l'image
                        </button>
                      </div>
                      <div className="text-center">
                        <h4 className={`font-medium ${theme.textMain} mb-2`}>Verso CIN</h4>
                        <img 
                          src={selectedFreelancer.documents.cinBack} 
                          alt="Verso CIN" 
                          className="w-full h-48 object-cover rounded-lg border ${theme.border}"
                        />
                        <button
                          onClick={() => window.open(selectedFreelancer.documents.cinBack, '_blank')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Agrandir l'image
                        </button>
                      </div>
                      <div className="text-center">
                        <h4 className={`font-medium ${theme.textMain} mb-2`}>Selfie avec CIN</h4>
                        <img 
                          src={selectedFreelancer.documents.selfie} 
                          alt="Selfie" 
                          className="w-full h-48 object-cover rounded-lg border ${theme.border}"
                        />
                        <button
                          onClick={() => window.open(selectedFreelancer.documents.selfie, '_blank')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Agrandir l'image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {expandedView === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textMain} mb-4`}>Informations de contact</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Email</div>
                            <div className={theme.textMain}>{selectedFreelancer.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Téléphone</div>
                            <div className={theme.textMain}>{selectedFreelancer.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Spécialité</div>
                            <div className={theme.textMain}>{selectedFreelancer.specialty}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold ${theme.textMain} mb-4`}>Informations personnelles</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Date de naissance</div>
                            <div className={theme.textMain}>
                              {new Date(selectedFreelancer.personalInfo.dateOfBirth).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Genre</div>
                            <div className={theme.textMain}>
                              {selectedFreelancer.personalInfo.gender === 'male' ? 'Homme' : 'Femme'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className={theme.textSecondary} />
                          <div>
                            <div className={`text-sm ${theme.textSecondary}`}>Nationalité</div>
                            <div className={theme.textMain}>{selectedFreelancer.personalInfo.nationality}</div>
                          </div>
                        </div>
                        {selectedFreelancer.personalInfo.taxNumber && (
                          <div className="flex items-center gap-3">
                            <CreditCard size={18} className={theme.textSecondary} />
                            <div>
                              <div className={`text-sm ${theme.textSecondary}`}>Numéro fiscal</div>
                              <div className={theme.textMain}>{selectedFreelancer.personalInfo.taxNumber}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {expandedView === 'stats' && (
                <div className="space-y-6">
                  <h4 className={`font-semibold ${theme.textMain}`}>Statistiques du freelancer</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border ${theme.border} text-center`}>
                      <div className={`text-2xl font-bold ${theme.textMain}`}>
                        {selectedFreelancer.stats.totalServices}
                      </div>
                      <div className={`text-sm ${theme.textSecondary}`}>Services total</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${theme.border} text-center`}>
                      <div className={`text-2xl font-bold ${theme.textMain}`}>
                        {selectedFreelancer.stats.avgRating || 'N/A'}
                      </div>
                      <div className={`text-sm ${theme.textSecondary}`}>Note moyenne</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${theme.border} text-center`}>
                      <div className={`text-2xl font-bold ${theme.textMain}`}>
                        {selectedFreelancer.stats.completionRate ? `${selectedFreelancer.stats.completionRate}%` : 'N/A'}
                      </div>
                      <div className={`text-sm ${theme.textSecondary}`}>Taux de complétion</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`mt-8 pt-6 border-t ${theme.border}`}>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => approveFreelancer(selectedFreelancer.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle size={18} />
                    Approuver le compte
                  </button>
                  
                  <button
                    onClick={() => {
                      setExpandedView('documents');
                      Swal.fire({
                        title: 'Raison du rejet',
                        input: 'textarea',
                        inputLabel: 'Pourquoi rejetez-vous cette vérification ?',
                        inputPlaceholder: 'Ex: Selfie ne correspond pas, CIN expiré...',
                        showCancelButton: true,
                        confirmButtonColor: '#EF4444',
                        cancelButtonColor: '#6B7280',
                        confirmButtonText: 'Confirmer le rejet',
                        cancelButtonText: 'Annuler',
                        background: swalTheme.background,
                        color: swalTheme.color,
                        customClass: {
                          popup: 'rounded-xl',
                          title: 'font-bold',
                          input: `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg border border-gray-300 dark:border-gray-600`,
                          confirmButton: 'px-4 py-2 rounded-lg font-medium',
                          cancelButton: 'px-4 py-2 rounded-lg font-medium'
                        }
                      }).then((result) => {
                        if (result.isConfirmed && result.value) {
                          rejectFreelancer(selectedFreelancer.id, result.value);
                        }
                      });
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <XCircle size={18} />
                    Rejeter la vérification
                  </button>
                  
                  <button
                    onClick={() => requestMoreInfo(selectedFreelancer.id)}
                    className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <AlertCircle size={18} />
                    Plus d'infos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorFreelancerVerification;