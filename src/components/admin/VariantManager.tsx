'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

interface Variant {
    id: string;
    size: string;
    color: string;
    stock_status: 'in_stock' | 'sold_out' | 'low_stock';
}

interface VariantManagerProps {
    productId: string;
}

export default function VariantManager({ productId }: VariantManagerProps) {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [form, setForm] = useState({
        size: '',
        color: '',
        stock_status: 'in_stock' as const,
    });

    const fetchVariants = async () => {
        const res = await fetch(`/api/admin/variants?product_id=${productId}`);
        const data = await res.json();
        setVariants(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => {
        if (productId) fetchVariants();
    }, [productId]);

    const handleAdd = async () => {
        if (!form.size || !form.color) return;
        setAdding(true);
        await fetch('/api/admin/variants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, product_id: productId }),
        });
        setForm({ size: '', color: '', stock_status: 'in_stock' });
        setAdding(false);
        fetchVariants();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this variant?')) return;
        await fetch(`/api/admin/variants?id=${id}`, { method: 'DELETE' });
        fetchVariants();
    };

    const handleStatusChange = async (id: string, status: string) => {
        await fetch('/api/admin/variants', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, stock_status: status }),
        });
        fetchVariants(); // Refresh to ensure sync
    };

    if (loading) return <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading variants...</div>;

    return (
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)', marginBottom: '12px' }}>Product Variants</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '16px', alignItems: 'end' }}>
                <div>
                    <label style={labelStyle}>Size</label>
                    <input value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} style={inputStyle} placeholder="e.g. S" />
                </div>
                <div>
                    <label style={labelStyle}>Color</label>
                    <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={inputStyle} placeholder="e.g. Red" />
                </div>
                <div>
                    <label style={labelStyle}>Stock</label>
                    <select value={form.stock_status} onChange={e => setForm(p => ({ ...p, stock_status: e.target.value as any }))} style={inputStyle}>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="sold_out">Sold Out</option>
                    </select>
                </div>
                <button onClick={handleAdd} disabled={adding} style={{ ...addBtnStyle, height: '42px', padding: '0 16px' }}>
                    <Plus size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {variants.map(v => (
                    <div key={v.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: '#FAFAF8', borderRadius: '8px', border: '1px solid var(--border-light)'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 500 }}>{v.size}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{v.color}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <select
                                value={v.stock_status}
                                onChange={(e) => handleStatusChange(v.id, e.target.value)}
                                style={{
                                    padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem',
                                    color: v.stock_status === 'in_stock' ? '#059669' : v.stock_status === 'sold_out' ? '#DC2626' : '#D97706',
                                    background: 'white'
                                }}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="sold_out">Sold Out</option>
                            </select>
                            <button onClick={() => handleDelete(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                {variants.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No variants added yet.</p>}
            </div>
        </div>
    );
}

const addBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#620C7B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.65rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', background: 'white', boxSizing: 'border-box' };
