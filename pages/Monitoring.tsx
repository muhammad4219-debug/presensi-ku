
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Eye, ShieldAlert, CheckCircle, Clock, Calendar as CalendarIcon, User, MapPin, Book, FileText, Edit3, X, Save, AlertTriangle } from 'lucide-react';
import { AppState, AttendanceStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface MonitoringProps {
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const Monitoring: React.FC<MonitoringProps> = ({ data, onUpdate }) => {
  const [showEditPrincipal, setShowEditPrincipal] = useState(false);
  const [principalName, setPrincipalName] = useState(data.principal.name);
  const [principalNip, setPrincipalNip] = useState(data.principal.nip);

  const handleSavePrincipal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...data,
      principal: {
        name: principalName,
        nip: principalNip
      }
    });
    setShowEditPrincipal(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayPresences = data.presences.filter(p => p.timestamp.startsWith(today));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Monitoring Kepala Sekolah</h2>
          <p className="text-slate-500">Supervisi real-time aktivitas harian sekolah.</p>
        </div>
        <button onClick={() => setShowEditPrincipal(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700">
          <Edit3 size={18} /> Ubah Nama KS
        </button>
      </div>

      {/* Principal Info Card */}
      <div className="bg-[#1e40af] p-8 rounded-[2rem] text-white shadow-xl flex items-center justify-between relative overflow-hidden">
        <div>
           <p className="text-xs font-black uppercase opacity-60 mb-2">Pejabat Kepala Sekolah Saat Ini</p>
           <h3 className="text-2xl font-black">{data.principal.name}</h3>
           <p className="text-sm font-medium opacity-80 mt-1">NIP. {data.principal.nip}</p>
        </div>
        <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
           <User size={48} className="text-white/40" />
        </div>
      </div>

      {/* Aktivitas Mengajar Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100"><h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Clock size={20} className="text-blue-500" /> Monitoring Aktivitas Guru</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold">
                <th className="px-8 py-4 w-16 text-center">No</th>
                <th className="px-8 py-4">Nama Guru</th>
                <th className="px-8 py-4">Kelas</th>
                <th className="px-8 py-4">Mapel</th>
                <th className="px-8 py-4 text-center">Jam</th>
                <th className="px-8 py-4">Waktu</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayPresences.map((p, idx) => {
                const teacher = data.teachers.find(t => t.id === p.teacherId);
                const classData = data.classes.find(c => c.id === p.classId);
                return (
                  <tr key={p.id} className="text-sm">
                    <td className="px-8 py-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="px-8 py-4 font-bold">{teacher?.name}</td>
                    <td className="px-8 py-4">{classData?.name}</td>
                    <td className="px-8 py-4">{p.subjectId}</td>
                    <td className="px-8 py-4 text-center">{p.period}</td>
                    <td className="px-8 py-4">{new Date(p.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-8 py-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">SUKSES</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring Pelanggaran Siswa */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100"><h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><AlertTriangle size={20} className="text-red-500" /> Monitoring Pelanggaran Siswa</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold">
                <th className="px-8 py-4 w-16 text-center">No</th>
                <th className="px-8 py-4">Nama Siswa</th>
                <th className="px-8 py-4">Kelas</th>
                <th className="px-8 py-4">Jenis Pelanggaran</th>
                <th className="px-8 py-4 text-center">Point</th>
                <th className="px-8 py-4">Tanggal</th>
                <th className="px-8 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.violations.map((v, idx) => {
                const student = data.students.find(s => s.id === v.studentId);
                const classData = data.classes.find(c => c.id === v.classId);
                return (
                  <tr key={v.id} className="text-sm">
                    <td className="px-8 py-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="px-8 py-4 font-bold">{student?.name}</td>
                    <td className="px-8 py-4 font-medium text-slate-600">{classData?.name || '-'}</td>
                    <td className="px-8 py-4 text-red-600 font-bold">{v.type}</td>
                    <td className="px-8 py-4 text-center font-black text-red-700">{v.points}</td>
                    <td className="px-8 py-4 text-xs">{v.date}</td>
                    <td className="px-8 py-4 text-xs text-slate-500 italic truncate max-w-[200px]" title={v.description}>{v.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEditPrincipal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEditPrincipal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Ubah Data Kepala Sekolah</h3>
            <form onSubmit={handleSavePrincipal} className="space-y-4">
              <input value={principalName} onChange={(e) => setPrincipalName(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border rounded-2xl" placeholder="Nama Kepala Sekolah" />
              <input value={principalNip} onChange={(e) => setPrincipalNip(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border rounded-2xl" placeholder="NIP" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowEditPrincipal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
