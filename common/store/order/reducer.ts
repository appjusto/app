import { normalize } from 'normalizr';
import { AnyAction } from 'redux';
import { USER_AUTH_STATE_CHANGED } from '../user/actions';
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
    case USER_AUTH_STATE_CHANGED: {
      if (!payload) {
        return { ...state, orders: [] };
      }
      return state;
    }
    default:
      return state;
  }
}
