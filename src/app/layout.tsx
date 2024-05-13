import '@uploadthing/react/styles.css';

import type { Metadata } from 'next';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { Inter } from 'next/font/google';
import { extractRouterConfig } from 'uploadthing/server';

import { Toaster } from '@/components/ui/toaster';
import QueryClientProvider from './_providers/QueryClientProvider';
import { ourFileRouter } from './api/uploadthing/core';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <QueryClientProvider>
          <div className="bg-background">{children}</div>
          {modal}
          <div id="modal-root" />
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
