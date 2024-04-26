import { Badge } from '@/components/ui/badge';
import { Amenities, amenitiesKeysSchema } from '@/lib/schema/venueSchema';
import React from 'react';
import { z } from 'zod';

type Props = {
  maxGuests: number;
  amenities: z.infer<typeof amenitiesKeysSchema>;
};
export const DetailsPreview = ({ maxGuests, amenities }: Props) => {
  return (
    <div className="flex gap-2 text-gray-500 dark:text-gray-400">
      <Badge variant="outline" className="px-4 py-2">
        {maxGuests} guests
      </Badge>
      {amenities.map((amenity) => (
        <Badge variant="outline" className="px-4 py-2" key={amenity}>
          {amenity}
        </Badge>
      ))}
    </div>
  );
};