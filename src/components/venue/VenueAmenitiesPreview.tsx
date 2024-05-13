import { ReactNode } from 'react';

import { CarIcon, CroissantIcon, DogIcon, WifiIcon } from 'lucide-react';
import { z } from 'zod';

import { amenityEnum } from '@/lib/schema/venueSchema';

type Amenity = z.infer<typeof amenityEnum>;

type Props = {
  amenities: Amenity[];
};

export function VenueAmenitiesPreview({ amenities }: Props) {
  const amenityIconMap: Record<Amenity, ReactNode> = {
    wifi: <WifiIcon />,
    parking: <CarIcon />,
    breakfast: <CroissantIcon />,
    pets: <DogIcon />,
  };
  return (
    <ul className="grid gap-6 lg:grid-cols-2">
      {amenities.map((amenity) => (
        <li key={amenity} className="flex items-center gap-2">
          <span className="rounded-full bg-accent p-2">
            {amenityIconMap[amenity]}
          </span>
          <span>{amenity}</span>
        </li>
      ))}
    </ul>
  );
}
