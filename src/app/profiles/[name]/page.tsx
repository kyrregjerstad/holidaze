import { Debug } from '@/components/Debug';
import { fetchProfileByName } from '@/lib/services/profileService';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    name?: string;
  };
};

const UsersPage = async ({ params: { name } }: Props) => {
  if (!name) notFound();

  const { profile, error, status } = await fetchProfileByName(name);

  if (status === 401) redirect(`/login?callbackUrl=profiles/${name}`);
  if (error || !profile) notFound();

  return <Debug data={profile} />;
};

export default UsersPage;
