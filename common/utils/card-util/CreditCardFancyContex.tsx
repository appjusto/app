import creditCardType from 'credit-card-type';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import { allowedCreditCardTypes, CreditCardType, creditCardTypeParse } from './config';

interface ICreditCardContextData {
  getType(creditCardNumber: string): CreditCardType;
  isAllowed(creditCardType: CreditCardType): boolean;
}

const CreditCardContext = createContext<ICreditCardContextData>({} as ICreditCardContextData);
CreditCardContext.displayName = 'CreditCardContext';

export function CreditCardProvider({ children }: { children: ReactNode }) {
  const getType = useCallback((creditCardNumber: string) => {
    const typeCard = creditCardType(creditCardNumber);
    if (typeCard.length !== 1) {
      console.log('Tipo ainda nao definido');
      return CreditCardType.unknown;
    }

    const type = typeCard[0].type;

    if (Object.keys(creditCardTypeParse).includes(type)) {
      console.log('Tipo: ' + creditCardTypeParse[type]);
      return creditCardTypeParse[type];
    }
    console.log('Nao foi possivel definir um tipo');
    return CreditCardType.unknown;
  }, []);

  const isAllowed = useCallback((creditCardType: CreditCardType) => {
    return allowedCreditCardTypes.includes(creditCardType);
  }, []);

  const value: ICreditCardContextData = { getType, isAllowed };

  return <CreditCardContext.Provider value={value}>{children}</CreditCardContext.Provider>;
}

export function useContextCreditCard() {
  const context = useContext(CreditCardContext);
  return context;
}
