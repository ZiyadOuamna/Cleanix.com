{/* Carte Profil & Statut */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Profil Gauche */}
    <div className={`lg:col-span-2 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {freelancer.prenom.charAt(0)}{freelancer.nom.charAt(0)}
                </div>
                
                {/* Indicateur estConnecte */}
                <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${freelancer.estConnecte ? 'bg-green-500' : 'bg-gray-400'}`} title={freelancer.estConnecte ? 'En ligne' : 'Hors ligne'}></div>
            </div>
            
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        {/* Nom avec badge vérifié */}
                        <div className="flex items-center gap-2">
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {freelancer.prenom} {freelancer.nom}
                            </h2>
                            {freelancer.verifie && (
                                <VerifiedAccount size={20} className="text-blue-500 fill-current" title="Compte vérifié" />
                            )}
                        </div>
                        
                        {/* Liste des services offerts avec icônes */}
                        <div className="flex flex-wrap gap-2">
                            {freelancer.services.map((service, index) => (
                                <span 
                                    key={index}
                                    onClick={() => setSelectedService(service)}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors"
                                >
                                    <ServiceIcon serviceType={service.type} />
                                    {service.type}
                                    <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                                        {service.tarifBase} DHS
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Statut de disponibilité */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${freelancer.statut === 'Disponible' ? 'bg-green-100 text-green-700 border-green-200' : freelancer.statut === 'Occupé' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {freelancer.statut}
                    </span>
                </div>
                
                {/* Informations détaillées */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p className="flex items-center gap-2"><Hash size={16} /> {freelancer.id}</p>
                    <p className="flex items-center gap-2"><MapPin size={16} /> {freelancer.ville}</p>
                    <p className="flex items-center gap-2"><Calendar size={16} />Inscrit le : {freelancer.joined}</p>
                    <p className="flex items-center gap-2"><Mail size={16} /> {freelancer.email}</p>
                    <p className="flex items-center gap-2"><Smartphone size={16} /> {freelancer.phone}</p>
                    <p className="flex items-center gap-2"><Building size={16} /> {freelancer.detailsCompteBancaire}</p>
                </div>
            </div>
        </div>
    </div>

    {/* KPIs Rapides Droite (Portefeuille) */}
    <div className={`lg:w-80 flex flex-col gap-4 p-5 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'}`}>
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
            <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Portefeuille</span>
            <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                <Wallet size={24}/> {freelancer.solde.toFixed(2)} DH
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div>
                <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-lg">
                    {freelancer.noteMoyenne} <Star size={16} fill="currentColor"/>
                </div>
                <p className="text-[10px] uppercase font-bold opacity-60">Note</p>
            </div>
            <div>
                <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{freelancer.avis}</div>
                <p className="text-[10px] uppercase font-bold opacity-60">Avis</p>
            </div>
            <div>
                <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{freelancer.commentaires}</div>
                <p className="text-[10px] uppercase font-bold opacity-60">Coms</p>
            </div>
        </div>
    </div>
</div>

{/* Modal de détail du service */}
{selectedService && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
<div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold">Détails du Service</h3>
        <button 
            onClick={() => setSelectedService(null)}
            className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
        >
            <XCircle size={20} />
        </button>
    </div>
    <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
            <ServiceIcon serviceType={selectedService.type} />
            <div>
                <h4 className="font-bold text-lg">{selectedService.type}</h4>
                <p className="text-sm text-gray-500">{selectedService.description}</p>
            </div>
        </div>
        <div className="space-y-2">
            <p className="font-semibold">Tarif de base: <span className="text-green-600">{selectedService.tarifBase} DH</span></p>
            <div>
                <p className="font-semibold mb-2">Options disponibles:</p>
                <div className="flex flex-wrap gap-2">
                    {selectedService.options.map((option, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {option}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
</div>
</div>
)}

////////////////////////////////////////:
import React, { useState, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { useOutletContext } from 'react-router-dom';
import { 
    CreditCard,
    Briefcase, Star, ShieldCheck, DollarSign, Users, TrendingUp, 
    Search, ArrowLeft, MapPin, Smartphone, Mail, Calendar, CheckCircle, 
    AlertTriangle, FileText, Award, Clock, Wallet, Power, Building, Activity, UserCheck, XCircle, BarChart2,
    Hash, Home, Key, Scissors, Wrench, ArrowDownToLine
} from 'lucide-react';
import { 
    LabelList,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- 1. DONNÉES FICTIVES (MOCK DATA) ---

const GLOBAL_STATS = {
    totalFreelancers: 342,
    enLigne: 85, 
    enAttenteValidation: 12,
    revenuGlobal: 450000
};

// Types de services basés sur votre diagramme de classes
const TYPES_SERVICES = {
    NETTOYAGE_RESIDENTIEL: 'Nettoyage Résidentiel',
    NETTOYAGE_SUPERFICIE: 'Nettoyage de Surface',
    NETTOYAGE_UNITAIRE: 'Nettoyage Unitaire',
    GESTION_CLES: 'Gestion de Clés',
    JARDINAGE: 'Jardinage'
};

// Fonction pour générer les services basés sur la spécialité
const getServicesBySpecialite = (specialite) => {
    const servicesParSpecialite = {
        'Nettoyage': [
            {
                type: TYPES_SERVICES.NETTOYAGE_RESIDENTIEL,
                description: 'Nettoyage complet de résidences',
                tarifBase: 150,
                options: ['Nettoyage profond', 'Désinfection', 'Nettoyage vitres']
            },
            {
                type: TYPES_SERVICES.NETTOYAGE_SUPERFICIE,
                description: 'Nettoyage de surfaces spécifiques',
                tarifBase: 80,
                options: ['Sol', 'Murs', 'Plafonds']
            },
            {
                type: TYPES_SERVICES.NETTOYAGE_UNITAIRE,
                description: 'Nettoyage par unité',
                tarifBase: 50,
                options: ['Par pièce', 'Par surface']
            }
        ],
        'Gestion Clés': [
            {
                type: TYPES_SERVICES.GESTION_CLES,
                description: 'Gestion et remise de clés',
                tarifBase: 30,
                options: ['Garde de clés', 'Remise sécurisée', 'Dépannage serrurerie']
            }
        ],
        'Jardinage': [
            {
                type: TYPES_SERVICES.JARDINAGE,
                description: 'Entretien d\'espaces verts',
                tarifBase: 100,
                options: ['Tonte', 'Taille', 'Plantation']
            }
        ]
    };

    return servicesParSpecialite[specialite] || [{ type: specialite, description: 'Service personnalisé', tarifBase: 0, options: [] }];
};

//l'icone de vérifer compte 
const VerifiedAccount = ({ size = 20 }) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle cx="12" cy="12" r="10" fill="#1DA1F2" /> 
    <path 
      d="M16.2 9.2l-5.1 5.1-2.3-2.3" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const FREELANCERS_LIST = [
    { 
        id: 1, 
        prenom: 'Karim',
        nom: 'Fassi', 
        service: 'Nettoyage', 
        ville: 'Rabat', 
        noteMoyenne: 4.8, 
        statut: 'Disponible', 
        estConnecte: true, 
        solde: 12500, 
        detailsCompteBancaire: 'CIH *** 1234', 
        email: 'karim.f@test.com', 
        phone: '0661000001', 
        joined: '12/02/2023', 
        avis: 45, 
        commentaires: 12,
        verifie: true,
        services: getServicesBySpecialite('Nettoyage'),
        evaluations: [
            { id: 1, note: 5, commentaire: "Excellent service, très professionnel", evaluateur: "Client123", date: "2024-11-20" },
            { id: 2, note: 4, commentaire: "Bon travail mais un peu en retard", evaluateur: "Client456", date: "2024-11-15" }
        ]
    },
    { 
        id: 2, 
        prenom: 'Lina', 
        nom: 'Mouline', 
        service: 'Gestion Clés', 
        ville: 'Casablanca', 
        noteMoyenne: 5.0, 
        statut: 'Occupé', 
        estConnecte: false, 
        solde: 450, 
        detailsCompteBancaire: 'BP *** 9876', 
        email: 'lina.m@test.com', 
        phone: '0661000002', 
        joined: 'Hier', 
        avis: 5, 
        commentaires: 2,
        verifie: true,
        services: getServicesBySpecialite('Gestion Clés'),
        evaluations: [
            { id: 1, note: 5, commentaire: "Très fiable pour la garde des clés", evaluateur: "Proprietaire789", date: "2024-11-18" }
        ]
    },
    { 
        id: 3, 
        prenom: 'Omar', 
        nom: 'Diouri', 
        service: 'Jardinage', 
        ville: 'Marrakech', 
        noteMoyenne: 4.2, 
        statut: 'Suspendu', 
        estConnecte: true, 
        solde: 0, 
        detailsCompteBancaire: 'Attijari *** 5555', 
        email: 'omar.d@test.com', 
        phone: '0661000003', 
        joined: '05/06/2023', 
        avis: 20, 
        commentaires: 8,
        verifie: false,
        services: getServicesBySpecialite('Jardinage'),
        evaluations: [
            { id: 1, note: 4, commentaire: "Bon jardinier, ponctuel", evaluateur: "Jardin123", date: "2024-11-10" },
            { id: 2, note: 3, commentaire: "Qualité moyenne", evaluateur: "Jardin456", date: "2024-11-05" }
        ]
    },
    { 
        id: 4, 
        prenom: 'Sara', 
        nom: 'Bennani', 
        service: 'Nettoyage', 
        ville: 'Tanger', 
        noteMoyenne: 4.9, 
        statut: 'Disponible', 
        estConnecte: false, 
        solde: 15600, 
        detailsCompteBancaire: 'SG *** 1111', 
        email: 'sara.b@test.com', 
        phone: '0661000004', 
        joined: '01/01/2023', 
        avis: 120, 
        commentaires: 45,
        verifie: true,
        services: getServicesBySpecialite('Nettoyage'),
        evaluations: [
            { id: 1, note: 5, commentaire: "Parfaite, je recommande vivement", evaluateur: "Client789", date: "2024-11-22" },
            { id: 2, note: 5, commentaire: "Service impeccable", evaluateur: "Client101", date: "2024-11-20" },
            { id: 3, note: 4, commentaire: "Très bon rapport qualité-prix", evaluateur: "Client202", date: "2024-11-18" }
        ]
    },
];

// Commentaires
const comments = [
    { id: 1, author: "Karim (Freelancer)", date: "12 Nov 2024", text: "Client très ponctuel et respectueux. Je recommande.", rating: 5 },
    { id: 2, author: "Sara (Support)", date: "05 Oct 2024", text: "A signalé un problème technique, résolu rapidement.", rating: 4 },
    { id: 3, author: "Ahmed (Freelancer)", date: "20 Sep 2024", text: "Excellent travail, paiement rapide.", rating: 5 },
    { id: 4, author: "Laila (Client)", date: "15 Aug 2024", text: "Service impeccable, je reviendrai.", rating: 4 },
    { id: 5, author: "Youssef (Support)", date: "01 Jul 2024", text: "Client satisfait, aucune réclamation.", rating: 5 },
];

// Historique des missions
const JOBS_HISTORY_MOCK = [
    { id: 'CMD-101', service: 'Nettoyage Résidentiel', date: '20 Nov 2024', client: 'Ziyad O.', montant: '400 DH', statut: 'Terminée' },
    { id: 'CMD-102', service: 'Nettoyage de Surface', date: '18 Nov 2024', client: 'Sara K.', montant: '150 DH', statut: 'Terminée' },
    { id: 'CMD-103', service: 'Jardinage', date: '15 Nov 2024', client: 'Entreprise X', montant: '1200 DH', statut: 'En cours' },
    { id: 'CMD-104', service: 'Gestion de Clés', date: '10 Nov 2024', client: 'Mehdi L.', montant: '300 DH', statut: 'Annulée' },
    { id: 'CMD-105', service: 'Nettoyage Unitaire', date: '05 Nov 2024', client: 'Karim T.', montant: '250 DH', statut: 'Terminée' },
];

// --- 2. OUTILS & GRAPHIQUES ---

const generateMultiPeriodData = (baseValue) => {
    const createData = (count, labels, variance) => 
        Array.from({ length: count }, (_, i) => {
            const val = Math.max(0, Math.floor(baseValue + (Math.random() * variance) - (variance / 2)));
            return { name: labels(i), value: val };
        });

    const dailyLabels = (i) => `${8+i}h`;
    const monthlyLabels = (i) => `J${i+1}`;
    const yearlyLabels = (i) => ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aout','Sep','Oct','Nov','Dec'][i];

    const dailyData = createData(12, dailyLabels, baseValue * 0.5); 
    const monthlyData = createData(30, monthlyLabels, baseValue * 2);
    const yearlyData = createData(12, yearlyLabels, baseValue * 5);

    return {
        daily: { total: dailyData.reduce((a,b)=>a+b.value,0), chartData: dailyData },
        monthly: { total: monthlyData.reduce((a,b)=>a+b.value,0), chartData: monthlyData },
        yearly: { total: yearlyData.reduce((a,b)=>a+b.value,0), chartData: yearlyData }
    };
};

// Générateur de données EMPILÉES
const generateStackedData = (filter) => {
    const count = filter === 'Jour' ? 24 : filter === 'Mois' ? 30 : 12;
    const labels = filter === 'Jour' ? (i) => `${i}h` : filter === 'Mois' ? (i) => `J${i+1}` : (i) => ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aout','Sep','Oct','Nov','Dec'][i];
    
    return Array.from({ length: count }, (_, i) => ({
        name: labels(i),
        acceptees: Math.floor(Math.random() * 20) + 5,
        annulees: Math.floor(Math.random() * 5),
        terminees: Math.floor(Math.random() * 15) + 5,
        actifs: Math.floor(Math.random() * 100) + 20,
        inscriptions: Math.floor(Math.random() * 10)
    }));
};

const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
    if (active && payload && payload.length) {
        return (
            <div className={`px-3 py-2 rounded-lg shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                        {entry.name}: {Number(entry.value).toLocaleString()} {unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Carte Graphique Simple
const ChartCard = ({ title, data, type = 'area', unit, isDarkMode, dataKey1 = 'value', color1, name1, dataKey2, color2, name2 }) => {
    const [period, setPeriod] = useState('monthly');
    
    const currentView = (data && data[period]) ? data[period] : (data?.monthly || { total: 0, chartData: [] });

    return (
        <div className={`p-5 rounded-2xl shadow-lg border flex flex-col h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
                    <span className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentView.total.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
                    </span>
                </div>
                <div className={`flex p-0.5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {['daily', 'monthly', 'yearly'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                                period === p 
                                    ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') 
                                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600')
                            }`}
                            title={p === 'daily' ? 'Jour' : p === 'monthly' ? 'Mois' : 'Année'}
                        >
                            {p === 'daily' ? 'J' : p === 'monthly' ? 'M' : 'A'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'area' ? (
                        <AreaChart data={currentView.chartData}>
                            <defs>
                                <linearGradient id={`color${dataKey1}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color1} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={color1} stopOpacity={0}/>
                                </linearGradient>
                                {dataKey2 && (
                                    <linearGradient id={`color${dataKey2}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color2} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={color2} stopOpacity={0}/>
                                    </linearGradient>
                                )}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} />
                            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
                            <Legend />
                            <Area type="monotone" dataKey={dataKey1} name={name1} stroke={color1} fillOpacity={1} fill={`url(#color${dataKey1})`} />
                            {dataKey2 && <Area type="monotone" dataKey={dataKey2} name={name2} stroke={color2} fillOpacity={1} fill={`url(#color${dataKey2})`} />}
                        </AreaChart>
                    ) : (
                        <BarChart data={currentView.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} />
                            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} />
                            <Bar dataKey={dataKey1} name={name1} fill={color1} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Carte Graphique Multi-Données
const MultiDataChartCard = ({ title, type = 'bar', unit, isDarkMode, dataKey1, color1, name1, dataKey2, color2, name2, dataKey3, color3, name3 }) => {
    const [filter, setFilter] = useState('Mois');
    const chartData = generateStackedData(filter);

    return (
        <div className={`p-5 rounded-2xl shadow-lg border flex flex-col h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
                <div className={`flex p-0.5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {['Jour', 'Mois', 'Année'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${filter === f ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>{f.charAt(0)}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280'}} />
                        <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} />
                        <Legend />
                        <Bar dataKey={dataKey1} name={name1} fill={color1} radius={[4, 4, 0, 0]} />
                        {dataKey2 && <Bar dataKey={dataKey2} name={name2} fill={color2} radius={[4, 4, 0, 0]} />}
                        {dataKey3 && <Bar dataKey={dataKey3} name={name3} fill={color3} radius={[4, 4, 0, 0]} />}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const ServiceDistributionCard = ({
  title = "Services les plus proposés",
  isDarkMode,
  unit = "%",
  data,
  type = "pie",
  icon
}) => {
  return (
    <div
      className={`p-5 rounded-2xl shadow-lg border h-80 flex flex-col ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-xs font-bold uppercase mb-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {title}
      </h3>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ value }) => `${value}${unit}`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            </PieChart>
          )}

          {type === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(v) => `${v}${unit}`} />
              </Bar>
            </BarChart>
          )}

          {type === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2}>
                <LabelList dataKey="value" position="top" formatter={(v) => `${v}${unit}`} />
              </Line>
            </LineChart>
          )}
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {icon}
        </div>
      </div>

      <div className="flex justify-center gap-4 text-xs mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentMethodsChartCard = ({
  title = "Méthodes de paiement",
  isDarkMode,
  type = "pie",
  unit = "%",
  data,
  icon = <CreditCard size={32} />
}) => {
  return (
    <div
      className={`p-5 rounded-2xl shadow-lg border h-80 flex flex-col ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-xs font-bold uppercase mb-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {title}
      </h3>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ value }) => `${value}${unit}`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            </PieChart>
          )}

          {type === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(v) => `${v}${unit}`} />
              </Bar>
            </BarChart>
          )}

          {type === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Line type="monotone" strokeWidth={2} dataKey="value" stroke="#4f46e5">
                <LabelList dataKey="value" position="top" formatter={(v) => `${v}${unit}`} />
              </Line>
            </LineChart>
          )}
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {icon}
        </div>
      </div>

      <div className="flex justify-center gap-4 text-xs mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher les icônes de service
const ServiceIcon = ({ serviceType }) => {
    const icons = {
        [TYPES_SERVICES.NETTOYAGE_RESIDENTIEL]: <Home size={16} className="text-blue-600" />,
        [TYPES_SERVICES.NETTOYAGE_SUPERFICIE]: <Wrench size={16} className="text-green-600" />,
        [TYPES_SERVICES.NETTOYAGE_UNITAIRE]: <Scissors size={16} className="text-purple-600" />,
        [TYPES_SERVICES.GESTION_CLES]: <Key size={16} className="text-orange-600" />,
        [TYPES_SERVICES.JARDINAGE]: <Award size={16} className="text-green-600" />
    };
    
    return icons[serviceType] || <Briefcase size={16} className="text-gray-600" />;
};

// Fonction pour générer les PDFs
const generatePDF = (type, freelancer) => {
    // Simulation de génération de PDF
    const pdfContent = type === 'cin' 
        ? `Carte d'Identité - ${freelancer.prenom} ${freelancer.nom}`
        : `Informations Bancaires - ${freelancer.prenom} ${freelancer.nom}`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${freelancer.prenom}_${freelancer.nom}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Notification de succès
    alert(`PDF ${type === 'cin' ? 'Carte d\'Identité' : 'Informations Bancaires'} téléchargé avec succès!`);
};

// --- 3. VUE DÉTAIL FREELANCER ---
const FreelancerAnalytics = ({ freelancer, onBack, isDarkMode }) => {
    const [metrics, setMetrics] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        setMetrics({
            revenu: generateMultiPeriodData(freelancer.solde / 10),
            missions: generateMultiPeriodData(5)
        });
    }, [freelancer]);

    if (!metrics) return <div>Chargement...</div>;

    return (
        <div className="animate-fade-in-up space-y-6">
            
            {/* Header Detail */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors group">
                    <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100"><ArrowLeft size={20} /></div>
                    Retour liste
                </button>
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <XCircle size={24} className="text-gray-500" />
                </button>
            </div>

            {/* Carte Profil & Statut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profil Gauche */}
                <div className={`lg:col-span-2 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                {freelancer.prenom.charAt(0)}{freelancer.nom.charAt(0)}
                            </div>
                            
                            {/* Indicateur estConnecte */}
                            <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${freelancer.estConnecte ? 'bg-green-500' : 'bg-gray-400'}`} title={freelancer.estConnecte ? 'En ligne' : 'Hors ligne'}></div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    {/* Nom avec badge vérifié */}
                                    <div className="flex items-center gap-2">
                                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {freelancer.prenom} {freelancer.nom}
                                        </h2>
                                        {freelancer.verifie && (
                                            <VerifiedAccount size={20} className="text-blue-500 fill-current" title="Compte vérifié" />
                                        )}
                                    </div>
                                    
                                    {/* Badge de spécialité */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                                            <Briefcase size={14} />
                                            {freelancer.service}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Statut de disponibilité */}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    freelancer.statut === 'Disponible' ? 'bg-green-100 text-green-700 border-green-200' : 
                                    freelancer.statut === 'Occupé' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                    'bg-red-100 text-red-700 border-red-200'
                                }`}>
                                    {freelancer.statut}
                                </span>
                            </div>
                            
                            {/* Grille d'informations structurée */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Informations Personnelles</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Email:</span>
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{freelancer.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Téléphone:</span>
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{freelancer.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Adresse:</span>
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{freelancer.ville}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Informations Professionnelles</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Note moyenne:</span>
                                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                                {freelancer.noteMoyenne} <Star size={14} fill="currentColor"/>
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date d'inscription:</span>
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{freelancer.joined}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Dernier accès:</span>
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Aujourd'hui</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Liste des services offerts avec icônes */}
                            <div>
                                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Services Proposés</h4>
                                <div className="flex flex-wrap gap-2">
                                    {freelancer.services.map((service, index) => (
                                        <span 
                                            key={index}
                                            onClick={() => setSelectedService(service)}
                                            className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors"
                                        >
                                            <ServiceIcon serviceType={service.type} />
                                            {service.type}
                                            <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                                                {service.tarifBase} DHS
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPIs Rapides Droite (Portefeuille) */}
                <div className={`lg:w-80 flex flex-col gap-4 p-5 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'}`}>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                        <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Portefeuille</span>
                        <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                            <Wallet size={24}/> {freelancer.solde.toFixed(2)} DH
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div>
                            <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-lg">
                                {freelancer.noteMoyenne} <Star size={16} fill="currentColor"/>
                            </div>
                            <p className="text-[10px] uppercase font-bold opacity-60">Note</p>
                        </div>
                        <div>
                            <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{freelancer.avis}</div>
                            <p className="text-[10px] uppercase font-bold opacity-60">Avis</p>
                        </div>
                        <div>
                            <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{freelancer.commentaires}</div>
                            <p className="text-[10px] uppercase font-bold opacity-60">Coms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Documents */}
            <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => generatePDF('cin', freelancer)}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText size={20} className="text-blue-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">Carte d'Identité</div>
                                <div className="text-sm text-gray-500">PDF structuré</div>
                            </div>
                        </div>
                        <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                            <ArrowDownToLine size={16} />
                        </div>
                    </button>

                    <button 
                        onClick={() => generatePDF('bank', freelancer)}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard size={20} className="text-green-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">Informations Bancaires</div>
                                <div className="text-sm text-gray-500">PDF sécurisé</div>
                            </div>
                        </div>
                        <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                            <ArrowDownToLine size={16} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Modal de détail du service */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Détails du Service</h3>
                            <button 
                                onClick={() => setSelectedService(null)}
                                className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <ServiceIcon serviceType={selectedService.type} />
                                <div>
                                    <h4 className="font-bold text-lg">{selectedService.type}</h4>
                                    <p className="text-sm text-gray-500">{selectedService.description}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Tarif de base: <span className="text-green-600">{selectedService.tarifBase} DH</span></p>
                                <div>
                                    <p className="font-semibold mb-2">Options disponibles:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedService.options.map((option, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Graphiques Activité Individuelle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenus Générés" data={metrics.revenu} dataKey1="value" color1="#10b981" name1="Revenu" type="area" unit="DH" isDarkMode={isDarkMode} />
                <ChartCard title="Missions Complétées" data={metrics.missions} dataKey1="value" color1="#3b82f6" name1="Missions" type="bar" unit="" isDarkMode={isDarkMode} />
            </div>

            {/* Évaluations */}
            <div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="p-6 border-b border-gray-200/10 flex justify-between items-center">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Évaluations Récentes</h3>
                    <span className="text-sm text-gray-500">{freelancer.evaluations.length} évaluations</span>
                </div>
                <div className="p-6 space-y-4">
                    {freelancer.evaluations.map((evaluation, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                className={i < evaluation.note ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold">{evaluation.evaluateur}</span>
                                </div>
                                <span className="text-sm text-gray-500">{evaluation.date}</span>
                            </div>
                            <p className="text-sm">{evaluation.commentaire}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Historique Missions avec recherche fonctionnelle */}
<div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
    <div className="p-6 border-b border-gray-200/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historique des Missions</h3>
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Rechercher une mission..." 
                onChange={(e) => {
                    // Fonction de filtrage à implémenter si besoin
                    const searchTerm = e.target.value.toLowerCase();
                    // Filtrer JOBS_HISTORY_MOCK en fonction du searchTerm
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
            />
        </div>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4 text-right">Statut</th>
                </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {JOBS_HISTORY_MOCK.map((job, i) => (
                    <tr key={i} className={`group ${isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-blue-50/30'}`}>
                        <td className="p-4 font-mono text-xs opacity-60">{job.id}</td>
                        <td className={`p-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.service}</td>
                        <td className={`p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.client}</td>
                        <td className={`p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.date}</td>
                        <td className="p-4 font-bold text-green-600">{job.montant}</td>
                        <td className="p-4 text-right">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase 
                                ${job.statut === 'Terminée' ? 'bg-green-100 text-green-700' : 
                                  job.statut === 'Annulée' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {job.statut}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
        </div>
    );
};

// --- 4. LISTE FREELANCERS (Vue Liste) ---
const FreelancerList = ({ freelancers, onSelect, isDarkMode }) => {
    const [search, setSearch] = useState('');
    const filtered = freelancers.filter(f => {
    const s = search.toLowerCase();
    return (
        (f.nom || '').toLowerCase().includes(s) ||
        (f.prenom || '').toLowerCase().includes(s) ||
        (f.service || '').toLowerCase().includes(s) ||
        (f.ville || '').toLowerCase().includes(s) ||
        ((f.solde || '').toString()).toLowerCase().includes(s) ||
        (f.statut || '').toLowerCase().includes(s)
    );
});

    return (
        <div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 border-b flex justify-between items-center gap-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Base Freelancers</h3>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    />
                </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className={`sticky top-0 z-10 text-xs uppercase font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                        <tr>
                            <th className="p-4">Freelancer</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Note</th>
                            <th className="p-4">Solde</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {filtered.map(f => (
                            <tr key={f.id} className={`group transition ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${f.estConnecte ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div>
                                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{f.prenom} {f.nom}</div>
                                            <div className="text-xs opacity-60">{f.ville}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={`p-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{f.service}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                        {f.noteMoyenne} <Star size={12} fill="currentColor"/>
                                    </div>
                                </td>
                                <td className={`p-4 font-mono text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{f.solde.toLocaleString()} DH</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full 
                                        ${f.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 
                                          f.statut === 'Occupé' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                        {f.statut}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => onSelect(f)} className="text-indigo-600 hover:underline text-xs font-bold">Gérer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 5. DASHBOARD PRINCIPAL ---
export default function DashboardFreelancer() {
    const isDarkMode = useOutletContext(SuperviseurContext);   
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [globalMetrics, setGlobalMetrics] = useState(null);

    useEffect(() => {
        setGlobalMetrics({
            revenu: generateMultiPeriodData(125000),
            activite: generateMultiPeriodData(85),
            inscriptions: generateMultiPeriodData(10)
        });
    }, []);

    if (!globalMetrics) return <div>Chargement...</div>;

    return (
        <div className="animate-fade-in space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Freelancers</h1>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedFreelancer ? 'Dossier individuel' : 'Vue d\'ensemble de la flotte'}</p>
                </div>
            </div>

            {!selectedFreelancer && (
                <>
                    {/* KPIs Globaux */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Freelancers</p>
                            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{GLOBAL_STATS.totalFreelancers}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">En Ligne (Actifs)</p>
                            <h3 className="text-3xl font-bold text-green-500 flex items-center gap-2"><Power size={20}/> {GLOBAL_STATS.enLigne}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">En Attente de Validation</p>
                            <h3 className="text-3xl font-bold text-orange-500">{GLOBAL_STATS.enAttenteValidation}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">Revenus Totaux</p>
                            <h3 className={`text-2xl font-bold text-indigo-500`}>{GLOBAL_STATS.revenuGlobal.toLocaleString()} DH</h3>
                        </div>
                    </div>

                    {/* Graphiques Globaux */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <ChartCard title="Revenus de la Plateforme" data={globalMetrics.revenu} dataKey1="value" color1="#10b981" name1="Revenus" type="area" unit="DH" isDarkMode={isDarkMode} />
                         <ChartCard title="Activité en Ligne" data={globalMetrics.activite} dataKey1="value" color1="#3b82f6" name1="Connectés" type="bar" unit="" isDarkMode={isDarkMode} />
                    </div>
                    
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <ChartCard title="Progression Inscriptions" data={globalMetrics.inscriptions} dataKey1="value" color1="#f59e0b" name1="Nouveaux" type="line" unit="" isDarkMode={isDarkMode} />
                         
                         <MultiDataChartCard 
                            title="État des Commandes" 
                            type="bar" 
                            unit="Cmds" 
                            isDarkMode={isDarkMode}
                            dataKey1="acceptees" color1="#3b82f6" name1="Acceptées"
                            dataKey2="terminees" color2="#10b981" name2="Terminées"
                            dataKey3="annulees" color3="#ef4444" name3="Annulées"
                         />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <ServiceDistributionCard isDarkMode={isDarkMode} 
                            title="Répartition des services"
                            unit="%"
                            data={[
                                { name: 'Nettoyage', value: 60, color: '#0538c4ff' },
                                { name: 'Jardinage', value: 25, color: '#00860dff' },
                                { name: 'Gestion Clés', value: 15, color: '#f50b0bff' },
                            ]}
                            icon={<Briefcase size={32} />}
                        />
                        <PaymentMethodsChartCard
                            isDarkMode={isDarkMode}
                            title="Méthodes de paiement utilisées"
                            type="pie"
                            unit="%"
                            data={[
                                { name: "Visa", value: 45, color: "#0057ff" },
                                { name: "PayPal", value: 30, color: "#ffc107" },
                                { name: "MasterCard", value: 15, color: "#e63946" },
                                { name: "Cash", value: 10, color: "#2a9d8f" }
                            ]}
                        />
                    </div>
                    
                </>
            )}

            {/* Section Liste ou Détail */}
            <div className={`border-t pt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Briefcase size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} /> 
                    </div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedFreelancer ? "Dossier Prestataire" : "Gestion des Freelancers"}
                    </h2>
                </div>

                {selectedFreelancer ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <FreelancerAnalytics 
                                freelancer={selectedFreelancer} 
                                onBack={() => setSelectedFreelancer(null)} 
                                isDarkMode={isDarkMode} 
                            />
                        </div>
                    </div>
                ) : (
                    <FreelancerList 
                        freelancers={FREELANCERS_LIST} 
                        onSelect={setSelectedFreelancer} 
                        isDarkMode={isDarkMode} 
                    />
                )}
            </div>
        </div>
    );
}