import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://khlmfaodrzzjonjhzodu.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobG1mYW9kcnp6am9uamh6b2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU0MjQsImV4cCI6MjA5NzAwMTQyNH0.lGKMPI2ejdX56yxF6ta8X-V2WnVU_c2TFmw-czGSK0M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
