'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FAF8F5 0%, #F0EDE8 100%)',
            padding: '20px',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'white',
                padding: '48px 40px',
                boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.2rem',
                        fontWeight: 300,
                        color: '#620C7B',
                        letterSpacing: '0.05em',
                        marginBottom: '8px',
                    }}>
                        Rosemary
                    </h1>
                    <p style={{
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                    }}>
                        Admin Panel
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div style={{
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            padding: '12px 16px',
                            fontSize: '0.85rem',
                            marginBottom: '24px',
                            borderRadius: '4px',
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--border)',
                                fontSize: '0.95rem',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 300,
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                background: 'var(--bg)',
                            }}
                            placeholder="admin@rosemary.com"
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--border)',
                                fontSize: '0.95rem',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 300,
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                background: 'var(--bg)',
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#9CA3AF' : '#620C7B',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontWeight: 200,
                }}>
                    Authorized administrators only
                </p>
            </div>
        </div>
    );
}
