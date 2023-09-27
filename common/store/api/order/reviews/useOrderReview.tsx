import React from 'react';
import { OrderReview, WithId } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useOrderReview = (orderId: string, consumerId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [review, setReview] = React.useState<WithId<OrderReview> | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    (async () => {
      setReview(await api.reviews().fetchOrderReview(orderId, consumerId));
    })();
  }, [api, orderId, consumerId]);
  // result
  return review;
};
