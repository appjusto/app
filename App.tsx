import React from 'react';
import { View } from 'react-native';
import { Provider, useSelector } from 'react-redux';

import { createStore } from './store';
import { defineLocationUpdatesTask } from './tasks/location';
import {
  isAdminFlavor,
  isConsumerFlavor,
  isCourierFlavor,
} from './store/selectors/config';
import { getAppFlavor, getExtra } from './app.config';
import Api, { ApiContext } from './store/api';
import { APP_FLAVOR_ADMIN } from './store/constants';

import PreloadAssets from './screens/app/PreloadAssets';
import AdminApp from './screens/admin/AdminApp';
import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';
import AdminFlavorChooser from './screens/common/admin/AdminFlavorChooser';

const extra = getExtra();
const api = new Api(extra.firebase, extra.googleMapsApiKey);
const store = createStore(getAppFlavor(), extra);

defineLocationUpdatesTask(store, api);

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
console.ignoredYellowBox = ['Setting a timer'];

const App = () => {
  const isAdmin = useSelector(isAdminFlavor);
  const isConsumer = useSelector(isConsumerFlavor);
  const isCourier = useSelector(isCourierFlavor);
  
  return (
    <PreloadAssets>
      {() => (
        <>
          {getAppFlavor() === APP_FLAVOR_ADMIN && (
            <AdminFlavorChooser />
          )}
          {isAdmin && <AdminApp />}
          {isConsumer && <ConsumerApp />}
          {isCourier && <CourierApp />}
        </>
      )}
    </PreloadAssets>
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
