import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { AcceptedCreditCards } from '../../../../assets/icons/credit-card/AcceptedCreditCards';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { getCardBrand } from '../../../../common/store/api/consumer/cards/getCardBrand';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { useCards } from '../../../../common/store/api/consumer/cards/useCards';
import { useAcceptedPaymentMethods } from '../../../../common/store/api/platform/hooks/useAcceptedPaymentMethods';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { colors, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { OngoingOrderNavigatorParamList } from '../../ongoing/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

export type ProfilePaymentMethodsParamList = {
  ProfilePaymentMethods?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P' | 'OngoingOrderDeclined';
  };
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList &
    RestaurantNavigatorParamList &
    P2POrderNavigatorParamList &
    OngoingOrderNavigatorParamList,
  'ProfilePaymentMethods'
>;
type ScreenRouteProp = RouteProp<ProfilePaymentMethodsParamList, 'ProfilePaymentMethods'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const { returnScreen } = route.params ?? {};
  const cards = useCards();
  const acceptedPaymentMethods = useAcceptedPaymentMethods();
  // tracking
  useSegmentScreen('ProfilePaymentMethods');
  // UI
  if (!cards || isEmpty(acceptedPaymentMethods)) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={cards.filter((card) =>
          card.processor === 'iugu'
            ? acceptedPaymentMethods.includes('credit_card')
            : acceptedPaymentMethods.includes('vr')
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConfigItem
            title={getCardDisplayNumber(item)}
            subtitle={
              item.processor === 'iugu'
                ? `Cartão de crédito\n${getCardBrand(item)}`
                : `Vale Refeição\nVR`
            }
            onPress={() => {
              if (returnScreen) {
                navigation.navigate(returnScreen, {
                  paymentMethodId: item.id,
                  payMethod: item.processor === 'iugu' ? 'credit_card' : 'vr',
                });
              } else {
                navigation.navigate('PaymentMethodDetail', {
                  paymentData: item,
                });
              }
            }}
          />
        )}
        ListFooterComponent={() => (
          <ConfigItem
            title={t('Adicionar novo cartão de crédito ou VR')}
            subtitle={t(
              'Aceitamos as bandeiras Visa, Mastercard, Elo, Diners, VR Refeição e VR Alimentação'
            )}
            onPress={() => {
              if (returnScreen) navigation.navigate('ProfileAddCard', { returnScreen });
              else navigation.navigate('ProfileAddCard');
            }}
          >
            <AcceptedCreditCards />
          </ConfigItem>
        )}
      />
    </View>
  );
}
