'use client';

import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/context/SettingsContext';

export default function WhatsAppButton() {
  const { getWhatsAppLink } = useWhatsApp();

  return (
    <>
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-float"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 900,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
          transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
          animation: 'gentle-pulse 3s ease-in-out infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.35)';
        }}
      >
        <MessageCircle size={24} fill="white" />
      </a>
      <style jsx global>{`
          @media (max-width: 480px) {
            .whatsapp-float {
              width: 48px !important;
              height: 48px !important;
              bottom: 16px !important;
              right: 16px !important;
            }
            .whatsapp-float svg {
              width: 20px !important;
              height: 20px !important;
            }
          }
        `}</style>
    </>
  );
}
