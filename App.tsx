import React from 'react';
import { View, YellowBox } from 'react-native';
import { useSelector } from 'react-redux';

import PreloadAssets from './screens/app/PreloadAssets';
import { AppContext } from './screens/app/context';
import ShowIf from './screens/common/ShowIf';
import ConsumerApp from './screens/consumer/ConsumerApp';
import CourierApp from './screens/courier/CourierApp';
import { getFlavor } from './store/config/selectors';

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
// https://reactnative.dev/docs/debugging#console-errors-and-warnings
// https://twitter.com/rickhanlonii/status/1255185060208226306

if (__DEV__) {
  YellowBox.ignoreWarnings(['Setting a timer']);
}

const App = () => {
  const flavor = useSelector(getFlavor);
  return (
    <PreloadAssets>
      {() => (
        <View style={{ flex: 1 }}>
          <ShowIf test={flavor === 'consumer'}>{() => <ConsumerApp />}</ShowIf>

          <ShowIf test={flavor === 'courier'}>{() => <CourierApp />}</ShowIf>
        </View>
      )}
    </PreloadAssets>
  );
};

export default () => {
  return (
    <AppContext>
      <App />
    </AppContext>
  );
};
