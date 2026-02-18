'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, DollarSign, Calendar } from 'lucide-react';

interface SaleEntry {
    id: string;
    product_name: string;
    customer_name: string;
    customer_phone: string;
    price_sold: number;
    sale_date: string;
    notes: string;
}

export default function LedgerPage() {
    const [sales, setSales] = useState<SaleEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [form, setForm] = useState({
        product_name: '',
        customer_name: '',
        customer_phone: '',
        price_sold: '',
        sale_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const fetchSales = async () => {
        const res = await fetch('/api/admin/ledger');
        const data = await res.json();
        if (Array.isArray(data)) {
            setSales(data);
            const total = data.reduce((acc, curr) => acc + (curr.price_sold || 0), 0);
            setTotalRevenue(total);
        }
        setLoading(false);
    };

    useEffect(() => { fetchSales(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch('/api/admin/ledger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, price_sold: parseFloat(form.price_sold) || 0 }),
        });
        setForm({
            product_name: '', customer_name: '', customer_phone: '',
            price_sold: '', sale_date: new Date().toISOString().split('T')[0], notes: ''
        });
        setShowForm(false);
        setSaving(false);
        fetchSales();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this record?')) return;
        await fetch(`/api/admin/ledger?id=${id}`, { method: 'DELETE' });
        fetchSales();
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)' }}>Sales Ledger</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>Manually track WhatsApp sales revenue</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={addBtnStyle}>
                    <Plus size={16} /> Record Sale
                </button>
            </div>

            {/* Revenue Card */}
            <div style={{
                background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '20px', borderRadius: '12px',
                marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', background: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                    <DollarSign size={24} />
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#047857', marginBottom: '4px' }}>Total Recorded Revenue</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 600, color: '#065F46', fontFamily: 'var(--font-heading)' }}>
                        LKR {totalRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Quick Add Form */}
            {showForm && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '24px', animation: 'slideDown 0.2s ease' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 400 }}>Record New Sale</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={labelStyle}>Product Name</label>
                                <input required value={form.product_name} onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))} style={inputStyle} placeholder="e.g. Silk Dress - Red" />
                            </div>
                            <div>
                                <label style={labelStyle}>Sale Price (LKR)</label>
                                <input required type="number" value={form.price_sold} onChange={e => setForm(p => ({ ...p, price_sold: e.target.value }))} style={inputStyle} placeholder="0.00" />
                            </div>
                            <div>
                                <label style={labelStyle}>Customer Name</label>
                                <input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} style={inputStyle} placeholder="Optional" />
                            </div>
                            <div>
                                <label style={labelStyle}>Date</label>
                                <input type="date" required value={form.sale_date} onChange={e => setForm(p => ({ ...p, sale_date: e.target.value }))} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ ...btnStyle, background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
                            <button type="submit" disabled={saving} style={addBtnStyle}>{saving ? 'Recording...' : 'Save Record'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</p> : sales.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No sales recorded yet.</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#FAFAF8', borderBottom: '1px solid var(--border)' }}>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Customer</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={tdStyle}>{new Date(sale.sale_date).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 500, color: 'var(--text)' }}>{sale.product_name}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div>{sale.customer_name}</div>
                                        {sale.customer_phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sale.customer_phone}</div>}
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: '#059669' }}>
                                        LKR {sale.price_sold.toLocaleString()}
                                    </td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleDelete(sale.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: '4px' }}>
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const addBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#620C7B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'var(--font-body)' };
const btnStyle: React.CSSProperties = { padding: '10px 20px', border: 'none', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8680', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, outline: 'none', background: 'white', boxSizing: 'border-box' };
const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '14px 16px', color: 'var(--text-muted)', verticalAlign: 'middle' };
