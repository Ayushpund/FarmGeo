import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from './components/Header';
import { UploadComponent } from './components/UploadComponent';
import { MapComponent } from './components/MapComponent';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { useAppSelector } from './hooks/redux';
import { useTranslation } from './hooks/useTranslation';
import { Leaf, Users, Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { plants, userFilter } = useAppSelector((state) => state.plants);
  const { currentUserEmail } = useAppSelector((state) => state.settings);

  // Filter plants by user
  const filteredPlants = useMemo(() => {
    if (userFilter === 'mine' && currentUserEmail) {
      return plants.filter(p => p.emailId === currentUserEmail);
    }
    return plants;
  }, [plants, userFilter, currentUserEmail]);

  // Get unique farmers
  const uniqueFarmers = useMemo(() => {
    const emails = new Set(plants.map(p => p.emailId));
    return Array.from(emails);
  }, [plants]);

  // Calculate stats for current view
  const stats = useMemo(() => {
    const total = filteredPlants.length;
    const healthy = filteredPlants.filter(p => p.health === 'healthy' || !p.health).length;
    const warning = filteredPlants.filter(p => p.health === 'warning').length;
    const critical = filteredPlants.filter(p => p.health === 'critical').length;

    return { total, healthy, warning, critical };
  }, [filteredPlants]);



  return (
    <div className="space-y-6">
      {/* Hero Section - Professional Farm Theme */}
      <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-500 dark:from-green-800 dark:via-green-700 dark:to-green-600 rounded-xl p-8 text-white shadow-lg overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <Leaf size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">{t('myFarmOverview')}</h1>
          </div>
          <p className="text-green-50 max-w-3xl text-base leading-relaxed">
            {t('farmDescription')}
          </p>
        </div>

        {/* Subtle Decorative Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Enhanced Quick Stats - Professional */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white text-xl flex items-center gap-2">
            <Activity className="text-green-600 dark:text-green-400" size={24} />
            {t('quickStats')}
          </h3>
          {userFilter === 'all' && uniqueFarmers.length > 0 && (
            <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <Users size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">
                {uniqueFarmers.length} {uniqueFarmers.length === 1 ? t('farmer') : t('allFarmers')}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={userFilter === 'mine' ? t('myPlants') : t('totalPlants')}
            value={stats.total.toString()}
            icon={<Leaf size={24} />}
            color="green"
          />
          <StatCard
            label={t('healthy')}
            value={stats.healthy.toString()}
            icon={<CheckCircle size={24} />}
            color="emerald"
          />
          <StatCard
            label={t('warning')}
            value={stats.warning.toString()}
            icon={<AlertCircle size={24} />}
            color="amber"
          />
          <StatCard
            label={t('critical')}
            value={stats.critical.toString()}
            icon={<AlertCircle size={24} />}
            color="red"
          />
        </div>

        {/* Farmer Breakdown - Professional */}
        {userFilter === 'all' && uniqueFarmers.length > 1 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Users size={18} />
              {t('filterByFarmer')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {uniqueFarmers.map((email) => {
                const farmerPlants = plants.filter(p => p.emailId === email);
                return (
                  <div
                    key={email}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-600 dark:bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate flex-1">
                        {email}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {farmerPlants.length} {farmerPlants.length === 1 ? t('plant') : t('plants')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      <MapComponent />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'green' | 'emerald' | 'amber' | 'red';
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    emerald: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
    amber: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
    red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
  };

  return (
    <div className={`p-5 bg-gradient-to-br ${colorClasses[color]} rounded-lg border hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
        <div className={color === 'green' ? 'text-green-600 dark:text-green-400' :
          color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
            color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${color === 'green' ? 'text-green-700 dark:text-green-300' :
        color === 'emerald' ? 'text-emerald-700 dark:text-emerald-300' :
          color === 'amber' ? 'text-amber-700 dark:text-amber-300' :
            'text-red-700 dark:text-red-300'
        }`}>
        {value}
      </p>
    </div>
  );
};

const UploadPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Leaf size={40} className="text-green-600 dark:text-green-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            {t('addNewPlant')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('uploadDescription')}
        </p>
      </div>
      <UploadComponent />
    </div>
  );
};

const AnalyticsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp size={40} className="text-green-600 dark:text-green-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            {t('farmAnalytics')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('analyticsDescription')}
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
};

function App() {
  const { theme } = useAppSelector((state) => state.settings);
  const { t } = useTranslation();

  useEffect(() => {
    console.log('🌱 FarmGeoTag App Loaded Successfully!');

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('❌ Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
        <Header />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t-2 border-green-600 dark:border-green-500 py-6 mt-auto transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
              <Leaf size={16} className="text-green-600 dark:text-green-400" />
              <span>&copy; {new Date().getFullYear()} FarmGeoTag - {t('builtWithLove')}</span>
            </p>
          </div>
        </footer>

        <ToastContainer
          position="bottom-right"
          theme={theme === 'dark' ? 'dark' : 'light'}
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
