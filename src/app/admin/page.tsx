import { getAdminUser } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Package, FolderOpen, Image, Megaphone, Settings, TrendingUp } from 'lucide-react';

async function getDashboardStats() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const [products, categories, hero, promotions] = await Promise.all([
        supabase.from('products').select('id, status', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('hero_sections').select('id, is_active', { count: 'exact' }),
        supabase.from('promotions').select('id, is_active', { count: 'exact' }),
    ]);

    return {
        totalProducts: products.count || 0,
        activeProducts: products.data?.filter(p => p.status === 'active').length || 0,
        totalCategories: categories.count || 0,
        activeHero: hero.data?.filter(h => h.is_active).length || 0,
        activePromotions: promotions.data?.filter(p => p.is_active).length || 0,
    };
}

export default async function AdminDashboard() {
    const user = await getAdminUser();
    const stats = await getDashboardStats();

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#620C7B' },
        { label: 'Active Products', value: stats.activeProducts, icon: TrendingUp, color: '#059669' },
        { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: '#2563EB' },
        { label: 'Active Promos', value: stats.activePromotions, icon: Megaphone, color: '#D97706' },
    ];

    const quickActions = [
        { href: '/admin/products/new', label: 'Add Product', icon: Package },
        { href: '/admin/hero', label: 'Edit Hero', icon: Image },
        { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    fontWeight: 300,
                    color: 'var(--text)',
                    marginBottom: '4px',
                }}>
                    Dashboard
                </h1>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontWeight: 200,
                }}>
                    Welcome back{user?.email ? `, ${user.email}` : ''}
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
            }}>
                {statCards.map((stat) => (
                    <div key={stat.label} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                        }}>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 400,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                            }}>
                                {stat.label}
                            </span>
                            <stat.icon size={16} style={{ color: stat.color, opacity: 0.7 }} />
                        </div>
                        <p style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2rem',
                            fontWeight: 300,
                            color: 'var(--text)',
                        }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                }}>
                    Quick Actions
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '12px',
                }}>
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 18px',
                                background: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                color: 'var(--text)',
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                transition: 'all 0.15s',
                            }}
                        >
                            <action.icon size={16} style={{ color: '#620C7B', opacity: 0.8 }} />
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
