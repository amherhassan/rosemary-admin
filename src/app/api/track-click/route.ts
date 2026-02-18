import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // RPC or direct increment? Supabase doesn't have a simple atomic increment via JS client 
    // without RPC usually, but we can do it via a raw query or fetching first.
    // For simplicity and performance, efficient way is RPC, but we can't create RPC easily here without SQL.
    // We'll fetch and update for now, or use a separate table for clicks if high volume.
    // Given the scale, let's use a robust approach: log to a 'clicks' table or just update the counter.
    // Let's just increment the column we added.

    /* 
       Optimistic approach: 
       UPDATE products SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = productId 
    */

    const { error } = await supabase.rpc('increment_clicks', { row_id: productId });

    // If RPC doesn't exist (we haven't created it), fallback to fetch-update (slower but works without matching schema exactly yet)
    if (error) {
        // Fallback
        const { data } = await supabase.from('products').select('whatsapp_clicks').eq('id', productId).single();
        if (data) {
            await supabase.from('products').update({ whatsapp_clicks: (data.whatsapp_clicks || 0) + 1 }).eq('id', productId);
        }
    }

    return NextResponse.json({ success: true });
}
