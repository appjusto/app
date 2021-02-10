import { AnyAction } from 'redux';
import { ConfigState } from './types';

export default function (initialState: ConfigState) {
  return (state = initialState, action: AnyAction) => {
    const { type } = action;
    if (state.env === 'development') console.log(type);
    switch (type) {
      default:
        return state;
    }
  };
}
