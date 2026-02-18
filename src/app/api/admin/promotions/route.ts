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
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('promotions')
        .insert([{
            title: body.title,
            description: body.description || '',
            image_url: body.image_url || null,
            link: body.link || '',
            is_active: body.is_active !== false,
            start_date: body.start_date || null,
            end_date: body.end_date || null,
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
        .from('promotions')
        .update({
            title: body.title,
            description: body.description,
            image_url: body.image_url,
            link: body.link,
            is_active: body.is_active,
            start_date: body.start_date,
            end_date: body.end_date,
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

    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Deleted' });
}
