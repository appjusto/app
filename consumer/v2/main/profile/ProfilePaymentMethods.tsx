import { PayableWith } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { AcceptedCreditCards } from '../../../../assets/icons/credit-card/AcceptedCreditCards';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { getCardBrand } from '../../../../common/store/api/consumer/cards/getCardBrand';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { getCardType } from '../../../../common/store/api/consumer/cards/getCardType';
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
  const vrEnabled =
    acceptedPaymentMethods.includes('vr-alimentação') ||
    acceptedPaymentMethods.includes('vr-refeição');
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
  const acceptedCards = cards.filter((card) => {
    if (card.type) return acceptedPaymentMethods.includes(card.type as PayableWith);
    else if (card.processor === 'iugu') return acceptedPaymentMethods.includes('credit_card');
  });
  console.log('cards', cards);
  console.log('acceptedCards', acceptedCards);
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={acceptedCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConfigItem
            title={getCardDisplayNumber(item)}
            subtitle={`${getCardType(item)}\n${getCardBrand(item)}`}
            onPress={() => {
              if (returnScreen) {
                navigation.navigate(returnScreen, {
                  paymentMethodId: item.id,
                  payMethod: item.type as PayableWith,
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
          <View>
            <ConfigItem
              title={t('Adicionar cartão de crédito')}
              subtitle={t('Aceitamos as bandeiras Visa, Mastercard, Elo e Diners')}
              onPress={() => {
                if (returnScreen) {
                  navigation.navigate('ProfileAddCard', { returnScreen, types: ['credit_card'] });
                } else {
                  navigation.navigate('ProfileAddCard', { types: ['credit_card'] });
                }
              }}
            >
              <AcceptedCreditCards types={['credit_card']} />
            </ConfigItem>
            {vrEnabled ? (
              <ConfigItem
                title={t('Adicionar cartão VR')}
                subtitle={t('Aceitamos os cartões VR Refeição e VR Alimentação')}
                onPress={() => {
                  if (returnScreen) {
                    navigation.navigate('ProfileAddCard', {
                      returnScreen,
                      types: ['vr-alimentação', 'vr-refeição'],
                    });
                  } else {
                    navigation.navigate('ProfileAddCard', {
                      types: ['vr-alimentação', 'vr-refeição'],
                    });
                  }
                }}
              >
                <AcceptedCreditCards types={['vr-alimentação', 'vr-refeição']} />
              </ConfigItem>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
