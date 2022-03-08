import Constants from 'expo-constants';
import React from 'react';
import { LogBox, Platform, ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import { AppContext } from './common/app/context';
import PreloadAssets from './common/app/PreloadAssets';
import ShowIf from './common/components/views/ShowIf';
import { getFlavor } from './common/store/config/selectors';
import { getExtra } from './common/utils/config';
import ConsumerApp from './consumer/ConsumerApp';
import CourierApp from './courier/CourierApp';

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
// https://reactnative.dev/docs/debugging#console-errors-and-warnings
// https://twitter.com/rickhanlonii/status/1255185060208226306

if (__DEV__) {
  LogBox.ignoreLogs([
    'Setting a timer',
    // 'Sentry Logger [Warn]: SentryError: Native is disabled',
    'AsyncStorage has been extracted',
    'You need to add `ACCESS_BACKGROUND_LOCATION`',
  ]);
}

const App = () => {
  const flavor = useSelector(getFlavor);
  React.useEffect(() => {
    // debug only
    if (Platform.OS === 'android' && getExtra().environment !== 'live') {
      ToastAndroid.show('Testing mode ' + Constants.manifest?.revisionId ?? '', ToastAndroid.LONG);
    }
  }, []);
  return (
    <>
      <ShowIf test={flavor === 'consumer'}>{() => <ConsumerApp />}</ShowIf>
      <ShowIf test={flavor === 'courier'}>{() => <CourierApp />}</ShowIf>
    </>
  );
};

export default () => {
  return (
    <PreloadAssets>
      <AppContext>
        <App />
      </AppContext>
    </PreloadAssets>
  );
};
