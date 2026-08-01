import { createClient } from "@supabase/supabase-js";

// Substitua pelas credenciais do projeto Supabase criado para esta plataforma
// (mesmo padrão dos demais sistemas da escola: URL e chave "anon public").
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "SUA-CHAVE-ANON";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
