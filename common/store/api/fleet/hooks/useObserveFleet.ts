import { Fleet, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export default function (fleetId: string | undefined) {
  // context
  const api = React.useContext(ApiContext);

  // app state
  const [fleet, setFleet] = React.useState<WithId<Fleet>>();

  // side effects
  // observe order
  React.useEffect(() => {
    if (!fleetId) return;
    return api.fleet().observeFleet(fleetId, setFleet);
  }, [fleetId]);

  return fleet;
}
