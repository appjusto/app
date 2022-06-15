import { WithId } from '@appjusto/types';
import { isEqual } from 'lodash';
import React from 'react';

export const useIds = <T extends object>(objects: WithId<T>[] | undefined) => {
  // state
  const [ids, setIds] = React.useState<string[] | undefined>(undefined);
  // side effects
  React.useEffect(() => {
    if (!objects) setIds(undefined);
    else if (!ids) setIds(objects.map((o) => o.id));
    else {
      const objectsIds = objects.map((o) => o.id);
      if (!isEqual(ids, objectsIds)) setIds(objectsIds);
    }
  }, [objects]);
  // results
  return ids ?? [];
};
