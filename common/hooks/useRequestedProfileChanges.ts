import { ProfileChange, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../app/context';

export const useRequestedProfileChanges = (accountId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [profileChanges, setProfileChanges] = React.useState<WithId<ProfileChange> | null>();
  // side-effects
  React.useEffect(() => {
    if (!accountId) return;
    (async () => {
      const pendingChanges = await api.user().fetchPendingChanges(accountId);
      if (pendingChanges.length) setProfileChanges(pendingChanges[0]);
      else setProfileChanges(null);
    })();
  }, [accountId, api]);
  return profileChanges;
};
