import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { useCards } from '../../../../common/store/api/consumer/cards/useCards';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useP2PPix } from '../../../../common/store/api/order/ui/useP2PPix';
import { colors, padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PaymentBoxSelector } from '../../common/order-summary/PaymentBoxSelector';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & RestaurantNavigatorParamList & P2POrderNavigatorParamList,
  // we might need this later
  //  & OngoingOrderNavigatorParamList
  'SelectPaymentMethod'
>;
type ScreenRouteProp = RouteProp<
  ProfileParamList & RestaurantNavigatorParamList,
  'SelectPaymentMethod'
>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectPaymentMethod = ({ navigation, route }: Props) => {
  // params
  const { selectedPaymentMethodId, payMethod, orderId, returnScreen } = route.params ?? {};
  // context
  const order = useObserveOrder(orderId);
  // state
  const cards = useCards();
  const payableWithPix = useIsPixEnabled();
  const p2pPayableWithPix = useP2PPix();
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        {cards?.length ? (
          cards.map((card) => (
            <View style={{ marginBottom: padding }} key={card.id}>
              <PaymentBoxSelector
                variant="card"
                selected={card.id === selectedPaymentMethodId}
                onSelectPayment={() => {
                  navigation.navigate(returnScreen, {
                    paymentMethodId: card.id,
                    payMethod: card.processor === 'iugu' ? 'credit_card' : 'vr',
                  });
                }}
                creditCard={card}
              />
            </View>
          ))
        ) : (
          <View style={{ marginBottom: padding }}>
            <PaymentBoxSelector
              variant="card"
              selected={false}
              onSelectPayment={() => navigation.navigate('ProfileAddCard', { returnScreen })}
            />
          </View>
        )}
        {payableWithPix || p2pPayableWithPix ? (
          <PaymentBoxSelector
            variant="pix"
            selected={payMethod === 'pix'}
            onSelectPayment={() => navigation.navigate(returnScreen, { payMethod: 'pix' })}
          />
        ) : null}
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView>
        <DefaultButton
          title={t('Adicionar cartão')}
          onPress={() => navigation.navigate('ProfileAddCard', { returnScreen })}
        />
      </PaddedView>
    </ScrollView>
  );
};
