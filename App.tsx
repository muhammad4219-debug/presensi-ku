
import React, { useState, useEffect } from 'react';
import { loadDataFromCloud, syncDataToCloud } from './storage.ts';
import { INITIAL_DATA } from './constants.ts';
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
import { RefreshCw } from 'lucide-react';

const App = () => {
  const [data, setData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Fix: Explicitly type activePanel state to match Layout component props expectations ('ADMIN' | 'BK' | 'PUBLIC')
  const [activePanel, setActivePanel] = useState<'ADMIN' | 'BK' | 'PUBLIC'>('PUBLIC'); 
  const [activeView, setActiveView] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const cloudData = await loadDataFromCloud();
        setData(cloudData || INITIAL_DATA);
      } catch (e) {
        console.error("Gagal memuat data:", e);
        setData(INITIAL_DATA);
      }
    };
    init();
  }, []);

  const handleUpdateData = async (newData) => {
    setData(newData);
    setIsSyncing(true);
    try {
      await syncDataToCloud(newData);
    } catch (e) {
      console.error("Gagal sinkron:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddPresence = (presence) => {
    if (!data) return;
    const newData = { ...data, presences: [presence, ...data.presences] };
    handleUpdateData(newData);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">SMAN 1 Kwanyar</h2>
        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Memulai Sistem...</p>
      </div>
    );
  }

  if (showLogin) {
    return (
      <LoginPage 
        onLogin={(role) => { 
          setIsLoggedIn(true); 
          setActivePanel(role); 
          setActiveView(role === 'BK' ? 'bk_dashboard' : 'dashboard'); 
          setShowLogin(false); 
        }} 
        onBack={() => setShowLogin(false)} 
      />
    );
  }

  if (activePanel === 'PUBLIC') {
    return (
      <PublicPresence 
        data={data} 
        onAddPresence={handleAddPresence} 
        onOpenAdmin={(role) => { 
          setActivePanel(role); 
          setShowLogin(true); 
        }} 
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <AdminDashboard data={data} onUpdate={handleUpdateData} />;
      case 'bk_dashboard': return <BKDashboard data={data} onUpdate={handleUpdateData} />;
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
  };

  return (
    <Layout 
      activePanel={activePanel} 
      activeView={activeView} 
      onViewChange={setActiveView} 
      onLogout={() => { 
        setIsLoggedIn(false); 
        setActivePanel('PUBLIC'); 
      }}
    >
      <div className="relative">
        {isSyncing && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
            <RefreshCw size={14} className="animate-spin text-blue-400" /> SINKRONISASI...
          </div>
        )}
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
