import * as redux from 'redux';
import ReduxThunk, { ThunkDispatch } from 'redux-thunk';

import configReducer from './reducers/config';
import consumerReducer from './reducers/consumer';
import courierReducer from './reducers/courier';
import uiReducer from './reducers/ui';
import userReducer from './reducers/user';
import { ConfigState } from './types/config';
import { ConsumerState } from './types/consumer';
import { CourierState } from './types/courier';
import { UIState } from './types/ui';
import { UserState } from './types/user';

export interface State {
  config: ConfigState;
  courier: CourierState;
  consumer: ConsumerState;
  user: UserState;
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
    user: userReducer,
    ui: uiReducer,
  });
  type StateType = typeof rootReducer;
  type DispatchFunctionType = ThunkDispatch<StateType, undefined, redux.AnyAction>;
  return redux.createStore(
    rootReducer,
    redux.applyMiddleware<DispatchFunctionType, StateType>(ReduxThunk)
  );
};
