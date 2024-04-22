'use client';
import { Button } from '@/components/ui/button';
import { handleLogout } from '@/lib/services/handleLogout';

export const LogOutBtn = () => {
  return (
    <Button variant="outline" className="w-full" onClick={() => handleLogout()}>
      Log Out
    </Button>
  );
};
