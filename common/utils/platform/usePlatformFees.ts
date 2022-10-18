import { PlatformFees } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../app/context';
import { getUser } from '../../store/user/selectors';

export const usePlatformFees = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [fees, setFees] = React.useState<PlatformFees>();
  // side effects
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      setFees(await api.platform().fetchPlatformFees());
    })();
  }, [api, user]);

  return { fees };
};
