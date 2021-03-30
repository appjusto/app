import { State } from '..';
import { ConfigState } from './types';

export const getConfigState = (state: State): ConfigState => {
  return state.config;
};

export const getExtra = (state: State) => getConfigState(state).extra;
export const getFlavor = (state: State) => getConfigState(state).flavor;
