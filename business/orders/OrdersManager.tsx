import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens } from '../../common/styles';
import { OrderManagerHeader } from './components/OrdersManagerHeader';

// TODO: add the correct screenNavigationProp

export const OrdersManager = () => {
  // side effects
  // tracking
  useSegmentScreen('BusinessOrders');
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.default }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ ...screens.default }}>
        <PaddedView>
          <OrderManagerHeader />
        </PaddedView>
      </View>
    </KeyboardAwareScrollView>
  );
};
