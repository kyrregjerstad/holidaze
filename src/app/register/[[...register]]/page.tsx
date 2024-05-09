import { redirect } from 'next/navigation';
import { RegisterForm } from './RegisterForm';
import { Header } from '@/app/login/[[...login]]/Header';
import { BackgroundClipPath } from '@/components/BackgroundClipPath';
import { BackgroundImage } from '@/components/BackgroundImage';

export default async function Page() {
  const onSuccess = async () => {
    'use server';
    redirect('/');
  };
  return (
    <section>
      <div className="relative grid h-svh w-screen grid-cols-1 items-baseline p-4 md:grid-cols-2 md:items-center">
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
          <RegisterForm onSuccess={onSuccess} />
        </div>
      </div>
    </section>
  );
}
