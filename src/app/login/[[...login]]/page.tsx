import { redirect } from 'next/navigation';
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
      <div className="relative grid h-svh w-screen grid-cols-2">
        <div className="absolute -z-10 h-full w-full drop-shadow-md">
          <div className="hero-clip-path h-full w-full bg-gradient-to-tr from-sky-600 to-sky-400 opacity-95 backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-0 -z-20 h-full w-full ">
          <img
            src="/assets/holidaze-bg-2.webp"
            alt=""
            className=" h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="p-20 text-8xl font-bold tracking-tighter text-white">
            Holidaze
          </h1>
        </div>
        <div className="col-start-2 flex flex-col items-center justify-center">
          <LoginForm onSuccess={onSuccess} />
        </div>
      </div>
    </section>
  );
}
