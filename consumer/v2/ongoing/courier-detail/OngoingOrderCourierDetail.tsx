import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import useObserveOrder from '../../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { LoggedNavigatorParamList } from '../../types';
import { OngoingOrderNavigatorParamList } from '../types';
import { OrderCourierSummary } from './OrderCourierSummary';
import { OrderFleetSummary } from './OrderFleetSummary';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderCourierDetail'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderCourierDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderCourierDetail = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params ?? {};
  //context
  const { order } = useObserveOrder(orderId);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View style={{ paddingBottom: padding }}>
        <OrderCourierSummary courier={order.courier!} />
        <SingleHeader title={t('Integrante da frota')} />
        <PaddedView>
          <OrderFleetSummary fleetId={order.fare!.fleet.id} />
        </PaddedView>
      </View>
      <View>
        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey500,
            marginBottom: padding,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: padding,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 7 }}>
            <DefaultButton
              title={t('Abrir chat')}
              onPress={() => navigation.navigate('Chat', { orderId })}
            />
          </View>
          <View style={{ marginLeft: halfPadding, flex: 7 }}>
            <DefaultButton title={t('Ligar')} onPress={() => null} secondary />
          </View>
        </View>
        <Text
          style={{
            ...texts.xs,
            color: colors.grey700,
            paddingHorizontal: padding,
            marginBottom: padding,
          }}
        >
          {t('Ao ligar, seu número será protegido e o entregador não verá seu telefone real.')}
        </Text>
      </View>
    </ScrollView>
  );
};
