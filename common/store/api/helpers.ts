import { Business, LatLng } from '@appjusto/types';
import { distance } from 'geokit';
import { round } from 'lodash';
import { BusinessAlgolia } from '../../../../types';

export const distanceBetweenLatLng = (a: LatLng, b: LatLng) => {
  return (
    round(
      distance({ lat: a.latitude, lng: a.longitude }, { lat: b.latitude, lng: b.longitude }),
      2
    ) * 1000
  );
};

export const inDeliveryRange = (business: Business | BusinessAlgolia, destination: LatLng) => {
  const { businessAddress, deliveryRange = 0 } = business;
  const origin = businessAddress?.latlng;
  if (!origin) return false;
  const distance = distanceBetweenLatLng(destination, origin);
  return deliveryRange > distance;
};
