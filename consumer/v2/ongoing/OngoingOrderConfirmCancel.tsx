import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import FeedbackView from '../../../common/components/views/FeedbackView';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { getUIBusy } from '../../../common/store/ui/selectors';
import {
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../common/styles';
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
  // app state
  const busy = useSelector(getUIBusy);
  // screen state
  const { order } = useObserveOrder(orderId);
  // const order = useObserveOrder(orderId);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  console.log(order);
  const cancellationCharge =
    order.type === 'food'
      ? order.status === 'confirmed'
      : order.dispatchingState === 'going-destination' ||
        order.dispatchingState === 'arrived-destination';
  const description = cancellationCharge
    ? t('Seu pedido já foi iniciado e algumas taxas podem ser cobradas.')
    : t('Como seu pedido ainda não foi retirado, você não será cobrado pelo cancelamento.');
  return order.status === 'confirmed' ? (
    <View style={{ ...screens.default }}>
      <FeedbackView
        header={t('Tem certeza que deseja cancelar?')}
        description={description}
        icon={<Image source={icons.coneYellow} />}
      />
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
          alignItems: 'center',
          marginBottom: padding,
          justifyContent: 'space-between',
          paddingHorizontal: padding,
        }}
      >
        <View style={{ flex: 7 }}>
          <DefaultButton
            title={t('Cancelar pedido')}
            onPress={() => navigation.navigate('OngoingOrderCancelOrder', { orderId })}
            activityIndicator={busy}
            disabled={busy}
          />
        </View>
        <View style={{ marginLeft: halfPadding, flex: 7 }}>
          <DefaultButton title={t('Não cancelar')} onPress={() => navigation.pop()} secondary />
        </View>
      </View>
    </View>
  ) : (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: doublePadding }}>
          <Image source={icons.coneYellow} />
          <Text style={{ ...texts.xl, marginTop: padding }}>{t('Aviso importante:')}</Text>
          <Text style={{ ...texts.xl, color: colors.red }}>
            {t('este cancelamento será cobrado')}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding, color: colors.grey700 }}>
            {t(
              'Recomendamos que entre em contato com o restaurante para verificar se ainda é possível cancelar sem o prejuízo dos produtos.'
            )}
          </Text>
        </View>
        <DefaultButton
          title={t('Ligar para o restaurante')}
          secondary
          onPress={() => null}
          style={{ marginTop: 24 }}
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView>
        <Text style={{ ...texts.sm }}>
          {t('Deseja confirmar o cancelamento mesmo com a cobrança dos valores do pedido?')}
        </Text>
        <View
          style={{
            marginTop: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: padding,
          }}
        >
          <View style={{ width: '48%' }}>
            <DefaultButton
              title={t('Voltar')}
              onPress={() => navigation.goBack()}
              activityIndicator={busy}
              disabled={busy}
            />
          </View>
          <View style={{ width: '48%' }}>
            <DefaultButton
              title={t('Confirmar')}
              onPress={() => navigation.navigate('OngoingOrderCancelOrder', { orderId })}
              activityIndicator={busy}
              disabled={busy}
            />
          </View>
        </View>
      </PaddedView>
    </ScrollView>
  );
};
