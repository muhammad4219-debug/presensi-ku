
import React, { useState, useEffect } from 'react';
import { AppState } from './types.ts';
import { loadDataFromCloud, syncDataToCloud } from './storage.ts';
import Layout from './components/Layout.tsx';
import PublicPresence from './pages/PublicPresence.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import BKDashboard from './pages/BKDashboard.tsx';
import MasterData from './pages/MasterData.tsx';
import Reports from './pages/Reports.tsx';
import Monitoring from './pages/Monitoring.tsx';
import BackupRestore from './pages/BackupRestore.tsx';
import Settings from './pages/Settings.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AppState | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePanel, setActivePanel] = useState<'PUBLIC' | 'ADMIN' | 'BK'>('PUBLIC');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Load awal dari Supabase
  useEffect(() => {
    const init = async () => {
      const cloudData = await loadDataFromCloud();
      setData(cloudData);
      setLastSync(new Date());
    };
    init();
  }, []);

  const handleUpdateData = async (newData: AppState) => {
    setData(newData);
    setIsSyncing(true);
    const success = await syncDataToCloud(newData);
    if (success) setLastSync(new Date());
    setIsSyncing(false);
  };

  const handleAddPresence = (presence: any) => {
    if (!data) return;
    const newData = {
      ...data,
      presences: [presence, ...data.presences]
    };
    handleUpdateData(newData);
  };

  const handleLoginSuccess = (role: 'ADMIN' | 'BK') => {
    setIsLoggedIn(true);
    setActivePanel(role);
    setActiveView(role === 'BK' ? 'bk_dashboard' : 'dashboard');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePanel('PUBLIC');
    setActiveView('dashboard');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-600 animate-pulse">Menghubungkan ke Cloud Database...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Cloud Sync Status Indicator */}
      <div className="fixed bottom-4 right-4 z-[9999] no-print">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg transition-all ${isSyncing ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
          {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : (lastSync ? <Cloud size={12} className="text-green-500" /> : <CloudOff size={12} className="text-red-500" />)}
          {isSyncing ? 'Menyimpan...' : (lastSync ? `Tersinkron: ${lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Offline')}
        </div>
      </div>

      {showLogin ? (
        <LoginPage onLogin={handleLoginSuccess} onBack={() => setShowLogin(false)} />
      ) : activePanel === 'PUBLIC' ? (
        <PublicPresence 
          data={data} 
          onAddPresence={handleAddPresence} 
          onOpenAdmin={() => setShowLogin(true)} 
        />
      ) : (
        <Layout 
          activePanel={activePanel} 
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={handleLogout}
        >
          {(() => {
            if (activePanel === 'ADMIN') {
              switch (activeView) {
                case 'dashboard': return <AdminDashboard data={data} onUpdate={handleUpdateData} />;
                case 'master_guru': return <MasterData type="teacher" data={data} onUpdate={handleUpdateData} />;
                case 'master_siswa': return <MasterData type="student" data={data} onUpdate={handleUpdateData} />;
                case 'master_kelas': return <MasterData type="class" data={data} onUpdate={handleUpdateData} />;
                case 'master_mapel': return <MasterData type="subject" data={data} onUpdate={handleUpdateData} />;
                case 'laporan': return <Reports data={data} />;
                case 'monitoring': return <Monitoring data={data} onUpdate={handleUpdateData} />;
                case 'backup': return <BackupRestore data={data} onUpdate={handleUpdateData} />;
                case 'settings': return <Settings data={data} onUpdate={handleUpdateData} />;
                default: return <AdminDashboard data={data} onUpdate={handleUpdateData} />;
              }
            }
            return <BKDashboard data={data} onUpdate={handleUpdateData} />;
          })()}
        </Layout>
      )}
    </div>
  );
};

export default App;
