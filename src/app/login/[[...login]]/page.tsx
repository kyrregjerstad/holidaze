import { signIn } from '@/lib/auth';
import { LoginForm } from './LoginForm';
import { fetchLoginUser } from '@/lib/services/authService';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
  const onSuccess = async () => {
    'use server';
    redirect('/');
  };

  return <LoginForm onSuccess={onSuccess} />;
}
