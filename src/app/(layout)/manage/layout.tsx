import { CalendarIcon, HomeIcon, NotepadTextIcon } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid h-[calc(100dvh-56px)] w-full grid-cols-[200px_minmax(900px,_1fr)_100px] gap-4">
      <aside className="sticky top-14 h-full w-full bg-background p-4 shadow-md">
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
      <div className="col-start-2 overflow-y-auto">{children}</div>
    </div>
  );
}
