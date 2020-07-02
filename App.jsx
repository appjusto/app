import React from 'react';
import { View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { updateLocation } from './store/actions/location';
import { isBroadcastingLocation } from './store/selectors';
import { defineLocationUpdatesTask } from './tasks/location';
import { getEnv, isConsumerFlavor } from './store/selectors/config';
import { getAppFlavor, getExtra } from './app.config';
import { config } from './store/api';

import configReducer from './store/reducers/config';
import locationReducer from './store/reducers/location';
import courierReducer from './store/reducers/courier';

import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';
import AdminControlPainel from './screens/common/admin/AdminControlPainel';

config(getExtra().firebase);

const rootReducer = combineReducers({
  config: configReducer(getAppFlavor(), getExtra()),
  location: locationReducer,
  courier: courierReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

defineLocationUpdatesTask(({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.log('Received new locations', locations);
  const [location] = locations;
  const shouldBroadcastLocation = isBroadcastingLocation(store.getState())
  store.dispatch(updateLocation(location, shouldBroadcastLocation));
});

const App = () => {
  const isConsumer = useSelector(isConsumerFlavor);
  if (isConsumer) return <ConsumerApp />
  return <CourierApp />
}

export default function() {
  const env = getEnv(store.getState())
  const adminPainel = env === 'development' ? <AdminControlPainel /> : null;
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        {adminPainel}
        <App />
      </View>
    </Provider>
  );
}

