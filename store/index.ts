import * as redux from 'redux';
import ReduxThunk from 'redux-thunk';

import configReducer from './reducers/config';
import consumerReducer from './reducers/consumer';
import courierReducer from './reducers/courier';
import { ConfigState } from './types/config';
import { ConsumerState } from './types/consumer';
import { CourierState } from './types/courier';

export interface State {
  config: ConfigState;
  courier: CourierState;
  consumer: ConsumerState;
}

export const createStore = (extra: object) => {
  const rootReducer = redux.combineReducers({
    config: configReducer({
      flavor: extra.flavor,
      extra,
      env: __DEV__ ? 'development' : 'production',
    }),
    courier: courierReducer,
    consumer: consumerReducer,
  });

  return redux.createStore(rootReducer, redux.applyMiddleware(ReduxThunk));
};
