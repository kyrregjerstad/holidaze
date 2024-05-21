import Link from 'next/link';

import { FrownIcon } from 'lucide-react';
import { Metadata } from 'next';

export default async function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <FrownIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Oops! This page could not be found.
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t seem to exist. It may have been removed or
          the link you followed was incorrect.
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
          href="/"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Holidaze | Not Found',
};
