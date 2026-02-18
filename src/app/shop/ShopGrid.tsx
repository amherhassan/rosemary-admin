'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import ProductQuickView from '@/components/ProductQuickView';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    images: string[];
    description: string;
    category_id: string;
    is_new: boolean;
    product_variants: any[];
    colors: string[];
    sizes: string[];
    show_price: boolean;
}

interface Category {
    id: string;
    name: string;
}

interface ShopGridProps {
    products: Product[];
    categories: Category[];
    settings: any;
}

export default function ShopGrid({ products, categories, settings }: ShopGridProps) {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter((p) => p.category_id === activeCategory);
    }, [activeCategory, products]);

    return (
        <>
            {/* Category Filters */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '40px',
                }}
            >
                <button
                    onClick={() => setActiveCategory('All')}
                    style={{
                        padding: '10px 24px',
                        fontSize: '0.75rem',
                        fontWeight: activeCategory === 'All' ? 400 : 300,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        backgroundColor: activeCategory === 'All' ? 'var(--text)' : 'transparent',
                        color: activeCategory === 'All' ? 'var(--bg)' : 'var(--text-muted)',
                        border: `1px solid ${activeCategory === 'All' ? 'var(--text)' : 'var(--border)'}`,
                        transition: 'all var(--transition-fast)',
                        cursor: 'pointer',
                    }}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{
                            padding: '10px 24px',
                            fontSize: '0.75rem',
                            fontWeight: activeCategory === cat.id ? 400 : 300,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            backgroundColor: activeCategory === cat.id ? 'var(--text)' : 'transparent',
                            color: activeCategory === cat.id ? 'var(--bg)' : 'var(--text-muted)',
                            border: `1px solid ${activeCategory === cat.id ? 'var(--text)' : 'var(--border)'}`,
                            transition: 'all var(--transition-fast)',
                            cursor: 'pointer',
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="shop-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px',
                }}
            >
                <AnimatePresence>
                    {filteredProducts.map((product, i) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={i}
                            onQuickView={setQuickViewProduct}
                            settings={settings}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 300 }}>
                        No products found in this category
                    </p>
                </div>
            )}

            <ProductQuickView
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                settings={settings}
            />

            <style jsx global>{`
              @media (max-width: 480px) {
                .shop-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 12px !important;
                }
              }
            `}</style>
        </>
    );
}
