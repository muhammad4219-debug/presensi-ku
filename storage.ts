
import { AppState } from './types.ts';
import { INITIAL_DATA } from './constants.ts';
import { supabase } from './supabaseClient.ts';

const STORAGE_KEY = 'sman1_kwanyar_db';

/**
 * Memuat data: Prioritas dari Supabase, jika gagal pakai LocalStorage, jika kosong pakai Initial.
 */
export const loadDataFromCloud = async (): Promise<AppState> => {
  try {
    const { data, error } = await supabase
      .from('school_data')
      .select('content')
      .eq('id', 1)
      .single();

    if (error || !data) throw error;
    
    // Simpan ke local sebagai cadangan offline
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
    return data.content as AppState;
  } catch (e) {
    console.warn('Gagal memuat dari Cloud, menggunakan data lokal...', e);
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  }
};

/**
 * Menyimpan data ke LocalStorage dan Cloud secara paralel.
 */
export const syncDataToCloud = async (data: AppState): Promise<boolean> => {
  // Simpan lokal dulu (instan)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  try {
    const { error } = await supabase
      .from('school_data')
      .update({ content: data, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Gagal sinkronisasi ke Cloud:', e);
    return false;
  }
};

// Fix: Add missing syncToMySQL member to resolve import error in AdminDashboard.tsx
/**
 * Sinkronisasi data ke cloud (Supabase/MySQL alias) dengan feedback pesan status.
 */
export const syncToMySQL = async (data: AppState): Promise<{ success: boolean; message: string }> => {
  const success = await syncDataToCloud(data);
  return {
    success,
    message: success ? 'Data berhasil disinkronkan ke Cloud Database.' : 'Gagal sinkronisasi. Cek koneksi internet Anda.'
  };
};

// Fix: Add missing backupToSQL member to resolve import error in BackupRestore.tsx
/**
 * Membuat query SQL backup sederhana untuk diunduh sebagai file cadangan fisik.
 */
export const backupToSQL = (data: AppState): string => {
  const base64Data = btoa(JSON.stringify(data));
  return `SET content = '${base64Data}';`;
};

export const createSystemSnapshot = (data: AppState): void => {
  localStorage.setItem('sman1_snapshot', JSON.stringify(data));
};

export const restoreFromSnapshot = (): AppState | null => {
  const snapshot = localStorage.getItem('sman1_snapshot');
  return snapshot ? JSON.parse(snapshot) : null;
};
