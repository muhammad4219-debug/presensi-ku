
import { AttendanceStatus, AppState } from './types';

export const STATUS_COLORS = {
  [AttendanceStatus.HADIR]: 'bg-green-500',
  [AttendanceStatus.IZIN]: 'bg-blue-500',
  [AttendanceStatus.SAKIT]: 'bg-yellow-500',
  [AttendanceStatus.ALFA]: 'bg-red-500',
  [AttendanceStatus.DISPENSASI]: 'bg-purple-500',
};

export const INITIAL_DATA: AppState = {
  teachers: [
    { id: 't1', name: 'Budi Santoso, S.Pd', nip: '198203112009011001', assignedClasses: ['X-IPA-1', 'X-IPS-1'], subjects: ['Matematika'] },
    { id: 't2', name: 'Siti Aminah, M.Pd', nip: '198504122012012002', assignedClasses: ['XI-IPA-1', 'XII-IPA-1'], subjects: ['Bahasa Indonesia'] },
  ],
  students: [
    { id: 's1', name: 'Ahmad Fauzi', classId: 'c1', gender: 'L' },
    { id: 's2', name: 'Bunga Citra', classId: 'c1', gender: 'P' },
    { id: 's3', name: 'Candra Wijaya', classId: 'c2', gender: 'L' },
  ],
  classes: [
    { id: 'c1', name: 'X-IPA-1', grade: 'X' },
    { id: 'c2', name: 'X-IPS-1', grade: 'X' },
    { id: 'c3', name: 'XI-IPA-1', grade: 'XI' },
    { id: 'c4', name: 'XII-IPA-1', grade: 'XII' },
  ],
  subjects: [
    { id: 's1', name: 'Matematika' },
    { id: 's2', name: 'Bahasa Indonesia' },
    { id: 's3', name: 'Fisika' },
    { id: 's4', name: 'Biologi' },
    { id: 's5', name: 'Ekonomi' },
  ],
  presences: [],
  violations: [],
  violationTypes: [
    { id: 'v1', label: 'Terlambat', points: 5 },
    { id: 'v2', label: 'Bolos', points: 15 },
    { id: 'v3', label: 'Atribut Tidak Lengkap', points: 10 },
    { id: 'v4', label: 'Rambut Tidak Sesuai', points: 10 },
    { id: 'v5', label: 'Berkelahi', points: 30 },
    { id: 'v6', label: 'Merokok', points: 25 },
    { id: 'v7', label: 'Mencuri', points: 50 },
  ],
  principal: {
    name: 'Drs. H. Ahmad Yani, M.Pd',
    nip: '196805121994031005'
  }
};
