import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { ReactNode } from 'react';
import { Platform, UIManager } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { definekeepAliveTask } from '../../business/utils/keepAlive';
import Toast from '../components/views/Toast';
import { createStore } from '../store';
import Api from '../store/api/api';
import { getExtra } from '../utils/config';
import { getDeeplinkDomain } from '../utils/domains';
import { defineLocationUpdatesTask } from '../utils/location';
import * as analytics from './analytics';
import NotificationContainer from './notifications/NotificationContainer';

const extra = getExtra();
const api = new Api(extra);
const store = createStore(extra);
const queryClient = new QueryClient();

if (extra.flavor === 'courier') defineLocationUpdatesTask(store, api);
else if (extra.flavor === 'business') definekeepAliveTask(store, api);

analytics.init(extra.analytics);

export const ApiContext = React.createContext<Api>(api);
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export interface Props {
  children: ReactNode;
}

export const AppContext = ({ children }: Props) => {
  const linking = {
    prefixes: [`https://${getDeeplinkDomain(extra.environment)}`],
  };

  // https://reactnative.dev/docs/layoutanimation.html
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
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
              <StatusBar style="dark" backgroundColor="#FFFFFF" />
            </NavigationContainer>
          </NotificationContainer>
        </QueryClientProvider>
      </Provider>
    </ApiContext.Provider>
  );
};
