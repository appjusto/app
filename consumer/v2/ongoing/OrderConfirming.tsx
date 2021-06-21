import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode } from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import FeedbackView from '../../../common/components/views/FeedbackView';
import Pill from '../../../common/components/views/Pill';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { IconPixLogo } from '../../../common/icons/icon-pix-logo';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirming'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirming'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderConfirming = ({ navigation, route }: Props) => {
  // params
  const { orderId, pixKey, total } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  // side effects
  React.useEffect(() => {
    if (!order) return;
    console.log('OrderConfirming', order.status);
    if (order.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
      // just p2p for now
    } else if (order.status === 'confirmed') {
      navigation.replace('OngoingOrder', {
        orderId,
      });
    } else if (order.status === 'declined') {
      navigation.replace('OngoingOrderDeclined', { orderId });
    } else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    }
  }, [navigation, order, orderId]);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const description = t('Aguarde enquanto criamos seu pedido...');
  return pixKey ? (
    <SafeAreaView style={{ ...screens.default }}>
      <PaddedView>
        <IconPixLogo />
        <Text style={{ ...texts.lg, marginTop: 24 }}>{t('Efetue o pagamento da sua fatura')}</Text>
        <Text style={{ ...texts.sm, marginVertical: padding, color: colors.grey700 }}>
          {t(
            'Se você vai pagar com este mesmo dispositivo clique no botão "Copiar chave de pagamento".'
          )}
        </Text>
        <Text style={{ ...texts.sm, marginBottom: padding, color: colors.grey700 }}>
          {t(
            'Depois, acesse o aplicativo do seu banco ou instituição financeira na seção Pix e procure a função "Pix Copia e Cola".'
          )}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ width: '49%' }}>
            <Image source={QrCode} />
          </View>
          <View style={{ width: '49%' }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t(
                'Você ou outra pessoa também podem efetuar o pagamento através do QR Code ao lado'
              )}
            </Text>
          </View>
        </View>
        <DefaultButton
          title={t('Copiar chave de pagamento')}
          style={{ marginTop: padding }}
          onPress={() => null}
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, marginBottom: padding }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: padding,
            marginBottom: padding,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pill color={colors.yellow} />
            <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>
              {t('Aguardando pagamento')}
            </Text>
          </View>
          <Text style={{ ...texts.xl }}>{formatCurrency(total!)}</Text>
        </View>
        <Text style={{ ...texts.xs, color: colors.grey700, paddingHorizontal: padding }}>
          {t(
            'Identificaremos o pagamento assim que ele for realizado e daremos continuidade ao seu pedido.'
          )}
        </Text>
        <DefaultButton
          title={t('Cancelar pedido')}
          secondary
          style={{ marginHorizontal: padding, marginTop: 24 }}
          onPress={() =>
            navigation.navigate('OngoingOrderCancelOrder', { orderId, acknowledgedCosts: 0 })
          }
        />
      </View>
    </SafeAreaView>
  ) : (
    <FeedbackView
      header={t('Pedido em andamento')}
      description={description}
      icon={<IconMotocycle />}
      background={colors.white}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
        onPress={() => navigation.navigate('OngoingOrderConfirmCancel', { orderId })}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      {order.type === 'p2p' && (
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
        />
      )}
    </FeedbackView>
  );
};
