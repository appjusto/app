import creditCardType from 'credit-card-type';
import { DinersIcon } from '../../../assets/icons/credit-card/diners-icon';
import { EloIcon } from '../../../assets/icons/credit-card/elo-icon';
import { MasterCardIcon } from '../../../assets/icons/credit-card/mastercard-icon';
import { VisaIcon } from '../../../assets/icons/credit-card/visa-icon';
import { CreditCardType, CreditCardTypeStrings, ICreditCard } from './CreditCard';
import { GetCreditCard, GetType, IsAllowed, StringToCreditCardType } from './ICreditCardRepository';

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
  const type = typeCard[0]?.type;

  if (typeCard.length === 1 && type && Object.keys(stringToCreditCardType).includes(type)) {
    return stringToCreditCardType[type];
  }

  return CreditCardType.undefined;
};

/**
 * Returns credit card metadata from creditCardNumber.
 *
 * @param creditCardNumber - credit card number.
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
    icon: undefined,
  },
  diners_club: {
    type: CreditCardType.diners_club,
    label: 'Diners Club',
    icon: DinersIcon,
  },
  discover: {
    type: CreditCardType.discover,
    label: 'Discover',
    icon: undefined,
  },
  elo: {
    type: CreditCardType.elo,
    label: 'Elo',
    icon: EloIcon,
  },
  hiper: {
    type: CreditCardType.hiper,
    label: 'Hiper',
    icon: undefined,
  },
  hipercard: {
    type: CreditCardType.hipercard,
    label: 'Hipercard',
    icon: undefined,
  },
  jcb: {
    type: CreditCardType.jcb,
    label: 'JCB',
    icon: undefined,
  },
  maestro: {
    type: CreditCardType.maestro,
    label: 'Maestro',
    icon: undefined,
  },
  mastercard: {
    type: CreditCardType.mastercard,
    label: 'Mastercard',
    icon: MasterCardIcon,
  },
  mir: {
    type: CreditCardType.mir,
    label: 'Mir',
    icon: undefined,
  },
  unionpay: {
    type: CreditCardType.unionpay,
    label: 'Union Pay',
    icon: undefined,
  },
  visa: {
    type: CreditCardType.visa,
    label: 'Visa',
    icon: VisaIcon,
  },
  undefined: {
    type: CreditCardType.undefined,
    label: '',
    icon: undefined,
  },
};
