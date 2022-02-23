import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { t } from '../../../strings';
import { CookingTimeModal } from '../components/CookingTimeModal';
import { ListFilterButton } from '../components/ListFilterButton';
import { OrdersKanbanItem } from '../components/OrdersKanbanItem';
import { OrderManagerHeader } from '../components/OrdersManagerHeader';

// TODO: add the correct screenNavigationProp
type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'OrdersManager'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'OrdersManager'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrdersManager = ({ navigation, route }: Props) => {
  // screen state
  const [cookingModalVisible, setCookingModalVisible] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('OrdersManager');
  //UI
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: padding, paddingLeft: padding }}
        >
          {/* all orders */}
          <ListFilterButton
            title={t('Todos')}
            bgColor={colors.green100}
            textColor={colors.black}
            borderColor={colors.black}
            onPress={() => null}
            style={{ marginRight: halfPadding }}
          />
          {/* confirmed orders */}
          <ListFilterButton
            title={t('Pendente')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            number="2"
            numberColor={colors.white}
            numberBgColor={colors.red}
            style={{ marginRight: halfPadding }}
          />
          {/* preparing orders */}
          <ListFilterButton
            title={t('Preparação')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            number="3"
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          {/* take away orders */}
          {/* <AppButton
            title={t('Retirada')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            number="4"
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          /> */}
          {/* dispatching orders */}
          <ListFilterButton
            title={t('Despachado')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            number="4"
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          {/* delivered orders */}
          <ListFilterButton
            title={t('Concluído')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            number="4"
            numberColor={colors.black}
            style={{ marginRight: halfPadding }}
          />
          {/* canceled orders */}
          <ListFilterButton
            title={t('Todos')}
            bgColor={colors.white}
            textColor={colors.grey700}
            borderColor={colors.grey700}
            onPress={() => null}
            style={{ marginRight: 32 }}
          />
        </ScrollView>
      </View>
      <PaddedView>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem
            onCheckOrder={() =>
              navigation.navigate('OrderDetail', { orderId: 'syV7UPjOZgtyayNeTi64' })
            }
            onTakeOrder={() => setCookingModalVisible(true)}
          />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem
            onCheckOrder={() =>
              navigation.navigate('OrderDetail', { orderId: 'syV7UPjOZgtyayNeTi64' })
            }
            onTakeOrder={() => setCookingModalVisible(true)}
          />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem
            onCheckOrder={() =>
              navigation.navigate('OrderDetail', { orderId: 'syV7UPjOZgtyayNeTi64' })
            }
            onTakeOrder={() => setCookingModalVisible(true)}
          />
        </View>
        <View style={{ marginBottom: padding }}>
          <OrdersKanbanItem
            onCheckOrder={() =>
              navigation.navigate('OrderDetail', { orderId: 'syV7UPjOZgtyayNeTi64' })
            }
            onTakeOrder={() => setCookingModalVisible(true)}
          />
        </View>
      </PaddedView>
      <CookingTimeModal
        buttonTitle={t('Confirmar e aceitar pedido')}
        modalVisible={cookingModalVisible}
        onModalClose={() => setCookingModalVisible(false)}
        onConfirmOrder={
          // confirmOrder after setting cooking time
          // close modal
          () => setCookingModalVisible(false)
        }
      />
    </KeyboardAwareScrollView>
  );
};
