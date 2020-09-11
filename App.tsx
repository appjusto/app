import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';
import { YellowBox } from 'react-native';
import { useSelector } from 'react-redux';

import PreloadAssets from './common/app/PreloadAssets';
import { AppContext } from './common/app/context';
import ShowIf from './common/components/views/ShowIf';
import { getFlavor } from './common/store/config/selectors';
import ConsumerApp from './consumer/ConsumerApp';
import CourierApp from './courier/CourierApp';

// https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
// https://reactnative.dev/docs/debugging#console-errors-and-warnings
// https://twitter.com/rickhanlonii/status/1255185060208226306

if (__DEV__) {
  YellowBox.ignoreWarnings(['Setting a timer']);
}

const App = () => {
  const flavor = useSelector(getFlavor);
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
      {() => (
        <AppContext>
          <ActionSheetProvider>
            <App />
          </ActionSheetProvider>
        </AppContext>
      )}
    </PreloadAssets>
  );
};
