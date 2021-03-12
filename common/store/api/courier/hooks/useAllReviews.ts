import { Review } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useAllReviews = (courierId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [reviews, setReviews] = React.useState<Review[]>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setReviews(await api.courier().fetchAllReviews(courierId));
    })();
  }, [courierId, api]);
  return reviews;
};
