import React from 'react';
import { OrderConsumerReview, WithId } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useOrderReview = (orderId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [review, setReview] = React.useState<WithId<OrderConsumerReview> | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    (async () => {
      setReview(await api.reviews().fetchOrderReview(orderId));
    })();
  }, [api, orderId]);
  // result
  return review;
};
