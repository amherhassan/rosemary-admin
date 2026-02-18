import { createClient } from '@/lib/supabase-server';
import HomeClient from '@/components/HomeClient';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch New Arrivals (is_new = true)
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch Featured Products (is_featured = true)
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Fetch Hero Sections
  const { data: heroSections } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Fetch Settings
  // Fetch Settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*');

  const settings: Record<string, any> = {};
  if (settingsData) {
    settingsData.forEach((row: any) => {
      settings[row.key] = row.value;
    });
  }

  return (
    <HomeClient
      featuredProducts={featuredProducts || []}
      newArrivals={newArrivals || []}
      categories={categories || []}
      heroSections={heroSections || []}
      settings={settings || {}}
    />
  );
}
