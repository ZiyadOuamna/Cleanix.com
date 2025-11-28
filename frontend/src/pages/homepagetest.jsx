// Page d'accueil Cleanix - Version Complète et Corrigée
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CleanixLandingPage() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "👋 Bonjour ! Je suis l'assistant Cleanix. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' }
    ]);
    const [chatInput, setChatInput] = useState('');
    
    // Refs pour le scroll vers les sections
    const servicesRef = useRef(null);
    const processRef = useRef(null);
    const paymentRef = useRef(null);
    const contactRef = useRef(null);

    // Slides pour la section hero
    const slides = [
        {
            image: "🧹",
            title: "Nettoyage Professionnel",
            description: "Des experts qualifiés pour un résultat impeccable"
        },
        {
            image: "🏠",
            title: "Maisons & Appartements",
            description: "Votre espace de vie mérite le meilleur"
        },
        {
            image: "🏢",
            title: "Espaces Commerciaux",
            description: "Un environnement professionnel toujours propre"
        },
        {
            image: "🔑",
            title: "Gestion des Clés",
            description: "Confiez-nous la gestion sécurisée de vos accès"
        }
    ];

    // Effet pour le scroll et le slider automatique
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        // Slider automatique
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(slideInterval);
        };
    }, [slides.length]);

    // Fonction pour le scroll vers les sections
    const scrollToSection = (sectionRef) => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Services pour le dropdown
    const services = [
        { name: 'Nettoyage résidentiel', icon: '🏠', description: 'Maisons et appartements' },
        { name: 'Nettoyage des Surfaces', icon: '🏢', description: 'Bureaux et espaces commerciaux' },
        { name: 'Nettoyage Unitaire', icon: '🔍', description: 'Tapis et surfaces spécifiques' },
        { name: 'Gestion des clés', icon: '🔑', description: 'Gestion sécurisée des accès' },
    ];

    // Méthodes de paiement
    const paymentMethods = [
        { name: 'Carte Bancaire', icon: '💳', description: 'Paiement sécurisé en ligne' },
        { name: 'PayPal', icon: '📱', description: 'Paiement via PayPal' },
        { name: 'Virement Bancaire', icon: '🏦', description: 'Transfert bancaire sécurisé' },
        { name: 'Espèces', icon: '💰', description: 'Paiement en main propre' },
        { name: 'Chèque', icon: '📄', description: 'Chèque bancaire' }
    ];

    // Processus pour clients
    const clientSteps = [
        { title: "1 ) Choisir le service", description: "Sélectionnez le type de nettoyage dont vous avez besoin", icon: "📋" },
        { title: "2 ) Planifier", description: "Choisissez la date et l'heure qui vous conviennent", icon: "📅" },
        { title: "3 ) Confirmer", description: "Validez votre réservation en ligne", icon: "✅" },
        { title: "4 ) Profiter", description: "Nous nous occupons de tout, vous profitez", icon: "✨" }
    ];

    // Processus pour freelancers
    const freelancerSteps = [
        { title: "1 ) Créer un profil", description: "Inscrivez-vous et complétez votre profil professionnel", icon: "👤" },
        { title: "2 ) Recevoir des missions", description: "Obtenez des missions adaptées à vos compétences", icon: "📨" },
        { title: "3 ) Exécuter le service", description: "Réalisez le nettoyage selon les standards qualité", icon: "🧽" },
        { title: "4 ) Être payé", description: "Recevez votre paiement rapidement et sécurisé", icon: "💸" }
    ];

    // Témoignages
    const testimonials = [
        {
            name: "Marie Dubois",
            role: "Client particulier",
            text: "Service exceptionnel ! Mon appartement n'a jamais été aussi propre.",
            rating: 5
        },
        {
            name: "Pierre Martin",
            role: "Propriétaire d'immeuble",
            text: "La gestion des clés a révolutionné ma façon de gérer mes locations.",
            rating: 5
        },
        {
            name: "Sophie Lambert",
            role: "Directrice de bureau",
            text: "Équipe professionnelle et efficace. Je recommande vivement !",
            rating: 4
        }
    ];

    // Fonction pour gérer l'envoi du formulaire de contact
    const handleContactSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulation d'envoi
        setTimeout(() => {
            alert('✅ Message envoyé avec succès ! Nous vous répondrons dans les 24h.');
            e.target.reset();
        }, 1000);
    };

    // Fonction pour gérer le chat
    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        // Ajouter le message de l'utilisateur
        const userMessage = {
            id: chatMessages.length + 1,
            text: chatInput,
            sender: 'user'
        };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');

        // Réponse automatique de l'IA
        setTimeout(() => {
            const responses = [
                "Je comprends votre question. Notre équipe de support peut vous aider avec cela. Souhaitez-vous que je vous connecte avec un conseiller ?",
                "Pour cette question, je vous recommande de consulter notre section FAQ ou de contacter notre support client.",
                "Merci pour votre message ! Un de nos experts vous répondra rapidement.",
                "Je peux vous aider avec les informations sur nos services de nettoyage, la gestion des clés, ou devenir freelancer. Que souhaitez-vous savoir ?"
            ];
            const botMessage = {
                id: chatMessages.length + 2,
                text: responses[Math.floor(Math.random() * responses.length)],
                sender: 'bot'
            };
            setChatMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    // Header avec mode sombre/clair et navigation par ancres
    const Header = () => (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
                ? isDarkMode 
                    ? 'bg-gray-900/95 backdrop-blur-md shadow-lg py-2' 
                    : 'bg-white/95 backdrop-blur-md shadow-lg py-2'
                : 'bg-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo déplacé à gauche */}
                <div className="flex items-center space-x-2">
                    <div className={`text-3xl font-bold transition-transform hover:scale-105 ${
                        isDarkMode ? 'text-white' : 'text-blue-600'
                    }`}>
                        Cleanix.ma
                    </div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>

                {/* Navigation centrale avec ancres */}
                <nav className="hidden lg:flex gap-8 items-center font-medium">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`transition-all duration-300 transform hover:scale-105 relative group ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        Accueil
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                            isDarkMode ? 'bg-white' : 'bg-blue-600'
                        }`}></span>
                    </button>
                    
                    {/* Menu Déroulant Services */}
                    <div className="relative group">
                        <button className={`transition-all duration-300 flex items-center group ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                        }`}>
                            Services
                            <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div className={`absolute hidden group-hover:block top-full mt-2 left-1/2 transform -translate-x-1/2 w-80 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden border z-50 animate-fadeIn ${
                            isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
                        }`}>
                            <div className="py-3">
                                {services.map((service, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => scrollToSection(servicesRef)}
                                        className={`flex items-center w-full text-left px-4 py-3 transition-all duration-300 group/item ${
                                            isDarkMode 
                                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                                : 'text-gray-800 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform">{service.icon}</span>
                                        <div>
                                            <div className="font-semibold">{service.name}</div>
                                            <div className={`text-sm ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>{service.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => scrollToSection(processRef)}
                        className={`transition-all duration-300 transform hover:scale-105 relative group ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        Comment ça marche
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                            isDarkMode ? 'bg-white' : 'bg-blue-600'
                        }`}></span>
                    </button>

                    <button 
                        onClick={() => scrollToSection(paymentRef)}
                        className={`transition-all duration-300 transform hover:scale-105 relative group ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        Paiements
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                            isDarkMode ? 'bg-white' : 'bg-blue-600'
                        }`}></span>
                    </button>

                    <button 
                        onClick={() => scrollToSection(contactRef)}
                        className={`transition-all duration-300 transform hover:scale-105 relative group ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        Contact
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                            isDarkMode ? 'bg-white' : 'bg-blue-600'
                        }`}></span>
                    </button>
                </nav>

                {/* Boutons Droite */}
                <div className="flex gap-3 items-center">
                    {/* Bouton Mode Sombre/Clair */}
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                            isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    <button 
                        onClick={() => navigate('/login')}
                        className={`font-medium px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 border ${
                            isDarkMode 
                                ? 'text-gray-300 hover:bg-gray-700 border-gray-600' 
                                : 'text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                    >
                        Connexion
                    </button>
                    <button 
                        onClick={() => navigate('/register')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-7 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-blue-800"
                    >
                        S'inscrire
                    </button>
                </div>
            </div>
        </header>
    );

    // Hero Section - 50% gauche texte, 50% droite slider amélioré
    const HeroSection = () => (
        <section className={`pt-32 min-h-screen flex items-center relative overflow-hidden ${
            isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'
        }`}>
            {/* Background Elements pour le mode clair */}
            {!isDarkMode && (
                <>
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </>
            )}

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Texte Gauche - 50% */}
                <div className="w-full md:w-1/2 space-y-8 p-8 text-left">
                    <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Votre <span className="text-blue-600">Espace</span>,<br/>
                        Impeccable en un Clic.
                    </h1>
                    <p className={`text-xl max-w-2xl leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        La plateforme Cleanix vous connecte instantanément à des professionnels vérifiés 
                        pour tous vos besoins : du nettoyage résidentiel à la gestion de vos clés.
                    </p>
                    
                    {/* Boutons CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button 
                            onClick={() => scrollToSection(servicesRef)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Commander un nettoyage
                        </button>
                         <button 
                            onClick={() => navigate('/register-freelancer')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Devenir un Freelancer
                        </button>
                    </div>
                </div>

                {/* Slider Droite - 50% avec images agrandies */}
                <div className="w-full md:w-1/2 relative h-[500px] mt-10 md:mt-0">
                    <div className={`absolute inset-0 rounded-3xl transform rotate-2 ${
                        isDarkMode ? 'bg-blue-600/20' : 'bg-blue-500/20'
                    }`}></div>
                    <div className={`absolute inset-0 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center transform -rotate-1 ${
                        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                        {/* Slide Actuelle avec image agrandie */}
                        <div className="text-8xl mb-6 transform transition-all duration-500 hover:scale-110">
                            {slides[currentSlide].image}
                        </div>
                        <h3 className={`text-3xl font-bold mb-3 text-center ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            {slides[currentSlide].title}
                        </h3>
                        <p className={`text-lg text-center max-w-md ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {slides[currentSlide].description}
                        </p>
                        
                        {/* Indicateurs de slide */}
                        <div className="flex space-x-3 mt-8">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                                        index === currentSlide
                                            ? 'bg-blue-600 scale-110'
                                            : isDarkMode
                                            ? 'bg-gray-600 hover:bg-gray-500'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // Section Services
    const ServicesSection = () => (
        <section 
            ref={servicesRef}
            className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Nos <span className="text-blue-600">Services</span>
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Découvrez notre gamme complète de services professionnels adaptés à tous vos besoins
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div 
                            key={index} 
                            className={`rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border group ${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-100 hover:bg-blue-50'
                            }`}
                        >
                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {service.name}
                            </h3>
                            <p className={`mb-4 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                {service.description}
                            </p>
                            <button className="text-blue-600 font-semibold flex items-center group-hover:text-blue-700 transition-colors">
                                Découvrir
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Section Comment ça marche (pour clients et freelancers)
    const ProcessSection = () => (
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

    // Section Méthodes de Paiement
    const PaymentSection = () => (
        <section 
            ref={paymentRef}
            className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Méthodes de <span className="text-blue-600">Paiement</span>
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Nous acceptons plusieurs moyens de paiement sécurisés pour votre commodité
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {paymentMethods.map((method, index) => (
                        <div 
                            key={index} 
                            className={`text-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600' 
                                    : 'bg-gray-50 hover:bg-blue-50'
                            }`}
                        >
                            <div className="text-4xl mb-3">{method.icon}</div>
                            <div className={`font-semibold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                {method.name}
                            </div>
                            <div className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {method.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Section Témoignages
    const TestimonialsSection = () => (
        <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Ils nous <span className="text-blue-600">font confiance</span>
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Découvrez les retours de nos clients satisfaits
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={index} 
                            className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg 
                                        key={i} 
                                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                ))}
                            </div>
                            <p className={`italic mb-6 text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                                }`}>
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className={`font-semibold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {testimonial.name}
                                    </div>
                                    <div className={`text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Section Contact avec formulaire corrigé
    const ContactSection = () => (
        <section 
            ref={contactRef}
            className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Contactez-<span className="text-blue-600">nous</span>
                    </h2>
                    <p className={`text-xl ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Une question ? Notre équipe vous répond sous 24h
                    </p>
                </div>

                <form 
                    onSubmit={handleContactSubmit}
                    className={`rounded-2xl p-8 shadow-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block mb-2 font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Nom complet
                            </label>
                            <input
                                type="text"
                                name="name"
                                className={`w-full px-4 py-3 rounded-lg border transition ${
                                    isDarkMode 
                                        ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500' 
                                        : 'bg-white border-gray-300 focus:border-blue-500'
                                }`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block mb-2 font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={`w-full px-4 py-3 rounded-lg border transition ${
                                    isDarkMode 
                                        ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500' 
                                        : 'bg-white border-gray-300 focus:border-blue-500'
                                }`}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className={`block mb-2 font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Message
                        </label>
                        <textarea
                            name="message"
                            rows="5"
                            className={`w-full px-4 py-3 rounded-lg border transition ${
                                isDarkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500' 
                                    : 'bg-white border-gray-300 focus:border-blue-500'
                            }`}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition w-full transform hover:scale-105"
                    >
                        Envoyer le message
                    </button>
                </form>
            </div>
        </section>
    );

    // Chat Bot Component
    const ChatBot = () => (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Fenêtre de chat */}
            {isChatOpen && (
                <div className={`absolute bottom-16 right-0 w-80 h-96 rounded-2xl shadow-2xl mb-4 flex flex-col ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    {/* Header du chat */}
                    <div className={`p-4 rounded-t-2xl flex justify-between items-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-blue-600'
                    }`}>
                        <span className={isDarkMode ? 'text-white font-semibold' : 'text-white font-semibold'}>
                            💬 Assistant Cleanix
                        </span>
                        <button 
                            onClick={() => setIsChatOpen(false)}
                            className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-white hover:text-gray-200'}
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Messages du chat */}
                    <div className={`flex-1 p-4 overflow-y-auto ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                        <div className="space-y-4">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white ml-auto'
                                            : isDarkMode
                                            ? 'bg-gray-700 text-gray-300'
                                            : 'bg-white text-gray-700 border'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Input du chat */}
                    <div className="p-4 border-t border-gray-600">
                        <form onSubmit={handleChatSubmit} className="flex gap-2">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Tapez votre message..."
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
                                }`}
                            />
                            <button 
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Bouton principal du chat */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
                    isChatOpen
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {isChatOpen ? '✕' : '💬'}
            </button>
        </div>
    );

    // Footer amélioré avec réseaux sociaux
    const Footer = () => (
        <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-800 text-gray-400'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Colonne 1 - Logo et description */}
                    <div className="col-span-1">
                        <div className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            Cleanix.ma
                        </div>
                        <p className="mb-4 text-sm">
                            Votre partenaire de confiance pour tous vos besoins de nettoyage et gestion immobilière.
                        </p>
                        <div className="flex space-x-4">
                            {/* Réseaux sociaux */}
                            {[
                                { name: 'Facebook', icon: '📘', url: '#' },
                                { name: 'Instagram', icon: '📷', url: '#' },
                                { name: 'Twitter', icon: '🐦', url: '#' },
                                { name: 'LinkedIn', icon: '💼', url: '#' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition transform hover:scale-110 ${
                                        isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600' 
                                            : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 2 - Liens rapides */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            Liens Rapides
                        </h3>
                        <ul className="space-y-2">
                            {['Accueil', 'Services', 'Comment ça marche', 'Contact'].map((link) => (
                                <li key={link}>
                                    <button 
                                        onClick={() => {
                                            if (link === 'Accueil') window.scrollTo({ top: 0, behavior: 'smooth' });
                                            else if (link === 'Services') scrollToSection(servicesRef);
                                            else if (link === 'Comment ça marche') scrollToSection(processRef);
                                            else if (link === 'Contact') scrollToSection(contactRef);
                                        }}
                                        className="hover:text-white transition-colors text-sm"
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 - Services */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            Nos Services
                        </h3>
                        <ul className="space-y-2">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <button 
                                        onClick={() => scrollToSection(servicesRef)}
                                        className="hover:text-white transition-colors text-sm"
                                    >
                                        {service.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4 - Contact */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            Contact
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p>📧 contact@cleanix.ma</p>
                            <p>📞 +212 5 XX XX XX XX</p>
                            <p>🏢 Casablanca, Maroc</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
                    <p>© 2024 Cleanix.ma. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 overflow-hidden ${
            isDarkMode ? 'dark bg-gray-900' : 'bg-white'
        }`}>
            <Header />
            <HeroSection />
            <ServicesSection />
            <ProcessSection />
            <PaymentSection />
            <TestimonialsSection />
            <ContactSection />
            <Footer />
            <ChatBot />
            
            {/* Styles d'animation personnalisés */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}