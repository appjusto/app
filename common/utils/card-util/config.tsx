export interface ICreditCardContextData {
  getType(creditCardNumber: string): CreditCardType;
  isAllowed(creditCardType: CreditCardType): boolean;
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
  unknown,
}

export const creditCardTypeParse: Record<string, CreditCardType> = {
  'american-express': CreditCardType.american_express,
  'diners-club': CreditCardType.diners_club,
  'discover': CreditCardType.discover,
  'elo': CreditCardType.elo,
  'hiper': CreditCardType.hiper,
  'hipercard': CreditCardType.hipercard,
  'jcb': CreditCardType.jcb,
  'maestro': CreditCardType.maestro,
  'mastercard': CreditCardType.mastercard,
  'mir': CreditCardType.mir,
  'unionpay': CreditCardType.unionpay,
  'visa': CreditCardType.visa,
  'unknown': CreditCardType.unknown,
};

export const allowedCreditCardTypes: CreditCardType[] = [
  CreditCardType.diners_club,
  CreditCardType.elo,
  CreditCardType.mastercard,
  CreditCardType.visa,
];
