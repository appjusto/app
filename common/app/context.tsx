import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { AnalyticsProvider } from '@segment/analytics-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { ReactNode } from 'react';
import { Platform, UIManager } from 'react-native';
import { Provider } from 'react-redux';
import { definekeepAliveTask } from '../../business/utils/keepAlive';
import Toast from '../components/views/Toast';
import { ModalToastProvider } from '../contexts/ModalToastContext';
import { createStore } from '../store';
import Api from '../store/api/api';
import { segmentClient } from '../store/api/track';
import { getExtra } from '../utils/config';
import { getDeeplinkDomain } from '../utils/domains';
import { defineLocationUpdatesTask } from '../utils/location';
import NotificationContainer from './notifications/NotificationContainer';
import * as sentry from './sentry';

const extra = getExtra();
const { flavor } = extra;
const api = new Api(extra);
const store = createStore(extra);
const queryClient = new QueryClient();

if (flavor === 'courier') defineLocationUpdatesTask(store, api);
else if (flavor === 'business') definekeepAliveTask(store, api);

sentry.init(extra.analytics);

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
      <AnalyticsProvider client={segmentClient}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <NotificationContainer>
              <NavigationContainer linking={linking}>
                <ModalToastProvider>
                  <ActionSheetProvider>{children}</ActionSheetProvider>
                  <Toast />
                  <StatusBar style="dark" backgroundColor="#FFFFFF" />
                </ModalToastProvider>
              </NavigationContainer>
            </NotificationContainer>
          </QueryClientProvider>
        </Provider>
      </AnalyticsProvider>
    </ApiContext.Provider>
  );
};
