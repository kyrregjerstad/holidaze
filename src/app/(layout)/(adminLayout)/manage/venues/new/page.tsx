import { z } from 'zod';
import { NewVenueForm } from './NewVenueForm';
import { fetchCreateVenue } from '@/lib/services/venueService/recursivelyGetAllVenues';
import { createVenueSchema } from '@/lib/schema/venueSchema';
import { redirect } from 'next/navigation';
import { venueService } from '@/lib/services';

const CreateNewVenuePage = async () => {
  const submitFn = async (data: z.infer<typeof createVenueSchema>) => {
    'use server';

    return venueService.createVenue(data);
  };

  const onSuccess = async () => {
    'use server';
    return redirect('/manage/venues');
  };
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Venue
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Add details for your new holiday home listing.
          </p>
        </div>
        <NewVenueForm submitFn={submitFn} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default CreateNewVenuePage;

export const dynamic = 'force-dynamic';
