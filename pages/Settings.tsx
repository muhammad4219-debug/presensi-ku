
import React, { useState } from 'react';
import { User, Lock, Mail, Save, Key, ShieldCheck, UserCircle } from 'lucide-react';
import { AppState } from '../types';

interface SettingsProps {
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const Settings: React.FC<SettingsProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'guru' | 'bk'>('admin');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h2>
        <p className="text-slate-500">Kelola kredensial akses untuk setiap level pengguna.</p>
      </div>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
        <button 
          onClick={() => setActiveTab('admin')}
          className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <ShieldCheck size={18} /> Admin
        </button>
        <button 
          onClick={() => setActiveTab('guru')}
          className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'guru' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <User size={18} /> Guru
        </button>
        <button 
          onClick={() => setActiveTab('bk')}
          className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'bk' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UserCircle size={18} /> Guru BK
        </button>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-full -z-0"></div>
        
        <form onSubmit={handleSave} className="space-y-6 relative z-10 max-w-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <UserCircle size={40} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 capitalize">Profil Akun {activeTab}</h4>
              <p className="text-xs text-slate-500 font-medium">Informasi Login & Keamanan</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  defaultValue={activeTab} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
            >
              <Save size={20} /> Simpan Perubahan
            </button>
          </div>
        </form>

        {success && (
          <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <ShieldCheck size={20} />
            <span className="font-bold">Pengaturan berhasil diperbarui!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
