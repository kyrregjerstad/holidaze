'use client';
import { Button } from '@/components/ui/button';
import { handleLogout } from '@/lib/services/handleLogout';

export const LogOutBtn = () => {
  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={() => handleLogout()}
    >
      Log Out
    </Button>
  );
};
