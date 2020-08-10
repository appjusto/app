import { AnyAction } from 'redux';

import { ORDERS_UPDATED } from './actions';
import { OrderState } from './types';

const initialState: OrderState = {
  orders: [],
};

export default function (state: OrderState = initialState, action: AnyAction): OrderState {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_UPDATED: {
      return { ...state, orders: payload };
    }
    default:
      return state;
  }
}
