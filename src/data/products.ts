export interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    category: string;
    description: string;
    image: string;
    images: string[];
    isNew: boolean;
    isFeatured: boolean;
    sizes: string[];
    colors: string[];
}

export const categories = [
    'All',
    'Dresses',
    'Tops',
    'Bottoms',
    'Accessories',
] as const;

export type Category = (typeof categories)[number];

export const products: Product[] = [
    {
        id: 'rs-001',
        name: 'Silk Wrap Dress',
        price: 12500,
        currency: 'LKR',
        category: 'Dresses',
        description: 'Elegant silk wrap dress with a flattering silhouette. Perfect for evening occasions or dressed down with sandals for brunch.',
        image: '/images/products/silk-wrap-dress.jpg',
        images: ['/images/products/silk-wrap-dress.jpg'],
        isNew: true,
        isFeatured: true,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Champagne', 'Ivory'],
    },
    {
        id: 'rs-002',
        name: 'Linen Midi Skirt',
        price: 7800,
        currency: 'LKR',
        category: 'Bottoms',
        description: 'A timeless linen midi skirt with a relaxed fit. Pairs beautifully with tucked-in blouses and heeled mules.',
        image: '/images/products/linen-midi-skirt.jpg',
        images: ['/images/products/linen-midi-skirt.jpg'],
        isNew: false,
        isFeatured: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Sand', 'Olive'],
    },
    {
        id: 'rs-003',
        name: 'Cashmere Knit Top',
        price: 9500,
        currency: 'LKR',
        category: 'Tops',
        description: 'Buttery-soft cashmere knit top with a relaxed crew neck. An everyday luxury that elevates any outfit.',
        image: '/images/products/cashmere-knit.jpg',
        images: ['/images/products/cashmere-knit.jpg'],
        isNew: true,
        isFeatured: false,
        sizes: ['S', 'M', 'L'],
        colors: ['Cream', 'Blush'],
    },
    {
        id: 'rs-004',
        name: 'Tailored Wide-Leg Trousers',
        price: 8900,
        currency: 'LKR',
        category: 'Bottoms',
        description: 'Impeccably tailored wide-leg trousers in fluid crepe. The perfect foundation for both office and weekend looks.',
        image: '/images/products/wide-leg-trousers.jpg',
        images: ['/images/products/wide-leg-trousers.jpg'],
        isNew: false,
        isFeatured: true,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Black', 'Taupe'],
    },
    {
        id: 'rs-005',
        name: 'Pleated Maxi Dress',
        price: 14200,
        currency: 'LKR',
        category: 'Dresses',
        description: 'A stunning pleated maxi dress that moves with grace. Effortless elegance for special occasions.',
        image: '/images/products/pleated-maxi.jpg',
        images: ['/images/products/pleated-maxi.jpg'],
        isNew: true,
        isFeatured: true,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Dusty Rose', 'Sage'],
    },
    {
        id: 'rs-006',
        name: 'Oversized Blazer',
        price: 11000,
        currency: 'LKR',
        category: 'Tops',
        description: 'A modern oversized blazer with structured shoulders. The ultimate layering piece for any season.',
        image: '/images/products/oversized-blazer.jpg',
        images: ['/images/products/oversized-blazer.jpg'],
        isNew: false,
        isFeatured: false,
        sizes: ['S', 'M', 'L'],
        colors: ['Oatmeal', 'Charcoal'],
    },
    {
        id: 'rs-007',
        name: 'Satin Camisole',
        price: 5200,
        currency: 'LKR',
        category: 'Tops',
        description: 'Luxurious satin camisole with delicate adjustable straps. Layer under blazers or wear solo for evening.',
        image: '/images/products/satin-camisole.jpg',
        images: ['/images/products/satin-camisole.jpg'],
        isNew: false,
        isFeatured: false,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Pearl', 'Black'],
    },
    {
        id: 'rs-008',
        name: 'Woven Straw Tote',
        price: 4800,
        currency: 'LKR',
        category: 'Accessories',
        description: 'Handwoven straw tote with leather handles. The perfect companion for markets, beaches, and brunch.',
        image: '/images/products/straw-tote.jpg',
        images: ['/images/products/straw-tote.jpg'],
        isNew: true,
        isFeatured: false,
        sizes: ['One Size'],
        colors: ['Natural'],
    },
    {
        id: 'rs-009',
        name: 'A-Line Shirt Dress',
        price: 10200,
        currency: 'LKR',
        category: 'Dresses',
        description: 'Classic A-line shirt dress in soft cotton poplin. Button-down front with a self-tie belt for effortless styling.',
        image: '/images/products/shirt-dress.jpg',
        images: ['/images/products/shirt-dress.jpg'],
        isNew: false,
        isFeatured: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Pale Blue'],
    },
    {
        id: 'rs-010',
        name: 'Gold Pendant Necklace',
        price: 3900,
        currency: 'LKR',
        category: 'Accessories',
        description: 'Minimalist gold-plated pendant on a fine chain. Subtle elegance for everyday wear.',
        image: '/images/products/gold-pendant.jpg',
        images: ['/images/products/gold-pendant.jpg'],
        isNew: false,
        isFeatured: true,
        sizes: ['One Size'],
        colors: ['Gold'],
    },
    {
        id: 'rs-011',
        name: 'Cropped Linen Blouse',
        price: 6200,
        currency: 'LKR',
        category: 'Tops',
        description: 'A breezy cropped linen blouse with puff sleeves. Effortlessly chic for warm sunny days.',
        image: '/images/products/linen-blouse.jpg',
        images: ['/images/products/linen-blouse.jpg'],
        isNew: true,
        isFeatured: false,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['White', 'Terracotta'],
    },
    {
        id: 'rs-012',
        name: 'Silk Scarf',
        price: 3200,
        currency: 'LKR',
        category: 'Accessories',
        description: 'Hand-printed silk scarf with an abstract floral motif. Tie it in your hair, around your neck, or on your bag.',
        image: '/images/products/silk-scarf.jpg',
        images: ['/images/products/silk-scarf.jpg'],
        isNew: false,
        isFeatured: false,
        sizes: ['One Size'],
        colors: ['Blush Multi'],
    },
];

export const WHATSAPP_NUMBER = '94771234567'; // Replace with actual number

export function getWhatsAppLink(productName?: string): string {
    const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    if (productName) {
        const message = encodeURIComponent(
            `Hi! I'm interested in the "${productName}" from Rosemary. Could you share more details?`
        );
        return `${baseUrl}?text=${message}`;
    }
    const message = encodeURIComponent(
        `Hi! I'd like to know more about your collection at Rosemary.`
    );
    return `${baseUrl}?text=${message}`;
}
