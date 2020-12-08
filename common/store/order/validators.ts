import { Address, Place } from 'appjusto-types';
import { isEmpty } from 'lodash';

export const addressValid = (address: Partial<Address> | undefined): boolean => {
  return !isEmpty(address?.description);
};

export const placeValid = (place: Partial<Place> | undefined): boolean => {
  return addressValid(place?.address);
  // && !isEmpty(place?.intructions);
};

export const sameAddress = (first: Address | undefined, second: Address | undefined): boolean => {
  if (!first) return false;
  if (!second) return false;
  return first.description === second.description;
};
