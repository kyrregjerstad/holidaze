'use client';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/services';

export const LogOutBtn = () => {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => authService.logout()}
    >
      Log Out
    </Button>
  );
};
