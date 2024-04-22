import { Debug } from '@/components/Debug';
import { VenueCard } from '@/components/VenueCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <div className="flex max-w-7xl flex-col items-center">
      <div className="w-full">
        <img
          src={profile.banner?.url || '/placeholder.svg'}
          alt={profile.banner?.alt || `${profile.name} profile banner`}
          className="h-96 w-full object-cover"
        />
      </div>
      <section>
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
              <p>
                {profile.venues.length} venue
                {profile.venues.length > 1 ? 's' : ''}
              </p>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {profile.bio}
              </p>
            </div>
          </div>
          <div className="w-full">
            <h3 className="mb-4 text-xl font-semibold">My Venues</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {profile.venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsersPage;
