import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET() {
    const supabase = getSupabaseServer();
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

export async function PUT(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    // body is { key: value, key2: value2, ... }
    const promises = Object.entries(body).map(([key, value]) =>
        supabase
            .from('site_settings')
            .upsert({
                key,
                value: value as object,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' })
    );

    await Promise.all(promises);

    return NextResponse.json({ message: 'Settings updated' });
}
