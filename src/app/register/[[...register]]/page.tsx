import { redirect } from 'next/navigation';
import { RegisterForm } from './RegisterForm';

export default async function Page() {
  const onSuccess = async () => {
    'use server';
    redirect('/');
  };
  return (
    <section className="container">
      <RegisterForm onSuccess={onSuccess} />
    </section>
  );
}
