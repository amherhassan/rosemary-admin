'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageCircle } from 'lucide-react';
import { Product, getWhatsAppLink } from '@/data/products';

interface ProductCardProps {
    product: Product;
    index?: number;
    onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Generate a nice gradient placeholder color based on product name
    const getPlaceholderGradient = (name: string) => {
        const colors = [
            ['#E8DDD3', '#D4C5B5'],
            ['#D5CEC5', '#C2B8AB'],
            ['#E0D5CC', '#CFC1B3'],
            ['#DDD8D0', '#C8C0B5'],
            ['#E5DCD4', '#D0C4B6'],
            ['#D8D2CA', '#C5BCB0'],
        ];
        const idx = name.charCodeAt(0) % colors.length;
        return `linear-gradient(145deg, ${colors[idx][0]}, ${colors[idx][1]})`;
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            style={{
                position: 'relative',
                cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image container */}
            <div
                style={{
                    position: 'relative',
                    aspectRatio: '3 / 4',
                    overflow: 'hidden',
                    backgroundColor: 'var(--border-light)',
                    marginBottom: '12px',
                }}
            >
                {/* Placeholder / gradient background */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: getPlaceholderGradient(product.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(0.85rem, 2vw, 1.5rem)',
                            color: 'rgba(0,0,0,0.15)',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            textAlign: 'center',
                            padding: '20px',
                        }}
                    >
                        {product.name}
                    </span>
                </div>

                {/* Actual image */}
                {!imageError && (
                    <img
                        src={product.image}
                        alt={product.name}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            opacity: imageLoaded ? 1 : 0,
                        }}
                    />
                )}

                {/* New badge */}
                {product.isNew && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            padding: '4px 10px',
                            backgroundColor: 'var(--text)',
                            color: 'var(--bg)',
                            fontSize: '0.55rem',
                            fontWeight: 400,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const,
                            zIndex: 2,
                        }}
                    >
                        New
                    </div>
                )}

                {/* Hover overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity var(--transition-base)',
                        zIndex: 2,
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView?.(product);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'white',
                            color: 'var(--text)',
                            fontSize: '0.65rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase' as const,
                            transition: 'all var(--transition-fast)',
                            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                        }}
                    >
                        <Eye size={14} />
                        Quick View
                    </button>
                    <a
                        href={getWhatsAppLink(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '38px',
                            height: '38px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            borderRadius: '50%',
                            transition: 'all var(--transition-fast)',
                            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                        }}
                    >
                        <MessageCircle size={18} />
                    </a>
                </div>
            </div>

            {/* Product info */}
            <div style={{ padding: '0 4px' }}>
                <h3
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
                        fontWeight: 400,
                        marginBottom: '4px',
                        transition: 'color var(--transition-fast)',
                        color: isHovered ? 'var(--accent)' : 'var(--text)',
                    }}
                >
                    {product.name}
                </h3>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                            fontWeight: 300,
                            color: 'var(--text-muted)',
                            letterSpacing: '0.02em',
                        }}
                    >
                        {formatPrice(product.price)}
                    </p>
                    {product.colors.length > 0 && (
                        <p
                            style={{
                                fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                                fontWeight: 200,
                                color: 'var(--text-light)',
                            }}
                        >
                            {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
