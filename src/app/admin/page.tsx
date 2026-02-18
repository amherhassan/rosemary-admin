import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Package, Layers, Image as ImageIcon, Ticket, Settings, ArrowRight, TrendingUp, MessageCircle, DollarSign } from 'lucide-react';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } }
        }
    );

    // Fetch stats
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).neq('status', 'archived');
    const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

    // Fetch total clicks
    const { data: clickData } = await supabase.from('products').select('whatsapp_clicks');
    const totalClicks = clickData?.reduce((acc, curr) => acc + (curr.whatsapp_clicks || 0), 0) || 0;

    // Fetch ledger revenue
    const { data: ledgerData } = await supabase.from('sales_ledger').select('price_sold');
    const totalRevenue = ledgerData?.reduce((acc, curr) => acc + (curr.price_sold || 0), 0) || 0;

    const stats = [
        { label: 'Total Products', value: productsCount || 0, icon: Package, color: '#620C7B' },
        { label: 'WhatsApp Clicks', value: totalClicks, icon: MessageCircle, color: '#10B981' }, // Intent
        { label: 'Recorded Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#059669' }, // Manual Sales
        { label: 'Active Categories', value: categoriesCount || 0, icon: Layers, color: '#D97706' },
    ];

    const quickActions = [
        { label: 'Record Sale', href: '/admin/ledger', icon: DollarSign },
        { label: 'Add Product', href: '/admin/products/new', icon: Package },
        { label: 'Manage Promos', href: '/admin/promotions', icon: Ticket },
        { label: 'Update Hero', href: '/admin/hero', icon: ImageIcon },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, color: 'var(--text)', marginBottom: '8px' }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 300 }}>
                    Overview of your catalog and performance.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 500, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '20px', color: 'var(--text)' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {quickActions.map((action, i) => (
                    <Link key={i} href={action.href} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)',
                        textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s',
                        gap: '12px'
                    }}>
                        <div style={{ padding: '12px', background: '#FAFAF8', borderRadius: '50%', color: '#620C7B' }}>
                            <action.icon size={24} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
