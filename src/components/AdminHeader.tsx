import { PathsList } from '@/app/(layout)/(adminLayout)/PathsList';
import { AccountMenu } from '@/components/AccountMenu';
import { Button, buttonVariants } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background px-4 drop-shadow-sm sm:justify-end lg:px-6">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="inline sm:hidden">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-8">
          <PathsList />
        </DrawerContent>
      </Drawer>
      <Suspense>
        <HeaderContent />
      </Suspense>
    </header>
  );
};

const HeaderContent = () => {
  const user = getUserFromCookie();

  return (
    <>
      {user ? (
        <AccountMenu user={user} />
      ) : (
        <div className="space-x-2">
          <Link
            href="/login"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            Register
          </Link>
        </div>
      )}
    </>
  );
};
