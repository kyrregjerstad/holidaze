import '@uploadthing/react/styles.css';

import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';

import { chatService } from '@/lib/services';
import { Toaster } from '@/components/ui/toaster';
import { ourFileRouter } from './api/uploadthing/core';

import './globals.css';

import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <chatService.AIProvider>
          <div className="bg-background">{children}</div>
          {modal}
          <div id="modal-root" />
          <Toaster />
        </chatService.AIProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Holidaze | Your Gateway to Unforgettable Getaways',
  description:
    'Holidaze is your gateway to unforgettable getaways. Find your perfect holiday home today.',
};
