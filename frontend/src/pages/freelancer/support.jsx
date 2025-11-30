import React, { useState, useContext } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  Search,
  FileText,
  Video,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { FreelancerContext } from './freelancerContext';

const SupportPage = () => {
  const { isDarkMode, user } = useContext(FreelancerContext);
  const [activeTab, setActiveTab] = useState('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Données FAQ simulées
  const faqCategories = [
    {
      id: 'payments',
      name: 'Paiements',
      icon: '💰',
      questions: [
        {
          question: "Quand vais-je recevoir mes paiements ?",
          answer: "Les paiements sont traités après la complétion du service et apparaissent dans votre portefeuille sous 8 heures ouvrables."
        },
        {
          question: "Quels sont les frais de plateforme ?",
          answer: "Nous appliquons une commission de 15% sur chaque service pour les nouveaux freelancers, réduite à 12% après 10 services complétés, réduite à 10% après 50 services complétés."
        },
        {
          question: "Comment retirer mes gains ?",
          answer: "Vous pouvez retirer vos gains via votre carte bancaire ou via les banques électroniques. Les retraits sont traités sous les brefs délais dans le meme jour."
        }
      ]
    },
    {
      id: 'technical',
      name: 'Problèmes techniques',
      icon: '🔧',
      questions: [
        {
          question: "L'application ne se met pas à jour correctement",
          answer: "Vérifiez votre connexion internet et réinstallez l'application. Si le problème persiste, contactez-nous."
        },
        {
          question: "Je ne reçois pas les notifications de nouvelles commandes",
          answer: "Vérifiez les paramètres de notification dans l'application et les paramètres système de votre téléphone ou de votre ordinateur."
        }
      ]
    },
    {
      id: 'services',
      name: 'Gestion des services',
      icon: '🛠️',
      questions: [
        {
          question: "Comment modifier mes prix ?",
          answer: "Allez dans 'Mes Services', sélectionnez le service et modifiez le prix dans les paramètres du service."
        },
        {
          question: "Puis-je annuler une commande acceptée ?",
          answer: "Oui, mais cela peut affecter votre notation. Contactez le client et notre support avant d'annuler."
        }
      ]
    }
  ];

  // Fonction de recherche dans la FAQ
  const filteredFAQs = faqCategories.flatMap(category => 
    category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // Simulation d'envoi de ticket
    console.log({ subject, category, message });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setSubject('');
    setMessage('');
    setCategory('technical');
  };

  const ContactMethods = () => (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className={`p-6 rounded-xl border-2 ${
        isDarkMode ? 'bg-gray-800 border-blue-500' : 'bg-white border-blue-500'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
            <Phone className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold dark:text-white">Appel téléphonique</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Du lundi au vendredi</p>
        <p className="text-lg font-bold dark:text-white">+33 1 23 45 67 89</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock size={14} />
          <span>9h-18h</span>
        </div>
      </div>

      <div className={`p-6 rounded-xl border-2 ${
        isDarkMode ? 'bg-gray-800 border-green-500' : 'bg-white border-green-500'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
            <Mail className="text-green-600 dark:text-green-400" size={20} />
          </div>
          <h3 className="font-semibold dark:text-white">Email</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Réponse sous 24h</p>
        <p className="text-lg font-bold dark:text-white">support@cleanix.com</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock size={14} />
          <span>7j/7</span>
        </div>
      </div>

      <div className={`p-6 rounded-xl border-2 ${
        isDarkMode ? 'bg-gray-800 border-purple-500' : 'bg-white border-purple-500'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
            <MessageCircle className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold dark:text-white">Chat en direct</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Support immédiat</p>
        <p className="text-lg font-bold dark:text-white">Disponible maintenant</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-green-600 dark:text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>En ligne</span>
        </div>
      </div>
    </div>
  );

  const FAQSection = () => (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher dans la FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
        />
      </div>

      {searchQuery ? (
        // Résultats de recherche
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            {filteredFAQs.length} résultat(s) pour "{searchQuery}"
          </h3>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg border border-gray-200 dark:border-gray-700`}>
                <h4 className="font-semibold mb-2 dark:text-white">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Catégories FAQ
        <div className="space-y-6">
          {faqCategories.map(category => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-xl font-bold dark:text-white">{category.name}</h3>
              </div>
              <div className="space-y-3">
                {category.questions.map((faq, index) => (
                  <div key={index} className={`p-4 rounded-lg cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:bg-gray-50'
                  } shadow border border-gray-200 dark:border-gray-700 transition-colors`}>
                    <h4 className="font-semibold mb-2 dark:text-white">{faq.question}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ContactForm = () => (
    <div className={`p-6 rounded-xl ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg border border-gray-200 dark:border-gray-700`}>
      {isSubmitted ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2 dark:text-white">Message envoyé !</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Nous avons reçu votre demande et vous répondrons dans les plus brefs délais.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitTicket} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={user?.name || ''}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Email *
              </label>
              <input
                type="email"
                required
                value={user?.email || ''}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Sujet *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Décrivez brièvement votre problème..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Catégorie *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="technical">Problème technique</option>
              <option value="payments">Problème de paiement</option>
              <option value="services">Gestion des services</option>
              <option value="account">Problème de compte</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Description détaillée *
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
              placeholder="Décrivez votre problème en détail..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Envoyer ma demande
          </button>
        </form>
      )}
    </div>
  );

  const ResourcesSection = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-blue-500" size={24} />
          <h3 className="font-semibold dark:text-white">Documentation</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Guides complets pour utiliser toutes les fonctionnalités de la plateforme.
        </p>
        <button className="text-blue-500 hover:text-blue-600 font-medium">
          Voir la documentation →
        </button>
      </div>

      <div className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center gap-3 mb-4">
          <Video className="text-purple-500" size={24} />
          <h3 className="font-semibold dark:text-white">Tutoriels vidéo</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Apprenez à utiliser Cleanix avec nos vidéos tutoriels.
        </p>
        <button className="text-purple-500 hover:text-purple-600 font-medium">
          Regarder les tutoriels →
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="text-green-500" size={32} />
          <h1 className="text-3xl font-bold dark:text-white">Centre d'aide</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Nous sommes là pour vous aider ! Trouvez des réponses à vos questions ou contactez notre équipe de support.
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'contact', name: 'Nous contacter', icon: MessageCircle },
            { id: 'faq', name: 'FAQ', icon: HelpCircle },
            { id: 'resources', name: 'Ressources', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="min-h-[400px]">
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <ContactMethods />
            <div>
              <h2 className="text-2xl font-bold mb-6 ">Envoyer un message</h2>
              <ContactForm />
            </div>
          </div>
        )}

        {activeTab === 'faq' && <FAQSection />}

        {activeTab === 'resources' && (
          <div className="space-y-8">
            <ResourcesSection />
            
            {/* Statut du système */}
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg border border-gray-200 dark:border-gray-700`}>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Statut du système</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Plateforme principale</span>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span>Opérationnel</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Système de paiement</span>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span>Opérationnel</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Notifications</span>
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle size={16} />
                    <span>Maintenance planifiée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bannière d'urgence */}
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
      } border`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="text-blue-500" size={20} />
          <div>
            <h4 className="font-semibold dark:text-white">Urgence ?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Pour les problèmes urgents affectant votre activité, appelez-nous directement au <strong>+212 7-51 81 86 24</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;