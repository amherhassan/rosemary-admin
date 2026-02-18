'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface Props {
    productName?: string;
    productId?: string;
    variant?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export default function DynamicWhatsAppButton({ productName, productId, variant, className, style, children }: Props) {
    const [settings, setSettings] = useState({ number: '94771234567', template: 'Hi, I am interested in {product_name}.' });

    useEffect(() => {
        const stored = localStorage.getItem('rosemary_settings');
        if (stored) {
            setSettings(JSON.parse(stored));
        } else {
            fetch('/api/settings').then(res => res.json()).then(data => {
                const s = {
                    number: data.whatsapp_number || '94771234567',
                    template: data.whatsapp_template || 'Hi, I am interested in {product_name}.'
                };
                setSettings(s);
                localStorage.setItem('rosemary_settings', JSON.stringify(s));
            });
        }
    }, []);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Track Intent only if product is involved
        if (productId) {
            fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
        }

        let text = '';
        if (productName) {
            // Product Specific
            text = settings.template
                .replace('{product_name}', productName)
                .replace('{variant}', variant || '')
                .replace('{url}', window.location.href);
        } else {
            // Generic Inquiry
            text = "Hi, I'd like to know more about your collection at Rosemary.";
        }

        // Clean up double spaces
        text = text.replace(/\s+/g, ' ').trim();

        const url = `https://wa.me/${settings.number}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <button onClick={handleClick} className={className} style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            ...style
        }}>
            {!children && <MessageCircle size={18} />}
            {children || 'Chat on WhatsApp'}
        </button>
    );
}

