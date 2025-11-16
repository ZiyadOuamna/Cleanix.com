//je vais creer une page d'accueil pour  l'application web Cleanix.com
import React from 'react';
// Importe useNavigate pour gérer les redirections dans la SPA
import { useNavigate } from 'react-router-dom';

export default function CleanixLandingPage() {
    // Initialiser useNavigate pour la navigation
    const navigate = useNavigate();

    // création de liste des services pour le menu déroulant
    const services = [
        'Nettoyage résidentiel', // Nettoyage des maisons et appartements
        'Nettoyage des Surfaces',// Nettoyage des bureaux , jardin etc
        'Nettoyage Unitaire',// les tapies ,les panneux solaires par exemple...
        'Gestion des clés',// les gens qui ont des appartements a louer mais il ont hors ville donc on gere les cles pour eux
    ];
    // --- Header ---
    const  Header = () => (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
                
                {/* Logo (Gauche) */}
                <div className="text-3xl font-bold text-blue-600">
                    Cleanix.ma
                </div>

                {/* Liens de Navigation (Centre) */}
                <nav className="flex gap-8 items-center text-gray-700 font-medium">
                    <a href="/" className="hover:text-blue-600 transition">Accueil</a>
                    <a href="/about" className="hover:text-blue-600 transition">À propos</a>
                    <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
                    
                    {/* Menu Déroulant 'Services' */}
                    <div className="relative group">
                        <a href="#" className="hover:text-blue-600 transition cursor-pointer flex items-center">
                            Services
                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </a>
                        
                        {/* Contenu du Dropdown */}
                        <div className="absolute hidden group-hover:block top-full mt-4 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 z-50">
                            <div className="py-2">
                                {services.map((service, index) => (
                                    <a key={index} href={`/services/${service.toLowerCase().replace(/\s/g, '-')}`} 
                                       className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150">
                                        {service}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

             {/* Boutons (Droite) - CORRIGÉ AVEC ONCLICK */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/login')} // LIAISON AVEC /login
                        className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        Connexion
                    </button>
                    <button 
                        onClick={() => navigate('/register')} // LIAISON AVEC /register
                        className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        S'inscrire
                    </button>
                </div>
            </div>
        </header>
    );
    // --- Corps de la Page (Hero Section) ---
    const Body = () => (
        <section className="pt-24 min-h-screen flex items-center bg-gray-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* Slogan et Texte (Gauche - ~60%) */}
                <div className="w-full md:w-3/5 space-y-6 text-center md:text-left p-8">
                    <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
                        Votre <span className="text-blue-600">Espace</span>, Impeccable en un Clic.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                        La plateforme Cleanix vous connecte instantanément à des professionnels vérifiés pour tous vos besoins : du nettoyage résidentiel à la gestion de vos clés.
                    </p>
                    <div className="pt-4">
                         <button className="bg-orange-500 text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:bg-orange-600 transition transform hover:scale-105">
                            Commander un nettoyage
                        </button>
                    </div>
                </div>

                {/* Image Stylisée (Droite - ~40%) */}
                <div className="w-full md:w-2/5 relative h-96 mt-10 md:mt-0">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl transform -rotate-3 translate-x-4 shadow-2xl"></div>
                    <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl p-4 shadow-2xl flex items-center justify-center">
                         <div className="text-center text-gray-500 italic">
                             
                         </div>
                    </div>
                </div>
                
            </div>
        </section>
    );

    return (
        <div className="min-h-screen">
            <Header />
            <Body />
            {/* Ici viendront les autres sections : Services, Témoignages, Footer... */}
        </div>
    );
};