import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase-server';

export default async function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
