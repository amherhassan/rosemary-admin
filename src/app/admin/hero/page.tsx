'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface HeroSection {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    cta_text: string;
    cta_link: string;
    bg_image_url: string | null;
    mobile_bg_image_url: string | null;
    is_active: boolean;
    sort_order: number;
}

export default function HeroPage() {
    const [items, setItems] = useState<HeroSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<HeroSection | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        title: '', subtitle: '', description: '', cta_text: '', cta_link: '', bg_image_url: '', mobile_bg_image_url: '', is_active: true, sort_order: 0,
    });

    const fetchData = async () => {
        const res = await fetch('/api/admin/hero');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'bg_image_url' | 'mobile_bg_image_url' = 'bg_image_url') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'hero');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) setForm(prev => ({ ...prev, [field]: data.url }));
        setUploading(false);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, id: editing.id } : form;
        await fetch('/api/admin/hero', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        resetForm();
        setSaving(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this hero section?')) return;
        await fetch(`/api/admin/hero?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const toggleActive = async (item: HeroSection) => {
        await fetch('/api/admin/hero', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, is_active: !item.is_active }),
        });
        fetchData();
    };

    const startEdit = (item: HeroSection) => {
        setEditing(item);
        setForm({
            title: item.title, subtitle: item.subtitle || '', description: item.description || '',
            cta_text: item.cta_text || '', cta_link: item.cta_link || '', bg_image_url: item.bg_image_url || '', mobile_bg_image_url: item.mobile_bg_image_url || '',
            is_active: item.is_active, sort_order: item.sort_order,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '', bg_image_url: '', mobile_bg_image_url: '', is_active: true, sort_order: 0 });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Hero Section</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manage homepage hero banners</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} style={addBtnStyle}>
                    <Plus size={16} /> Add Slide
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 300 }}>
                            {editing ? 'Edit Hero Slide' : 'New Hero Slide'}
                        </h3>
                        <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                            <label style={labelStyle}>Title</label>
                            <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Hero title" />
                        </div>
                        <div>
                            <label style={labelStyle}>Subtitle</label>
                            <input value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} style={inputStyle} placeholder="Subtitle" />
                        </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, minHeight: '60px' }} placeholder="Description text" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                            <label style={labelStyle}>CTA Text</label>
                            <input value={form.cta_text} onChange={(e) => setForm(p => ({ ...p, cta_text: e.target.value }))} style={inputStyle} placeholder="Shop Now" />
                        </div>
                        <div>
                            <label style={labelStyle}>CTA Link</label>
                            <input value={form.cta_link} onChange={(e) => setForm(p => ({ ...p, cta_link: e.target.value }))} style={inputStyle} placeholder="/shop" />
                        </div>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Desktop Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {form.bg_image_url && <img src={form.bg_image_url} alt="" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
                                <button onClick={() => document.getElementById('desktop-upload')?.click()} disabled={uploading} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: 'auto' }}>
                                    <Upload size={14} /> Upload
                                </button>
                                <input id="desktop-upload" type="file" accept="image/*" onChange={(e) => handleUpload(e, 'bg_image_url')} style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Mobile Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {form.mobile_bg_image_url && <img src={form.mobile_bg_image_url} alt="" style={{ width: '45px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />}
                                <button onClick={() => document.getElementById('mobile-upload')?.click()} disabled={uploading} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: 'auto' }}>
                                    <Upload size={14} /> Upload
                                </button>
                                <input id="mobile-upload" type="file" accept="image/*" onChange={(e) => handleUpload(e, 'mobile_bg_image_url')} style={{ display: 'none' }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text)', cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                            Active
                        </label>
                        <div style={{ flex: 1 }} />
                        <button onClick={handleSave} disabled={saving} style={addBtnStyle}>{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</p>
            ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 200 }}>No hero slides yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)',
                            display: 'flex', overflow: 'hidden', alignItems: 'center',
                        }}>
                            {item.bg_image_url && (
                                <img src={item.bg_image_url} alt="" style={{ width: '160px', height: '90px', objectFit: 'cover', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1, padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text)', marginBottom: '4px' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 200 }}>{item.subtitle}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', padding: '16px', alignItems: 'center' }}>
                                <button onClick={() => toggleActive(item)} style={iconBtnStyle} title={item.is_active ? 'Active' : 'Inactive'}>
                                    {item.is_active ? <Eye size={16} style={{ color: '#059669' }} /> : <EyeOff size={16} style={{ color: '#9CA3AF' }} />}
                                </button>
                                <button onClick={() => startEdit(item)} style={iconBtnStyle}><Edit2 size={15} /></button>
                                <button onClick={() => handleDelete(item.id)} style={{ ...iconBtnStyle, color: '#DC2626' }}><Trash2 size={15} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const addBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#620C7B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'var(--font-body)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white', boxSizing: 'border-box' };
const iconBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#620C7B', display: 'flex', alignItems: 'center', padding: '4px' };
