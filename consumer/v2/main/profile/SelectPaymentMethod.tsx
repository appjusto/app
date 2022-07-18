import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PaymentBoxSelector } from '../../common/order-summary/PaymentBoxSelector';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & RestaurantNavigatorParamList,
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
  // redux
  const consumer = useSelector(getConsumer);
  const cards = consumer?.paymentChannel?.methods ?? [];
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        {cards.length
          ? cards.map((card) => (
              <View style={{ marginBottom: padding }}>
                <PaymentBoxSelector
                  variant="card"
                  selected
                  onSelectPayment={() => null}
                  creditCard={card}
                />
              </View>
            ))
          : null}
        <PaymentBoxSelector variant="pix" selected onSelectPayment={() => null} />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView>
        <DefaultButton title={t('Adicionar cartão')} />
      </PaddedView>
    </ScrollView>
  );
};
