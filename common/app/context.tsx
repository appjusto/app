import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { ReactNode } from 'react';
import { Platform, ToastAndroid, UIManager } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import Toast from '../components/views/Toast';
import { createStore } from '../store';
import Api from '../store/api/api';
import { getExtra } from '../utils/config';
import { defineLocationUpdatesTask } from '../utils/location';
import * as analytics from './analytics';
import NotificationContainer from './NotificationContainer';

const extra = getExtra();
const api = new Api(extra);
const store = createStore(extra);
const queryClient = new QueryClient();

defineLocationUpdatesTask(store, api);
analytics.init(extra.analytics);

export const ApiContext = React.createContext<Api>(api);
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export interface Props {
  children: ReactNode;
}

export const AppContext = ({ children }: Props) => {
  const { environment } = extra;
  const linking = {
    prefixes: [`https://${environment}.deeplink.appjusto.com.br`],
  };

  // https://reactnative.dev/docs/layoutanimation.html
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // debug only
  if (Platform.OS === 'android' && extra.environment !== 'live') {
    ToastAndroid.show('Testing mode ' + Constants.manifest.revisionId ?? '', ToastAndroid.LONG);
  }

  // UI
  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <NotificationContainer>
            <NavigationContainer linking={linking}>
              <ActionSheetProvider>{children}</ActionSheetProvider>
              <Toast />
            </NavigationContainer>
          </NotificationContainer>
        </QueryClientProvider>
      </Provider>
    </ApiContext.Provider>
  );
};
