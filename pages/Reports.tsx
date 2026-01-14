
import React, { useState } from 'react';
import { 
  Calendar, Filter, FileText, Download, Printer, 
  ChevronLeft, ChevronRight, Search, FileDown
} from 'lucide-react';
import { AppState, AttendanceStatus, StudentAttendance } from '../types';
import { STATUS_COLORS } from '../constants';

interface ReportsProps {
  data: AppState;
}

const Reports: React.FC<ReportsProps> = ({ data }) => {
  const [reportType, setReportType] = useState<'harian' | 'bulanan'>('harian');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));
  const [filterClassId, setFilterClassId] = useState('');

  const selectedClass = data.classes.find(c => c.id === filterClassId);
  const studentsInClass = filterClassId ? data.students.filter(s => s.classId === filterClassId) : [];

  // Data presensi yang terfilter
  const filteredPresences = data.presences.filter(p => {
    const pDate = new Date(p.timestamp).toISOString().split('T')[0];
    const matchesDate = reportType === 'harian' ? pDate === filterDate : pDate.startsWith(filterMonth);
    const matchesClass = filterClassId ? p.classId === filterClassId : true;
    return matchesDate && matchesClass;
  });

  const handlePrint = () => {
    window.print();
  };

  // Logic Laporan Harian: Baris per Siswa per Jam Ke + Guru + Mapel
  const dailyReportRows: any[] = [];
  if (reportType === 'harian' && filterClassId) {
    filteredPresences.forEach(record => {
      const teacher = data.teachers.find(t => t.id === record.teacherId);
      record.studentsAttendance.forEach(sa => {
        const student = data.students.find(s => s.id === sa.studentId);
        if (student) {
          dailyReportRows.push({
            studentName: student.name,
            period: record.period,
            teacherName: teacher?.name || '-',
            subjectName: record.subjectId,
            status: sa.status
          });
        }
      });
    });
  }

  // Logic Laporan Bulanan
  const monthlyRecap: any[] = [];
  let totalH = 0, totalI = 0, totalS = 0, totalD = 0, totalA = 0;

  if (reportType === 'bulanan' && filterClassId) {
    studentsInClass.forEach(student => {
      let h = 0, i = 0, s = 0, d = 0, a = 0;
      filteredPresences.forEach(record => {
        const attendance = record.studentsAttendance.find(sa => sa.studentId === student.id);
        if (attendance) {
          if (attendance.status === AttendanceStatus.HADIR) h++;
          else if (attendance.status === AttendanceStatus.IZIN) i++;
          else if (attendance.status === AttendanceStatus.SAKIT) s++;
          else if (attendance.status === AttendanceStatus.DISPENSASI) d++;
          else if (attendance.status === AttendanceStatus.ALFA) a++;
        }
      });
      monthlyRecap.push({ studentName: student.name, h, i, s, d, a });
      totalH += h; totalI += i; totalS += s; totalD += d; totalA += a;
    });
  }

  const grandTotal = totalH + totalI + totalS + totalD + totalA;
  const presencePercentage = grandTotal > 0 ? ((totalH / grandTotal) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan Kehadiran</h2>
          <p className="text-slate-500">Rekapitulasi data presensi siswa SMAN 1 Kwanyar.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Cetak Laporan
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm no-print">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => {setReportType('harian'); setFilterClassId('');}} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportType === 'harian' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Harian</button>
            <button onClick={() => {setReportType('bulanan'); setFilterClassId('');}} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportType === 'bulanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Bulanan</button>
          </div>
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {reportType === 'harian' ? (
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm" />
            ) : (
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="px-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm" />
            )}
            <select value={filterClassId} onChange={(e) => setFilterClassId(e.target.value)} className="px-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm">
              <option value="">Pilih Kelas...</option>
              {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden print:border-none">
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900 uppercase">Laporan Kehadiran Siswa {reportType === 'harian' ? 'Harian' : 'Bulanan'}</h3>
          <p className="text-slate-500 text-sm mt-1 uppercase font-bold">SMAN 1 Kwanyar — Bangkalan</p>
          <p className="text-xs text-slate-400 mt-1">Kelas: {selectedClass?.name || '-'} | Periode: {reportType === 'harian' ? filterDate : filterMonth}</p>
        </div>

        <div className="p-8">
          {reportType === 'harian' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] uppercase font-black">
                  <th className="py-3 px-2 w-10 text-center">No</th>
                  <th className="py-3 px-2">Nama Siswa</th>
                  <th className="py-3 px-2 text-center">Jam</th>
                  <th className="py-3 px-2">Guru</th>
                  <th className="py-3 px-2">Mapel</th>
                  <th className="py-3 px-2 text-center">H</th>
                  <th className="py-3 px-2 text-center">I</th>
                  <th className="py-3 px-2 text-center">S</th>
                  <th className="py-3 px-2 text-center">D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyReportRows.map((row, idx) => (
                  <tr key={idx} className="text-[11px]">
                    <td className="py-2 px-2 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-2 font-bold">{row.studentName}</td>
                    <td className="py-2 px-2 text-center">{row.period}</td>
                    <td className="py-2 px-2">{row.teacherName}</td>
                    <td className="py-2 px-2">{row.subjectName}</td>
                    <td className="py-2 px-2 text-center">{row.status === AttendanceStatus.HADIR ? '✔' : ''}</td>
                    <td className="py-2 px-2 text-center">{row.status === AttendanceStatus.IZIN ? '✔' : ''}</td>
                    <td className="py-2 px-2 text-center">{row.status === AttendanceStatus.SAKIT ? '✔' : ''}</td>
                    <td className="py-2 px-2 text-center">{row.status === AttendanceStatus.DISPENSASI ? '✔' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] uppercase font-black">
                    <th className="py-3 px-2 w-12 text-center">No</th>
                    <th className="py-3 px-2">Nama Siswa</th>
                    <th className="py-3 px-2 text-center">HADIR</th>
                    <th className="py-3 px-2 text-center">IZIN</th>
                    <th className="py-3 px-2 text-center">SAKIT</th>
                    <th className="py-3 px-2 text-center">DISPEN</th>
                    <th className="py-3 px-2 text-center">ALFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyRecap.map((row, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className="py-3 px-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-2 font-bold">{row.studentName}</td>
                      <td className="py-3 px-2 text-center">{row.h}</td>
                      <td className="py-3 px-2 text-center">{row.i}</td>
                      <td className="py-3 px-2 text-center">{row.s}</td>
                      <td className="py-3 px-2 text-center">{row.d}</td>
                      <td className="py-3 px-2 text-center">{row.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filterClassId && (
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Rekapitulasi Kolektif Kelas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-200"><p className="text-[8px] font-bold text-slate-400 uppercase">Hadir</p><p className="text-lg font-black text-green-600">{totalH}</p></div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200"><p className="text-[8px] font-bold text-slate-400 uppercase">Izin</p><p className="text-lg font-black text-blue-600">{totalI}</p></div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200"><p className="text-[8px] font-bold text-slate-400 uppercase">Sakit</p><p className="text-lg font-black text-yellow-600">{totalS}</p></div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200"><p className="text-[8px] font-bold text-slate-400 uppercase">Dispen</p><p className="text-lg font-black text-purple-600">{totalD}</p></div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200"><p className="text-[8px] font-bold text-slate-400 uppercase">Alfa</p><p className="text-lg font-black text-red-600">{totalA}</p></div>
                    <div className="p-3 bg-blue-600 rounded-xl border border-blue-700 text-white"><p className="text-[8px] font-bold text-blue-100 uppercase">Presentase</p><p className="text-lg font-black">{presencePercentage}%</p></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-8 mt-10 grid grid-cols-1 md:grid-cols-2 text-center">
          <div></div>
          <div className="text-slate-900">
            <p className="text-sm font-medium">Kwanyar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-sm mt-1 font-bold">Kepala Sekolah,</p>
            <div className="h-24"></div>
            <p className="font-bold underline uppercase">{data.principal.name}</p>
            <p className="text-xs text-slate-500">NIP. {data.principal.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
