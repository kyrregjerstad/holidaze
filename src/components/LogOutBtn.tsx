'use client';

import { authService } from '@/lib/services';
import { Button } from '@/components/ui/button';

export const LogOutBtn = () => {
  return (
    <Button variant="outline" className="w-full" onClick={() => authService.logout()}>
      Log Out
    </Button>
  );
};
