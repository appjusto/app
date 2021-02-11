import { Bank, WithId } from 'appjusto-types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export default function () {
  // context
  const api = useContext(ApiContext);
  // state
  const [issues, setIssues] = React.useState<WithId<Bank>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setIssues(await api.platform().fetchBanks());
    })();
  }, []);
  return issues;
}
