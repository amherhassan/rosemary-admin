'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
    LayoutDashboard,
    Package,
    Image,
    Megaphone,
    FolderOpen,
    Settings,
    Search,
    LogOut,
    ChevronLeft,
    Menu,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    { href: '/admin/hero', icon: Image, label: 'Hero Section' },
    { href: '/admin/promotions', icon: Megaphone, label: 'Promotions' },
    { href: '/admin/seo', icon: Search, label: 'SEO' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="admin-mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Header */}
                <div className="admin-sidebar-header">
                    {!collapsed && (
                        <Link href="/admin" style={{ textDecoration: 'none' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.5rem',
                                fontWeight: 300,
                                color: '#620C7B',
                                letterSpacing: '0.05em',
                            }}>
                                Rosemary
                            </h2>
                            <span style={{
                                fontSize: '0.6rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                fontWeight: 400,
                            }}>
                                Admin
                            </span>
                        </Link>
                    )}
                    <button
                        className="admin-sidebar-toggle"
                        onClick={() => {
                            setCollapsed(!collapsed);
                            setMobileOpen(false);
                        }}
                        aria-label="Toggle sidebar"
                    >
                        <ChevronLeft size={16} style={{
                            transform: collapsed ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                        }} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="admin-sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="admin-sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="admin-nav-item logout"
                        title={collapsed ? 'Sign Out' : undefined}
                    >
                        <LogOut size={18} />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                    {!collapsed && (
                        <Link
                            href="/"
                            className="admin-nav-item"
                            target="_blank"
                            title="View website"
                        >
                            <ChevronLeft size={18} />
                            <span>View Site</span>
                        </Link>
                    )}
                </div>
            </aside>

            <style jsx global>{`
                .admin-mobile-menu-btn {
                    display: none;
                    position: fixed;
                    top: 16px;
                    left: 16px;
                    z-index: 1100;
                    width: 40px;
                    height: 40px;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .admin-sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 1050;
                }

                .admin-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 240px;
                    background: white;
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    z-index: 1060;
                    transition: width 0.25s ease;
                    overflow: hidden;
                }

                .admin-sidebar.collapsed {
                    width: 64px;
                }

                .admin-sidebar-header {
                    padding: 20px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    border-bottom: 1px solid var(--border-light);
                    min-height: 72px;
                }

                .admin-sidebar-toggle {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    cursor: pointer;
                    flex-shrink: 0;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                .admin-sidebar-toggle:hover {
                    background: var(--bg);
                    color: var(--text);
                }

                .admin-sidebar-nav {
                    flex: 1;
                    padding: 12px 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    overflow-y: auto;
                }

                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: all 0.15s;
                    white-space: nowrap;
                    border: none;
                    background: none;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    font-family: var(--font-body);
                }

                .admin-nav-item:hover {
                    background: #620C7B0A;
                    color: #620C7B;
                }

                .admin-nav-item.active {
                    background: #620C7B12;
                    color: #620C7B;
                    font-weight: 400;
                }

                .admin-nav-item.logout:hover {
                    background: #FEF2F2;
                    color: #DC2626;
                }

                .admin-sidebar-footer {
                    padding: 8px;
                    border-top: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                @media (max-width: 768px) {
                    .admin-mobile-menu-btn {
                        display: flex;
                    }

                    .admin-sidebar-overlay {
                        display: block;
                    }

                    .admin-sidebar {
                        transform: translateX(-100%);
                        width: 260px !important;
                        box-shadow: 4px 0 24px rgba(0,0,0,0.12);
                    }

                    .admin-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
