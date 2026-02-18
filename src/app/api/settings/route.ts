import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    // Public access to non-sensitive settings
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from('site_settings')
        .select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Convert to key-value object
    const settings: Record<string, unknown> = {};
    data?.forEach(row => {
        settings[row.key] = row.value;
    });

    return NextResponse.json(settings);
}
