import { ConsumerProfile } from '@appjusto/types';

export const consumerInfoSet = (consumer: Partial<ConsumerProfile> | undefined): boolean => {
  if (!consumer) return false;
  return true;
};
