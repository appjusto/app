import { State } from '..';
import { ConsumerState, Consumer } from './types';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = (state: State): Consumer | undefined => getConsumerState(state).consumer;
