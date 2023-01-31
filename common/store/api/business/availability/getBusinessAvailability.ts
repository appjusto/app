import { Business, BusinessAlgolia } from '@appjusto/types';
import { isEmpty } from 'lodash';
import { isAvailable } from './selectors';
import { BusinessAvailability } from './type';

interface GetBusinessAvailabilityOptions {
  business?: Business | BusinessAlgolia;
  date: Date;
}

export const getBusinessAvailability = ({
  business,
  date,
}: GetBusinessAvailabilityOptions): BusinessAvailability => {
  if (!business) return 'unavailable';
  const { status, schedules } = business;
  if (status !== 'available') return 'unavailable';
  if (isEmpty(schedules)) return 'unavailable';
  if (isAvailable(schedules, date)) return 'open';
  return 'closed';
};
