import { BankAccountPersonType, BankAccountType } from '@appjusto/types';

export const getCEFAccountCode = (personType: BankAccountPersonType, type: BankAccountType) => {
  if (personType === 'Pessoa Jurídica') {
    if (type === 'Corrente') {
      return '003';
    } else if (type === 'Poupança') {
      return '022';
    }
  } else if (personType === 'Pessoa Física') {
    if (type === 'Corrente') {
      return '001';
    } else if (type === 'Simples') {
      return '002';
    } else if (type === 'Poupança') {
      return '013';
    } else if (type === 'Nova Poupança') {
      return '1288';
    }
  }
  return '';
};
