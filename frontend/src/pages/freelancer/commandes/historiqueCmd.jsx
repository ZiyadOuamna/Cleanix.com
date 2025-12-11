import React, { useState, useRef, useContext, useEffect } from 'react';
import { 
  Search, Download, Star, X, Package, FileText, Save, Plus, Minus
} from 'lucide-react';
import jsPDF from 'jspdf';
// IMPORT IMPORTANT : On connecte la page au contexte global
import { FreelancerContext } from '../freelancerContext';
import { getAcceptedOrders } from '../../../services/orderService';

const HistoriqueCommandes = () => {
  // CORRECTION ICI : On récupère isDarkMode depuis le contexte, pas les props
  const { isDarkMode } = useContext(FreelancerContext);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState('append');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- SYSTÈME DE THÈME AMÉLIORÉ (Haute Visibilité) ---
  const theme = {
    // Arrière-plans
    // Mode Clair : Slate-50 (Gris très pâle reposant)
    bgPrimary: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    bgSecondary: isDarkMode ? 'bg-gray-800' : 'bg-white',
    bgTertiary: isDarkMode ? 'bg-gray-700' : 'bg-slate-100',
    bgQuaternary: isDarkMode ? 'bg-gray-800/50' : 'bg-slate-50',
    
    // Textes (Contraste renforcé pour le mode clair)
    textPrimary: isDarkMode ? 'text-gray-100' : 'text-slate-900', // Noir/Gris très foncé
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-slate-700', // Gris foncé
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-500', // Gris moyen
    
    // Bordures (Plus visibles en mode clair)
    borderPrimary: isDarkMode ? 'border-gray-700' : 'border-slate-300',
    borderSecondary: isDarkMode ? 'border-gray-600' : 'border-slate-200',
    
    // Survols
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100',
    
    // Inputs
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-slate-300',
    inputText: isDarkMode ? 'text-gray-100' : 'text-slate-900',
    
    // Ombres et Cartes
    cardShadow: isDarkMode ? 'shadow-lg' : 'shadow-sm',
    
    // Icônes
    iconPrimary: isDarkMode ? 'text-gray-300' : 'text-slate-600',
    iconMuted: isDarkMode ? 'text-gray-500' : 'text-slate-400',
    
    // Tableaux
    tableHeader: isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-700',
    tableRow: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50',
  };

  // Référence pour le contenu HTML de la facture
  const invoiceRef = useRef(null);

  // Données depuis l'API - d'abord un état vide
  const [orderHistory, setOrderHistory] = useState([]);

  // Charger l'historique des commandes au montage
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAcceptedOrders();
        
        // Filtrer et transformer les commandes complétées/validées
        const completedOrders = response.data
          .filter(order => order.status === 'completed' || order.status === 'validated')
          .map((order) => ({
            id: order.id,
            clientName: order.client ? `${order.client.firstname} ${order.client.lastname}` : 'Client inconnu',
            clientPhoto: order.client ? `${order.client.firstname[0]}${order.client.lastname[0]}`.toUpperCase() : 'XX',
            service: order.service?.nom || order.service_type || 'Service non spécifié',
            date: new Date(order.scheduled_date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            time: order.heure_execution ? new Date(order.heure_execution).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Horaire non spécifié',
            address: `${order.adresse}, ${order.code_postal} ${order.ville}`,
            price: order.agreed_price || order.initial_price || 0,
            duration: order.duration || 'Non spécifié',
            status: order.status === 'completed' ? 'completed' : 'completed',
            rating: order.rating || 0,
            clientReview: order.client_feedback || order.notes || 'Pas de commentaire',
            paymentMethod: order.payment_method || 'Non spécifié',
            paymentStatus: order.payment_status === 'paid' ? 'paid' : 'pending',
            exportDate: null,
            createdAt: new Date(order.created_at).toLocaleString('fr-FR'),
            completedAt: new Date(order.updated_at).toLocaleString('fr-FR')
          }));
        
        setOrderHistory(completedOrders);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'historique:', err);
        setError('Impossible de charger l\'historique des commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const filters = [
    { id: 'all', label: 'Toutes', count: orderHistory.length },
    { id: 'completed', label: 'Terminées', count: orderHistory.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Annulées', count: orderHistory.filter(o => o.status === 'cancelled').length },
    { id: 'paid', label: 'Payées', count: orderHistory.filter(o => o.paymentStatus === 'paid').length },
    { id: 'rated', label: 'Notées', count: orderHistory.filter(o => o.rating).length }
  ];

  const filteredOrders = orderHistory.filter(order => {
    if (activeFilter === 'all') {
      // Pas de filtrage par statut
    } else if (activeFilter === 'completed') {
      if (order.status !== 'completed') return false;
    } else if (activeFilter === 'cancelled') {
      if (order.status !== 'cancelled') return false;
    } else if (activeFilter === 'paid') {
      if (order.paymentStatus !== 'paid') return false;
    } else if (activeFilter === 'rated') {
      if (!order.rating) return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        order.clientName.toLowerCase().includes(term) ||
        order.service.toLowerCase().includes(term) ||
        order.address.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      );
    }

    return true;
  });

  // Fonction pour générer et télécharger la facture PDF
  const generateInvoicePDF = (order) => {
    if (!order) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [59, 130, 246];
    const secondaryColor = [55, 65, 81];
    const successColor = [34, 197, 94];

    // En-tête de la facture
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`N° ${order.id}`, 105, 30, { align: 'center' });
    doc.text(`Date: ${order.date}`, 105, 35, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Cleanix Services', 20, 45);
    doc.text('Nettoyage Professionnel', 20, 50);

    // Informations client
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', 20, 70);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${order.clientName}`, 20, 80);
    doc.text(`Adresse: ${order.address}`, 20, 85);
    doc.text(`Téléphone: Non spécifié`, 20, 90);
    doc.text(`Email: client@email.com`, 20, 95);

    // Détails de la commande
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DE LA COMMANDE', 20, 110);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const detailsY = 120;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, detailsY - 5, 170, 10, 'F');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, detailsY);
    doc.text('Quantité', 120, detailsY);
    doc.text('Prix unitaire', 150, detailsY);
    doc.text('Total', 180, detailsY);

    doc.setFont('helvetica', 'normal');
    doc.text(order.service, 25, detailsY + 10);
    doc.text('1', 120, detailsY + 10);
    doc.text(`${order.price} DH`, 150, detailsY + 10);
    doc.text(`${order.price} DH`, 180, detailsY + 10);

    const subtotalY = detailsY + 25;
    doc.setFont('helvetica', 'normal');
    doc.text('Sous-total:', 150, subtotalY);
    doc.text(`${order.price} DH`, 180, subtotalY);

    const tva = order.price * 0.2;
    doc.text('TVA (20%):', 150, subtotalY + 10);
    doc.text(`${tva.toFixed(2)} DH`, 180, subtotalY + 10);

    doc.setFont('helvetica', 'bold');
    const totalY = subtotalY + 25;
    doc.setFillColor(successColor[0], successColor[1], successColor[2]);
    doc.rect(20, totalY - 5, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', 150, totalY);
    doc.text(`${(order.price + tva).toFixed(2)} DH`, 180, totalY);

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS DE PAIEMENT', 20, totalY + 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Méthode: ${order.paymentMethod}`, 20, totalY + 35);
    doc.text(`Statut: ${order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}`, 20, totalY + 40);
    doc.text(`Date de paiement: ${order.date}`, 20, totalY + 45);

    if (order.rating && order.clientReview) {
      doc.setFont('helvetica', 'bold');
      doc.text('AVIS DU CLIENT', 20, totalY + 60);
      
      doc.setFont('helvetica', 'normal');
      let starsText = '';
      for (let i = 0; i < 5; i++) {
        starsText += i < order.rating ? '★' : '☆';
      }
      doc.text(`Note: ${starsText} (${order.rating}/5)`, 20, totalY + 70);
      doc.text(`Commentaire: ${order.clientReview}`, 20, totalY + 80);
    }

    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Merci pour votre confiance!', 105, footerY, { align: 'center' });
    doc.text('Cleanix Services - SIRET 123 456 789 00001 - TVA FR 12 345 678 90', 105, footerY + 5, { align: 'center' });
    doc.text('Tél: 01 23 45 67 89 - Email: contact@cleanix.fr - Site: www.cleanix.fr', 105, footerY + 10, { align: 'center' });

    doc.save(`facture-${order.id}-${order.date.replace(/ /g, '_')}.pdf`);
    
    alert(`Facture #${order.id} téléchargée avec succès!`);
  };

  // Fonction pour exporter l'historique
  const handleExportHistory = () => {
    const completedOrders = orderHistory.filter(order => order.status === 'completed');
    
    if (completedOrders.length === 0) {
      alert('Aucune commande terminée à exporter.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const exportData = {
      exportDate: currentDate,
      totalOrders: completedOrders.length,
      orders: completedOrders.map(order => ({
        id: order.id,
        clientName: order.clientName,
        service: order.service,
        date: order.date,
        price: order.price,
        rating: order.rating,
        paymentMethod: order.paymentMethod
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const downloadUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'historiqueCommandesTerminees.json';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(downloadUrl);
    
    const updatedHistory = orderHistory.map(order => 
      order.status === 'completed' 
        ? { ...order, exportDate: currentDate }
        : order
    );
    setOrderHistory(updatedHistory);
    
    alert(`${completedOrders.length} commandes terminées exportées avec succès!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return isDarkMode ? 'text-green-300 bg-green-900/30' : 'text-green-800 bg-green-100';
      case 'cancelled': return isDarkMode ? 'text-red-300 bg-red-900/30' : 'text-red-800 bg-red-100';
      default: return isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-800 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return isDarkMode ? 'text-blue-300 bg-blue-900/30' : 'text-blue-800 bg-blue-100';
      case 'refunded': return isDarkMode ? 'text-purple-300 bg-purple-900/30' : 'text-purple-800 bg-purple-100';
      default: return isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-800 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'refunded': return 'Remboursée';
      default: return 'En attente';
    }
  };

  // Modal Détails
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className={`${theme.bgSecondary} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${theme.borderPrimary}`}>
          {/* En-tête de la modal */}
          <div className={`sticky top-0 ${theme.bgSecondary} border-b ${theme.borderPrimary} p-6 rounded-t-xl flex justify-between items-center`}>
            <div>
              <h3 className={`text-xl font-bold ${theme.textPrimary}`}>Détails de la commande #{order.id}</h3>
              <p className={theme.textMuted}>{order.service}</p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${theme.hoverBg} rounded-lg transition`}
            >
              <X size={20} className={theme.iconPrimary} />
            </button>
          </div>

          {/* Corps de la modal */}
          <div className="p-6 space-y-6">
            {/* Informations client */}
            <div className={`${theme.bgTertiary} rounded-lg p-4 border ${theme.borderSecondary}`}>
              <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Informations client</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {order.clientPhoto}
                </div>
                <div>
                  <p className={`font-medium ${theme.textPrimary}`}>{order.clientName}</p>
                  <p className={`text-sm ${theme.textMuted}`}>Commande #{order.id}</p>
                </div>
              </div>
            </div>

            {/* Détails de la commande */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Détails du service</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme.textMuted}>Service</span>
                    <span className={`font-medium ${theme.textPrimary}`}>{order.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textMuted}>Date</span>
                    <span className={`font-medium ${theme.textPrimary}`}>{order.date} à {order.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textMuted}>Durée</span>
                    <span className={`font-medium ${theme.textPrimary}`}>{order.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textMuted}>Adresse</span>
                    <span className={`font-medium ${theme.textPrimary}`}>{order.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Paiement & Statut</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className={theme.textMuted}>Prix</span>
                    <span className="text-xl font-bold text-green-600">{order.price}DH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textMuted}>Statut</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textMuted}>Paiement</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textMuted}>Méthode</span>
                    <span className={`font-medium ${theme.textPrimary}`}>{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Avis client */}
            {order.rating && (
              <div className={`border-t ${theme.borderPrimary} pt-6`}>
                <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Avis du client</h4>
                <div className={`${theme.bgTertiary} rounded-lg p-4 border ${theme.borderSecondary}`}>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < order.rating ? 'text-yellow-400 fill-current' : theme.iconMuted}`}
                      />
                    ))}
                    <span className={`font-bold ${theme.textPrimary} ml-2`}>{order.rating}/5</span>
                  </div>
                  <p className={theme.textSecondary}>{order.clientReview}</p>
                </div>
              </div>
            )}

            {/* Raison d'annulation */}
            {order.cancellationReason && (
              <div className={`border-t ${theme.borderPrimary} pt-6`}>
                <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Raison d'annulation</h4>
                <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4`}>
                  <p className="text-red-700 dark:text-red-300 font-medium">{order.cancellationReason}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={`border-t ${theme.borderPrimary} pt-6 flex justify-end gap-3`}>
              <button
                onClick={onClose}
                className={`px-4 py-2 border ${theme.borderPrimary} rounded-lg ${theme.hoverBg} transition ${theme.textSecondary} font-medium`}
              >
                Fermer
              </button>
              {order.status === 'completed' && (
                <button 
                  onClick={() => generateInvoicePDF(order)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm"
                >
                  <FileText size={16} />
                  Télécharger facture
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de paramètres d'export
  const ExportSettingsModal = () => {
    if (!showExportSettings) return null;

    const completedOrders = orderHistory.filter(order => order.status === 'completed');
    const exportedOrders = completedOrders.filter(order => order.exportDate);
    const newOrders = completedOrders.filter(order => !order.exportDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className={`${theme.bgSecondary} rounded-xl shadow-2xl max-w-md w-full border ${theme.borderPrimary}`}>
          <div className={`sticky top-0 ${theme.bgSecondary} border-b ${theme.borderPrimary} p-6 rounded-t-xl flex justify-between items-center`}>
            <h3 className={`text-xl font-bold ${theme.textPrimary}`}>Paramètres d'export</h3>
            <button
              onClick={() => setShowExportSettings(false)}
              className={`p-2 ${theme.hoverBg} rounded-lg`}
            >
              <X size={20} className={theme.iconPrimary} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Statistiques */}
            <div className={`${theme.bgTertiary} rounded-lg p-4 border ${theme.borderSecondary}`}>
              <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Récapitulatif</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Commandes terminées</span>
                  <span className={`font-medium ${theme.textPrimary}`}>{completedOrders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Déjà exportées</span>
                  <span className={`font-medium ${theme.textPrimary}`}>{exportedOrders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Nouvelles commandes</span>
                  <span className={`font-bold text-green-600`}>{newOrders.length}</span>
                </div>
              </div>
            </div>

            {/* Options d'export */}
            <div>
              <h4 className={`font-semibold ${theme.textPrimary} mb-3`}>Mode d'export</h4>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 border ${theme.borderPrimary} rounded-lg cursor-pointer ${theme.hoverBg}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value="append"
                    checked={exportFormat === 'append'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className={`font-medium ${theme.textPrimary}`}>Ajouter au fichier existant</span>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>
                      Ajoute seulement les nouvelles commandes
                    </p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border ${theme.borderPrimary} rounded-lg cursor-pointer ${theme.hoverBg}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value="replace"
                    checked={exportFormat === 'replace'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className={`font-medium ${theme.textPrimary}`}>Remplacer le fichier</span>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>
                      Crée un nouveau fichier complet
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportSettings(false)}
                className={`flex-1 px-4 py-2 border ${theme.borderPrimary} rounded-lg ${theme.hoverBg} transition ${theme.textSecondary} font-medium`}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleExportHistory();
                  setShowExportSettings(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <Download size={16} />
                Exporter ({newOrders.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} py-8 transition-colors duration-300`}>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={theme.textSecondary}>Chargement de votre historique...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`p-4 rounded-lg border border-red-300 ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">⚠️ {error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <ExportSettingsModal />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>Historique des Commandes</h2>
            <p className={`${theme.textMuted} mt-1`}>
              Consultez l'historique de toutes vos commandes passées
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportSettings(true)}
              className={`flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg ${isDarkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-50'} transition font-medium`}
            >
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className={`flex flex-col lg:flex-row gap-4 ${theme.bgSecondary} p-4 rounded-lg border ${theme.borderPrimary} ${theme.cardShadow}`}>
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.iconMuted}`} size={20} />
            <input
              type="text"
              placeholder="Rechercher par client, service, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border ${theme.inputBorder} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${theme.inputBg} ${theme.inputText} ${theme.inputPlaceholder}`}
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-4 py-2 rounded-lg transition border font-medium text-sm
                  ${activeFilter === filter.id 
                    ? 'bg-green-600 text-white border-green-600' 
                    : `${theme.borderPrimary} ${theme.textSecondary} ${theme.hoverBg}`
                  }
                `}
              >
                {filter.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.bgSecondary} rounded-lg p-4 border ${theme.borderPrimary} ${theme.cardShadow}`}>
            <p className={`text-sm ${theme.textMuted}`}>Revenu total</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              {orderHistory
                .filter(o => o.status === 'completed')
                .reduce((sum, order) => sum + order.price, 0)}DH
            </p>
          </div>
          <div className={`${theme.bgSecondary} rounded-lg p-4 border ${theme.borderPrimary} ${theme.cardShadow}`}>
            <p className={`text-sm ${theme.textMuted}`}>Commandes totales</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{orderHistory.length}</p>
          </div>
          <div className={`${theme.bgSecondary} rounded-lg p-4 border ${theme.borderPrimary} ${theme.cardShadow}`}>
            <p className={`text-sm ${theme.textMuted}`}>Note moyenne</p>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className={`text-2xl font-bold ${theme.textPrimary}`}>
                {(
                  orderHistory
                    .filter(o => o.rating)
                    .reduce((sum, order) => sum + order.rating, 0) /
                  orderHistory.filter(o => o.rating).length || 0
                ).toFixed(1)}
              </span>
            </div>
          </div>
          <div className={`${theme.bgSecondary} rounded-lg p-4 border ${theme.borderPrimary} ${theme.cardShadow}`}>
            <p className={`text-sm ${theme.textMuted}`}>Taux d'annulation</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              {((orderHistory.filter(o => o.status === 'cancelled').length / orderHistory.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className={`${theme.bgSecondary} rounded-xl ${theme.cardShadow} border ${theme.borderPrimary} overflow-hidden`}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className={`mx-auto mb-4 ${theme.iconMuted}`} />
              <h3 className={`text-xl font-semibold ${theme.textPrimary} mb-2`}>
                Aucune commande trouvée
              </h3>
              <p className={theme.textMuted}>
                {searchTerm ? "Essayez avec d'autres termes de recherche" : "Aucune commande dans l'historique"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={theme.tableHeader}>
                  <tr>
                    {['Commande', 'Client', 'Service', 'Date', 'Prix', 'Statut', 'Actions'].map((head) => (
                      <th key={head} className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} last:border-r-0`}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.tableBorder}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={theme.tableRow}>
                      <td className={`px-6 py-4 whitespace-nowrap border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <p className={`font-bold ${theme.textPrimary}`}>#{order.id}</p>
                          <p className={`text-sm ${theme.textMuted}`}>
                            {order.time}
                          </p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {order.clientPhoto}
                          </div>
                          <div>
                            <p className={`font-medium ${theme.textPrimary}`}>{order.clientName}</p>
                            {order.rating && (
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span className={`text-xs ${theme.textMuted}`}>{order.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`font-medium ${theme.textPrimary}`}>{order.service}</p>
                        <p className={`text-sm ${theme.textMuted}`}>{order.duration}</p>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={theme.textPrimary}>{order.date}</p>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className="text-lg font-bold text-green-600">{order.price} DH</p>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`px-3 py-1 text-sm border rounded-lg transition font-medium ${theme.borderPrimary} ${theme.textSecondary} ${theme.hoverBg}`}
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className={`px-6 py-4 border-t ${theme.borderPrimary} flex justify-between items-center`}>
              <p className={`text-sm ${theme.textMuted}`}>
                Affichage de 1 à {filteredOrders.length} sur {filteredOrders.length} commandes
              </p>
              <div className="flex gap-2">
                <button className={`px-3 py-1 border ${theme.borderPrimary} rounded-lg ${theme.hoverBg} transition ${theme.textSecondary} font-medium`}>
                  Précédent
                </button>
                <button className={`px-3 py-1 border ${theme.borderPrimary} rounded-lg ${theme.hoverBg} transition ${theme.textSecondary} font-medium`}>
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal de détails */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default HistoriqueCommandes;