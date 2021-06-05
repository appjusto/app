import React from 'react';
import { ApiContext } from '../../app/context';

export const useServerTime = () => {
  const api = React.useContext(ApiContext);
  const [delta, setDelta] = React.useState<number>();
  React.useEffect(() => {
    (async () => {
      const serverTime = await api.getServerTime();
      setDelta(serverTime - new Date().getTime());
    })();
  }, [api]);
  return () => (delta ? new Date(new Date().getTime() + delta) : new Date());
};
