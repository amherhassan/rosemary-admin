'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, User, Users, Lock, LogOut, Plus, Trash2, Settings, Image, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // General Settings
    const [whatsappNumber, setWhatsappNumber] = useState('94771234567');
    const [showPricesGlobal, setShowPricesGlobal] = useState(true);
    const [brandTagline, setBrandTagline] = useState('Thoughtfully designed pieces for the modern woman');

    // Homepage Settings
    const [philosophyImage, setPhilosophyImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Account Settings
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Team Settings
    const [admins, setAdmins] = useState<any[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [addingAdmin, setAddingAdmin] = useState(false);

    useEffect(() => {
        fetchGeneralSettings();
    }, []);

    useEffect(() => {
        if (activeTab === 'team') fetchAdmins();
    }, [activeTab]);

    const fetchGeneralSettings = () => {
        fetch('/api/admin/settings')
            .then(res => {
                if (res.status === 401) router.push('/admin/login');
                return res.json();
            })
            .then(data => {
                if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
                if (data.show_prices_global !== undefined) setShowPricesGlobal(data.show_prices_global);
                if (data.brand_tagline) setBrandTagline(data.brand_tagline);
                if (data.philosophy_image) setPhilosophyImage(data.philosophy_image);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch admins');
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    whatsapp_number: whatsappNumber,
                    show_prices_global: showPricesGlobal,
                    brand_tagline: brandTagline,
                }),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSuccess('Settings saved!');
            fetch('/api/revalidate?path=/&type=layout'); // Optional: revalidate if we had ISR
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'homepage');
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setPhilosophyImage(data.url);
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveHomepage = async () => {
        setSaving(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    philosophy_image: philosophyImage,
                }),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSuccess('Homepage settings saved!');
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleUpdateAccount = async () => {
        setSaving(true);
        setSuccess('');
        setError('');

        if (newPassword && newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setSaving(false);
            return;
        }

        const supabase = createClient();
        const updates: any = {};
        if (newEmail) updates.email = newEmail;
        if (newPassword) updates.password = newPassword;

        const { error } = await supabase.auth.updateUser(updates);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Account updated! You may need to verify your new email.');
            setNewEmail('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setSaving(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleAddAdmin = async () => {
        if (!newAdminEmail || !newAdminPassword) {
            setError('Email and password required');
            return;
        }
        setAddingAdmin(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to add admin');

            setSuccess('Admin added successfully');
            setNewAdminEmail('');
            setNewAdminPassword('');
            fetchAdmins();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAddingAdmin(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" />
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Settings</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manage site configuration and team access</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '1px' }}>
                <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label="General" icon={<Settings size={16} />} />
                <TabButton active={activeTab === 'homepage'} onClick={() => setActiveTab('homepage')} label="Homepage" icon={<Image size={16} />} />
                <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} label="My Account" icon={<User size={16} />} />
                <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} label="Team" icon={<Users size={16} />} />
            </div>

            {/* Notifications */}
            {success && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>{success}</div>
            )}
            {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>{error}</div>
            )}

            {/* Content */}
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {activeTab === 'general' && (
                    <>
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

                        <button onClick={handleSaveGeneral} disabled={saving} style={primaryBtnStyle}>
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </>
                )}

                {activeTab === 'homepage' && (
                    <>
                        <div style={cardStyle}>
                            <h3 style={sectionTitle}>Our Philosophy Section</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 200 }}>
                                Upload an image for the &quot;Our Philosophy&quot; section on the homepage.
                            </p>
                            <div>
                                <label style={labelStyle}>Brand / Philosophy Image</label>
                                {philosophyImage ? (
                                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E8E4DE' }}>
                                        <img
                                            src={philosophyImage}
                                            alt="Philosophy"
                                            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                                        />
                                        <button
                                            onClick={() => setPhilosophyImage('')}
                                            style={{
                                                position: 'absolute', top: '8px', right: '8px',
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.6)', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            gap: '12px', padding: '40px', border: '2px dashed #E2D8CC', borderRadius: '12px',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            background: uploadingImage ? '#F9F7F4' : 'transparent',
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            disabled={uploadingImage}
                                        />
                                        {uploadingImage ? (
                                            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
                                        ) : (
                                            <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                                        )}
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300 }}>
                                            {uploadingImage ? 'Uploading...' : 'Click to upload an image'}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                                            JPEG, PNG or WebP — max 5MB
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <button onClick={handleSaveHomepage} disabled={saving} style={primaryBtnStyle}>
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Homepage Settings'}
                        </button>
                    </>
                )}

                {activeTab === 'account' && (
                    <>
                        <div style={cardStyle}>
                            <h3 style={sectionTitle}>Update Credentials</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>New Email (Optional)</label>
                                    <input value={newEmail} onChange={e => setNewEmail(e.target.value)} style={inputStyle} placeholder="new@example.com" type="email" />
                                </div>
                                <div>
                                    <label style={labelStyle}>New Password (Optional)</label>
                                    <input value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} placeholder="Min 6 characters" type="password" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Confirm Password</label>
                                    <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="Confirm new password" type="password" />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleUpdateAccount} disabled={saving} style={primaryBtnStyle}>
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Updating...' : 'Update Account'}
                        </button>
                    </>
                )}

                {activeTab === 'team' && (
                    <>
                        <div style={cardStyle}>
                            <h3 style={sectionTitle}>Add New Admin</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@example.com" type="email" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Password</label>
                                    <input value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} style={inputStyle} placeholder="Secure password" type="password" />
                                </div>
                                <button onClick={handleAddAdmin} disabled={addingAdmin} style={{ ...primaryBtnStyle, marginTop: '8px' }}>
                                    {addingAdmin ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    {addingAdmin ? 'Adding...' : 'Add Admin'}
                                </button>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={sectionTitle}>Team Members</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {admins.map(admin => (
                                    <div key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{admin.email}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {new Date(admin.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {/* <button style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button> */}
                                    </div>
                                ))}
                                {admins.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No other admins found.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
        border: 'none', background: 'none', borderBottom: active ? '2px solid #620C7B' : '2px solid transparent',
        color: active ? '#620C7B' : '#6B7280', fontWeight: active ? 500 : 400,
        cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem'
    }}>
        {icon} {label}
    </button>
);

const cardStyle: React.CSSProperties = { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #F0EDE8' };
const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white', boxSizing: 'border-box' };
const primaryBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '14px', background: '#620C7B', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 400,
    letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%'
};
