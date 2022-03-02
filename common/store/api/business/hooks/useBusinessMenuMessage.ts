import { BusinessMenuMessage } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useBusinessMenuMessage = (businessId: string) => {
  // context
  const api = React.useContext(ApiContext);
  //state
  const [message, setMessage] = React.useState<BusinessMenuMessage | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    (async () => {
      setMessage(await api.business().fetchBusinessMenuMessage(businessId));
    })();
  }, [api, businessId]);
  return message;
};
