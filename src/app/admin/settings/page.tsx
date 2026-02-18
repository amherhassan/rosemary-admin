'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const [whatsappNumber, setWhatsappNumber] = useState('94771234567');
    const [showPricesGlobal, setShowPricesGlobal] = useState(true);
    const [brandTagline, setBrandTagline] = useState('Thoughtfully designed pieces for the modern woman');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
                if (data.show_prices_global !== undefined) setShowPricesGlobal(data.show_prices_global);
                if (data.brand_tagline) setBrandTagline(data.brand_tagline);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess('');
        await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                whatsapp_number: whatsappNumber,
                show_prices_global: showPricesGlobal,
                brand_tagline: brandTagline,
            }),
        });
        setSaving(false);
        setSuccess('Settings saved!');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</p>;

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Settings</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Global site configuration</p>
            </div>

            {success && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>{success}</div>
            )}

            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                    <h3 style={sectionTitle}>WhatsApp</h3>
                    <div>
                        <label style={labelStyle}>WhatsApp Number</label>
                        <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} style={inputStyle} placeholder="94771234567" />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Include country code, no + or spaces</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={sectionTitle}>Pricing</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 300, color: 'var(--text)' }}>
                        <input type="checkbox" checked={showPricesGlobal} onChange={e => setShowPricesGlobal(e.target.checked)} />
                        Show prices on the public website
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        When disabled, prices are hidden site-wide. Individual product price visibility can be overridden on the product page.
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3 style={sectionTitle}>Brand</h3>
                    <div>
                        <label style={labelStyle}>Brand Tagline</label>
                        <input value={brandTagline} onChange={e => setBrandTagline(e.target.value)} style={inputStyle} placeholder="Your tagline" />
                    </div>
                </div>

                <button onClick={handleSave} disabled={saving} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', background: saving ? '#9CA3AF' : '#620C7B', color: 'white',
                    border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 400,
                    letterSpacing: '0.08em', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)',
                }}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #F0EDE8' };
const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white', boxSizing: 'border-box' };
