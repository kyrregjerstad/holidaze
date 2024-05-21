import type { userProfileSchemaExtended } from '@/lib/schema/userSchema';
import type { z } from 'zod';

import React from 'react';

import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { profileService } from '@/lib/services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueCard } from '@/components/VenueCard';

type Props = {
  params: {
    name?: string;
  };
};

const ProfilePage = async ({ params: { name } }: Props) => {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) redirect(`/login?callbackUrl=profiles/${name}`);

  if (!name) notFound();

  const { profile, error, status } = await profileService.getProfile(name, accessToken);

  if (status === 401) redirect(`/login?callbackUrl=profiles/${name}`);
  if (error || !profile) notFound();

  return (
    <>{profile.venueManager ? <ManagerPage profile={profile} /> : <UserPage profile={profile} />}</>
  );
};

export default ProfilePage;

const UserPage = ({ profile }: { profile: z.infer<typeof userProfileSchemaExtended> }) => {
  return (
    <div className="flex w-full max-w-7xl flex-col items-center">
      <div className="w-full">
        <Image
          src={profile.banner?.url || VENUE_FALLBACK_IMAGE}
          alt={profile.banner?.alt || `${profile.name} profile banner`}
          width={1152}
          height={348}
          className="aspect-[16/9] w-full object-cover sm:h-96"
        />
      </div>
      <section className="w-full px-4">
        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="flex w-full items-center gap-4">
            <Avatar className="size-16 border sm:size-32">
              <AvatarImage
                alt={profile.avatar?.alt || undefined}
                src={profile.avatar?.url || undefined}
              />
              <AvatarFallback>{profile.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p>{profile.bio}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ManagerPage = ({ profile }: { profile: z.infer<typeof userProfileSchemaExtended> }) => {
  return (
    <div className="flex w-full max-w-7xl flex-col items-center">
      <div className="w-full">
        <Image
          src={profile.banner?.url || VENUE_FALLBACK_IMAGE}
          alt={profile.banner?.alt || `${profile.name} profile banner`}
          width={1152}
          height={348}
          className="aspect-[16/9] w-full object-cover sm:h-96"
        />
      </div>
      <section className="w-full px-4">
        <div className="mt-6 flex flex-col gap-6 ">
          <div className="flex w-full items-center gap-4 sm:flex-row">
            <Avatar className="size-16 border sm:size-32">
              <AvatarImage
                alt={profile.avatar?.alt || undefined}
                src={profile.avatar?.url || undefined}
              />
              <AvatarFallback>{profile.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <Badge className="px-4 py-2">Venue Manager</Badge>
              <p>
                {profile.venues.length} venue
                {profile.venues.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {profile.bio && profile.bio.length > 0 ? (
            <p className="">{profile.bio}</p>
          ) : (
            <p className="text-gray-500">{profile.name} has not written a bio yet.</p>
          )}
          <div>
            {profile.venues.length > 0 ? (
              <>
                <h3 className="mb-4 text-xl font-semibold">Venues</h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {profile.venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="w-fit">
                <CardHeader>
                  <CardTitle>No venues found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{profile.name} has not created any venues yet. Check back later.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const dynamic = 'force-dynamic';
