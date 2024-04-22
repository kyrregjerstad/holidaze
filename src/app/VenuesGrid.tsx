import { VenueCard } from '@/components/VenueCard';
import { fetchAllVenues } from '@/lib/services/venuesService';

export const VenuesGrid = async () => {
  const { venues, error } = await fetchAllVenues();

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
