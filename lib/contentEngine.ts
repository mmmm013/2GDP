import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getBrandTracks(brand: 'GPM' | 'KLEIGH' | 'SCHERER' | 'KFS') {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('brand_domain', brand);

  if (error) {
    console.error(`ENGINE ERROR (${brand}):`, error);
    return [];
  }
  return data;
}
