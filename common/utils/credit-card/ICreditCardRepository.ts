import { CreditCardType, ICreditCard } from './CreditCard';

export type StringToCreditCardType = Record<string, CreditCardType>;
export type GetCreditCard = (creditCardNumber: string) => ICreditCard;
export type GetType = (creditCardNumber: string) => CreditCardType;
export type IsAllowed = (creditCardType: CreditCardType) => boolean;
