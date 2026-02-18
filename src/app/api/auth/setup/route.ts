import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint creates the initial admin user
// It uses the service role key to create users directly
export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if any users already exist (prevent unauthorized creation)
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    if (existingUsers && existingUsers.users.length > 0) {
        return NextResponse.json({ error: 'Admin user already exists. Contact the system administrator.' }, { status: 403 });
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Admin user created successfully', user: data.user });
}
