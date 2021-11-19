import { ReactNode } from 'react';

export interface ICreditCard {
  type: CreditCardType;

  label: string;

  icon?: ReactNode;
}

export enum CreditCardType {
  american_express,
  diners_club,
  discover,
  elo,
  hiper,
  hipercard,
  jcb,
  maestro,
  mastercard,
  mir,
  unionpay,
  visa,
  undefined,
}

export type CreditCardTypeStrings = keyof typeof CreditCardType;
