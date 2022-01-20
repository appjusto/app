import React from 'react';
import { Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';

// TODO: add the correct screenNavigationProp

export const BusinessOrders = () => {
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
      <PaddedView style={{ ...screens.centered }}>
        <Text style={{ ...texts.xl }}>{t('Tela de pedidos')}</Text>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
