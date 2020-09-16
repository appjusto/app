import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { State } from '..';
import { ConsumerState } from './types';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = createSelector(
  getConsumerState,
  (consumerState) => consumerState.consumer
);

export const getCardById = createSelector(getConsumer, (consumer) =>
  memoize((cardId: string) => consumer?.cards?.find((card) => card.id === cardId))
);
