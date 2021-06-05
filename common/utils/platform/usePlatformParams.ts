import { PlatformParams } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../app/context';

export const usePlatformParams = () => {
  const api = React.useContext(ApiContext);
  const [platformParams, setPlatformParams] = React.useState<PlatformParams>();
  React.useEffect(() => {
    (async () => {
      setPlatformParams(await api.platform().fetchPlatformParams());
    })();
  }, [api]);
  return platformParams;
};
