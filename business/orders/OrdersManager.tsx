import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../common/components/containers/PaddedView';
import DoubleHeader from '../../common/components/texts/DoubleHeader';
import { useSegmentScreen } from '../../common/store/api/track';
import { colors, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { OrderManagerHeader } from './components/OrdersManagerHeader';

// TODO: add the correct screenNavigationProp

export const OrdersManager = () => {
  // side effects
  // tracking
  useSegmentScreen('OrdersManager');
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
      <View>
        <PaddedView>
          <OrderManagerHeader />
        </PaddedView>
      </View>
      <View style={{ ...screens.config }}>
        <DoubleHeader title={t('Pedidos')} subtitle={t('Gerencie os pedidos do seu restaurante')} />
        {/* horizontal dispatchingStatus list. each button will render its specific orders */}
        {/* ScrollView rendering an OrdersKanbanItem mapped list according to the selected button in the list above */}
        {/* "no orders today state" */}
        <View style={{ ...screens.centered }}>
          <Text style={{ ...texts.sm, color: colors.grey700, textAlign: 'center' }}>
            {t('Você ainda não teve pedidos hoje')}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
