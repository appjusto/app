import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../common/app/context';
import { getUser } from '../../common/store/user/selectors';

export const useBusinessesManagedBy = () => {
  // context
  const user = useSelector(getUser);
  const api = React.useContext(ApiContext);
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setBusinesses(await api.business().fetchBusinessesManagedBy(user!.email!));
    })();
  }, [api, user]);
  return businesses;
};
