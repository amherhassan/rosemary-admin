'use client';

import { createContext, useContext, ReactNode } from 'react';

interface Settings {
    whatsapp_number?: string;
    [key: string]: any;
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
    children,
    settings,
}: {
    children: ReactNode;
    settings: Settings;
}) {
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export function useWhatsApp() {
    const settings = useSettings();
    const whatsappNumber = settings.whatsapp_number || '94771234567'; // Fallback

    const getWhatsAppLink = (text?: string) => {
        const baseUrl = `https://wa.me/${whatsappNumber}`;
        if (text) {
            return `${baseUrl}?text=${encodeURIComponent(text)}`;
        }
        return baseUrl;
    };

    return { whatsappNumber, getWhatsAppLink };
}
