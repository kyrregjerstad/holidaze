'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CalendarIcon, HomeIcon, NotepadTextIcon, Undo } from 'lucide-react';

import { cn } from '@/lib/utils';

export const PathsList = () => {
  const activePath = usePathname();

  const paths = [
    { path: '/', Icon: Undo, label: 'Home' },
    { path: '/manage/venues', Icon: HomeIcon, label: 'Venues' },
    { path: '/manage/bookings', Icon: CalendarIcon, label: 'Bookings' },
    { path: '/manage/reports', Icon: NotepadTextIcon, label: 'Reports' },
  ];

  return (
    <ul className="flex flex-col gap-5">
      {paths.map(({ path, Icon, label }) => (
        <li key={path} className="flex items-center gap-2">
          <Icon strokeWidth={activePath === path ? 2.2 : 1.8} />
          <Link href={path} className={cn(activePath === path ? 'font-bold' : '')}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
