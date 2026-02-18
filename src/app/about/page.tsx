import { createClient } from '@/lib/supabase-server';
import AboutClient from '@/components/AboutClient';

export const metadata = {
    title: 'About | Rosemary',
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
};

export default async function AboutPage() {
    const supabase = await createClient();

    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*');

    const settings: Record<string, any> = {};
    if (settingsData) {
        settingsData.forEach((row: any) => {
            settings[row.key] = row.value;
        });
    }

    return <AboutClient settings={settings} />;
}
