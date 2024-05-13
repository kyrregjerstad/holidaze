import { profileService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { VenuesTable } from './VenuesTable';
import { processVenue } from './processVenue';

const ManageVenuesPage = async () => {
  const user = getUserFromCookie();
  const accessToken = cookies().get('accessToken')?.value;

  if (!user || !user.isVenueManager || !accessToken) {
    notFound();
  }

  const { venues, error } = await profileService.getAllVenuesByProfile(
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
