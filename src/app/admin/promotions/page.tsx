'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface Promotion {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    link: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
}

export default function PromotionsPage() {
    const [items, setItems] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Promotion | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        title: '', description: '', image_url: '', link: '', is_active: true, start_date: '', end_date: '',
    });

    const fetchData = async () => {
        const res = await fetch('/api/admin/promotions');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'promotions');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) setForm(prev => ({ ...prev, image_url: data.url }));
        setUploading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, id: editing.id } : form;
        await fetch('/api/admin/promotions', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        resetForm();
        setSaving(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this promotion?')) return;
        await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const toggleActive = async (item: Promotion) => {
        await fetch('/api/admin/promotions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, is_active: !item.is_active }),
        });
        fetchData();
    };

    const startEdit = (item: Promotion) => {
        setEditing(item);
        setForm({
            title: item.title || '', description: item.description || '',
            image_url: item.image_url || '', link: item.link || '',
            is_active: item.is_active, start_date: item.start_date?.split('T')[0] || '', end_date: item.end_date?.split('T')[0] || '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({ title: '', description: '', image_url: '', link: '', is_active: true, start_date: '', end_date: '' });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Promotions</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manage promotional banners</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} style={addBtnStyle}><Plus size={16} /> Add Promotion</button>
            </div>

            {showForm && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 300 }}>{editing ? 'Edit Promotion' : 'New Promotion'}</h3>
                        <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div><label style={labelStyle}>Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Summer Sale" /></div>
                        <div><label style={labelStyle}>Link</label><input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} style={inputStyle} placeholder="/shop" /></div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, minHeight: '60px' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div><label style={labelStyle}>Start Date</label><input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>End Date</label><input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} style={inputStyle} /></div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Image</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {form.image_url && <img src={form.image_url} alt="" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: 'auto' }}>
                                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} /> Active
                        </label>
                        <div style={{ flex: 1 }} />
                        <button onClick={handleSave} disabled={saving} style={addBtnStyle}>{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>
            )}

            {loading ? <p style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</p> : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 200 }}>No promotions yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                            {item.image_url && <img src={item.image_url} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', flexShrink: 0 }} />}
                            <div style={{ flex: 1, padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text)', marginBottom: '4px' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {item.start_date && `${new Date(item.start_date).toLocaleDateString()}`}
                                    {item.start_date && item.end_date && ' — '}
                                    {item.end_date && `${new Date(item.end_date).toLocaleDateString()}`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
                                <button onClick={() => toggleActive(item)} style={iconBtnStyle}>{item.is_active ? <Eye size={16} style={{ color: '#059669' }} /> : <EyeOff size={16} style={{ color: '#9CA3AF' }} />}</button>
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
