import React from 'react';

const PortefeuilleFreelancer = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Portefeuille</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Solde Disponible</h3>
          <p className="text-3xl font-bold text-green-600">930€</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">320€</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Total gagné</h3>
          <p className="text-3xl font-bold text-blue-600">1,250€</p>
        </div>
      </div>
    </div>
  );
};

export default PortefeuilleFreelancer;