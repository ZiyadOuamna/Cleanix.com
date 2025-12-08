import React from 'react';
import { CheckCircle2, Search, Calendar, CreditCard, User, MessageSquare, Zap, DollarSign, ArrowRight } from 'lucide-react';

const ProcessSection = ({ isDarkMode, processRef }) => {
  const clientSteps = [
    { 
      title: "Choisir le service", 
      description: "Sélectionnez le type de nettoyage dont vous avez besoin et le niveau de détail requis", 
      icon: Search,
      step: 1
    },
    { 
      title: "Planifier", 
      description: "Choisissez la date, l'heure et le freelancer qui vous conviennent le mieux", 
      icon: Calendar,
      step: 2
    },
    { 
      title: "Confirmer", 
      description: "Validez votre réservation et effectuez le paiement de manière sécurisée", 
      icon: CheckCircle2,
      step: 3
    },
    { 
      title: "Profiter", 
      description: "Nous nous occupons de tout, vous profitez d'un espace impeccable et propre", 
      icon: Zap,
      step: 4
    }
  ];

  const freelancerSteps = [
    { 
      title: "Créer un profil", 
      description: "Inscrivez-vous et complétez votre profil professionnel avec expérience et photos", 
      icon: User,
      step: 1
    },
    { 
      title: "Recevoir des missions", 
      description: "Obtenez des missions adaptées à vos compétences et disponibilités", 
      icon: MessageSquare,
      step: 2
    },
    { 
      title: "Exécuter le service", 
      description: "Réalisez le nettoyage selon les standards qualité de Cleanix", 
      icon: Zap,
      step: 3
    },
    { 
      title: "Être payé", 
      description: "Recevez votre paiement rapidement et sécurisé sur votre portefeuille", 
      icon: DollarSign,
      step: 4
    }
  ];

  const renderSteps = (steps, gradientFrom, gradientTo, accentColor) => (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index < steps.length - 1;
        
        return (
          <div key={index} className="relative">
            {/* Connector Arrow */}
            {isLast && (
              <div className={`hidden lg:block absolute top-12 -right-6 w-12 h-0.5 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <ArrowRight className={`w-5 h-5 absolute right-0 -top-2 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
              </div>
            )}
            
            <div className={`group relative p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border transition-all duration-300 h-full ${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-700 hover:border-cyan-500'
                : 'bg-gray-50 border-gray-200 hover:border-cyan-500 hover:bg-gray-100'
            } hover:shadow-2xl`}>
              
              {/* Step Number Badge */}
              <div className={`absolute -top-3 sm:-top-4 left-3 sm:left-6 w-7 sm:w-9 h-7 sm:h-9 rounded-full flex items-center justify-center font-bold text-white border-2 sm:border-3 text-xs ${
                isDarkMode ? 'border-gray-800' : 'border-white'
              } bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
                {step.step}
              </div>
              
              {/* Icon */}
              <div className={`w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mt-1 sm:mt-2 ${
                isDarkMode
                  ? 'bg-gray-700/50'
                  : 'bg-gray-100'
              } group-hover:shadow-lg transition-all`}>
                <Icon size={16} className={`sm:w-5 lg:w-6 text-${accentColor}-500`} />
              </div>
              
              {/* Content */}
              <h4 className={`text-xs sm:text-sm lg:text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {step.title}
              </h4>
              <p className={`text-xs sm:text-xs lg:text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section 
      ref={processRef}
      className={`min-h-screen w-full flex items-center justify-center py-16 ${isDarkMode 
        ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]'
        : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Comment ça <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">marche</span> ?
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Découvrez comment utiliser Cleanix en quelques étapes simples, que vous soyez client ou professionnel
          </p>
        </div>

        {/* Pour les Clients */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h3 className={`text-sm sm:text-xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pour les <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Clients</span>
          </h3>
          {renderSteps(clientSteps, 'from-cyan-500', 'to-blue-600', 'cyan')}
        </div>

        {/* Pour les Freelancers */}
        <div>
          <h3 className={`text-sm sm:text-xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pour les <span className="bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent">Freelancers</span>
          </h3>
          {renderSteps(freelancerSteps, 'from-emerald-500', 'to-cyan-600', 'emerald')}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;