'use client';

import Link from 'next/link';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { useWhatsApp } from '@/context/SettingsContext';

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Footer() {
    const { getWhatsAppLink } = useWhatsApp();
    return (
        <footer
            style={{
                backgroundColor: 'var(--bg-dark)',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '60px 0 32px',
            }}
        >
            <div className="container-wide">
                {/* Top section */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '40px',
                        marginBottom: '48px',
                    }}
                >
                    {/* Brand */}
                    <div>
                        <h3
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '2rem',
                                fontWeight: 300,
                                color: '#620C7B',
                                letterSpacing: '0.05em',
                                marginBottom: '16px',
                            }}
                        >
                            Rosemary
                        </h3>
                        <p
                            style={{
                                fontSize: '0.9rem',
                                lineHeight: 1.8,
                                maxWidth: '300px',
                                fontWeight: 200,
                            }}
                        >
                            Thoughtfully designed pieces for the modern woman.
                            Elegance in simplicity.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase' as const,
                                color: 'var(--accent)',
                                marginBottom: '24px',
                            }}
                        >
                            Navigate
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 200,
                                        transition: 'color var(--transition-fast)',
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase' as const,
                                color: 'var(--accent)',
                                marginBottom: '24px',
                            }}
                        >
                            Get in Touch
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 200,
                                    transition: 'color var(--transition-fast)',
                                }}
                            >
                                <MessageCircle size={16} />
                                Chat on WhatsApp
                            </a>
                            <a
                                href="mailto:hello@rosemary.lk"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 200,
                                    transition: 'color var(--transition-fast)',
                                }}
                            >
                                <Mail size={16} />
                                hello@rosemary.lk
                            </a>
                            <a
                                href="https://instagram.com/rosemary.lk"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 200,
                                    transition: 'color var(--transition-fast)',
                                }}
                            >
                                <Instagram size={16} />
                                @rosemary.lk
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: '100%',
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: '24px',
                    }}
                />

                {/* Bottom */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <p style={{ fontSize: '0.8rem', fontWeight: 200 }}>
                        © 2026 Rosemary. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 200, color: 'rgba(255,255,255,0.4)' }}>
                        Designed with care
                    </p>
                </div>
            </div>
        </footer>
    );
}
