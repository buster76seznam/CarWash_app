'use client';

import { useState, useEffect } from 'react';
import { Home, Car, Calculator, MapPin, History, CreditCard, QrCode, Plus, X, Bell, ChevronRight, TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

type View = 'dashboard' | 'fleet' | 'calculator' | 'stations' | 'history';

interface User {
  name: string;
  balance: number;
  points: number;
  qrCode: string;
}

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  spending: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'wash' | 'topup';
  amount: number;
  description: string;
}

interface BayStatus {
  id: number;
  status: 'occupied' | 'free';
  remainingTime?: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'promo';
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User>({ name: 'Jan Novák', balance: 340, points: 120, qrCode: 'OSCAR-12345' });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bays, setBays] = useState<BayStatus[]>([
    { id: 1, status: 'occupied', remainingTime: 4 },
    { id: 2, status: 'free' },
    { id: 3, status: 'free' },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', plate: '' });
  
  // Calculator state
  const [washTime, setWashTime] = useState(15);
  const [activeFoam, setActiveFoam] = useState(false);
  const [hotWax, setHotWax] = useState(false);
  const [undercarriage, setUndercarriage] = useState(false);
  const [osmosisRinse, setOsmosisRinse] = useState(false);

  // Initialize LocalStorage with dummy data
  useEffect(() => {
    const storedUser = localStorage.getItem('oscar_user');
    const storedVehicles = localStorage.getItem('oscar_vehicles');
    const storedTransactions = localStorage.getItem('oscar_transactions');

    if (!storedUser) {
      const initialUser: User = { name: 'Jan Novák', balance: 340, points: 120, qrCode: 'OSCAR-12345' };
      localStorage.setItem('oscar_user', JSON.stringify(initialUser));
      setUser(initialUser);
    } else {
      setUser(JSON.parse(storedUser));
    }

    if (!storedVehicles) {
      const initialVehicles: Vehicle[] = [
        { id: '1', name: 'Dodávka 1', plate: '1T2 3456', spending: 1250 },
        { id: '2', name: 'Octavia', plate: '2B3 4567', spending: 890 },
      ];
      localStorage.setItem('oscar_vehicles', JSON.stringify(initialVehicles));
      setVehicles(initialVehicles);
    } else {
      setVehicles(JSON.parse(storedVehicles));
    }

    if (!storedTransactions) {
      const initialTransactions: Transaction[] = [
        { id: '1', date: '2025-06-05', type: 'wash', amount: 40, description: 'Mytí s voskem' },
        { id: '2', date: '2025-06-03', type: 'topup', amount: 200, description: 'Dobití kreditu' },
        { id: '3', date: '2025-06-01', type: 'wash', amount: 20, description: 'Základní mytí' },
        { id: '4', date: '2025-05-28', type: 'topup', amount: 500, description: 'Dobití kreditu' },
      ];
      localStorage.setItem('oscar_transactions', JSON.stringify(initialTransactions));
      setTransactions(initialTransactions);
    } else {
      setTransactions(JSON.parse(storedTransactions));
    }

    // Simulate random notifications
    const randomNotifications: Notification[] = [
      { id: '1', message: 'Akce: Dnes od 18:00 do 20:00 šťastná hodinka – 10% bodů navíc!', type: 'promo' },
      { id: '2', message: 'Váš kredit byl úspěšně dobit.', type: 'success' },
    ];
    setNotifications(randomNotifications);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (user.name) localStorage.setItem('oscar_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('oscar_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('oscar_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleTopUp = (amount: number) => {
    const updatedUser = { ...user, balance: user.balance + amount };
    setUser(updatedUser);
    setShowPaymentModal(false);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'topup',
      amount,
      description: 'Dobití kreditu',
    };
    setTransactions([newTransaction, ...transactions]);
    
    setNotifications([{ id: Date.now().toString(), message: `Váš kredit byl úspěšně dobit o ${amount} Kč.`, type: 'success' }, ...notifications]);
  };

  const handleAddVehicle = () => {
    if (newVehicle.name && newVehicle.plate) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        name: newVehicle.name,
        plate: newVehicle.plate,
        spending: 0,
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({ name: '', plate: '' });
      setShowAddVehicleModal(false);
    }
  };

  const calculatePrice = () => {
    let price = Math.ceil(washTime / 5) * 20; // Base rate: 20 Kč per 5 minutes
    if (activeFoam) price += 15;
    if (hotWax) price += 25;
    if (undercarriage) price += 20;
    if (osmosisRinse) price += 10;
    return price;
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-cyan-500/20 text-cyan-400' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border flex items-start gap-3 animate-in slide-in-from-right ${
              notification.type === 'promo' 
                ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30' 
                : notification.type === 'success'
                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/30'
                : 'bg-gray-800/90 border-gray-700'
            }`}
          >
            <Bell size={18} className={notification.type === 'promo' ? 'text-purple-400' : notification.type === 'success' ? 'text-green-400' : 'text-cyan-400'} />
            <p className="text-sm flex-1">{notification.message}</p>
            <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-24 pt-6">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1">Vítejte v Oscar CarWash</h1>
              <p className="text-gray-400">Frenštát pod Radhoštěm</p>
            </div>

            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Loyalty Card</p>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Zůstatek</p>
                  <p className="text-3xl font-bold text-cyan-400">{user.balance} Kč</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Loyalty body</p>
                    <p className="text-lg font-bold text-white">{user.points} pts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">QR kód</p>
                  <p className="text-sm font-mono text-cyan-400">{user.qrCode}</p>
                </div>
              </div>

              {/* Rewards Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Průběh k dalšímu mytí zdarma</span>
                  <span className="text-cyan-400 font-medium">{user.points}/200 pts</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(user.points / 200) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">200 bodů = 1 zdarma mytí (20 Kč)</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
                >
                  <CreditCard size={20} />
                  Dobít kredit
                </button>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
                >
                  <QrCode size={20} />
                  Zobrazit QR kód
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <History size={20} className="text-cyan-400" />
                Nedávná aktivita
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'wash' ? 'bg-blue-500/20' : 'bg-green-500/20'
                      }`}>
                        {transaction.type === 'wash' ? (
                          <Car size={20} className="text-blue-400" />
                        ) : (
                          <CreditCard size={20} className="text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-gray-500 text-sm">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${transaction.type === 'wash' ? 'text-red-400' : 'text-green-400'}`}>
                      {transaction.type === 'wash' ? '-' : '+'}{transaction.amount} Kč
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentView('history')}
                className="w-full mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center justify-center gap-1"
              >
                Zobrazit celou historii
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentView === 'fleet' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Users size={28} className="text-purple-400" />
                Flotilní portál
              </h1>
              <p className="text-gray-400">Správa firemních vozidel</p>
            </div>

            {/* Fleet Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-sm mb-1">Registrovaná vozidla</p>
                <p className="text-3xl font-bold text-white">{vehicles.length}</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-sm mb-1">Měsíční útrata</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {vehicles.reduce((sum, v) => sum + v.spending, 0)} Kč
                </p>
              </div>
            </div>

            {/* Monthly Budget Tracker */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-cyan-400" />
                Měsíční rozpočet
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Čerpáno</span>
                    <span className="text-white font-medium">
                      {vehicles.reduce((sum, v) => sum + v.spending, 0)} / 5000 Kč
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((vehicles.reduce((sum, v) => sum + v.spending, 0) / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle List */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Car size={20} className="text-cyan-400" />
                  Vozidla ve flotile
                </h3>
                <button
                  onClick={() => setShowAddVehicleModal(true)}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                >
                  <Plus size={16} />
                  Přidat vozidlo
                </button>
              </div>
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Car size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{vehicle.name}</p>
                        <p className="text-gray-500 text-sm">{vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">{vehicle.spending} Kč</p>
                      <p className="text-gray-500 text-xs">tento měsíc</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Calculator size={28} className="text-green-400" />
                Kalkulačka mytí
              </h1>
              <p className="text-gray-400">Odhad cen za mytí</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              {/* Time Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Čas mytí</label>
                  <span className="text-cyan-400 font-bold">{washTime} min</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={washTime}
                  onChange={(e) => setWashTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Feature Toggles */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeFoam ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                      <span className="text-2xl">🫧</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Aktivní pěna</p>
                      <p className="text-gray-500 text-sm">+15 Kč</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeFoam}
                    onChange={(e) => setActiveFoam(e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hotWax ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Horký vosk</p>
                      <p className="text-gray-500 text-sm">+25 Kč</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hotWax}
                    onChange={(e) => setHotWax(e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${undercarriage ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Mytí podvozku</p>
                      <p className="text-gray-500 text-sm">+20 Kč</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={undercarriage}
                    onChange={(e) => setUndercarriage(e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${osmosisRinse ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                      <span className="text-2xl">💧</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Oplach osmózou</p>
                      <p className="text-gray-500 text-sm">+10 Kč</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={osmosisRinse}
                    onChange={(e) => setOsmosisRinse(e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-1">Odhadovaná cena</p>
                <p className="text-5xl font-bold text-cyan-400 mb-2">{calculatePrice()} Kč</p>
                <p className="text-gray-500 text-sm">Základní sazba: 20 Kč / 5 min</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'stations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <MapPin size={28} className="text-orange-400" />
                Stav mycích stanic
              </h1>
              <p className="text-gray-400">Frenštát pod Radhoštěm</p>
            </div>

            {/* Bay Status */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Stav boxů</h3>
              <div className="space-y-3">
                {bays.map((bay) => (
                  <div
                    key={bay.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      bay.status === 'occupied'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        bay.status === 'occupied' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        {bay.status === 'occupied' ? (
                          <Clock size={24} className="text-red-400" />
                        ) : (
                          <CheckCircle2 size={24} className="text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">Box {bay.id}</p>
                        <p className={`text-sm ${bay.status === 'occupied' ? 'text-red-400' : 'text-green-400'}`}>
                          {bay.status === 'occupied' ? `Obsazeno - zbývá ${bay.remainingTime} min` : 'Volno'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      bay.status === 'occupied' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-orange-400" />
                Mapa lokace
              </h3>
              <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <MapPin size={48} className="text-orange-400 mx-auto mb-2" />
                  <p className="text-gray-400">Oscar CarWash</p>
                  <p className="text-gray-500 text-sm">Frenštát pod Radhoštěm</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <History size={28} className="text-blue-400" />
                Historie transakcí
              </h1>
              <p className="text-gray-400">Přehled všech mytí a dobití</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        transaction.type === 'wash' ? 'bg-blue-500/20' : 'bg-green-500/20'
                      }`}>
                        {transaction.type === 'wash' ? (
                          <Car size={24} className="text-blue-400" />
                        ) : (
                          <CreditCard size={24} className="text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-gray-500 text-sm">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${transaction.type === 'wash' ? 'text-red-400' : 'text-green-400'}`}>
                      {transaction.type === 'wash' ? '-' : '+'}{transaction.amount} Kč
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-lg border-t border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavItem view="dashboard" icon={Home} label="Dashboard" />
          <NavItem view="fleet" icon={Users} label="Flotila" />
          <NavItem view="calculator" icon={Calculator} label="Kalkulačka" />
          <NavItem view="stations" icon={MapPin} label="Stanice" />
          <NavItem view="history" icon={History} label="Historie" />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Dobít kredit</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleTopUp(amount)}
                  className="bg-gray-800 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-gray-700 rounded-xl p-4 transition-all"
                >
                  <p className="text-2xl font-bold text-white">{amount}</p>
                  <p className="text-gray-400 text-sm">Kč</p>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl border border-gray-700 flex items-center justify-center gap-2 transition-all">
                <span className="text-xl"></span>
                Apple Pay
              </button>
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all">
                Platba kartou
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">QR kód</h2>
              <button onClick={() => setShowQrModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="bg-white rounded-xl p-6 mb-4">
              <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                <QrCode size={96} className="text-gray-800" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Skenujte na terminálu</p>
            <p className="text-cyan-400 font-mono font-bold">{user.qrCode}</p>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Přidat vozidlo</h2>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Název vozidla</label>
                <input
                  type="text"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  placeholder="např. Dodávka 2"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-white font-medium mb-2 block">SPZ</label>
                <input
                  type="text"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  placeholder="např. 1A2 3456"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={handleAddVehicle}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
              >
                Přidat vozidlo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
