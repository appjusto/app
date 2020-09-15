import { ConsumerProfile } from 'appjusto-types';

export const consumerInfoSet = (consumer: ConsumerProfile | undefined): boolean => {
  if (!consumer) return false;
  return true;
};
