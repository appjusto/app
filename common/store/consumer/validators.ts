import { ConsumerProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { isEmpty } from 'lodash';
import { validateEmail } from '../../utils/validators';
import { isPhoneValid } from '../validators';

export const isConsumerProfileComplete = (
  consumer: Partial<ConsumerProfile> | undefined
): boolean => {
  if (!consumer) return false;
  return (
    !isEmpty(consumer.email) &&
    validateEmail(consumer.email!).status === 'ok' &&
    !isEmpty(consumer.name) &&
    !isEmpty(consumer.surname) &&
    cpfutils.isValid(consumer.cpf ?? '') &&
    isPhoneValid(consumer.phone ?? '')
  );
};
