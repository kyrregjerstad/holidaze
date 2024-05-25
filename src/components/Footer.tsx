import Link from 'next/link';

import { HeartIcon } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-20">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © {currentYear} Holidaze. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link
          href="https://kyrre.dev"
          className="text-sm text-gray-500 hover:underline"
          target="_blank"
        >
          Made With <HeartIcon className="inline-block size-5 fill-sky-400 stroke-none" /> by Kyrre
          Gjerstad
        </Link>
        <Link
          href="https://github.com/kyrregjerstad/holidaze"
          className="text-sm text-gray-500 hover:underline"
          target="_blank"
        >
          GitHub
        </Link>
      </nav>
    </footer>
  );
};
