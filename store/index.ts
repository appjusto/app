import * as redux from 'redux';
import ReduxThunk, { ThunkDispatch } from 'redux-thunk';

import configReducer from './config/reducer';
import { ConfigState } from './config/types';
import consumerReducer from './consumer/reducer';
import { ConsumerState } from './consumer/types';
import courierReducer from './courier/reducer';
import { CourierState } from './courier/types';
import userReducer from './reducers/user';
import { UserState } from './types/user';
import uiReducer from './ui/reducers';
import { UIState } from './ui/types';

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
