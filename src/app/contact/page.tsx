'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Mail, Instagram, MapPin } from 'lucide-react';
import { getWhatsAppLink } from '@/data/products';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

const contactMethods = [
    {
        icon: MessageCircle,
        label: 'WhatsApp',
        value: 'Chat with us',
        desc: 'Quick replies, usually within minutes',
        href: '#wa',
        isWhatsApp: true,
        color: '#25D366',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'hello@rosemary.lk',
        desc: 'For detailed inquiries and collaborations',
        href: 'mailto:hello@rosemary.lk',
        isWhatsApp: false,
        color: 'var(--accent)',
    },
    {
        icon: Instagram,
        label: 'Instagram',
        value: '@rosemary.lk',
        desc: 'Follow us for latest drops and styling tips',
        href: 'https://instagram.com/rosemary.lk',
        isWhatsApp: false,
        color: '#E4405F',
    },
    {
        icon: MapPin,
        label: 'Visit Us',
        value: 'Colombo, Sri Lanka',
        desc: 'By appointment only',
        href: '#',
        isWhatsApp: false,
        color: 'var(--text)',
    },
];

export default function ContactPage() {
    return (
        <>
            {/* Header */}
            <section
                style={{
                    padding: '56px 0 40px',
                    background: 'linear-gradient(180deg, #F0EBE5 0%, var(--bg) 100%)',
                    textAlign: 'center',
                }}
            >
                <div className="container-wide" style={{ maxWidth: '700px' }}>
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
                            Get in Touch
                        </p>
                        <h1 className="heading-lg" style={{ marginBottom: '24px' }}>
                            Contact Us
                        </h1>
                        <p
                            style={{
                                fontSize: '1rem',
                                fontWeight: 200,
                                lineHeight: 1.8,
                                color: 'var(--text-muted)',
                            }}
                        >
                            We&apos;d love to hear from you. Whether you&apos;re interested in a piece from our
                            collection or want to learn more, reach out anytime.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact methods */}
            <section className="section-spacing" style={{ backgroundColor: 'white' }}>
                <div className="container-wide">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '60px',
                        }}
                    >
                        {contactMethods.map((method, i) => {
                            const Icon = method.icon;
                            return (
                                <motion.a
                                    key={method.label}
                                    href={method.isWhatsApp ? getWhatsAppLink() : method.href}
                                    target={method.href.startsWith('http') || method.isWhatsApp ? '_blank' : undefined}
                                    rel={method.href.startsWith('http') || method.isWhatsApp ? 'noopener noreferrer' : undefined}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    style={{
                                        display: 'block',
                                        padding: '28px 20px',
                                        border: '1px solid var(--border)',
                                        textAlign: 'center',
                                        transition: 'all var(--transition-base)',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: `${method.color}10`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            color: method.color,
                                        }}
                                    >
                                        <Icon size={22} />
                                    </div>
                                    <p
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 400,
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: 'var(--text-muted)',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {method.label}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '1.05rem',
                                            fontWeight: 400,
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {method.value}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 200,
                                            color: 'var(--text-light)',
                                        }}
                                    >
                                        {method.desc}
                                    </p>
                                </motion.a>
                            );
                        })}
                    </div>

                    {/* Contact form */}
                    <motion.div
                        {...fadeUp}
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        <h2
                            className="heading-md"
                            style={{ textAlign: 'center', marginBottom: '32px' }}
                        >
                            Send us a message
                        </h2>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '24px',
                                }}
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        style={{
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 400,
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            marginBottom: '8px',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--bg)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.9rem',
                                            fontWeight: 200,
                                            color: 'var(--text)',
                                            outline: 'none',
                                            transition: 'border-color var(--transition-fast)',
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        style={{
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 400,
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            marginBottom: '8px',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--bg)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.9rem',
                                            fontWeight: 200,
                                            color: 'var(--text)',
                                            outline: 'none',
                                            transition: 'border-color var(--transition-fast)',
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    style={{
                                        display: 'block',
                                        fontSize: '0.7rem',
                                        fontWeight: 400,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        marginBottom: '8px',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Tell us what you're looking for..."
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.9rem',
                                        fontWeight: 200,
                                        color: 'var(--text)',
                                        outline: 'none',
                                        resize: 'vertical',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ alignSelf: 'flex-start' }}
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
