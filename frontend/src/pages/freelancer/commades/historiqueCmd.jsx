import React, { useState } from 'react';
import { 
  Search, Download, Star, X, Package 
} from 'lucide-react';

const HistoriqueCommandes = ({ isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      paymentStatus: "paid"
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
      paymentStatus: "paid"
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
      cancellationReason: "Client a annulé"
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
      paymentStatus: "paid"
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
      paymentStatus: "paid"
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
      paymentStatus: "paid"
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
      paymentStatus: "paid"
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
      cancellationReason: "Problème d'emploi du temps"
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold dark:text-white mb-3">Détails du service</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service</span>
                    <span className="font-medium dark:text-white">{order.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-medium dark:text-white">{order.date} à {order.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Durée</span>
                    <span className="font-medium dark:text-white">{order.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Adresse</span>
                    <span className="font-medium dark:text-white text-right">{order.address}</span>
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
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Télécharger facture
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExportDataButton = () => {
    const handleExport = () => {
      const dataStr = JSON.stringify(filteredOrders, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `historique-commandes-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('Export terminé! Votre fichier a été téléchargé.');
    };

    return (
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition"
      >
        <Download size={16} />
        Exporter
      </button>
    );
  };

  // Classes pour le dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} py-8 transition-colors duration-300`}>
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
            <ExportDataButton />
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par client, service, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${cardBgClass} border ${borderClass} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${textClass}`}
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeFilter === filter.id
                    ? 'bg-green-600 text-white'
                    : `${textSecondaryClass} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
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
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
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
                <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
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
                        <p className="text-lg font-bold text-green-600">{order.price}€</p>
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
                          {order.status === 'completed' && (
                            <button className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 rounded-lg transition">
                              Facture
                            </button>
                          )}
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