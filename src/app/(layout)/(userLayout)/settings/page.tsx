import React from 'react';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { updateProfileSchema } from '@/lib/schema';
import { profileService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UpdateProfileForm } from './UpdateProfileForm';

const SettingsPage = async () => {
  const user = getUserFromCookie();
  const accessToken = await getAccessTokenCookie();

  if (!user || !accessToken) {
    return redirect('/login?ref=/settings');
  }

  const { profile } = await profileService.getProfile(user.name, accessToken);

  if (!profile) {
    return redirect('/login?ref=/settings');
  }

  const updateProfile = async (data: z.infer<typeof updateProfileSchema>) => {
    'use server';

    return await profileService.updateProfile({
      name: user.name,
      accessToken,
      data,
    });
  };

  return (
    <>
      <Breadcrumb className="self-start p-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/profile/${user.name}`}>{user.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-xs truncate">Edit profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="flex w-full flex-col items-center justify-center p-16">
        <UpdateProfileForm profile={profile} updateProfile={updateProfile} />
      </section>
    </>
  );
};

export default SettingsPage;
