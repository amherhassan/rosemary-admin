'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
    productId?: string;
}

interface Category {
    id: string;
    name: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: '',
        price: '',
        currency: 'LKR',
        category_id: '',
        description: '',
        image_url: '',
        images: [] as string[],
        is_new: false,
        is_featured: false,
        sizes: '',
        colors: '',
        show_price: true,
        status: 'active',
        sort_order: 0,
    });

    // Fetch categories
    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);

    // Fetch product if editing
    useEffect(() => {
        if (productId) {
            setLoading(true);
            fetch(`/api/admin/products/${productId}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        name: data.name || '',
                        price: data.price?.toString() || '',
                        currency: data.currency || 'LKR',
                        category_id: data.category_id || '',
                        description: data.description || '',
                        image_url: data.image_url || '',
                        images: data.images || [],
                        is_new: data.is_new || false,
                        is_featured: data.is_featured || false,
                        sizes: (data.sizes || []).join(', '),
                        colors: (data.colors || []).join(', '),
                        show_price: data.show_price !== false,
                        status: data.status || 'active',
                        sort_order: data.sort_order || 0,
                    });
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [productId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setForm(prev => ({
                    ...prev,
                    image_url: data.url,
                    images: [...prev.images, data.url],
                }));
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (url: string) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter(i => i !== url),
            image_url: prev.image_url === url ? (prev.images.filter(i => i !== url)[0] || '') : prev.image_url,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const payload = {
            ...form,
            price: parseFloat(form.price),
            sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
            category_id: form.category_id || null,
        };

        try {
            const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
            const method = productId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(productId ? 'Product updated!' : 'Product created!');
                if (!productId) {
                    setTimeout(() => router.push('/admin/products'), 1000);
                }
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch {
            setError('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <Link href="/admin/products" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    marginBottom: '12px',
                }}>
                    <ArrowLeft size={14} /> Back to products
                </Link>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    fontWeight: 300,
                    color: 'var(--text)',
                }}>
                    {productId ? 'Edit Product' : 'New Product'}
                </h1>
            </div>

            {/* Messages */}
            {error && (
                <div style={{
                    background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem',
                }}>{error}</div>
            )}
            {success && (
                <div style={{
                    background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669',
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem',
                }}>{success}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 320px',
                    gap: '24px',
                    alignItems: 'start',
                }}>
                    {/* Left column: main fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Name */}
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Product Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                required
                                style={inputStyle}
                                placeholder="e.g. Silk Wrap Dress"
                            />
                        </div>

                        {/* Description */}
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Describe the product..."
                            />
                        </div>

                        {/* Price + Currency */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
                            <div style={fieldGroup}>
                                <label style={labelStyle}>Price</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                                    required
                                    style={inputStyle}
                                    placeholder="12500"
                                    step="0.01"
                                />
                            </div>
                            <div style={fieldGroup}>
                                <label style={labelStyle}>Currency</label>
                                <input
                                    value={form.currency}
                                    onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="LKR"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                                style={inputStyle}
                            >
                                <option value="">No category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sizes + Colors */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={fieldGroup}>
                                <label style={labelStyle}>Sizes (comma separated)</label>
                                <input
                                    value={form.sizes}
                                    onChange={(e) => setForm(prev => ({ ...prev, sizes: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="XS, S, M, L, XL"
                                />
                            </div>
                            <div style={fieldGroup}>
                                <label style={labelStyle}>Colors (comma separated)</label>
                                <input
                                    value={form.colors}
                                    onChange={(e) => setForm(prev => ({ ...prev, colors: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="Champagne, Ivory"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Images</label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                marginBottom: '10px',
                            }}>
                                {form.images.map((img, i) => (
                                    <div key={i} style={{
                                        position: 'relative',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: form.image_url === img ? '2px solid #620C7B' : '1px solid var(--border)',
                                    }}>
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img)}
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 0,
                                            }}
                                        >
                                            <X size={10} />
                                        </button>
                                        {form.image_url !== img && (
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, image_url: img }))}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '2px',
                                                    left: '2px',
                                                    fontSize: '0.55rem',
                                                    padding: '2px 4px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                }}>
                                                Set main
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        border: '2px dashed var(--border)',
                                        borderRadius: '8px',
                                        background: 'var(--bg)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.65rem',
                                    }}
                                >
                                    <Upload size={16} />
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Right column: sidebar options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Status */}
                        <div style={cardStyle}>
                            <label style={labelStyle}>Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Toggles */}
                        <div style={cardStyle}>
                            <label style={labelStyle}>Options</label>
                            <label style={toggleRow}>
                                <input
                                    type="checkbox"
                                    checked={form.show_price}
                                    onChange={(e) => setForm(prev => ({ ...prev, show_price: e.target.checked }))}
                                />
                                <span>Show price on website</span>
                            </label>
                            <label style={toggleRow}>
                                <input
                                    type="checkbox"
                                    checked={form.is_new}
                                    onChange={(e) => setForm(prev => ({ ...prev, is_new: e.target.checked }))}
                                />
                                <span>Mark as New</span>
                            </label>
                            <label style={toggleRow}>
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                />
                                <span>Featured product</span>
                            </label>
                        </div>

                        {/* Sort Order */}
                        <div style={cardStyle}>
                            <label style={labelStyle}>Sort Order</label>
                            <input
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                style={inputStyle}
                                placeholder="0"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: saving ? '#9CA3AF' : '#620C7B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 400,
                                letterSpacing: '0.08em',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            {saving ? 'Saving...' : (productId ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                @media (max-width: 768px) {
                    form > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

const fieldGroup: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    fontWeight: 400,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8A8680',
    marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E8E4DE',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
    outline: 'none',
    background: 'white',
    boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #F0EDE8',
};

const toggleRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: '#2C2C2C',
    padding: '6px 0',
    cursor: 'pointer',
};
