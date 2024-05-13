'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateVenue(venueId: string) {
  revalidatePath(`/venues/${venueId}`);
}
