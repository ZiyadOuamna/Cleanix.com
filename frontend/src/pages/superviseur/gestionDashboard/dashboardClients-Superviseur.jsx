import React, { useContext, useState, useEffect } from 'react';
import { SuperviseurContext } from '../superviseurContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { User, MapPin, Calendar, CreditCard, ArrowLeft, Search, TrendingUp, CalendarDays } from 'lucide-react';

// --- 1. TOOLTIP PERSONNALISÉ ---
const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-lg shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{label}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].color }}>
          {payload[0].value.toLocaleString()} {unit}
        </p>
      </div>
    );
  }
  return null;
};

// --- 2. COMPOSANT CARTE CLASSIQUE ---
const FilterableChartCard = ({ title, data, type = "line", color = "#3b82f6", unit = "", isDarkMode }) => {
  const [period, setPeriod] = useState('monthly');

  if (!data) return null;
  const currentData = data[period] || { total: 0, chartData: [] };

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentData.total.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className={`p-1.5 rounded-md ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <CalendarDays size={14} />
          </button>
          <div className={`flex p-0.5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {['daily', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all uppercase ${
                  period === p 
                    ? (isDarkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600')
                }`}
              >
                {p === 'daily' ? 'J' : p === 'monthly' ? 'M' : 'A'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[160px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={currentData.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#9ca3af' : '#9ca3af', fontSize: 10 }} dy={10} />
              <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} cursor={{ stroke: isDarkMode ? '#4b5563' : '#e5e7eb', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </LineChart>
          ) : (
            <BarChart data={currentData.chartData}>
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

// --- 3. COMPOSANT PAIEMENT (Format Vertical Compact) ---
const PaymentDistributionCard = ({ data, isDarkMode }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const mostUsed = sortedData[0];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between h-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="mb-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Répartition Paiements</h3>
      </div>
      
      {/* Camembert */}
      <div className="h-[120px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip unit="%" isDarkMode={isDarkMode} />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre du Donut */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total</span>
        </div>
      </div>

      {/* Stats Compactes */}
      <div className="mt-2 space-y-2">
         <div className="flex justify-between items-center text-xs">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Méthode:</span>
            <span className="font-bold text-blue-500">{mostUsed.name} ({mostUsed.value}%)</span>
         </div>
         <div className="flex justify-between items-center text-xs">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Diversité:</span>
            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{data.length} Types</span>
         </div>
         {/* Légende rapide */}
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

// --- 4. DETAILS CLIENT ---
const ClientAnalytics = ({ client, onBack, isDarkMode }) => {
  const generateMock = (max) => ({
    daily: { total: Math.floor(max/30), chartData: Array.from({length:7}, (_,i)=>({name:`J-${i}`, value: Math.floor(Math.random()*(max/30))})) },
    monthly: { total: max, chartData: Array.from({length:12}, (_,i)=>({name:`M-${i}`, value: Math.floor(Math.random()*(max/12))})) },
    yearly: { total: max*12, chartData: Array.from({length:5}, (_,i)=>({name:`202${i}`, value: Math.floor(Math.random()*max)})) },
  });
  const clientStats = { spending: generateMock(client.walletBalance), orders: generateMock(15) };

  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
        <ArrowLeft size={20} /> Retour à la liste
      </button>
      <div className={`p-6 mb-8 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl text-white font-bold shadow-md">
            {client.name.charAt(0)}{client.surname.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.name} {client.surname}</h2>
            <div className={`flex gap-4 mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="flex items-center gap-1"><MapPin size={14}/> {client.city}</span>
              <span className="flex items-center gap-1"><CreditCard size={14}/> {client.email}</span>
            </div>
          </div>
          <div className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-lg border border-blue-100">Solde: {client.walletBalance} DH</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FilterableChartCard title="Dépenses" data={clientStats.spending} type="line" color="#10b981" unit="DH" isDarkMode={isDarkMode} />
        <FilterableChartCard title="Fréquence" data={clientStats.orders} type="bar" color="#f59e0b" unit="Cmds" isDarkMode={isDarkMode} />
      </div>
      <div className={`rounded-2xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="p-6 border-b border-gray-200/10"><h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historique</h3></div>
        <div className="p-6">
           <ul className="space-y-3">
             {client.orderHistory.map(order => (
               <li key={order.id} className={`p-3 rounded-lg flex justify-between items-center ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div><span className="font-bold block text-sm">Cmd #{order.id}</span><span className="text-xs opacity-70">{order.freelancer}</span></div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
};

// --- 5. LISTE CLIENTS ---
const ClientList = ({ clients, onSelect, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.surname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="p-6 border-b border-gray-200/10 flex justify-between items-center gap-4">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Base Clients ({clients.length})</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10"><tr className={`text-xs uppercase tracking-wider ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}><th className="p-4">Client</th><th className="p-4">Ville</th><th className="p-4">Solde</th><th className="p-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-gray-200/10 text-sm">
            {filteredClients.map(client => (
              <tr key={client.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'}`}>
                <td className="p-4"><div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.name} {client.surname}</div><div className="text-xs opacity-60">{client.email}</div></td>
                <td className="p-4">{client.city}</td>
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

// --- 6. DASHBOARD PRINCIPAL ---
function DashboardClient() {
  const { isDarkMode } = useContext(SuperviseurContext);
  const [selectedClient, setSelectedClient] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [clients, setClients] = useState([]);

  const generateFullMetric = (dailyTotal, monthlyTotal, yearlyTotal) => ({
    daily: { total: dailyTotal, chartData: Array.from({length: 12}, (_, i) => ({ name: `${8+i}h`, value: Math.floor(dailyTotal/10 + Math.random() * (dailyTotal/5)) })) },
    monthly: { total: monthlyTotal, chartData: Array.from({length: 30}, (_, i) => ({ name: `J${i+1}`, value: Math.floor(monthlyTotal/25 + Math.random() * (monthlyTotal/10)) })) },
    yearly: { total: yearlyTotal, chartData: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({ name: m, value: Math.floor(yearlyTotal/10 + Math.random() * (yearlyTotal/5)) })) }
  });

  useEffect(() => {
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
      { id: 1, name: 'Ziyad', surname: 'Ouamna', email: 'ziyad@cleanix.com', registrationDate: '2025-01-10', city: 'Casablanca', stars: 5, walletBalance: 250, orderHistory: [{id: 101, freelancer: 'Ahmed', status: 'Completed'}] },
      { id: 2, name: 'Sara', surname: 'Benali', email: 'sara@gmail.com', registrationDate: '2025-02-15', city: 'Marrakech', stars: 4.5, walletBalance: 45, orderHistory: [{id: 102, freelancer: 'Karim', status: 'In Progress'}] },
    ]);
  }, []);

  const refreshData = () => window.location.reload();

  if (!metrics) return <div className="p-10 text-center animate-pulse">Chargement Cleanix...</div>;

  return (
    <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f0fafe] text-gray-800'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Dashboard Clients</h1>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Aperçu des performances en temps réel.</p>
        </div>
        <button onClick={refreshData} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-xs font-bold flex items-center gap-2">
          <TrendingUp size={14}/> Actualiser
        </button>
      </div>

      {/* LIGNE 1 : INDICATEURS COMMANDES (3 Colonnes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FilterableChartCard title="Commandes Passées" data={metrics.ordersPlaced} type="line" color="#3b82f6" unit="Cmds" isDarkMode={isDarkMode} />
        <FilterableChartCard title="Commandes Payées" data={metrics.ordersPaid} type="line" color="#10b981" unit="Cmds" isDarkMode={isDarkMode} />
        <FilterableChartCard title="Commandes Annulées" data={metrics.ordersCanceled} type="bar" color="#ef4444" unit="Cmds" isDarkMode={isDarkMode} />
      </div>

      {/* LIGNE 2 : FINANCES & TRAFIC (3 Colonnes : Revenu | Connexion | Paiement) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <FilterableChartCard title="Chiffre d'Affaires" data={metrics.revenue} type="line" color="#f59e0b" unit="DH" isDarkMode={isDarkMode} />
        <FilterableChartCard title="Connexions Utilisateurs" data={metrics.connections} type="line" color="#8b5cf6" unit="Visites" isDarkMode={isDarkMode} />
        <PaymentDistributionCard data={metrics.paymentMethods} isDarkMode={isDarkMode} />
      </div>

      {/* SECTION CLIENTS */}
      <div className="animate-fade-in border-t border-gray-200/20 pt-8">
        <div className="flex items-center gap-2 mb-6">
           <User className="text-blue-500"/> 
           <h2 className="text-lg font-bold">Gestion des Clients</h2>
        </div>
        {selectedClient ? (
          <ClientAnalytics client={selectedClient} onBack={() => setSelectedClient(null)} isDarkMode={isDarkMode} />
        ) : (
          <ClientList clients={clients} onSelect={(client) => setSelectedClient(client)} isDarkMode={isDarkMode} />
        )}
      </div>

    </div>
  );
}

export default DashboardClient;