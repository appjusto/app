import { Address, Place } from 'appjusto-types';
import { isEmpty } from 'lodash';

export const addressValid = (address: Address | undefined): boolean => {
  return !isEmpty(address?.description);
};

export const placeValid = (place: Place | undefined): boolean => {
  return addressValid(place?.address);
  // && !isEmpty(place?.intructions);
};

export const sameAdddress = (first: Address, second: Address): boolean => {
  return first.description === second.description;
};
