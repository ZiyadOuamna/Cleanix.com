import React from 'react';

const PaymentSection = ({ isDarkMode, paymentRef, paymentMethods }) => {
  const paymentMethods_list = [
    {
      name: 'Visa',
      logo: (
        <svg viewBox="0 0 48 32" className="w-12 h-8 sm:w-16 sm:h-10">
          <rect width="48" height="32" rx="4" fill="#1A1F71"/>
          <text x="24" y="20" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">VISA</text>
        </svg>
      ),
      bgColor: '#1A1F71'
    },
    {
      name: 'Mastercard',
      logo: (
        <svg viewBox="0 0 48 32" className="w-12 h-8 sm:w-16 sm:h-10">
          <rect width="48" height="32" rx="4" fill="white" stroke="#ccc" strokeWidth="1"/>
          <circle cx="18" cy="16" r="8" fill="#FF5F00"/>
          <circle cx="30" cy="16" r="8" fill="#EB001B"/>
        </svg>
      ),
      bgColor: 'white'
    },
    {
      name: 'PayPal',
      logo: (
        <svg viewBox="0 0 48 32" className="w-12 h-8 sm:w-16 sm:h-10">
          <rect width="48" height="32" rx="4" fill="#003087"/>
          <text x="24" y="20" fontSize="16" fontWeight="bold" fill="#FFC439" textAnchor="middle">P</text>
        </svg>
      ),
      bgColor: '#003087'
    },
    {
      name: 'Virement Bancaire',
      logo: (
        <svg viewBox="0 0 48 32" className="w-12 h-8 sm:w-16 sm:h-10">
          <rect width="48" height="32" rx="4" fill="#07A2BE"/>
          <g fill="white">
            <rect x="8" y="6" width="32" height="16" rx="1" stroke="white" strokeWidth="1" fill="none"/>
            <line x1="8" y1="14" x2="40" y2="14" stroke="white" strokeWidth="1"/>
            <line x1="12" y1="10" x2="12" y2="18" stroke="white" strokeWidth="0.5"/>
            <line x1="36" y1="10" x2="36" y2="18" stroke="white" strokeWidth="0.5"/>
          </g>
        </svg>
      ),
      bgColor: '#07A2BE'
    }
  ];

  return (
    <section ref={paymentRef} className={`min-h-screen w-full flex items-center justify-center py-16 ${isDarkMode ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Titre */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Méthodes de Paiement
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Plusieurs options sécurisées disponibles
          </p>
        </div>

        {/* Logos des méthodes de paiement */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {paymentMethods_list.map((method, index) => (
            <div 
              key={index}
              className={`group relative p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-cyan-500'
              } hover:shadow-2xl hover:-translate-y-1 cursor-pointer`}
            >
              {/* Background gradient effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
                style={{ backgroundColor: method.bgColor }}
              ></div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-3 h-full">
                {/* Logo with proper display */}
                <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {method.logo}
                </div>

                {/* Payment method name */}
                <p className={`text-xs sm:text-sm font-bold text-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-300 group-hover:text-cyan-400' 
                    : 'text-gray-800 group-hover:text-cyan-600'
                }`}>
                  {method.name}
                </p>

                {/* Security badge */}
                <div className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                  isDarkMode
                    ? 'bg-gray-700/50 text-gray-400'
                    : 'bg-gray-200/50 text-gray-600'
                }`}>
                  <span>🔒</span>
                  <span>Sécurisé</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security info */}
        <div className={`mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 rounded-lg sm:rounded-xl border ${
          isDarkMode
            ? 'bg-gray-800/30 border-gray-700'
            : 'bg-gray-50/50 border-gray-200'
        }`}>
          <div className="flex gap-3 items-start">
            <div className="text-xl sm:text-2xl">🔐</div>
            <div>
              <p className={`text-xs sm:text-sm font-bold mb-1 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                Paiements 100% sécurisés
              </p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Vos données sont protégées par le chiffrement SSL et les normes PCI-DSS. Aucune information de carte n'est stockée sur nos serveurs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PaymentSection;