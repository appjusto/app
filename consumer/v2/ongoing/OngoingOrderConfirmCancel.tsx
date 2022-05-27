import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { phoneFormatter } from '../../../common/components/inputs/pattern-input/formatters';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveBusiness } from '../../../common/store/api/business/hooks/useObserveBusiness';
import { useGetCancellationInfo } from '../../../common/store/api/order/hooks/useGetCancellationInfo';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirmCancel'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirmCancel'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderConfirmCancel = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  //  state
  const order = useObserveOrder(orderId);
  const cancellationInfo = useGetCancellationInfo(orderId);
  const business = useObserveBusiness(order?.business?.id);
  // handlers
  const cancelOrderHandler = React.useCallback(() => {
    navigation.replace('OngoingOrderCancelOrder', {
      orderId,
      acknowledgedCosts: cancellationInfo!.costs,
      issueType:
        order?.type === 'food'
          ? 'consumer-cancel-food-with-payment'
          : 'consumer-cancel-p2p-with-payment',
    });
  }, [navigation, orderId, cancellationInfo, order]);
  // side effects
  React.useEffect(() => {
    if (cancellationInfo?.costs === 0) cancelOrderHandler();
  }, [cancelOrderHandler, cancellationInfo]);
  // tracking
  useSegmentScreen('OngoingOrderConfirmCancel');
  //helpers
  const businessPhone = phoneFormatter(
    business?.phones?.find(({ type }) => type === 'desk')?.number
  );
  // UI
  if (!order || !cancellationInfo || cancellationInfo.costs === 0) {
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }} />
      <PaddedView style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: doublePadding }}>
          <IconConeYellow />
          <Text style={{ ...texts.xl, marginTop: padding }}>{t('Aviso importante:')}</Text>
          <Text style={{ ...texts.xl, color: colors.red, textAlign: 'center' }}>
            {`${t('O valor de')} ${formatCurrency(cancellationInfo.costs)} não será reembolsado.`}
          </Text>
        </View>
        {order.type === 'food' ? (
          <View>
            <Text
              style={{
                ...texts.sm,
                marginTop: padding,
                color: colors.grey700,
                textAlign: 'center',
              }}
            >
              {t(
                'Recomendamos que entre em contato com o restaurante para verificar se ainda é possível cancelar sem o prejuízo dos produtos.'
              )}
            </Text>
            {businessPhone ? (
              <DefaultButton
                title={t('Ligar para o restaurante')}
                secondary
                onPress={() => {
                  track('calling restaurant');
                  Linking.openURL(`tel:${businessPhone}`);
                }}
                style={{ marginTop: 24 }}
              />
            ) : null}
          </View>
        ) : null}
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView>
        <Text style={{ ...texts.sm, textAlign: 'center' }}>
          {t('Deseja confirmar o cancelamento mesmo com a cobrança dos valores do pedido?')}
        </Text>
        <View
          style={{
            marginTop: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: padding,
          }}
        >
          <View style={{ width: '48%' }}>
            <DefaultButton
              title={t('Voltar')}
              onPress={() => {
                navigation.goBack();
              }}
              grey
            />
          </View>
          <View style={{ width: '48%' }}>
            <DefaultButton title={t('Confirmar')} onPress={cancelOrderHandler} />
          </View>
        </View>
      </PaddedView>
    </ScrollView>
  );
};
