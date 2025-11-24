import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
   
    User, ShoppingBag, CreditCard, TrendingUp, MapPin, Star, 
    DollarSign, CheckCircle, XCircle, Smartphone, Search, 
    Eye, ArrowLeft, Wallet, MessageSquare, Calendar, Hash, Mail
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- 1. OUTILS GRAPHIQUES ---

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

const FilterableChartCard = ({ title, data, type = "line", color = "#3b82f6", unit = "", isDarkMode }) => {
  const chartData = data?.chartData || [];
  const total = data?.total || 0;

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {total.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
          </p>
        </div>
      </div>
      <div className="h-[160px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 10 }} dy={10} />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{ stroke: isDarkMode ? '#4b5563' : '#e5e7eb', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 10 }} dy={10} />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6' }} />
              <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PaymentDistributionCard = ({ data, isDarkMode }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const mostUsed = sortedData[0];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between h-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="mb-2"><h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paiements</h3></div>
      <div className="h-[120px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip unit="%" isDarkMode={isDarkMode} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total</span>
        </div>
      </div>
      <div className="mt-2 space-y-2">
         <div className="flex justify-between items-center text-xs"><span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top:</span><span className="font-bold text-blue-500">{mostUsed.name} ({mostUsed.value}%)</span></div>
         <div className="flex flex-wrap gap-2 mt-1 justify-center">
            {data.slice(0, 3).map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{entry.name}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- 2. COMPOSANT : ANALYSE DÉTAILLÉE CLIENT ---
const ClientAnalytics = ({ client, onBack, isDarkMode }) => {
  const [filter, setFilter] = useState('Mois'); // 'Jour', 'Mois', 'Année'

  // Générateur de données simulées pour le client (Adapté au filtre)
  const generateClientData = () => {
      const count = filter === 'Jour' ? 12 : filter === 'Mois' ? 30 : 12;
      const labels = filter === 'Jour' ? (i) => `${8+i}h` : filter === 'Mois' ? (i) => `J${i+1}` : (i) => ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aou','Sep','Oct','Nov','Dec'][i];
      const totalFactor = filter === 'Jour' ? 1 : filter === 'Mois' ? 10 : 100;
      
      const chartData = Array.from({ length: count }, (_, i) => ({
          name: labels(i),
          value: Math.floor(Math.random() * 10)
      }));

      return {
          total: chartData.reduce((a, b) => a + b.value, 0) * totalFactor,
          chartData: chartData
      };
  };

  const metrics = {
      commandes: generateClientData(),
      payees: generateClientData(),
      annulees: generateClientData(),
      ca: generateClientData(),
      connexions: generateClientData()
  };
  metrics.ca.total = metrics.ca.total * 150; // Ajustement CA

  const paymentData = [
      { name: 'Carte', value: 60 }, { name: 'Espèces', value: 30 }, { name: 'Wallet', value: 10 },
  ];

  // 5 Commentaires (Cohérent avec l'affichage)
  const comments = [
      { id: 1, author: "Karim (Freelancer)", date: "12 Nov 2024", text: "Client très ponctuel et respectueux. Je recommande.", rating: 5 },
      { id: 2, author: "Sara (Support)", date: "05 Oct 2024", text: "A signalé un problème technique, résolu rapidement.", rating: 4 },
      { id: 3, author: "Ahmed (Freelancer)", date: "20 Sep 2024", text: "Excellent travail, paiement rapide.", rating: 5 },
      { id: 4, author: "Laila (Client)", date: "15 Aug 2024", text: "Service impeccable, je reviendrai.", rating: 4 },
      { id: 5, author: "Youssef (Support)", date: "01 Jul 2024", text: "Client satisfait, aucune réclamation.", rating: 5 },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      
      {/* Header Navigation & Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors group">
          <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100"><ArrowLeft size={20} /></div>
          Retour à la liste
        </button>
        
        <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {['Jour', 'Mois', 'Année'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${filter === f ? 'bg-indigo-600 text-white shadow' : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}>{f}</button>
            ))}
        </div>
      </div>

      {/* 1. PROFIL & RÉPUTATION */}
      <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Info Gauche */}
          <div className="flex-1 flex gap-6 items-start">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0 border-4 border-white dark:border-gray-700">
                {client.name.charAt(0)}{client.surname.charAt(0)}
             </div>
             <div className="flex-1 space-y-2">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.name} {client.surname}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        <CheckCircle size={12} className="mr-1" /> Client Vérifié
                    </span>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                   <p className="flex items-center gap-2"><Hash size={14} className="text-indigo-500"/> ID: <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{client.id}</span></p>
                   <p className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500"/> Inscrit le: {client.registrationDate}</p>
                   <p className="flex items-center gap-2"><Mail size={14} className="text-indigo-500"/> {client.email}</p>
                   <p className="flex items-center gap-2"><Smartphone size={14} className="text-indigo-500"/> {client.phone || '+212 600 000 000'}</p>
                   <p className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/> {client.city}</p>
                </div>
             </div>
          </div>
          
          {/* Info Droite */}
          <div className={`lg:w-80 flex flex-col gap-4 p-5 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'}`}>
             <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Portefeuille</span>
                <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                    <Wallet size={24}/> {client.walletBalance} DH
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
                    <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>15</div>
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

      {/* 2. GRAPHIQUES DÉTAILLÉS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Ligne 1 : Commandes & Payées */}
         <FilterableChartCard title="Commandes Passées" data={metrics.commandes} type="line" color="#3b82f6" unit="Cmds" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Commandes Payées" data={metrics.payees} type="line" color="#10b981" unit="Cmds" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Annulations" data={metrics.annulees} type="bar" color="#ef4444" unit="Cmds" isDarkMode={isDarkMode} />

         {/* Ligne 2 : CA & Connexion & Paiement */}
         <FilterableChartCard title="Chiffre d'Affaires" data={metrics.ca} type="line" color="#f59e0b" unit="DH" isDarkMode={isDarkMode} />
         <FilterableChartCard title="Connexions" data={metrics.connexions} type="bar" color="#8b5cf6" unit="Visites" isDarkMode={isDarkMode} />
         <PaymentDistributionCard data={paymentData} isDarkMode={isDarkMode} />
      </div>

      {/* 3. HISTORIQUE & COMMENTAIRES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Historique Commandes */}
          <div className={`lg:col-span-2 rounded-2xl shadow-lg overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="p-6 border-b border-gray-200/10 flex justify-between items-center">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historique des Commandes</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                   <thead className={`text-xs uppercase ${isDarkMode ? 'text-gray-400 bg-gray-700/50' : 'text-gray-500 bg-gray-50'}`}>
                       <tr><th className="p-4">ID</th><th className="p-4">Freelancer</th><th className="p-4">Date</th><th className="p-4 text-right">Statut</th></tr>
                   </thead>
                   <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                     {client.orderHistory.map(order => (
                       <tr key={order.id} className={`group ${isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-blue-50/30'}`}>
                         <td className="p-4 font-mono font-medium">#{order.id}</td>
                         <td className="p-4 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">{order.freelancer.charAt(0)}</div>{order.freelancer}</td>
                         <td className={`p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>12 Nov 2024</td>
                         <td className="p-4 text-right"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span></td>
                       </tr>
                     ))}
                   </tbody>
               </table>
            </div>
          </div>

          {/* Commentaires */}
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
      </div>
    </div>
  );
};

// --- 3. LISTE CLIENTS (Ne change pas) ---
const ClientList = ({ clients, onSelect, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.surname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-all ${isDarkMode}`}>
      <div className="p-6 border-b border-gray-200/10 flex justify-between items-center gap-4">
        <h3 className={`text-lg font-bold ${isDarkMode}`}>Base Clients ({clients.length})</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5" size={18} />
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode}`} />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10"><tr className={`text-xs uppercase tracking-wider ${isDarkMode} `}><th className="p-4">Client</th><th className="p-4">Ville</th><th className="p-4">Solde</th><th className="p-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-gray-200/10 text-sm">
            {filteredClients.map(client => (
              <tr key={client.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                <td className="p-4"><div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.name} {client.surname}</div><div className="text-xs opacity-60">{client.email}</div></td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{client.city}</td>
                <td className={`p-4 font-bold ${client.walletBalance > 50 ? 'text-green-500' : 'text-yellow-500'}`}>{client.walletBalance} DH</td>
                <td className="p-4 text-right"><button onClick={() => onSelect(client)} className="text-blue-500 hover:text-blue-700 font-medium text-xs border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-all">Analyser</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 4. PAGE PRINCIPALE ---
export default function DashboardClient() {
  const { isDarkMode } = useOutletContext();
  const [selectedClient, setSelectedClient] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [clients, setClients] = useState([]);

  // Génération de données fictives globales
  const generateFullMetric = (dailyTotal, monthlyTotal, yearlyTotal) => ({
    daily: { total: dailyTotal, chartData: Array.from({length: 12}, (_, i) => ({ name: `${8+i}h`, value: Math.floor(dailyTotal/10 + Math.random() * (dailyTotal/5)) })) },
    monthly: { total: monthlyTotal, chartData: Array.from({length: 30}, (_, i) => ({ name: `J${i+1}`, value: Math.floor(monthlyTotal/25 + Math.random() * (monthlyTotal/10)) })) },
    yearly: { total: yearlyTotal, chartData: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({ name: m, value: Math.floor(yearlyTotal/10 + Math.random() * (yearlyTotal/5)) })) }
  });

  useEffect(() => {
    // Initialisation des données (Simulation API)
    setMetrics({
      ordersPlaced: generateFullMetric(45, 1250, 14500),
      ordersCanceled: generateFullMetric(2, 85, 950),
      ordersPaid: generateFullMetric(40, 1100, 13200),
      revenue: generateFullMetric(12500, 450000, 5200000),
      connections: generateFullMetric(150, 4500, 54000),
      paymentMethods: [
        { name: 'Carte Bancaire', value: 65 }, { name: 'PayPal', value: 20 }, 
        { name: 'Espèces', value: 10 }, { name: 'Virement', value: 5 }
      ]
    });
    setClients([
      { id: 1, name: 'Ziyad', surname: 'Ouamna', email: 'ziyad@cleanix.com', registrationDate: '2025-01-10', city: 'Casablanca', stars: 5, walletBalance: 250, orderHistory: [{id: 101, freelancer: 'Ahmed', status: 'Completed'}, {id: 103, freelancer: 'Omar', status: 'In Progress'}] },
      { id: 2, name: 'Sara', surname: 'Benali', email: 'sara@gmail.com', registrationDate: '2025-02-15', city: 'Marrakech', stars: 4.5, walletBalance: 45, orderHistory: [{id: 102, freelancer: 'Karim', status: 'In Progress'}] },
    ]);
  }, []);

  const refreshData = () => window.location.reload();

  if (!metrics) return <div className="p-10 text-center animate-pulse">Chargement Cleanix...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 ${isDarkMode}">
        <div>
          <h1 className="text-2xl font-extrabold mb-1 tracking-tight ${isDarkMode} ">Dashboard Clients</h1>
          <p className={`text-xs ${isDarkMode}`}>
            {selectedClient ? "Analyse détaillée du client." : "Aperçu des performances globales."}
          </p>
        </div>
        <button onClick={refreshData} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-xs font-bold flex items-center gap-2">
          <TrendingUp size={14}/> Actualiser
        </button>
      </div>

      {/* --- SI AUCUN CLIENT SÉLECTIONNÉ : AFFICHER DASHBOARD GLOBAL --- */}
      {!selectedClient && (
         <>
            {/* LIGNE 1 : INDICATEURS COMMANDES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb- ${isDarkMode}">
                <FilterableChartCard title="Commandes Passées"  data={metrics.ordersPlaced} type="line" color="#3b82f6" unit="Cmds" />
                <FilterableChartCard title="Commandes Payées"   data={metrics.ordersPaid} type="line" color="#10b981" unit="Cmds" />
                <FilterableChartCard title="Commandes Annulées" data={metrics.ordersCanceled} type="bar" color="#ef4444" unit="Cmds"  />
            </div>

            {/* LIGNE 2 : FINANCES & TRAFIC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <FilterableChartCard title="Chiffre d'Affaires" data={metrics.revenue} type="line" color="#f59e0b" unit="DH" isDarkMode={isDarkMode} />
                <FilterableChartCard title="Connexions Utilisateurs" data={metrics.connections} type="line" color="#8b5cf6" unit="Visites" isDarkMode={isDarkMode} />
                <PaymentDistributionCard data={metrics.paymentMethods} />
            </div>
         </>
      )}

      {/* --- SECTION CLIENTS : LISTE OU DÉTAIL --- */}
      <div className={`animate-fade-in border-t pt-8 ${isDarkMode}`}>
        
        {/* En-tête de section */}
        <div className="flex items-center gap-3 mb-6">
           <div className={`p-2 rounded-lg`}>
               <User size={24} /> 
           </div>
           <h2 className={`text-xl font-bold`}>
               {selectedClient ? "Détails du Client" : "Gestion des Clients"}
           </h2>
        </div>
        
        {/* Affichage conditionnel : Détail ou Liste */}
        {selectedClient ? (
          <ClientAnalytics 
            client={selectedClient} 
            onBack={() => setSelectedClient(null)} 
          />
        ) : (
          <ClientList 
            clients={clients} 
            onSelect={(client) => setSelectedClient(client)} 
          />
        )}
      </div>

    </div>
  );
}