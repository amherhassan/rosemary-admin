import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Middleware already protects this route, but we can double-check if needed.
// For now, we rely on middleware protection for /api/admin/*

export async function GET() {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter or map users if needed (e.g. remove sensitive data, though listUsers usually safe for admins)
        const admins = users.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at
        }));

        return NextResponse.json(admins);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm for manually added admins
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ user: data.user, message: 'Admin created successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
