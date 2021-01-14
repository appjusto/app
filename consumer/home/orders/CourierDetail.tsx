import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';
import OrderFleetCard from './OrderFleetCard';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CourierDetail'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'CourierDetail'>;

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
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  const tallerDevice = useTallerDevice();
  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View>
        <PaddedView style={{ ...screens.default }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <View>
              <RoundedProfileImg flavor="courier" id={order.courier!.id} />
            </View>
            <View style={{ marginLeft: tallerDevice ? 24 : 12 }}>
              <Text style={{ ...texts.medium }}>{order.courier?.name}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 8 }}>
                {t('No appJusto desde')}
              </Text>
              <Text style={{ ...texts.small }}>
                {formatDate(
                  (order.courier!.joined as firebase.firestore.Timestamp).toDate(),
                  'monthYear'
                )}
              </Text>
            </View>
          </View>
          <DefaultButton
            title={t('Iniciar um chat com o entregador')}
            style={{ marginBottom: 8 }}
            onPress={() => navigation.navigate('Chat', { orderId })}
          />
          {/* <DefaultButton
            title={t('Relatar um problema')}
            onPress={() => {}}
            style={{ ...borders.default, borderColor: colors.darkGrey, backgroundColor: colors.darkGrey }}
          /> */}
          <DefaultButton
            title={t('Cancelar pedido')}
            onPress={() => navigation.navigate('ConfirmCancelOrder', { orderId })}
            secondary
          />
        </PaddedView>
        <HR height={8} />
        <View style={{ paddingVertical: padding }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <Pill />
            <Text style={{ ...texts.medium, ...texts.bold, marginLeft: 12 }}>
              {t('Mais informações')}
            </Text>
          </View>
          <View style={{ marginTop: 12, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Entregas realizadas perfeitamente')}
            </Text>
            <Text style={{ ...texts.medium }}>{order.courier?.statistics?.deliveries ?? 0}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Entregas canceladas')}
            </Text>
            <Text style={{ ...texts.medium }}>{order.courier?.statistics?.canceled ?? 0}</Text>
          </View>
          <PaddedView>
            <Text style={{ ...texts.small, color: colors.darkGrey, marginVertical: 8 }}>
              {t('Integrante da frota')}
            </Text>
            <OrderFleetCard fleetId={order.fare?.fleet.id} />
          </PaddedView>
        </View>
      </View>
    </ScrollView>
  );
}
