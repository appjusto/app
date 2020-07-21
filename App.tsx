import React, { useState } from 'react';
import { View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import ReduxThunk from 'redux-thunk';

import { defineLocationUpdatesTask } from './tasks/location';
import { updateCourierLocation } from './store/actions/courier';
import { setLocation } from './store/actions/location';
import { isCourierWorking, getCourierProfile } from './store/selectors/courier';
import {
  isAdminFlavor,
  isConsumerFlavor,
  isCourierFlavor,
} from './store/selectors/config';
import { getAppFlavor, getExtra } from './app.config';
import Api, { ApiContext } from './store/api';
import { APP_FLAVOR_ADMIN } from './store/constants';

import configReducer from './store/reducers/config';
import courierReducer from './store/reducers/courier';
import consumerReducer from './store/reducers/consumer';

import AdminApp from './screens/admin/AdminApp';
import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';
import AdminFlavorChooser from './screens/common/admin/AdminFlavorChooser';

import fonts from './assets/fonts';
import icons from './assets/icons';
import { Courier } from './store/types';

const extra = getExtra();
const api = new Api(extra.firebase, extra.googleMapsApiKey);

const rootReducer = combineReducers({
  config: configReducer(getAppFlavor(), extra),
  courier: courierReducer,
  consumer: consumerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

defineLocationUpdatesTask(({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  const [location] = locations;

  const state = store.getState();
  store.dispatch(setLocation(location));

  const isCourier = isCourierFlavor(state);
  if (isCourier) {
    const courier = getCourierProfile(state) as Courier;
    const shouldBroadcastLocation = !!courier && isCourierWorking(state);
    if (shouldBroadcastLocation)
      store.dispatch(updateCourierLocation(api)(courier.id, location));
  }
});

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
console.ignoredYellowBox = ['Setting a timer'];

const App = () => {
  const isAdmin = useSelector(isAdminFlavor);
  const isConsumer = useSelector(isConsumerFlavor);
  const isCourier = useSelector(isCourierFlavor);
  const fetchFonts = () => Font.loadAsync(fonts);
  const fetchAssets = () => Asset.loadAsync(icons);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  if (!assetsLoaded) {
    return (
      <AppLoading
        startAsync={() => Promise.all([fetchAssets(), fetchFonts()])}
        onFinish={() => {
          setAssetsLoaded(true);
        }}
      />
    );
  }
  return (
    <>
      {getAppFlavor() === APP_FLAVOR_ADMIN && (
        <AdminFlavorChooser />
      )}
      {isAdmin && <AdminApp token={token} />}
      {isConsumer && <ConsumerApp />}
      {isCourier && <CourierApp />}
    </>
  );
};

export default function () {
  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <App />
        </View>
      </Provider>
    </ApiContext.Provider>
  );
}
