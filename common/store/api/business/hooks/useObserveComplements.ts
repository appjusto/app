import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveComplements = (businessId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [complementsGroups, setComplementsGroups] = React.useState<WithId<ComplementGroup>[]>([]);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeComplementsGroups(businessId, setComplementsGroups);
    return () => unsub();
  }, [api, businessId]);
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeComplements(businessId, setComplements);
    return () => unsub();
  }, [api, businessId]);
  // result
  return { complementsGroups, complements };
};
