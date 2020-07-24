import { AnyAction } from 'redux';
import { ConsumerState } from '../types/consumer';
import * as actionTypes from '../actionTypes';

const initialState: ConsumerState = {
  consumer: {
    id: 'consumer-1',
  },
  ongoingOrders: null,
};

export default function (state:ConsumerState = initialState, action: AnyAction) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_LOCATION: {
      return { ...state, courier: { ...state.consumer, location: payload.coords } };
    }    
    default:
      return state;
  }
  
}
