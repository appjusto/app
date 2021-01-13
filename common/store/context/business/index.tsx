import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useBusiness } from '../../api/business/hooks/business';

interface Value {
  businessId?: string;
  business?: WithId<Business>;
}

const BusinessContext = React.createContext<Value>({});

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ businessId, children }: Props) => {
  const business = useBusiness(businessId);
  const value: Value = { businessId, business };
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

export const useContextBusiness = () => {
  const value = React.useContext(BusinessContext);
  return value.business!;
};

export const useContextBusinessId = () => {
  const value = React.useContext(BusinessContext);
  return value.businessId!;
};
