import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { BackgroundClipPath } from '../../../components/BackgroundClipPath';
import { BackgroundImage } from '../../../components/BackgroundImage';
import { Header } from './Header';

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
          <LoginForm onSuccess={onSuccess} />
        </div>
      </div>
    </section>
  );
}
