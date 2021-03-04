import { CourierProfile } from 'appjusto-types';
import { validate } from 'gerador-validador-cpf';
import { isEmpty } from 'lodash';

export const courierInfoSet = (courier: Partial<CourierProfile> | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.name) &&
    !isEmpty(courier.surname) &&
    courier.cpf?.length === 11 &&
    validate(courier.cpf!) &&
    courier.phone?.length === 11
  );
};

export const companyInfoSet = (courier: Partial<CourierProfile> | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.company?.cnpj) &&
    !isEmpty(courier.company?.name) &&
    !isEmpty(courier.company?.cep) &&
    !isEmpty(courier.company?.address) &&
    !isEmpty(courier.company?.city) &&
    !isEmpty(courier.company?.state)
  );
};

export const bankAccountSet = (courier: Partial<CourierProfile> | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.bankAccount?.name) &&
    !isEmpty(courier.bankAccount?.agency) &&
    !isEmpty(courier.bankAccount?.account)
  );
};
