import { ProfileChange, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../app/context';

export const useRequestedProfileChanges = (accountId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [profileChanges, setProfileChanges] = React.useState<WithId<ProfileChange>[]>([]);
  // side-effects
  React.useEffect(() => {
    if (!accountId) return;
    (async () => {
      setProfileChanges(await api.user().fetchPendingChanges(accountId));
    })();
  }, [accountId, api]);
  return profileChanges;
};
