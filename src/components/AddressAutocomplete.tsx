import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { useGooglePlacesAutocomplete } from '@/lib/hooks/useGooglePlacesAutocomplete';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Props = {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const AddressAutocomplete = ({ onPlaceSelect }: Props) => {
  const { handleInputChange, handleSuggestionClick, inputValue, predictions } =
    useGooglePlacesAutocomplete({ onPlaceSelect });

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(containerRef, () => setIsFocused(false));

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Label htmlFor="address">Address</Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="Search for a location"
        id="address"
      />

      {predictions.length > 0 && isFocused && (
        <PredictionList
          predictions={predictions}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

const PredictionList = ({
  predictions,
  handleSuggestionClick,
}: {
  predictions: google.maps.places.AutocompletePrediction[];
  handleSuggestionClick: (placeId: string) => void;
}) => {
  return (
    <ul
      className="absolute bottom-12 w-full rounded-lg border bg-background p-4 drop-shadow-md"
      tabIndex={0}
    >
      {predictions.map((prediction, index) => (
        <li
          className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
          key={prediction.place_id}
          onClick={() => handleSuggestionClick(prediction.place_id)}
        >
          {prediction.description}
        </li>
      ))}
    </ul>
  );
};

const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};
