import React from 'react';

const ProcessSection = ({ isDarkMode, processRef }) => {
  const clientSteps = [
    { title: "1 ) Choisir le service", description: "Sélectionnez le type de nettoyage dont vous avez besoin", icon: "📋" },
    { title: "2 ) Planifier", description: "Choisissez la date et l'heure qui vous conviennent", icon: "📅" },
    { title: "3 ) Confirmer", description: "Validez votre réservation en ligne", icon: "✅" },
    { title: "4 ) Profiter", description: "Nous nous occupons de tout, vous profitez", icon: "✨" }
  ];

  const freelancerSteps = [
    { title: "1 ) Créer un profil", description: "Inscrivez-vous et complétez votre profil professionnel", icon: "👤" },
    { title: "2 ) Recevoir des missions", description: "Obtenez des missions adaptées à vos compétences", icon: "📨" },
    { title: "3 ) Exécuter le service", description: "Réalisez le nettoyage selon les standards qualité", icon: "🧽" },
    { title: "4 ) Être payé", description: "Recevez votre paiement rapidement et sécurisé", icon: "💸" }
  ];

  return (
    <section 
      ref={processRef}
      className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Comment ça <span className="text-blue-600">marche</span> ?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Découvrez comment utiliser Cleanix, que vous soyez client ou professionnel
          </p>
        </div>

        {/* Pour les Clients */}
        <div className="mb-20">
          <h3 className={`text-3xl font-bold text-center mb-12 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Pour les <span className="text-blue-600">Clients</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {clientSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    {step.icon}
                  </div>
                </div>
                <h4 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h4>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pour les Freelancers */}
        <div>
          <h3 className={`text-3xl font-bold text-center mb-12 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Pour les <span className="text-green-500">Freelancers</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {freelancerSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-600 to-blue-600' 
                      : 'bg-gradient-to-br from-green-500 to-blue-600'
                  }`}>
                    {step.icon}
                  </div>
                </div>
                <h4 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h4>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;