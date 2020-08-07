import { State } from '..';
import { ConsumerState } from './types';
import Consumer from './types/Consumer';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = (state: State): Consumer | undefined => getConsumerState(state).consumer;
