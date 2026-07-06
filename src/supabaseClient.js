import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente foram inseridas e são válidas
const isValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'https://seu-projeto.supabase.co' &&
                      supabaseUrl.trim() !== '' &&
                      supabaseAnonKey.trim() !== '';

if (!isValidConfig) {
  console.warn(
    'Supabase client: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados ou contêm placeholders. ' +
    'O aplicativo usará armazenamento LocalStorage como fallback offline.'
  );
}

export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
