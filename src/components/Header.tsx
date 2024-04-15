import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background px-4 drop-shadow-sm lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Holidaze</span>
      </Link>
      <Link href="/login">Log in</Link>
    </header>
  );
};
