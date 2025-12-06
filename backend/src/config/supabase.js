import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// As variáveis precisam estar no docker-compose ou .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️  Aviso: SUPABASE_URL ou SUPABASE_KEY não definidos!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;