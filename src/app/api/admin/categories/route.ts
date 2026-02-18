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
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .insert([{
            name: body.name,
            slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
            image_url: body.image_url || null,
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
        .from('categories')
        .update({
            name: body.name,
            slug: body.slug,
            image_url: body.image_url,
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

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Deleted' });
}
