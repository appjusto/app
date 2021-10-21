import creditCardType from 'credit-card-type';
import React, { createContext, useCallback, useContext } from 'react';

interface ICreditCardContextData {
  getType(creditCardNumber: string): CreditCardType;
  isAllowed(creditCardType: CreditCardType): boolean;
}

const CreditCardContext = createContext<ICreditCardContextData>({} as ICreditCardContextData);
CreditCardContext.displayName = 'CreditCardContext';

export const CreditCardProvider: React.FC = ({ children }) => {
  // state

  const getType = useCallback((creditCardNumber: string) => {
    const typeCard = creditCardType(creditCardNumber);
    if (typeCard.length !== 1) {
      return CreditCardType.unknown;
    }

    const type = typeCard[0].type;

    if (Object.keys(creditCardTypeParse).includes(type)) {
      return creditCardTypeParse[type];
    }
    return CreditCardType.unknown;
  }, []);

  const isAllowed = useCallback((creditCardType: CreditCardType) => {
    return allowedCreditCardTypes.includes(creditCardType);
  }, []);

  const value: ICreditCardContextData = { getType, isAllowed };
  // console.log('CreditCardProvider', value.order?.id);
  return <CreditCardContext.Provider value={value}>{children}</CreditCardContext.Provider>;
};

export const useContextCreditCard: ICreditCardContextData = () => {
  const context = useContext(CreditCardContext);
  return context;
};

enum CreditCardType {
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

const creditCardTypeParse: Record<string, CreditCardType> = {
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

const allowedCreditCardTypes: CreditCardType[] = [
  CreditCardType.diners_club,
  CreditCardType.elo,
  CreditCardType.mastercard,
  CreditCardType.visa,
];
