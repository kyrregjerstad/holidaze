import { fetchAllVenuesByProfile } from '@/lib/services/profileService';

import { VenuesTable } from './VenuesTable';
import { processVenue } from './processVenue';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

const ManageVenuesPage = async () => {
  const user = getUserFromCookie();
  const accessToken = cookies().get('accessToken')?.value;

  if (!user || !user.isVenueManager || !accessToken) {
    notFound();
  }
  const { venues, error } = await fetchAllVenuesByProfile(
    user.name,
    accessToken
  );

  if (error) {
    console.error(error);
    return notFound();
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
