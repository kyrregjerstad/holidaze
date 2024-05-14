'use client';

import type { locationSchema } from '@/lib/schema/venueSchema';
import type { z } from 'zod';

import React, { useEffect, useState } from 'react';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type Props = {
  location: z.infer<typeof locationSchema>;
};

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
} satisfies React.CSSProperties;

type Coordinates = {
  lat: number;
  lng: number;
};

export const LocationMap = ({ location }: Props) => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!API_KEY) {
    throw new Error(
      'Please define the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable inside .env'
    );
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
  });

  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);

  const isValidCoordinate = (coord: number | null | undefined): coord is number =>
    coord !== null && coord !== undefined && coord !== 0;

  useEffect(() => {
    if (!isLoaded) return;

    if (isValidCoordinate(location.lat) && isValidCoordinate(location.lng)) {
      setMapCenter({ lat: location.lat, lng: location.lng });
    } else {
      const fullAddress = `${location.address}, ${location.city}, ${location.zip}, ${location.country}`;
      const geocoder = new google.maps.Geocoder();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (status === 'OK' && results && results.length > 0) {
          setMapCenter(results[0].geometry.location.toJSON());
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    }
  }, [location, isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (!mapCenter) return null;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
      <Marker position={mapCenter} />
    </GoogleMap>
  );
};
