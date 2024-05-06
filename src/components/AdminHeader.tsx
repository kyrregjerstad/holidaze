import { AccountMenu } from '@/components/AccountMenu';
import { buttonVariants } from '@/components/ui/button';
import { getUserFromCookie } from '@/lib/utils/cookies';
import Link from 'next/link';
import { Suspense } from 'react';

export const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-end bg-background px-4 drop-shadow-sm lg:px-6">
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
