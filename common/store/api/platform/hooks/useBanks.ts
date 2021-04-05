import { Bank, WithId } from 'appjusto-types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export default function () {
  // context
  const api = useContext(ApiContext);
  // state
  const [banks, setBanks] = React.useState<WithId<Bank>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setBanks(await api.platform().fetchBanks());
    })();
  }, [api]);
  return banks;
}
