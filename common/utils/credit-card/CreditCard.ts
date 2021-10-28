export interface ICreditCard {
  type: CreditCardType;

  label: string;

  icon: any;
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
