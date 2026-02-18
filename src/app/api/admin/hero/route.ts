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
        .from('hero_sections')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('hero_sections')
        .insert([{
            title: body.title,
            subtitle: body.subtitle || '',
            description: body.description || '',
            cta_text: body.cta_text || '',
            cta_link: body.cta_link || '',
            bg_image_url: body.bg_image_url || null,
            mobile_bg_image_url: body.mobile_bg_image_url || null,
            is_active: body.is_active !== false,
            sort_order: body.sort_order || 0,
        }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { data, error } = await supabase
        .from('hero_sections')
        .update({
            title: body.title,
            subtitle: body.subtitle,
            description: body.description,
            cta_text: body.cta_text,
            cta_link: body.cta_link,
            bg_image_url: body.bg_image_url,
            mobile_bg_image_url: body.mobile_bg_image_url,
            is_active: body.is_active,
            sort_order: body.sort_order,
        })
        .eq('id', body.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { error } = await supabase.from('hero_sections').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Deleted' });
}
