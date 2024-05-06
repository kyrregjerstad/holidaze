import { fetchAllVenuesByProfile } from '@/lib/services/profileService';
import { VenueCard } from '../VenueCard';

export const OtherVenuesByOwner = async ({
  venueId,
  ownerName,
}: {
  venueId: string;
  ownerName: string;
}) => {
  const { venues } = await fetchAllVenuesByProfile(ownerName);

  // To ensure we're not showing the current venue in the related venues
  const filteredVenues = venues
    .filter((venue) => venue.id !== venueId)
    .slice(0, 8); // Limit to 8 venues

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {filteredVenues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
