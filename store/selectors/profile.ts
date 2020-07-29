import { State } from '..';
import { Consumer } from '../types/consumer';
import { Courier } from '../types/courier';
import { getFlavor } from './config';
import { getConsumer } from './consumer';
import { getCourier } from './courier';

export const getProfile = (state: State): Courier | Consumer | undefined => {
  const flavor = getFlavor(state);
  if (flavor === 'consumer') return getConsumer(state);
  if (flavor === 'courier') return getCourier(state);
};
