import { Place } from '@appjusto/types';
import React from 'react';
import { usePlaces } from '../store/api/consumer/places/usePlaces';

export const useLastPlace = () => {
  const places = usePlaces();
  // state
  const [lastPlace, setLastPlace] = React.useState<Place | null>(null);
  // side effects
  React.useEffect(() => {
    if (!places?.length) return;
    setLastPlace(places[0]);
  }, [places]);
  return lastPlace;
};
