'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductQuickView from '@/components/ProductQuickView';
import DynamicWhatsAppButton from '@/components/DynamicWhatsAppButton';

interface HomeClientProps {
    featuredProducts: any[];
    newArrivals: any[];
    categories: any[];
    heroSections: any[];
    settings: any;
}

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

export default function HomeClient({ featuredProducts, newArrivals, categories, heroSections, settings }: HomeClientProps) {
    const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

    // Use first active hero section, or fallback defaults
    const hero = heroSections[0] || {};
    const heroTitle = hero.title || 'New Collection 2026';
    const heroSubtitle = hero.subtitle || 'Elegance in Simplicity';
    const heroDesc = hero.description || 'Thoughtfully designed pieces for the modern woman. Each garment tells a story of refined craftsmanship and timeless style.';
    const heroCtaText = hero.cta_text || 'Explore Collection';
    const heroCtaLink = hero.cta_link || '/shop';
    const heroBgImage = hero.bg_image_url || '';

    // Split subtitle to style the second word
    const subtitleWords = heroSubtitle.split(' ');
    const firstPart = subtitleWords.slice(0, -1).join(' ');
    const lastWord = subtitleWords[subtitleWords.length - 1];

    return (
        <>
            {/* ===== HERO ===== */}
            <section
                style={{
                    minHeight: 'calc(100vh - var(--nav-height))',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background gradient */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #F0E8DE 0%, #E8DDCF 40%, #DDD0C0 100%)',
                    }}
                />
                {/* Background image from admin */}
                {heroBgImage && (
                    <>
                        <img
                            src={heroBgImage}
                            alt=""
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center top',
                            }}
                        />
                        {/* Overlay for text readability */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to right, rgba(42,37,32,0.65) 0%, rgba(42,37,32,0.3) 50%, transparent 80%)',
                            }}
                        />
                    </>
                )}
                {/* Decorative circle (only when no bg image) */}
                {!heroBgImage && (
                    <div
                        style={{
                            position: 'absolute',
                            right: '-10%',
                            top: '10%',
                            width: '60vw',
                            height: '60vw',
                            maxWidth: '700px',
                            maxHeight: '700px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(201,168,124,0.08) 0%, transparent 70%)',
                        }}
                    />
                )}

                <div
                    className="container-wide"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        alignItems: 'center',
                        gap: '48px',
                        paddingTop: '40px',
                        paddingBottom: '40px',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                        style={{ maxWidth: '600px' }}
                    >
                        <p
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: heroBgImage ? 'var(--tan-light)' : 'var(--accent)',
                                marginBottom: '20px',
                            }}
                        >
                            {heroTitle}
                        </p>
                        <h1 className="heading-xl" style={{ marginBottom: '24px', color: heroBgImage ? 'white' : 'var(--text)' }}>
                            {firstPart}{' '}
                            <span style={{ fontStyle: 'italic', color: heroBgImage ? 'var(--tan-light)' : 'var(--accent)' }}>{lastWord}</span>
                        </h1>
                        <p
                            className="hero-desc"
                            style={{
                                fontSize: '1rem',
                                fontWeight: 200,
                                lineHeight: 1.7,
                                color: heroBgImage ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                                marginBottom: '32px',
                                maxWidth: '460px',
                            }}
                        >
                            {heroDesc}
                        </p>
                        <div className="hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link
                                href={heroCtaLink}
                                className="btn-primary"
                                style={heroBgImage ? {
                                    background: 'white',
                                    color: 'var(--text)',
                                    borderColor: 'white',
                                } : undefined}
                            >
                                {heroCtaText}
                                <ArrowRight size={16} />
                            </Link>

                            <DynamicWhatsAppButton
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '16px 32px',
                                    backgroundColor: 'transparent',
                                    color: heroBgImage ? 'white' : 'var(--text)',
                                    fontSize: '0.85rem',
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    border: heroBgImage ? '1px solid rgba(255,255,255,0.5)' : '1px solid var(--text)',
                                    transition: 'all var(--transition-base)',
                                    cursor: 'pointer',
                                }}
                            >
                                <MessageCircle size={16} />
                                Chat with Us
                            </DynamicWhatsAppButton>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <p
                        style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: heroBgImage ? 'rgba(255,255,255,0.5)' : 'var(--text-light)',
                            fontWeight: 300,
                        }}
                    >
                        Scroll
                    </p>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        style={{
                            width: '1px',
                            height: '30px',
                            backgroundColor: heroBgImage ? 'rgba(255,255,255,0.4)' : 'var(--text-light)',
                        }}
                    />
                </motion.div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section
                style={{
                    padding: '100px 0',
                    background: 'var(--bg-warm)',
                }}
            >
                <div className="container-wide">
                    <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p
                            style={{
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--tan-dark)',
                                marginBottom: '14px',
                            }}
                        >
                            Collections
                        </p>
                        <h2 className="heading-lg">Shop by Category</h2>
                        <div
                            style={{
                                width: '48px',
                                height: '2px',
                                background: 'var(--tan)',
                                margin: '20px auto 0',
                                borderRadius: '1px',
                            }}
                        />
                    </motion.div>

                    <div
                        className="category-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, minmax(0, 300px))`,
                            gap: '24px',
                            justifyContent: 'center',
                        }}
                    >
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                            >
                                <Link
                                    href={`/shop?category=${cat.name}`}
                                    style={{
                                        display: 'block',
                                        position: 'relative',
                                        aspectRatio: '3 / 4',
                                        overflow: 'hidden',
                                        backgroundColor: 'var(--tan-light)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(42, 37, 32, 0.08)',
                                        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(42, 37, 32, 0.14)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(42, 37, 32, 0.08)';
                                    }}
                                >
                                    {cat.image_url && (
                                        <img
                                            src={cat.image_url}
                                            alt={cat.name}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.6s ease-out',
                                            }}
                                        />
                                    )}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            padding: '28px 16px',
                                            background: cat.image_url
                                                ? 'linear-gradient(to top, rgba(42,37,32,0.7) 0%, rgba(42,37,32,0.15) 45%, transparent 100%)'
                                                : 'transparent',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '1.7rem',
                                                fontWeight: 300,
                                                marginBottom: '4px',
                                                color: cat.image_url ? 'white' : 'var(--text)',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEW ARRIVALS ===== */}
            <section className="section-spacing" style={{ backgroundColor: 'white' }}>
                <div className="container-wide">
                    <motion.div
                        {...fadeUp}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '48px',
                            flexWrap: 'wrap',
                            gap: '16px',
                        }}
                    >
                        <div>
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
                                Just In
                            </p>
                            <h2 className="heading-lg">New Arrivals</h2>
                        </div>
                        <Link
                            href="/shop"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 300,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                transition: 'color var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>

                    <div
                        className="product-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {newArrivals.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                                onQuickView={setQuickViewProduct}
                                settings={settings}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BRAND STRIP ===== */}
            <section className="section-spacing">
                <div className="container-wide">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '48px',
                            alignItems: 'center',
                        }}
                        className="brand-strip-grid"
                    >
                        <motion.div {...fadeUp}>
                            <p
                                style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 400,
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    color: 'var(--accent)',
                                    marginBottom: '16px',
                                }}
                            >
                                Our Philosophy
                            </p>
                            <h2
                                className="heading-md"
                                style={{ marginBottom: '24px', maxWidth: '500px' }}
                            >
                                Crafted with intention, worn with confidence
                            </h2>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 200,
                                    lineHeight: 2,
                                    color: 'var(--text-muted)',
                                    marginBottom: '32px',
                                    maxWidth: '480px',
                                }}
                            >
                                At Rosemary, we believe in the power of simplicity. Every piece in our collection
                                is thoughtfully designed to blend seamlessly into your wardrobe — garments that
                                transcend seasons, trends, and time.
                            </p>
                            <Link href="/about" className="btn-outline">
                                Our Story
                                <ArrowRight size={14} />
                            </Link>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            style={{
                                aspectRatio: '4 / 3',
                                background: settings?.philosophy_image ? `url(${settings.philosophy_image})` : 'linear-gradient(145deg, #E8DDD3, #D4C5B5)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {!settings?.philosophy_image && (
                                <span
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '3rem',
                                        color: 'rgba(0,0,0,0.08)',
                                        fontWeight: 300,
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    Rosemary
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURED ===== */}
            <section className="section-spacing" style={{ backgroundColor: 'white' }}>
                <div className="container-wide">
                    <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '60px' }}>
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
                            Curated
                        </p>
                        <h2 className="heading-lg">Featured Pieces</h2>
                    </motion.div>

                    <div
                        className="product-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {featuredProducts.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                                onQuickView={setQuickViewProduct}
                                settings={settings}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHATSAPP CTA ===== */}
            <section
                className="whatsapp-cta-section"
                style={{
                    padding: '80px 0',
                    backgroundColor: 'var(--bg-dark)',
                    textAlign: 'center',
                }}
            >
                <div className="container-wide">
                    <motion.div {...fadeUp}>
                        <h2
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                                fontWeight: 300,
                                color: 'white',
                                marginBottom: '16px',
                            }}
                        >
                            Like what you see?
                        </h2>
                        <p
                            style={{
                                fontSize: '1rem',
                                fontWeight: 200,
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: '40px',
                                maxWidth: '400px',
                                margin: '0 auto 40px',
                            }}
                        >
                            Get in touch with us on WhatsApp. We&apos;d love to help you find your perfect piece.
                        </p>

                        <DynamicWhatsAppButton
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 40px',
                                backgroundColor: '#25D366',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 400,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all var(--transition-base)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <MessageCircle size={18} />
                            Chat on WhatsApp
                        </DynamicWhatsAppButton>
                    </motion.div>
                </div>
            </section>

            {/* Quick view modal */}
            <ProductQuickView
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                settings={settings}
            />

            {/* Responsive styles */}
            <style jsx global>{`
                @media (min-width: 768px) {
                    .brand-strip-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 480px) {
                    .hero-buttons {
                        flex-direction: column !important;
                        width: 100%;
                    }
                    .hero-buttons a,
                    .hero-buttons .btn-primary,
                    .hero-buttons .btn-outline,
                    .hero-buttons button {
                        width: 100%;
                        justify-content: center;
                        text-align: center;
                    }
                    .product-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
                        gap: 12px !important;
                    }
                    .category-grid {
                        gap: 12px !important;
                    }
                    .whatsapp-cta-section {
                        padding: 56px 0 !important;
                    }
                }
            `}</style>
        </>
    );
}
