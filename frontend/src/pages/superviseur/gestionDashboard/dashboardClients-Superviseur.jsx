import React, { useContext, useState, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- COMPOSANTS UI UTILITAIRES ---

// 1. Tooltip Personnalisé pour un design plus propre
const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        <p className="text-sm font-bold mb-1">{label}</p>
        <p className="text-sm" style={{ color: payload[0].color }}>
          {payload[0].name}: <span className="font-semibold">{payload[0].value} {unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

// 2. Composant Carte avec Filtres (Le cœur du design)
const ChartCard = ({ title, data, type = "line", color = "#8884d8", unit = "", isDarkMode }) => {
  const [period, setPeriod] = useState('monthly'); // 'daily', 'monthly', 'yearly'

  // Sélectionner les données selon la période choisie
  const currentData = data ? data[period] : { total: 0, chartData: [] };
  
  // Labels pour les axes selon la période
  const getXLabel = () => {
    if (period === 'daily') return 'Heure';
    if (period === 'monthly') return 'Jour';
    return 'Mois';
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      
      {/* En-tête de la carte avec Titre et Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentData.total.toLocaleString()} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        
        {/* Boutons de filtres (Pill shape) */}
        <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {['daily', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                period === p 
                  ? (isDarkMode ? 'bg-gray-600 text-white shadow' : 'bg-white text-blue-600 shadow') 
                  : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')
              }`}
            >
              {p === 'daily' ? 'Jour' : p === 'monthly' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Zone du Graphique */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <AreaChart data={currentData.chartData}>
              <defs>
                <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 12 }} 
              />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color${title})`} 
                name={title} // Nom significatif pour le tooltip
              />
            </AreaChart>
          ) : (
            <BarChart data={currentData.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 12 }} 
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} name={title} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

function DashboardClient() {
  const { isDarkMode } = useContext(SuperviseurContext);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  
  // Structure de données améliorée pour supporter les filtres
  const [metrics, setMetrics] = useState(null);

  // Fonction utilitaire pour générer des données fake (pour la démo)
  const generateChartData = (period, baseValue, variance) => {
    let data = [];
    let count = period === 'daily' ? 8 : period === 'monthly' ? 12 : 5; // 8 points pour jour, 12 pour mois
    
    for (let i = 0; i < count; i++) {
      let label = period === 'daily' ? `${8 + i * 2}h` : period === 'monthly' ? `J-${i+1}` : `202${i}`;
      if (period === 'yearly') label = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'][i];
      
      data.push({
        name: label,
        value: Math.floor(baseValue + Math.random() * variance)
      });
    }
    return data;
  };

  useEffect(() => {
    // Simulation du chargement des données complètes
    const loadMockData = () => {
      setMetrics({
        ordersPlaced: {
          daily: { total: 12, chartData: generateChartData('daily', 2, 3) },
          monthly: { total: 340, chartData: generateChartData('monthly', 20, 15) },
          yearly: { total: 4200, chartData: generateChartData('yearly', 300, 100) },
        },
        ordersCanceled: {
          daily: { total: 1, chartData: generateChartData('daily', 0, 1) },
          monthly: { total: 25, chartData: generateChartData('monthly', 1, 3) },
          yearly: { total: 150, chartData: generateChartData('yearly', 10, 5) },
        },
        revenue: {
          daily: { total: 1200, chartData: generateChartData('daily', 100, 200) },
          monthly: { total: 35000, chartData: generateChartData('monthly', 2000, 1500) },
          yearly: { total: 450000, chartData: generateChartData('yearly', 30000, 10000) },
        },
        connections: {
          daily: { total: 150, chartData: generateChartData('daily', 10, 30) },
          monthly: { total: 4500, chartData: generateChartData('monthly', 100, 50) },
          yearly: { total: 54000, chartData: generateChartData('yearly', 4000, 1000) },
        },
        paymentMethods: {
          chartData: [
            { name: 'Carte Bancaire', value: 65 }, 
            { name: 'PayPal', value: 25 }, 
            { name: 'Virement', value: 10 }
          ] 
        }
      });

      // Mock Clients
      setClients([
        { id: 1, name: 'Jean', surname: 'Dupont', email: 'jean@test.com', city: 'Paris', stars: 5, walletBalance: 120 },
        { id: 2, name: 'Sara', surname: 'Connor', email: 'sara@test.com', city: 'Lyon', stars: 4, walletBalance: 45 },
        // ... autres clients
      ]);
    };

    loadMockData();
  }, []);

  const refreshData = () => window.location.reload();

  if (!metrics) return <div className="p-10 text-center">Chargement du dashboard...</div>;

  return (
    <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      
      {/* Header avec un design plus moderne */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Dashboard Clients</h1>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Bienvenue, voici l'aperçu de vos performances.
          </p>
        </div>
        <button 
          onClick={refreshData} 
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 font-medium text-sm"
        >
          Actualiser les données
        </button>
      </div>

      {/* Grille des Graphiques Intelligents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
        
        {/* 1. Commandes Passées (AreaChart pour effet moderne) */}
        <ChartCard 
          title="Commandes Passées" 
          data={metrics.ordersPlaced} 
          type="line" 
          color="#3b82f6" 
          unit="Cmds"
          isDarkMode={isDarkMode}
        />

        {/* 2. Chiffre d'Affaires (AreaChart orange) */}
        <ChartCard 
          title="Chiffre d'Affaires" 
          data={metrics.revenue} 
          type="line" 
          color="#f59e0b" 
          unit="€"
          isDarkMode={isDarkMode}
        />

        {/* 3. Connexions (BarChart violet) */}
        <ChartCard 
          title="Connexions Actives" 
          data={metrics.connections} 
          type="bar" 
          color="#8b5cf6" 
          unit="Users"
          isDarkMode={isDarkMode}
        />

        {/* 4. Commandes Annulées (LineChart rouge) */}
        <ChartCard 
          title="Annulations" 
          data={metrics.ordersCanceled} 
          type="line" 
          color="#ef4444" 
          unit="Cmds"
          isDarkMode={isDarkMode}
        />

        {/* 5. Répartition Paiements (PieChart - Design Spécial) */}
        <div className={`p-6 rounded-2xl shadow-lg transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Modes de Paiement</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={metrics.paymentMethods.chartData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {metrics.paymentMethods.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Liste des Clients (Tableau Design) */}
      <div className={`rounded-2xl shadow-lg overflow-hidden transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="p-6 border-b border-gray-200/10">
          <h3 className="text-lg font-bold">Base de données Clients</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-sm uppercase tracking-wider ${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Ville</th>
                <th className="p-4 font-semibold">Solde</th>
                <th className="p-4 font-semibold">Note</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/10 text-sm">
              {clients.map(client => (
                <tr key={client.id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                  <td className="p-4 font-medium opacity-70">#{client.id}</td>
                  <td className="p-4">
                    <div className="font-bold">{client.name} {client.surname}</div>
                    <div className="text-xs opacity-60">{client.email}</div>
                  </td>
                  <td className="p-4">{client.city}</td>
                  <td className={`p-4 font-bold ${client.walletBalance > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {client.walletBalance} €
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">
                      {client.stars} ★
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                      className="text-blue-500 hover:text-blue-600 font-medium text-xs border border-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all"
                    >
                      {selectedClient === client.id ? 'Fermer' : 'Détails'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Détails Client (Expandable) */}
        {selectedClient && (
            <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                {/* Contenu des détails ici (comme dans ton code précédent) */}
                <p>Détails étendus pour le client #{selectedClient}...</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default DashboardClient;