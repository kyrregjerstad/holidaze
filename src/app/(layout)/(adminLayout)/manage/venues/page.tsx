import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { profileService, venueService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { processVenue } from './processVenue';
import { VenuesTable } from './VenuesTable';

const ManageVenuesPage = async () => {
  const user = getUserFromCookie();
  const accessToken = cookies().get('accessToken')?.value;

  if (!user || !user.isVenueManager || !accessToken) {
    notFound();
  }

  const { venues, error } = await profileService.getAllVenuesByProfile(user.name, accessToken);

  if (error) {
    console.error(error);
    return notFound();
  }

  const transformedVenues = venues.map(processVenue);

  const deleteVenue = async (id: string) => {
    'use server';
    const { status, error } = await venueService.deleteVenue(id, accessToken);

    if (status === 204) {
      return true;
    } else {
      console.error('Failed to delete venue', error);
      return false;
    }
  };

  return (
    <div>
      <div className="shadow-xs w-full overflow-hidden rounded-lg">
        <VenuesTable venues={transformedVenues} deleteVenue={deleteVenue} />
      </div>
    </div>
  );
};

export default ManageVenuesPage;
