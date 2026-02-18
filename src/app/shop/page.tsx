'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { products, categories, type Product, type Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductQuickView from '@/components/ProductQuickView';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

export default function ShopPage() {
    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get('category') as Category) || 'All';
    const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter((p) => p.category === activeCategory);
    }, [activeCategory]);

    return (
        <>
            {/* Header */}
            <section
                style={{
                    padding: '48px 0 32px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                }}
            >
                <div className="container-wide">
                    <motion.div {...fadeUp}>
                        <p
                            style={{
                                fontSize: '0.7rem',
                                fontWeight: 400,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                marginBottom: '12px',
                            }}
                        >
                            Our Collection
                        </p>
                        <h1 className="heading-lg" style={{ marginBottom: '32px' }}>
                            Shop
                        </h1>

                        {/* Category Filters */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '10px 24px',
                                        fontSize: '0.75rem',
                                        fontWeight: activeCategory === cat ? 400 : 300,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        backgroundColor: activeCategory === cat ? 'var(--text)' : 'transparent',
                                        color: activeCategory === cat ? 'var(--bg)' : 'var(--text-muted)',
                                        border: `1px solid ${activeCategory === cat ? 'var(--text)' : 'var(--border)'}`,
                                        transition: 'all var(--transition-fast)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="section-spacing" style={{ paddingTop: '40px' }}>
                <div className="container-wide">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="shop-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {filteredProducts.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                                onQuickView={setQuickViewProduct}
                            />
                        ))}
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <p
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.5rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 300,
                                }}
                            >
                                No products found in this category
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick View */}
            <ProductQuickView
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />

            {/* Mobile responsive styles */}
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
