import { round } from 'lodash';

// distance in meters
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  return `${round(distance / 1000, 2)}km`;
};

export const hhMMFromDate = (date: Date) => {
  if (!date) return null;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const zeroed = (value: number) => (value < 10 ? `0${value}` : value);
  return `${zeroed(hours)}:${zeroed(minutes)}`;
};
