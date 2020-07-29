import * as redux from 'redux';
import ReduxThunk from 'redux-thunk';

import configReducer from './reducers/config';
import consumerReducer from './reducers/consumer';
import courierReducer from './reducers/courier';
import uiReducer from './reducers/ui';
import { ConfigState } from './types/config';
import { ConsumerState } from './types/consumer';
import { CourierState } from './types/courier';
import { UIState } from './types/ui';

export interface State {
  config: ConfigState;
  courier: CourierState;
  consumer: ConsumerState;
  ui: UIState;
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
    ui: uiReducer,
  });

  return redux.createStore(rootReducer, redux.applyMiddleware(ReduxThunk));
};
