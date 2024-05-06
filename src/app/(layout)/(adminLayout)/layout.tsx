import { Header } from '@/components/Header';
import { AdminSidebar } from './AdminSidebar';
import { Suspense } from 'react';
import { AdminHeader } from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid w-full grid-cols-[200px_1fr]">
      <Suspense>
        <AdminSidebar />
      </Suspense>
      <div className="col-start-2 w-full">
        <AdminHeader />
        <div className="overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
