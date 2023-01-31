import { Business, BusinessAlgolia, LatLng } from '@appjusto/types';
import { distanceBetweenLatLng } from '../../helpers';

export const isDistanceInDeliveryRange = (
  business?: Business | BusinessAlgolia,
  distance: number = 0
) => {
  if (!business) return false;
  const { deliveryRange } = business;
  if (!deliveryRange) return false;
  return deliveryRange > distance;
};

export const isDestinationInDeliveryRange = (
  business?: Business | BusinessAlgolia,
  destination?: LatLng
) => {
  if (!business) return false;
  if (!destination) return false;
  const { deliveryRange, businessAddress } = business;
  if (!deliveryRange) return false;
  if (!businessAddress?.latlng) return false;
  const distance = distanceBetweenLatLng(destination, businessAddress.latlng);
  return deliveryRange > distance;
};
