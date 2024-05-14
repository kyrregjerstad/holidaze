import type { UpdateVenueSchema } from '@/lib/services/venueService/updateVenue';

import { notFound, redirect } from 'next/navigation';

import { z } from 'zod';

import { venueService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { EditVenueForm } from '../../new/EditVenueForm';

type Props = {
  params: { id: string };
};

const EditVenuePage = async ({ params }: Props) => {
  const result = schema.safeParse(params);

  if (!result.success) {
    return notFound();
  }

  const { venue, error } = await venueService.getVenueById(result.data.id);

  if (!venue || error) {
    return notFound();
  }

  const user = getUserFromCookie();

  if (!user || user.name !== venue.owner.name) {
    return notFound();
  }

  const updateVenue = async (id: string, data: UpdateVenueSchema) => {
    'use server';
    return await venueService.updateVenue(id, data);
  };

  const onSuccess = async () => {
    'use server';
    redirect(`/manage/venues/${venue.id}`);
  };

  return <EditVenueForm venue={venue} submitFn={updateVenue} onSuccess={onSuccess} />;
};

export default EditVenuePage;

const schema = z.object({
  id: z.string().min(36).max(36),
});
