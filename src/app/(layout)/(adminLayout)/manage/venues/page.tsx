import { fetchAllVenuesByProfile } from '@/lib/services/profileService';

import { VenuesTable } from './VenuesTable';
import { processVenue } from './processVenue';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { notFound } from 'next/navigation';

const ManageVenuesPage = async () => {
  const user = getUserFromCookie();

  if (!user || !user.isVenueManager) {
    notFound();
  }
  const { venues, error } = await fetchAllVenuesByProfile(user.name);

  if (error) {
    console.error(error);
  }

  const transformedVenues = venues.map(processVenue);

  return (
    <div>
      <div className="shadow-xs w-full overflow-hidden rounded-lg">
        <VenuesTable venues={transformedVenues} />
      </div>
    </div>
  );
};

export default ManageVenuesPage;
