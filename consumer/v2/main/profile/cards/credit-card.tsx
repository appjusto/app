import creditCardType from 'credit-card-type';
import { CreditCardType, CreditCardTypeCardBrandId } from 'credit-card-type/dist/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { DinersIcon } from '../../../../../assets/icons/credit-card/diners-icon';
import { EloIcon } from '../../../../../assets/icons/credit-card/elo-icon';
import { MasterCardIcon } from '../../../../../assets/icons/credit-card/mastercard-icon';
import { VisaIcon } from '../../../../../assets/icons/credit-card/visa-icon';

creditCardType.addCard({
  niceType: 'VR Refeição',
  type: 'vr',
  patterns: [627416, 637202, 637036],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: 'CVV',
    size: 3,
  },
});

const SupportedTypes: (CreditCardTypeCardBrandId | 'vr')[] = [
  'mastercard',
  'visa',
  'elo',
  'diners-club',
  'vr',
];

export const getCardType = (number: string) => {
  const types = creditCardType(number);
  if (types.length !== 1) return undefined;
  const [type] = types;
  return type;
};

export const isCardTypeSupported = (type: CreditCardType | undefined) =>
  SupportedTypes.includes(type?.type as CreditCardTypeCardBrandId);

export const getCardTypeSVG = (type: CreditCardType) => {
  if (type.type === 'mastercard') return <MasterCardIcon />;
  if (type.type === 'visa') return <VisaIcon />;
  if (type.type === 'elo') return <EloIcon />;
  if (type.type === 'diners-club') return <DinersIcon />;
  if (type.type === 'vr') return <DinersIcon />; // TODO: substituir
  return null;
};

export interface CreditCardInfo {
  number: string;
  cvv: string;
  month: string;
  year: string;
  name: string;
}

export const validateCard = (info: CreditCardInfo) => {
  const { number, month, year, cvv, name } = info;
  if (!getCardType(number)) return 'card-unknown';
  if (!isCardTypeSupported(getCardType(number))) return 'card-unsupported';
  if (number.length < 16) return 'number-invalid';
  if (month.length === 0) return 'month-empty';
  if (
    month.length === 1 ||
    isNaN(parseInt(month, 10)) ||
    parseInt(month, 10) < 1 ||
    parseInt(month, 10) > 12
  )
    return 'month-invalid';
  if (year.length === 0) return 'month-empty';
  if (year.length === 1 || isNaN(parseInt(year, 10))) return 'year-invalid';
  const now = new Date();
  if (
    new Date(parseInt(`20${year}`, 10), parseInt(month, 10) - 1).getTime() <
    new Date(now.getFullYear(), now.getMonth()).getTime()
  )
    return 'valid-thru-invalid';
  if (cvv.length === 0) return 'cvv-empty';
  if (cvv.length === 2 || isNaN(parseInt(cvv, 10))) return 'cvv-invalid';
  if (isEmpty(name)) return 'name-invalid';
  return null;
};
