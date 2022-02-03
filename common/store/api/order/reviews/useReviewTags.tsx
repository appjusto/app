import { ReviewTag, ReviewTagType, WithId } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useReviewTags = (type: ReviewTagType) => {
  // context
  const api = useContext(ApiContext);
  // state
  const [tags, setTags] = React.useState<WithId<ReviewTag>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setTags(await api.reviews().fetchReviewTags(type));
    })();
  }, [type, api]);
  return tags;
};
