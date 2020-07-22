import React from 'react';
import { View, YellowBox, ToastAndroid, Platform } from 'react-native';
import { Provider, useSelector } from 'react-redux';

import { createStore } from './store';
import { defineLocationUpdatesTask } from './tasks/location';
import { getFlavor } from './store/selectors/config';
import { getAppFlavor, getExtra } from './app.config';
import Api, { ApiContext } from './store/api';

import PreloadAssets from './screens/app/PreloadAssets';
import AdminApp from './screens/admin/AdminApp';
import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';
import ShowIf from './screens/common/ShowIf';

const extra = getExtra();
const api = new Api(extra.firebase, extra.googleMapsApiKey);
const store = createStore(getAppFlavor(), extra);

defineLocationUpdatesTask(store, api);

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
// https://reactnative.dev/docs/debugging#console-errors-and-warnings
// https://twitter.com/rickhanlonii/status/1255185060208226306

if (__DEV__) {
  YellowBox.ignoreWarnings(['Setting a timer']);
  if (Platform.OS === 'android') ToastAndroid.show(getAppFlavor(), ToastAndroid.LONG);
}

const App = () => {
  const flavor = useSelector(getFlavor);
  
  return (
    <PreloadAssets>
      {() => (
        <>
          <ShowIf test={flavor === 'admin'}>
            {() => <AdminApp />}
          </ShowIf>

          <ShowIf test={flavor === 'consumer'}>
            {() => <ConsumerApp />}
          </ShowIf>

          <ShowIf test={flavor === 'courier'}>
            {() => <CourierApp />}
          </ShowIf>
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
