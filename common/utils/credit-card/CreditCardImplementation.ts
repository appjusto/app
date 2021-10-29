import creditCardType from 'credit-card-type';
import { CreditCardType, CreditCardTypeStrings, ICreditCard } from './CreditCard';
import { GetCreditCard, GetType, IsAllowed, StringToCreditCardType } from './ICreditCardRepository';

const iconVisaFlag = require('../../../assets/icons/credit-card-flag-visa.png');
const iconGenericFlag = require('../../../assets/icons/credit-card-flag-generic.png');

const ALLOWED_CREDIT_CARD_TYPES: CreditCardType[] = [
  CreditCardType.diners_club,
  CreditCardType.elo,
  CreditCardType.mastercard,
  CreditCardType.visa,
];

/**
 * Map credit card strings from package `credit-card-type` to `CreditCardType`.
 */
const stringToCreditCardType: StringToCreditCardType = {
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
};

/**
 * Verifies credit card number and returns the corresponding `CreditCardType`.
 *
 * @param creditCardNumber - credit card number.
 */
const _getType: GetType = (creditCardNumber: string): CreditCardType => {
  const typeCard = creditCardType(creditCardNumber);
  const type = typeCard?.at(0)?.type;

  if (typeCard.length === 1 && type && Object.keys(stringToCreditCardType).includes(type)) {
    return stringToCreditCardType[type];
  }

  return CreditCardType.undefined;
};

/**
 * Returns .
 *
 * @param creditCardType - credit card type.
 */
export const getCreditCard: GetCreditCard = (creditCardNumber: string): ICreditCard => {
  const type = CreditCardType[_getType(creditCardNumber)] as CreditCardTypeStrings;

  return _creditCards[type];
};

/**
 * Checks wheter the app supports the credit card type.
 *
 * @param creditCardType - credit card type.
 */
export const isAllowed: IsAllowed = (creditCardType: CreditCardType): boolean => {
  return ALLOWED_CREDIT_CARD_TYPES.includes(creditCardType);
};

// TODO: Implement all credit card type icon.
const _creditCards: Record<CreditCardTypeStrings, ICreditCard> = {
  american_express: {
    type: CreditCardType.american_express,
    label: 'American Express',
    icon: iconGenericFlag,
  },
  diners_club: {
    type: CreditCardType.diners_club,
    label: 'Diners Club',
    icon: iconGenericFlag,
  },
  discover: {
    type: CreditCardType.discover,
    label: 'Discover',
    icon: iconGenericFlag,
  },
  elo: {
    type: CreditCardType.elo,
    label: 'Elo',
    icon: iconGenericFlag,
  },
  hiper: {
    type: CreditCardType.hiper,
    label: 'Hiper',
    icon: iconGenericFlag,
  },
  hipercard: {
    type: CreditCardType.hipercard,
    label: 'Hipercard',
    icon: iconGenericFlag,
  },
  jcb: {
    type: CreditCardType.jcb,
    label: 'JCB',
    icon: iconGenericFlag,
  },
  maestro: {
    type: CreditCardType.maestro,
    label: 'Maestro',
    icon: iconGenericFlag,
  },
  mastercard: {
    type: CreditCardType.mastercard,
    label: 'Mastercard',
    icon: iconGenericFlag,
  },
  mir: {
    type: CreditCardType.mir,
    label: 'Mir',
    icon: iconGenericFlag,
  },
  unionpay: {
    type: CreditCardType.unionpay,
    label: 'Union Pay',
    icon: iconGenericFlag,
  },
  visa: {
    type: CreditCardType.visa,
    label: 'Visa',
    icon: iconVisaFlag,
  },
  undefined: {
    type: CreditCardType.undefined,
    label: '',
    icon: undefined,
  },
};
