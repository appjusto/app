import creditCardType from 'credit-card-type';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import {
  allowedCreditCardTypes,
  creditCardFlagPNGParse,
  creditCardFlagPNGParse2,
  CreditCardType,
  creditCardTypeParse,
  ICreditCardContextData
} from './config';

const CreditCardFancyContext = createContext<ICreditCardContextData>({} as ICreditCardContextData);
CreditCardFancyContext.displayName = 'CreditCardContext';

export function CreditCardProvider({ children }: { children: ReactNode }) {
  const getType = useCallback((creditCardNumber: string) => {
    const typeCard = creditCardType(creditCardNumber);
    if (typeCard.length !== 1) {
      console.log('Tipo ainda nao definido');
      //return CreditCardType.not_defined;
      return 'not-defined';
    }

    const type = typeCard[0].type;

    if (Object.keys(creditCardTypeParse).includes(type)) {
      console.log('Tipo: ' + type);
      //return creditCardTypeParse[type];
      return type;
    }
    console.log('Nao foi possivel definir um tipo');
    //return CreditCardType.unknown;
    return 'unknown';
  }, []);

  const getFlagPNG = useCallback((creditCardType: string) => {
    if (Object.keys(creditCardFlagPNGParse2).includes(creditCardType)) {
      return creditCardFlagPNGParse2[creditCardType];
    }
    return creditCardFlagPNGParse[CreditCardType.unknown];
  }, []);

  const isAllowed = useCallback((creditCardType: CreditCardType) => {
    return allowedCreditCardTypes.includes(creditCardType);
  }, []);

  const value: ICreditCardContextData = { getType, isAllowed, getFlagPNG };

  return (
    <CreditCardFancyContext.Provider value={value}>{children}</CreditCardFancyContext.Provider>
  );
}

export function useContextCreditCardFancy() {
  const context = useContext(CreditCardFancyContext);
  return context;
}
