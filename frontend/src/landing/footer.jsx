import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = ({ isDarkMode }) => {
  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#" },
    { name: "Instagram", icon: Instagram, url: "#" },
    { name: "Twitter", icon: Twitter, url: "#" },
    { name: "LinkedIn", icon: Linkedin, url: "#" }
  ];

  const quickLinks = [
    { name: "Services", url: "#services" },
    { name: "À propos", url: "#about" },
    { name: "Contact", url: "#contact" },
    { name: "CGU", url: "#terms" },
    { name: "Politique de confidentialité", url: "#privacy" }
  ];

  const legalLinks = [
    { name: "Conditions d'utilisation", url: "#terms" },
    { name: "Politique de confidentialité", url: "#privacy" },
    { name: "Cookies", url: "#cookies" }
  ];

  return (
    <footer className={`${isDarkMode 
      ? 'bg-gray-950 border-t border-gray-800' 
      : 'bg-gradient-to-br from-gray-900 to-gray-800'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
                Cleanix
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre partenaire de confiance pour des services de nettoyage professionnels et sécurisés.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-500" />
                <a href="tel:+2126123456" className="text-gray-400 hover:text-cyan-500 transition-colors text-sm">
                  +212 6 12 34 56 78
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-500" />
                <a href="mailto:contact@cleanix.ma" className="text-gray-400 hover:text-cyan-500 transition-colors text-sm">
                  contact@cleanix.ma
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-cyan-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  Casablanca, Maroc
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></span>
              Services
            </h4>
            <ul className="space-y-3">
              {[
                'Nettoyage Résidentiel',
                'Nettoyage Commercial',
                'Nettoyage Profond',
                'Gestion des Clés'
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} />
                    </span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600"></span>
              Entreprise
            </h4>
            <ul className="space-y-3">
              {[
                'À propos',
                'Blog',
                'Carrières',
                'Partenaires'
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} />
                    </span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {[
                'Centre d\'aide',
                'Contact',
                'FAQ',
                'Signaler un problème'
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} />
                    </span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Newsletter CTA */}
        <div className={`p-8 rounded-xl border mb-12 ${
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">Restez informé</h4>
              <p className="text-gray-400 text-sm">
                Recevez les dernières actualités et offres spéciales
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className={`px-4 py-3 rounded-lg flex-1 md:flex-auto border-2 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                } focus:border-cyan-500 outline-none transition-colors`}
              />
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2 whitespace-nowrap">
                S'abonner
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} my-12`}></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p>
              © {new Date().getFullYear()} <span className="font-bold text-white">Cleanix</span>. Tous droits réservés.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-sm font-medium">Suivez-nous</span>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    title={social.name}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600'
                        : 'bg-gray-700 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600'
                    } text-gray-400 hover:text-white`}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 text-gray-400 text-sm">
            {legalLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                className="hover:text-cyan-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Gradient Bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600"></div>

    </footer>
  );
};

export default Footer;
