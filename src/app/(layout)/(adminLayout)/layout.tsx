import { Suspense } from 'react';

import { AdminHeader } from '@/components/AdminHeader';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid min-h-dvh w-full max-w-full sm:grid-cols-[200px_1fr]">
      <div className="hidden sm:block">
        <Suspense>
          <AdminSidebar />
        </Suspense>
      </div>
      <div className="flex w-full flex-col items-center sm:col-start-2">
        <AdminHeader />
        <div className="max-w-8xl w-full overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
