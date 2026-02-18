import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: Single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PUT: Update a product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('products')
        .update({
            name: body.name,
            price: body.price,
            currency: body.currency,
            category_id: body.category_id || null,
            description: body.description,
            image_url: body.image_url,
            images: body.images,
            is_new: body.is_new,
            is_featured: body.is_featured,
            sizes: body.sizes,
            colors: body.colors,
            show_price: body.show_price,
            status: body.status,
            sort_order: body.sort_order,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// DELETE: Soft delete a product (set status to archived)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = getSupabaseServer();

    const { error } = await supabase
        .from('products')
        .update({ status: 'archived' })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product archived' });
}
