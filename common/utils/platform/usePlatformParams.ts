import { PlatformParams } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../app/context';
import { getUser } from '../../store/user/selectors';

export const usePlatformParams = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [platformParams, setPlatformParams] = React.useState<PlatformParams>();
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      setPlatformParams(await api.platform().fetchPlatformParams());
    })();
  }, [api]);
  return platformParams;
};
