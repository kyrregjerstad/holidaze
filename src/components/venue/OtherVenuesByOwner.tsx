import { cookies } from 'next/headers';

import { profileService } from '@/lib/services';
import { VenueCard } from '../VenueCard';

export const OtherVenuesByOwner = async ({
  venueId,
  ownerName,
}: {
  venueId: string;
  ownerName: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div>
        <p className="text-neutral-500">Please log in to see more venues</p>
      </div>
    );
  }

  const { venues } = await profileService.getAllVenuesByProfile(ownerName, accessToken);

  // To ensure we're not showing the current venue in the related venues
  const filteredVenues = venues.filter((venue) => venue.id !== venueId).slice(0, 8); // Limit to 8 venues

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {filteredVenues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
