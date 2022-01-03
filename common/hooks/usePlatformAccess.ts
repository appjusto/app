import { PlatformAccess } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../app/context';
import { getUser } from '../store/user/selectors';

export const usePlatformAccess = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [platformAccess, setPlatformAccess] = React.useState<PlatformAccess>();
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      setPlatformAccess(await api.platform().fetchPlatformAccess());
    })();
  }, [api]);
  return platformAccess;
};
