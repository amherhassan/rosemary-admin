'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Edit2, Trash2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    sort_order: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'categories');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) setImageUrl(data.url);
        setUploading(false);
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        setSaving(true);

        if (editing) {
            await fetch('/api/admin/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editing.id, name, slug: name.toLowerCase().replace(/\s+/g, '-'), image_url: imageUrl || null }),
            });
        } else {
            await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image_url: imageUrl || null }),
            });
        }

        setName('');
        setImageUrl('');
        setEditing(null);
        setShowForm(false);
        setSaving(false);
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
        fetchCategories();
    };

    const startEdit = (cat: Category) => {
        setEditing(cat);
        setName(cat.name);
        setImageUrl(cat.image_url || '');
        setShowForm(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Categories</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manage product categories</p>
                </div>
                <button onClick={() => { setShowForm(true); setEditing(null); setName(''); setImageUrl(''); }} style={addBtnStyle}>
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{
                    background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)',
                    marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 300 }}>
                            {editing ? 'Edit Category' : 'New Category'}
                        </h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={18} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={labelStyle}>Category Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="e.g. Dresses" />
                        </div>
                        <div>
                            <label style={labelStyle}>Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {imageUrl && <img src={imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: 'auto' }}>
                                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                            </div>
                        </div>
                        <button onClick={handleSave} disabled={saving} style={{ ...addBtnStyle, height: '42px' }}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <p style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading...</p>
            ) : categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 200 }}>No categories yet</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {categories.map(cat => (
                        <div key={cat.id} style={{
                            background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)',
                            overflow: 'hidden', transition: 'box-shadow 0.2s',
                        }}>
                            {cat.image_url && (
                                <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                            )}
                            <div style={{ padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>{cat.name}</h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => startEdit(cat)} style={iconBtnStyle}><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(cat.id)} style={{ ...iconBtnStyle, color: '#DC2626' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const addBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
    background: '#620C7B', color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.08em', cursor: 'pointer',
    fontFamily: 'var(--font-body)',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px',
    fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white',
};
const iconBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', color: '#620C7B',
    display: 'flex', alignItems: 'center', padding: '4px',
};
