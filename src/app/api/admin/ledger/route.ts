import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: Fetch sales ledger
export async function GET(request: NextRequest) {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data, error } = await supabase
        .from('sales_ledger')
        .select('*')
        .order('sale_date', { ascending: false })
        .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: Record a new sale
export async function POST(request: NextRequest) {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase
        .from('sales_ledger')
        .insert([{
            product_name: body.product_name,
            customer_name: body.customer_name || 'Anonymous',
            customer_phone: body.customer_phone || '',
            price_sold: body.price_sold || 0,
            sale_date: body.sale_date || new Date().toISOString(),
            notes: body.notes || '',
        }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// DELETE: Remove a sale entry
export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { error } = await supabase.from('sales_ledger').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Deleted' });
}
