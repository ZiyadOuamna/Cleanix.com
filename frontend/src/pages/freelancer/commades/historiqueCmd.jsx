import React, { useState, useRef } from 'react';
import { 
  Search, Download, Star, X, Package, FileText, Save, Plus, Minus
} from 'lucide-react';
import jsPDF from 'jspdf';

const HistoriqueCommandes = ({ isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState('append'); // 'append' ou 'replace'
  
  // Référence pour le contenu HTML de la facture
  const invoiceRef = useRef(null);

  // Données d'historique des commandes
  const [orderHistory, setOrderHistory] = useState([
    {
      id: 101,
      clientName: "Jean Dupont",
      clientPhoto: "JD",
      service: "Nettoyage complet",
      date: "15 Jan 2024",
      time: "10:30",
      address: "123 Rue de Paris, 75001 Paris",
      price: 85,
      duration: "2h30",
      status: "completed",
      rating: 5,
      clientReview: "Excellent travail, très professionnel!",
      paymentMethod: "Carte bancaire",
      paymentStatus: "paid",
      exportDate: null // Date d'exportation pour le suivi
    },
    {
      id: 102,
      clientName: "Marie Martin",
      clientPhoto: "MM",
      service: "Nettoyage de printemps",
      date: "14 Jan 2024",
      time: "14:00",
      address: "456 Avenue des Champs, 75008 Paris",
      price: 120,
      duration: "4h",
      status: "completed",
      rating: 4,
      clientReview: "Très satisfaite, à recommander",
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      exportDate: null
    },
    {
      id: 103,
      clientName: "Pierre Bernard",
      clientPhoto: "PB",
      service: "Nettoyage bureau",
      date: "13 Jan 2024",
      time: "09:00",
      address: "789 Boulevard Saint-Germain, 75006 Paris",
      price: 150,
      duration: "3h",
      status: "cancelled",
      rating: null,
      clientReview: null,
      paymentMethod: "Carte bancaire",
      paymentStatus: "refunded",
      cancellationReason: "Client a annulé",
      exportDate: null
    },
    {
      id: 104,
      clientName: "Sophie Laurent",
      clientPhoto: "SL",
      service: "Nettoyage de vitres",
      date: "12 Jan 2024",
      time: "11:00",
      address: "321 Rue de Rivoli, 75004 Paris",
      price: 65,
      duration: "1h30",
      status: "completed",
      rating: 5,
      clientReview: "Parfait, merci beaucoup!",
      paymentMethod: "Espèces",
      paymentStatus: "paid",
      exportDate: null
    },
    {
      id: 105,
      clientName: "Thomas Moreau",
      clientPhoto: "TM",
      service: "Nettoyage après travaux",
      date: "10 Jan 2024",
      time: "13:30",
      address: "654 Rue de la Paix, 75002 Paris",
      price: 200,
      duration: "5h",
      status: "completed",
      rating: 4,
      clientReview: "Très bon service",
      paymentMethod: "Carte bancaire",
      paymentStatus: "paid",
      exportDate: null
    },
    {
      id: 106,
      clientName: "Émilie Rousseau",
      clientPhoto: "ER",
      service: "Nettoyage complet",
      date: "08 Jan 2024",
      time: "15:00",
      address: "987 Avenue Montaigne, 75008 Paris",
      price: 95,
      duration: "3h",
      status: "completed",
      rating: 5,
      clientReview: "Impeccable, je recommande",
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      exportDate: null
    },
    {
      id: 107,
      clientName: "Antoine Dubois",
      clientPhoto: "AD",
      service: "Nettoyage vitres",
      date: "05 Jan 2024",
      time: "16:00",
      address: "147 Rue du Faubourg Saint-Honoré, 75008 Paris",
      price: 70,
      duration: "2h",
      status: "completed",
      rating: 3,
      clientReview: "Correct, mais pourrait mieux faire",
      paymentMethod: "Espèces",
      paymentStatus: "paid",
      exportDate: null
    },
    {
      id: 108,
      clientName: "Camille Lefevre",
      clientPhoto: "CL",
      service: "Nettoyage de printemps",
      date: "03 Jan 2024",
      time: "10:00",
      address: "258 Rue de Vaugirard, 75015 Paris",
      price: 135,
      duration: "4h30",
      status: "cancelled",
      rating: null,
      clientReview: null,
      paymentMethod: "Carte bancaire",
      paymentStatus: "refunded",
      cancellationReason: "Problème d'emploi du temps",
      exportDate: null
    }
  ]);

  const filters = [
    { id: 'all', label: 'Toutes', count: orderHistory.length },
    { id: 'completed', label: 'Terminées', count: orderHistory.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Annulées', count: orderHistory.filter(o => o.status === 'cancelled').length },
    { id: 'paid', label: 'Payées', count: orderHistory.filter(o => o.paymentStatus === 'paid').length },
    { id: 'rated', label: 'Notées', count: orderHistory.filter(o => o.rating).length }
  ];

  const filteredOrders = orderHistory.filter(order => {
    // Filtre par statut
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

    // Filtre par recherche
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

    // Définir les couleurs
    const primaryColor = [59, 130, 246]; // Blue-500
    const secondaryColor = [55, 65, 81]; // Gray-700
    const successColor = [34, 197, 94]; // Green-500

    // En-tête de la facture
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Titre principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Numéro de facture
    doc.setFontSize(12);
    doc.text(`N° ${order.id}`, 105, 30, { align: 'center' });
    doc.text(`Date: ${order.date}`, 105, 35, { align: 'center' });

    // Logo/En-tête de la société (simplifié)
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
    
    // Tableau des détails
    const detailsY = 120;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, detailsY - 5, 170, 10, 'F');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, detailsY);
    doc.text('Quantité', 120, detailsY);
    doc.text('Prix unitaire', 150, detailsY);
    doc.text('Total', 180, detailsY);

    // Ligne de la commande
    doc.setFont('helvetica', 'normal');
    doc.text(order.service, 25, detailsY + 10);
    doc.text('1', 120, detailsY + 10);
    doc.text(`${order.price} €`, 150, detailsY + 10);
    doc.text(`${order.price} €`, 180, detailsY + 10);

    // Sous-totaux
    const subtotalY = detailsY + 25;
    doc.setFont('helvetica', 'normal');
    doc.text('Sous-total:', 150, subtotalY);
    doc.text(`${order.price} €`, 180, subtotalY);

    // TVA (20%)
    const tva = order.price * 0.2;
    doc.text('TVA (20%):', 150, subtotalY + 10);
    doc.text(`${tva.toFixed(2)} €`, 180, subtotalY + 10);

    // Total
    doc.setFont('helvetica', 'bold');
    const totalY = subtotalY + 25;
    doc.setFillColor(successColor[0], successColor[1], successColor[2]);
    doc.rect(20, totalY - 5, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', 150, totalY);
    doc.text(`${(order.price + tva).toFixed(2)} €`, 180, totalY);

    // Informations de paiement
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS DE PAIEMENT', 20, totalY + 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Méthode: ${order.paymentMethod}`, 20, totalY + 35);
    doc.text(`Statut: ${order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}`, 20, totalY + 40);
    doc.text(`Date de paiement: ${order.date}`, 20, totalY + 45);

    // Avis client (si disponible)
    if (order.rating && order.clientReview) {
      doc.setFont('helvetica', 'bold');
      doc.text('AVIS DU CLIENT', 20, totalY + 60);
      
      doc.setFont('helvetica', 'normal');
      // Note en étoiles
      let starsText = '';
      for (let i = 0; i < 5; i++) {
        starsText += i < order.rating ? '★' : '☆';
      }
      doc.text(`Note: ${starsText} (${order.rating}/5)`, 20, totalY + 70);
      doc.text(`Commentaire: ${order.clientReview}`, 20, totalY + 80);
    }

    // Pied de page
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Merci pour votre confiance!', 105, footerY, { align: 'center' });
    doc.text('Cleanix Services - SIRET 123 456 789 00001 - TVA FR 12 345 678 90', 105, footerY + 5, { align: 'center' });
    doc.text('Tél: 01 23 45 67 89 - Email: contact@cleanix.fr - Site: www.cleanix.fr', 105, footerY + 10, { align: 'center' });

    // Télécharger le PDF
    doc.save(`facture-${order.id}-${order.date.replace(/ /g, '_')}.pdf`);
    
    alert(`Facture #${order.id} téléchargée avec succès!`);
  };

  // Fonction pour exporter l'historique
  const handleExportHistory = () => {
    // Filtrer seulement les commandes terminées
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

    // Convertir en JSON avec formatage
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Créer un lien de téléchargement
    const downloadUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'historiqueCommandesTerminees.json';
    
    // Simuler le clic
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer l'URL
    URL.revokeObjectURL(downloadUrl);
    
    // Marquer les commandes comme exportées
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
      case 'completed': return 'text-green-800 dark:text-green-300';
      case 'cancelled': return 'text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
      case 'paid': return 'text-green-800 dark:text-green-300';
      case 'refunded': return 'text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'refunded': return 'Remboursée';
      default: return 'En attente';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* En-tête de la modal */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Détails de la commande #{order.id}</h3>
              <p className="text-gray-600 dark:text-gray-400">{order.service}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Corps de la modal */}
          <div className="p-6 space-y-6">
            {/* Informations client */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold dark:text-white mb-3">Informations client</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {order.clientPhoto}
                </div>
                <div>
                  <p className="font-medium dark:text-white">{order.clientName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Commande #{order.id}</p>
                </div>
              </div>
            </div>

            {/* Détails de la commande */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${bgClass}`}>
              <div>
                <h4 className="font-semibold mb-3">Détails du service</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="">Service</span>
                    <span className="font-medium">{order.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Date</span>
                    <span className="font-medium ">{order.date} à {order.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Durée</span>
                    <span className="font-medium">{order.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Adresse</span>
                    <span className="font-medium">{order.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold dark:text-white mb-3">Paiement & Statut</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Prix</span>
                    <span className="text-2xl font-bold text-green-600">{order.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Statut</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Paiement</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Méthode</span>
                    <span className="font-medium dark:text-white">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Avis client */}
            {order.rating && (
              <div className="border-t pt-6">
                <h4 className="font-semibold dark:text-white mb-3">Avis du client</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="font-medium dark:text-white ml-2">{order.rating}/5</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{order.clientReview}</p>
                </div>
              </div>
            )}

            {/* Raison d'annulation */}
            {order.cancellationReason && (
              <div className="border-t pt-6">
                <h4 className="font-semibold dark:text-white mb-3">Raison d'annulation</h4>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300">{order.cancellationReason}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Fermer
              </button>
              {order.status === 'completed' && (
                <button 
                  onClick={() => generateInvoicePDF(order)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">Paramètres d'export</h3>
            <button
              onClick={() => setShowExportSettings(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Statistiques */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold dark:text-white mb-3">Récapitulatif</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Commandes terminées</span>
                  <span className="font-medium dark:text-white">{completedOrders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Déjà exportées</span>
                  <span className="font-medium dark:text-white">{exportedOrders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nouvelles commandes</span>
                  <span className="font-medium dark:text-white text-green-600">{newOrders.length}</span>
                </div>
              </div>
            </div>

            {/* Options d'export */}
            <div>
              <h4 className="font-semibold dark:text-white mb-3">Mode d'export</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="append"
                    checked={exportFormat === 'append'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="font-medium dark:text-white">Ajouter au fichier existant</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Ajoute seulement les nouvelles commandes au fichier historique
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="replace"
                    checked={exportFormat === 'replace'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="font-medium dark:text-white">Remplacer le fichier</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Crée un nouveau fichier avec toutes les commandes terminées
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleExportHistory();
                  setShowExportSettings(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Exporter ({newOrders.length} nouvelles)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Classes pour le dark mode
  const bgClass = isDarkMode;
  const textClass = isDarkMode;
  const textSecondaryClass = isDarkMode;
  const cardBgClass = isDarkMode;
  const borderClass = isDarkMode;

  return (
    <div className={`min-h-screen ${bgClass} py-8 transition-colors duration-300`}>
      <ExportSettingsModal />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>Historique des Commandes</h2>
            <p className={`${textSecondaryClass} mt-1`}>
              Consultez l'historique de toutes vos commandes passées
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportSettings(true)}
              className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition"
            >
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className={`flex flex-col lg:flex-row gap-4 ${cardBgClass} p-4 rounded-lg border`}>
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${bgClass}`} size={20} />
            <input
              type="text"
              placeholder="Rechercher par client, service, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 dark:bg-gray-900 focus:ring-green-500 focus:border-transparent`}
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-4 py-2 rounded-lg transition ${activeFilter === filter.id ? 'bg-green-700 text-white': `${textSecondaryClass}`}
                  border

                `}
              >
                {filter.label}
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenu total</p>
            <p className={`text-2xl font-bold ${textClass}`}>
              {orderHistory
                .filter(o => o.status === 'completed')
                .reduce((sum, order) => sum + order.price, 0)}€
            </p>
          </div>
          <div className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Commandes totales</p>
            <p className={`text-2xl font-bold ${textClass}`}>{orderHistory.length}</p>
          </div>
          <div className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</p>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className={`text-2xl font-bold ${textClass}`}>
                {(
                  orderHistory
                    .filter(o => o.rating)
                    .reduce((sum, order) => sum + order.rating, 0) /
                  orderHistory.filter(o => o.rating).length || 0
                ).toFixed(1)}
              </span>
            </div>
          </div>
          <div className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'annulation</p>
            <p className={`text-2xl font-bold ${textClass}`}>
              {((orderHistory.filter(o => o.status === 'cancelled').length / orderHistory.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className={`${cardBgClass} rounded-xl shadow-lg border ${borderClass} overflow-hidden`}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto mb-4" />
              <h3 className={`text-xl font-semibold ${textSecondaryClass} mb-2`}>
                Aucune commande trouvée
              </h3>
              <p className={textSecondaryClass}>
                {searchTerm ? "Essayez avec d'autres termes de recherche" : "Aucune commande dans l'historique"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode} ${textClass} border`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={isDarkMode ? 'hover:bg-blue-50' : 'hover:bg-blue-900'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className={`font-medium ${textClass}`}>#{order.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {order.clientPhoto}
                          </div>
                          <div>
                            <p className={`font-medium ${textClass}`}>{order.clientName}</p>
                            {order.rating && (
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs text-gray-500">{order.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-medium ${textClass}`}>{order.service}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.duration}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className={textClass}>{order.date}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-lg font-bold text-green-600">{order.price} DH</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs w-fit ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs w-fit ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 rounded-lg transition"
                          >
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className={`px-6 py-4 border-t ${borderClass} flex justify-between items-center`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Affichage de 1 à {filteredOrders.length} sur {filteredOrders.length} commandes
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Précédent
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
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
    </div>
  );
};

export default HistoriqueCommandes;