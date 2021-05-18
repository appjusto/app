import { BankAccount, ConsumerProfile, CourierCompany, CourierProfile } from '@appjusto/types';
import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { isEmpty } from 'lodash';

export const isConsumerProfileComplete = (
  profile: Partial<ConsumerProfile> | undefined
): boolean => {
  if (!profile) return false;
  return !isEmpty(profile.name) && cpfutils.isValid(profile.cpf ?? '');
};

export const courierInfoSet = (courier: Partial<CourierProfile> | undefined): boolean => {
  if (!courier) return false;
  return (
    !isEmpty(courier.name) &&
    !isEmpty(courier.surname) &&
    cpfutils.isValid(courier.cpf!) &&
    courier.phone?.length === 11
  );
};

export const companyInfoSet = (company: CourierCompany): boolean => {
  if (!company) return false;
  return (
    !isEmpty(company.cnpj) &&
    cnpjutils.isValid(company.cnpj) &&
    !isEmpty(company.name) &&
    !isEmpty(company.cep) &&
    !isEmpty(company.address) &&
    !isEmpty(company.city) &&
    !isEmpty(company.state)
  );
};

export const bankAccountSet = ({ name, agency, account, personType, type }: BankAccount): boolean =>
  !isEmpty(name) && !isEmpty(agency) && !isEmpty(account) && !isEmpty(personType) && !isEmpty(type);
