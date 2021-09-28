import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useTotalWithdrawsThisMonth = (courierId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [total, setTotal] = React.useState<number>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setTotal(await api.courier().fetchTotalWithdrawsThisMonth(courierId));
    })();
  }, [courierId, api]);
  return total;
};
