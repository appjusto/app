import { State } from '..';
import { ConsumerState, Consumer } from '../types/consumer';

export const getConsumerState = (state: State): ConsumerState => state.consumer;

export const getConsumer = (state: State): Consumer | undefined => getConsumerState(state).consumer;

export const getConsumerLocation = (state: State) => getConsumer(state)?.location;
