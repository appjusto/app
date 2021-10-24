const iconVisaFlag = require('../../../assets/icons/credit-card-flag-visa.png');
const iconGenericFlag = require('../../../assets/icons/credit-card-flag-generic.png');

export interface ICreditCardContextData {
  //getType(creditCardNumber: string): CreditCardType;
  getType(creditCardNumber: string): string;
  isAllowed(creditCardType: CreditCardType): boolean;
  getFlagPNG(creditCardType: string): any;
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
  not_defined,
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
  'not-defined': CreditCardType.not_defined,
};

export const creditCardFlagPNGParse: Record<any[CreditCardType], any> = {
  [CreditCardType.american_express]: iconGenericFlag,
  [CreditCardType.diners_club]: iconGenericFlag,
  [CreditCardType.discover]: iconGenericFlag,
  [CreditCardType.elo]: iconGenericFlag,
  [CreditCardType.hiper]: iconGenericFlag,
  [CreditCardType.hipercard]: iconGenericFlag,
  [CreditCardType.jcb]: iconGenericFlag,
  [CreditCardType.maestro]: iconGenericFlag,
  [CreditCardType.mastercard]: iconGenericFlag,
  [CreditCardType.mir]: iconGenericFlag,
  [CreditCardType.unionpay]: iconGenericFlag,
  [CreditCardType.visa]: iconVisaFlag,
  [CreditCardType.unknown]: iconGenericFlag,
  [CreditCardType.not_defined]: iconGenericFlag,
};

export const creditCardFlagPNGParse2: Record<string, any> = {
  'american-express': iconGenericFlag,
  'diners-club': iconGenericFlag,
  'discover': iconGenericFlag,
  'elo': iconGenericFlag,
  'hiper': iconGenericFlag,
  'hipercard': iconGenericFlag,
  'jcb': iconGenericFlag,
  'maestro': iconGenericFlag,
  'mastercard': iconGenericFlag,
  'mir': iconGenericFlag,
  'unionpay': iconGenericFlag,
  'visa': iconVisaFlag,
  'unknown': iconGenericFlag,
  'not-defined': iconGenericFlag,
};

export const allowedCreditCardTypes: CreditCardType[] = [
  CreditCardType.diners_club,
  CreditCardType.elo,
  CreditCardType.mastercard,
  CreditCardType.visa,
  CreditCardType.not_defined,
];
