import { normalize } from 'normalizr';
import { AnyAction } from 'redux';
import { ORDERS_UPDATED } from './actions';
import * as schema from './schema';
import { OrderState } from './types';

const initialState: OrderState = {
  orders: [],
  ordersById: {},
};

export default function (state: OrderState = initialState, action: AnyAction): OrderState {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_UPDATED: {
      const ordersById = normalize(payload, [schema.order]).entities.orders ?? {};
      return { ...state, orders: payload, ordersById };
    }
    default:
      return state;
  }
}
