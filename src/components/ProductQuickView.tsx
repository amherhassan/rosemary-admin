'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import DynamicWhatsAppButton from '@/components/DynamicWhatsAppButton';

interface ProductQuickViewProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
    settings?: any;
}

export default function ProductQuickView({ product, isOpen, onClose, settings }: ProductQuickViewProps) {
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const touchStartX = useRef(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSelectedVariant(null);
            setActiveImageIndex(0);
            setDirection(0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, product]);

    if (!product) return null;

    const variants = product.product_variants || [];
    const hasVariants = variants.length > 0;

    // Build images array: image_url is ALWAYS first (primary/main image)
    const primaryImage = product.image_url || '';
    const otherImages = (product.images || []).filter((img: string) => img && img !== primaryImage);
    const images = primaryImage ? [primaryImage, ...otherImages] : otherImages.length > 0 ? otherImages : [''];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const showPrice = product.show_price !== false && (settings?.show_prices_global !== false);

    const goToImage = useCallback((newIndex: number) => {
        setDirection(newIndex > activeImageIndex ? 1 : -1);
        setActiveImageIndex(newIndex);
    }, [activeImageIndex]);

    const nextImage = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        if (images.length <= 1) return;
        setDirection(1);
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        if (images.length <= 1) return;
        setDirection(-1);
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    };

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0.5,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? '-100%' : '100%',
            opacity: 0.5,
        }),
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
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={onClose}
                        className="qv-backdrop"
                    />

                    {/* Modal Wrapper */}
                    <div className="qv-wrapper" onClick={onClose}>
                        <motion.div
                            className="qv-modal"
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.97 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button onClick={onClose} className="qv-close" aria-label="Close">
                                <X size={18} strokeWidth={1.5} />
                            </button>

                            <div className="qv-layout">
                                {/* LEFT: Gallery */}
                                <div className="qv-gallery">
                                    <div
                                        className="qv-gallery__main"
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <div className="qv-gallery__img-wrap">
                                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                                <motion.img
                                                    key={activeImageIndex}
                                                    custom={direction}
                                                    variants={slideVariants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{
                                                        x: { type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                                                        opacity: { duration: 0.2 },
                                                    }}
                                                    src={images[activeImageIndex]}
                                                    alt={product.name}
                                                    className="qv-gallery__img"
                                                    draggable={false}
                                                />
                                            </AnimatePresence>
                                        </div>

                                        {/* Nav Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button className="qv-gallery__nav qv-gallery__nav--prev" onClick={prevImage} aria-label="Previous image">
                                                    <ChevronLeft size={20} strokeWidth={1.5} />
                                                </button>
                                                <button className="qv-gallery__nav qv-gallery__nav--next" onClick={nextImage} aria-label="Next image">
                                                    <ChevronRight size={20} strokeWidth={1.5} />
                                                </button>
                                            </>
                                        )}

                                        {/* Image Counter */}
                                        {images.length > 1 && (
                                            <div className="qv-gallery__counter">
                                                {activeImageIndex + 1} / {images.length}
                                            </div>
                                        )}

                                        {product.is_new && <div className="qv-gallery__badge">N E W</div>}
                                    </div>

                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="qv-gallery__thumbs">
                                            {images.map((img: string, i: number) => (
                                                <button
                                                    key={i}
                                                    className={`qv-gallery__thumb ${i === activeImageIndex ? 'qv-gallery__thumb--active' : ''}`}
                                                    onClick={() => goToImage(i)}
                                                    aria-label={`View image ${i + 1}`}
                                                >
                                                    <img src={img} alt="" draggable={false} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: Details */}
                                <div className="qv-details">
                                    <div className="qv-details__scroll">
                                        {/* Header */}
                                        <div className="qv-details__header">
                                            <h2 className="qv-details__title">{product.name}</h2>
                                            {showPrice ? (
                                                <p className="qv-details__price">{formatPrice(product.price)}</p>
                                            ) : (
                                                <p className="qv-details__price qv-details__price--muted">Price upon request</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {product.description && (
                                            <div className="qv-details__desc">
                                                {product.description.split('\n').map((line: string, i: number) => {
                                                    const trimmed = line.trim();
                                                    if (!trimmed) return null;
                                                    const colonIndex = trimmed.indexOf(':');
                                                    if (colonIndex > 0 && colonIndex < 35) {
                                                        const key = trimmed.substring(0, colonIndex).trim();
                                                        const val = trimmed.substring(colonIndex + 1).trim();
                                                        return (
                                                            <div key={i} className="qv-details__spec">
                                                                <span className="qv-details__spec-key">{key}</span>
                                                                <span className="qv-details__spec-val">{val}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return <p key={i} className="qv-details__text">{trimmed}</p>;
                                                })}
                                            </div>
                                        )}

                                        {/* Variants */}
                                        {hasVariants && (
                                            <div className="qv-details__section">
                                                <p className="qv-details__label">
                                                    <Ruler size={14} strokeWidth={1.5} /> Available Options
                                                </p>
                                                <div className="qv-details__variants">
                                                    {variants.map((v: any) => (
                                                        <button
                                                            key={v.id}
                                                            disabled={v.stock_status === 'sold_out'}
                                                            onClick={() => setSelectedVariant(v)}
                                                            className={`qv-variant ${selectedVariant?.id === v.id ? 'qv-variant--active' : ''} ${v.stock_status === 'sold_out' ? 'qv-variant--disabled' : ''}`}
                                                        >
                                                            <span className="qv-variant__size">{v.size}</span>
                                                            <span className="qv-variant__color">{v.color}</span>
                                                            {v.stock_status === 'sold_out' && (
                                                                <span className="qv-variant__status">Sold Out</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Legacy sizes/colors */}
                                        {!hasVariants && (product.sizes?.length > 0 || product.colors?.length > 0) && (
                                            <div className="qv-details__section">
                                                <p className="qv-details__label">Details</p>
                                                <div className="qv-details__inline-specs">
                                                    {product.sizes?.length > 0 && (
                                                        <span><strong>Sizes:</strong> {product.sizes.join(', ')}</span>
                                                    )}
                                                    {product.colors?.length > 0 && (
                                                        <span><strong>Colors:</strong> {product.colors.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fixed Footer with WhatsApp CTA */}
                                    <div className="qv-details__footer">
                                        {hasVariants && !selectedVariant && (
                                            <p className="qv-details__hint">Please select a size/color to continue</p>
                                        )}
                                        <DynamicWhatsAppButton
                                            productName={product.name}
                                            productId={product.id}
                                            variant={selectedVariant ? `${selectedVariant.size} - ${selectedVariant.color}` : ''}
                                            className="qv-whatsapp"
                                        >
                                            <MessageCircle size={20} strokeWidth={1.5} />
                                            {hasVariants && !selectedVariant ? 'Select an Option First' : 'Inquire on WhatsApp'}
                                        </DynamicWhatsAppButton>
                                        <p className="qv-details__footer-note">
                                            Chat directly with us about availability, pricing, or to place an order
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <style jsx global>{`
                        /* ====== BACKDROP ====== */
                        .qv-backdrop {
                            position: fixed; inset: 0; z-index: 1000;
                            background: rgba(0, 0, 0, 0.55);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                        }

                        /* ====== WRAPPER ====== */
                        .qv-wrapper {
                            position: fixed; inset: 0; z-index: 1100;
                            display: flex; align-items: center; justify-content: center;
                            padding: 24px;
                        }

                        /* ====== MODAL ====== */
                        .qv-modal {
                            position: relative;
                            width: 95vw; max-width: 1060px;
                            height: 88vh; max-height: 780px;
                            background: white;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.04);
                        }

                        .qv-close {
                            position: absolute; top: 16px; right: 16px; z-index: 30;
                            width: 42px; height: 42px;
                            display: flex; align-items: center; justify-content: center;
                            background: rgba(255, 255, 255, 0.9);
                            backdrop-filter: blur(8px);
                            border: 1px solid rgba(0, 0, 0, 0.06);
                            border-radius: 50%;
                            cursor: pointer;
                            color: var(--text);
                            transition: all 0.25s ease-out;
                        }
                        .qv-close:hover { background: white; transform: rotate(90deg); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

                        /* ====== LAYOUT (DESKTOP) ====== */
                        .qv-layout {
                            display: grid;
                            grid-template-columns: 1.15fr 1fr;
                            height: 100%;
                        }

                        /* ====== GALLERY ====== */
                        .qv-gallery {
                            background: #F7F5F2;
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            min-height: 0;
                        }

                        .qv-gallery__main {
                            flex: 1;
                            position: relative;
                            overflow: hidden;
                            min-height: 0;
                        }

                        .qv-gallery__img-wrap {
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                        }

                        .qv-gallery__img {
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            user-select: none;
                            -webkit-user-drag: none;
                        }

                        .qv-gallery__nav {
                            position: absolute;
                            top: 50%;
                            z-index: 10;
                            transform: translateY(-50%);
                            width: 44px; height: 44px;
                            background: rgba(255, 255, 255, 0.85);
                            backdrop-filter: blur(8px);
                            border: 1px solid rgba(0, 0, 0, 0.06);
                            border-radius: 50%;
                            display: flex; align-items: center; justify-content: center;
                            cursor: pointer;
                            color: var(--text);
                            transition: all 0.25s ease-out;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                        }
                        .qv-gallery__nav:hover {
                            background: white;
                            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                            transform: translateY(-50%) scale(1.05);
                        }
                        .qv-gallery__nav--prev { left: 16px; }
                        .qv-gallery__nav--next { right: 16px; }

                        .qv-gallery__counter {
                            position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
                            padding: 6px 14px;
                            background: rgba(0, 0, 0, 0.5);
                            backdrop-filter: blur(6px);
                            color: white;
                            font-size: 0.7rem;
                            letter-spacing: 0.1em;
                            border-radius: 20px;
                            z-index: 5;
                        }

                        .qv-gallery__badge {
                            position: absolute; top: 20px; left: 20px;
                            padding: 6px 14px;
                            background: rgba(0, 0, 0, 0.85);
                            color: white;
                            font-size: 0.6rem;
                            font-weight: 400;
                            letter-spacing: 0.25em;
                            border-radius: 3px;
                            z-index: 5;
                        }

                        .qv-gallery__thumbs {
                            display: flex; gap: 8px;
                            padding: 14px 20px;
                            background: rgba(0, 0, 0, 0.02);
                            overflow-x: auto;
                            justify-content: center;
                            border-top: 1px solid rgba(0,0,0,0.04);
                            flex-shrink: 0;
                        }

                        .qv-gallery__thumb {
                            width: 56px; height: 72px;
                            border-radius: 6px;
                            overflow: hidden;
                            padding: 0;
                            border: 2px solid transparent;
                            cursor: pointer;
                            opacity: 0.5;
                            transition: all 0.25s ease-out;
                            background: white;
                            flex-shrink: 0;
                        }
                        .qv-gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
                        .qv-gallery__thumb:hover { opacity: 0.8; }
                        .qv-gallery__thumb--active { opacity: 1; border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }

                        /* ====== DETAILS ====== */
                        .qv-details {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            background: white;
                            min-height: 0;
                            overflow: hidden;
                        }

                        .qv-details__scroll {
                            flex: 1;
                            overflow-y: auto;
                            padding: 40px 36px 20px;
                            min-height: 0;
                        }

                        .qv-details__header {
                            margin-bottom: 28px;
                            padding-bottom: 24px;
                            border-bottom: 1px solid #F0EDE8;
                        }

                        .qv-details__title {
                            font-family: var(--font-heading);
                            font-size: 1.8rem;
                            font-weight: 300;
                            line-height: 1.25;
                            color: var(--text);
                            margin-bottom: 12px;
                        }

                        .qv-details__price {
                            font-size: 1.3rem;
                            font-weight: 400;
                            color: var(--text);
                            letter-spacing: 0.02em;
                        }
                        .qv-details__price--muted { color: var(--text-muted); font-size: 1rem; font-style: italic; }

                        .qv-details__desc {
                            margin-bottom: 28px;
                        }

                        .qv-details__spec {
                            display: flex;
                            padding: 8px 0;
                            border-bottom: 1px solid #F5F3F0;
                            font-size: 0.88rem;
                        }
                        .qv-details__spec-key {
                            color: var(--text);
                            font-weight: 500;
                            min-width: 140px;
                            flex-shrink: 0;
                        }
                        .qv-details__spec-val {
                            color: var(--text-muted);
                            font-weight: 300;
                        }

                        .qv-details__text {
                            font-size: 0.9rem;
                            color: var(--text-muted);
                            line-height: 1.7;
                            margin-bottom: 8px;
                            font-weight: 300;
                        }

                        .qv-details__section { margin-bottom: 24px; }

                        .qv-details__label {
                            font-size: 0.72rem;
                            text-transform: uppercase;
                            letter-spacing: 0.12em;
                            color: var(--text-muted);
                            margin-bottom: 14px;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }

                        .qv-details__variants {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                            gap: 10px;
                        }

                        .qv-details__inline-specs {
                            display: flex; gap: 24px;
                            font-size: 0.88rem;
                            color: var(--text-muted);
                        }

                        .qv-variant {
                            display: flex; flex-direction: column; align-items: center;
                            padding: 12px 8px;
                            border: 1px solid #E8E4DE;
                            background: white;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: all 0.2s ease-out;
                        }
                        .qv-variant:hover:not(.qv-variant--disabled) { border-color: var(--accent); background: #FBF8FF; }
                        .qv-variant--active { border-color: var(--accent); background: #FBF8FF; box-shadow: 0 0 0 1px var(--accent); }
                        .qv-variant--disabled { opacity: 0.45; cursor: not-allowed; background: #FAFAFA; }
                        .qv-variant__size { font-weight: 600; font-size: 0.95rem; color: var(--text); }
                        .qv-variant__color { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
                        .qv-variant__status { font-size: 0.6rem; color: #DC2626; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

                        /* ====== FOOTER (ALWAYS VISIBLE) ====== */
                        .qv-details__footer {
                            padding: 20px 36px 28px;
                            border-top: 1px solid #F0EDE8;
                            background: white;
                            flex-shrink: 0;
                        }

                        .qv-details__hint {
                            text-align: center;
                            font-size: 0.75rem;
                            color: #DC2626;
                            margin-bottom: 10px;
                        }

                        .qv-whatsapp {
                            width: 100%;
                            display: flex !important;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            padding: 16px 24px;
                            background: #25D366 !important;
                            color: white !important;
                            border: none;
                            border-radius: 10px;
                            font-size: 0.92rem;
                            font-weight: 500;
                            letter-spacing: 0.04em;
                            text-transform: uppercase;
                            cursor: pointer;
                            transition: all 0.25s ease-out;
                            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.25);
                        }
                        .qv-whatsapp:hover {
                            background: #1DB954 !important;
                            transform: translateY(-2px);
                            box-shadow: 0 8px 24px rgba(37, 211, 102, 0.35);
                        }

                        .qv-details__footer-note {
                            text-align: center;
                            font-size: 0.72rem;
                            color: var(--text-muted);
                            margin-top: 10px;
                            font-weight: 300;
                        }

                        /* ====== MOBILE ====== */
                        @media (max-width: 900px) {
                            .qv-wrapper {
                                padding: 0;
                                align-items: flex-end;
                            }
                            .qv-modal {
                                width: 100%;
                                height: 92vh;
                                max-height: none;
                                border-radius: 20px 20px 0 0;
                            }
                            .qv-layout {
                                display: flex;
                                flex-direction: column;
                                height: 100%;
                                overflow: hidden;
                            }
                            /* Gallery takes top portion */
                            .qv-gallery {
                                height: auto;
                                min-height: 0;
                                flex: 0 0 42vh;
                                max-height: 42vh;
                            }
                            .qv-gallery__main {
                                min-height: 0;
                                flex: 1;
                            }
                            .qv-gallery__thumbs {
                                padding: 8px 12px;
                            }
                            .qv-gallery__thumb {
                                width: 44px; height: 56px;
                            }
                            .qv-gallery__nav {
                                width: 36px; height: 36px;
                            }
                            .qv-gallery__nav--prev { left: 10px; }
                            .qv-gallery__nav--next { right: 10px; }
                            /* Details takes remaining space */
                            .qv-details {
                                flex: 1;
                                min-height: 0;
                                overflow: hidden;
                            }
                            .qv-details__scroll {
                                padding: 20px 20px 10px;
                                flex: 1;
                                overflow-y: auto;
                                min-height: 0;
                            }
                            .qv-details__header {
                                margin-bottom: 16px;
                                padding-bottom: 16px;
                            }
                            .qv-details__title {
                                font-size: 1.25rem;
                                margin-bottom: 8px;
                            }
                            .qv-details__price {
                                font-size: 1.1rem;
                            }
                            .qv-details__desc {
                                margin-bottom: 16px;
                            }
                            .qv-details__spec {
                                font-size: 0.82rem;
                                padding: 6px 0;
                            }
                            .qv-details__spec-key {
                                min-width: 110px;
                            }
                            .qv-details__variants {
                                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                                gap: 8px;
                            }
                            .qv-details__footer {
                                padding: 14px 20px 20px;
                                flex-shrink: 0;
                                box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
                            }
                            .qv-whatsapp {
                                padding: 14px 20px;
                                font-size: 0.85rem;
                            }
                            .qv-details__footer-note {
                                font-size: 0.68rem;
                                margin-top: 8px;
                            }
                            .qv-close {
                                top: 10px; right: 10px;
                                width: 36px; height: 36px;
                                background: rgba(255,255,255,0.95);
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                            }
                        }

                        @media (prefers-reduced-motion: reduce) {
                            .qv-gallery__img { transition: none !important; }
                            .qv-gallery__nav, .qv-close, .qv-whatsapp { transition: none !important; }
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}
