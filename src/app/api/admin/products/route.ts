import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: List all products (admin view — includes drafts)
export async function GET(request: NextRequest) {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
        .from('products')
        .select('*, categories(name)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (category) query = query.eq('category_id', category);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST: Create a new product
export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('products')
        .insert([{
            name: body.name,
            price: body.price,
            currency: body.currency || 'LKR',
            category_id: body.category_id || null,
            description: body.description,
            image_url: body.image_url,
            images: body.images || [],
            is_new: body.is_new || false,
            is_featured: body.is_featured || false,
            sizes: body.sizes || [],
            colors: body.colors || [],
            show_price: body.show_price !== false,
            status: body.status || 'active',
            sort_order: body.sort_order || 0,
        }])
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
