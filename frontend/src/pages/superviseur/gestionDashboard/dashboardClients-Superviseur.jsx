import React, { useState, useEffect, useContext } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { 
    User, ShoppingBag, CreditCard, TrendingUp, MapPin, Star, 
    DollarSign, CheckCircle, XCircle, Smartphone, Search, 
    Eye, ArrowLeft, Wallet, MessageSquare, Calendar, Hash, Mail, CalendarDays
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- 1. UTILITAIRES & DONNÉES MOCK ---

// Générateur de données multi-périodes (Pour Global et Client)
const generateMultiPeriodData = (baseValue) => {
    // Helper pour créer un tableau de données aléatoires
    const createData = (count, labels, variance) => 
        Array.from({ length: count }, (_, i) => {
            const val = Math.max(0, Math.floor(baseValue + (Math.random() * variance) - (variance / 2)));
            return { name: labels(i), value: val };
        });

    const dailyLabels = (i) => `${8+i}h`;
    const monthlyLabels = (i) => `J${i+1}`;
    const yearlyLabels = (i) => ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aout','Sep','Oct','Nov','Dec'][i];

    // On simule des échelles différentes selon la période
    const dailyData = createData(12, dailyLabels, baseValue * 0.5); 
    const monthlyData = createData(30, monthlyLabels, baseValue * 2);
    const yearlyData = createData(12, yearlyLabels, baseValue * 5);

    return {
        daily: { total: dailyData.reduce((a,b)=>a+b.value,0), chartData: dailyData },
        monthly: { total: monthlyData.reduce((a,b)=>a+b.value,0), chartData: monthlyData },
        yearly: { total: yearlyData.reduce((a,b)=>a+b.value,0), chartData: yearlyData }
    };
};

// Liste Clients
const CLIENTS_LIST = [
    { id: 1, nom: 'Ahmed', prenom: 'Bennani', email: 'ahmed@test.com', phone: '0661234567', ville: 'Casablanca', dateInscription: '12/01/2023', solde: 120.50, stars: 4.8, evaluations: 15, commentaires: 5, commandes: 24 },
    { id: 2, nom: 'Sara', prenom: 'Idrissi', email: 'sara@test.com', phone: '0661987654', ville: 'Rabat', dateInscription: '05/03/2023', solde: 0.00, stars: 5.0, evaluations: 3, commentaires: 1, commandes: 5 },
    { id: 3, nom: 'Karim', prenom: 'Tazi', email: 'karim@test.com', phone: '0600000000', ville: 'Marrakech', dateInscription: '20/06/2023', solde: 45.00, stars: 4.2, evaluations: 8, commentaires: 2, commandes: 12 },
    { id: 4, nom: 'Lina', prenom: 'Mansouri', email: 'lina@test.com', phone: '0611223344', ville: 'Tanger', dateInscription: '10/11/2023', solde: 200.00, stars: 4.9, evaluations: 20, commentaires: 8, commandes: 30 },
];

// --- 2. COMPOSANTS GRAPHIQUES ---

const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-lg shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{label}</p>
        {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString()} {unit}
            </p>
        ))}
      </div>
    );
  }
  return null;
};

// Carte Graphique avec Filtre J/M/A intégré
const FilterableChartCard = ({ title, data, type = "line", color = "#3b82f6", unit = "", isDarkMode }) => {
  // État local pour filtrer CE graphique uniquement
  const [period, setPeriod] = useState('monthly'); // 'daily', 'monthly', 'yearly'

  if (!data) return <div className="p-6 text-center text-gray-400">Chargement...</div>;
  
  // Sélectionner les données selon la période choisie localement
  const currentView = data[period] || { total: 0, chartData: [] };

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentView.total.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        
        {/* Boutons Filtres J/M/A */}
        <div className={`flex p-0.5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {['daily', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                  period === p 
                    ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600')
                }`}
                title={p === 'daily' ? 'Jour' : p === 'monthly' ? 'Mois' : 'Année'}
              >
                {p === 'daily' ? 'J' : p === 'monthly' ? 'M' : 'A'}
              </button>
            ))}
        </div>
      </div>

      <div className="h-[160px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={currentView.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }} 
                dy={10} 
              />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{ stroke: isDarkMode ? '#4b5563' : '#e5e7eb', strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, strokeWidth: 0 }} 
              />
            </LineChart>
          ) : (
            <BarChart data={currentView.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }} 
                dy={10} 
              />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6' }} />
              <Bar 
                dataKey="value" 
                fill={color} 
                radius={[3, 3, 0, 0]} 
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Carte Camembert Paiement
const PaymentDistributionCard = ({ data, isDarkMode }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const mostUsed = sortedData[0];
  const COLORS_CHART = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between h-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="mb-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paiements</h3>
      </div>
      <div className="h-[120px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip unit="%" isDarkMode={isDarkMode} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
         {data.map((d, i) => (
             <div key={i} className="flex justify-between items-center text-xs">
                <span className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS_CHART[i % COLORS_CHART.length]}}></div>
                    {d.name}
                </span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{d.value}%</span>
             </div>
         ))}
      </div>
    </div>
  );
};

// --- 3. COMPOSANT : ANALYSE DÉTAILLÉE CLIENT ---
const ClientAnalytics = ({ client, onBack, isDarkMode }) => {
  // Pour le client, on génère aussi des données complètes multi-périodes
  const metrics = {
      commandes: generateMultiPeriodData(10),
      payees: generateMultiPeriodData(8),
      annulees: generateMultiPeriodData(2),
      ca: generateMultiPeriodData(1200),
      connexions: generateMultiPeriodData(40)
  };

  const paymentData = [
      { name: 'Carte', value: 60 },
      { name: 'Espèces', value: 30 },
      { name: 'Wallet', value: 10 },
  ];
//les commentaires 
  const comments = [
      { id: 1, author: "Karim (Freelancer)", date: "12 Nov 2024", text: "Client très ponctuel et respectueux. Je recommande.", rating: 5 },
      { id: 2, author: "Sara (Support)", date: "05 Oct 2024", text: "A signalé un problème technique, résolu rapidement.", rating: 4 },
      { id: 3, author: "Ahmed (Freelancer)", date: "20 Sep 2024", text: "Excellent travail, paiement rapide.", rating: 5 },
      { id: 4, author: "Laila (Client)", date: "15 Aug 2024", text: "Service impeccable, je reviendrai.", rating: 4 },
      { id: 5, author: "Youssef (Support)", date: "01 Jul 2024", text: "Client satisfait, aucune réclamation.", rating: 5 },
  ];
// 
const ordersHistory = [
  { id: 1, client: "Karim", idFreelancer : 23, date: "12 Nov 2024", service: "Huiles de nigelle", amount: 120.50, status: "en cours" },
  { id: 2, client: "Sara",  idFreelancer : 25,date: "05 Oct 2024", service: "Savon naturel", amount: 45.00, status: "Terminer" },
  { id: 3, client: "Ahmed", idFreelancer : 23, date: "20 Sep 2024", service: "Huile de coco", amount: 80.75, status: "Terminer" },
  { id: 4, client: "Laila", idFreelancer : 3, date: "15 Aug 2024", service: "Pâte d’amande", amount: 60.00, status: "Terminer" },
  { id: 5, client: "Youssef",idFreelancer : 33, date: "01 Jul 2024", service: "Huiles essentielles", amount: 150.25, status: "Terminer" },
];
  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header Retour */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors group">
          <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100"><ArrowLeft size={20} /></div>
          Retour à la liste
        </button>
      </div>

      {/* 1. INFOS CLIENT */}
      <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex gap-6 items-start">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0 border-4 border-white dark:border-gray-700">
                {client.nom.charAt(0)}{client.prenom.charAt(0)}
             </div>
             <div className="flex-1 space-y-2">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.prenom} {client.nom}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        <CheckCircle size={12} className="mr-1" /> Client Vérifié
                    </span>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                   <p className="flex items-center gap-2"><Hash size={14} className="text-indigo-500"/> ID: <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{client.id}</span></p>
                   <p className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500"/> Inscrit le: {client.dateInscription}</p>
                   <p className="flex items-center gap-2"><Mail size={14} className="text-indigo-500"/> {client.email}</p>
                   <p className="flex items-center gap-2"><Smartphone size={14} className="text-indigo-500"/> {client.phone || '+212 600 000 000'}</p>
                   <p className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/> {client.ville}</p>
                </div>
             </div>
          </div>
          <div className={`lg:w-80 flex flex-col gap-4 p-5 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'}`}>
             <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Portefeuille</span>
                <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                    <Wallet size={24}/> {client.solde.toFixed(2)} DH
                </div>
             </div>
             <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-lg">
                        {client.stars} <Star size={16} fill="currentColor"/>
                    </div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Note</p>
                </div>
                <div>
                    <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{client.evaluations}</div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Avis</p>
                </div>
                <div>
                    <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{comments.length}</div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Coms</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. GRAPHIQUES (Avec Filtres J/M/A fonctionnels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <FilterableChartCard title="Commandes Passées" data={metrics.commandes} type="line" color="#3b82f6" unit="Cmds" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Commandes Payées" data={metrics.payees} type="line" color="#10b981" unit="Cmds" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Annulations" data={metrics.annulees} type="bar" color="#ef4444" unit="Cmds" isDarkMode={isDarkMode} />

         <FilterableChartCard title="Chiffre d'Affaires" data={metrics.ca} type="line" color="#f59e0b" unit="DH" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Connexions Utilisateurs" data={metrics.connexions} type="bar" color="#8b5cf6" unit="Visites" isDarkMode={isDarkMode} />
         <PaymentDistributionCard data={paymentData} isDarkMode={isDarkMode} />
      </div>

      {/* 3. COMMENTAIRES & HISTORIQUE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commentaires (5 items) */}
          <div className={`rounded-2xl shadow-lg overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <div className="p-6 border-b border-gray-200/10"><h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Commentaires ({comments.length})</h3></div>
             <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {comments.map((com) => (
                    <div key={com.id} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-indigo-500">{com.author}</span>
                            <span className="text-[10px] text-gray-400">{com.date}</span>
                        </div>
                        <p className={`text-sm italic mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{com.text}"</p>
                        <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < com.rating ? "currentColor" : "none"} />)}
                        </div>
                    </div>
                ))}
             </div>
          </div>
          
         {/* Zone Historique */}
        <div className={`p-6 rounded-2xl shadow-lg overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
  <p className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    Historique détaillé des commandes
  </p>
  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
    {ordersHistory.map((order) => (
      <div
        key={order.id}
        className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-100'} space-y-2`}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-indigo-500">{order.client}</span>
          <span className="text-xs text-gray-400">{order.date}</span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Produit : <span className="font-semibold">{order.product}</span> — Montant : <span className="font-semibold">${order.amount.toFixed(2)}</span>
        </p>
        <p className={`text-sm italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Statut : <span className={order.status === "Livrée" ? 'text-green-500' : order.status === "Annulée" ? 'text-red-500' : 'text-yellow-500'}>{order.status}</span>
        </p>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

// --- 4. LISTE CLIENTS (Vue par Défaut) ---
const ClientList = ({ clients, onSelect, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  
  );

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className={`p-6 border-b flex justify-between items-center gap-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Liste des Clients ({clients.length})</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10"><tr className={`text-xs uppercase tracking-wider ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}><th className="p-4">Client</th><th className="p-4">Ville</th><th className="p-4">Solde</th><th className="p-4">Commandes</th><th className="p-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-gray-200/10 text-sm">
            {filteredClients.map(client => (
              <tr key={client.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                <td className="p-4"><div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.prenom} {client.nom}</div><div className="text-xs opacity-60">{client.email}</div></td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{client.ville}</td>
                <td className={`p-4 font-bold ${client.solde > 50 ? 'text-green-500' : 'text-yellow-500'}`}>{client.solde.toFixed(2)} DH</td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{client.commandes}</td>
                <td className="p-4 text-right"><button onClick={() => onSelect(client)} className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-all">Détails</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 5. DASHBOARD PRINCIPAL (Point d'entrée) ---
export default function DashboardClient() {
  const { isDarkMode } = useContext(SuperviseurContext); 
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Génération des données GLOBALES complètes (Multi-périodes)
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [paymentData] = useState([
    { name: 'Carte', value: 65 }, { name: 'Espèces', value: 25 }, { name: 'Wallet', value: 10 },
  ]);

  useEffect(() => {
    setGlobalMetrics({
        commandes: generateMultiPeriodData(15),
        payees: generateMultiPeriodData(12),
        annulees: generateMultiPeriodData(3),
        ca: generateMultiPeriodData(2500),
        connexions: generateMultiPeriodData(100)
    });
  }, []);

  const refreshData = () => window.location.reload();

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* HEADER */}
      <div className={`flex justify-between items-center mb-8`}>
        <div>
          <h1 className={`text-2xl font-extrabold mb-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Clients</h1>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {selectedClient ? "Analyse détaillée du client." : "Aperçu des performances globales."}
          </p>
        </div>
        {!selectedClient && (
            <button onClick={refreshData} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-xs font-bold flex items-center gap-2">
              <TrendingUp size={14}/> Actualiser
            </button>
        )}
      </div>

      {/* --- PARTIE 1 : DASHBOARD GLOBAL (Visible si aucun client sélectionné) --- */}
      {!selectedClient && globalMetrics && (
         <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <FilterableChartCard title="Commandes Passées" data={globalMetrics.commandes} type="line" color="#3b82f6" unit="Cmds" isDarkMode={isDarkMode} />
                <FilterableChartCard title="Commandes Payées" data={globalMetrics.payees} type="line" color="#10b981" unit="Cmds" isDarkMode={isDarkMode} />
                <FilterableChartCard title="Annulations" data={globalMetrics.annulees} type="bar" color="#ef4444" unit="Cmds" isDarkMode={isDarkMode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <FilterableChartCard title="Chiffre d'Affaires" data={globalMetrics.ca} type="line" color="#f59e0b" unit="DH" isDarkMode={isDarkMode} />
                <FilterableChartCard title="Connexions" data={globalMetrics.connexions} type="bar" color="#8b5cf6" unit="Visites" isDarkMode={isDarkMode} />
                <PaymentDistributionCard data={paymentData} isDarkMode={isDarkMode} />
            </div>
         </>
      )}

      {/* --- PARTIE 2 : LISTE OU DÉTAIL --- */}
      <div className={`animate-fade-in border-t pt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        
        <div className="flex items-center gap-3 mb-6">
           <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
               <User size={24} /> 
           </div>
           <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
               {selectedClient ? "Dossier Client" : "Gestion des Clients"}
           </h2>
        </div>
        
        {selectedClient ? (
          <ClientAnalytics 
            client={selectedClient} 
            onBack={() => setSelectedClient(null)} 
            isDarkMode={isDarkMode} 
          />
        ) : (
          <ClientList 
            clients={CLIENTS_LIST} 
            onSelect={(client) => setSelectedClient(client)} 
            isDarkMode={isDarkMode} 
          />
        )}
      </div>

    </div>
  );
}