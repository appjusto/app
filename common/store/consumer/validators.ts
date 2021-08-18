import { ConsumerProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { isEmpty } from 'lodash';

export const consumerInfoSet = (consumer: Partial<ConsumerProfile> | undefined): boolean => {
  if (!consumer) return false;
  return (
    !isEmpty(consumer.name) &&
    !isEmpty(consumer.surname) &&
    cpfutils.isValid(consumer.cpf!) &&
    consumer.phone?.length === 11
  );
};
