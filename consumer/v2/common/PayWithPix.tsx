import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import CheckField from '../../../common/components/buttons/CheckField';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import Pill from '../../../common/components/views/Pill';
import { useModalToastContext } from '../../../common/contexts/ModalToastContext';
import { IconPixLogo } from '../../../common/icons/icon-pix-logo';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';

export type PixParamList = {
  PayWithPix: {
    orderId: string;
    total: number;
    fleetId: string;
    highDemandFee: number;
  };
};
type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PixParamList, 'PayWithPix'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<PixParamList, 'PayWithPix'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const PayWithPix = ({ navigation, route }: Props) => {
  // params
  const { orderId, total, fleetId, highDemandFee } = route.params;
  //context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { showModalToast } = useModalToastContext();
  // redux store
  const consumer = useSelector(getConsumer)!;
  // state
  const order = useObserveOrder(orderId);
  const [pixKey, setPixKey] = React.useState(consumer.pix ?? '');
  const [isLoading, setLoading] = React.useState(false);
  // side-effects
  // tracking
  useSegmentScreen('PayWithPix');
  // handlers
  const toggleCPFAsPix = () => {
    if (!consumer.cpf) return;
    if (pixKey !== consumer.pix) setPixKey(consumer.cpf);
  };
  const placeOrderWithPix = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      // updating pix key
      if (pixKey !== consumer.pix) {
        await api.profile().updateProfile(consumer.id, { pix: pixKey });
      }
      await api.order().placeOrder({
        orderId,
        payment: {
          payableWith: 'pix',
          key: pixKey,
        },
        fleetId,
        highDemandFee,
      });
      track('placing order with Pix payment');
      setLoading(false);
      navigation.replace('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
        params: { orderId },
      });
    } catch (error: any) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
      showModalToast(error.toString(), 'error');
    }
  };

  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  return (
    <View style={{ ...screens.config }}>
      <PaddedView style={{ flex: 1 }}>
        <IconPixLogo />
        <Text style={{ ...texts.lg, marginTop: padding }}>{t('Informe sua chave')}</Text>
        <Text style={{ ...texts.sm, marginVertical: padding, color: colors.grey700 }}>
          {t(
            'É importante informar a sua chave para enviarmos o estorno do valor caso ocorra algum problema no pedido.'
          )}
        </Text>
        {consumer.cpf && (
          <CheckField
            checked={pixKey === consumer.cpf}
            onPress={toggleCPFAsPix}
            text={t('Usar CPF como chave')}
            style={{ marginBottom: padding }}
          />
        )}
        <DefaultInput title={t('Chave Pix')} value={pixKey} onChangeText={setPixKey} />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: padding,
          paddingRight: padding,
          // flex: 1,
          paddingBottom: 32,
        }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pill />
            <Text style={{ ...texts.md, marginLeft: 12 }}>{t('Valor total a pagar')}</Text>
          </View>
          <Text style={{ ...texts.xl }}>{formatCurrency(total)}</Text>
        </View>
        <View style={{ marginTop: padding, marginHorizontal: padding }}>
          <Text
            style={{
              ...texts.xs,
              color: colors.grey700,
              marginBottom: padding,
            }}
          >
            {t(
              'Você poderá deixar uma Caixinha de gorjeta para o/a entregador/a quando o seu pedido for entregue.'
            )}
          </Text>
          <DefaultButton
            title={t('Fazer pedido')}
            onPress={placeOrderWithPix}
            disabled={!pixKey || isLoading}
            activityIndicator={isLoading}
          />
        </View>
      </View>
    </View>
  );
};
