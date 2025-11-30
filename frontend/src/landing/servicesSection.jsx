import React from 'react';

const ServicesSection = ({ isDarkMode, servicesRef }) => {
  const services = [
    {
      icon: "🧹",
      title: "Nettoyage Résidentiel",
      description: "Appartements, maisons, villas - Un nettoyage complet et détaillé"
    },
    {
      icon: "🏢",
      title: "Nettoyage Commercial",
      description: "Bureaux, espaces professionnels - Un environnement de travail impeccable"
    },
    {
      icon: "🔑",
      title: "Gestion des Clés",
      description: "Service sécurisé de gestion et de remise des clés"
    },
    {
      icon: "🚿",
      title: "Nettoyage Profond",
      description: "Nettoyage de printemps, après déménagement ou rénovation"
    }
  ];

  return (
    <section ref={servicesRef} className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Nos Services
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Des solutions complètes adaptées à tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`p-8 rounded-2xl text-center transition-all duration-300 hover:transform hover:scale-105 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
              }`}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.title}
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;