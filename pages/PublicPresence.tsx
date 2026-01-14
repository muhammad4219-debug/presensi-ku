
import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, CheckCircle2, AlertCircle, MapPin, 
  User, Book, GraduationCap, Timer, FileText, 
  ShieldAlert, LogIn, CheckCircle, Save, Info
} from 'lucide-react';
import { AttendanceStatus, AppState, StudentAttendance } from '../types';
import { STATUS_COLORS } from '../constants';

interface PublicPresenceProps {
  data: AppState;
  onAddPresence: (presence: any) => void;
  onOpenAdmin: (role: 'ADMIN' | 'BK') => void;
}

const PublicPresence: React.FC<PublicPresenceProps> = ({ data, onAddPresence, onOpenAdmin }) => {
  const [time, setTime] = useState(new Date());
  const [formData, setFormData] = useState({
    grade: '' as 'X' | 'XI' | 'XII' | '',
    classId: '',
    teacherId: '',
    subjectId: '',
    period: '1',
    journal: ''
  });
  
  // State untuk menyimpan status absen tiap siswa di kelas terpilih
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter data berdasarkan pilihan
  const filteredClasses = data.classes.filter(c => c.grade === formData.grade);
  const selectedClass = data.classes.find(c => c.id === formData.classId);
  const filteredTeachers = data.teachers.filter(t => t.assignedClasses.includes(selectedClass?.name || ''));
  const selectedTeacher = data.teachers.find(t => t.id === formData.teacherId);
  
  // Ambil siswa berdasarkan kelas yang dipilih
  const studentsInClass = data.students.filter(s => s.classId === formData.classId);

  // Inisialisasi status siswa menjadi HADIR saat kelas berubah
  useEffect(() => {
    const initialStatuses: Record<string, AttendanceStatus> = {};
    studentsInClass.forEach(s => {
      initialStatuses[s.id] = AttendanceStatus.HADIR;
    });
    setStudentStatuses(initialStatuses);
  }, [formData.classId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.teacherId || !formData.subjectId) {
      setNotification({ type: 'error', msg: 'Mohon lengkapi konfigurasi pembelajaran.' });
      return;
    }

    // Fix: Explicitly cast status to AttendanceStatus to avoid 'unknown' type error during mapping
    const studentsAttendance: StudentAttendance[] = Object.entries(studentStatuses).map(([studentId, status]) => ({
      studentId,
      status: status as AttendanceStatus
    }));

    onAddPresence({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      studentsAttendance
    });

    setNotification({ type: 'success', msg: 'Data Presensi Berhasil Disimpan!' });
    // Reset Form
    setFormData({ grade: '', classId: '', teacherId: '', subjectId: '', period: '1', journal: '' });
    setStudentStatuses({});
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans pb-20">
      {/* Navbar Minimalis */}
      <nav className="bg-[#1e40af] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <GraduationCap className="text-[#1e40af]" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">E-Presensi</h1>
            <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">SMAN 1 Kwanyar</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onOpenAdmin('BK')} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-900/20">
            <ShieldAlert size={16} /> Pelanggaran
          </button>
          <button onClick={() => onOpenAdmin('ADMIN')} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
            <LogIn size={16} /> Login
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Card 1: Waktu & Tanggal */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hari & Tanggal Sistem</p>
              <p className="text-sm font-bold text-slate-900 uppercase">
                {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu Sekarang</p>
            <p className="text-2xl font-black text-blue-700 font-mono">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Card 2: Konfigurasi Pembelajaran */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-8">
            <SettingsIcon size={18} className="text-blue-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Konfigurasi Pembelajaran</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jenjang */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Jenjang Kelas</label>
              <div className="flex gap-2">
                {['X', 'XI', 'XII'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setFormData({...formData, grade: g as any, classId: '', teacherId: '', subjectId: ''})}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${formData.grade === g ? 'bg-blue-600 border-transparent text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilih Kelas */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pilih Kelas</label>
              <select 
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value, teacherId: '', subjectId: ''})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih...</option>
                {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Jam Ke */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Jam Ke</label>
              <select 
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Guru */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Guru Pengampu</label>
              <select 
                value={formData.teacherId}
                onChange={(e) => setFormData({...formData, teacherId: e.target.value, subjectId: ''})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.classId}
              >
                <option value="">Pilih Guru...</option>
                {filteredTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {/* Mapel */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mata Pelajaran</label>
              <select 
                value={formData.subjectId}
                onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.teacherId}
              >
                <option value="">Pilih...</option>
                {selectedTeacher?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2">
              <FileText size={12} /> Jurnal / Materi Pembelajaran
            </label>
            <textarea 
              rows={3}
              value={formData.journal}
              onChange={(e) => setFormData({...formData, journal: e.target.value})}
              placeholder="Tuliskan ringkasan materi atau kegiatan pembelajaran yang dilakukan hari ini..."
              className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all outline-none italic"
            />
          </div>
        </div>

        {/* Info Banner Biru (Selected Info) */}
        {(selectedTeacher || formData.subjectId) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1d4ed8] p-4 rounded-2xl flex items-center gap-4 text-white shadow-lg">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">Guru Pengampu</p>
                <p className="text-sm font-bold truncate">{selectedTeacher?.name || '-'}</p>
              </div>
            </div>
            <div className="bg-[#1d4ed8] p-4 rounded-2xl flex items-center gap-4 text-white shadow-lg">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Book size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">Mata Pelajaran</p>
                <p className="text-sm font-bold truncate">{formData.subjectId || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Daftar Siswa */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <UsersIcon size={18} className="text-green-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Presensi Peserta Didik</h3>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
              {studentsInClass.length} Siswa
            </span>
          </div>

          {!formData.classId ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Info size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold italic">Pilih kelas untuk menampilkan daftar siswa.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentsInClass.map((student, index) => (
                <div key={student.id} className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                    <div className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center font-mono text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {student.name}
                        <span className="text-[8px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded uppercase">{student.gender === 'L' ? 'LK' : 'PR'}</span>
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">NIS: 202400{index+1}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                    {[
                      { id: AttendanceStatus.HADIR, label: 'HADIR', color: 'bg-green-500' },
                      { id: AttendanceStatus.IZIN, label: 'IZIN', color: 'bg-orange-500' },
                      { id: AttendanceStatus.SAKIT, label: 'SAKIT', color: 'bg-blue-500' },
                      { id: AttendanceStatus.DISPENSASI, label: 'DISP', color: 'bg-purple-500' },
                      { id: AttendanceStatus.ALFA, label: 'ALFA', color: 'bg-red-500' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStatusChange(student.id, st.id)}
                        className={`group/btn relative flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
                          studentStatuses[student.id] === st.id 
                          ? `${st.color} border-transparent text-white shadow-lg scale-110` 
                          : 'bg-white border-slate-100 text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle size={14} className={studentStatuses[student.id] === st.id ? 'opacity-100' : 'opacity-20'} />
                        <span className="text-[8px] font-black mt-1 leading-none">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-8">
                <button 
                  onClick={handleSubmit}
                  className="w-full py-5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Save size={20} /> Simpan Presensi Sekarang
                </button>
                <p className="text-center text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-wider">Pastikan data telah benar sebelum melakukan penyimpanan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
          <div className={`px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Sistem Notifikasi</p>
              <p className="text-xs font-medium opacity-90">{notification.msg}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 text-center text-slate-400 pb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest">Digital Presence Engine v2.5</p>
        <p className="text-[9px] mt-1">SMAN 1 Kwanyar — Bangkalan, Jawa Timur</p>
      </footer>
    </div>
  );
};

const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UsersIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default PublicPresence;
