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
      <div className="relative grid h-svh w-screen grid-cols-2">
        <div className="absolute z-10 h-full w-full drop-shadow-md">
          <BackgroundClipPath />
        </div>
        <div className="absolute top-0 h-full w-full ">
          <BackgroundImage />
        </div>
        <div className="z-10">
          <Header />
        </div>
        <div className="z-10 col-start-2 flex flex-col items-center justify-center">
          <RegisterForm onSuccess={onSuccess} />
        </div>
      </div>
    </section>
  );
}
