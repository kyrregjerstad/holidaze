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

  return <LoginForm onSuccess={onSuccess} />;
}
