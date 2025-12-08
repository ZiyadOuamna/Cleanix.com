import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);

  // Auto-hide header on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setHeaderVisible(true);
      
      // Clear previous timeout
      if (hideTimeout) clearTimeout(hideTimeout);
      
      // Hide after 3 seconds of no movement
      const timeout = setTimeout(() => {
        setHeaderVisible(false);
      }, 3000);
      
      setHideTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);

  const navLinks = [
    { label: 'Services', ref: servicesRef },
    { label: 'Processus', ref: processRef },
    { label: 'Paiement', ref: paymentRef },
    { label: 'Avis', ref: testimonialsRef },
    { label: 'Contact', ref: contactRef }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
    } ${
      isScrolled 
        ? (isDarkMode ? 'bg-gray-950 shadow-xl' : 'bg-gray-100 shadow-xl') 
        : (isDarkMode ? 'bg-gray-950/95 backdrop-blur-sm' : 'bg-gray-100/95 backdrop-blur-sm')
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Cleanix
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.ref)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Boutons droite */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Basculer le mode sombre"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Login Button */}
            <button 
              onClick={() => navigate('/login')}
              className={`hidden sm:block px-4 py-2 rounded-lg font-semibold transition-all ${
                isDarkMode 
                  ? 'text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Connexion
            </button>

            {/* Sign Up Button */}
            <button 
              onClick={() => navigate('/register')}
              className="hidden sm:block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              S'inscrire
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className={`lg:hidden pb-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  scrollToSection(link.ref);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 font-medium transition-all ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 font-medium transition-all ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Connexion
            </button>
            <button 
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold mt-2"
            >
              S'inscrire
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};


export default Header;