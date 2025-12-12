import React, { useState, useEffect, useContext } from 'react';
import {
  Check, X, ChevronRight, Eye, MapPin, Calendar, Package, Clock, AlertCircle, Search, Filter, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPendingServices, approveService, rejectService } from '../../../services/serviceService';
import { SuperviseurContext } from '../superviseurContext';

const SuperviseurServiceValidation = () => {
  const { isDarkMode } = useContext(SuperviseurContext) || { isDarkMode: false };
  const navigate = useNavigate();

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200',
    text: isDarkMode ? 'text-gray-100' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-slate-300 text-slate-900',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
  };

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingServices();
  }, []);

  const fetchPendingServices = async () => {
    try {
      setIsLoading(true);
      const response = await getPendingServices();
      if (response.success) {
        setServices(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les services',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (service) => {
    setSelectedService(service);
    setShowModal(false);

    const result = await Swal.fire({
      title: 'Approuver ce service?',
      text: `Service: ${service.nom}`,
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Freelancer:</strong> ${service.freelancer?.name || 'N/A'}</p>
          <p><strong>Catégorie:</strong> ${service.category}</p>
          <p><strong>Description:</strong> ${service.description}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '✓ Approuver',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        const response = await approveService(service.id);
        if (response.success) {
          setServices(services.filter(s => s.id !== service.id));
          Swal.fire({
            icon: 'success',
            title: 'Approuvé!',
            text: `${service.nom} est maintenant actif.`,
            confirmButtonColor: '#10B981',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message || 'Impossible d\'approuver le service',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReject = async (service) => {
    setSelectedService(service);
    setRejectionReason('');

    const result = await Swal.fire({
      title: 'Rejeter ce service?',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Service:</strong> ${service.nom}</p>
          <p><strong>Freelancer:</strong> ${service.freelancer?.name || 'N/A'}</p>
          <textarea id="rejection-reason" placeholder="Motif du rejet (min 10 caractères)" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: Arial; color: #000;" required></textarea>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✗ Rejeter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      preConfirm: () => {
        const reason = document.getElementById('rejection-reason').value;
        if (!reason || reason.length < 10) {
          Swal.showValidationMessage('Veuillez entrer un motif de rejet (min 10 caractères)');
          return null;
        }
        return reason;
      },
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        const response = await rejectService(service.id, result.value);
        if (response.success) {
          setServices(services.filter(s => s.id !== service.id));
          Swal.fire({
            icon: 'success',
            title: 'Rejeté!',
            text: 'Le freelancer a été notifié du rejet.',
            confirmButtonColor: '#EF4444',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message || 'Impossible de rejeter le service',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const ServiceDetailModal = ({ service }) => {
    if (!service) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${theme.card} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className={`sticky top-0 p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} flex justify-between items-center`}>
            <h3 className={`text-2xl font-bold ${theme.text}`}>{service.nom}</h3>
            <button
              onClick={() => setShowModal(false)}
              className={`p-2 rounded-lg ${theme.hover}`}
            >
              <X size={24} className={theme.textSecondary} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm font-medium ${theme.textSecondary}`}>Freelancer</p>
                <p className={`text-lg font-semibold ${theme.text}`}>{service.freelancer?.name}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${theme.textSecondary}`}>Catégorie</p>
                <p className={`text-lg font-semibold ${theme.text}`}>{service.category}</p>
              </div>
            </div>

            <div>
              <p className={`text-sm font-medium ${theme.textSecondary} mb-2`}>Description</p>
              <p className={`text-sm ${theme.text}`}>{service.description}</p>
            </div>

            {service.detailed_description && (
              <div>
                <p className={`text-sm font-medium ${theme.textSecondary} mb-2`}>Détails</p>
                <p className={`text-sm ${theme.text}`}>{service.detailed_description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm font-medium ${theme.textSecondary} flex items-center gap-2`}>
                  <MapPin size={16} /> Zones
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {service.zones?.map((zone, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-600">
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-sm font-medium ${theme.textSecondary} flex items-center gap-2`}>
                  <Calendar size={16} /> Disponibilité
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {service.availability && Object.entries(service.availability).map(([day, active]) => (
                    <span key={day} className={`px-2 py-1 text-xs rounded ${active ? 'bg-green-500/20 text-green-600' : 'bg-gray-500/20 text-gray-600'}`}>
                      {day.substring(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {service.included_items && (
              <div>
                <p className={`text-sm font-medium ${theme.textSecondary} flex items-center gap-2 mb-2`}>
                  <Package size={16} /> Éléments inclus
                </p>
                <ul className="text-sm space-y-1">
                  {service.included_items.map((item, i) => (
                    <li key={i} className={`flex items-center gap-2 ${theme.textSecondary}`}>
                      <Check size={14} className="text-green-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`sticky bottom-0 p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} flex gap-3`}>
            <button
              onClick={() => handleReject(service)}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X size={18} /> Rejeter
            </button>
            <button
              onClick={() => handleApprove(service)}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check size={18} /> Approuver
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>Validation des Services</h1>
          <p className={theme.textSecondary}>Examinez et validez les services publiés par les freelancers</p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 ${theme.textSecondary}`} size={20} />
            <input
              type="text"
              placeholder="Rechercher par service ou freelancer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.input}`}
            />
          </div>
          <button
            onClick={fetchPendingServices}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <Filter size={18} className="inline mr-2" /> Actualiser
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={40} className="text-blue-600 animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className={`${theme.card} rounded-xl p-12 text-center border`}>
            <AlertCircle size={48} className={`${theme.textSecondary} mx-auto mb-4`} />
            <p className={`text-lg ${theme.textSecondary}`}>Aucun service en attente de validation</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`${theme.card} rounded-lg border p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => {
                  setSelectedService(service);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${theme.text}`}>{service.nom}</h3>
                    <p className={`text-sm ${theme.textSecondary} mt-1`}>{service.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className={`text-sm flex items-center gap-1 ${theme.textSecondary}`}>
                        <span className="font-semibold text-blue-600">{service.freelancer?.name}</span>
                      </span>
                      <span className={`text-sm flex items-center gap-1 ${theme.textSecondary}`}>
                        <Package size={14} /> {service.category}
                      </span>
                      {service.zones && (
                        <span className={`text-sm flex items-center gap-1 ${theme.textSecondary}`}>
                          <MapPin size={14} /> {service.zones.length} zone(s)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(service);
                      }}
                      disabled={isProcessing}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 disabled:opacity-50"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(service);
                      }}
                      disabled={isProcessing}
                      className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 disabled:opacity-50"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                        setShowModal(true);
                      }}
                      className={`p-2 rounded-lg ${theme.hover}`}
                    >
                      <Eye size={18} className={theme.textSecondary} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && <ServiceDetailModal service={selectedService} />}
      </div>
    </div>
  );
};

export default SuperviseurServiceValidation;
