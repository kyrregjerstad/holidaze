import React from 'react';

type Props = {
  amenities: string[];
};

export function VenueAmenitiesPreview({ amenities }: Props) {
  return (
    <ul className="grid gap-6 lg:grid-cols-2">
      {amenities.map((amenity) => (
        <li key={amenity} className="flex items-center gap-2">
          {amenity}
        </li>
      ))}
    </ul>
  );
}
