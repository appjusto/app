import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { State } from '..';
import { ConsumerState } from './types';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = createSelector(
  getConsumerState,
  (consumerState) => consumerState.consumer
);

export const getPaymentMethodById = createSelector(getConsumer, (consumer) =>
  memoize((id: string) => consumer?.paymentChannel?.methods?.find((method) => method.id === id))
);
