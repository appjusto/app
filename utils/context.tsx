import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

import Toast from '../screens/common/Toast';
import { createStore } from '../store';
import Api from '../store/api';
import { getExtra } from './config';
import { defineLocationUpdatesTask } from './location';

const extra = getExtra();
export const api = new Api(extra);
export const store = createStore(extra);
export const ApiContext = React.createContext<Api>(api);

defineLocationUpdatesTask(store, api);

export interface Props {
  children: ReactNode;
}

export const AppContext = ({ children }: Props) => {
  const linking = {
    prefixes: [Linking.makeUrl('/'), 'https://link.appjusto.com.br'],
  };

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

export type AppDispatch = typeof store.dispatch;
