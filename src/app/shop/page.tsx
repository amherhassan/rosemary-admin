import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ShopGrid from './ShopGrid';

export const metadata = {
    title: 'Shop — Rosemary',
    description: 'Explore our latest collection.',
};

export default async function ShopPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } }
        }
    );

    // Fetch active products with their variants
    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            product_variants (*)
        `)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

    // Fetch active categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    // Get site settings for WhatsApp config
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*');

    // Convert settings array to object for easier usage
    const settingsMap = settings?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || {};

    return (
        <section style={{ paddingTop: '48px', paddingBottom: '64px', minHeight: '80vh' }}>
            <div className="container-wide">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                        Our Collection
                    </p>
                    <h1 className="heading-lg" style={{ marginBottom: '32px' }}>
                        Shop
                    </h1>
                </div>

                <ShopGrid
                    products={products || []}
                    categories={categories || []}
                    settings={settingsMap}
                />
            </div>
        </section>
    );
}
