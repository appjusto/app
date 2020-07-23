import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

import Api from "../store/api";
import { createStore } from '../store';
import { getExtra } from "./config";
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
  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        {children}
      </Provider>
    </ApiContext.Provider>
  );
}
