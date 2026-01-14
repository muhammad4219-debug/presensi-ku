
import React, { useState } from 'react';
import { Database, Download, Upload, AlertTriangle, CheckCircle, ShieldCheck, History, Info } from 'lucide-react';
import { AppState } from '../types';
import { backupToSQL, createSystemSnapshot, restoreFromSnapshot } from '../storage';

interface BackupRestoreProps {
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({ data, onUpdate }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

  const handleBackup = () => {
    const sql = backupToSQL(data);
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sman1_backup_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    setStatus({ type: 'success', msg: 'File backup .sql berhasil diunduh.' });
  };

  const handleSnapshot = () => {
    createSystemSnapshot(data);
    setStatus({ type: 'success', msg: 'Snapshot Sistem Berhasil Dibuat! Versi ini sekarang terkunci di memori.' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleRestoreSnapshot = () => {
    const snap = restoreFromSnapshot();
    if (snap) {
      if (window.confirm("Kembalikan sistem ke versi snapshot yang terkunci? Data saat ini akan diganti.")) {
        onUpdate(snap);
        setStatus({ type: 'info', msg: 'Sistem berhasil dikembalikan ke versi snapshot.' });
      }
    } else {
      setStatus({ type: 'error', msg: 'Belum ada snapshot yang tersimpan.' });
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const match = content.match(/SET content = '(.+)'/);
        if (match && match[1]) {
          const restored = JSON.parse(atob(match[1]));
          onUpdate(restored);
          setStatus({ type: 'success', msg: 'Data berhasil direstore dari file .sql' });
        } else {
          throw new Error();
        }
      } catch (err) {
        setStatus({ type: 'error', msg: 'Gagal restore. File tidak valid.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Security & Backup</h2>
          <p className="text-slate-500">Kunci stabilitas aplikasi dan amankan data Anda.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
          <ShieldCheck className="text-green-600" size={20} />
          <span className="text-xs font-bold text-green-700 uppercase">Versi Stabil Terkunci</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SQL Backup */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Download size={32} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Export SQL</h3>
          <p className="text-xs text-slate-500 mb-6">Cadangkan data ke file fisik untuk disimpan di Flashdisk.</p>
          <button onClick={handleBackup} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Download .sql</button>
        </div>

        {/* System Snapshot */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <div className="px-2 py-0.5 bg-blue-600 text-[8px] text-white font-bold rounded-full">RECOMMENDED</div>
          </div>
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <ShieldCheck size={32} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">System Snapshot</h3>
          <p className="text-xs text-slate-500 mb-6">Kunci kondisi sistem saat ini ke memori permanen browser.</p>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button onClick={handleSnapshot} className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Buat Kunci</button>
            <button onClick={handleRestoreSnapshot} className="py-3 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-1"><History size={14}/> Reset</button>
          </div>
        </div>

        {/* Restore File */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <Upload size={32} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Restore Data</h3>
          <p className="text-xs text-slate-500 mb-6">Gunakan file .sql sebelumnya untuk memulihkan keadaan.</p>
          <label className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all cursor-pointer flex items-center justify-center gap-2">
            <Upload size={16}/> Pilih File
            <input type="file" accept=".sql" className="hidden" onChange={handleRestoreFile} />
          </label>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
            <Info size={48} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Panduan Keamanan Developer</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Untuk "mengunci" aplikasi secara total, silakan lakukan **Manual Folder Backup** secara berkala:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <p className="text-xs text-slate-300">Copy seluruh folder <code className="bg-white/10 px-1 rounded">htdocs/presensi</code> ke tempat lain.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <p className="text-xs text-slate-300">Ekspor database <code className="bg-white/10 px-1 rounded">sman1_kwanyar</code> dari phpMyAdmin.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mb-32 -mr-32 blur-3xl"></div>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-lg ${
          status.type === 'success' ? 'bg-green-500 text-white' : 
          status.type === 'info' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="font-bold text-sm">{status.msg}</span>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;
