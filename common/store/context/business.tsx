import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { useBusiness } from '../api/business/hooks/useBusiness';
import { ActiveOrderProvider } from './order';

interface Value {
  businessId?: string;
  business?: WithId<Business>;
}

const BusinessContext = React.createContext<Value>({});

interface Props {
  businessId: string;
  orderId?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ businessId, orderId, children }: Props) => {
  const business = useBusiness(businessId);
  const value: Value = { businessId, business };
  return (
    <BusinessContext.Provider value={value}>
      <ActiveOrderProvider businessId={businessId} orderId={orderId}>
        {children}
      </ActiveOrderProvider>
    </BusinessContext.Provider>
  );
};

export const useContextBusiness = () => {
  const value = React.useContext(BusinessContext);
  return value.business;
};

export const useContextBusinessId = () => {
  const value = React.useContext(BusinessContext);
  return value.businessId!;
};
