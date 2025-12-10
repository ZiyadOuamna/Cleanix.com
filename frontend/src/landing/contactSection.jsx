import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = ({ isDarkMode, contactRef }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Formulaire envoyé:', formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const contactInfo = [
    { 
      icon: Phone, 
      title: 'Téléphone', 
      value: '+212 7 51 81 86 24',
      color: 'cyan'
    },
    { 
      icon: Mail, 
      title: 'Email', 
      value: 'cleanix.ma.contact@gmail.com',
      color: 'emerald'
    },
    { 
      icon: MapPin, 
      title: 'Adresse', 
      value: 'Agadir, Maroc',
      color: 'violet'
    }
  ];

  return (
    <section 
      ref={contactRef} 
      className={`min-h-screen w-full flex items-center justify-center py-16 ${isDarkMode 
        ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]'
        : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Contactez-Nous
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Une question ? Une suggestion ? Nous sommes là pour vous aider et répondre à vos préoccupations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          
          {/* Contact Info - Gauche */}
          <div className="space-y-2 sm:space-y-3">
            <div>
              <h3 className={`text-sm sm:text-lg lg:text-2xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Parlons de votre projet
              </h3>
              <p className={`text-xs sm:text-xs lg:text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Que vous ayez besoin d'un service de nettoyage régulier, d'une intervention ponctuelle ou que vous souhaitiez rejoindre notre équipe, nous sommes à votre écoute 24/7.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-2 sm:space-y-3">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                const colorMap = {
                  cyan: 'from-cyan-500 to-blue-600',
                  emerald: 'from-emerald-500 to-cyan-600',
                  violet: 'from-violet-500 to-purple-600'
                };
                
                return (
                  <div 
                    key={idx}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:border-cyan-500'
                        : 'bg-gray-50 border-gray-200 hover:border-cyan-500 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${colorMap[info.color]}`}>
                        <Icon size={16} className="sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs sm:text-xs mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {info.title}
                        </h4>
                        <p className={`text-xs sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className={`p-3 sm:p-4 rounded-lg border-l-4 ${
              isDarkMode
                ? 'bg-blue-900/20 border-blue-500'
                : 'bg-blue-50 border-blue-500'
            }`}>
              <p className={`text-xs sm:text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                ℹ️ Temps de réponse : <strong>2h</strong>
              </p>
            </div>
          </div>

          {/* Form - Droite */}
          <div className={`p-4 sm:p-6 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200 shadow-lg hover:bg-gray-100'
          }`}>
            <h3 className={`text-sm sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Envoyez-nous un message
            </h3>
            <p className={`mb-4 sm:mb-6 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Remplissez le formulaire et nous vous recontacterons rapidement
            </p>

            {submitSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-800 font-medium text-xs sm:text-sm">✓ Message envoyé avec succès!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors text-sm ${
                      errors.name 
                        ? 'border-red-500' 
                        : isDarkMode 
                          ? 'border-gray-700 bg-gray-700/50 text-white focus:border-cyan-500' 
                          : 'border-gray-300 bg-gray-50 focus:border-cyan-500'
                    } focus:outline-none`}
                    placeholder="Votre nom"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors text-sm ${
                      errors.email 
                        ? 'border-red-500' 
                        : isDarkMode 
                          ? 'border-gray-700 bg-gray-700/50 text-white focus:border-cyan-500' 
                          : 'border-gray-300 bg-gray-50 focus:border-cyan-500'
                    } focus:outline-none`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sujet *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors text-sm ${
                    errors.subject 
                      ? 'border-red-500' 
                      : isDarkMode 
                        ? 'border-gray-700 bg-gray-700/50 text-white focus:border-cyan-500' 
                        : 'border-gray-300 bg-gray-50 focus:border-cyan-500'
                  } focus:outline-none`}
                  placeholder="Sujet"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors resize-none text-sm ${
                    errors.message 
                      ? 'border-red-500' 
                      : isDarkMode 
                        ? 'border-gray-700 bg-gray-700/50 text-white focus:border-cyan-500' 
                        : 'border-gray-300 bg-gray-50 focus:border-cyan-500'
                  } focus:outline-none`}
                  placeholder="Décrivez votre demande..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg text-white'
                }`}
              >
                <Send size={16} />
                {isSubmitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);