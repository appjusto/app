import { NavigationContainer } from '@react-navigation/native';
// import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React, { ReactNode } from 'react';
// import { Platform, ToastAndroid } from 'react-native';
import { Provider } from 'react-redux';

import { createStore } from '../../store';
import Api from '../../store/api/api';
import { getExtra } from '../../utils/config';
import { defineLocationUpdatesTask } from '../../utils/location';
import Toast from '../common/Toast';
import * as analytics from './analytics';
import { Platform, UIManager } from 'react-native';

const extra = getExtra();
const api = new Api(extra);
const store = createStore(extra);

defineLocationUpdatesTask(store, api);
analytics.init(extra.analytics);

export const ApiContext = React.createContext<Api>(api);
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export interface Props {
  children: ReactNode;
}

export const AppContext = ({ children }: Props) => {
  const path = extra.flavor;
  const linking = {
    prefixes: [Linking.makeUrl(path), `https://deeplink.appjusto.com.br`],
  };

  // https://reactnative.dev/docs/layoutanimation.html
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // debug only
  // const log = { l: linking, r: Constants.manifest.revisionId ?? '' };
  // if (Platform.OS === 'android') {
  //   ToastAndroid.show(JSON.stringify(log), ToastAndroid.LONG);
  // }

  // UI
  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        <NavigationContainer linking={linking}>
          {children}
          <Toast />
        </NavigationContainer>
      </Provider>
    </ApiContext.Provider>
  );
};
