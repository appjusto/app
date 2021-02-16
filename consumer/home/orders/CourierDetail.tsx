import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import HR from '../../../common/components/views/HR';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import SingleHeader from '../restaurants/SingleHeader';
import OrderFleetCard from './OrderFleetCard';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'CourierDetail'>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'CourierDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
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
  const tallerDevice = useTallerDevice();
  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View style={{ ...screens.default, paddingBottom: halfPadding }}>
        <SingleHeader title={t('Sobre o pedido')} />
        <View style={{ paddingHorizontal: padding, marginTop: padding }}>
          <DefaultButton
            title={t('Alterar a rota de retirada ou entrega')}
            style={{ marginBottom: 8, flex: 2 }}
            onPress={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ flex: 7 }}>
              <DefaultButton
                title={t('Relatar um problema')}
                onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
                secondary
              />
            </View>
            <View style={{ flex: 7 }}>
              <DefaultButton
                title={t('Cancelar pedido')}
                onPress={() => navigation.navigate('ConfirmCancelOrder', { orderId })}
                secondary
                style={{ marginLeft: halfPadding }}
              />
            </View>
          </View>
        </View>
      </View>
      <HR height={8} />
      <View style={{ paddingBottom: padding }}>
        <SingleHeader title={t('Sobre o entregador')} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: padding,
            paddingHorizontal: padding,
          }}
        >
          <View>
            <RoundedProfileImg flavor="courier" id={order.courier!.id} />
          </View>
          <View style={{ marginLeft: tallerDevice ? 24 : 12 }}>
            <Text style={{ ...texts.md }}>{order.courier?.name}</Text>
            <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 8 }}>
              {t('No appJusto desde')}
            </Text>
            <Text style={{ ...texts.xs }}>
              {formatDate(
                (order.courier!.joined as firebase.firestore.Timestamp).toDate(),
                'monthYear'
              )}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 12, alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('Entregas realizadas perfeitamente')}
          </Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.deliveries ?? 0}</Text>
        </View>
        <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Entregas canceladas')}</Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.canceled ?? 0}</Text>
        </View>
        <SingleHeader title={t('Integrante da frota')} />
        <PaddedView>
          <OrderFleetCard fleet={order.fare!.fleet} />
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
}
