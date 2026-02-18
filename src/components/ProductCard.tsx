'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageCircle } from 'lucide-react';
import DynamicWhatsAppButton from '@/components/DynamicWhatsAppButton';

interface ProductCardProps {
    product: any;
    index?: number;
    onQuickView?: (product: any) => void;
    settings?: any;
}

export default function ProductCard({ product, index = 0, onQuickView, settings }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [secondImageLoaded, setSecondImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPlaceholderGradient = (name: string) => {
        const colors = [
            ['#F5F0EB', '#EBE3D9'],
            ['#F0EAE2', '#E5DCD1'],
            ['#F3EDE6', '#E8E0D5'],
        ];
        const idx = name.charCodeAt(0) % colors.length;
        return `linear-gradient(145deg, ${colors[idx][0]}, ${colors[idx][1]})`;
    };

    const showPrice = product.show_price !== false && (settings?.show_prices_global !== false);

    // Ensure image_url is primary, get secondary image for hover
    const primaryImage = product.image_url || (product.images && product.images[0]) || '';
    const allImages = product.images || [];
    const secondaryImage = allImages.find((img: string) => img !== primaryImage) || '';

    return (
        <motion.div
            layout
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div
                className="product-card__image-wrap"
                onClick={() => onQuickView?.(product)}
            >
                {/* Soft placeholder */}
                <div className="product-card__placeholder" style={{ background: getPlaceholderGradient(product.name || '') }}>
                    <span className="product-card__placeholder-text">{product.name}</span>
                </div>

                {/* Primary Image */}
                {!imageError && primaryImage && (
                    <img
                        src={primaryImage}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        className="product-card__img primary"
                        style={{
                            opacity: isHovered && secondaryImage && secondImageLoaded ? 0 : 1,
                            transform: isHovered && !secondaryImage ? 'scale(1.06)' : 'scale(1)',
                        }}
                    />
                )}

                {/* Secondary Image (reveal on hover) */}
                {secondaryImage && (
                    <img
                        src={secondaryImage}
                        alt={`${product.name} - alternate view`}
                        onLoad={() => setSecondImageLoaded(true)}
                        className="product-card__img secondary"
                        style={{
                            opacity: isHovered && secondImageLoaded ? 1 : 0,
                            transform: isHovered ? 'scale(1)' : 'scale(1.04)',
                        }}
                    />
                )}

                {/* Badge */}
                {product.is_new && (
                    <div className="product-card__badge">N E W</div>
                )}

                {/* Quick View Overlay */}
                <div className="product-card__overlay" style={{ opacity: isHovered ? 1 : 0 }}>
                    <button
                        className="product-card__view-btn"
                        style={{
                            transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
                            opacity: isHovered ? 1 : 0,
                        }}
                    >
                        <Eye size={15} strokeWidth={1.5} />
                        Quick View
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="product-card__info">
                <h3
                    className="product-card__name"
                    onClick={() => onQuickView?.(product)}
                >
                    {product.name}
                </h3>
                <div className="product-card__meta">
                    <p className="product-card__price">
                        {showPrice
                            ? formatPrice(product.price)
                            : <span className="product-card__inquire">Inquire</span>
                        }
                    </p>
                    <DynamicWhatsAppButton
                        productName={product.name}
                        productId={product.id}
                        className="product-card__wa-btn"
                    >
                        <MessageCircle size={16} strokeWidth={1.5} />
                    </DynamicWhatsAppButton>
                </div>
            </div>

            <style jsx global>{`
                .product-card {
                    position: relative;
                    cursor: pointer;
                }

                .product-card__image-wrap {
                    position: relative;
                    aspect-ratio: 3 / 4;
                    overflow: hidden;
                    border-radius: 6px;
                    margin-bottom: 14px;
                    background: #F5F0EB;
                }

                .product-card__placeholder {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .product-card__placeholder-text {
                    font-family: var(--font-heading);
                    font-size: clamp(0.7rem, 1.5vw, 1rem);
                    color: rgba(0,0,0,0.08);
                    font-weight: 300;
                    letter-spacing: 0.15em;
                    text-align: center;
                    padding: 20px;
                    text-transform: uppercase;
                }

                .product-card__img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                .product-card__badge {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    padding: 5px 12px;
                    background: rgba(0, 0, 0, 0.85);
                    color: white;
                    font-size: 0.55rem;
                    font-weight: 400;
                    letter-spacing: 0.25em;
                    z-index: 3;
                    backdrop-filter: blur(4px);
                    border-radius: 2px;
                }

                .product-card__overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.25) 100%);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding-bottom: 20px;
                    z-index: 4;
                    transition: opacity 0.35s ease-out;
                    pointer-events: none;
                }

                .product-card__view-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: rgba(255, 255, 255, 0.95);
                    color: var(--text);
                    font-size: 0.68rem;
                    font-weight: 400;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease-out;
                    pointer-events: auto;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .product-card__view-btn:hover {
                    background: white;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }

                .product-card__info {
                    padding: 0 2px;
                }

                .product-card__name {
                    font-family: var(--font-heading);
                    font-size: clamp(0.85rem, 2vw, 1.05rem);
                    font-weight: 400;
                    color: var(--text);
                    margin-bottom: 6px;
                    line-height: 1.3;
                    cursor: pointer;
                    transition: color 0.25s ease-out;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-card:hover .product-card__name {
                    color: var(--accent);
                }

                .product-card__meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .product-card__price {
                    font-size: clamp(0.75rem, 1.5vw, 0.88rem);
                    font-weight: 300;
                    color: var(--text-muted);
                    letter-spacing: 0.03em;
                }

                .product-card__inquire {
                    font-style: italic;
                    opacity: 0.6;
                    font-size: 0.78rem;
                }

                .product-card__wa-btn {
                    width: 34px;
                    height: 34px;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #25D366 !important;
                    color: white !important;
                    transition: all 0.25s ease-out;
                    padding: 0 !important;
                    gap: 0 !important;
                    flex-shrink: 0;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);
                }

                .product-card__wa-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
                }

                @media (max-width: 480px) {
                    .product-card__image-wrap {
                        border-radius: 4px;
                        margin-bottom: 10px;
                    }
                    .product-card__name {
                        font-size: 0.82rem;
                    }
                    .product-card__wa-btn {
                        width: 30px;
                        height: 30px;
                    }
                }
            `}</style>
        </motion.div>
    );
}
