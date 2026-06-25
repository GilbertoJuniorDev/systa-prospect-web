import { redirect } from 'next/navigation';
import type React from 'react';
import { getSession } from '@/lib/session';
import { DashboardNav } from '@/components/layout/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <DashboardNav userEmail={session.email} />
      <main className="px-8 py-8">{children}</main>
    </div>
  );
}
