'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

const values = [
    {
        title: 'Timeless Design',
        desc: 'We create pieces that transcend trends — garments you\'ll reach for season after season.',
    },
    {
        title: 'Quality Craft',
        desc: 'Every stitch, every seam, every fabric choice is made with intention and precision.',
    },
    {
        title: 'Effortless Style',
        desc: 'Our designs are made to move with you — from morning coffee to evening gatherings.',
    },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section
                style={{
                    padding: '80px 0 60px',
                    background: 'linear-gradient(180deg, #F0EBE5 0%, var(--bg) 100%)',
                }}
            >
                <div className="container-wide" style={{ maxWidth: '800px' }}>
                    <motion.div {...fadeUp} style={{ textAlign: 'center' }}>
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
                            Our Story
                        </p>
                        <h1 className="heading-lg" style={{ marginBottom: '24px' }}>
                            About Rosemary
                        </h1>
                        <div className="divider" style={{ margin: '0 auto 24px' }} />
                        <p
                            style={{
                                fontSize: '1.1rem',
                                fontWeight: 200,
                                lineHeight: 2,
                                color: 'var(--text-muted)',
                            }}
                        >
                            Born from a love for minimalism and a belief that true elegance lies in simplicity,
                            Rosemary is a women&apos;s fashion brand that celebrates the modern woman.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="section-spacing" style={{ backgroundColor: 'white' }}>
                <div className="container-wide">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '60px',
                            alignItems: 'center',
                        }}
                        className="about-grid"
                    >
                        <motion.div {...fadeUp}>
                            <h2 className="heading-md" style={{ marginBottom: '24px' }}>
                                Where it all began
                            </h2>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 200,
                                    lineHeight: 2,
                                    color: 'var(--text-muted)',
                                    marginBottom: '20px',
                                }}
                            >
                                Rosemary was founded with a simple vision: to create a wardrobe of essential
                                pieces that make every woman feel confident and beautiful. We believe fashion
                                should be effortless — pieces that speak for themselves through impeccable
                                fit, quality fabrics, and thoughtful design.
                            </p>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 200,
                                    lineHeight: 2,
                                    color: 'var(--text-muted)',
                                }}
                            >
                                Our collections are inspired by the textures and tones of the natural world —
                                warm neutrals, soft silhouettes, and organic materials that feel as good as
                                they look.
                            </p>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            style={{
                                aspectRatio: '4 / 3',
                                background: 'linear-gradient(145deg, #E0D5CC, #CFC1B3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '2.5rem',
                                    color: 'rgba(0,0,0,0.08)',
                                    fontWeight: 300,
                                    fontStyle: 'italic',
                                }}
                            >
                                Est. 2026
                            </span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-spacing">
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
                            What We Believe
                        </p>
                        <h2 className="heading-lg">Our Values</h2>
                    </motion.div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '40px',
                        }}
                    >
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                style={{
                                    padding: '40px 32px',
                                    borderTop: '2px solid var(--accent)',
                                }}
                            >
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.4rem',
                                        fontWeight: 400,
                                        marginBottom: '16px',
                                    }}
                                >
                                    {value.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '0.95rem',
                                        fontWeight: 200,
                                        lineHeight: 1.8,
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section
                style={{
                    padding: '100px 0',
                    backgroundColor: 'var(--bg-dark)',
                    textAlign: 'center',
                }}
            >
                <div className="container-wide" style={{ maxWidth: '700px' }}>
                    <motion.div {...fadeUp}>
                        <p
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: 'rgba(255, 255, 255, 0.85)',
                                lineHeight: 1.8,
                                marginBottom: '24px',
                            }}
                        >
                            &ldquo;Our goal is not to be the loudest voice in fashion, but the most considered.
                            Every piece we create is an invitation to slow down and appreciate the beauty in
                            simplicity.&rdquo;
                        </p>
                        <p
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                            }}
                        >
                            — The Rosemary Team
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-spacing" style={{ textAlign: 'center' }}>
                <div className="container-wide">
                    <motion.div {...fadeUp}>
                        <h2 className="heading-md" style={{ marginBottom: '24px' }}>
                            Discover our collection
                        </h2>
                        <Link href="/shop" className="btn-primary">
                            Shop Now
                            <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <style jsx global>{`
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
        </>
    );
}
