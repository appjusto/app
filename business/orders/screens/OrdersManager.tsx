import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { UnloggedParamList } from '../../../common/screens/unlogged/types';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OrdersKanbanItem } from '../components/OrdersKanbanItem';
import { OrderManagerHeader } from '../components/OrdersManagerHeader';

// TODO: add the correct screenNavigationProp
type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'OrdersManager'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'OrdersManager'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrdersManager = ({ navigation, route }: Props) => {
  // side effects
  // tracking
  useSegmentScreen('OrdersManager');
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ backgroundColor: colors.white }}>
        <PaddedView>
          <OrderManagerHeader />
        </PaddedView>
      </View>
      <View>
        <DoubleHeader title={t('Pedidos')} subtitle={t('Gerencie os pedidos do seu restaurante')} />
        {/* horizontal dispatchingStatus list. each button will render its specific orders */}
        {/* ScrollView rendering an OrdersKanbanItem mapped list according to the selected button in the list above */}
        {/* "no orders today state" */}
        {/* <View style={{ backgroundColor: colors.grey50 }}>
          <Text style={{ ...texts.sm, color: colors.grey700, textAlign: 'center' }}>
            {t('Você ainda não teve pedidos hoje')}
          </Text>
        </View> */}
      </View>
      <PaddedView>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem onCheckOrder={() => navigation.navigate('OrderDetail')} />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem onCheckOrder={() => navigation.navigate('OrderDetail')} />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem onCheckOrder={() => navigation.navigate('OrderDetail')} />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem onCheckOrder={() => navigation.navigate('OrderDetail')} />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
