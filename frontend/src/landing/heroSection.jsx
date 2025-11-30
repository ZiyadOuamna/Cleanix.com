import React from 'react';

const HeroSection = ({ isDarkMode, navigate, scrollToSection, servicesRef }) => {
  return (
    <section className={`pt-32 pb-20 min-h-screen flex items-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Texte Gauche */}
          <div className="w-full lg:w-1/2 space-y-8">
            <h1 className={`text-5xl md:text-6xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Votre Espace,<br/>
              <span className="text-blue-600">Impeccable</span> en un Clic.
            </h1>
            
            <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              La plateforme Cleanix vous connecte instantanément à des professionnels vérifiés 
              pour tous vos besoins : du nettoyage résidentiel à la gestion de vos clés.
            </p>
            
            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => scrollToSection(servicesRef)}
                className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Commander un nettoyage
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="border-2 border-blue-600 text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Devenir un Freelancer
              </button>
            </div>
          </div>

          {/* Image Droite */}
          <div className="w-full lg:w-1/2">
            <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Service de nettoyage professionnel"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="mt-6 text-center">
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Service de Nettoyage Professionnel
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Des experts qualifiés pour un résultat impeccable
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;