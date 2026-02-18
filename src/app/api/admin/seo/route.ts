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
        .from('page_seo')
        .select('*')
        .order('page_slug');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('page_seo')
        .upsert({
            page_slug: body.page_slug,
            meta_title: body.meta_title,
            meta_description: body.meta_description,
            og_image_url: body.og_image_url || null,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'page_slug' })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
