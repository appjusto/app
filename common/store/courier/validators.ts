import { CourierProfile } from 'appjusto-types';
import { validate } from 'gerador-validador-cpf';
import { isEmpty } from 'lodash';

export const courierInfoSet = (courier: CourierProfile | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.name) &&
    !isEmpty(courier.surname) &&
    !isEmpty(courier.cpf) &&
    validate(courier.cpf!) &&
    !isEmpty(courier.phone?.ddd) &&
    !isEmpty(courier.phone?.number)
  );
};

export const bankAccountSet = (courier: CourierProfile | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.bankAccount?.id) &&
    !isEmpty(courier.bankAccount?.name) &&
    !isEmpty(courier.bankAccount?.agency) &&
    !isEmpty(courier.bankAccount?.account) &&
    !isEmpty(courier.bankAccount?.digit)
  );
};
