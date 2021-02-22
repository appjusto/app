import { Review } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useCourierReview = (orderId: string, courierId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [review, setReview] = React.useState<Review>();
  // side effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setReview(await api.courier().fetchReview(courierId, orderId));
    })();
  }, [api, orderId, courierId]);
  return review;
};
