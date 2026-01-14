
import React, { useState } from 'react';
import { 
  ShieldAlert, UserX, AlertCircle, TrendingDown, 
  Search, Plus, Filter, Download, MoreVertical, Trash2, 
  Calendar, FileDown, GraduationCap, Printer, Edit2, X, MapPin, User
} from 'lucide-react';
import { AppState, DisciplineViolation, ViolationType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BKDashboardProps {
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const BKDashboard: React.FC<BKDashboardProps> = ({ data, onUpdate }) => {
  const [view, setView] = useState<'OVERVIEW' | 'INPUT' | 'RECORDS' | 'REPORTS' | 'VIOLATION_MASTER'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('2024-05');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // States for Violation Master
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [editingViolation, setEditingViolation] = useState<ViolationType | null>(null);

  const stats = [
    { label: 'Total Pelanggaran', value: (data.violations.length + 128).toString(), icon: <ShieldAlert className="text-red-600" />, sub: 'Tahun ini' },
    { label: 'Bulan Ini', value: (data.violations.length + 12).toString(), icon: <AlertCircle className="text-orange-600" />, sub: 'Kasus baru' },
    { label: 'Siswa Bermasalah', value: '4', icon: <UserX className="text-rose-600" />, sub: 'Point > 100' },
    { label: 'Tingkat Disiplin', value: '96%', icon: <TrendingDown className="text-green-600" />, sub: 'Sangat Baik' },
  ];

  const violationHistory = [
    { day: '01/05', cases: 2 },
    { day: '02/05', cases: 1 },
    { day: '03/05', cases: 5 },
    { day: '04/05', cases: 0 },
    { day: '05/05', cases: 3 },
    { day: '06/05', cases: 1 },
    { day: '07/05', cases: 4 },
  ];

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const typeId = formData.get('typeId') as string;
    const typeObj = data.violationTypes.find(v => v.id === typeId);

    const newViolation: DisciplineViolation = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: formData.get('studentId') as string,
      type: typeObj?.label || 'Lainnya',
      points: typeObj?.points || 0,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      reporter: formData.get('reporter') as string,
      classId: formData.get('classId') as string,
    };

    onUpdate({ ...data, violations: [newViolation, ...data.violations] });
    alert("Pelanggaran berhasil dicatat!");
    setView('OVERVIEW');
  };

  const handleSaveViolationMaster = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const label = formData.get('label') as string;
    const points = parseInt(formData.get('points') as string);

    const newData = { ...data };
    if (editingViolation) {
      newData.violationTypes = data.violationTypes.map(v => v.id === editingViolation.id ? { ...v, label, points } : v);
    } else {
      const newV: ViolationType = {
        id: Math.random().toString(36).substr(2, 9),
        label,
        points
      };
      newData.violationTypes = [...data.violationTypes, newV];
    }

    onUpdate(newData);
    setShowViolationModal(false);
    setEditingViolation(null);
  };

  const handleDeleteViolationMaster = (id: string) => {
    if (!window.confirm("Hapus master data pelanggaran ini?")) return;
    onUpdate({
      ...data,
      violationTypes: data.violationTypes.filter(v => v.id !== id)
    });
  };

  const filteredStudents = selectedClassId 
    ? data.students.filter(s => s.classId === selectedClassId)
    : data.students;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portal Bimbingan Konseling</h2>
          <p className="text-slate-500">Monitoring kedisiplinan dan pembinaan siswa.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setView('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'OVERVIEW' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('VIOLATION_MASTER')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'VIOLATION_MASTER' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Master Pelanggaran
          </button>
          <button 
            onClick={() => setView('RECORDS')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'RECORDS' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Data Kedisiplinan
          </button>
          <button 
            onClick={() => setView('INPUT')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'INPUT' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <Plus size={16} /> Input Pelanggaran
          </button>
          <button 
            onClick={() => setView('REPORTS')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'REPORTS' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Laporan BK
          </button>
        </div>
      </div>

      {view === 'OVERVIEW' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">{stat.icon}</div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-8">Statistik Pelanggaran (7 Hari Terakhir)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={violationHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="cases" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-8">Pelanggaran Terkini</h3>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2">
                {data.violations.length > 0 ? data.violations.map((v) => {
                  const student = data.students.find(s => s.id === v.studentId);
                  return (
                    <div key={v.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                        {v.points}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{student?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{v.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400">{v.date}</p>
                        <p className="text-[9px] text-blue-500 font-medium">Oleh: {v.reporter}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-center py-10 text-slate-400 italic">Belum ada pelanggaran hari ini.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'VIOLATION_MASTER' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Master Data Pelanggaran</h3>
            <button 
              onClick={() => { setEditingViolation(null); setShowViolationModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Tambah Jenis Pelanggaran
            </button>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                 <tr>
                   <th className="px-6 py-4">Jenis Pelanggaran</th>
                   <th className="px-6 py-4">Point</th>
                   <th className="px-6 py-4 text-right">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {data.violationTypes.map(vt => (
                   <tr key={vt.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-bold text-slate-900">{vt.label}</td>
                     <td className="px-6 py-4">
                       <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{vt.points} Poin</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingViolation(vt); setShowViolationModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteViolationMaster(vt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {view === 'RECORDS' && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Riwayat Kedisiplinan</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari siswa..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Point</th>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Ket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.violations.filter(v => data.students.find(s => s.id === v.studentId)?.name.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                <tr key={v.id} className="text-sm">
                  <td className="px-6 py-4 font-bold">{data.students.find(s => s.id === v.studentId)?.name}</td>
                  <td className="px-6 py-4">{v.type}</td>
                  <td className="px-6 py-4 text-red-600 font-bold">{v.points}</td>
                  <td className="px-6 py-4 font-medium text-blue-600">{v.reporter}</td>
                  <td className="px-6 py-4">{v.date}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{v.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'INPUT' && (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] border border-slate-200 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
            Form Input Pelanggaran
          </h3>
          <form onSubmit={handleAddViolation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pelapor (Guru)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="reporter" type="text" required placeholder="Masukkan nama guru pelapor..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Kelas</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    name="classId" 
                    required 
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kelas...</option>
                    {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Siswa</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select name="studentId" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500" disabled={!selectedClassId}>
                    <option value="">Cari Nama Siswa...</option>
                    {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Pelanggaran</label>
                <select name="typeId" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih Pelanggaran...</option>
                  {data.violationTypes.map(v => <option key={v.id} value={v.id}>{v.label} ({v.points} pts)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="date" type="date" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keterangan Tambahan</label>
                <textarea name="description" rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Jelaskan detail pelanggaran..."></textarea>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-xl shadow-red-100 transition-all">
              Simpan Data Kedisiplinan
            </button>
          </form>
        </div>
      )}

      {view === 'REPORTS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between no-print">
            <div className="flex gap-4">
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm" />
              <select className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm">
                <option>Semua Kelas</option>
                {data.classes.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"><Printer size={16} /> Cetak</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"><FileDown size={16} /> Export PDF</button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2rem] border border-slate-200 print:border-none shadow-sm">
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Laporan Kedisiplinan Siswa</h3>
              <p className="text-slate-500 text-sm mt-1">Bulan: {filterMonth}</p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] uppercase font-bold">
                  <th className="py-3 px-2">No</th>
                  <th className="py-3 px-2">Siswa</th>
                  <th className="py-3 px-2">Kelas</th>
                  <th className="py-3 px-2">Total Pelanggaran</th>
                  <th className="py-3 px-2">Total Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.students.slice(0, 10).map((s, idx) => {
                  const sv = data.violations.filter(v => v.studentId === s.id);
                  const totalPoints = sv.reduce((acc, curr) => acc + curr.points, 0);
                  const className = data.classes.find(c => c.id === s.classId)?.name;
                  return (
                    <tr key={s.id} className="text-sm">
                      <td className="py-4 px-2 text-slate-400">{idx + 1}</td>
                      <td className="py-4 px-2 font-bold">{s.name}</td>
                      <td className="py-4 px-2">{className}</td>
                      <td className="py-4 px-2">{sv.length} Kasus</td>
                      <td className="py-4 px-2 font-bold text-red-600">{totalPoints} Pts</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Master Pelanggaran */}
      {showViolationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowViolationModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                {editingViolation ? 'Edit' : 'Tambah'} Jenis Pelanggaran
              </h3>
              <button onClick={() => setShowViolationModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveViolationMaster} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pelanggaran</label>
                <input name="label" required defaultValue={editingViolation?.label} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Misal: Terlambat Masuk Kelas" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Poin Pelanggaran</label>
                <input name="points" type="number" required defaultValue={editingViolation?.points} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="0" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowViolationModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-100">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BKDashboard;
