import React from 'react';
import { Home, Building2, Key, Sparkles, Shield, Clock } from 'lucide-react';

const ServicesSection = ({ isDarkMode, servicesRef }) => {
  const services = [
    {
      icon: Home,
      title: "Nettoyage Résidentiel",
      description: "Appartements, maisons, villas - Un nettoyage complet et détaillé adapté à votre espace",
      features: ["Pièces à vivre", "Cuisine", "Salles de bain"]
    },
    {
      icon: Building2,
      title: "Nettoyage Commercial",
      description: "Bureaux, espaces professionnels - Un environnement de travail impeccable chaque jour",
      features: ["Bureaux", "Espaces communs", "Sanitaires"]
    },
    {
      icon: Sparkles,
      title: "Nettoyage Profond",
      description: "Nettoyage intense - après déménagement, rénovation ou nettoyage de printemps complet",
      features: ["Toutes pièces", "Détails cachés", "Désinfection"]
    },
    {
      icon: Key,
      title: "Gestion des Clés",
      description: "Service sécurisé de gestion et de remise des clés avec traçabilité garantie",
      features: ["Entreposage sûr", "Traçabilité", "24/7 disponible"]
    }
  ];

  return (
    <section ref={servicesRef} className={`min-h-screen w-full flex items-center justify-center py-16 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]'
        : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Nos Services
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Des solutions complètes et professionnelles adaptées à tous vos besoins de nettoyage
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className={`group relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border border-gray-600 hover:border-cyan-500' 
                    : 'bg-gray-50 border border-gray-200 hover:border-cyan-500 hover:bg-gray-100'
                } hover:shadow-2xl hover:transform hover:-translate-y-2`}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
                
                <div className="relative z-10 space-y-2">
                  {/* Icon */}
                  <div className={`w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 rounded-lg sm:rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'
                      : 'bg-gradient-to-br from-cyan-100 to-blue-100'
                  } group-hover:shadow-lg transition-all`}>
                    <Icon size={20} className="sm:w-8 lg:w-8 text-cyan-500 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  
                  {/* Content */}
                  <h3 className={`text-xs sm:text-sm lg:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-xs sm:text-xs lg:text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-1 pt-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className={`mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 lg:p-8 rounded-2xl border ${
          isDarkMode
            ? 'bg-gray-700/30 border-gray-600'
            : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: "Professionnels Vérifiés", desc: "Tous nos freelancers sont vérifiés et assurés" },
              { icon: Clock, title: "Réservation Simple", desc: "Planifiez en quelques minutes seulement" },
              { icon: Sparkles, title: "Qualité Garantie", desc: "Garantie 100% satisfaction ou remboursement" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3">
                  <Icon size={20} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`font-bold text-xs sm:text-sm lg:text-base mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;