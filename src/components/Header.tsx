import { AccountMenu } from '@/components/AccountMenu';
import { buttonVariants } from '@/components/ui/button';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  const user = getUserFromCookie();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background px-4 drop-shadow-sm lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Holidaze</span>
      </Link>
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
    </header>
  );
};
