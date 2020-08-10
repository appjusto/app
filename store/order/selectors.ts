import { State } from '..';
import { OrderState, Order } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrders = (state: State): Order[] => getOrderState(state).orders;
