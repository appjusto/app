import * as redux from 'redux';
import ReduxThunk from 'redux-thunk';

import configReducer from './reducers/config';
import courierReducer from './reducers/courier';
import consumerReducer from './reducers/consumer';
import { CourierState } from './types/courier';

export interface State {
  courier: CourierState;
}

export const createStore = (flavor: string, extra: object) => {
  const rootReducer = redux.combineReducers({
    config: configReducer({
      flavor,
      extra,
      env: __DEV__ ? 'development' : 'production',
    }),
    courier: courierReducer,
    consumer: consumerReducer,
  });

  return redux.createStore(rootReducer, redux.applyMiddleware(ReduxThunk));
}