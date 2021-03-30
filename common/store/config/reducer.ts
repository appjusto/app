import { AnyAction } from 'redux';
import { ConfigState } from './types';

export default function (initialState: ConfigState) {
  if (initialState.extra.environment !== 'live') console.log(initialState.extra);
  return (state = initialState, action: AnyAction) => {
    const { type } = action;
    if (state.extra.environment !== 'live') console.log(type);
    switch (type) {
      default:
        return state;
    }
  };
}
