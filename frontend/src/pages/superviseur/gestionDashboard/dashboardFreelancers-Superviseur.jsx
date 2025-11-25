import React, { useState, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
// Assurez-vous d'utiliser le bon hook selon votre architecture (useOutletContext si via Outlet)
import { useOutletContext } from 'react-router-dom';
import { 
    CreditCard,
    Briefcase, Star, ShieldCheck, DollarSign, Users, TrendingUp, 
    Search, ArrowLeft, MapPin, Smartphone, Mail, Calendar, CheckCircle, 
    AlertTriangle, FileText, Award, Clock, Wallet, Power, Building, Activity, UserCheck, XCircle, BarChart2
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

const FREELANCERS_LIST = [
    { id: 1, prenom: 'Karim',nom: 'Fassi', service: 'Nettoyage', ville: 'Rabat', noteMoyenne: 4.8, statut: 'Disponible', estConnecte: true, solde: 12500, detailsCompteBancaire: 'CIH *** 1234', email: 'karim.f@test.com', phone: '0661000001', joined: '12/02/2023', avisCount: 45, commentairesCount: 12 },
    { id: 2, prenom: 'Lina', nom: 'Mouline', service: 'Gestion Clés', ville: 'Casablanca', noteMoyenne: 5.0, statut: 'Occupé', estConnecte: false, solde: 450, detailsCompteBancaire: 'BP *** 9876', email: 'lina.m@test.com', phone: '0661000002', joined: 'Hier', avisCount: 5, commentairesCount: 2 },
    { id: 3, prenom: 'Omar', nom: 'Diouri', service: 'Jardinage', ville: 'Marrakech', noteMoyenne: 4.2, statut: 'Suspendu', estConnecte: true, solde: 0, detailsCompteBancaire: 'Attijari *** 5555', email: 'omar.d@test.com', phone: '0661000003', joined: '05/06/2023', avisCount: 20, commentairesCount: 8 },
    { id: 4, prenom: 'Sara', nom: 'Bennani', service: 'Nettoyage', ville: 'Tanger', noteMoyenne: 4.9, statut: 'Disponible', estConnecte: false, solde: 15600, detailsCompteBancaire: 'SG *** 1111', email: 'sara.b@test.com', phone: '0661000004', joined: '01/01/2023', avisCount: 120, commentairesCount: 45 },
];

// Historique détaillé des missions pour la vue "Détail"
const JOBS_HISTORY_MOCK = [
    { id: 'CMD-101', service: 'Grand Ménage', date: '20 Nov 2024', client: 'Ziyad O.', montant: '400 DH', statut: 'Terminée' },
    { id: 'CMD-102', service: 'Nettoyage Vitres', date: '18 Nov 2024', client: 'Sara K.', montant: '150 DH', statut: 'Terminée' },
    { id: 'CMD-103', service: 'Jardinage', date: '15 Nov 2024', client: 'Entreprise X', montant: '1200 DH', statut: 'En cours' },
    { id: 'CMD-104', service: 'Bricolage', date: '10 Nov 2024', client: 'Mehdi L.', montant: '300 DH', statut: 'Annulée' },
    { id: 'CMD-105', service: 'Plomberie', date: '05 Nov 2024', client: 'Karim T.', montant: '250 DH', statut: 'Terminée' },
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

// Générateur de données EMPILÉES (Multi-Lines/Bars) pour le graphique global des commandes
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

// Carte Graphique Simple (Ligne/Aire/Barre)
const ChartCard = ({ title, data, type = 'area', unit, isDarkMode, dataKey1 = 'value', color1, name1, dataKey2, color2, name2 }) => {
    const [period, setPeriod] = useState('monthly');
    
    // Si pas de données, fallback
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

// Carte Graphique Multi-Données (Commandes: Acceptées/Terminées/Annulées)
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
          {/* PIE CHART */}
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
                label={({ value }) => `${value}${unit}`} // Affiche les pourcentages
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            </PieChart>
          )}

          {/* BAR CHART */}
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

          {/* LINE CHART */}
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
          {/* PIE CHART */}
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
                label={({ value }) => `${value}${unit}`} // Affiche les pourcentages
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            </PieChart>
          )}

          {/* BAR CHART */}
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

          {/* LINE CHART */}
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

// --- 3. VUE DÉTAIL FREELANCER ---
const FreelancerAnalytics = ({ freelancer, onBack, isDarkMode }) => {
    const [metrics, setMetrics] = useState(null);

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
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors group">
                    <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100"><ArrowLeft size={20} /></div>
                    Retour liste
                </button>
            </div>

            {/* Carte Profil & Statut (Attributs UML) */}
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
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{freelancer.prenom} {freelancer.nom}</h2>
                                    <p className="text-indigo-500 font-medium">{freelancer.service}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${freelancer.statut === 'Disponible' ? 'bg-green-100 text-green-700 border-green-200' : freelancer.statut === 'Occupé' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                    {freelancer.statut}
                                </span>
                            </div>
                            
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <p className="flex items-center gap-2"><MapPin size={16} /> {freelancer.ville}</p>
                                <p className="flex items-center gap-2"><Mail size={16} /> {freelancer.email}</p>
                                <p className="flex items-center gap-2"><Smartphone size={16} /> {freelancer.phone}</p>
                                <p className="flex items-center gap-2"><Building size={16} /> {freelancer.detailsCompteBancaire}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPIs Rapides Droite (Portefeuille) */}
                <div className={`flex flex-col justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div>
                        <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solde Portefeuille</p>
                        <div className="flex items-center justify-between mt-2">
                            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{freelancer.solde.toLocaleString()} <span className="text-sm">DH</span></h3>
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Wallet size={24} /></div>
                        </div>
                    </div>
                    <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                        <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Note Moyenne</p>
                        <div className="flex items-center gap-2 mt-2">
                            <h3 className="text-2xl font-bold text-yellow-500">{freelancer.noteMoyenne}</h3>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(freelancer.noteMoyenne) ? "currentColor" : "none"} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphiques Activité Individuelle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenus Générés" data={metrics.revenu} dataKey1="value" color1="#10b981" name1="Revenu" type="area" unit="DH" isDarkMode={isDarkMode} />
                <ChartCard title="Missions Complétées" data={metrics.missions} dataKey1="value" color1="#3b82f6" name1="Missions" type="bar" unit="" isDarkMode={isDarkMode} />
            </div>

            {/* Historique Missions (Tableau Détaillé) */}
            <div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="p-6 border-b border-gray-200/10 flex justify-between items-center">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historique des Missions</h3>
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
        <div className={`rounded-2xl shadow-lg border overflow-hidden`}>
            <div className={`p-6 border-b flex justify-between items-center gap-4`}>
                <h3 className={`text-lg font-bold`}>Base Freelancers</h3>
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
                    {/* KPIs Globaux avec Cartes Simples */}
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

                    {/* Graphiques Globaux Stratégiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <ChartCard title="Revenus de la Plateforme" data={globalMetrics.revenu} dataKey1="value" color1="#10b981" name1="Revenus" type="area" unit="DH" isDarkMode={isDarkMode} />
                         <ChartCard title="Activité en Ligne" data={globalMetrics.activite} dataKey1="value" color1="#3b82f6" name1="Connectés" type="bar" unit="" isDarkMode={isDarkMode} />
                    </div>
                    
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <ChartCard title="Progression Inscriptions" data={globalMetrics.inscriptions} dataKey1="value" color1="#f59e0b" name1="Nouveaux" type="line" unit="" isDarkMode={isDarkMode} />
                         
                         {/* Graphique "État des Commandes" ajouté ici */}
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
                            type="pie"      // pie | bar | line
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

            {/* Section Liste ou Détail (Toggle) */}
            <div className={`border-t pt-8`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg`}>
                        <Briefcase size={24} /> 
                    </div>
                    <h2 className={`text-xl font-bold`}>
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