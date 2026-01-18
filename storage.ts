import { INITIAL_DATA } from './constants.ts';
import { supabase } from './supabaseClient.ts';

const STORAGE_KEY = 'sman1_kwanyar_db';

// Fungsi untuk mengecek apakah koneksi ke cloud aktif
export const getStorageStatus = () => {
  if (supabase) return 'CLOUD';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return 'LOCAL_SERVER';
  return 'OFFLINE_BROWSER';
};

export const loadDataFromCloud = async () => {
  // 1. Selalu coba ambil dari LocalStorage terlebih dahulu (paling cepat)
  const saved = localStorage.getItem(STORAGE_KEY);
  let localData = null;
  
  try {
    if (saved) localData = JSON.parse(saved);
  } catch (e) {
    console.error("Gagal membaca LocalStorage");
  }

  // 2. Jika ada Supabase, coba sinkronisasi data terbaru dari cloud
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('school_settings')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (!error && data?.content) {
        const remoteData = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        // Update local jika data cloud lebih baru (opsional, untuk sekarang langsung timpa)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        return remoteData;
      }
    } catch (e) {
      console.warn("Cloud tidak terjangkau, menggunakan data lokal.");
    }
  }

  // 3. Jika tidak ada data sama sekali, gunakan data awal (constants)
  return localData || INITIAL_DATA;
};

export const syncDataToCloud = async (data: any) => {
  // Simpan permanen di browser
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Simpan ke Cloud jika konfigurasi ada
  if (supabase) {
    try {
      const { error } = await supabase
        .from('school_settings')
        .upsert({ id: 1, content: data, updated_at: new Date().toISOString() });
      return !error;
    } catch (e) {
      return false;
    }
  }
  return true;
};

// Fitur ekspor database ke file JSON (Sangat berguna jika tidak pakai server)
export const exportDatabaseToJson = (data: any) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `DB_SMAN1_KWANYAR_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const syncToMySQL = async (data: any) => {
  const ok = await syncDataToCloud(data);
  return { 
    success: ok, 
    message: ok ? 'Data Aman di Browser!' : 'Gagal Sinkron.' 
  };
};

export const backupToSQL = (data: any) => {
  return JSON.stringify(data);
};

export const createSystemSnapshot = (data: any) => {
  localStorage.setItem('sman1_snapshot', JSON.stringify(data));
};

export const restoreFromSnapshot = () => {
  const s = localStorage.getItem('sman1_snapshot');
  return s ? JSON.parse(s) : null;
};
