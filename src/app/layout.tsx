import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Rosemary — Women's Fashion",
  description: "Thoughtfully designed pieces for the modern woman. Elegance in simplicity. Browse our collection and inquire via WhatsApp.",
  keywords: ["women's fashion", "clothing", "dresses", "minimal fashion", "Sri Lanka", "Rosemary"],
  openGraph: {
    title: "Rosemary — Women's Fashion",
    description: "Thoughtfully designed pieces for the modern woman.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@100..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {!isAdmin && <Navbar />}
        {isAdmin ? (
          children
        ) : (
          <main style={{ paddingTop: 'var(--nav-height)' }}>
            {children}
          </main>
        )}
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
      </body>
    </html>
  );
}
