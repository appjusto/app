import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { BankAccount, CourierCompany, CourierProfile } from 'appjusto-types';
import { isEmpty } from 'lodash';

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

export const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) && !isEmpty(bankAccount.agency) && !isEmpty(bankAccount.account)
  );
};
