import creditCardType from 'credit-card-type';
import {
  creditCardAmexIcon,
  creditCardDinersIcon,
  creditCardDiscoverIcon,
  creditCardEloIcon,
  creditCardHipercardIcon,
  creditCardHiperIcon,
  creditCardJcbIcon,
  creditCardMaestroIcon,
  creditCardMastercardIcon,
  creditCardMirIcon,
  creditCardUnionpayIcon,
  creditCardVisaIcon
} from '../../../assets/icons/credit-card';
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
  const type = typeCard?.at(0)?.type;

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

const _creditCards: Record<CreditCardTypeStrings, ICreditCard> = {
  american_express: {
    type: CreditCardType.american_express,
    label: 'American Express',
    icon: creditCardAmexIcon,
  },
  diners_club: {
    type: CreditCardType.diners_club,
    label: 'Diners Club',
    icon: creditCardDinersIcon,
  },
  discover: {
    type: CreditCardType.discover,
    label: 'Discover',
    icon: creditCardDiscoverIcon,
  },
  elo: {
    type: CreditCardType.elo,
    label: 'Elo',
    icon: creditCardEloIcon,
  },
  hiper: {
    type: CreditCardType.hiper,
    label: 'Hiper',
    icon: creditCardHiperIcon,
  },
  hipercard: {
    type: CreditCardType.hipercard,
    label: 'Hipercard',
    icon: creditCardHipercardIcon,
  },
  jcb: {
    type: CreditCardType.jcb,
    label: 'JCB',
    icon: creditCardJcbIcon,
  },
  maestro: {
    type: CreditCardType.maestro,
    label: 'Maestro',
    icon: creditCardMaestroIcon,
  },
  mastercard: {
    type: CreditCardType.mastercard,
    label: 'Mastercard',
    icon: creditCardMastercardIcon,
  },
  mir: {
    type: CreditCardType.mir,
    label: 'Mir',
    icon: creditCardMirIcon,
  },
  unionpay: {
    type: CreditCardType.unionpay,
    label: 'Union Pay',
    icon: creditCardUnionpayIcon,
  },
  visa: {
    type: CreditCardType.visa,
    label: 'Visa',
    icon: creditCardVisaIcon,
  },
  undefined: {
    type: CreditCardType.undefined,
    label: '',
    icon: undefined,
  },
};
