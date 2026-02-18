'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface PageSeo {
    page_slug: string;
    meta_title: string;
    meta_description: string;
    og_image_url: string | null;
}

const pages = [
    { slug: 'home', label: 'Homepage' },
    { slug: 'shop', label: 'Shop' },
    { slug: 'about', label: 'About' },
    { slug: 'contact', label: 'Contact' },
];

export default function SeoPage() {
    const [seoData, setSeoData] = useState<PageSeo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/admin/seo')
            .then(res => res.json())
            .then(data => {
                // Merge with known pages
                const merged = pages.map(page => {
                    const existing = (Array.isArray(data) ? data : []).find((s: PageSeo) => s.page_slug === page.slug);
                    return existing || { page_slug: page.slug, meta_title: '', meta_description: '', og_image_url: null };
                });
                setSeoData(merged);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const updateField = (slug: string, field: string, value: string) => {
        setSeoData(prev => prev.map(s =>
            s.page_slug === slug ? { ...s, [field]: value } : s
        ));
    };

    const handleSave = async (slug: string) => {
        setSaving(slug);
        setSuccess('');
        const entry = seoData.find(s => s.page_slug === slug);
        if (!entry) return;

        await fetch('/api/admin/seo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });

        setSaving('');
        setSuccess(slug);
        setTimeout(() => setSuccess(''), 3000);
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</p>;

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>SEO</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manage meta tags for each page</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' }}>
                {seoData.map(entry => {
                    const page = pages.find(p => p.slug === entry.page_slug);
                    return (
                        <div key={entry.page_slug} style={{
                            background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #F0EDE8',
                        }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' }}>
                                {page?.label || entry.page_slug}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Meta Title</label>
                                    <input
                                        value={entry.meta_title}
                                        onChange={e => updateField(entry.page_slug, 'meta_title', e.target.value)}
                                        style={inputStyle}
                                        placeholder="Page title for search engines"
                                    />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{entry.meta_title.length}/60 characters</p>
                                </div>
                                <div>
                                    <label style={labelStyle}>Meta Description</label>
                                    <textarea
                                        value={entry.meta_description}
                                        onChange={e => updateField(entry.page_slug, 'meta_description', e.target.value)}
                                        style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                                        placeholder="Description shown in search results"
                                    />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{entry.meta_description.length}/155 characters</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                    {success === entry.page_slug && (
                                        <span style={{ fontSize: '0.8rem', color: '#059669' }}>✓ Saved</span>
                                    )}
                                    <button
                                        onClick={() => handleSave(entry.page_slug)}
                                        disabled={saving === entry.page_slug}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 16px', background: saving === entry.page_slug ? '#9CA3AF' : '#620C7B',
                                            color: 'white', border: 'none', borderRadius: '6px',
                                            fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        <Save size={14} /> {saving === entry.page_slug ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white', boxSizing: 'border-box' };
