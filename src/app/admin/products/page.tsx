'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Archive, Eye, EyeOff } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    image_url: string;
    status: string;
    is_new: boolean;
    is_featured: boolean;
    show_price: boolean;
    categories: { name: string } | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);

        const res = await fetch(`/api/admin/products?${params.toString()}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const toggleShowPrice = async (id: string, currentValue: boolean) => {
        await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ show_price: !currentValue }),
        });
        setProducts(products.map(p =>
            p.id === id ? { ...p, show_price: !currentValue } : p
        ));
    };

    const archiveProduct = async (id: string) => {
        if (!confirm('Archive this product? It will be hidden from the public site.')) return;
        await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        setProducts(products.map(p =>
            p.id === id ? { ...p, status: 'archived' } : p
        ));
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.8rem',
                        fontWeight: 300,
                        color: 'var(--text)',
                        marginBottom: '4px',
                    }}>Products</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 200 }}>
                        Manage your product catalog
                    </p>
                </div>
                <Link href="/admin/products/new" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    background: '#620C7B',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                }}>
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
            }}>
                <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                    }} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 300,
                            outline: 'none',
                            background: 'white',
                        }}
                    />
                </form>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: '10px 14px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 300,
                        background: 'white',
                        color: 'var(--text)',
                        cursor: 'pointer',
                    }}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Products Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '64px 20px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 200 }}>
                        No products yet
                    </p>
                    <Link href="/admin/products/new" style={{
                        color: '#620C7B',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        fontWeight: 400,
                    }}>
                        + Add your first product
                    </Link>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.85rem',
                            fontWeight: 300,
                        }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '1px solid var(--border)',
                                    background: '#FAFAF8',
                                }}>
                                    <th style={{ ...thStyle }}>Image</th>
                                    <th style={{ ...thStyle, textAlign: 'left' }}>Product</th>
                                    <th style={{ ...thStyle }}>Price</th>
                                    <th style={{ ...thStyle }}>Category</th>
                                    <th style={{ ...thStyle }}>Status</th>
                                    <th style={{ ...thStyle }}>Show Price</th>
                                    <th style={{ ...thStyle }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} style={{
                                        borderBottom: '1px solid var(--border-light)',
                                        transition: 'background 0.15s',
                                    }}>
                                        <td style={{ ...tdStyle, width: '60px' }}>
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                        border: '1px solid var(--border-light)',
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    background: 'var(--bg)',
                                                    borderRadius: '6px',
                                                    border: '1px solid var(--border-light)',
                                                }} />
                                            )}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'left' }}>
                                            <div style={{ fontWeight: 400, color: 'var(--text)' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                {product.is_new && '✨ New '}
                                                {product.is_featured && '⭐ Featured'}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle }}>
                                            {product.currency} {product.price.toLocaleString()}
                                        </td>
                                        <td style={{ ...tdStyle }}>
                                            {product.categories?.name || '—'}
                                        </td>
                                        <td style={{ ...tdStyle }}>
                                            <span style={{
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.72rem',
                                                fontWeight: 400,
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                background: product.status === 'active' ? '#ECFDF5' : product.status === 'draft' ? '#FEF3C7' : '#F3F4F6',
                                                color: product.status === 'active' ? '#059669' : product.status === 'draft' ? '#D97706' : '#6B7280',
                                            }}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle }}>
                                            <button
                                                onClick={() => toggleShowPrice(product.id, product.show_price)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: product.show_price ? '#059669' : '#9CA3AF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                }}
                                                title={product.show_price ? 'Price visible' : 'Price hidden'}
                                            >
                                                {product.show_price ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                        </td>
                                        <td style={{ ...tdStyle }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    style={{
                                                        color: '#620C7B',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => archiveProduct(product.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#DC2626',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                    title="Archive"
                                                >
                                                    <Archive size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '12px 14px',
    fontSize: '0.68rem',
    fontWeight: 400,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8A8680',
    textAlign: 'center',
    whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
    padding: '12px 14px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'var(--text-muted)',
};
