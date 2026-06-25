'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="gap-2 cursor-pointer text-sm font-medium transition-colors"
      style={{ color: 'var(--auth-muted)' }}
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Saindo…' : 'Sair'}
    </Button>
  );
}
