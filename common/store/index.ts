import * as redux from 'redux';
import ReduxThunk, { ThunkDispatch } from 'redux-thunk';
import { Extra } from '../../config/types';
import { BusinessState } from './business/types';
import configReducer from './config/reducer';
import { ConfigState } from './config/types';
import consumerReducer from './consumer/reducer';
import { ConsumerState } from './consumer/types';
import courierReducer from './courier/reducer';
import { CourierState } from './courier/types';
import orderReducer from './order/reducer';
import { OrderState } from './order/types';
import uiReducer from './ui/reducers';
import { UIState } from './ui/types';
import userReducer from './user/reducer';
import { UserState } from './user/types';

export interface State {
  config: ConfigState;
  courier: CourierState;
  consumer: ConsumerState;
  business: BusinessState;
  order: OrderState;
  user: UserState;
  ui: UIState;
}

export const createStore = (extra: Extra) => {
  const rootReducer = redux.combineReducers({
    config: configReducer({
      flavor: extra.flavor,
      extra,
    }),
    courier: courierReducer,
    consumer: consumerReducer,
    order: orderReducer,
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
