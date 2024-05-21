import { redirect } from 'next/navigation';

import { Metadata } from 'next';

import { BackgroundClipPath } from '@/components/BackgroundClipPath';
import { BackgroundImage } from '@/components/BackgroundImage';
import { Header } from './Header';
import { LoginForm } from './LoginForm';

type Props = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const callbackUrl = searchParams?.callbackUrl || '/';

  const onSuccess = async () => {
    'use server';
    redirect(callbackUrl);
  };

  return (
    <section>
      <div className="relative grid h-svh w-screen grid-cols-1 items-baseline overflow-hidden p-4 md:grid-cols-2 md:items-center">
        <div className="absolute z-10 h-full w-full drop-shadow-md">
          <BackgroundClipPath />
        </div>
        <div className="absolute top-0 h-full w-full ">
          <BackgroundImage />
        </div>
        <div className="z-10 self-center md:self-start">
          <Header />
        </div>
        <div className="z-10 flex flex-col items-center justify-center md:col-start-2">
          <LoginForm onSuccess={onSuccess} />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Holidaze | Login',
};
