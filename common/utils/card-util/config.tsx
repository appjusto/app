const iconVisaFlag = require('../../../assets/icons/credit-card-flag-visa.png');
//const iconTestFlag = require('../../../assets/icons/credit-card-flag-generic.png');
const iconGenericFlag = require('../../../assets/icons/credit-card-flag-generic.png');

export interface ICreditCardContextData {
  getType(creditCardNumber: string): CreditCardType;
  isAllowed(creditCardType: CreditCardType): boolean;
  getContent(creditCardType: CreditCardType): any;
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

export interface CreditCardContent {
  png: any;
  niceType: string;
}

type typeToContent = Record<keyof typeof CreditCardType, CreditCardContent>;

export const creditCardToContent: typeToContent = {
  american_express: { png: iconGenericFlag, niceType: 'American Express' },
  diners_club: { png: iconGenericFlag, niceType: 'Diners Club' },
  discover: { png: iconGenericFlag, niceType: 'Discover' },
  elo: { png: iconGenericFlag, niceType: 'Elo' },
  hiper: { png: iconGenericFlag, niceType: 'Hiper' },
  hipercard: { png: iconGenericFlag, niceType: 'Hipercard' },
  jcb: { png: iconGenericFlag, niceType: 'JCB' },
  maestro: { png: iconGenericFlag, niceType: 'Maestro' },
  mastercard: { png: iconGenericFlag, niceType: 'Master Card' },
  mir: { png: iconGenericFlag, niceType: 'MIR' },
  unionpay: { png: iconGenericFlag, niceType: 'Unionpay' },
  visa: { png: iconVisaFlag, niceType: 'Visa' },
  unknown: { png: iconGenericFlag, niceType: '' },
  not_defined: { png: iconGenericFlag, niceType: '' },
};

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

export const ALLOWED_CREDIT_CARD_TYPES: CreditCardType[] = [
  CreditCardType.diners_club,
  CreditCardType.elo,
  CreditCardType.mastercard,
  //CreditCardType.visa,
  CreditCardType.not_defined,
];
