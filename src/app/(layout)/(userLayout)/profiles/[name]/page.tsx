import { VenueCard } from '@/components/VenueCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { userProfileSchema } from '@/lib/schema/userSchema';
import { fetchProfileByName } from '@/lib/services/profileService';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { z } from 'zod';

type Props = {
  params: {
    name?: string;
  };
};

const VenueManagerPage = async ({ params: { name } }: Props) => {
  if (!name) notFound();

  const { profile, error, status } = await fetchProfileByName(name);

  if (status === 401) redirect(`/login?callbackUrl=profiles/${name}`);
  if (error || !profile) notFound();

  return (
    <>
      {profile.venueManager ? (
        <ManagerPage profile={profile} />
      ) : (
        <UserPage profile={profile} />
      )}
    </>
  );
};

export default VenueManagerPage;

const UserPage = ({
  profile,
}: {
  profile: z.infer<typeof userProfileSchema>;
}) => {
  return (
    <div className="flex max-w-7xl flex-col items-center">
      <div className="w-full">
        <Image
          src={profile.banner?.url || VENUE_FALLBACK_IMAGE}
          alt={profile.banner?.alt || `${profile.name} profile banner`}
          width={1152}
          height={348}
          className="h-96 w-full object-cover"
        />
      </div>
      <section className="w-full">
        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="flex w-full items-center gap-4">
            <Avatar className="size-32 border">
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

const ManagerPage = ({
  profile,
}: {
  profile: z.infer<typeof userProfileSchema>;
}) => {
  return (
    <div className="flex max-w-7xl flex-col items-center">
      <div className="w-full">
        <Image
          src={profile.banner?.url || VENUE_FALLBACK_IMAGE}
          alt={profile.banner?.alt || `${profile.name} profile banner`}
          width={1152}
          height={348}
          className="h-96 w-full object-cover"
        />
      </div>
      <section className="w-full">
        <div className="mt-6 flex flex-col gap-6 ">
          <div className="flex w-full items-center gap-4 sm:flex-row">
            <Avatar className="size-32 border">
              <AvatarImage
                alt={profile.avatar?.alt || undefined}
                src={profile.avatar?.url || undefined}
              />
              <AvatarFallback>{profile.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p>
                {profile.venues.length} venue
                {profile.venues.length > 1 ? 's' : ''}
              </p>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {profile.bio}
              </p>
            </div>
          </div>
          <div>
            {profile.venues.length > 0 ? (
              <>
                <h3 className="mb-4 text-xl font-semibold">My Venues</h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {profile.venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent>
                  <h3 className="text-xl font-semibold">No venues found</h3>
                  <p>
                    {profile.name} has not created any venues yet. Check back
                    later.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
