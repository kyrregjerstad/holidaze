import { useCallback, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

type Params = {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const useGooglePlacesAutocomplete = ({ onPlaceSelect }: Params) => {
  const places = useMapsLibrary('places');
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const [inputValue, setInputValue] = useState('');

  // Required for PlacesService to work, but we don't need it since we don't render the map
  const emptyDiv = document.createElement('div');

  useEffect(() => {
    if (!places) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(emptyDiv));
    setSessionToken(new places.AutocompleteSessionToken());
  }, [places]);

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (!autocompleteService || !input) return;
      const request = { input, sessionToken };
      const response = await autocompleteService.getPlacePredictions(request);
      setPredictions(response?.predictions ?? []);
    },
    [autocompleteService, sessionToken]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places || !placesService) return;

      const detailsRequestOptions = {
        placeId,
        fields: ['formatted_address', 'address_components', 'geometry'],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null
      ) => {
        onPlaceSelect(placeDetails);
        setPredictions([]);
        setInputValue(placeDetails?.formatted_address ?? '');
        setSessionToken(new places.AutocompleteSessionToken());
      };

      placesService.getDetails(detailsRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  return {
    predictions,
    inputValue,
    handleInputChange,
    handleSuggestionClick,
  };
};
