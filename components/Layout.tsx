
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  BarChart3, 
  ShieldAlert, 
  Database,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  UserCircle,
  Eye,
  ChevronDown,
  Layers
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePanel: 'ADMIN' | 'BK' | 'PUBLIC';
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isDropdown?: boolean;
  sub?: { id: string; label: string; icon: React.ReactNode }[];
}

const Layout: React.FC<LayoutProps> = ({ children, activePanel, activeView, onViewChange, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMasterOpen, setMasterOpen] = useState(true);

  const adminMenu: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      id: 'master', 
      label: 'Master Data', 
      icon: <Layers size={20} />,
      isDropdown: true,
      sub: [
        { id: 'master_guru', label: 'Data Guru', icon: <Users size={16} /> },
        { id: 'master_siswa', label: 'Data Siswa', icon: <GraduationCap size={16} /> },
        { id: 'master_kelas', label: 'Data Kelas', icon: <BookOpen size={16} /> },
        { id: 'master_mapel', label: 'Data Mapel', icon: <BookOpen size={16} /> },
      ]
    },
    { id: 'laporan', label: 'Laporan', icon: <BarChart3 size={20} /> },
    { id: 'monitoring', label: 'Monitoring Kepsek', icon: <Eye size={20} /> },
    { id: 'backup', label: 'Backup & Restore', icon: <Database size={20} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={20} /> },
  ];

  const bkMenu: MenuItem[] = [
    { id: 'bk_dashboard', label: 'Dashboard BK', icon: <ShieldAlert size={20} /> },
    { id: 'discipline', label: 'Kedisiplinan', icon: <Users size={20} /> },
    { id: 'input_violation', label: 'Input Pelanggaran', icon: <ShieldAlert size={20} /> },
    { id: 'bk_reports', label: 'Laporan BK', icon: <BarChart3 size={20} /> },
  ];

  const menuItems = activePanel === 'ADMIN' ? adminMenu : bkMenu;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">S1</div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">SMAN 1</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Kwanyar Presence</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.isDropdown ? (
                <div>
                  <button
                    onClick={() => setMasterOpen(!isMasterOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all group ${activeView.startsWith('master_') ? 'bg-slate-800/50 text-white' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 group-hover:text-blue-400 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${isMasterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMasterOpen && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-slate-800">
                      {item.sub?.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => onViewChange(sub.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${activeView === sub.id ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all group ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : ''}`}
                >
                  <span className={`${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">Keluar Portal</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={20} className="text-slate-600" />
            </button>
            <div className="text-sm font-black text-slate-900 uppercase tracking-widest hidden sm:block">
              {activePanel} PORTAL
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">Petugas Aktif</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">SMAN 1 Kwanyar</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
              <UserCircle size={28} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
