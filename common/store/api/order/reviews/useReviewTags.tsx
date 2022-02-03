import { Flavor, ReviewTag, WithId } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useReviewTags = (agent: Flavor, type: string) => {
  // context
  const api = useContext(ApiContext);
  // state
  const [tags, setTags] = React.useState<WithId<ReviewTag>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setTags(await api.reviews().fetchReviewTags(agent, type));
    })();
  }, [type, api, agent]);
  return tags;
};
