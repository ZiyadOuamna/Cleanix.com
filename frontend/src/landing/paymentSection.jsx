import React from 'react';

const PaymentSection = ({ isDarkMode, paymentRef, paymentMethods }) => {
  return (
    <section ref={paymentRef} className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Méthodes de Paiement
          </h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Plusieurs options sécurisées disponibles
          </p>
        </div>

        {/* Logos des méthodes de paiement */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg text-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'
              }`}
            >
              <div className="flex justify-center space-x-2 mb-3">
                {method.logos.map((logo, logoIndex) => (
                  <img 
                    key={logoIndex}
                    src={logo} 
                    alt={method.name}
                    className="h-8 w-auto"
                  />
                ))}
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {method.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PaymentSection;