import creditCardType from 'credit-card-type';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import {
  ALLOWED_CREDIT_CARD_TYPES,
  CreditCardContent,
  creditCardToContent,
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
      return CreditCardType.not_defined;
      //return 'not-defined';
    }

    const type = typeCard[0].type;

    if (Object.keys(creditCardTypeParse).includes(type)) {
      console.log('Tipo: ' + type);
      return creditCardTypeParse[type];
    }
    console.log('Nao foi possivel definir um tipo');
    return CreditCardType.unknown;
    //return 'unknown';
  }, []);

  const getContent = useCallback((creditCardType: CreditCardType): CreditCardContent => {
    // console.log(Object.keys(creditCardFlagPNGParse));
    const type = CreditCardType[creditCardType];
    console.log(CreditCardType[creditCardType] === 'visa');
    if (Object.keys(creditCardToContent).includes(type)) {
      return creditCardToContent['american_express'];
    }
    return creditCardToContent['unknown'];
  }, []);

  const isAllowed = useCallback((creditCardType: CreditCardType) => {
    return ALLOWED_CREDIT_CARD_TYPES.includes(creditCardType);
  }, []);

  const value: ICreditCardContextData = { getType, isAllowed, getContent };

  return (
    <CreditCardFancyContext.Provider value={value}>{children}</CreditCardFancyContext.Provider>
  );
}

export function useContextCreditCardFancy() {
  const context = useContext(CreditCardFancyContext);
  return context;
}
