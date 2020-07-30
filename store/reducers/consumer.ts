import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConsumerState } from '../types/consumer';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}
