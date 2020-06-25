import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import locationReducer from './store/reducers/location';
import { updateLocation } from './store/actions/location';
import { defineLocationUpdatesTask } from './tasks/location';
import Home from './screens/home/Home';

const rootReducer = combineReducers({
  location: locationReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

defineLocationUpdatesTask(({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.log('Received new locations', locations);
  const [location] = locations;
  store.dispatch(updateLocation(location));
});

export default function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

