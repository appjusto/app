import { LatLng } from '@appjusto/types';
import { distance } from 'geokit';
import { round } from 'lodash';

export const distanceBetweenLatLng = (a: LatLng, b: LatLng) => {
  return (
    round(
      distance({ lat: a.latitude, lng: a.longitude }, { lat: b.latitude, lng: b.longitude }),
      2
    ) * 1000
  );
};
