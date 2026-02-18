import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(request: NextRequest) {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('product_variants')
        .insert([{
            product_id: body.product_id,
            size: body.size,
            color: body.color,
            stock_status: body.stock_status || 'in_stock',
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
        .from('product_variants')
        .update({
            size: body.size,
            color: body.color,
            stock_status: body.stock_status,
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

    const { error } = await supabase.from('product_variants').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Deleted' });
}
