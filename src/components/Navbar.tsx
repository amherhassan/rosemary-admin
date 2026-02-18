'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/context/SettingsContext';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const { getWhatsAppLink } = useWhatsApp();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    height: 'var(--nav-height)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 clamp(16px, 4vw, 64px)',
                    backgroundColor: isScrolled ? 'rgba(250, 248, 245, 0.95)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
                    transition: 'all var(--transition-base)',
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        color: '#620C7B',
                    }}
                >
                    Rosemary
                </Link>

                {/* Desktop nav */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                    }}
                    className="desktop-nav"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontSize: '0.8rem',
                                fontWeight: 300,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase' as const,
                                color: 'var(--text-muted)',
                                transition: 'color var(--transition-fast)',
                                position: 'relative',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            color: 'var(--accent)',
                            transition: 'color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    >
                        <MessageCircle size={16} />
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    style={{
                        display: 'none',
                        padding: '8px',
                        color: 'var(--text)',
                    }}
                    className="mobile-menu-btn"
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999,
                        backgroundColor: 'var(--bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '32px',
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '2rem',
                                fontWeight: 300,
                                color: 'var(--text)',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent"
                        style={{ marginTop: '20px' }}
                    >
                        <MessageCircle size={16} />
                        Chat on WhatsApp
                    </a>
                </div>
            )}

            {/* Responsive styles */}
            <style jsx global>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
        </>
    );
}
