import { Header } from '@/components/Header';
import { CalendarIcon, HomeIcon, NotepadTextIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid w-full grid-cols-[200px_1fr]">
      <aside className="sticky top-0 h-dvh w-full bg-background p-4 shadow-md">
        <ul className="flex flex-col gap-3">
          <li>
            <Link href="/manage/venues" className="flex items-center gap-2">
              <HomeIcon />
              Venues
            </Link>
          </li>
          <li>
            <Link href="/manage/bookings" className="flex items-center gap-2">
              <CalendarIcon />
              Bookings
            </Link>
          </li>
          <li>
            <Link href="/manage/bookings" className="flex items-center gap-2">
              <NotepadTextIcon />
              Reports
            </Link>
          </li>
        </ul>
      </aside>
      <div className="col-start-2 w-full">
        <Header />
        <div className="overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}