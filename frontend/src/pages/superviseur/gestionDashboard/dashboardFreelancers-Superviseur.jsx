import React, { useState, useEffect, useContext } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { useOutletContext } from 'react-router-dom';
import { 
    Briefcase, Star, ShieldCheck, DollarSign, Users, TrendingUp, 
    Search, ArrowLeft, MapPin, Smartphone, Mail, Calendar, CheckCircle, 
    AlertTriangle, FileText, Award, Clock
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- 1. DONNÉES FICTIVES (MOCK DATA) ---

const GLOBAL_STATS = {
    totalFreelancers: 342,
    enAttente: 15,
    revenuMoyen: 4500,
    noteMoyenne: 4.6
};

const FREELANCERS_LIST = [
    { id: 1, nom: 'Karim', prenom: 'Fassi', service: 'Nettoyage', ville: 'Rabat', note: 4.8, statut: 'Vérifié', revenu: 12500, jobs: 45, email: 'karim.f@test.com', phone: '0661000001', joined: '12/02/2023' },
    { id: 2, nom: 'Lina', prenom: 'Mouline', service: 'Gestion Clés', ville: 'Casablanca', note: 5.0, statut: 'En attente', revenu: 0, jobs: 0, email: 'lina.m@test.com', phone: '0661000002', joined: 'Hier' },
    { id: 3, nom: 'Omar', prenom: 'Diouri', service: 'Jardinage', ville: 'Marrakech', note: 4.2, statut: 'Vérifié', revenu: 8400, jobs: 28, email: 'omar.d@test.com', phone: '0661000003', joined: '05/06/2023' },
    { id: 4, nom: 'Sara', prenom: 'Bennani', service: 'Nettoyage', ville: 'Tanger', note: 4.9, statut: 'Vérifié', revenu: 15600, jobs: 62, email: 'sara.b@test.com', phone: '0661000004', joined: '01/01/2023' },
];

const REVIEWS_MOCK = [
    { id: 1, client: 'Client Ziyad', date: 'Hier', text: 'Travail impeccable, très professionnel.', rating: 5 },
    { id: 2, client: 'Client Ahmed', date: '10 Nov', text: 'Un peu de retard mais bon travail.', rating: 4 },
];

const JOBS_HISTORY_MOCK = [
    { id: 'JOB-101', service: 'Grand Ménage', date: '20 Nov 2024', client: 'Ziyad O.', montant: '400 DH', statut: 'Terminé' },
    { id: 'JOB-102', service: 'Nettoyage Vitres', date: '18 Nov 2024', client: 'Sara K.', montant: '150 DH', statut: 'Terminé' },
    { id: 'JOB-103', service: 'Jardinage', date: '15 Nov 2024', client: 'Entreprise X', montant: '1200 DH', statut: 'En cours' },
];

// --- 2. OUTILS & GRAPHIQUES ---

const generateChartData = (filter) => {
    const count = filter === 'Jour' ? 24 : filter === 'Mois' ? 30 : 12;
    return Array.from({ length: count }, (_, i) => ({
        name: filter === 'Jour' ? `${i}h` : filter === 'Mois' ? `J${i+1}` : ['J','F','M','A','M','J','J','A','S','O','N','D'][i],
        revenu: Math.floor(Math.random() * 2000),
        jobs: Math.floor(Math.random() * 10),
        rating: (4 + Math.random()).toFixed(1)
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

const ChartCard = ({ title, data, dataKey, color, type = 'area', unit, isDarkMode }) => (
    <div className={`p-5 rounded-2xl shadow-lg border flex flex-col h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
        <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
                {type === 'area' ? (
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
                        <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#color${dataKey})`} />
                    </AreaChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} />
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    </div>
);

const ServiceDistributionCard = ({ isDarkMode }) => {
    const data = [
        { name: 'Nettoyage', value: 60, color: '#3b82f6' },
        { name: 'Jardinage', value: 25, color: '#10b981' },
        { name: 'Gestion Clés', value: 15, color: '#f59e0b' },
    ];
    return (
        <div className={`p-5 rounded-2xl shadow-lg border h-80 flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Services</h3>
            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip unit="%" isDarkMode={isDarkMode} />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Briefcase size={32} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
                </div>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. VUE DÉTAIL FREELANCER ---
const FreelancerAnalytics = ({ freelancer, onBack, isDarkMode }) => {
    const [filter, setFilter] = useState('Mois');
    const chartData = generateChartData(filter);
    
    const metrics = {
        revenu: chartData.reduce((a, b) => a + b.revenu, 0),
        jobs: chartData.reduce((a, b) => a + b.jobs, 0),
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            
            {/* Header Detail */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors group">
                    <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100"><ArrowLeft size={20} /></div>
                    Retour liste
                </button>
                <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {['Jour', 'Mois', 'Année'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${filter === f ? 'bg-indigo-600 text-white shadow' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Carte Profil & Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profil Gauche */}
                <div className={`lg:col-span-2 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                {freelancer.prenom.charAt(0)}{freelancer.nom.charAt(0)}
                            </div>
                            {freelancer.statut === 'Vérifié' && (
                                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm">
                                    <CheckCircle className="text-blue-500 fill-blue-100" size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{freelancer.prenom} {freelancer.nom}</h2>
                                    <p className="text-indigo-500 font-medium">{freelancer.service}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${freelancer.statut === 'Vérifié' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                    {freelancer.statut}
                                </span>
                            </div>
                            
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <p className="flex items-center gap-2"><MapPin size={16} /> {freelancer.ville}</p>
                                <p className="flex items-center gap-2"><Mail size={16} /> {freelancer.email}</p>
                                <p className="flex items-center gap-2"><Smartphone size={16} /> {freelancer.phone}</p>
                                <p className="flex items-center gap-2"><Calendar size={16} /> Inscrit le {freelancer.joined}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPIs Rapides Droite */}
                <div className={`flex flex-col gap-4 p-5 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                        <div>
                            <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Revenu Total</p>
                            <p className="text-xl font-bold text-green-700 dark:text-green-300">{freelancer.revenu.toLocaleString()} DH</p>
                        </div>
                        <DollarSign className="text-green-500" size={24} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Missions</p>
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{freelancer.jobs}</p>
                        </div>
                        <Briefcase className="text-blue-500" size={24} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                        <div>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase">Note</p>
                            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                                {freelancer.note} <Star size={16} fill="currentColor" />
                            </p>
                        </div>
                        <Award className="text-yellow-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Graphiques Activité */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenus Générés" data={chartData} dataKey="revenu" color="#10b981" type="area" unit="DH" isDarkMode={isDarkMode} />
                <ChartCard title="Missions Complétées" data={chartData} dataKey="jobs" color="#3b82f6" type="bar" unit="" isDarkMode={isDarkMode} />
            </div>

            {/* Documents & Historique */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section Documents (Validation) */}
                <div className={`rounded-2xl shadow-lg border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Documents</h3>
                    <div className="space-y-3">
                        {['CIN Recto/Verso', 'Casier Judiciaire', 'Attestation RIB'].map((doc, i) => (
                            <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" />
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{doc}</span>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Validé</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition">
                        Gérer les documents
                    </button>
                </div>

                {/* Historique Missions */}
                <div className={`lg:col-span-2 rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="p-6 border-b border-gray-200/10 flex justify-between items-center">
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dernières Missions</h3>
                        <button className="text-xs text-indigo-500 hover:underline">Tout voir</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Client</th>
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
                                        <td className="p-4 font-bold text-green-600">{job.montant}</td>
                                        <td className="p-4 text-right">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.statut === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
        </div>
    );
};

// --- 4. LISTE FREELANCERS (Vue Liste) ---
const FreelancerList = ({ freelancers, onSelect, isDarkMode }) => {
    const [search, setSearch] = useState('');
    const filtered = freelancers.filter(f => f.nom.toLowerCase().includes(search.toLowerCase()) || f.service.toLowerCase().includes(search.toLowerCase()));

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
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className={`text-xs uppercase font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                        <tr>
                            <th className="p-4">Freelancer</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Note</th>
                            <th className="p-4">Revenu</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {filtered.map(f => (
                            <tr key={f.id} className={`group transition ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                                <td className="p-4">
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{f.prenom} {f.nom}</div>
                                    <div className="text-xs opacity-60">{f.ville}</div>
                                </td>
                                <td className={`p-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{f.service}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                        {f.note} <Star size={12} fill="currentColor"/>
                                    </div>
                                </td>
                                <td className={`p-4 font-mono text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{f.revenu.toLocaleString()} DH</td>
                                <td className="p-4">
                                    {f.statut === 'Vérifié' 
                                        ? <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center w-fit gap-1"><ShieldCheck size={10}/> Vérifié</span>
                                        : <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center w-fit gap-1"><AlertTriangle size={10}/> En attente</span>
                                    }
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
    const { isDarkMode } = useContext(SuperviseurContext);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);

    // Données Globales du Dashboard
    const globalChartData = generateChartData('Mois').map(d => ({...d, revenu: d.revenu * 100, jobs: d.jobs * 50}));
    const globalStats = {
        total: GLOBAL_STATS.totalFreelancers,
        verified: 280,
        pending: GLOBAL_STATS.enAttente,
        avgRating: 4.6
    };

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
                            <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{globalStats.total}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">Vérifiés</p>
                            <h3 className="text-3xl font-bold text-green-500">{globalStats.verified}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">En Attente</p>
                            <h3 className="text-3xl font-bold text-orange-500">{globalStats.pending}</h3>
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">Note Moyenne</p>
                            <h3 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">{globalStats.avgRating} <Star size={24} fill="currentColor"/></h3>
                        </div>
                    </div>

                    {/* Graphiques Globaux */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ChartCard title="Croissance Freelancers" data={globalChartData} dataKey="jobs" color="#3b82f6" type="bar" unit="" isDarkMode={isDarkMode} />
                        </div>
                        <ServiceDistributionCard isDarkMode={isDarkMode} />
                    </div>
                </>
            )}

            {/* Section Liste ou Détail */}
            <div className={`border-t pt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Briefcase size={24} /> 
                    </div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedFreelancer ? "Dossier Prestataire" : "Gestion des Freelancers"}
                    </h2>
                </div>

                {selectedFreelancer ? (
                    <FreelancerAnalytics 
                        freelancer={selectedFreelancer} 
                        onBack={() => setSelectedFreelancer(null)} 
                        isDarkMode={isDarkMode} 
                    />
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