
import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, FileDown, FileUp, 
  CheckCircle, XCircle, MoreHorizontal, User, GraduationCap, 
  BookOpen, Layers, Check, X
} from 'lucide-react';
import { AppState, Teacher, Student, SchoolClass, Subject } from '../types';

interface MasterDataProps {
  type: 'teacher' | 'student' | 'class' | 'subject';
  data: AppState;
  onUpdate: (data: AppState) => void;
}

const MasterData: React.FC<MasterDataProps> = ({ type, data, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const titles = {
    teacher: 'Data Guru',
    student: 'Data Siswa',
    class: 'Data Kelas',
    subject: 'Data Mata Pelajaran'
  };

  const currentData = type === 'teacher' ? data.teachers 
                   : type === 'student' ? data.students 
                   : type === 'class' ? data.classes 
                   : data.subjects;

  const filteredData = currentData.filter((item: any) => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Hapus ${selectedIds.length} data terpilih?`)) return;
    
    const newData = { ...data };
    if (type === 'teacher') newData.teachers = data.teachers.filter(t => !selectedIds.includes(t.id));
    if (type === 'student') newData.students = data.students.filter(s => !selectedIds.includes(s.id));
    if (type === 'class') newData.classes = data.classes.filter(c => !selectedIds.includes(c.id));
    if (type === 'subject') newData.subjects = data.subjects.filter(s => !selectedIds.includes(s.id));
    
    onUpdate(newData);
    setSelectedIds([]);
  };

  const downloadTemplate = () => {
    let csvContent = "";
    let fileName = "";
    
    if (type === 'teacher') {
      csvContent = "Nama,NIP,Kelas Diajar (Pisahkan dengan koma),Mata Pelajaran (Pisahkan dengan koma)\n";
      csvContent += "Budi Santoso S.Pd,198203112009011001,\"X-IPA-1,X-IPS-1\",Matematika";
      fileName = "template_guru.csv";
    } else if (type === 'student') {
      csvContent = "Nama,ID Kelas,Jenis Kelamin (L/P)\n";
      csvContent += "Ahmad Fauzi,c1,L\nBunga Citra,c1,P";
      fileName = "template_siswa.csv";
    } else if (type === 'class') {
      csvContent = "Nama Kelas,Jenjang (X/XI/XII)\n";
      csvContent += "X-IPA-1,X";
      fileName = "template_kelas.csv";
    } else {
      csvContent = "Nama Mata Pelajaran\n";
      csvContent += "Matematika";
      fileName = "template_mapel.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const itemData: any = Object.fromEntries(formData.entries());
    
    // Handle checkboxes for teachers
    if (type === 'teacher') {
      const assignedClasses = Array.from(form.querySelectorAll('input[name="assignedClasses"]:checked')).map((el: any) => el.value);
      const subjects = Array.from(form.querySelectorAll('input[name="subjects"]:checked')).map((el: any) => el.value);
      itemData.assignedClasses = assignedClasses;
      itemData.subjects = subjects;
    }

    const newData = { ...data };
    const targetKey = type === 'teacher' ? 'teachers' 
                    : type === 'student' ? 'students' 
                    : type === 'class' ? 'classes' 
                    : 'subjects';

    if (editingItem) {
      newData[targetKey] = (newData[targetKey] as any[]).map(i => i.id === editingItem.id ? { ...i, ...itemData } : i);
    } else {
      itemData.id = Math.random().toString(36).substr(2, 9);
      (newData[targetKey] as any[]).push(itemData);
    }

    onUpdate(newData);
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{titles[type]}</h2>
          <p className="text-slate-500">Kelola informasi {type === 'teacher' ? 'tenaga pengajar' : 'akademik'} sekolah.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={downloadTemplate}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
          >
            <FileDown size={18} /> Template
          </button>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <FileUp size={18} /> Import Excel
          </button>
          <button 
            onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Tambah {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} /> Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedIds(e.target.checked ? filteredData.map((i: any) => i.id) : [])}
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {type === 'teacher' && (
                  <>
                    <th className="px-6 py-4">Nama Guru</th>
                    <th className="px-6 py-4">NIP</th>
                    <th className="px-6 py-4">Kelas Diajar</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                  </>
                )}
                {type === 'student' && (
                  <>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">L/P</th>
                  </>
                )}
                {type === 'class' && (
                  <>
                    <th className="px-6 py-4">Nama Kelas</th>
                    <th className="px-6 py-4">Jenjang</th>
                  </>
                )}
                {type === 'subject' && (
                  <>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4">Kategori</th>
                  </>
                )}
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {type === 'teacher' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.nip}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.assignedClasses?.map((c: string) => (
                            <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.subjects?.join(', ')}</td>
                    </>
                  )}
                  {type === 'student' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {data.classes.find(c => c.id === item.classId)?.name || item.classId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.gender === 'L' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                          {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                    </>
                  )}
                  {type === 'class' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">Kelas {item.grade}</span>
                      </td>
                    </>
                  )}
                  {type === 'subject' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500">Wajib / Peminatan</td>
                    </>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingItem(item); setShowModal(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelectedIds([item.id]); handleBulkDelete(); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                {editingItem ? 'Edit' : 'Tambah'} {titles[type]}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              {type === 'teacher' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">NIP</label>
                      <input name="nip" defaultValue={editingItem?.nip} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kelas Diajar (Ceklis)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      {data.classes.map(cl => (
                        <label key={cl.id} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="assignedClasses" 
                            value={cl.name} 
                            defaultChecked={editingItem?.assignedClasses?.includes(cl.name)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cl.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mata Pelajaran (Ceklis)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      {data.subjects.map(sj => (
                        <label key={sj.id} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="subjects" 
                            value={sj.name} 
                            defaultChecked={editingItem?.subjects?.includes(sj.name)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{sj.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {type === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Siswa</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kelas</label>
                      <select name="classId" defaultValue={editingItem?.classId} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Kelamin</label>
                      <select name="gender" defaultValue={editingItem?.gender} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {type === 'class' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kelas</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenjang</label>
                    <select name="grade" defaultValue={editingItem?.grade} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>
                </>
              )}
              {type === 'subject' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Mata Pelajaran</label>
                  <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-100">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
