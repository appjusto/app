import { PlatformAccess } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../app/context';

export const usePlatformAccess = () => {
  const api = React.useContext(ApiContext);
  const [platformAccess, setPlatformAccess] = React.useState<PlatformAccess>();
  React.useEffect(() => {
    (async () => {
      setPlatformAccess(await api.platform().fetchPlatformAccess());
    })();
    return () => setPlatformAccess(undefined);
  }, [api]);
  return platformAccess;
};
