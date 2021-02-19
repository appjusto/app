import { Review } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

type Props = {
  orderId: string;
  courierId?: string;
};

export const useCourierReview = ({ orderId, courierId }: Props) => {
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
  }, []);
  return review;
};
