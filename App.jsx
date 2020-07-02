import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { getAppFlavor } from './app.config';
import locationReducer from './store/reducers/location';
import { updateLocation } from './store/actions/location';
import { isBroadcastingLocation } from './store/selectors/location';
import { defineLocationUpdatesTask } from './tasks/location';

import AdminApp from './screens/admin/AdminApp';
import CourierApp from './screens/courier/CourierApp';
import ConsumerApp from './screens/consumer/ConsumerApp';

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
  const broadcastLocation = isBroadcastingLocation(store.getState())
  store.dispatch(updateLocation(location, broadcastLocation));
});

const App = () => {
  const flavor = getAppFlavor();
  if (flavor === 'admin') return <AdminApp />
  if (flavor === 'courier') return <CourierApp />
  if (flavor === 'consumer') return <ConsumerApp />
}

export default function() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

