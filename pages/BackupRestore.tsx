import React, { useState } from 'react';
import { Database, Download, Upload, AlertTriangle, CheckCircle, ShieldCheck, History, Info, Cloud, Zap, Globe, FileJson, Share2 } from 'lucide-react';
import { AppState } from '../types';
import { backupToSQL, createSystemSnapshot, restoreFromSnapshot, exportDatabaseToJson } from '../storage';

interface BackupRestoreProps {
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({ data, onUpdate }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

  const handleExportJson = () => {
    exportDatabaseToJson(data);
    setStatus({ type: 'success', msg: 'Database berhasil diekspor ke format JSON!' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSnapshot = () => {
    createSystemSnapshot(data);
    setStatus({ type: 'success', msg: 'Snapshot lokal berhasil dibuat!' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleRestoreSnapshot = () => {
    const snap = restoreFromSnapshot();
    if (snap) {
      if (window.confirm("Restore ke snapshot stabil di browser ini?")) {
        onUpdate(snap);
        setStatus({ type: 'info', msg: 'Data berhasil dipulihkan.' });
      }
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const restored = JSON.parse(content);
        onUpdate(restored);
        setStatus({ type: 'success', msg: 'Database berhasil diimpor dari file!' });
      } catch (err) {
        setStatus({ type: 'error', msg: 'File tidak valid. Pastikan formatnya .json' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Database & File</h2>
          <p className="text-slate-500">Kelola data sekolah Anda tanpa perlu server XAMPP.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-[10px] font-black uppercase tracking-widest">
          No Server Required
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100">
              <FileJson size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Database Portabel (.JSON)</h3>
            <p className="text-slate-500 leading-relaxed">
              Ini adalah cara termudah mengelola data. Klik <b>Ekspor Database</b> untuk menyimpan seluruh data sekolah dalam satu file kecil. 
              Anda bisa memindahkan file ini ke laptop lain dan melakukan <b>Impor Data</b>.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <button onClick={handleExportJson} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all">
                <Download size={18} /> Ekspor Database
              </button>
              <label className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer">
                <Upload size={18} /> Impor Data
                <input type="file" accept=".json" className="hidden" onChange={handleRestoreFile} />
              </label>
            </div>
          </div>
          <div className="w-full md:w-72 p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Info size={14}/> Kenapa JSON?
            </div>
            <ul className="space-y-3">
              <li className="text-[11px] text-slate-600 flex gap-2 font-medium">
                <CheckCircle size={14} className="text-green-500 shrink-0"/> Tidak butuh XAMPP/MySQL
              </li>
              <li className="text-[11px] text-slate-600 flex gap-2 font-medium">
                <CheckCircle size={14} className="text-green-500 shrink-0"/> Sangat ringan & cepat
              </li>
              <li className="text-[11px] text-slate-600 flex gap-2 font-medium">
                <CheckCircle size={14} className="text-green-500 shrink-0"/> Bisa dibuka di HP/Laptop
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <ShieldCheck size={32} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Simpan ke Memori Browser</h3>
          <p className="text-xs text-slate-500 mb-6">Membuat "foto" kondisi data saat ini di dalam browser Anda.</p>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button onClick={handleSnapshot} className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Buat Snapshot</button>
            <button onClick={handleRestoreSnapshot} className="py-3 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-1"><History size={14}/> Restore</button>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
            <Share2 size={32} />
          </div>
          <h3 className="font-bold mb-2">Pindahkan Data</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Ingin pindah laptop? Cukup Ekspor ke JSON, kirim filenya lewat WA atau Email, lalu Impor di laptop baru. Tidak perlu repot ekspor-impor SQL di XAMPP!
          </p>
          <button onClick={() => setStatus({type: 'info', msg: 'Fitur Share via Link segera hadir!'})} className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Salin Tautan Backup</button>
        </div>
      </div>

      {status && (
        <div className={`fixed bottom-10 right-10 p-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-right-10 ${
          status.type === 'success' ? 'bg-green-600 text-white' : 
          status.type === 'info' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="font-bold text-sm">{status.msg}</span>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;
