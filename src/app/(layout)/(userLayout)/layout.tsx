import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100dvh-56px)] flex-col items-center">
        <div className="flex w-full max-w-[1920px] flex-col items-center">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
