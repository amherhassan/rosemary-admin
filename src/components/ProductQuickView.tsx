'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Ruler } from 'lucide-react';
import { Product, getWhatsAppLink } from '@/data/products';

interface ProductQuickViewProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!product) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
        }).format(price);
    };

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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="qv-backdrop"
                    />

                    {/* Desktop: centered modal / Mobile: bottom sheet */}
                    <div className="qv-wrapper" onClick={onClose}>
                        <motion.div
                            className="qv-modal"
                            initial={{ opacity: 0, y: 60, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="qv-close"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            {/* Drag handle for mobile (visual cue) */}
                            <div className="qv-drag-handle">
                                <div className="qv-drag-pill" />
                            </div>

                            <div className="qv-content">
                                {/* Image */}
                                <div className="qv-image-container">
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
                                                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                                                color: 'rgba(0,0,0,0.12)',
                                                fontWeight: 300,
                                                letterSpacing: '0.1em',
                                                textAlign: 'center',
                                                padding: '20px',
                                            }}
                                        >
                                            {product.name}
                                        </span>
                                    </div>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    />
                                    {product.isNew && (
                                        <div className="qv-new-badge">New</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="qv-details">
                                    <p className="qv-category">{product.category}</p>
                                    <h2 className="qv-title">{product.name}</h2>
                                    <p className="qv-price">{formatPrice(product.price)}</p>
                                    <p className="qv-description">{product.description}</p>

                                    {/* Sizes */}
                                    <div className="qv-section">
                                        <p className="qv-section-label">
                                            <Ruler size={12} />
                                            Available Sizes
                                        </p>
                                        <div className="qv-sizes">
                                            {product.sizes.map((size) => (
                                                <span key={size} className="qv-size-tag">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="qv-section">
                                        <p className="qv-section-label">Colors</p>
                                        <p className="qv-colors">{product.colors.join(', ')}</p>
                                    </div>

                                    {/* WhatsApp CTA */}
                                    <a
                                        href={getWhatsAppLink(product.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="qv-cta"
                                    >
                                        <MessageCircle size={16} />
                                        Inquire on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <style jsx global>{`
                        .qv-backdrop {
                            position: fixed;
                            inset: 0;
                            z-index: 1100;
                            background-color: rgba(0, 0, 0, 0.5);
                            backdrop-filter: blur(4px);
                        }

                        .qv-wrapper {
                            position: fixed;
                            inset: 0;
                            z-index: 1200;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                        }

                        .qv-modal {
                            position: relative;
                            width: 90vw;
                            max-width: 900px;
                            max-height: 85vh;
                            background-color: var(--bg);
                            overflow: hidden;
                            box-shadow: var(--shadow-xl);
                        }

                        .qv-close {
                            position: absolute;
                            top: 12px;
                            right: 12px;
                            z-index: 10;
                            width: 36px;
                            height: 36px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: var(--bg);
                            border: 1px solid var(--border);
                            cursor: pointer;
                            transition: all var(--transition-fast);
                            border-radius: 50%;
                        }
                        .qv-close:hover {
                            background-color: var(--text);
                            color: var(--bg);
                        }

                        .qv-drag-handle {
                            display: none;
                        }

                        .qv-content {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            max-height: 85vh;
                            overflow: auto;
                        }

                        .qv-image-container {
                            aspect-ratio: 3 / 4;
                            overflow: hidden;
                            position: relative;
                        }

                        .qv-new-badge {
                            position: absolute;
                            top: 16px;
                            left: 16px;
                            padding: 5px 12px;
                            background-color: var(--text);
                            color: var(--bg);
                            font-size: 0.6rem;
                            font-weight: 400;
                            letter-spacing: 0.2em;
                            text-transform: uppercase;
                            z-index: 2;
                        }

                        .qv-details {
                            padding: 36px 32px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            overflow-y: auto;
                        }

                        .qv-category {
                            font-size: 0.7rem;
                            font-weight: 400;
                            letter-spacing: 0.2em;
                            text-transform: uppercase;
                            color: var(--accent);
                            margin-bottom: 8px;
                        }

                        .qv-title {
                            font-family: var(--font-heading);
                            font-size: clamp(1.5rem, 3vw, 2.2rem);
                            font-weight: 300;
                            margin-bottom: 8px;
                        }

                        .qv-price {
                            font-size: 1.15rem;
                            font-weight: 300;
                            color: var(--text-muted);
                            margin-bottom: 20px;
                        }

                        .qv-description {
                            font-size: 0.9rem;
                            font-weight: 200;
                            line-height: 1.7;
                            color: var(--text-muted);
                            margin-bottom: 24px;
                        }

                        .qv-section {
                            margin-bottom: 16px;
                        }

                        .qv-section-label {
                            font-size: 0.7rem;
                            font-weight: 400;
                            letter-spacing: 0.15em;
                            text-transform: uppercase;
                            margin-bottom: 8px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }

                        .qv-sizes {
                            display: flex;
                            gap: 8px;
                            flex-wrap: wrap;
                        }

                        .qv-size-tag {
                            padding: 8px 16px;
                            border: 1px solid var(--border);
                            font-size: 0.8rem;
                            font-weight: 300;
                            letter-spacing: 0.05em;
                        }

                        .qv-colors {
                            font-size: 0.9rem;
                            font-weight: 200;
                            color: var(--text-muted);
                        }

                        .qv-cta {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            width: 100%;
                            padding: 14px 36px;
                            background: var(--accent);
                            color: white;
                            font-family: var(--font-body);
                            font-size: 0.8rem;
                            font-weight: 400;
                            letter-spacing: 0.15em;
                            text-transform: uppercase;
                            border: 1px solid var(--accent);
                            transition: all var(--transition-base);
                            text-align: center;
                            margin-top: 8px;
                        }
                        .qv-cta:hover {
                            background: var(--accent-hover);
                            border-color: var(--accent-hover);
                        }

                        /* ===== MOBILE: Full-screen bottom sheet ===== */
                        @media (max-width: 768px) {
                            .qv-wrapper {
                                align-items: flex-end;
                                padding: 0;
                            }

                            .qv-modal {
                                width: 100%;
                                max-width: 100%;
                                max-height: 92vh;
                                border-radius: 20px 20px 0 0;
                            }

                            .qv-close {
                                top: 8px;
                                right: 12px;
                                width: 32px;
                                height: 32px;
                            }

                            .qv-drag-handle {
                                display: flex;
                                justify-content: center;
                                padding: 12px 0 4px;
                            }
                            .qv-drag-pill {
                                width: 36px;
                                height: 4px;
                                background: var(--border);
                                border-radius: 2px;
                            }

                            .qv-content {
                                grid-template-columns: 1fr;
                                max-height: calc(92vh - 32px);
                                -webkit-overflow-scrolling: touch;
                            }

                            .qv-image-container {
                                aspect-ratio: 4 / 3;
                                max-height: 280px;
                            }

                            .qv-details {
                                padding: 20px 20px 32px;
                            }

                            .qv-title {
                                font-size: 1.5rem;
                            }

                            .qv-price {
                                font-size: 1rem;
                                margin-bottom: 16px;
                            }

                            .qv-description {
                                font-size: 0.85rem;
                                margin-bottom: 20px;
                                line-height: 1.6;
                            }

                            .qv-size-tag {
                                padding: 6px 14px;
                                font-size: 0.75rem;
                            }

                            .qv-cta {
                                padding: 14px 24px;
                                font-size: 0.75rem;
                                position: sticky;
                                bottom: 0;
                                margin-top: 12px;
                            }
                        }

                        /* Extra small phones */
                        @media (max-width: 374px) {
                            .qv-image-container {
                                max-height: 220px;
                            }
                            .qv-details {
                                padding: 16px 16px 28px;
                            }
                            .qv-title {
                                font-size: 1.3rem;
                            }
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}
