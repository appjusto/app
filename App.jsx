import React from 'react';
import { View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { defineLocationUpdatesTask } from './tasks/location';
import { updateCourierLocation } from './store/actions/courier';
import { isCourierWorking, getCourierProfile } from './store/selectors/courier';
import { getEnv, isAdminFlavor, isConsumerFlavor, isCourierFlavor } from './store/selectors/config';
import { getAppFlavor, getExtra } from './app.config';
import Api, { ApiContext } from './store/api';

import configReducer from './store/reducers/config';
import courierReducer from './store/reducers/courier';
import consumerReducer from './store/reducers/consumer';

import AdminApp from './screens/admin/AdminApp';
import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';
import AdminControlPainel from './screens/common/admin/AdminControlPainel';
import useNotificationToken from './hooks/useNotificationToken';

const api = new Api(getExtra().firebase);

const rootReducer = combineReducers({
  config: configReducer(getAppFlavor(), getExtra()),
  courier: courierReducer,
  consumer: consumerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

defineLocationUpdatesTask(({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.log('Received new locations', locations);
  const [location] = locations;
  const state = store.getState();

  const isCourier = isCourierFlavor(state);
  const courier = isCourier && getCourierProfile(state);
  const shouldBroadcastLocation = !!courier && isCourierWorking(state);
  store.dispatch(updateCourierLocation(api)(courier, location, shouldBroadcastLocation));
});

const App = () => {
  const [token, error] = useNotificationToken();
  const isAdmin = useSelector(isAdminFlavor);
  const isConsumer = useSelector(isConsumerFlavor);
  if (isAdmin) return <AdminApp token={token} />
  if (isConsumer) return <ConsumerApp />
  return <CourierApp />
}

export default function() {
  const env = getEnv(store.getState())
  const adminPainel = env === 'development' ? <AdminControlPainel /> : null;
  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        <View style={{flex: 1}}>
          {adminPainel}
          <App />
        </View>
      </Provider>
    </ApiContext.Provider>
  );
}

