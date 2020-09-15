import { ConsumerProfile } from 'appjusto-types';

import { State } from '..';
import { ConsumerState } from './types';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = (state: State): ConsumerProfile | undefined =>
  getConsumerState(state).consumer;
