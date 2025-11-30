import React from 'react';
const Header = ({ 
  isDarkMode, 
  toggleDarkMode,
  isScrolled, 
  navigate, 
  scrollToSection, 
  servicesRef, 
  processRef, 
  paymentRef,
  testimonialsRef,
  contactRef 
}) => {
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? (isDarkMode ? 'bg-gray-900 shadow-lg' : 'bg-white shadow-lg') 
        : (isDarkMode ? 'bg-transparent' : 'bg-transparent')
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div className="flex items-center">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Cleanix
            </span>
          </div>

          {/* Navigation complète */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection(servicesRef)}
              className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection(processRef)}
              className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Processus
            </button>
            <button
              onClick={() => scrollToSection(paymentRef)}
              className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Paiement
            </button>
            <button
              onClick={() => scrollToSection(testimonialsRef)}
              className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Avis
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Contact
            </button>
          </nav>

          {/* Boutons droite */}
          <div className="flex items-center space-x-4">
            {/* Bouton mode sombre/clair */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <button 
              onClick={() => navigate('/login')}
              className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Connexion
            </button>
            
            <button 
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              S'inscrire
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;