import { VRPayableWith } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { PayableWith } from '../../../../../types';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { useCards } from '../../../../common/store/api/consumer/cards/useCards';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useAcceptedPaymentMethods } from '../../../../common/store/api/platform/hooks/useAcceptedPaymentMethods';
import { colors, screens } from '../../../../common/styles';
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
  const acceptedPaymentMethods = useAcceptedPaymentMethods();
  const pixEnabled = acceptedPaymentMethods.includes('pix');
  const creditEnabled = acceptedPaymentMethods.includes('credit_card');
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const acceptedCards = (cards ?? []).filter(
    (card) =>
      (card.processor === 'iugu' && creditEnabled) ||
      (card.processor === 'vr' && acceptedPaymentMethods.includes(card.type as VRPayableWith))
  );
  const cardList = acceptedCards.map((card) => (
    <View key={card.id}>
      <PaymentBoxSelector
        variant={card.type as PayableWith}
        selected={
          card.id === selectedPaymentMethodId &&
          (payMethod === 'credit_card' ||
            payMethod === 'vr-alimentação' ||
            payMethod === 'vr-refeição')
        }
        onSelectPayment={() => {
          navigation.navigate(returnScreen, {
            paymentMethodId: card.id,
            payMethod: card.type ? (card.type as PayableWith) : 'credit_card',
          });
        }}
        card={card}
      />
    </View>
  ));
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        {cardList}

        {pixEnabled ? (
          <PaymentBoxSelector
            variant="pix"
            selected={payMethod === 'pix'}
            onSelectPayment={() => navigation.navigate(returnScreen, { payMethod: 'pix' })}
          />
        ) : null}

        <PaymentBoxSelector
          variant="credit_card"
          selected={false}
          onSelectPayment={() =>
            navigation.navigate('ProfileAddCard', { returnScreen, types: ['credit_card'] })
          }
        />
        {acceptedPaymentMethods.includes('vr-alimentação') ? (
          <PaymentBoxSelector
            variant="vr-alimentação"
            selected={false}
            onSelectPayment={() =>
              navigation.navigate('ProfileAddCard', { returnScreen, types: ['vr-alimentação'] })
            }
          />
        ) : null}
        {acceptedPaymentMethods.includes('vr-refeição') ? (
          <PaymentBoxSelector
            variant="vr-refeição"
            selected={false}
            onSelectPayment={() =>
              navigation.navigate('ProfileAddCard', { returnScreen, types: ['vr-refeição'] })
            }
          />
        ) : null}
      </PaddedView>
    </ScrollView>
  );
};
